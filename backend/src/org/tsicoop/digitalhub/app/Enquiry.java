package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.postgresql.util.PGobject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.Masters;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

public class Enquiry implements REST {

    private static final String FUNCTION = "_func";

    private static final String ADD_ENQUIRY = "add_enquiry";
    private static final String GET_SENT_ENQUIRIES = "get_sent_enquiries";
    private static final String GET_RECEIVED_ENQUIRIES = "get_received_enquiries";

    private static final String GET_RECOMMENDED_ENQUIRIES = "get_recommended_enquiries";
    private static final String VIEW_ENQUIRY = "view_enquiry";

    private static final String CANCEL_ENQUIRY = "cancel_enquiry";

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
                if(func.equalsIgnoreCase(ADD_ENQUIRY)){
                    boolean added = addEnquiry(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else  if(func.equalsIgnoreCase(GET_SENT_ENQUIRIES)){
                    outputArray = getSentEnquiries(accountType, accountSlug);
                }else  if(func.equalsIgnoreCase(GET_RECEIVED_ENQUIRIES)){
                    outputArray = getReceivedEnquiries(accountType, accountSlug);
                }else  if(func.equalsIgnoreCase(VIEW_ENQUIRY)){
                    id = (String) input.get("id");
                    output = viewEnquiry(accountType, accountSlug,id);
                }else  if(func.equalsIgnoreCase(CANCEL_ENQUIRY)){
                    id = (String) input.get("id");
                    boolean cancelled = changeEnquiryStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else  if(func.equalsIgnoreCase(GET_RECOMMENDED_ENQUIRIES)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedEnquiries(accountType, accountSlug, pg);
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

    public boolean addEnquiry(String accountType, String accountSlug, JSONObject input){
        boolean added = false;
        String enquiryType = (String) input.get("enquiry_type");
        String title = (String) input.get("title");
        String query = (String) input.get("query");
        String[] toBusinesses = (String[]) JSONUtil.toStringArray((JSONArray) input.get("to_businesses"));
        String[] toProfessionals = (String[]) JSONUtil.toStringArray((JSONArray) input.get("to_professionals"));
        int discoverable = (int)(long) input.get("discoverable");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            postedBy = (String) userDetails.get("org_name");
        }else{
            postedBy = (String) userDetails.get("name");
        }
        int anonymous = (int)(long) input.get("anonymous");
        if(anonymous == 1){
            postedBy = Constants.ANONYMOUS_PERSONA;
        }
        try{
            int enquiryId = 0;
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            String enquiryuuid = UUID.randomUUID().toString();
            // Insert Enquiry
            String sql = "INSERT INTO _enquiry (enquiry_type,title,query,from_account_type,from_account_slug,discoverable,txy_offered,txy_offered_vector,posted_by,uuid) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, enquiryType);
            pstmt.setString(2, title);
            pstmt.setString(3, query);
            pstmt.setString(4, accountType);
            pstmt.setString(5, accountSlug);
            pstmt.setInt(6, discoverable);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(7, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(8, txyOfferedVectorObject);
            pstmt.setString(9, postedBy);
            pstmt.setString(10, enquiryuuid);
            pstmt.executeUpdate();
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                enquiryId = rs.getInt(1);
            }

            if(enquiryId>0) {
                for (int i = 0; i < toBusinesses.length; i++) {
                    String sql2 = "INSERT INTO _enquiry_recipients (enquiry_id,sender_name,account_type,account_slug) VALUES (?, ?, ?, ?)";
                    PreparedStatement pstmt2 = conn.prepareStatement(sql2);
                    pstmt2.setInt(1, enquiryId);
                    pstmt2.setString(2, postedBy);
                    pstmt2.setString(3, Constants.BUSINESS_ACCOUNT_TYPE);
                    pstmt2.setString(4, toBusinesses[i]);
                    pstmt2.executeUpdate();
                    new Notification().addNotification(accountType, accountSlug, Constants.ENQUIRY_NOTIFICATION, Constants.DISPLAY_ENQUIRY+" - "+ title, Constants.ENQUIRY_CONTENT_TYPE,enquiryuuid,Constants.BUSINESS_ACCOUNT_TYPE,toBusinesses[i],postedBy);
                }

                for (int j = 0; j < toProfessionals.length; j++) {
                    String sql3 = "INSERT INTO _enquiry_recipients (enquiry_id,sender_name,account_type,account_slug) VALUES (?, ?, ?, ?)";
                    PreparedStatement pstmt3 = conn.prepareStatement(sql3);
                    pstmt3.setInt(1, enquiryId);
                    pstmt3.setString(2, postedBy);
                    pstmt3.setString(3, Constants.PROFESSIONAL_ACCOUNT_TYPE);
                    pstmt3.setString(4, toProfessionals[j]);
                    pstmt3.executeUpdate();
                    new Notification().addNotification(accountType, accountSlug, Constants.ENQUIRY_NOTIFICATION, Constants.DISPLAY_ENQUIRY+" - "+title, Constants.ENQUIRY_CONTENT_TYPE,enquiryuuid,Constants.PROFESSIONAL_ACCOUNT_TYPE,toProfessionals[j],postedBy);
                }
            }
            if(discoverable==1) {
                new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_ENQUIRY+" - " + title, query, Constants.ENQUIRY_CONTENT_TYPE, enquiryuuid, Constants.ENQUIRY_COMMUNITY_SECTION, txyOffered);
            }
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public JSONArray getSentEnquiries(String accountType, String accountSlug){
        JSONArray enquiryList = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,from_account_type,from_account_slug,title,query,created from _enquiry where from_account_type='"+accountType+"' and from_account_slug='"+accountSlug+"' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("query", rs.getString("query"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                enquiryList.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return enquiryList;
    }

    public JSONArray getReceivedEnquiries(String accountType, String accountSlug){
        JSONArray enquiryList = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select e.uuid,e.posted_by,e.from_account_type,e.from_account_slug,e.title,e.query,e.created from _enquiry e,_enquiry_recipients er where e.enquiry_id=er.enquiry_id and er.account_type=? and er.account_slug=? ORDER BY created desc");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("query", rs.getString("query"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                enquiryList.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return enquiryList;
    }

    public JSONObject viewEnquiry(String accountType, String accountSlug, String uuid){
        JSONObject enquiry = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String fromAccountType = null;
        String fromAccountSlug = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select from_account_type,from_account_slug,title,query,created from _enquiry where uuid='"+uuid+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                enquiry.put("title", rs.getString("title"));
                enquiry.put("query", rs.getString("query"));
                enquiry.put("created",rs.getTimestamp("created").toString());
                fromAccountType = rs.getString("from_account_type");
                fromAccountSlug = rs.getString("from_account_slug");
                enquiry.put("is_content_owner",User.isContentOwner(accountType,accountSlug,fromAccountType,fromAccountSlug));
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

    public boolean changeEnquiryStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _enquiry set status=? where uuid=?";
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

        if(changed){
            new Community().changeCommunityFeedStatus(Constants.ENQUIRY_CONTENT_TYPE, uuid, status);
        }
        return changed;
    }

    public JSONArray getRecommendedEnquiries(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        String sql = null;

        HashMap userDetails = User.getUserDetails(accountType,accountSlug);

        String[] taxonomyInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("txy_interested"));
        double[] queryVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), taxonomyInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);

        int offset = 0;
        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        Connection con = null;
        JSONObject jsob = null;
        con = new PoolDB().getConnection();
        sql = "SELECT uuid,posted_by,title,query,created,txy_offered,from_account_type,from_account_slug from _enquiry WHERE status=? and from_account_type <> ? and from_account_slug <> ? ORDER BY created desc,txy_offered_vector <#> ?::vector LIMIT ? OFFSET ?";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, accountType);
            pstmt.setString(3, accountSlug);
            pstmt.setString(4, vectorString);
            pstmt.setInt(5, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(6,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("id", rs.getString("uuid"));
                    jsob.put("posted_by", rs.getString("posted_by"));
                    jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                    jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                    jsob.put("title", rs.getString("title"));
                    jsob.put("query", rs.getString("query"));
                    jsob.put("posted", rs.getTimestamp("created").toString());
                    Instant instant = rs.getTimestamp("created").toInstant();
                    String timeAgo = DBUtil.getTimeAgo(instant);
                    jsob.put("time_ago",timeAgo);
                    recommendations.add(jsob);
                }
            }
        }
        return recommendations;
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
