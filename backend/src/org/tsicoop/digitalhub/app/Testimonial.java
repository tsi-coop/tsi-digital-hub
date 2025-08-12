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

public class Testimonial implements REST {

    private static final String FUNCTION = "_func";
    private static final String ADD_TESTIMONIAL = "add_testimonial";
    private static final String GET_RECEIVED_TESTIMONIALS = "get_received_testimonials";
    private static final String GET_SENT_TESTIMONIALS = "get_sent_testimonials";

    private static final String VIEW_TESTIMONIAL = "view_testimonial";

    private static final String GET_RECOMMENDED_TESTIMONIALS = "get_recommended_testimonials";

    private static final String CANCEL_TESTIMONIAL = "cancel_testimonial";

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
                if(func.equalsIgnoreCase(ADD_TESTIMONIAL)){
                    boolean added = addTestimonial(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }
                else  if(func.equalsIgnoreCase(GET_RECEIVED_TESTIMONIALS)){
                    outputArray = getReceivedTestimonials(accountType, accountSlug);
                }
                else  if(func.equalsIgnoreCase(GET_SENT_TESTIMONIALS)){
                    outputArray = getSentTestimonials(accountType, accountSlug);
                }
                else  if(func.equalsIgnoreCase(VIEW_TESTIMONIAL)){
                    id = (String) input.get("id");
                    output = viewTestimonial(id);
                }
                else  if(func.equalsIgnoreCase(CANCEL_TESTIMONIAL)){
                    id = (String) input.get("id");
                    boolean cancelled = changeTestimonialStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }
                else  if(func.equalsIgnoreCase(GET_RECOMMENDED_TESTIMONIALS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedTestimonials(accountType, accountSlug, pg);
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

    public boolean addTestimonial(String fromAccountType, String fromAccountSlug, JSONObject input){
        boolean added = false;
        String toAccountType = (String) input.get("to_account_type");
        String toAccountSlug = (String) input.get("to_account_slug");
        String testimonialType = (String) input.get("testimonial_type");
        String testimonial = (String) input.get("testimonial");
        String testimonialUUID = UUID.randomUUID().toString();
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        HashMap userDetails = User.getUserDetails(fromAccountType,fromAccountSlug);
        String postedBy = null;
        if(fromAccountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
             postedBy = (String) userDetails.get("org_name");
        }else{
             postedBy = (String) userDetails.get("name");
        }
        try{
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _testimonial (testimonial_type,testimonial,from_account_type,from_account_slug,to_account_type,to_account_slug,posted_by,uuid,txy_offered,txy_offered_vector) VALUES (?, ?, ?, ?, ?,?,?,?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, testimonialType);
            pstmt.setString(2, testimonial);
            pstmt.setString(3, fromAccountType);
            pstmt.setString(4, fromAccountSlug);
            pstmt.setString(5, toAccountType);
            pstmt.setString(6, toAccountSlug);
            pstmt.setString(7, postedBy);
            pstmt.setString(8, testimonialUUID);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(9, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(10, txyOfferedVectorObject);
            pstmt.executeUpdate();
            new Community().addCommunityFeed(fromAccountType, fromAccountSlug, postedBy, Constants.DISPLAY_TESTIMONIAL+" from "+postedBy, testimonial, Constants.TESTIMONIAL_CONTENT_TYPE, testimonialUUID, Constants.TESTIMONIAL_COMMUNITY_SECTION, txyOffered);
            new Notification().addNotification(fromAccountType, fromAccountSlug, Constants.TESTIMONIAL_NOTIFICATION, Constants.DISPLAY_TESTIMONIAL+" - "+testimonial, Constants.TESTIMONIAL_CONTENT_TYPE,testimonialUUID,toAccountType,toAccountSlug,postedBy);
            //new Review().addReview(fromAccountType, fromAccountSlug, Constants.TESTIMONIAL_CONTENT_TYPE, testimonialUUID);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public JSONArray getReceivedTestimonials(String accountType, String accountSlug){
        //System.out.println("Inside getReceivedTestimonials:"+accountType+" "+accountSlug);
        JSONArray testimonials = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,from_account_type,from_account_slug,testimonial_type,testimonial,created from _testimonial where to_account_type=? and to_account_slug=?");
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
                jsob.put("type", rs.getString("testimonial_type"));
                jsob.put("testimonial", rs.getString("testimonial"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
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

    public JSONArray getSentTestimonials(String accountType, String accountSlug){
        //System.out.println("Inside getReceivedTestimonials:"+accountType+" "+accountSlug);
        JSONArray testimonials = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,from_account_type,from_account_slug,testimonial_type,testimonial,created from _testimonial where from_account_type=? and from_account_slug=?");
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
                jsob.put("type", rs.getString("testimonial_type"));
                jsob.put("testimonial", rs.getString("testimonial"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
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

    public JSONObject viewTestimonial(String uuid){
        JSONObject enquiry = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select testimonial_type,testimonial,created from _testimonial where uuid='"+uuid+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                enquiry.put("testimonial_type", rs.getString("testimonial_type"));
                enquiry.put("testimonial", rs.getString("testimonial"));
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

    public boolean changeTestimonialStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _testimonial set status=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            new Community().changeCommunityFeedStatus(Constants.TESTIMONIAL_CONTENT_TYPE, uuid, status);
            changed = true;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return changed;
    }

    public JSONArray getRecommendedTestimonials(String accountType, String accountSlug, int pg) throws Exception {
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
        sql = "SELECT uuid,posted_by,testimonial,created,txy_offered,from_account_type,from_account_slug from _testimonial where status=? and from_account_type <> ? and from_account_slug <> ? ORDER BY created desc,txy_offered_vector <#> ?::vector LIMIT ? OFFSET ?";
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
                    jsob.put("title", "A testimonial from "+ rs.getString("posted_by"));
                    jsob.put("testimonial", rs.getString("testimonial"));
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
