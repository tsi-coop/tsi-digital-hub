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
import java.util.UUID;

public class Ambassador implements REST {
    private static final String FUNCTION = "_func";
    private static final String VIEW_AMBASSADOR = "view_ambassador";

    private static final String GET_AMBASSADOR_PROFILE = "get_ambassador_profile";

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        JSONArray outputArray = null;
        String func = null;
        String currentUserAccountType = null;
        String currentUserAccountSlug = null;
        String accountSlug = null;
        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            currentUserAccountType = InputProcessor.getAccountType(req);
            currentUserAccountSlug = InputProcessor.getAccountSlug(req);
            if(func != null){
                if(func.equalsIgnoreCase(VIEW_AMBASSADOR)){
                    accountSlug = (String) input.get("account_slug");
                    output = getAmbassadorDetails(accountSlug);
                }else if(func.equalsIgnoreCase(GET_AMBASSADOR_PROFILE)){
                    accountSlug = (String) input.get("account_slug");
                    output = getAmbassadorProfile(currentUserAccountType, currentUserAccountSlug, accountSlug);
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
        String sql = "select count(*) from _ambassador_account where account_slug=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,email);
        count = new PoolDB().fetchCount(query);
        if(count>0){
            exists = true;
        }
        return exists;
    }

    public JSONObject getAmbassadorProfile(String currentUserAccountType, String currentUserAccountSlug, String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject tdetails = getAmbassadorDetails(accountSlug);

        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("id", tdetails.get("id"));
        basic.put("name", tdetails.get("name"));
        basic.put("about", tdetails.get("about"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONObject interests = new JSONObject();
        interests.put("solutions_interested", Masters.getSolutionNames((JSONArray) tdetails.get("solutions_interested")));
        interests.put("services_interested", Masters.getServiceNames((JSONArray)tdetails.get("services_interested")));
        interests.put("training_interested", Masters.getTrainingNames((JSONArray)tdetails.get("training_interested")));
        interests.put("skills_interested", Masters.getSkillNames((JSONArray)tdetails.get("skills_interested")));
        profile.put("interests", interests);

        // Posts
        JSONArray posts = new Post().getMyPosts(Constants.PROFESSIONAL_ACCOUNT_TYPE, accountSlug);
        profile.put("posts", posts);

        // Testimonials
        JSONArray testimonials = new Testimonial().getReceivedTestimonials(Constants.PROFESSIONAL_ACCOUNT_TYPE, accountSlug);
        profile.put("testimonials", testimonials);

        // Enquiries
        JSONArray enquiries = new Enquiry().getSentEnquiries(Constants.PROFESSIONAL_ACCOUNT_TYPE, accountSlug);
        profile.put("enquiries", enquiries);
        profile.put("is_content_owner", User.isContentOwner(currentUserAccountType,currentUserAccountSlug,Constants.AMBASSADOR_ACCOUNT_TYPE,accountSlug));

        return profile;
    }

    public JSONObject getAmbassadorProfileForEditing(String accountSlug) {
        JSONObject profile = new JSONObject();

        JSONObject adetails = getAmbassadorDetails(accountSlug);

        // Basic Details
        JSONObject basic = new JSONObject();
        basic.put("id", adetails.get("id"));
        basic.put("name", adetails.get("name"));
        basic.put("about", adetails.get("about"));
        profile.put("basic_details", basic);

        // Interests - Solutions, Services, Trainings, Skills
        JSONObject interests = new JSONObject();
        interests.put("solutions_interested",(JSONArray)adetails.get("solutions_interested"));
        interests.put("services_interested",(JSONArray)adetails.get("services_interested"));
        interests.put("training_interested",(JSONArray)adetails.get("training_interested"));
        interests.put("skills_interested",(JSONArray)adetails.get("skills_interested"));
        profile.put("interests", interests);

        return profile;
    }

    public JSONObject getAmbassadorDetails(String accountSlug){
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
        String planType = null;
        String planExpiry = null;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try {
            sql = "select uuid,name,about,solutions_interested,services_interested,training_interested,skills_interested,txy_interested,plan_type,plan_expiry from _ambassador_account where account_slug=?";
            conn = new PoolDB().getConnection();
            pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, accountSlug);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                uuid = (String) rs.getString("uuid");
                name = (String) rs.getString("name");
                about = (String) rs.getString("about");
                planType = (String) rs.getString("plan_type");
                planExpiry = (String) rs.getString("plan_expiry");
                details.put("id", uuid);
                details.put("name", name);
                details.put("about", about);
                details.put("solutions_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("solutions_interested"))));
                details.put("services_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("services_interested"))));
                details.put("training_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("training_interested"))));
                details.put("skills_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("skills_interested"))));
                details.put("txy_interested", JSONUtil.toJSONArray(DBUtil.getSafeArray(rs.getArray("txy_interested"))));
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

    public boolean addAmbassador(String email, JSONObject input) throws Exception{
        boolean created = false;
        DBQuery query = null;
        String name = (String) input.get("name");
        String about = (String) input.get("about");
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
        String ambassadoruuid = UUID.randomUUID().toString();
        String sql = "INSERT INTO _ambassador_account (account_slug,name,solutions_interested,services_interested,training_interested,skills_interested,solutions_interested_vector,services_interested_vector,training_interested_vector,skills_interested_vector,visible,status,txy_interested,txy_interested_vector,about,uuid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?,?)";
        PreparedStatement pstmt = conn.prepareStatement(sql);
        pstmt.setString(1, email);
        pstmt.setString(2, name);
        Array solutionsInterestedArray = conn.createArrayOf("text", solutionsInterested);
        pstmt.setArray(3, solutionsInterestedArray);
        Array servicesInterestedArray = conn.createArrayOf("text", servicesInterested);
        pstmt.setArray(4, servicesInterestedArray);
        Array trainingsInterestedArray = conn.createArrayOf("text", trainingsInterested);
        pstmt.setArray(5, trainingsInterestedArray);
        Array skillsInterestedArray = conn.createArrayOf("text", skillsInterested);
        pstmt.setArray(6, skillsInterestedArray);
        PGobject solutionsInterestedVectorObject = new PGobject();
        solutionsInterestedVectorObject.setType("vector");
        solutionsInterestedVectorObject.setValue(RecoUtil.vectorToString(solutionsInterestedVector));
        pstmt.setObject(7, solutionsInterestedVectorObject);
        //System.out.println("Solutions Interested:"+Arrays.toString(solutionsInterested));
        //System.out.println("Vector:"+vectorToString(solutionsInterestedVector));
        PGobject servicesInterestedVectorObject = new PGobject();
        servicesInterestedVectorObject.setType("vector");
        servicesInterestedVectorObject.setValue(RecoUtil.vectorToString(servicesInterestedVector));
        pstmt.setObject(8, servicesInterestedVectorObject);
        PGobject trainingsInterestedVectorObject = new PGobject();
        trainingsInterestedVectorObject.setType("vector");
        trainingsInterestedVectorObject.setValue(RecoUtil.vectorToString(trainingsInterestedVector));
        pstmt.setObject(9, trainingsInterestedVectorObject);
        PGobject skillsInterestedVectorObject = new PGobject();
        skillsInterestedVectorObject.setType("vector");
        skillsInterestedVectorObject.setValue(RecoUtil.vectorToString(skillsInterestedVector));
        pstmt.setObject(10, skillsInterestedVectorObject);
        pstmt.setInt(11, 1);
        pstmt.setInt(12, Constants.APPROVED_STATUS);
        Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
        pstmt.setArray(13, txyInterestedArray);
        PGobject txyInterestedVectorObject = new PGobject();
        txyInterestedVectorObject.setType("vector");
        txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
        pstmt.setObject(14, txyInterestedVectorObject);
        pstmt.setString(15, about);
        pstmt.setString(16, ambassadoruuid);
        pstmt.executeUpdate();

        // insert user `
        String secret = "1234"; // Fix this
        sql = "INSERT INTO _USER (name,role_slug,email,mobile,account_type,account_slug,secret) values (?,?,?,?,?,?,?)";
        pstmt = conn.prepareStatement(sql);
        pstmt.setString(1,name);
        pstmt.setString(2,Constants.AMBASSADOR_ROLE);
        pstmt.setString(3,email);
        pstmt.setString(4,"");
        pstmt.setString(5,Constants.AMBASSADOR_ACCOUNT_TYPE);
        pstmt.setString(6,email);
        pstmt.setString(7,secret);
        pstmt.executeUpdate();

        new Community().addCommunityFeed(Constants.AMBASSADOR_ACCOUNT_TYPE, email, name, Constants.DISPLAY_AMBASSADOR + " - "+name, about, Constants.NEW_AMBASSADOR_CONTENT_TYPE, ambassadoruuid, Constants.ANNOUNCEMENTS_COMMUNITY_SECTION, txyInterested);

        // insert review
        //new Review().addReview(Constants.AMBASSADOR_ACCOUNT_TYPE, email, Constants.NEW_AMBASSADOR_CONTENT_TYPE, ambassadoruuid);
        created = true;
        return created;
    }

    public boolean changeAmbassadorStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _ambassador_account set status=? where uuid=?";
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

    protected JSONObject editAmbassadorDetails(String accountSlug, JSONObject input){
        JSONObject output = new JSONObject();
        boolean edited = false;
        String name = (String) input.get("name");
        String about = (String) input.get("about");

        try {
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
            String sql = "update _ambassador_account set name=?,solutions_interested=?,services_interested=?,training_interested=?,skills_interested=?,solutions_interested_vector=?,services_interested_vector=?,training_interested_vector=?,skills_interested_vector=?,visible=?,status=?,txy_interested=?,txy_interested_vector=?,about=? where account_slug=?";
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, name);
            Array solutionsInterestedArray = conn.createArrayOf("text", solutionsInterested);
            pstmt.setArray(2, solutionsInterestedArray);
            Array servicesInterestedArray = conn.createArrayOf("text", servicesInterested);
            pstmt.setArray(3, servicesInterestedArray);
            Array trainingsInterestedArray = conn.createArrayOf("text", trainingsInterested);
            pstmt.setArray(4, trainingsInterestedArray);
            Array skillsInterestedArray = conn.createArrayOf("text", skillsInterested);
            pstmt.setArray(5, skillsInterestedArray);
            PGobject solutionsInterestedVectorObject = new PGobject();
            solutionsInterestedVectorObject.setType("vector");
            solutionsInterestedVectorObject.setValue(RecoUtil.vectorToString(solutionsInterestedVector));
            pstmt.setObject(6, solutionsInterestedVectorObject);
            //System.out.println("Solutions Interested:"+Arrays.toString(solutionsInterested));
            //System.out.println("Vector:"+vectorToString(solutionsInterestedVector));
            PGobject servicesInterestedVectorObject = new PGobject();
            servicesInterestedVectorObject.setType("vector");
            servicesInterestedVectorObject.setValue(RecoUtil.vectorToString(servicesInterestedVector));
            pstmt.setObject(7, servicesInterestedVectorObject);
            PGobject trainingsInterestedVectorObject = new PGobject();
            trainingsInterestedVectorObject.setType("vector");
            trainingsInterestedVectorObject.setValue(RecoUtil.vectorToString(trainingsInterestedVector));
            pstmt.setObject(8, trainingsInterestedVectorObject);
            PGobject skillsInterestedVectorObject = new PGobject();
            skillsInterestedVectorObject.setType("vector");
            skillsInterestedVectorObject.setValue(RecoUtil.vectorToString(skillsInterestedVector));
            pstmt.setObject(9, skillsInterestedVectorObject);
            pstmt.setInt(10, 1);
            pstmt.setInt(11, 1);
            Array txyInterestedArray = conn.createArrayOf("text", txyInterested);
            pstmt.setArray(12, txyInterestedArray);
            PGobject txyInterestedVectorObject = new PGobject();
            txyInterestedVectorObject.setType("vector");
            txyInterestedVectorObject.setValue(RecoUtil.vectorToString(txyInterestedVector));
            pstmt.setObject(13, txyInterestedVectorObject);
            pstmt.setString(14, about);
            pstmt.setString(15, accountSlug);
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
