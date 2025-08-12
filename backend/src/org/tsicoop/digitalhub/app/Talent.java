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

public class Talent implements REST {

    private static final String FUNCTION = "_func";
    private static final String VIEW_PROFESSIONAL = "view_professional";

    private static final String GET_TALENT_PROFILE = "get_talent_profile";
    private static final String GET_RECOMMENDED_PROFESSIONALS_BY_SKILLS = "get_recommended_professionals_by_skills";

    private static final String SEARCH_PROFESSIONALS = "search_professionals";

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
        String currentUserAccountType = null;
        String currentUserAccountSlug = null;
        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            currentUserAccountType = InputProcessor.getAccountType(req);
            currentUserAccountSlug = InputProcessor.getAccountSlug(req);
            if(func != null){
                if(func.equalsIgnoreCase(VIEW_PROFESSIONAL)){
                    accountSlug = (String) input.get("account_slug");
                    output = getTalentDetails(accountSlug);
                }else if(func.equalsIgnoreCase(GET_TALENT_PROFILE)){
                    accountSlug = (String) input.get("account_slug");
                    output = getTalentProfile(currentUserAccountType, currentUserAccountSlug, accountSlug);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_PROFESSIONALS_BY_SKILLS)){
                    accountType = InputProcessor.getAccountType(req);
                    if(accountType.equalsIgnoreCase(Constants.PROFESSIONAL_ACCOUNT_TYPE)){
                        OutputProcessor.sendError(res,HttpServletResponse.SC_METHOD_NOT_ALLOWED,"Request valid only for businesses");
                    }else {
                        int pg = 0;
                        if(input.get("pg")!=null)
                            pg = (int)(long)input.get("pg");
                        accountSlug = InputProcessor.getAccountSlug(req);
                        outputArray = getRecommendationsBySkills(accountSlug, pg);
                    }
                }else if(func.equalsIgnoreCase(SEARCH_PROFESSIONALS)){
                    String query = (String) input.get("q");
                    outputArray = searchProfessionals(StringUtil.formatSearchQuery(query));
                }
            }
            if(outputArray != null)
                OutputProcessor.send(res, HttpServletResponse.SC_OK, outputArray);
            else if(output != null)
                OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
        }catch(Exception e){
            OutputProcessor.sendError(res,HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Unknown server error");
            e.printStackTrace();
        }
    }

    protected boolean accountExists(JSONObject input) throws Exception{
        boolean exists = false;
        int count=0;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String email = (String) input.get("email");
        String sql = "select count(*) from _professional_account where account_slug=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,email);
        count = new PoolDB().fetchCount(query);
        if(count>0){
            exists = true;
        }
        return exists;
    }

    public JSONObject getTalentProfile(String currentUserAccountType, String currentUserAccountSlug, String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject tdetails = getTalentDetails(accountSlug);

        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("title", Constants.DISPLAY_PROFESSIONAL+ " - "+ tdetails.get("name"));
        basic.put("id", tdetails.get("id"));
        basic.put("name", tdetails.get("name"));
        basic.put("about", tdetails.get("about"));
        basic.put("gender", tdetails.get("gender"));
        basic.put("start_year", tdetails.get("start_year"));
        basic.put("industry_slug", tdetails.get("industry_slug"));
        basic.put("state_slug", tdetails.get("state_slug"));
        basic.put("city_slug", tdetails.get("city_slug"));
        basic.put("household_income", tdetails.get("household_income"));
        basic.put("college", tdetails.get("college"));
        basic.put("disability", tdetails.get("disability"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONArray interests = new JSONArray();
        interests.add(Masters.getSolutionNames((JSONArray) tdetails.get("solutions_interested")));
        interests.add(Masters.getServiceNames((JSONArray)tdetails.get("services_interested")));
        interests.add(Masters.getTrainingNames((JSONArray)tdetails.get("training_interested")));
        interests.add(Masters.getSkillNames((JSONArray)tdetails.get("skills_interested")));
        profile.put("interests", interests);

        // Posts
        JSONArray posts = new Post().getMyPosts(Constants.PROFESSIONAL_ACCOUNT_TYPE, accountSlug);
        profile.put("posts", posts);

        // Testimonials
        JSONArray testimonials = new Testimonial().getReceivedTestimonials(Constants.PROFESSIONAL_ACCOUNT_TYPE, accountSlug);
        profile.put("testimonials", testimonials);

        profile.put("is_content_owner", User.isContentOwner(currentUserAccountType,currentUserAccountSlug,Constants.PROFESSIONAL_ACCOUNT_TYPE,accountSlug));
        return profile;
    }

    public JSONObject getTalentProfileForEditing(String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject tdetails = getTalentDetails(accountSlug);

        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("title", Constants.DISPLAY_PROFESSIONAL+ " - "+ tdetails.get("name"));
        basic.put("id", tdetails.get("id"));
        basic.put("name", tdetails.get("name"));
        basic.put("about", tdetails.get("about"));
        basic.put("gender", tdetails.get("gender"));
        basic.put("start_year", tdetails.get("start_year"));
        basic.put("industry_slug", tdetails.get("industry_slug"));
        basic.put("state_slug", tdetails.get("state_slug"));
        basic.put("city_slug", tdetails.get("city_slug"));
        basic.put("household_income", tdetails.get("household_income"));
        basic.put("college", tdetails.get("college"));
        basic.put("disability", tdetails.get("disability"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONObject interests = new JSONObject();
        interests.put("solutions_interested",(JSONArray)tdetails.get("solutions_interested"));
        interests.put("services_interested",(JSONArray)tdetails.get("services_interested"));
        interests.put("training_interested",(JSONArray)tdetails.get("training_interested"));
        interests.put("skills_interested",(JSONArray)tdetails.get("skills_interested"));
        profile.put("interests", interests);

        return profile;
    }

    public JSONObject getTalentDetails(String accountSlug){
        JSONObject details = new JSONObject();
        String sql = null;
        ResultSet rs = null;
        String gender = null;
        String hhIncome = null;
        String college = null;
        String disability = null;
        String uuid = null;
        int startYear = 0;
        String name = null;
        String category = null;
        String numEmps = null;
        String industry = null;
        String state = null;
        String city = null;
        String about = null;
        String[] solutionsInterested = null;
        String[] servicesInterested = null;
        String[] trainingsInterested = null;
        String[] skillsInterested = null;
        String type = null;
        String token = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            sql = "select uuid,name,about,gender,household_income,college,disability,start_year,industry_slug,state_slug,city_slug,latitude,longitude,solutions_interested,services_interested,training_interested,skills_interested,txy_interested from _professional_account where account_slug=?";
            conn = new PoolDB().getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, accountSlug);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                uuid = (String) rs.getString("uuid");
                name = (String) rs.getString("name");
                about = (String) rs.getString("about");
                gender = (String) rs.getString("gender");
                hhIncome = (String) rs.getString("household_income");
                college = (String) rs.getString("college");
                disability = (String) rs.getString("disability");
                startYear = (int) rs.getInt("start_year");
                industry = (String) rs.getString("industry_slug");
                state = (String) rs.getString("state_slug");
                city = (String) rs.getString("city_slug");
                details.put("id", uuid);
                details.put("name", name);
                details.put("about", about);
                details.put("gender", gender);
                details.put("household_income", hhIncome);
                details.put("college", college);
                details.put("disability", disability);
                details.put("start_year", startYear);
                details.put("industry_slug", industry);
                details.put("state_slug", state);
                details.put("city_slug", city);
                details.put("solutions_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("solutions_interested"))));
                details.put("services_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("services_interested"))));
                details.put("training_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("training_interested"))));
                details.put("skills_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("skills_interested"))));
                details.put("txy_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("txy_interested"))));
            }
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return details;
    }

    protected boolean addProfessional(String email, JSONObject input) throws Exception{
        boolean created = false;
        DBQuery query = null;
        String name = (String) input.get("name");
        String about = (String) input.get("about");
        String gender = (String) input.get("gender");
        String hhincome = (String) input.get("annual_income");
        String college = (String) input.get("college");
        String disability = (String) input.get("disability");
        int start_year = (int)(long) input.get("start_year");
        String industry = (String) input.get("industry");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        float[] geocode = Masters.geoGeoCode(state, city);
        float latitude = geocode[0];
        float longitude = geocode[1];

        String[] solutionMasterList = Masters.getSolutionList();
        String[] serviceMasterList = Masters.getServiceList();
        String[] trainingMasterList = Masters.getTrainingList();
        String[] skillMasterList = Masters.getSkillList();
        String[] txyMasterList = Masters.getTaxonomiesList();
        String[] solutionsInterested = solutionMasterList; //JSONUtil.toStringArray((JSONArray) input.get("solutions_interested"));
        String[] servicesInterested = serviceMasterList; //JSONUtil.toStringArray((JSONArray) input.get("services_interested"));
        String[] trainingsInterested = trainingMasterList; //JSONUtil.toStringArray((JSONArray) input.get("trainings_interested"));
        String[] skillsInterested = skillMasterList; //JSONUtil.toStringArray((JSONArray) input.get("skills_interested"));
        String[] txyInterested = txyMasterList; //Masters.getTaxonomiesList(solutionsInterested, servicesInterested, trainingsInterested, skillsInterested);

        double[] solutionsInterestedVector = RecoUtil.calculateVector(solutionMasterList, solutionMasterList);
        double[] servicesInterestedVector = RecoUtil.calculateVector(serviceMasterList, serviceMasterList);
        double[] trainingsInterestedVector = RecoUtil.calculateVector(trainingMasterList, trainingMasterList);
        double[] skillsInterestedVector = RecoUtil.calculateVector(skillMasterList, skillMasterList);
        double[] txyInterestedVector = RecoUtil.calculateVector(txyMasterList, txyMasterList);

        Connection conn = new PoolDB().getConnection();
        String talentuuid = UUID.randomUUID().toString();
        String sql = "INSERT INTO _professional_account (account_slug,name,start_year,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,solutions_interested_vector,services_interested_vector,training_interested_vector,skills_interested_vector,visible,status,latitude,longitude,gender,college,household_income,disability,txy_interested,txy_interested_vector,about,uuid,tsv_body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?, ?, ?,?,?,?,?,?,?,?,to_tsvector('english', ?))";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, email);
        pstmt.setString(2, name);
        pstmt.setInt(3, start_year);
        pstmt.setString(4, industry);
        pstmt.setString(5, state);
        pstmt.setString(6, city);
        Array solutionsInterestedArray = conn.createArrayOf("text", solutionsInterested);
        pstmt.setArray(7, solutionsInterestedArray);
        Array servicesInterestedArray = conn.createArrayOf("text", servicesInterested);
        pstmt.setArray(8, servicesInterestedArray);
        Array trainingsInterestedArray = conn.createArrayOf("text", trainingsInterested);
        pstmt.setArray(9, trainingsInterestedArray);
        Array skillsInterestedArray = conn.createArrayOf("text", skillsInterested);
        pstmt.setArray(10, skillsInterestedArray);
        PGobject solutionsInterestedVectorObject = new PGobject();
        solutionsInterestedVectorObject.setType("vector");
        solutionsInterestedVectorObject.setValue(RecoUtil.vectorToString(solutionsInterestedVector));
        pstmt.setObject(11, solutionsInterestedVectorObject);
        //System.out.println("Solutions Interested:"+Arrays.toString(solutionsInterested));
        //System.out.println("Vector:"+vectorToString(solutionsInterestedVector));
        PGobject servicesInterestedVectorObject = new PGobject();
        servicesInterestedVectorObject.setType("vector");
        servicesInterestedVectorObject.setValue(RecoUtil.vectorToString(servicesInterestedVector));
        pstmt.setObject(12, servicesInterestedVectorObject);
        PGobject trainingsInterestedVectorObject = new PGobject();
        trainingsInterestedVectorObject.setType("vector");
        trainingsInterestedVectorObject.setValue(RecoUtil.vectorToString(trainingsInterestedVector));
        pstmt.setObject(13, trainingsInterestedVectorObject);
        PGobject skillsInterestedVectorObject = new PGobject();
        skillsInterestedVectorObject.setType("vector");
        skillsInterestedVectorObject.setValue(RecoUtil.vectorToString(skillsInterestedVector));
        pstmt.setObject(14, skillsInterestedVectorObject);
        pstmt.setInt(15, 1);
        pstmt.setInt(16, Constants.APPROVED_STATUS);
        pstmt.setFloat(17, latitude);
        pstmt.setFloat(18, longitude);
        pstmt.setString(19, gender);
        pstmt.setString(20, college);
        pstmt.setString(21, hhincome);
        pstmt.setString(22, disability);
        Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
        pstmt.setArray(23, txyInterestedArray);
        PGobject txyInterestedVectorObject = new PGobject();
        txyInterestedVectorObject.setType("vector");
        txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
        pstmt.setObject(24, txyInterestedVectorObject);
        pstmt.setString(25, about);
        pstmt.setString(26, talentuuid);
        pstmt.setString(27, tsvBody(    name,
                                                    start_year,
                                                    industry,
                                                    city,
                                                    state,
                                                    solutionsInterested,
                                                    servicesInterested,
                                                    trainingsInterested,
                                                    skillsInterested,
                                                    txyInterested,
                                                    about ));
        pstmt.executeUpdate();

        // insert user `
        String secret = "1234"; // Fix this
        sql = "INSERT INTO _USER (name,role_slug,email,mobile,account_type,account_slug,secret) values (?,?,?,?,?,?,?)";
        pstmt = conn.prepareStatement(sql);
        pstmt.setString(1,name);
        pstmt.setString(2,Constants.TECH_PROFESSIONAL_ROLE);
        pstmt.setString(3,email);
        pstmt.setString(4,"");
        pstmt.setString(5,Constants.PROFESSIONAL_ACCOUNT_TYPE);
        pstmt.setString(6,email);
        pstmt.setString(7,secret);
        pstmt.executeUpdate();

        new Community().addCommunityFeed(Constants.PROFESSIONAL_ACCOUNT_TYPE, email, name, Constants.DISPLAY_PROFESSIONAL+" - "+name, about, Constants.NEW_PROFESSIONAL_CONTENT_TYPE, talentuuid, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyInterested);

        // insert review
        //new Review().addReview(Constants.PROFESSIONAL_ACCOUNT_TYPE, email, Constants.NEW_PROFESSIONAL_CONTENT_TYPE, talentuuid);
        created = true;
        return created;
    }

    private String tsvBody( String name,
                            int startYear,
                            String industry,
                            String city,
                            String state,
                            String[] solutionsInterested,
                            String[] servicesInterested,
                            String[] trainingInterested,
                            String[] skillsInterested,
                            String[] txyInterested,
                            String about ){
        StringBuffer buff = new StringBuffer();
        buff.append(name+" ");
        buff.append(startYear+" ");
        buff.append(industry+" ");
        buff.append(city+" ");
        buff.append(state+" ");
        buff.append(StringUtil.arrayToString(solutionsInterested));
        buff.append(StringUtil.arrayToString(servicesInterested));
        buff.append(StringUtil.arrayToString(trainingInterested));
        buff.append(StringUtil.arrayToString(skillsInterested));
        buff.append(StringUtil.arrayToString(txyInterested));
        buff.append(about+" ");
        return buff.toString();
    }

    public boolean changeTalentStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _professional_account set status=? where uuid=?";
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

    protected JSONObject editProfessionalDetails(String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean edited = false;
        DBQuery query = null;
        String name = (String) input.get("name");
        String about = (String) input.get("about");
        String gender = (String) input.get("gender");
        String hhincome = (String) input.get("annual_income");
        String college = (String) input.get("college");
        String disability = (String) input.get("disability");
        int start_year = (int)(long) input.get("start_year");
        String industry = (String) input.get("industry");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        try {
            float[] geocode = Masters.geoGeoCode(state, city);
            float latitude = geocode[0];
            float longitude = geocode[1];
            String[] solutionsInterested = JSONUtil.toStringArray((JSONArray) input.get("solutions_interested"));
            String[] servicesInterested = JSONUtil.toStringArray((JSONArray) input.get("services_interested"));
            String[] trainingsInterested = JSONUtil.toStringArray((JSONArray) input.get("trainings_interested"));
            String[] skillsInterested = JSONUtil.toStringArray((JSONArray) input.get("skills_interested"));
            String[] txyInterested = Masters.getTaxonomiesList(solutionsInterested, servicesInterested, trainingsInterested, skillsInterested);
            String[] solutionMasterList = Masters.getSolutionList();
            String[] serviceMasterList = Masters.getServiceList();
            String[] trainingMasterList = Masters.getTrainingList();
            String[] skillMasterList = Masters.getSkillList();
            String[] txyMasterList = Masters.getTaxonomiesList();
            double[] solutionsInterestedVector = RecoUtil.calculateVector(solutionMasterList, solutionsInterested);
            double[] servicesInterestedVector = RecoUtil.calculateVector(serviceMasterList, servicesInterested);
            double[] trainingsInterestedVector = RecoUtil.calculateVector(trainingMasterList, trainingsInterested);
            double[] skillsInterestedVector = RecoUtil.calculateVector(skillMasterList, skillsInterested);
            double[] txyInterestedVector = RecoUtil.calculateVector(txyMasterList, txyInterested);

            Connection conn = new PoolDB().getConnection();
            String sql = "update _professional_account set name=?,start_year=?,industry_slug=?,state_slug=?,city_slug=?,solutions_interested=?,services_interested=?,training_interested=?,skills_interested=?,solutions_interested_vector=?,services_interested_vector=?,training_interested_vector=?,skills_interested_vector=?,visible=?,status=?,latitude=?,longitude=?,gender=?,college=?,household_income=?,disability=?,txy_interested=?,txy_interested_vector=?,about=? where account_slug=?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            pstmt.setInt(2, start_year);
            pstmt.setString(3, industry);
            pstmt.setString(4, state);
            pstmt.setString(5, city);
            Array solutionsInterestedArray = conn.createArrayOf("text", solutionsInterested);
            pstmt.setArray(6, solutionsInterestedArray);
            Array servicesInterestedArray = conn.createArrayOf("text", servicesInterested);
            pstmt.setArray(7, servicesInterestedArray);
            Array trainingsInterestedArray = conn.createArrayOf("text", trainingsInterested);
            pstmt.setArray(8, trainingsInterestedArray);
            Array skillsInterestedArray = conn.createArrayOf("text", skillsInterested);
            pstmt.setArray(9, skillsInterestedArray);
            PGobject solutionsInterestedVectorObject = new PGobject();
            solutionsInterestedVectorObject.setType("vector");
            solutionsInterestedVectorObject.setValue(RecoUtil.vectorToString(solutionsInterestedVector));
            pstmt.setObject(10, solutionsInterestedVectorObject);
            //System.out.println("Solutions Interested:"+Arrays.toString(solutionsInterested));
            //System.out.println("Vector:"+vectorToString(solutionsInterestedVector));
            PGobject servicesInterestedVectorObject = new PGobject();
            servicesInterestedVectorObject.setType("vector");
            servicesInterestedVectorObject.setValue(RecoUtil.vectorToString(servicesInterestedVector));
            pstmt.setObject(11, servicesInterestedVectorObject);
            PGobject trainingsInterestedVectorObject = new PGobject();
            trainingsInterestedVectorObject.setType("vector");
            trainingsInterestedVectorObject.setValue(RecoUtil.vectorToString(trainingsInterestedVector));
            pstmt.setObject(12, trainingsInterestedVectorObject);
            PGobject skillsInterestedVectorObject = new PGobject();
            skillsInterestedVectorObject.setType("vector");
            skillsInterestedVectorObject.setValue(RecoUtil.vectorToString(skillsInterestedVector));
            pstmt.setObject(13, skillsInterestedVectorObject);
            pstmt.setInt(14, 1);
            pstmt.setInt(15, 1);
            pstmt.setFloat(16, latitude);
            pstmt.setFloat(17, longitude);
            pstmt.setString(18, gender);
            pstmt.setString(19, college);
            pstmt.setString(20, hhincome);
            pstmt.setString(21, disability);
            Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
            pstmt.setArray(22, txyInterestedArray);
            PGobject txyInterestedVectorObject = new PGobject();
            txyInterestedVectorObject.setType("vector");
            txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
            pstmt.setObject(23, txyInterestedVectorObject);
            pstmt.setString(24, about);
            pstmt.setString(25, accountSlug);
            pstmt.executeUpdate();
            edited = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        if(edited)
            output.put("_edited",true);
        else
            output.put("_edited",false);

        return output;
    }

    public JSONArray getRecommendationsBySkills(String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        HashMap userDetails = null;
        userDetails = new Org().getOrgDetails(accountSlug);
        String[] skillsInterested= JSONUtil.toStringArray((JSONArray) userDetails.get("skills_interested"));
        int offset = 0;

        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        double[] queryVector = RecoUtil.calculateVector(Masters.getSkillList(), skillsInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);
        Connection con = new PoolDB().getConnection();
        String sql = "SELECT account_slug,name,about,gender,household_income,college,disability,start_year,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,created from _professional_account where status=? ORDER BY skills_interested_vector <#> ?::vector, created desc LIMIT ? OFFSET ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, vectorString);
            pstmt.setInt(3, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(4,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("about",(String) rs.getString("about"));
                    reco.put("gender",(String) rs.getString("gender"));
                    reco.put("household_income",(String) rs.getString("household_income"));
                    reco.put("college",(String) rs.getString("college"));
                    reco.put("disability",(String) rs.getString("disability"));
                    reco.put("start_year",(int) rs.getInt("start_year"));
                    reco.put("industry",(String) rs.getString("industry_slug"));
                    reco.put("state",(String) rs.getString("state_slug"));
                    reco.put("city",(String) rs.getString("city_slug"));
                    reco.put("solutions_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("solutions_interested"))));
                    reco.put("services_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("services_interested"))));
                    reco.put("training_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("training_interested"))));
                    reco.put("skills_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("skills_interested"))));
                    reco.put("posted_by",(String) rs.getString("name"));
                    reco.put("posted_by_account_type",Constants.PROFESSIONAL_ACCOUNT_TYPE);
                    reco.put("posted_by_account_slug",(String) rs.getString("account_slug"));
                    Instant instant = rs.getTimestamp("created").toInstant();
                    String timeAgo = DBUtil.getTimeAgo(instant);
                    reco.put("time_ago",timeAgo);
                    recommendations.add(reco);
                }
            }
        }
        return recommendations;
    }

    public JSONArray searchProfessionals(String query) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        Connection con = new PoolDB().getConnection();
        String sql = "SELECT account_slug,name,about,gender,household_income,college,disability,start_year,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,created from _professional_account where tsv_body @@ to_tsquery('english', ?)  LIMIT ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, query);
            pstmt.setInt(2, 20);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("about",(String) rs.getString("about"));
                    reco.put("gender",(String) rs.getString("gender"));
                    reco.put("household_income",(String) rs.getString("household_income"));
                    reco.put("college",(String) rs.getString("college"));
                    reco.put("disability",(String) rs.getString("disability"));
                    reco.put("start_year",(int) rs.getInt("start_year"));
                    reco.put("industry",(String) rs.getString("industry_slug"));
                    reco.put("state",(String) rs.getString("state_slug"));
                    reco.put("city",(String) rs.getString("city_slug"));
                    reco.put("solutions_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("solutions_interested"))));
                    reco.put("services_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("services_interested"))));
                    reco.put("training_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("training_interested"))));
                    reco.put("skills_interested",JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("skills_interested"))));
                    reco.put("posted_by",(String) rs.getString("name"));
                    reco.put("posted_by_account_type",Constants.PROFESSIONAL_ACCOUNT_TYPE);
                    reco.put("posted_by_account_slug",(String) rs.getString("account_slug"));
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
