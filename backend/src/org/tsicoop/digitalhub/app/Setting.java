package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.admin.Account;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.framework.InputProcessor;
import org.tsicoop.digitalhub.framework.OutputProcessor;
import org.tsicoop.digitalhub.framework.PoolDB;
import org.tsicoop.digitalhub.framework.REST;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class Setting implements REST {

    private static final String FUNCTION = "_func";

    // User Mgmt - for businesses
    private static final String GET_BUSINESS_USERLIST = "get_business_userlist";
    private static final String ADD_BUSINESS_USER = "add_business_user";
    private static final String CHANGE_BUSINESS_USER_ROLE = "change_business_user_role";
    private static final String DEACTIVATE_USER = "deactivate_user";

    // User Mgmt - for tech professionals
    private static final String CHANGE_EMAIL = "change_email";

    // Business - Profile Update
    private static final String GET_ORG_PROFILE_FOR_EDITING = "get_org_profile_for_editing";
    private static final String EDIT_BUSINESS_DETAILS = "edit_business_details";

    // Tech Professional - Profile Update
    private static final String GET_TALENT_PROFILE_FOR_EDITING = "get_talent_profile_for_editing";
    private static final String EDIT_PROFESSIONAL_DETAILS = "edit_professional_details";

    // Ambassador - Profile Update
    private static final String GET_AMBASSADOR_PROFILE_FOR_EDITING = "get_ambassador_profile_for_editing";
    private static final String EDIT_AMBASSADOR_DETAILS = "edit_ambassador_details";

    private static final String GET_KYC = "get_kyc";

    private static final String STORE_KYC = "store_kyc";

    private static final String GET_SUBSCRIPTION_DETAILS = "get_subscription_details";

    // Export Data
    private static final String EXPORT_DATA = "export_data";

    // Cancel Account
    private static final String CANCEL_ACCOUNT = "cancel_account";

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        JSONArray outputArray = null;
        String func = null;
        String accountType = null;
        String accountSlug = null;
        String id = null;
        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            accountType = InputProcessor.getAccountType(req);
            accountSlug = InputProcessor.getAccountSlug(req);

            if(func != null){
                if(func.equalsIgnoreCase(GET_BUSINESS_USERLIST)){
                    outputArray = getBusinessUserList(accountType, accountSlug);
                }
                else if(func.equalsIgnoreCase(ADD_BUSINESS_USER)){
                    output = addBusinessUser(accountType, accountSlug, input);
                }
                else if(func.equalsIgnoreCase(CHANGE_BUSINESS_USER_ROLE)){
                    output = changeBusinessUserRole(accountType, accountSlug, input);
                }
                else if(func.equalsIgnoreCase(DEACTIVATE_USER)){
                    output = deactivateUser(accountType, accountSlug, input);
                }
                else if(func.equalsIgnoreCase(EDIT_BUSINESS_DETAILS)){
                    output = new Org().editBusinessDetails(accountSlug, input);
                }
                else if(func.equalsIgnoreCase(EDIT_PROFESSIONAL_DETAILS)){
                    output = new Talent().editProfessionalDetails(accountSlug, input);
                }
                else if(func.equalsIgnoreCase(EDIT_AMBASSADOR_DETAILS)){
                    output = new Ambassador().editAmbassadorDetails(accountSlug, input);
                }
                else if(func.equalsIgnoreCase(GET_ORG_PROFILE_FOR_EDITING)){
                    output = new Org().getOrgProfileForEditing(accountSlug);
                }
                else if(func.equalsIgnoreCase(GET_TALENT_PROFILE_FOR_EDITING)){
                    output = new Talent().getTalentProfileForEditing(accountSlug);
                }
                else if(func.equalsIgnoreCase(GET_AMBASSADOR_PROFILE_FOR_EDITING)){
                    output = new Ambassador().getAmbassadorProfileForEditing(accountSlug);
                }
                else if(func.equalsIgnoreCase(GET_KYC)){
                    String kycType = (String) input.get("kyc_type");
                    output = new Donation().getKYC(accountType,accountSlug, kycType);
                }else if(func.equalsIgnoreCase(STORE_KYC)){
                    String kycType = (String) input.get("kyc_type");
                    String kycValue = (String) input.get("kyc_value");
                    boolean stored = new Donation().storeKYC(accountType,accountSlug, kycType, kycValue);
                    output = new JSONObject();
                    if(stored)
                        output.put("_created",true);
                    else
                        output.put("_created",false);
                }else if(func.equalsIgnoreCase(GET_SUBSCRIPTION_DETAILS)){
                    output = new Account().getSubscriptionDetails(accountType,accountSlug);
                }
            }
            if(outputArray != null)
                OutputProcessor.send(res, HttpServletResponse.SC_OK, outputArray);
            else
                OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
        }catch(Exception e){
            OutputProcessor.sendError(res,HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Unknown server error");
            e.printStackTrace();
        }
    }

    public static JSONArray getBusinessUserList(String accountType, String accountSlug){
        JSONArray users = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select name,email,role_slug,created from _user where account_type=? and account_slug=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("name", rs.getString("name"));
                jsob.put("email", rs.getString("email"));
                jsob.put("role", rs.getString("role_slug"));
                jsob.put("created",rs.getTimestamp("created").toString());
                users.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return users;
    }

    public static boolean isEmailExist(String email){
        boolean exist = false;
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select email from _user where email=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,email);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                exist = true;
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return exist;
    }

    public static JSONObject changeBusinessUserRole(String accountType, String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean updated = false;
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String email = (String) input.get("email");
        String role = (String) input.get("role");

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("update _user set role_slug=? where email=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,role);
            pstmt.setString(2,email);
            pstmt.executeUpdate();
            updated = true;
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        if(updated){
            output.put("_updated",true);
        }else{
            output.put("_updated",true);
        }
        return output;
    }

    public static JSONObject deactivateUser(String accountType, String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean deactivated = false;
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String email = (String) input.get("email");

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("update _user set active=? where email=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setInt(1, Constants.INACTIVE_USER);
            pstmt.setString(2,email);
            pstmt.executeUpdate();
            deactivated = true;
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        if(deactivated){
            output.put("_deactivated",true);
        }else{
            output.put("_deactivated",true);
        }
        return output;
    }


    public JSONObject addBusinessUser(String accountType, String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean added = false;
        String name = (String) input.get("name");
        String email = (String) input.get("email");
        String role = Constants.BUSINESS_USER_ROLE;
        String mobile = (String) input.get("mobile");
        try{

            if(isEmailExist(email)){
                output.put("_added",false);
                output.put("_error",Constants.USER_EMAIL_ALREADY_EXISTS_ERROR);
            }else {
                Connection conn = new PoolDB().getConnection();
                // Insert Enquiry
                String sql = "INSERT INTO _user (name,email,role_slug,mobile,account_type,account_slug,active) VALUES (?, ?, ?, ?, ?,?,?)";
                PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                pstmt.setString(1, name);
                pstmt.setString(2, email);
                pstmt.setString(3, role);
                pstmt.setString(4, mobile);
                pstmt.setString(5, accountType);
                pstmt.setString(6, accountSlug);
                pstmt.setInt(7, Constants.ACTIVE_USER);
                pstmt.executeUpdate();
                added = true;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        if(added){
            output.put("_added",true);
        }
        return output;
    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        return InputProcessor.validate( req,
                res);
    }
}
