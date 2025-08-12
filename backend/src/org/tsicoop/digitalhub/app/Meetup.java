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
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

public class Meetup implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_MY_MEETUPS = "get_my_meetups"; // for creators

    private static final String VIEW_MEETUP = "view_meetup";
    private static final String EDIT_MEETUP = "edit_meetup";
    private static final String ADD_MEETUP = "add_meetup";

    private static final String CANCEL_MEETUP = "cancel_meetup";

    private static final String GET_RECOMMENDED_MEETUPS = "get_recommended_meetups";

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
                if(func.equalsIgnoreCase(ADD_MEETUP)){
                    output = addMeetup(accountType, accountSlug, input);
                }else if(func.equalsIgnoreCase(GET_MY_MEETUPS)){
                    outputArray = getMyMeetups(accountType,accountSlug);
                }else if(func.equalsIgnoreCase(VIEW_MEETUP)){
                    String id =  (String) input.get("id");
                    output = viewMeetup(id);
                }else if(func.equalsIgnoreCase(EDIT_MEETUP)){
                    output = editMeetup(input);
                }else  if(func.equalsIgnoreCase(CANCEL_MEETUP)){
                    String id = (String) input.get("id");
                    boolean cancelled = changeMeetupStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else  if(func.equalsIgnoreCase(GET_RECOMMENDED_MEETUPS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedMeetups(accountType, accountSlug, pg);
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

    public JSONObject addMeetup(String accountType, String accountSlug, JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean added = false;

        HashMap userDetails = null;
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            userDetails = new Org().getOrgDetails(accountSlug);
            postedBy = (String) userDetails.get("org_name");
        }else{
            userDetails = new Talent().getTalentDetails(accountSlug);
            postedBy = (String) userDetails.get("name");
        }

        String type = (String) input.get("type");
        String title = (String) input.get("title");
        String description = (String) input.get("description");
        String meetingDate = (String) input.get("meeting_date");
        String meetingTime = (String) input.get("meeting_time");
        String meetingLink = (String) input.get("meeting_link");
        String meetingCity = (String) input.get("meeting_city");
        String meetingState = (String) input.get("meeting_state");
        String meetingAddress = (String) input.get("meeting_address");
        String meetingGeoLink = (String) input.get("meeting_geo_link");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            java.util.Date utilDate = formatter.parse(meetingDate);
            java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
            String meetupUUID = UUID.randomUUID().toString();
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _meetup (type,title,description,meeting_date,meeting_time,meeting_link,meeting_city,meeting_state,meeting_address,meeting_geo_link,txy_offered,txy_offered_vector,from_account_type,from_account_slug,uuid,posted_by) VALUES (?, ?, ?, ?,?, ?,?,?,?,?,?,?,?,?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, type);
            pstmt.setString(2, title);
            pstmt.setString(3, description);
            pstmt.setDate(4, sqlDate);
            pstmt.setString(5, meetingTime);
            pstmt.setString(6, meetingLink);
            pstmt.setString(7, meetingCity);
            pstmt.setString(8, meetingState);
            pstmt.setString(9, meetingAddress);
            pstmt.setString(10, meetingGeoLink);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(11, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(12, txyOfferedVectorObject);
            pstmt.setString(13, accountType);
            pstmt.setString(14, accountSlug);
            pstmt.setString(15, meetupUUID);
            pstmt.setString(16, postedBy);
            pstmt.executeUpdate();
            new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_MEETUP+" - "+title, description, Constants.MEETUP_CONTENT_TYPE, meetupUUID, Constants.MEETUPS_COMMUNITY_SECTION, txyOffered);
            //new Review().addReview(accountType, accountSlug, Constants.MEETUP_CONTENT_TYPE, meetupUUID);
            added = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("added",added);
        return jsob;
    }

    public static JSONArray getMyMeetups(String accountType, String accountSlug){
        JSONArray posts = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,type,title,description,meeting_date,meeting_time,meeting_link,meeting_city,meeting_state,meeting_address,meeting_geo_link,txy_offered,from_account_type,from_account_slug,created from _meetup where from_account_type='"+accountType+"' and from_account_slug='"+accountSlug+"' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("type", rs.getString("type"));
                jsob.put("title", rs.getString("title"));
                jsob.put("description", rs.getString("description"));
                jsob.put("meeting_date", rs.getString("meeting_date"));
                jsob.put("meeting_time", rs.getString("meeting_time"));
                jsob.put("meeting_link", rs.getString("meeting_link"));
                jsob.put("meeting_city", rs.getString("meeting_city"));
                jsob.put("meeting_state", rs.getString("meeting_state"));
                jsob.put("meeting_address", rs.getString("meeting_address"));
                jsob.put("meeting_geo_link", rs.getString("meeting_geo_link"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                String[] txyOffered = (String[]) rs.getArray("txy_offered").getArray();
                jsob.put("taxonomies_offered",JSONUtil.toJSONArray(txyOffered));
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

    public static JSONObject viewMeetup(String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,type,title,description,meeting_date,meeting_time,meeting_link,meeting_city,meeting_state,meeting_address,meeting_geo_link,txy_offered,from_account_type,from_account_slug,created from _meetup where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("type", rs.getString("type"));
                jsob.put("title", rs.getString("title"));
                jsob.put("description", rs.getString("description"));
                jsob.put("meeting_date", rs.getString("meeting_date"));
                jsob.put("meeting_time", rs.getString("meeting_time"));
                jsob.put("meeting_link", rs.getString("meeting_link"));
                jsob.put("meeting_city", rs.getString("meeting_city"));
                jsob.put("meeting_state", rs.getString("meeting_state"));
                jsob.put("meeting_address", rs.getString("meeting_address"));
                jsob.put("meeting_geo_link", rs.getString("meeting_geo_link"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                String[] txyOffered = (String[]) rs.getArray("txy_offered").getArray();
                jsob.put("taxonomies_offered",JSONUtil.toJSONArray(txyOffered));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return jsob;
    }

    public boolean changeMeetupStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _meetup set status=? where uuid=?";
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
            new Community().changeCommunityFeedStatus(Constants.MEETUP_CONTENT_TYPE, uuid, status);
        }
        return changed;
    }

    public JSONObject editMeetup(JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean edited = false;
        String id = (String) input.get("id");
        String type = (String) input.get("type");
        String title = (String) input.get("title");
        String description = (String) input.get("description");
        String meetingDate = (String) input.get("meeting_date");
        String meetingTime = (String) input.get("meeting_time");
        String meetingLink = (String) input.get("meeting_link");
        String meetingCity = (String) input.get("meeting_city");
        String meetingState = (String) input.get("meeting_state");
        String meetingAddress = (String) input.get("meeting_address");
        String meetingGeoLink = (String) input.get("meeting_geo_link");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        try {
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            java.util.Date utilDate = formatter.parse(meetingDate);
            java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _meetup set type=?,title=?,description=?,meeting_date=?,meeting_time=?,meeting_link=?,meeting_city=?,meeting_state=?,meeting_address=?,meeting_geo_link=?,txy_offered=?,txy_offered_vector=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, type);
            pstmt.setString(2, title);
            pstmt.setString(3, description);
            pstmt.setDate(4, sqlDate);
            pstmt.setString(5, meetingTime);
            pstmt.setString(6, meetingLink);
            pstmt.setString(7, meetingCity);
            pstmt.setString(8, meetingState);
            pstmt.setString(9, meetingAddress);
            pstmt.setString(10, meetingGeoLink);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(11, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(12, txyOfferedVectorObject);
            pstmt.setString(13, id);
            pstmt.executeUpdate();
            edited = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("edited",edited);
        return jsob;
    }

    public JSONArray getRecommendedMeetups(String accountType, String accountSlug, int pg) throws Exception {
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
        sql = "SELECT uuid,posted_by,type,title,description,type,meeting_date,meeting_city,created,txy_offered,from_account_type,from_account_slug from _meetup where status=? ORDER BY txy_offered_vector <#> ?::vector,created desc LIMIT ? OFFSET ?";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, vectorString);
            pstmt.setInt(3, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(4,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("id", rs.getString("uuid"));
                    jsob.put("posted_by", rs.getString("posted_by"));
                    jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                    jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                    jsob.put("title", rs.getString("title"));
                    jsob.put("description", rs.getString("description"));
                    jsob.put("meeting_date", DBUtil.convertSqlDateToString(rs.getDate("meeting_date")));
                    jsob.put("type", rs.getString("type"));
                    jsob.put("meeting_city", rs.getString("meeting_city"));
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
