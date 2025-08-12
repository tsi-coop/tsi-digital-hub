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

public class Solution implements REST {

    private static final String FUNCTION = "_func";

    private static final String VIEW_SOLUTION = "view_solution";

    private static final String EDIT_SOLUTION = "edit_solution";
    private static final String ADD_SOLUTION = "add_solution";
    private static final String GET_PROVIDER_SOLUTIONS = "get_provider_solutions";

    private static final String GET_RECOMMENDED_SOLUTIONS = "get_recommended_solutions";

    private static final String CANCEL_SOLUTION = "cancel_solution";

    private static final String SEARCH_SOLUTIONS = "search_solutions";

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
                if(func.equalsIgnoreCase(ADD_SOLUTION)){
                    String email = InputProcessor.getEmail(req);
                    boolean added = addSolution(email, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_SOLUTIONS)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = new Solution().getProviderSolutions(new Org().getAccountSlug(email));
                }else if(func.equalsIgnoreCase(VIEW_SOLUTION)){
                    String id =  (String) input.get("id");
                    output = viewSolution(accountType, accountSlug,id);
                }else if(func.equalsIgnoreCase(EDIT_SOLUTION)){
                    output = editSolution(input);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_SOLUTIONS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendations(accountType, accountSlug, pg);
                }else  if(func.equalsIgnoreCase(CANCEL_SOLUTION)){
                    String id = (String) input.get("id");
                    boolean cancelled = changeSolutionStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else if(func.equalsIgnoreCase(SEARCH_SOLUTIONS)){
                    String query = (String) input.get("q");
                    outputArray = searchSolutions(StringUtil.formatSearchQuery(query));
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

    public boolean addSolution(String email, JSONObject input){
        boolean added = false;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;
        String accountSlug = new Org().getAccountSlug(email);
        HashMap userDetails = new Org().getOrgDetails(accountSlug);
        String postedBy = (String) userDetails.get("org_name");
        String solutionTitle = (String) input.get("solution_title");
        String positioning = (String) input.get("positioning");
        String features = (String) input.get("features");
        String benefits = (String) input.get("benefits");
        String solutionLink = (String) input.get("solution_link");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int)(long) input.get("start_year");
        String num_customers_range = (String) input.get("num_customers_range");
        String industry = (String) input.get("industry");
        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");
        String[] solutionsOffered = JSONUtil.toStringArray((JSONArray)input.get("solutions_offered"));
        String[] skillsUsed = JSONUtil.toStringArray((JSONArray) input.get("skills_used"));


        try {
            float[] geocode = Masters.geoGeoCode(state, city);
            float latitude = geocode[0];
            float longitude = geocode[1];

            double[] solutionsOfferedVector = RecoUtil.calculateVector(Masters.getSolutionList(), solutionsOffered);
            double[] skillsUsedVector = RecoUtil.calculateVector(Masters.getSkillList(), skillsUsed);
            String solutionuuid = UUID.randomUUID().toString();
            Connection conn = new PoolDB().getConnection();

            // Insert Provider Solution
            String sql = "INSERT INTO _solution (account_type,account_slug,title,positioning,features,benefits,collaterals,start_year,num_customers_range,industry_slug,state_slug,city_slug,solutions_offered,skills_used,solutions_offered_vector,skills_used_vector,visible,status,latitude,longitude,posted_by,solution_link,uuid,tsv_body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,to_tsvector('english', ?))";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, accountType);
                pstmt.setString(2, accountSlug);
                pstmt.setString(3, solutionTitle);
                pstmt.setString(4, positioning);
                pstmt.setString(5, features);
                pstmt.setString(6, benefits);
                Array collateralsArray = conn.createArrayOf("text", collaterals);
                pstmt.setArray(7, collateralsArray);
                pstmt.setInt(8, start_year);
                pstmt.setString(9, num_customers_range);
                pstmt.setString(10, industry);
                pstmt.setString(11, state);
                pstmt.setString(12, city);
                Array solutionsOfferedArray = conn.createArrayOf("text", solutionsOffered);
                pstmt.setArray(13, solutionsOfferedArray);
                Array skillsUsedArray = conn.createArrayOf("text", skillsUsed);
                pstmt.setArray(14, skillsUsedArray);
                PGobject solutionsOfferedVectorObject = new PGobject();
                solutionsOfferedVectorObject.setType("vector");
                solutionsOfferedVectorObject.setValue(RecoUtil.vectorToString(solutionsOfferedVector));
                pstmt.setObject(15, solutionsOfferedVectorObject);
                PGobject skillsUsedVectorObject = new PGobject();
                skillsUsedVectorObject.setType("vector");
                skillsUsedVectorObject.setValue(RecoUtil.vectorToString(skillsUsedVector));
                pstmt.setObject(16, skillsUsedVectorObject);
                pstmt.setInt(17, 1);
                pstmt.setInt(18, Constants.APPROVED_STATUS);
                pstmt.setFloat(19, latitude);
                pstmt.setFloat(20, longitude);
                pstmt.setString(21, postedBy);
                pstmt.setString(22, solutionLink);
                pstmt.setString(23, solutionuuid);
                pstmt.setString(24, tsvBody(solutionTitle, positioning, features, benefits, industry, city, state, solutionsOffered));
                pstmt.executeUpdate();
                String[] txyOffered = Masters.getTaxonomiesList(solutionsOffered, new String[0], new String[0], new String[0]);
                new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_SOLUTION+" - "+solutionTitle, positioning, Constants.SOLUTION_CONTENT_TYPE, solutionuuid, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyOffered);
                //new Review().addReview(accountType, accountSlug, Constants.SOLUTION_CONTENT_TYPE, solutionuuid);
                added = true;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }
    private String tsvBody(String title, String positioning, String features, String benefits, String industry, String city, String state, String[] solutionsOffered){
        StringBuffer buff = new StringBuffer();
        buff.append(title+" ");
        buff.append(positioning+" ");
        buff.append(features+" ");
        buff.append(benefits+" ");
        buff.append(industry+" ");
        buff.append(city+" ");
        buff.append(state+" ");
        buff.append(StringUtil.arrayToString(solutionsOffered));
        return buff.toString();
    }

    private String communityBody(String positioning, String features, String benefits){
        StringBuffer buff = new StringBuffer();
        buff.append("`");
        buff.append("<p>");
        buff.append(positioning+"<br/><br/>");
        buff.append("Features: "+"<br/>");
        buff.append(features+"<br/><br/>");
        buff.append("Benefits: "+"<br/>");
        buff.append(benefits+" ");
        buff.append("</p>");
        buff.append("`");
        return buff.toString();
    }

    public JSONObject editSolution(JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean edited = false;
        String id = (String) input.get("id");
        String solutionTitle = (String) input.get("solution_title");
        String positioning = (String) input.get("positioning");
        String features = (String) input.get("features");
        String benefits = (String) input.get("benefits");
        String solutionLink = (String) input.get("solution_link");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int)(long) input.get("start_year");
        String num_customers_range = (String) input.get("num_customers_range");
        String industry = (String) input.get("industry");
        String[] solutionsOffered = JSONUtil.toStringArray((JSONArray)input.get("solutions_offered"));
        String[] skillsUsed = JSONUtil.toStringArray((JSONArray) input.get("skills_used"));
        try {
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _solution set title=?,positioning=?,features=?,benefits=?,collaterals=?,start_year=?,num_customers_range=?,industry_slug=?,solutions_offered=?,skills_used=?,solution_link=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, solutionTitle);
            pstmt.setString(2, positioning);
            pstmt.setString(3, features);
            pstmt.setString(4, benefits);
            Array collateralsArray = conn.createArrayOf("text", collaterals);
            pstmt.setArray(5, collateralsArray);
            pstmt.setInt(6, start_year);
            pstmt.setString(7, num_customers_range);
            pstmt.setString(8, industry);
            Array solutionsOfferedArray = conn.createArrayOf("text", solutionsOffered);
            pstmt.setArray(9, solutionsOfferedArray);
            Array skillsUsedArray = conn.createArrayOf("text", skillsUsed);
            pstmt.setArray(10, skillsUsedArray);
            pstmt.setString(11, solutionLink);
            pstmt.setString(12, id);
            pstmt.executeUpdate();
            edited = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("edited",edited);
        return jsob;
    }

    public boolean changeSolutionStatus(String uuid, int status){
        boolean added = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _solution set status=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            new Community().changeCommunityFeedStatus(Constants.SOLUTION_CONTENT_TYPE, uuid, status);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return added;
    }

    public JSONArray getProviderSolutions(String accountSlug){
        JSONArray solutionList = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;
        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,account_type,account_slug,title,positioning,start_year,num_customers_range,created from _solution where account_type='"+accountType+"' and account_slug='"+accountSlug+"' ORDER BY created desc");
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
                jsob.put("num_customers",rs.getString("num_customers_range"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                solutionList.add(jsob);
            }
        }catch(Exception e) {
            e.printStackTrace();
        }finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return solutionList;
    }

    public JSONArray searchSolutions(String query){
        JSONArray solutionList = new JSONArray();
        PreparedStatement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;
        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,account_type,account_slug,title,positioning,start_year,num_customers_range,created from _solution where tsv_body @@ to_tsquery('english', ?)");
            stmt = con.prepareStatement(buff.toString());
            stmt.setString(1,query);
            rs = stmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("start_year",rs.getInt("start_year"));
                jsob.put("num_customers",rs.getString("num_customers_range"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                solutionList.add(jsob);
            }
        }catch(Exception e) {
            e.printStackTrace();
        }finally {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return solutionList;
    }

    public JSONObject viewSolution(String currentUserAccountType, String currentUserAccountSlug, String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select posted_by,account_type,account_slug,title,positioning,features,benefits,solution_link,collaterals,start_year,num_customers_range,industry_slug,state_slug,city_slug,solutions_offered,skills_used,created from _solution where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("features", rs.getString("features"));
                jsob.put("benefits", rs.getString("benefits"));
                jsob.put("solution_link", rs.getString("solution_link"));
                jsob.put("collaterals",rs.getString("collaterals"));
                jsob.put("start_year",rs.getInt("start_year"));
                jsob.put("num_customers",rs.getString("num_customers_range"));
                jsob.put("industry",rs.getString("industry_slug"));
                jsob.put("state",rs.getString("state_slug"));
                jsob.put("city",rs.getString("city_slug"));
                jsob.put("solutions_offered",rs.getString("solutions_offered"));
                jsob.put("skills_used",rs.getString("skills_used"));
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

    public JSONArray getRecommendations(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        HashMap userDetails = User.getUserDetails(accountType,accountSlug);

        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");
        String[] solutionsInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("solutions_interested"));

        int offset = 0;
        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        double[] queryVector = RecoUtil.calculateVector(Masters.getSolutionList(), solutionsInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);
        //System.out.println(vectorString);
        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid, posted_by,account_type,account_slug,title, positioning, start_year, num_customers_range, created FROM _solution where status=? ORDER BY solutions_offered_vector <#> ?::vector,created desc LIMIT ? OFFSET ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, vectorString);
            pstmt.setInt(3, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(4,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("id", rs.getString("uuid"));
                    reco.put("posted_by", rs.getString("posted_by"));
                    reco.put("posted_by_account_type", rs.getString("account_type"));
                    reco.put("posted_by_account_slug", rs.getString("account_slug"));
                    reco.put("title", rs.getString("title"));
                    reco.put("positioning", rs.getString("positioning"));
                    reco.put("start_year",rs.getInt("start_year"));
                    reco.put("num_customers",rs.getString("num_customers_range"));
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
