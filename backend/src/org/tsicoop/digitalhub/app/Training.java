package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.postgresql.util.PGobject;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.Masters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

public class Training implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_PROVIDER_TRAININGS = "get_provider_trainings";
    private static final String VIEW_TRAINING = "view_training";
    private static final String ADD_TRAINING = "add_training";
    private static final String EDIT_TRAINING = "edit_training";

    private static final String CANCEL_TRAINING = "cancel_training";

    private static final String GET_RECOMMENDED_TRAININGS = "get_recommended_trainings";

    private static final String SEARCH_TRAININGS = "search_trainings";

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
                if(func.equalsIgnoreCase(ADD_TRAINING)){
                    String email = InputProcessor.getEmail(req);
                    boolean added = addTraining(email, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_TRAININGS)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = getProviderTrainings(new Org().getAccountSlug(email));
                }else if(func.equalsIgnoreCase(VIEW_TRAINING)){
                    String id =  (String) input.get("id");
                    output = viewTraining(accountType,accountSlug,id);
                }else if(func.equalsIgnoreCase(EDIT_TRAINING)){
                    output = editTraining(input);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_TRAININGS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendations(accountType, accountSlug, pg);
                }else  if(func.equalsIgnoreCase(CANCEL_TRAINING)){
                    String id = (String) input.get("id");
                    boolean cancelled = changeTrainingStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else if(func.equalsIgnoreCase(SEARCH_TRAININGS)){
                    String query = (String) input.get("q");
                    outputArray = searchTrainings(StringUtil.formatSearchQuery(query));
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

    public boolean addTraining(String email, JSONObject input){
        boolean added = false;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;
        String accountSlug = new Org().getAccountSlug(email);
        HashMap userDetails = new Org().getOrgDetails(accountSlug);
        String postedBy = (String) userDetails.get("org_name");
        String trainingTitle = (String) input.get("training_title");
        String positioning = (String) input.get("positioning");
        String trainingLink = (String) input.get("training_link");
        String courseoutline = (String) input.get("course_outline");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int)(long) input.get("start_year");
        String num_students_range = (String) input.get("num_students_range");
        String industry = (String) input.get("industry");
        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");
        try {
            float[] geocode = Masters.geoGeoCode(state, city);
            float latitude = geocode[0];
            float longitude = geocode[1];
            String[] trainingsOffered = JSONUtil.toStringArray((JSONArray) input.get("trainings_offered"));
            String[] skillsOffered = JSONUtil.toStringArray((JSONArray) input.get("skills_offered"));
            double[] trainingsOfferedVector = RecoUtil.calculateVector(Masters.getTrainingList(), trainingsOffered);
            double[] skillsOfferedVector = RecoUtil.calculateVector(Masters.getSkillList(), skillsOffered);
            Connection conn = new PoolDB().getConnection();
            String trainingUUID = UUID.randomUUID().toString();
            // Insert Provider Solution
            String sql = "INSERT INTO _training (account_type,account_slug,title,positioning,course_outline,collaterals,start_year,num_students_range,industry_slug,state_slug,city_slug,trainings_offered,skills_offered,trainings_offered_vector,skills_offered_vector,visible,status,latitude,longitude,posted_by,training_link,uuid,tsv_body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,to_tsvector('english', ?))";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, accountType);
                pstmt.setString(2, accountSlug);
                pstmt.setString(3, trainingTitle);
                pstmt.setString(4, positioning);
                pstmt.setString(5, courseoutline);
                Array collateralsArray = conn.createArrayOf("text", collaterals);
                pstmt.setArray(6, collateralsArray);
                pstmt.setInt(7, start_year);
                pstmt.setString(8, num_students_range);
                pstmt.setString(9, industry);
                pstmt.setString(10, state);
                pstmt.setString(11, city);
                Array servicesOfferedArray = conn.createArrayOf("text", trainingsOffered);
                pstmt.setArray(12, servicesOfferedArray);
                Array skillsUsedArray = conn.createArrayOf("text", skillsOffered);
                pstmt.setArray(13, skillsUsedArray);
                PGobject servicesOfferedVectorObject = new PGobject();
                servicesOfferedVectorObject.setType("vector");
                servicesOfferedVectorObject.setValue(RecoUtil.vectorToString(trainingsOfferedVector));
                pstmt.setObject(14, servicesOfferedVectorObject);
                PGobject skillsUsedVectorObject = new PGobject();
                skillsUsedVectorObject.setType("vector");
                skillsUsedVectorObject.setValue(RecoUtil.vectorToString(skillsOfferedVector));
                pstmt.setObject(15, skillsUsedVectorObject);
                pstmt.setInt(16, 1);
                pstmt.setInt(17, Constants.APPROVED_STATUS);
                pstmt.setFloat(18, latitude);
                pstmt.setFloat(19, longitude);
                pstmt.setString(20, postedBy);
                pstmt.setString(21, trainingLink);
                pstmt.setString(22, trainingUUID);
                pstmt.setString(23, tsvBody(trainingTitle, positioning, courseoutline, industry, city, state, trainingsOffered, skillsOffered));
                pstmt.executeUpdate();
                String[] txyOffered = Masters.getTaxonomiesList(new String[0], new String[0], trainingsOffered, new String[0]);
                new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_TRAINING+" - "+trainingTitle, positioning, Constants.TRAINING_CONTENT_TYPE, trainingUUID, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyOffered);
                //new Review().addReview(accountType, accountSlug, Constants.TRAINING_CONTENT_TYPE, trainingUUID);
                added = true;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    private String tsvBody(String title, String positioning, String description, String industry, String city, String state, String[] trainingsOffered, String[] skillsOffered){
        StringBuffer buff = new StringBuffer();
        buff.append(title+" ");
        buff.append(positioning+" ");
        buff.append(description+" ");
        buff.append(industry+" ");
        buff.append(city+" ");
        buff.append(state+" ");
        buff.append(StringUtil.arrayToString(trainingsOffered));
        buff.append(StringUtil.arrayToString(skillsOffered));
        return buff.toString();
    }

    public boolean changeTrainingStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _training set status=? where uuid=?";
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
            new Community().changeCommunityFeedStatus(Constants.TRAINING_CONTENT_TYPE, uuid, status);
        }
        return changed;
    }

    public JSONArray getProviderTrainings(String accountSlug){
        JSONArray trainingList = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,account_type,account_slug,title,positioning,start_year,num_students_range,created from _training where account_type='"+accountType+"' and account_slug='"+accountSlug+"' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("start_year",rs.getInt("start_year"));
                jsob.put("num_students",rs.getString("num_students_range"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                trainingList.add(jsob);
            }
        }catch(Exception e) {
            e.printStackTrace();
        }finally
        {
            BatchDB.close(rs);
            BatchDB.close(stmt);
            BatchDB.close(con);
        }
        return trainingList;
    }

    public JSONObject viewTraining(String currentUserAccountType, String currentUserAccountSlug,String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select posted_by,account_type,account_slug,title,positioning,training_link,course_outline,collaterals,start_year,num_students_range,industry_slug,state_slug,city_slug,trainings_offered,skills_offered,created from _training where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("training_link", rs.getString("training_link"));
                jsob.put("course_outline", rs.getString("course_outline"));
                jsob.put("collaterals",rs.getString("collaterals"));
                jsob.put("start_year",rs.getInt("start_year"));
                jsob.put("num_students",rs.getString("num_students_range"));
                jsob.put("industry",rs.getString("industry_slug"));
                jsob.put("state",rs.getString("state_slug"));
                jsob.put("city",rs.getString("city_slug"));
                jsob.put("trainings_offered",rs.getString("trainings_offered"));
                jsob.put("skills_offered",rs.getString("skills_offered"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                jsob.put("is_content_owner",User.isContentOwner(currentUserAccountType,currentUserAccountSlug,rs.getString("account_type"),rs.getString("account_slug")));
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

    public JSONObject editTraining(JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean edited = false;
        String id = (String) input.get("id");
        String title = (String) input.get("training_title");
        String positioning = (String) input.get("positioning");
        String trainingLink = (String) input.get("training_link");
        String courseOutline = (String) input.get("course_outline");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int)(long) input.get("start_year");
        String num_students_range = (String) input.get("num_students_range");
        //System.out.println("num_students_range:"+num_students_range);
        String industry = (String) input.get("industry");
        String[] trainingsOffered = JSONUtil.toStringArray((JSONArray)input.get("trainings_offered"));
        String[] skillsOffered = JSONUtil.toStringArray((JSONArray) input.get("skills_offered"));
        try {
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _training set title=?,positioning=?,course_outline=?,collaterals=?,start_year=?,num_students_range=?,industry_slug=?,trainings_offered=?,skills_offered=?,training_link=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, title);
            pstmt.setString(2, positioning);
            pstmt.setString(3, courseOutline);
            Array collateralsArray = conn.createArrayOf("text", collaterals);
            pstmt.setArray(4, collateralsArray);
            pstmt.setInt(5, start_year);
            pstmt.setString(6, num_students_range);
            pstmt.setString(7, industry);
            Array trainingsOfferedArray = conn.createArrayOf("text", trainingsOffered);
            pstmt.setArray(8, trainingsOfferedArray);
            Array skillsOfferedArray = conn.createArrayOf("text", skillsOffered);
            pstmt.setArray(9, skillsOfferedArray);
            pstmt.setString(10, trainingLink);
            pstmt.setString(11, id);
            pstmt.executeUpdate();
            edited = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("edited",edited);
        return jsob;
    }

    public JSONArray getRecommendations(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String[] trainingsInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("trainings_interested"));
        double[] queryVector = RecoUtil.calculateVector(Masters.getTrainingList(), trainingsInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);
        //System.out.println(vectorString);
        int offset = 0;
        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }
        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid,posted_by,account_type,account_slug,title,positioning,start_year,num_students_range,created FROM _training where status=? ORDER BY trainings_offered_vector <#> ?::vector,created desc LIMIT ? OFFSET ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, vectorString);
            pstmt.setInt(3, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(4,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("id",rs.getString("uuid"));
                    reco.put("posted_by", rs.getString("posted_by"));
                    reco.put("posted_by_account_type", rs.getString("account_type"));
                    reco.put("posted_by_account_slug", rs.getString("account_slug"));
                    reco.put("title",rs.getString("title"));
                    reco.put("positioning",rs.getString("positioning"));
                    reco.put("start_year",rs.getInt("start_year"));
                    reco.put("num_students_range",rs.getString("num_students_range"));
                    Instant instant = rs.getTimestamp("created").toInstant();
                    String timeAgo = DBUtil.getTimeAgo(instant);
                    reco.put("time_ago",timeAgo);
                    recommendations.add(reco);
                }
            }
        }
        return recommendations;
    }

    public JSONArray searchTrainings(String query) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid,posted_by,account_type,account_slug,title,positioning,start_year,num_students_range,created FROM _training WHERE tsv_body @@ to_tsquery('english', ?) LIMIT ?";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, query);
            pstmt.setInt(2, 20);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("id",rs.getString("uuid"));
                    reco.put("posted_by", rs.getString("posted_by"));
                    reco.put("posted_by_account_type", rs.getString("account_type"));
                    reco.put("posted_by_account_slug", rs.getString("account_slug"));
                    reco.put("title",rs.getString("title"));
                    reco.put("positioning",rs.getString("positioning"));
                    reco.put("start_year",rs.getInt("start_year"));
                    reco.put("num_students_range",rs.getString("num_students_range"));
                    Instant instant = rs.getTimestamp("created").toInstant();
                    String timeAgo = DBUtil.getTimeAgo(instant);
                    reco.put("time_ago",timeAgo);
                    recommendations.add(reco);
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
