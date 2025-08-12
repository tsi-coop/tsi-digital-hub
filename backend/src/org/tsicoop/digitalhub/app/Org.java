package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.postgresql.util.PGobject;
import org.tsicoop.digitalhub.common.Masters;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import org.tsicoop.digitalhub.common.Constants;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

public class Org implements REST {

    private static final String FUNCTION = "_func";
    private static final String VIEW_ORGANIZATION = "view_organization";
    private static final String GET_ORG_PROFILE = "get_org_profile";

    private static final String GET_RECOMMENDED_ORGANIZATIONS_BY_SKILLS = "get_recommended_organizations_by_skills";

    private static final String SEARCH_ORGANIZATIONS = "search_organizations";

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
               if(func.equalsIgnoreCase(VIEW_ORGANIZATION)){
                    accountSlug = (String) input.get("account_slug");
                    output = getOrgDetails(accountSlug);
                }else if(func.equalsIgnoreCase(GET_ORG_PROFILE)){
                    accountSlug = (String) input.get("account_slug");
                    output = getOrgProfile(currentUserAccountType, currentUserAccountSlug, accountSlug);
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_ORGANIZATIONS_BY_SKILLS)){
                    accountType = InputProcessor.getAccountType(req);
                    if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
                        OutputProcessor.sendError(res,HttpServletResponse.SC_METHOD_NOT_ALLOWED,"Request valid only for professionals");
                    }else {
                        int pg = 0;
                        if(input.get("pg")!=null)
                            pg = (int)(long)input.get("pg");
                        accountType = InputProcessor.getAccountType(req);
                        accountSlug = InputProcessor.getAccountSlug(req);
                        outputArray = getRecommendationsBySkills(accountType, accountSlug, pg);
                    }
                }else if(func.equalsIgnoreCase(SEARCH_ORGANIZATIONS)){
                   String query = (String) input.get("q");
                   outputArray = searchOrganizations(StringUtil.formatSearchQuery(query));
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

    public boolean accountExists(String email) throws Exception{
        boolean exists = false;
        int count=0;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String accountSlug = email.substring(email.indexOf("@")+1);
        String sql = "select count(*) from _organization_account where account_slug=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,accountSlug);
        count = new PoolDB().fetchCount(query);
        if(count>0){
            exists = true;
        }
        return exists;
    }

    public String getAccountSlug(String email){
        return email.substring(email.indexOf("@")+1);
    }

    public JSONObject getOrgProfile(String currentUserAccountType, String currentUserAccountSlug, String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject orgDetails = getOrgDetails(accountSlug);
        
        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("title", Constants.DISPLAY_ORGANISATION+ " - "+ orgDetails.get("org_name"));
        basic.put("id", orgDetails.get("id"));
        basic.put("org_name", orgDetails.get("org_name"));
        basic.put("about", orgDetails.get("about"));
        basic.put("start_year", orgDetails.get("start_year"));
        basic.put("category", orgDetails.get("category"));
        basic.put("num_employees", orgDetails.get("num_employees"));
        basic.put("industry", orgDetails.get("industry"));
        basic.put("state", orgDetails.get("state"));
        basic.put("city", orgDetails.get("city"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONArray interests = new JSONArray();
        /*interests.add(Masters.getSolutionNames((JSONArray) orgDetails.get("solutions_interested")));
        interests.add(Masters.getServiceNames((JSONArray)orgDetails.get("services_interested")));
        interests.add(Masters.getTrainingNames((JSONArray)orgDetails.get("training_interested")));
        interests.add(Masters.getSkillNames((JSONArray)orgDetails.get("skills_interested")));*/
        profile.put("interests", interests);

        // Offerings
        JSONObject offerings = new JSONObject();
        JSONArray solutions = new Solution().getProviderSolutions(accountSlug);
        JSONArray services = new Service().getProviderServices(accountSlug);
        JSONArray trainings = new Training().getProviderTrainings(accountSlug);
        offerings.put("solutions",solutions);
        offerings.put("services",services);
        offerings.put("trainings",trainings);
        profile.put("offerings", offerings);

        // Posts
        JSONArray posts = new Post().getMyPosts(Constants.BUSINESS_ACCOUNT_TYPE, accountSlug);
        profile.put("posts", posts);

        // Testimonials
        JSONArray testimonials = new Testimonial().getReceivedTestimonials(Constants.BUSINESS_ACCOUNT_TYPE, accountSlug);
        profile.put("testimonials", testimonials);

        // Jobs
        JSONArray jobs = new Job().getBusinessJobs(Constants.BUSINESS_ACCOUNT_TYPE, accountSlug);
        profile.put("jobs", jobs);

        profile.put("is_content_owner", User.isContentOwner(currentUserAccountType,currentUserAccountSlug,Constants.BUSINESS_ACCOUNT_TYPE,accountSlug));
        return profile;
    }

    public JSONObject getOrgDetails(String accountSlug){
        JSONObject details = new JSONObject();
        String sql = null;
        DBQuery query = null;
        ResultSet rs = null;
        String uuid = null;
        int startYear = 0;
        String orgname = null;
        String category = null;
        String numEmps = null;
        String industry = null;
        String state = null;
        String city = null;
        String about = null;
        String planType = null;
        String planExpiry = null;
        String[] solutionsInterested = {};
        String[] servicesInterested = {};
        String[] trainingsInterested = {};
        String[] skillsInterested = {};
        String[] txyInterested = {};
        String type = null;
        String token = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            sql = "select uuid,about,org_name,start_year,category,num_employees_range,industry_slug,state_slug,city_slug,latitude,longitude,solutions_interested,services_interested,training_interested,skills_interested,txy_interested,plan_type,plan_expiry from _organization_account where account_slug=?";
            conn = new PoolDB().getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, accountSlug);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                uuid = (String) rs.getString("uuid");
                orgname = (String) rs.getString("org_name");
                about = (String) rs.getString("about");
                startYear = (int) rs.getInt("start_year");
                category = (String) rs.getString("category");
                numEmps = (String) rs.getString("num_employees_range");
                industry = (String) rs.getString("industry_slug");
                state = (String) rs.getString("state_slug");
                city = (String) rs.getString("city_slug");
                planType = (String) rs.getString("plan_type");
                planExpiry = (String) rs.getString("plan_expiry");
                /*solutionsInterested = rs.getArray("solutions_interested") != (String[]) rs.getArray("solutions_interested").getArray();
                servicesInterested = (String[]) rs.getArray("services_interested").getArray();
                trainingsInterested = (String[]) rs.getArray("training_interested").getArray();
                skillsInterested = (String[]) rs.getArray("skills_interested").getArray();
                txyInterested = (String[]) rs.getArray("txy_interested").getArray();*/
                details.put("id", uuid);
                details.put("org_name", orgname);
                details.put("about", about);
                details.put("start_year", startYear);
                details.put("category", category);
                details.put("num_employees", numEmps);
                details.put("industry", industry);
                details.put("state", state);
                details.put("city", city);
                details.put("solutions_interested", JSONUtil.toJSONArray(solutionsInterested));
                details.put("services_interested", JSONUtil.toJSONArray(servicesInterested));
                details.put("training_interested", JSONUtil.toJSONArray(trainingsInterested));
                details.put("skills_interested", JSONUtil.toJSONArray(skillsInterested));
                details.put("txy_interested", JSONUtil.toJSONArray(txyInterested));
                details.put("plan_type", planType);
                details.put("plan_expiry", planExpiry);
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

    public boolean addBusiness(String email, JSONObject input) throws Exception{
        boolean created = false;
        DBQuery query = null;
        String accountSlug = getAccountSlug(email);
        String businessName = (String) input.get("business_name");
        String name = (String) input.get("name");
        int start_year = (int)(long) input.get("start_year");
        String category = (String) input.get("category");
        String numemployees = (String) input.get("num_employees");
        String industry = (String) input.get("industry");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        String about = (String) input.get("about");
        float[] geocode = Masters.geoGeoCode(state, city);
        float latitude = geocode[0];
        float longitude = geocode[1];

        String[] solutionMasterList = Masters.getSolutionList();
        String[] serviceMasterList = Masters.getServiceList();
        String[] trainingMasterList = Masters.getTrainingList();
        String[] skillMasterList = Masters.getSkillList();
        String[] txyMasterList = Masters.getTaxonomiesList();
        String[] solutionsInterested = solutionMasterList;//JSONUtil.toStringArray((JSONArray) input.get("solutions_interested"));
        String[] servicesInterested = serviceMasterList;//JSONUtil.toStringArray((JSONArray) input.get("services_interested"));
        String[] trainingsInterested = trainingMasterList; //JSONUtil.toStringArray((JSONArray) input.get("trainings_interested"));
        String[] skillsInterested = skillMasterList; // JSONUtil.toStringArray((JSONArray) input.get("skills_interested"));
        String[] txyInterested = txyMasterList; //Masters.getTaxonomiesList(solutionsInterested, servicesInterested, trainingsInterested, skillsInterested);


        double[] solutionsInterestedVector = RecoUtil.calculateVector(solutionMasterList, solutionMasterList);
        double[] servicesInterestedVector = RecoUtil.calculateVector(serviceMasterList, serviceMasterList);
        double[] trainingsInterestedVector = RecoUtil.calculateVector(trainingMasterList, trainingMasterList);
        double[] skillsInterestedVector = RecoUtil.calculateVector(skillMasterList, skillMasterList);
        double[] txyInterestedVector = RecoUtil.calculateVector(txyMasterList, txyInterested);

        String orguuid = UUID.randomUUID().toString();
        Connection conn = new PoolDB().getConnection();
        String sql = "INSERT INTO _organization_account (account_slug,org_name,start_year,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,solutions_interested_vector,services_interested_vector,training_interested_vector,skills_interested_vector,visible,status,account_type,latitude,longitude,category,num_employees_range,txy_interested,txy_interested_vector,about,uuid,tsv_body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?, ?,?,?,?,?,?,?,?,?,to_tsvector('english', ?))";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, accountSlug);
        pstmt.setString(2, businessName);
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
        pstmt.setString(17, Constants.BUSINESS_ACCOUNT_TYPE);
        pstmt.setFloat(18, latitude);
        pstmt.setFloat(19, longitude);
        pstmt.setString(20, category);
        pstmt.setString(21, numemployees);
        Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
        pstmt.setArray(22, txyInterestedArray);
        PGobject txyInterestedVectorObject = new PGobject();
        txyInterestedVectorObject.setType("vector");
        txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
        pstmt.setObject(23, txyInterestedVectorObject);
        pstmt.setString(24, about);
        pstmt.setString(25, orguuid);
        pstmt.setString(26, tsvBody(    businessName+" "+name,
                                                    start_year,
                                                    category,
                                                    industry,
                                                    city,
                                                    state,
                                                    null,
                                                    null,
                                                    null,
                                                    null,
                                                    null,
                                                    about ));
        pstmt.executeUpdate();

        // insert user `
        String secret = Email.generate4DigitOTP();
        sql = "INSERT INTO _USER (name,role_slug,email,mobile,account_type,account_slug,secret) values (?,?,?,?,?,?,?)";
        pstmt = conn.prepareStatement(sql);
        pstmt.setString(1,name);
        pstmt.setString(2,Constants.BUSINESS_ADMIN_ROLE);
        pstmt.setString(3,email);
        pstmt.setString(4,"");
        pstmt.setString(5,Constants.BUSINESS_ACCOUNT_TYPE);
        pstmt.setString(6,accountSlug);
        pstmt.setString(7,secret);
        pstmt.executeUpdate();

        new Community().addCommunityFeed(Constants.BUSINESS_ACCOUNT_TYPE, accountSlug, businessName, Constants.DISPLAY_ORGANISATION +" - "+businessName, about, Constants.NEW_ORG_CONTENT_TYPE, orguuid, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyInterested);
        // insert review
        //new Review().addReview(Constants.BUSINESS_ACCOUNT_TYPE, accountSlug, Constants.NEW_ORG_CONTENT_TYPE,orguuid);
        created = true;
        return created;
    }

    private String tsvBody( String name,
                            int startYear,
                            String category,
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
        buff.append(category+" ");
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

    private void printWords(String[] words){
        for (String word: words) {
            System.out.println(word);
        }
    }

    public boolean changeOrgStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _organization_account set status=? where uuid=?";
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

    public JSONObject getOrgProfileForEditing(String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject orgDetails = getOrgDetails(accountSlug);

        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("title", Constants.DISPLAY_ORGANISATION+ " - "+ orgDetails.get("org_name"));
        basic.put("id", orgDetails.get("id"));
        basic.put("org_name", orgDetails.get("org_name"));
        basic.put("about", orgDetails.get("about"));
        basic.put("start_year", orgDetails.get("start_year"));
        basic.put("category", orgDetails.get("category"));
        basic.put("num_employees", orgDetails.get("num_employees"));
        basic.put("industry", orgDetails.get("industry"));
        basic.put("state", orgDetails.get("state"));
        basic.put("city", orgDetails.get("city"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONObject interests = new JSONObject();
        interests.put("solutions_interested",(JSONArray) orgDetails.get("solutions_interested"));
        interests.put("services_interested",(JSONArray)orgDetails.get("services_interested"));
        interests.put("training_interested",(JSONArray)orgDetails.get("training_interested"));
        interests.put("skills_interested",(JSONArray)orgDetails.get("skills_interested"));
        profile.put("interests", interests);

        return profile;
    }

    protected JSONObject editBusinessDetails(String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean updated = false;
        String businessName = (String) input.get("business_name");
        int start_year = (int)(long) input.get("start_year");
        String category = (String) input.get("category");
        String numemployees = (String) input.get("num_employees");
        String industry = (String) input.get("industry");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        String about = (String) input.get("about");
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
            String sql = "update _organization_account set org_name=?,start_year=?,industry_slug=?,state_slug=?,city_slug=?,solutions_interested=?,services_interested=?,training_interested=?,skills_interested=?,solutions_interested_vector=?,services_interested_vector=?,training_interested_vector=?,skills_interested_vector=?,visible=?,status=?,account_type=?,latitude=?,longitude=?,category=?,num_employees_range=?,txy_interested=?,txy_interested_vector=?, about=?, tsv_body=to_tsvector('english', ?) where account_slug=?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, businessName);
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
            pstmt.setString(16, Constants.BUSINESS_ACCOUNT_TYPE);
            pstmt.setFloat(17, latitude);
            pstmt.setFloat(18, longitude);
            pstmt.setString(19, category);
            pstmt.setString(20, numemployees);
            Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
            pstmt.setArray(21, txyInterestedArray);
            PGobject txyInterestedVectorObject = new PGobject();
            txyInterestedVectorObject.setType("vector");
            txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
            pstmt.setObject(22, txyInterestedVectorObject);
            pstmt.setString(23, about);
            pstmt.setString(24, tsvBody(    businessName,
                                                                start_year,
                                                                category,
                                                                industry,
                                                                city,
                                                                state,
                                                                solutionsInterested,
                                                                servicesInterested,
                                                                trainingsInterested,
                                                                skillsInterested,
                                                                txyInterested,
                                                                about ));
     /*       System.out.println("TSV Body:"+tsvBody(    businessName,
                                                        start_year,
                                                        category,
                                                        industry,
                                                        city,
                                                        state,
                                                        solutionsInterested,
                                                        servicesInterested,
                                                        trainingsInterested,
                                                        skillsInterested,
                                                        txyInterested,
                                                        about ));*/
            pstmt.setString(25, accountSlug);
            pstmt.executeUpdate();
            updated = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        if(updated){
            output.put("_edited",true);
        }else{
            output.put("_edited",false);
        }
        return output;
    }

    public JSONArray getRecommendationsBySkills(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        HashMap userDetails = null;
        userDetails = User.getUserDetails(accountType,accountSlug);
        String[] skillsInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("skills_interested"));

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
        String sql = "SELECT about, account_slug, org_name, account_type, start_year,category,num_employees_range,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,created FROM _organization_account where status=? ORDER BY skills_interested_vector <#> ?::vector, created desc LIMIT ? OFFSET ?";
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
                    reco.put("posted_by_account_type",Constants.BUSINESS_ACCOUNT_TYPE);
                    reco.put("posted_by_account_slug",(String) rs.getString("account_slug"));
                    reco.put("org_name",(String) rs.getString("org_name"));
                    reco.put("account_type",(String) rs.getString("account_type"));
                    reco.put("start_year",(int) rs.getInt("start_year"));
                    reco.put("category",(String) rs.getString("category"));
                    reco.put("num_employees",(String) rs.getString("num_employees_range"));
                    reco.put("industry",(String) rs.getString("industry_slug"));
                    reco.put("state",(String) rs.getString("state_slug"));
                    reco.put("city",(String) rs.getString("city_slug"));
                    reco.put("posted_by",(String) rs.getString("org_name"));
                    Instant instant = rs.getTimestamp("created").toInstant();
                    String timeAgo = DBUtil.getTimeAgo(instant);
                    reco.put("time_ago",timeAgo);
                    recommendations.add(reco);
                }
            }
        }
        return recommendations;
    }

    public JSONArray searchOrganizations(String query) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        Connection con = new PoolDB().getConnection();
        String sql = "SELECT about, account_slug, org_name, account_type, start_year,category,num_employees_range,industry_slug,state_slug,city_slug,solutions_interested,services_interested,training_interested,skills_interested,created FROM _organization_account where tsv_body @@ to_tsquery('english', ?) limit ?";
        //System.out.println(sql);
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setString(1, query);
            pstmt.setInt(2, 20);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    reco = new JSONObject();
                    reco.put("about",(String) rs.getString("about"));
                    reco.put("posted_by_account_type",Constants.BUSINESS_ACCOUNT_TYPE);
                    reco.put("posted_by_account_slug",(String) rs.getString("account_slug"));
                    reco.put("org_name",(String) rs.getString("org_name"));
                    reco.put("account_type",(String) rs.getString("account_type"));
                    reco.put("start_year",(int) rs.getInt("start_year"));
                    reco.put("category",(String) rs.getString("category"));
                    reco.put("num_employees",(String) rs.getString("num_employees_range"));
                    reco.put("industry",(String) rs.getString("industry_slug"));
                    reco.put("state",(String) rs.getString("state_slug"));
                    reco.put("city",(String) rs.getString("city_slug"));
                    reco.put("posted_by",(String) rs.getString("org_name"));
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
