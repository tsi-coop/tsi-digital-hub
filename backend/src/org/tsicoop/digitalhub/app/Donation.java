package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.LocalDate;
import java.util.HashMap;

public class Donation implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_KYC = "get_kyc";

    private static final String STORE_KYC = "store_kyc";

    private static final String RECORD_DONATION = "record_donation";

    private static final String GET_RECEIPT = "get_receipt";

    private static final String GET_DONATION_HISTORY = "get_donation_history";

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
            accountType = InputProcessor.getAccountType(req);
            accountSlug = InputProcessor.getAccountSlug(req);

            if(func != null){
                if(func.equalsIgnoreCase(GET_KYC)){
                    kycType = (String) input.get("kyc_type");
                    output = getKYC(accountType,accountSlug, kycType);
                }else if(func.equalsIgnoreCase(STORE_KYC)){
                    kycType = (String) input.get("kyc_type");
                    kycValue = (String) input.get("kyc_value");
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    boolean stored = storeKYC(accountType,accountSlug, kycType, kycValue);
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
                    amount = (float)(double) input.get("amount_paid");
                    address = (String) input.get("address");
                    emailContact = (String) input.get("email_contact");
                    paymentMode = (String) input.get("payment_mode");
                    transactionDetails = (String) input.get("transaction_details");
                    paymentDate = (String) input.get("payment_date");
                    output = new Donation().recordDonation(accountType,accountSlug, kycType, kycValue, donationType, numYears,amount,address, emailContact, paymentMode, transactionDetails, paymentDate);
                }else if(func.equalsIgnoreCase(GET_RECEIPT)){
                    receiptId = (int)(long) input.get("receipt_id");
                    output = getReceipt(receiptId);
                }else if(func.equalsIgnoreCase(GET_DONATION_HISTORY)){
                    accountType = (String) input.get("account_type");
                    accountSlug = (String) input.get("account_slug");
                    outputArray = getDonationHistory(accountType, accountSlug);
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

    public JSONObject getKYC(String accountType, String accountSlug, String kycType) throws SQLException {
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject kyc = new JSONObject();
        try {
            con = new PoolDB().getConnection();
            // insert schema mgr
            buff = new StringBuffer();
            buff.append("select kyc_detail from _kyc where account_type=? and account_slug=? and kyc_type=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            pstmt.setString(3,kycType);
            rs = pstmt.executeQuery();
            if(rs.next()) {
                kyc.put("value", rs.getString("kyc_detail"));
            }
        } finally {
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return kyc;
    }

    public JSONObject getReceipt(int receiptId) throws SQLException {
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject receipt = new JSONObject();
        try {
            con = new PoolDB().getConnection();
            // insert schema mgr
            buff = new StringBuffer();
            buff.append("select * from _donation_receipt where receipt_id="+receiptId);
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            if(rs.next()) {
                receipt.put("account_type",rs.getString("account_type"));
                receipt.put("account_slug",rs.getString("account_slug"));
                receipt.put("account_name",rs.getString("account_name"));
                receipt.put("start_date", DBUtil.convertSqlDateToString(rs.getDate("start_date")));
                receipt.put("end_date", DBUtil.convertSqlDateToString(rs.getDate("end_date")));
                receipt.put("kyc_type", rs.getString("kyc_type"));
                receipt.put("kyc_value", rs.getString("kyc_detail"));
                receipt.put("amount", rs.getFloat("amount_paid"));
                receipt.put("posted",rs.getTimestamp("created").toString());
                receipt.put("address",rs.getString("address"));
                receipt.put("email_contact",rs.getString("email_contact"));
                receipt.put("payment_mode",rs.getString("payment_mode"));
                receipt.put("transaction_details",rs.getString("transaction_details"));
                receipt.put("payment_date",rs.getString("payment_date"));
                receipt.put("donation_type",rs.getString("donation_type"));
            }
        } finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return receipt;
    }

    public JSONArray getDonationHistory(String accountType, String accountSlug) throws SQLException {
        PreparedStatement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONArray history = new JSONArray();
        JSONObject receipt = null;
        try {
            con = new PoolDB().getConnection();
            // insert schema mgr
            buff = new StringBuffer();
            buff.append("select * from _donation_receipt where account_type=? and account_slug=? order by created");
            stmt = con.prepareStatement(buff.toString());
            stmt.setString(1,accountType);
            stmt.setString(2,accountSlug);
            rs = stmt.executeQuery();
            while(rs.next()) {
                receipt = new JSONObject();
                receipt.put("receipt_id",rs.getInt("receipt_id"));
                receipt.put("account_type",rs.getString("account_type"));
                receipt.put("account_slug",rs.getString("account_slug"));
                receipt.put("account_name",rs.getString("account_name"));
                receipt.put("start_date", DBUtil.convertSqlDateToString(rs.getDate("start_date")));
                receipt.put("end_date", DBUtil.convertSqlDateToString(rs.getDate("end_date")));
                receipt.put("kyc_type", rs.getString("kyc_type"));
                receipt.put("kyc_value", rs.getString("kyc_detail"));
                receipt.put("amount", rs.getFloat("amount_paid"));
                receipt.put("posted",rs.getTimestamp("created").toString());
                history.add(receipt);
            }
        } finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return history;
    }

    public boolean storeKYC(String accountType, String accountSlug, String kycType, String value) throws SQLException {
        boolean stored = false;
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        JSONObject kycObject = getKYC(accountType, accountSlug, kycType);
        String kycValue = (String) kycObject.get("value");
        try {
            con = new PoolDB().getConnection();
            if(kycValue == null) {
                buff = new StringBuffer();
                buff.append("insert into _kyc (account_type,account_slug,kyc_type,kyc_detail) values (?,?,?,?)");
                pstmt = con.prepareStatement(buff.toString());
                pstmt.setString(1, accountType);
                pstmt.setString(2, accountSlug);
                pstmt.setString(3, kycType);
                pstmt.setString(4, value);
                pstmt.executeUpdate();
            }else{
                buff = new StringBuffer();
                buff.append("update _kyc set kyc_detail=? where account_type=? and account_slug=? and kyc_type=?");
                pstmt = con.prepareStatement(buff.toString());
                pstmt.setString(1, value);
                pstmt.setString(2, accountType);
                pstmt.setString(3, accountSlug);
                pstmt.setString(4, kycType);
                pstmt.executeUpdate();
            }
            stored = true;
        } finally {
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return stored;
    }

    public JSONObject recordDonation(   String accountType,
                                        String accountSlug,
                                        String kycType,
                                        String kycValue,
                                        String donationType,
                                        int numYears,
                                        float amount,
                                        String address,
                                        String emailContact,
                                        String paymentMode,
                                        String transactionDetails,
                                        String paymentDate
                                        ) throws SQLException {
        JSONObject donation = new JSONObject();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String accountName = null;
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        if(accountType.equals(Constants.BUSINESS_ACCOUNT_TYPE)){
            accountName = (String) userDetails.get("org_name");
        }else if(accountType.equals(Constants.AMBASSADOR_ACCOUNT_TYPE)){
            accountName = (String) userDetails.get("name");
        }

      /*  JSONObject kycObject = getKYC(accountType, accountSlug, kycType);
        String storedKycValue = (String) kycObject.get("value");
        System.out.println("kyc value:"+kycValue+" Stored KYC Value:"+storedKycValue);
        if(!storedKycValue.equalsIgnoreCase(kycValue)){
            storeKYC(accountType, accountSlug, kycType, kycValue);
        }*/

        int receiptId = 0;
        try {
            con = new PoolDB().getConnection();

            // insert donation receipt
            buff = new StringBuffer();
            buff.append("insert into _donation_receipt (account_type,account_slug,account_name,kyc_type,kyc_detail,donation_type,start_date,end_date,amount_paid,status,address,email_contact,payment_mode,transaction_details,payment_date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            pstmt = con.prepareStatement(buff.toString(),Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            pstmt.setString(3,accountName);
            pstmt.setString(4,kycType);
            pstmt.setString(5,kycValue);
            pstmt.setString(6,donationType);
            pstmt.setDate(7,getStartDate());
            pstmt.setDate(8,getEndDate(numYears));
            pstmt.setFloat(9,amount);
            pstmt.setInt(10, Constants.DONATION_PAID_STATUS);
            pstmt.setString(11,address);
            pstmt.setString(12,emailContact);
            pstmt.setString(13,paymentMode);
            pstmt.setString(14,transactionDetails);
            pstmt.setString(15,paymentDate);
            pstmt.executeUpdate();
            rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                receiptId = rs.getInt(1);
            }

            // update account
            if(accountType.equals(Constants.BUSINESS_ACCOUNT_TYPE)){
                buff = new StringBuffer();
                buff.append("update _organization_account set plan_type=?,plan_expiry=? where account_type=? and account_slug=?");
                pstmt = con.prepareStatement(buff.toString());
                pstmt.setInt(1,Constants.PAID_PLAN);
                pstmt.setDate(2,getEndDate(numYears));
                pstmt.setString(3,accountType);
                pstmt.setString(4,accountSlug);
                pstmt.executeUpdate();
            }else if(accountType.equals(Constants.AMBASSADOR_ACCOUNT_TYPE)){
                buff = new StringBuffer();
                buff.append("update _ambassador_account set plan_type=?,plan_expiry=? where account_slug=?");
                pstmt = con.prepareStatement(buff.toString());
                pstmt.setInt(1,Constants.PAID_PLAN);
                pstmt.setDate(2,getEndDate(numYears));
                pstmt.setString(3,accountSlug);
                pstmt.executeUpdate();
            }
            donation.put("receipt_id",receiptId);
        } finally {
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return donation;
    }

    private Date getEndDate(int yearsToAdd) {
        LocalDate currentDate = LocalDate.now();
        LocalDate futureDate = currentDate.plusYears(yearsToAdd);
        return Date.valueOf(futureDate);
    }

    private Date getStartDate() {
        LocalDate currentDate = LocalDate.now();
        return Date.valueOf(currentDate);
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
