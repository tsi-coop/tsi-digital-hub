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

public class Service implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_PROVIDER_SERVICES = "get_provider_services";
    private static final String VIEW_SERVICE = "view_service";
    private static final String ADD_SERVICE = "add_service";

    private static final String EDIT_SERVICE = "edit_service";

    private static final String GET_RECOMMENDED_SERVICES = "get_recommended_services";

    private static final String CANCEL_SERVICE = "cancel_service";

    private static final String SEARCH_SERVICES = "search_services";

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        String func = null;
        JSONArray outputArray = null;
        String accountType = null;
        String accountSlug = null;

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            accountType = InputProcessor.getAccountType(req);
            accountSlug = InputProcessor.getAccountSlug(req);

            if(func != null){
                if(func.equalsIgnoreCase(ADD_SERVICE)){
                    String email = InputProcessor.getEmail(req);
                    boolean added = addService(email,input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_SERVICES)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = getProviderServices(new Org().getAccountSlug(email));
                }else if(func.equalsIgnoreCase(VIEW_SERVICE)){
                    String id =  (String) input.get("id");
                    output = viewService(accountType,accountSlug,id);
                }else if(func.equalsIgnoreCase(EDIT_SERVICE)){
                    output = editService(input);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_SERVICES)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendations(accountType, accountSlug, pg);
                }else  if(func.equalsIgnoreCase(CANCEL_SERVICE)){
                    String id = (String) input.get("id");
                    boolean cancelled = changeServiceStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else if(func.equalsIgnoreCase(SEARCH_SERVICES)){
                    String query = (String) input.get("q");
                    outputArray = searchServices(StringUtil.formatSearchQuery(query));
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

    public boolean addService(String email, JSONObject input) {
        boolean added = false;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;
        String accountSlug = new Org().getAccountSlug(email);
        HashMap userDetails = new Org().getOrgDetails(accountSlug);
        String postedBy = (String) userDetails.get("org_name");
        String serviceTitle = (String) input.get("service_title");
        String positioning = (String) input.get("positioning");
        String description = (String) input.get("description");
        String serviceLink = (String) input.get("service_link");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int) (long) input.get("start_year");
        String num_customers_range = (String) input.get("num_customers_range");
        String industry = (String) input.get("industry");
        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");

        try {
            float[] geocode = Masters.geoGeoCode(state, city);
            float latitude = geocode[0];
            float longitude = geocode[1];
            String[] servicesOffered = JSONUtil.toStringArray((JSONArray) input.get("services_offered"));
            String[] skillsUsed = JSONUtil.toStringArray((JSONArray) input.get("skills_used"));
            double[] servicesOfferedVector = RecoUtil.calculateVector(Masters.getServiceList(), servicesOffered);
            double[] skillsUsedVector = RecoUtil.calculateVector(Masters.getSkillList(), skillsUsed);
            Connection conn = new PoolDB().getConnection();
            String serviceuuid = UUID.randomUUID().toString();
            // Insert Provider Solution
            String sql = "INSERT INTO _service (account_type,account_slug,title,positioning,description,collaterals,start_year,num_customers_range,industry_slug,state_slug,city_slug,services_offered,skills_used,services_offered_vector,skills_used_vector,visible,status,latitude,longitude,posted_by,service_link,uuid,tsv_body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?,to_tsvector('english', ?))";
            try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
                pstmt.setString(1, accountType);
                pstmt.setString(2, accountSlug);
                pstmt.setString(3, serviceTitle);
                pstmt.setString(4, positioning);
                pstmt.setString(5, description);
                Array collateralsArray = conn.createArrayOf("text", collaterals);
                pstmt.setArray(6, collateralsArray);
                pstmt.setInt(7, start_year);
                pstmt.setString(8, num_customers_range);
                pstmt.setString(9, industry);
                pstmt.setString(10, state);
                pstmt.setString(11, city);
                Array servicesOfferedArray = conn.createArrayOf("text", servicesOffered);
                pstmt.setArray(12, servicesOfferedArray);
                Array skillsUsedArray = conn.createArrayOf("text", skillsUsed);
                pstmt.setArray(13, skillsUsedArray);
                PGobject servicesOfferedVectorObject = new PGobject();
                servicesOfferedVectorObject.setType("vector");
                servicesOfferedVectorObject.setValue(RecoUtil.vectorToString(servicesOfferedVector));
                pstmt.setObject(14, servicesOfferedVectorObject);
                PGobject skillsUsedVectorObject = new PGobject();
                skillsUsedVectorObject.setType("vector");
                skillsUsedVectorObject.setValue(RecoUtil.vectorToString(skillsUsedVector));
                pstmt.setObject(15, skillsUsedVectorObject);
                pstmt.setInt(16, 1);
                pstmt.setInt(17, Constants.APPROVED_STATUS);
                pstmt.setFloat(18, latitude);
                pstmt.setFloat(19, longitude);
                pstmt.setString(20, postedBy);
                pstmt.setString(21, serviceLink);
                pstmt.setString(22, serviceuuid);
                pstmt.setString(23, tsvBody(serviceTitle, positioning, description, industry, city, state, servicesOffered));
                pstmt.executeUpdate();
                String[] txyOffered = Masters.getTaxonomiesList(new String[0], servicesOffered, new String[0], new String[0]);
                new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_SERVICE+" - "+serviceTitle, positioning, Constants.SERVICE_CONTENT_TYPE, serviceuuid, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyOffered);
                // new Review().addReview(accountType, accountSlug, Constants.SERVICE_CONTENT_TYPE, serviceuuid);
                added = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return added;
    }

    private String tsvBody(String title, String positioning, String description, String industry, String city, String state, String[] servicesOffered){
        StringBuffer buff = new StringBuffer();
        buff.append(title+" ");
        buff.append(positioning+" ");
        buff.append(description+" ");
        buff.append(industry+" ");
        buff.append(city+" ");
        buff.append(state+" ");
        buff.append(StringUtil.arrayToString(servicesOffered));
        return buff.toString();
    }

    public JSONArray getProviderServices(String accountSlug){
        JSONArray serviceList = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;
        String accountType = Constants.BUSINESS_ACCOUNT_TYPE;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select title,posted_by,account_type,account_slug,positioning,start_year,num_customers_range,uuid,created from _service where account_type='" + accountType + "' and account_slug='" + accountSlug + "' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("uuid", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("start_year", rs.getInt("start_year"));
                jsob.put("num_customers", rs.getString("num_customers_range"));
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                serviceList.add(jsob);
            }
        }catch(Exception e){
                e.printStackTrace();
        } finally {
            BatchDB.close(rs);
            BatchDB.close(stmt);
            BatchDB.close(con);
        }
        return serviceList;
    }

    public boolean changeServiceStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{
            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _service set status=? where uuid=?";
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
            new Community().changeCommunityFeedStatus(Constants.SERVICE_CONTENT_TYPE, uuid, status);
        }
        return changed;
    }

    public JSONObject viewService(String currentUserAccountType, String currentUserAccountSlug, String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select posted_by,account_type,account_slug,title,positioning,description,service_link,collaterals,start_year,num_customers_range,industry_slug,state_slug,city_slug,services_offered,skills_used,created from _service where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("account_type"));
                jsob.put("posted_by_account_slug", rs.getString("account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("positioning", rs.getString("positioning"));
                jsob.put("description", rs.getString("description"));
                jsob.put("service_link", rs.getString("service_link"));
                jsob.put("collaterals",rs.getString("collaterals"));
                jsob.put("start_year",rs.getInt("start_year"));
                jsob.put("num_customers",rs.getString("num_customers_range"));
                jsob.put("industry",rs.getString("industry_slug"));
                jsob.put("state",rs.getString("state_slug"));
                jsob.put("city",rs.getString("city_slug"));
                jsob.put("services_offered",rs.getString("services_offered"));
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
    public JSONObject editService(JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean edited = false;
        String id = (String) input.get("id");
        String serviceTitle = (String) input.get("service_title");
        String positioning = (String) input.get("positioning");
        String description = (String) input.get("description");
        String serviceLink = (String) input.get("service_link");
        String[] collaterals = JSONUtil.toStringArray((JSONArray) input.get("collaterals"));
        int start_year = (int)(long) input.get("start_year");
        String num_customers_range = (String) input.get("num_customers_range");
        String industry = (String) input.get("industry");
        String[] servicesOffered = JSONUtil.toStringArray((JSONArray)input.get("services_offered"));
        String[] skillsUsed = JSONUtil.toStringArray((JSONArray) input.get("skills_used"));
        try {
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _service set title=?,positioning=?,description=?,collaterals=?,start_year=?,num_customers_range=?,industry_slug=?,services_offered=?,skills_used=?,service_link=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, serviceTitle);
            pstmt.setString(2, positioning);
            pstmt.setString(3, description);
            Array collateralsArray = conn.createArrayOf("text", collaterals);
            pstmt.setArray(4, collateralsArray);
            pstmt.setInt(5, start_year);
            pstmt.setString(6, num_customers_range);
            pstmt.setString(7, industry);
            Array servicesOfferedArray = conn.createArrayOf("text", servicesOffered);
            pstmt.setArray(8, servicesOfferedArray);
            Array skillsUsedArray = conn.createArrayOf("text", skillsUsed);
            pstmt.setArray(9, skillsUsedArray);
            pstmt.setString(10, serviceLink);
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

        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");
        String[] servicesInterested = JSONUtil.toStringArray((JSONArray)  userDetails.get("services_interested"));

        int offset = 0;
        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        double[] queryVector = RecoUtil.calculateVector(Masters.getServiceList(), servicesInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);
        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid, posted_by,account_type,account_slug,title, positioning, start_year, num_customers_range, created FROM _service where status=? ORDER BY services_offered_vector <#> ?::vector,created desc LIMIT ? OFFSET ?";
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

    public JSONArray searchServices(String query) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid, posted_by,account_type,account_slug,title, positioning, start_year, num_customers_range, created FROM _service WHERE tsv_body @@ to_tsquery('english', ?) LIMIT ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, query);
            pstmt.setInt(2, 20);
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
