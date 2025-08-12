package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.framework.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.Instant;
import java.util.UUID;

public class Notification implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_NOTIFICATIONS = "get_notifications";

    private static final String READ_NOTIFICATION = "read_notification";

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

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            accountType = InputProcessor.getAccountType(req);
            accountSlug = InputProcessor.getAccountSlug(req);

            if(func != null){
                if(func.equalsIgnoreCase(GET_NOTIFICATIONS)){
                    outputArray = getMyNotifications(accountType, accountSlug);
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

    public static JSONArray getMyNotifications(String accountType, String accountSlug){
        JSONArray posts = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,title,created,content_type,content_uuid from _notification where viewed='"+Constants.UNREAD+"' and to_account_type='"+accountType+"' and to_account_slug='"+accountSlug+"' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("title", rs.getString("title"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                jsob.put("content_type",rs.getString("content_type"));
                jsob.put("content_uuid",rs.getString("content_uuid"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                posts.add(jsob);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return posts;
    }

    public void readNotification(String uuid){
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _notification set viewed=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, Constants.READ);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
    }

    public JSONObject addNotification(String fromAcountType,
                                      String fromAccountSlug,
                                      String notificationType,
                                      String title,
                                      String contentType,
                                      String contentUUID,
                                      String toAccountType,
                                      String toAccountSlug,
                                      String postedBy){
        JSONObject jsob = new JSONObject();
        boolean added = false;
        try {
            String notifUUID = UUID.randomUUID().toString();
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _notification (type,title,content_type,content_uuid,from_account_type,from_account_slug,to_account_type,to_account_slug,uuid,posted_by) VALUES (?, ?, ?, ?,?, ?,?,?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, notificationType);
            pstmt.setString(2, title);
            pstmt.setString(3, contentType);
            pstmt.setString(4, contentUUID);
            pstmt.setString(5, fromAcountType);
            pstmt.setString(6, fromAccountSlug);
            pstmt.setString(7, toAccountType);
            pstmt.setString(8, toAccountSlug);
            pstmt.setString(9, notifUUID);
            pstmt.setString(10, postedBy);
            pstmt.executeUpdate();
            added = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("added",added);
        return jsob;
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
