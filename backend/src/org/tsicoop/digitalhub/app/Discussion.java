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

public class Discussion implements REST {

    private static final String FUNCTION = "_func";
    private static final String ADD_DISCUSSION = "add_discussion";
    private static final String GET_DISCUSSION_THREAD = "get_discussion_thread";

    private static final String GET_RECOMMENDED_DISCUSSIONS = "get_recommended_discussions";

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
                if(func.equalsIgnoreCase(ADD_DISCUSSION)){
                    boolean added = addDiscussion(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else if(func.equalsIgnoreCase(GET_DISCUSSION_THREAD)){
                    outputArray = getDiscussionThread(input);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_DISCUSSIONS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedDiscussions(accountType, accountSlug, pg);
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

    public boolean addDiscussion(String fromAccountType, String fromAccountSlug, JSONObject input){
        boolean added = false;
        String toAccountType = (String) input.get("to_account_type");
        String toAccountSlug = (String) input.get("to_account_slug");
        String contentType = (String) input.get("content_type");
        String contentId = (String) input.get("content_id");
        String parentUUID  = (String) input.get("parent_uuid");
        String discussion = (String) input.get("discussion");
        String discussionUUID = UUID.randomUUID().toString();
        HashMap userDetails = null;
        String postedBy = null;
        userDetails = User.getUserDetails(fromAccountType,fromAccountSlug);
        if(fromAccountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
              postedBy = (String) userDetails.get("org_name");
        }else{
              postedBy = (String) userDetails.get("name");
        }
        String[] txyOffered = getTxyOffered(contentType, contentId);
        try{
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            String sql = "INSERT INTO _discussion (content_type,content_uuid,parent_uuid,discussion_note,from_account_type,from_account_slug,to_account_type,to_account_slug,posted_by,uuid,txy_offered,txy_offered_vector) VALUES (?, ?, ?, ?, ?,?,?,?,?,?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, contentType);
            pstmt.setString(2, contentId);
            pstmt.setString(3, parentUUID);
            pstmt.setString(4, discussion);
            pstmt.setString(5, fromAccountType);
            pstmt.setString(6, fromAccountSlug);
            pstmt.setString(7, toAccountType);
            pstmt.setString(8, toAccountSlug);
            pstmt.setString(9, postedBy);
            pstmt.setString(10, discussionUUID);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(11, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(12, txyOfferedVectorObject);
            pstmt.executeUpdate();
            //new Review().addReview(fromAccountType, fromAccountSlug, contentType, discussionUUID);
            new Notification().addNotification(fromAccountType, fromAccountSlug, Constants.COMMENT_NOTIFICATION, Constants.DISPLAY_COMMENT+" - "+discussion, contentType,contentId,toAccountType,toAccountSlug,postedBy);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public String[] getTxyOffered(String contentType, String contentUUID) {
        String[] txyOffered = {};
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String table = null;

        if(contentType.equals(Constants.ENQUIRY_CONTENT_TYPE)){
            table = "_enquiry";
        }else if(contentType.equals(Constants.RFP_CONTENT_TYPE)){
            table = "_rfp";
        }else if(contentType.equals(Constants.SOLUTION_CONTENT_TYPE)){
            table = "_solution";
        }else if(contentType.equals(Constants.SERVICE_CONTENT_TYPE)){
            table = "_service";
        }else if(contentType.equals(Constants.TRAINING_CONTENT_TYPE)){
            table = "_training";
        }else if(contentType.equals(Constants.JOB_CONTENT_TYPE)){
            table = "_job";
        }else if(contentType.equals(Constants.POST_CONTENT_TYPE)){
            table = "_post";
        }else if(contentType.equals(Constants.MEETUP_CONTENT_TYPE)){
            table = "_meetup";
        }else if(contentType.equals(Constants.TESTIMONIAL_CONTENT_TYPE)){
            table = "_testimonial";
        }

        if(table != null) {
            try {
                con = new PoolDB().getConnection();
                buff = new StringBuffer();
                buff.append("select txy_offered from " + table + " where uuid=?");
                pstmt = con.prepareStatement(buff.toString());
                pstmt.setString(1, contentUUID);
                rs = pstmt.executeQuery();
                if (rs.next()) {
                    txyOffered = (String[]) rs.getArray("txy_offered").getArray();
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                PoolDB.close(rs);
                PoolDB.close(pstmt);
                PoolDB.close(con);
            }
        }
        return txyOffered;
    }

    public JSONArray getRecommendedDiscussions(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        String sql = null;
        int offset = 0;
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String[] taxonomyInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("txy_interested"));
        double[] queryVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), taxonomyInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);

        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        Connection con = null;
        JSONObject jsob = null;
        con = new PoolDB().getConnection();
        sql = "SELECT uuid,posted_by,content_type,content_uuid,discussion_note,created,from_account_type,from_account_slug from _discussion where content_type NOT IN ('SUPPORT') ORDER BY created desc,txy_offered_vector <#> ?::vector LIMIT ? OFFSET ?";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, vectorString);
            pstmt.setInt(2, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(3,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("id", rs.getString("uuid"));
                    jsob.put("posted_by", rs.getString("posted_by"));
                    jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                    jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                    jsob.put("content_type", rs.getString("content_type"));
                    jsob.put("content_uuid", rs.getString("content_uuid"));
                    jsob.put("discussion_note", StringUtil.linkifyUrls(rs.getString("discussion_note")));
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

    public JSONArray getDiscussionThread(JSONObject input){
        JSONArray testimonials = new JSONArray();
        String contentType = (String) input.get("content_type");
        String contentId = (String) input.get("content_id");
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,content_type,content_uuid,parent_uuid,discussion_note,created from _discussion where content_type=? and content_uuid=? order by created");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,contentType);
            pstmt.setString(2,contentId);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("content_type", rs.getString("content_type"));
                jsob.put("content_id", rs.getString("content_uuid"));
                jsob.put("parent_uuid", rs.getString("parent_uuid"));
                jsob.put("discussion_note", StringUtil.linkifyUrls(rs.getString("discussion_note")));
                jsob.put("created",rs.getTimestamp("created").toString());
                testimonials.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return testimonials;
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
