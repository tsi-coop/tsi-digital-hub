package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.framework.*;
import org.tsicoop.digitalhub.common.Constants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.time.LocalDate;
import java.util.concurrent.ConcurrentHashMap; // For thread-safe map
import java.util.concurrent.TimeUnit; // For time calculations

public class Register implements REST {

    private static final String FUNCTION = "_func";
    private static final String DEDUP_ACCOUNT = "dedup_account";
    private static final String REGISTER_MEMBER_SEND_OTP = "register_member_send_otp";
    private static final String VALIDATE_MEMBER_OTP = "validate_member_otp";

    // --- Rate Limiting Configuration for registerMemberSendOTP ---
    private static final int MAX_REG_OTP_REQUESTS_PER_MINUTE = 1; // Max OTP requests allowed per email per minute for registration
    private static final long REG_OTP_REQUEST_WINDOW_MILLIS = TimeUnit.MINUTES.toMillis(1); // 1 minute window
    private static final long REG_OTP_BLOCK_DURATION_MILLIS = TimeUnit.MINUTES.toMillis(1440); // Block for 5 minutes after exceeding limit

    // --- Daily Register Limit Configuration (by IP Address) ---
    private static final int MAX_DAILY_REGISTERS_BY_IP = 3; // Max successful logins per IP per day
    private static final ConcurrentHashMap<String, Register.RegisterCountInfo> dailyRegisterTrackerByIp = new ConcurrentHashMap<>();


    // In-memory map to store registration OTP request counts and last request time
    // Key: email address, Value: OTPRequestInfo object
    private static final ConcurrentHashMap<String, RequestInfo> regOtpRequestTracker = new ConcurrentHashMap<>();

    // Reusing a generic RequestInfo class for clarity and potential reuse
    private static class RequestInfo {
        long firstRequestTime; // Timestamp of the first request in the current window
        int requestCount;      // Number of requests in the current window
        long blockedUntilTime; // Timestamp until which this email is blocked

        RequestInfo(long firstRequestTime) {
            this.firstRequestTime = firstRequestTime;
            this.requestCount = 1;
            this.blockedUntilTime = 0; // Not blocked initially
        }
    }

    private static class RegisterCountInfo { // For daily login tracking (used by both email and IP)
        LocalDate lastRegisterDate;
        int registerCount;

        RegisterCountInfo(LocalDate date) {
            this.lastRegisterDate = date;
            this.registerCount = 1;
        }
    }

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "GET method not supported for Register API.");
    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        JSONArray outputArray = null; // Unused, but kept as per original structure
        String func = null;
        String email = null; // Declare email here for broader scope
        String ipAddress = null; // Declare IP address here

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            email = (String) input.get("email"); // Get email early for rate limiting
            ipAddress = InputProcessor.getClientIpAddress(req);

            if (func != null) {
                if (func.equalsIgnoreCase(DEDUP_ACCOUNT)) {
                    boolean exists = accountExists(input);
                    output = new JSONObject();
                    output.put("_exists", exists);
                } else if (func.equalsIgnoreCase(REGISTER_MEMBER_SEND_OTP)) {
                    if (email == null || email.trim().isEmpty()) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Email is required for registration OTP request.");
                        return;
                    }
                    /*if (!GeolocationResolver.isIndiaIP(ipAddress)) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Your geography is not supported yet. Please try again later.");
                        return;
                    }*/
                    if (isRegistrationOtpRateLimited(email)) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Too many registration OTP requests. Please try again later.");
                        return;
                    }
                    // NEW: Check daily login limit by IP Address
                   if (isDailyRegisterLimited(ipAddress, MAX_DAILY_REGISTERS_BY_IP, "IP Address")) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Daily register limit from this IP address exceeded. Please try again tomorrow.");
                        return;
                    }
                    // If not rate-limited, proceed with sending OTP
                    output = registerMemberSendOTP(input);
                    // Decide if you count OTP attempts even if underlying send fails (safer to count)
                    incrementRegistrationOtpRequest(email);
                    incrementDailyRegisterCount(ipAddress); // Increment for IP
                } else if (func.equalsIgnoreCase(VALIDATE_MEMBER_OTP)) {
                    output = validateMember(input);
                } else {
                    OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Invalid function specified.");
                    return;
                }
            } else {
                OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Function parameter (_func) is missing.");
                return;
            }

            if (outputArray != null) // This part of the original code seems to handle outputArray but it's always null.
                OutputProcessor.send(res, HttpServletResponse.SC_OK, outputArray);
            else
                OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
        } catch (Exception e) {
            System.err.println("Error in Register POST request: " + e.getMessage());
            e.printStackTrace();
            OutputProcessor.sendError(res, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unknown server error");
        }
    }


    private boolean isDailyRegisterLimited(String key, int maxRegisters, String type) {
        LocalDate today = LocalDate.now();
        Register.RegisterCountInfo info = dailyRegisterTrackerByIp.get(key);

        if (info == null) {
            return false;
        }

        if (!info.lastRegisterDate.isEqual(today)) {
            dailyRegisterTrackerByIp.remove(key); // Reset for new day
            return false;
        }

        if (info.registerCount >= maxRegisters) {
            System.out.println(type + ": " + key + " has exceeded daily register limit of " + maxRegisters);
            return true;
        }
        return false;
    }

    private void incrementDailyRegisterCount(String key) {
        LocalDate today = LocalDate.now();
        dailyRegisterTrackerByIp.compute(key, (k, info) -> {
            if (info == null || !info.lastRegisterDate.isEqual(today)) {
                return new Register.RegisterCountInfo(today);
            } else {
                info.registerCount++;
                return info;
            }
        });
        System.out.println("IP Address:"+key + " - Daily register count: " + dailyRegisterTrackerByIp.get(key).registerCount + " for " + today);
    }

    /**
     * Checks if an email address is currently rate-limited for registration OTP requests.
     * @param email The email address to check.
     * @return true if rate-limited, false otherwise.
     */
    private boolean isRegistrationOtpRateLimited(String email) {
        long currentTime = System.currentTimeMillis();
        RequestInfo info = regOtpRequestTracker.get(email);

        if (info == null) {
            // First request for this email, not limited
            return false;
        }

        // Check if currently blocked
        if (info.blockedUntilTime > currentTime) {
            return true; // Still blocked
        }

        // If block time has passed, reset count if current window has expired
        if (currentTime - info.firstRequestTime > REG_OTP_REQUEST_WINDOW_MILLIS) {
            regOtpRequestTracker.remove(email); // Reset for new window
            return false;
        }

        // Within window, check request count
        if (info.requestCount >= MAX_REG_OTP_REQUESTS_PER_MINUTE) {
            // Exceeded limit within window, block this email
            info.blockedUntilTime = currentTime + REG_OTP_BLOCK_DURATION_MILLIS;
            // For registration, it's often safer to reset count only when the block lifts completely,
            // or to 0 immediately to start counting from 1 after block if they try again.
            // Here, we reset count to 0 and re-timestamp for new block window.
            info.requestCount = 0;
            info.firstRequestTime = currentTime;
            System.out.println("Registration OTP for email " + email + " blocked until " + new java.util.Date(info.blockedUntilTime));
            return true;
        }

        return false;
    }

    /**
     * Increments the registration OTP request count for an email.
     * Should be called after a request is processed (successful or intentional failure to count).
     * @param email The email address to increment.
     */
    private void incrementRegistrationOtpRequest(String email) {
        long currentTime = System.currentTimeMillis();
        regOtpRequestTracker.compute(email, (key, info) -> {
            if (info == null || currentTime - info.firstRequestTime > REG_OTP_REQUEST_WINDOW_MILLIS) {
                // New window or first request after window expiry
                return new RequestInfo(currentTime);
            } else {
                // Within existing window
                info.requestCount++;
                return info;
            }
        });
        System.out.println("Email: " + email + " - Registration OTP Requests in window: " + regOtpRequestTracker.get(email).requestCount);
    }


    private boolean accountExists(JSONObject input) throws Exception{
        boolean exists = false;
        String type = (String) input.get("type");
        if(type != null) { // Added null check for type
            if(type.equalsIgnoreCase("BUSINESS")){
                String email = (String) input.get("email");
                exists = new Org().accountExists(email);
            }else if(type.equalsIgnoreCase("PROFESSIONAL") || type.equalsIgnoreCase("AMBASSADOR")){ // Assuming Talent handles both
                // The original code had two separate calls without combining the result:
                // exists = new Talent().accountExists(input);
                // exists = new Ambassador().accountExists(input);
                // This would effectively only return the result of the last call.
                // Assuming you want to check if it exists in EITHER Talent OR Ambassador
                exists = new Talent().accountExists(input) || new Ambassador().accountExists(input);
            }
        }
        return exists;
    }


    private JSONObject registerMemberSendOTP(JSONObject input) throws Exception{
        JSONObject out = new JSONObject();
        String email = (String) input.get("email");
        String type = (String) input.get("account_type"); // Use "account_type" as consistent with "Login"
        boolean sent = false;
        boolean emailValid = false;
        boolean isPersonalEmail = false; // Renamed for clarity
        String secret = Email.generate4DigitOTP(); // Use OTP.generate4DigitOTP()

        try {
            // Validate email domain type based on account type
            if (email != null && !email.trim().isEmpty()) { // Ensure email is not null or empty
                if(email.contains("gmail.com")
                        || email.contains("outlook.com")
                        || email.contains("yahoo.com")
                        || email.contains("protonmail.com")
                        || email.contains("rediffmail.com")
                        || email.contains("hotmail.com")){
                    isPersonalEmail = true;
                }

                if(type != null) { // Added null check for type
                    if((type.equalsIgnoreCase(Constants.PROFESSIONAL_ACCOUNT_TYPE) || type.equalsIgnoreCase(Constants.AMBASSADOR_ACCOUNT_TYPE)) && isPersonalEmail){
                        emailValid = true;
                    }else if(type.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE) && !isPersonalEmail) {
                        emailValid = true;
                    }
                }
            }

            if(emailValid && !accountExists(input)) {
                // Insert member registry
                Connection conn = null; // Declare Connection outside try-with-resources if you need it after
                PreparedStatement pstmt = null,pstmt0 = null;

                try {
                    conn = new PoolDB().getConnection(); // Get connection from pool
                    String sql0 = "delete from _member_registry where email=?";
                    pstmt0 = conn.prepareStatement(sql0);
                    pstmt0.setString(1,email);
                    pstmt0.executeUpdate();

                    String sql = "INSERT INTO _member_registry (email,account_type,secret) values (?,?,?)";
                    pstmt = conn.prepareStatement(sql);
                    pstmt.setString(1, email);
                    pstmt.setString(2, type);
                    pstmt.setString(3, secret);
                    pstmt.executeUpdate();

                    // Send OTP
                    Email.sendOTP(email, secret);
                    sent = true;
                } finally {
                    // Ensure resources are closed if not using try-with-resources for Connection/PreparedStatement
                    // Ideally, use try-with-resources:
                    // try (Connection conn = new PoolDB().getConnection(); PreparedStatement pstmt = conn.prepareStatement(sql)) { ... }
                    if (pstmt != null) {
                        try { pstmt.close(); } catch (SQLException se) { se.printStackTrace(); }
                    }
                    if (conn != null) {
                        try { conn.close(); } catch (SQLException se) { se.printStackTrace(); } // Returns to pool
                    }
                }
            }
        } catch (Exception e){
            e.printStackTrace();
            // Decide if you want to set _sent = false here if an exception means it wasn't sent
        }

        if(sent){
            out.put("_sent",true);
        } else if (!emailValid) { // If not sent and reason is email invalid
            out.put("_sent",false);
            out.put("code","INVALID_EMAIL");
        } else { // If not sent for other reasons (e.g. accountExists returned true, or some other exception)
            out.put("_sent",false);
            out.put("code","SEND_FAILED"); // Generic error code if not specifically INVALID_EMAIL
        }
        return out;
    }

    private JSONObject validateMember(JSONObject input) throws Exception{
        JSONObject out = new JSONObject();
        boolean auth = false;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String name = null;
        String role = null;
        String type = null;
        String token = null;
        String email = (String) input.get("email");
        String otp = (String) input.get("otp");
        String sql = "select email,account_type from _member_registry where email=? and secret=?"; // Removed 'name' and 'role_slug' from select as they are not in _member_registry
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,email);
        query.setValue(Types.VARCHAR,otp);
        rs = new PoolDB().fetch(query);
        if(rs.hasNext()){
            result = (JSONObject) rs.next();
            // Original code tried to get "name" and "role_slug" from _member_registry, but these are typically in _user table.
            // Assuming for validation, we just need email and type from _member_registry to confirm OTP.
            // If name and role are needed for token generation AFTER validation, they must be fetched from the _user table later.
            // For now, setting them to generic values or null if not available from _member_registry
            name = "Validated User"; // Placeholder, fetch from _user table after successful validation
            role = "unknown"; // Placeholder
            type = (String) result.get("account_type");
            auth = true;

            // --- Important: Clear registration OTP rate limit on successful validation ---
            regOtpRequestTracker.remove(email);
            System.out.println("Registration OTP rate limit for " + email + " cleared due to successful validation.");

            // Generate token only if authentication is confirmed and valid user details can be fetched
            // This token generation needs actual name and role, which might require a lookup in the _user table
            // after the _member_registry validation is successful.
            // For simplicity here, using placeholders. In real app, fetch from actual user data.
            token = JWTUtil.generateToken(email,type,name,role);
            out.put("_token",token);

            // Optional: Delete from _member_registry after successful validation to prevent reuse of OTP
            String deleteSql = "DELETE FROM _member_registry WHERE email = ?";
            try (Connection conn = new PoolDB().getConnection();
                 PreparedStatement deletePstmt = conn.prepareStatement(deleteSql)) {
                deletePstmt.setString(1, email);
                deletePstmt.executeUpdate();
                System.out.println("OTP entry for " + email + " deleted from _member_registry.");
            } catch (SQLException e) {
                System.err.println("Error deleting OTP from _member_registry: " + e.getMessage());
                e.printStackTrace();
            }

        }
        out.put("_auth",auth);
        return out;
    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "DELETE method not supported for Register API.");
    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "PUT method not supported for Register API.");
    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        // Ensure that basic input validation happens here, e.g., checking for 'email' and '_func' presence
        return InputProcessor.validate(req, res);
    }
}