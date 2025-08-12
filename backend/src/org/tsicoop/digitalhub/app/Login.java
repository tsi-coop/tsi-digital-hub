package org.tsicoop.digitalhub.app;

import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.OTP;
import org.tsicoop.digitalhub.framework.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Types;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

public class Login implements REST {

    private static final String FUNCTION = "_func";

    private static final String SEND_OTP = "send_otp";
    private static final String LOGIN = "login";

    // --- OTP Rate Limiting Configuration ---
    private static final int MAX_OTP_REQUESTS_PER_MINUTE = 1;
    private static final long OTP_REQUEST_WINDOW_MILLIS = TimeUnit.MINUTES.toMillis(1);
    private static final long OTP_BLOCK_DURATION_MILLIS = TimeUnit.MINUTES.toMillis(60);
    private static final ConcurrentHashMap<String, RequestInfo> otpRequestTracker = new ConcurrentHashMap<>();

    // --- Daily Login Limit Configuration (by IP Address) ---
    private static final int MAX_DAILY_LOGINS_BY_IP = 3; // Max successful logins per IP per day
    private static final ConcurrentHashMap<String, LoginCountInfo> dailyLoginTrackerByIp = new ConcurrentHashMap<>();


    private static class RequestInfo { // For OTP tracking
        long firstRequestTime;
        int requestCount;
        long blockedUntilTime;

        RequestInfo(long firstRequestTime) {
            this.firstRequestTime = firstRequestTime;
            this.requestCount = 1;
            this.blockedUntilTime = 0;
        }
    }

    private static class LoginCountInfo { // For daily login tracking (used by both email and IP)
        LocalDate lastLoginDate;
        int loginCount;

        LoginCountInfo(LocalDate date) {
            this.lastLoginDate = date;
            this.loginCount = 1;
        }
    }


    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "GET method not supported for Login API.");
    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        String func = null;
        String email = null;
        String ipAddress = null; // Declare IP address here

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            email = (String) input.get("email");
            ipAddress = InputProcessor.getClientIpAddress(req);

            if (func != null) {
                if (func.equalsIgnoreCase(SEND_OTP)) {
                    if (email == null || email.trim().isEmpty()) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Email is required for OTP request.");
                        return;
                    }
                    /*if (!GeolocationResolver.isIndiaIP(ipAddress)) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Your geography is not supported yet. Please try again later.");
                        return;
                    }*/
                    if (isOtpRateLimited(email)) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Too many OTP requests. Please try again later.");
                        return;
                    }
                    // NEW: Check daily login limit by IP Address
                    if (isDailyLoginLimited(ipAddress, MAX_DAILY_LOGINS_BY_IP, "IP Address")) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Daily login limit from this IP address exceeded. Please try again tomorrow.");
                        return;
                    }
                    output = OTP.sendOTP(input);
                    incrementOtpRequest(email);
                    incrementDailyLoginCount(ipAddress); // Increment for IP
                } else if (func.equalsIgnoreCase(LOGIN)) {
                    if (email == null || email.trim().isEmpty()) {
                        OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Email is required for login.");
                        return;
                    }
                    output = login(input);
                } else {
                    OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Invalid function specified.");
                    return;
                }
            } else {
                OutputProcessor.sendError(res, HttpServletResponse.SC_BAD_REQUEST, "Function parameter (_func) is missing.");
                return;
            }
            OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
        } catch (Exception e) {
            System.err.println("Error in Login POST request: " + e.getMessage());
            e.printStackTrace();
            OutputProcessor.sendError(res, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Unknown server error.");
        }
    }

    // --- OTP Rate Limiting Methods ---
    private boolean isOtpRateLimited(String email) {
        long currentTime = System.currentTimeMillis();
        RequestInfo info = otpRequestTracker.get(email);

        if (info == null) {
            return false;
        }

        if (info.blockedUntilTime > currentTime) {
            return true;
        }

        if (currentTime - info.firstRequestTime > OTP_REQUEST_WINDOW_MILLIS) {
            otpRequestTracker.remove(email);
            return false;
        }

        if (info.requestCount >= MAX_OTP_REQUESTS_PER_MINUTE) {
            info.blockedUntilTime = currentTime + OTP_BLOCK_DURATION_MILLIS;
            info.requestCount = 0;
            info.firstRequestTime = currentTime;
            System.out.println("Email " + email + " blocked until " + new java.util.Date(info.blockedUntilTime));
            return true;
        }

        return false;
    }

    private void incrementOtpRequest(String email) {
        long currentTime = System.currentTimeMillis();
        otpRequestTracker.compute(email, (key, info) -> {
            if (info == null || currentTime - info.firstRequestTime > OTP_REQUEST_WINDOW_MILLIS) {
                return new RequestInfo(currentTime);
            } else {
                info.requestCount++;
                return info;
            }
        });
        System.out.println("Email: " + email + " - OTP Requests in window: " + otpRequestTracker.get(email).requestCount);
    }

    // --- Daily Login Limit Methods (Generalized for Email and IP) ---

    /**
     * Checks if a key (email or IP address) has exceeded its daily login limit.
     * @param key The email or IP address to check.
     * @param maxLogins The maximum allowed logins per day for this tracker.
     * @param type A string describing the type of key (for logging/error messages).
     * @return true if the daily limit is exceeded, false otherwise.
     */
    private boolean isDailyLoginLimited(String key, int maxLogins, String type) {
        LocalDate today = LocalDate.now();
        LoginCountInfo info = dailyLoginTrackerByIp.get(key);

        if (info == null) {
            return false;
        }
        System.out.println("LastLoginDate" + ": " + info.lastLoginDate + " Today: " + today + " Key: "+key);

        if (!info.lastLoginDate.isEqual(today)) {
            dailyLoginTrackerByIp.remove(key); // Reset for new day
            return false;
        }

        if (info.loginCount >= maxLogins) {
            System.out.println(type + ": " + key + " has exceeded daily login limit of " + maxLogins);
            return true;
        }
        return false;
    }

    /**
     * Increments the daily login count for a given key (email or IP address).
     * Should be called ONLY upon successful authentication.
     * @param key The email or IP address of the successfully logged-in user/source.
     */
    private void incrementDailyLoginCount(String key) {
        LocalDate today = LocalDate.now();
        dailyLoginTrackerByIp.compute(key, (k, info) -> {
            if (info == null || !info.lastLoginDate.isEqual(today)) {
                return new LoginCountInfo(today);
            } else {
                info.loginCount++;
                return info;
            }
        });
        System.out.println("IP Address:"+key + " - Daily login count: " + dailyLoginTrackerByIp.get(key).loginCount + " for " + today);
    }


    private JSONObject login(JSONObject input) throws Exception{
        JSONObject out = new JSONObject();
        boolean auth = false;
        String sql = null;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String accountName = null;
        String name = null;
        String role = null;
        String type = null;
        String token = null;
        HashMap userDetails = null;
        String email = (String) input.get("email");
        String otp = (String) input.get("otp");

        sql = "select name,role_slug,account_type from _user where email=? and secret=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,email);
        query.setValue(Types.VARCHAR,otp);
        rs = new PoolDB().fetch(query);
        if(rs.hasNext()){
            result = (JSONObject) rs.next();
            name = (String) result.get("name");
            role = (String) result.get("role_slug");
            type = (String) result.get("account_type");
            auth = true;

            // Clear OTP rate limit for this email on successful login
            otpRequestTracker.remove(email);
            System.out.println("OTP rate limit for " + email + " cleared due to successful login.");
        }
        out.put("_auth",auth);
        if(auth){
            if(type.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
                out.put("_system",Constants.BUSINESS_ACCOUNT_TYPE);
                userDetails = new Org().getOrgDetails(new Org().getAccountSlug(email));
                accountName = (String) userDetails.get("org_name");
                out.put("_name",accountName);
                out.put("_role",role);
            }else if(type.equalsIgnoreCase(Constants.PROFESSIONAL_ACCOUNT_TYPE)){
                out.put("_system",Constants.PROFESSIONAL_ACCOUNT_TYPE);
                out.put("_name",name);
                out.put("_role",role);
            }else if(type.equalsIgnoreCase(Constants.AMBASSADOR_ACCOUNT_TYPE)){
                out.put("_system",Constants.AMBASSADOR_ACCOUNT_TYPE);
                out.put("_name",name);
                out.put("_role",role);
            }else if(type.equalsIgnoreCase(Constants.ADMIN_ACCOUNT_TYPE)){
                out.put("_system",Constants.ADMIN_ACCOUNT_TYPE);
                out.put("_name",name);
                out.put("_role",role);
            }
            token = JWTUtil.generateToken(email,type,name,role);
            out.put("_token",token);
        }
        return out;
    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "DELETE method not supported for Login API.");
    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {
        OutputProcessor.sendError(res, HttpServletResponse.SC_METHOD_NOT_ALLOWED, "PUT method not supported for Login API.");
    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        return InputProcessor.validate(req, res);
    }
}