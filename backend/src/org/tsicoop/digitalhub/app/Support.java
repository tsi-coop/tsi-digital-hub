package org.tsicoop.digitalhub.app;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import java.sql.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

public class Support implements REST {

    private static final String FUNCTION = "_func";

    private static final String REQUEST_SUPPORT = "request_support";

    private static final String GET_MY_SUPPORT_REQUESTS = "get_my_support_requests";

    private static final String VIEW_SUPPORT_REQUEST = "view_support_request";

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
                if(func.equalsIgnoreCase(REQUEST_SUPPORT)){
                    boolean added = requestSupport(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }
                else  if(func.equalsIgnoreCase(GET_MY_SUPPORT_REQUESTS)){
                    outputArray = getMySupportRequests(accountType, accountSlug);
                }
                else  if(func.equalsIgnoreCase(VIEW_SUPPORT_REQUEST)){
                    id = (String) input.get("id");
                    output = viewSupportRequest(id);
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

    public JSONArray getMySupportRequests(String accountType, String accountSlug){
        JSONArray requests = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;
        int status = 0;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,type,query,status,created from _support_request where account_type=? and account_slug=? order by created desc");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("type", rs.getString("type"));
                jsob.put("query", rs.getString("query"));
                status = rs.getInt("status");
                if(status == 1) {
                    jsob.put("status", "OPEN");
                }else if(status == 2) {
                    jsob.put("status", "CLOSED");
                }else if(status == 3) {
                    jsob.put("status", "CANCELLED");
                }
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                requests.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return requests;
    }

    public JSONArray getSupportRequestsByStatus(int status){
        JSONArray requests = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,type,query,status,created from _support_request where status=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setInt(1,status);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("type", rs.getString("type"));
                jsob.put("query", rs.getString("query"));
                status = rs.getInt("status");
                if(status == 1) {
                    jsob.put("status", "OPEN");
                }else if(status == 2) {
                    jsob.put("status", "CLOSED");
                }else if(status == 3) {
                    jsob.put("status", "CANCELLED");
                }
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                requests.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return requests;
    }

    public JSONObject viewSupportRequest(String uuid){
        JSONObject enquiry = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select type,query,created from _support_request where uuid='"+uuid+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                enquiry.put("type", rs.getString("type"));
                enquiry.put("query", rs.getString("query"));
                enquiry.put("created",rs.getTimestamp("created").toString());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return enquiry;
    }

    public boolean changeSupportRequestStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _support_request set status=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            changed = true;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return changed;
    }

    public boolean requestSupport(String accountType, String accountSlug, JSONObject input){
        boolean added = false;
        String requestType = (String) input.get("request_type");
        String query = (String) input.get("query");
        String uuid = UUID.randomUUID().toString();
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            postedBy = (String) userDetails.get("org_name");
        }else{
            postedBy = (String) userDetails.get("name");
        }
        try{
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _support_request (uuid,account_type,account_slug,type,query,status) VALUES (?, ?, ?, ?, ?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, uuid);
            pstmt.setString(2, accountType);
            pstmt.setString(3, accountSlug);
            pstmt.setString(4, requestType);
            pstmt.setString(5, query);
            pstmt.setInt(6,Constants.SUPPORT_STATUS_OPEN);
            pstmt.executeUpdate();
            new Notification().addNotification(accountType, accountSlug, Constants.SUPPORT_REQUEST_NOTIFICATION, Constants.DISPLAY_SUPPORT_REQUEST+" - "+accountType+" - "+accountSlug, Constants.SUPPORT_REQUEST_CONTENT_TYPE,uuid,Constants.ADMIN_ACCOUNT_TYPE,Constants.ADMIN_ACCOUNT_SLUG,postedBy);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
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
