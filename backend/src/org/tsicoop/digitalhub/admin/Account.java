package org.tsicoop.digitalhub.admin;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.app.Ambassador;
import org.tsicoop.digitalhub.app.Donation;
import org.tsicoop.digitalhub.app.Org;
import org.tsicoop.digitalhub.app.Support;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.Types;
import java.util.HashMap;

public class Account implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_KYC = "get_kyc";

    private static final String STORE_KYC = "store_kyc";

    private static final String RECORD_DONATION = "record_donation";

    private static final String GET_RECEIPT = "get_receipt";

    private static final String GET_SUBSCRIPTION_DETAILS = "get_subscription_details";

    private static final String GET_DONATION_HISTORY = "get_donation_history";

    private static final String ASSIST = "assist";

    private static final String ADD_AMBASSADOR_FROM_BACKEND = "add_ambassador_from_backend";

    private static final String ADD_BUSINESS_FROM_BACKEND = "add_business_from_backend";

    private static final String GET_SUPPORT_REQUESTS_BY_STATUS = "get_support_requests_by_status";

    private static final String CHANGE_SUPPORT_REQUEST_STATUS = "change_support_request_status";


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
        String kycType = null;
        String kycValue = null;
        String donationType = null;
        int numYears = 0;
        float amount = 0F;
        int receiptId = 0;
        String address = null;
        String emailContact = null;
        String paymentMode = null;
        String transactionDetails = null;
        String paymentDate = null;

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            String authAccountType = InputProcessor.getAccountType(req);
            String authAccountSlug = InputProcessor.getAccountSlug(req);

            if(!authAccountType.equalsIgnoreCase(Constants.ADMIN_ACCOUNT_TYPE)){
                OutputProcessor.sendError(res,HttpServletResponse.SC_UNAUTHORIZED,"Unauthorized");
            }
            else if(func != null){
                if(func.equalsIgnoreCase(GET_KYC)){
                    kycType = (String) input.get("kyc_type");
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    output = new Donation().getKYC(accountType,accountSlug, kycType);
                }else if(func.equalsIgnoreCase(STORE_KYC)){
                    kycType = (String) input.get("kyc_type");
                    kycValue = (String) input.get("kyc_value");
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    boolean stored = new Donation().storeKYC(accountType,accountSlug, kycType, kycValue);
                    output = new JSONObject();
                    if(stored)
                        output.put("_created",true);
                    else
                        output.put("_created",false);
                }else  if(func.equalsIgnoreCase(RECORD_DONATION)){
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    kycType = (String) input.get("kyc_type");
                    kycValue = (String) input.get("kyc_value");
                    donationType = (String) input.get("donation_type");
                    numYears = (int)(long) input.get("num_years");
                    amount = (float)(long) input.get("amount_paid");
                    address = (String) input.get("address");
                    emailContact = (String) input.get("email_contact");
                    paymentMode = (String) input.get("payment_mode");
                    transactionDetails = (String) input.get("transaction_details");
                    paymentDate = (String) input.get("payment_date");
                    output = new Donation().recordDonation(accountType,accountSlug, kycType, kycValue, donationType, numYears,amount,address, emailContact, paymentMode, transactionDetails, paymentDate);
                }else if(func.equalsIgnoreCase(GET_RECEIPT)){
                    receiptId = (int)(long) input.get("receipt_id");
                    output = new Donation().getReceipt(receiptId);
                }else if(func.equalsIgnoreCase(GET_SUBSCRIPTION_DETAILS)){
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    output = getSubscriptionDetails(accountType,accountSlug);
                }else if(func.equalsIgnoreCase(ASSIST)){
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    output = assist(accountType,accountSlug);
                }else if(func.equalsIgnoreCase(GET_DONATION_HISTORY)){
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    outputArray = new Donation().getDonationHistory(accountType, accountSlug);
                }else if(func.equalsIgnoreCase(ADD_AMBASSADOR_FROM_BACKEND)){
                    String email = (String) input.get("email");
                    boolean created = new Ambassador().addAmbassador(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(ADD_BUSINESS_FROM_BACKEND)) {
                    String email = (String) input.get("email");
                    accountSlug = new Org().getAccountSlug(email);
                    boolean exists = new Org().accountExists(email);
                    output = new JSONObject();
                    if (exists) {
                        output.put("_created", false);
                        output.put("error", accountSlug + " already exists");
                    } else {
                        boolean created = new Org().addBusiness(email, input);
                        if (created) {
                            output.put("_created", true);
                        } else {
                            output.put("_created", false);
                        }
                    }
                } else if(func.equalsIgnoreCase(GET_SUPPORT_REQUESTS_BY_STATUS)){
                    int status = (int)(long) input.get("status");
                    outputArray = new Support().getSupportRequestsByStatus(status);
                } else if(func.equalsIgnoreCase(CHANGE_SUPPORT_REQUEST_STATUS)){
                    String id = (String) input.get("id");
                    int status = (int)(long) input.get("status");
                    boolean changed = new Support().changeSupportRequestStatus(id,status);
                    output = new JSONObject();
                    if (changed) {
                        output.put("_changed", true);
                    } else {
                        output.put("_changed", false);
                    }
                }
            }
            if(outputArray != null){
                OutputProcessor.send(res, HttpServletResponse.SC_OK, outputArray);
            }else {
                OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
            }
        }catch(Exception e){
            OutputProcessor.sendError(res,HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Unknown server error");
            e.printStackTrace();
        }
    }

    public JSONObject assist(String accountType, String accountSlug) throws Exception{
        JSONObject out = new JSONObject();
        boolean auth = false;
        String sql = null;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String accountName = null;
        String name = null;
        String email = null;
        String role = null;
        String type = null;
        String token = null;
        JSONObject location = null;
        String state = null;
        String city = null;
        HashMap userDetails = null;
        sql = "select name,email,role_slug,account_type from _user where account_type=? and account_slug=? order by created asc LIMIT 1";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,accountType);
        query.setValue(Types.VARCHAR,accountSlug);
        rs = new PoolDB().fetch(query);
        if(rs.hasNext()){
            result = (JSONObject) rs.next();
            name = (String) result.get("name");
            role = (String) result.get("role_slug");
            type = (String) result.get("account_type");
            email = (String) result.get("email");
            auth = true;
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
            out.put("_email",email);
            out.put("_token",token);
        }
        return out;
    }

    public JSONObject getSubscriptionDetails(String accountType, String accountSlug){
        JSONObject sub = new JSONObject();
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            sub.put("name",userDetails.get("org_name"));
            sub.put("about",userDetails.get("about"));
            sub.put("plan_type",userDetails.get("plan_type"));
            sub.put("plan_expiry",userDetails.get("plan_expiry"));
        }else if(accountType.equalsIgnoreCase(Constants.AMBASSADOR_ACCOUNT_TYPE)){
            sub.put("name",userDetails.get("name"));
            sub.put("about",userDetails.get("about"));
            sub.put("plan_type",userDetails.get("plan_type"));
            sub.put("plan_expiry",userDetails.get("plan_expiry"));
        }else{
            sub.put("name",userDetails.get("name"));
            sub.put("about",userDetails.get("about"));
            sub.put("plan_type",Constants.FREE_PLAN);
            sub.put("plan_expiry","-");
        }
        return sub;
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
