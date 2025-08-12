package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.postgresql.util.PGobject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.Masters;
import org.tsicoop.digitalhub.framework.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.util.HashMap;
import java.util.UUID;

public class Job implements REST {

    private static final String FUNCTION = "_func";
    private static final String ADD_JOB = "add_job";
    private static final String GET_BUSINESS_JOBS = "get_business_jobs";

    private static final String GET_RECOMMENDED_JOBS = "get_recommended_jobs";

    private static final String VIEW_JOB = "view_job";

    private static final String EDIT_JOB = "edit_job";

    private static final String CANCEL_JOB = "cancel_job";

    private static final String ADD_JOBAPPLICATION = "add_jobapplication";

    private static final String VIEW_JOBAPPLICATION = "view_jobapplication";

    private static final String GET_BUSINESS_JOB_APPLICATIONS = "get_business_job_applications";

    private static final String GET_PROFESSIONAL_JOB_APPLICATIONS = "get_professional_job_applications";

    private static final String INVITE_FOR_DISCUSSION = "invite_for_discussion";

    private static final String REJECT_APPLICATION = "reject_application";


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
                if(func.equalsIgnoreCase(ADD_JOB)){
                    if(accountType.equals(Constants.BUSINESS_ACCOUNT_TYPE)){
                        boolean added = addJob(accountType, accountSlug, input);
                        output = new JSONObject();
                        if (added) {
                            output.put("_added", true);
                        } else {
                            output.put("_added", false);
                        }
                    }else {
                        output = new JSONObject();
                        output.put("_added", false);
                        output.put("message","Only businesses can post jobs");
                    }
                } else if(func.equalsIgnoreCase(GET_BUSINESS_JOBS)){
                    outputArray = getBusinessJobs(accountType, accountSlug);
                } else if(func.equalsIgnoreCase(GET_RECOMMENDED_JOBS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendations(accountType, accountSlug, pg);
                }  else  if(func.equalsIgnoreCase(VIEW_JOB)){
                    id = (String) input.get("id");
                    output = viewJob(id);
                }  else if(func.equalsIgnoreCase(EDIT_JOB)){
                    boolean edited = editJob(accountType,accountSlug,input);
                    output = new JSONObject();
                    if(edited){
                        output.put("_edited",true);
                    }else{
                        output.put("_edited",false);
                    }
                } else  if(func.equalsIgnoreCase(ADD_JOBAPPLICATION)){
                    if(accountType.equals(Constants.PROFESSIONAL_ACCOUNT_TYPE)){
                        boolean added = addJobApplication(accountType, accountSlug, input);
                        output = new JSONObject();
                        if (added) {
                            output.put("_added", true);
                        } else {
                            output.put("_added", false);
                        }
                    }
                    else {
                        output = new JSONObject();
                        output.put("_added", false);
                        output.put("message","Only professionals can apply for jobs");
                    }
                }else if(func.equalsIgnoreCase(GET_BUSINESS_JOB_APPLICATIONS)){
                    outputArray = getBusinessJobApplications(accountType, accountSlug);
                }else if(func.equalsIgnoreCase(GET_PROFESSIONAL_JOB_APPLICATIONS)){
                    outputArray = getProfessionalJobApplications(accountType, accountSlug);
                }else if(func.equalsIgnoreCase(VIEW_JOBAPPLICATION)){
                    id = (String) input.get("id");
                    output = viewJobApplication(id);
                }else  if(func.equalsIgnoreCase(INVITE_FOR_DISCUSSION)){
                    boolean invited = inviteForDiscussion(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(invited){
                        output.put("_invited",true);
                    }else{
                        output.put("_invited",false);
                    }
                }else  if(func.equalsIgnoreCase(REJECT_APPLICATION)){
                    boolean rejected = rejectApplication(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(rejected){
                        output.put("_rejected",true);
                    }else{
                        output.put("_rejected",false);
                    }
                }else  if(func.equalsIgnoreCase(CANCEL_JOB)){
                    id = (String) input.get("id");
                    boolean cancelled = changeJobStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
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

    public boolean addJob(String accountType, String accountSlug, JSONObject input){
        boolean added = false;
        String jobType = (String) input.get("job_type");
        String title = (String) input.get("title");
        String description = (String) input.get("description");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        HashMap userDetails = null;
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            userDetails = new Org().getOrgDetails(accountSlug);
            postedBy = (String) userDetails.get("org_name");
        }
        try{

            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            String jobuuid = UUID.randomUUID().toString();
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _job (uuid,type,title,description,state_slug,city_slug,txy_offered,txy_offered_vector,from_account_type,from_account_slug,posted_by) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, jobuuid);
            pstmt.setString(2, jobType);
            pstmt.setString(3, title);
            pstmt.setString(4, description);
            pstmt.setString(5, state);
            pstmt.setString(6, city);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(7, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(8, txyOfferedVectorObject);
            pstmt.setString(9, accountType);
            pstmt.setString(10, accountSlug);
            pstmt.setString(11, postedBy);
            pstmt.executeUpdate();
            new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_JOB+" - "+title, description, Constants.JOB_CONTENT_TYPE, jobuuid, Constants.JOBS_COMMUNITY_SECTION, txyOffered);
            //new Review().addReview(accountType, accountSlug, Constants.JOB_CONTENT_TYPE, jobuuid);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public boolean editJob(String accountType, String accountSlug, JSONObject input){
        boolean edited = false;
        String uuid = (String) input.get("id");
        String jobType = (String) input.get("job_type");
        String title = (String) input.get("title");
        String description = (String) input.get("description");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));

        try{

            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);

            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _job set type=?,title=?,description=?,state_slug=?,city_slug=?,txy_offered=?,txy_offered_vector=?,from_account_type=?,from_account_slug=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, jobType);
            pstmt.setString(2, title);
            pstmt.setString(3, description);
            pstmt.setString(4, state);
            pstmt.setString(5, city);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(6, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(7, txyOfferedVectorObject);
            pstmt.setString(8, accountType);
            pstmt.setString(9, accountSlug);
            pstmt.setString(10, uuid);
            pstmt.executeUpdate();
            edited = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return edited;
    }

    public JSONArray getBusinessJobs(String accountType, String accountSlug){
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
            buff.append("select uuid,type,from_account_type,from_account_slug,posted_by,title,state_slug,city_slug,created from _job where from_account_type=? and from_account_slug=?");
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
                jsob.put("type", rs.getString("type"));
                jsob.put("title", rs.getString("title"));
                jsob.put("state", rs.getString("state_slug"));
                jsob.put("city", rs.getString("city_slug"));
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

    public JSONArray getRecommendations(String accountType, String accountSlug, int pg) throws Exception {
        JSONArray recommendations = new JSONArray();
        JSONObject reco = null;

        JSONObject userDetails = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            userDetails = new Org().getOrgDetails(accountSlug);
        }else{
            userDetails = new Talent().getTalentDetails(accountSlug);
        }

        int offset = 0;
        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        String state = (String) userDetails.get("state");
        String city = (String) userDetails.get("city");
        float[] geocode = Masters.geoGeoCode(state,city);
        String[] skillsInterested = (String[]) JSONUtil.toStringArray((JSONArray) userDetails.get("skills_interested"));

        double[] queryVector = RecoUtil.calculateVector(Masters.getSkillList(), skillsInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);
        //System.out.println(vectorString);
        Connection con = new PoolDB().getConnection();
        String sql = "SELECT uuid,from_account_type,from_account_slug,posted_by,type,title,state_slug,city_slug,created from _job where status = ? ORDER BY txy_offered_vector <#> ?::vector, created DESC LIMIT ? OFFSET ?";
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
                    reco.put("posted_by_account_type", rs.getString("from_account_type"));
                    reco.put("posted_by_account_slug", rs.getString("from_account_slug"));
                    reco.put("job_type",rs.getString("type"));
                    reco.put("title",rs.getString("title"));
                    reco.put("state",rs.getString("state_slug"));
                    reco.put("city",rs.getString("city_slug"));
                    reco.put("created",rs.getTimestamp("created").toString());
                    recommendations.add(reco);
                }
            }
        }
        return recommendations;
    }

    public JSONObject viewJob(String uuid){
        JSONObject job = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select type,title,description,state_slug,city_slug,created from _job  where uuid='"+uuid+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                job.put("job_type",rs.getString("type"));
                job.put("title",rs.getString("title"));
                job.put("description",rs.getString("description"));
                job.put("state",rs.getString("state_slug"));
                job.put("city",rs.getString("city_slug"));
                job.put("created",rs.getTimestamp("created").toString());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return job;
    }

    public boolean changeJobStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _job set status=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            new Community().changeCommunityFeedStatus(Constants.JOB_CONTENT_TYPE, uuid, status);
            changed = true;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return changed;
    }

    public boolean addJobApplication(String accountType, String accountSlug, JSONObject input){
        boolean added = false;
        String jobId = (String) input.get("job_id");
        String applicantName = (String) input.get("applicant_name");
        String coveringLetter = (String) input.get("covering_letter");
        String resumeUri = (String) input.get("resume_uri");
        String state = (String) input.get("state");
        String city = (String) input.get("city");
        long internalJobId = 0L;
        String toAccountType = null;
        String toAccountSlug = null;
        try{
            Connection conn = new PoolDB().getConnection();
            // Get internal job id
            String sql1 = "SELECT from_account_type,from_account_slug,job_id from _job where uuid=?";
            //System.out.println(sql);
            try (PreparedStatement pstmt = conn.prepareStatement(sql1)) {
                pstmt.setString(1, jobId);
                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        internalJobId = rs.getLong("job_id");
                        toAccountType = rs.getString("from_account_type");
                        toAccountSlug = rs.getString("from_account_slug");
                    }
                }
            }

            // Insert Job Application
            if(internalJobId>0) {
                String jobApplicationUUId = UUID.randomUUID().toString();
                String sql2 = "INSERT INTO _job_application (uuid,job_id,from_account_type,from_account_slug,applicant_name,covering_letter,state_slug,city_slug,resume_path,status,to_account_type,to_account_slug) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?,?)";
                PreparedStatement pstmt = conn.prepareStatement(sql2, Statement.RETURN_GENERATED_KEYS);
                pstmt.setString(1, jobApplicationUUId);
                pstmt.setLong(2, internalJobId);
                pstmt.setString(3, accountType);
                pstmt.setString(4, accountSlug);
                pstmt.setString(5, applicantName);
                pstmt.setString(6, coveringLetter);
                pstmt.setString(7, state);
                pstmt.setString(8, city);
                pstmt.setString(9, resumeUri);
                pstmt.setInt(10, Constants.APPLIED_JOB_STATUS);
                pstmt.setString(11, toAccountType);
                pstmt.setString(12, toAccountSlug);
                pstmt.executeUpdate();
                //new Review().addReview(accountType, accountSlug, Constants.JOB_APPLICATION_CONTENT_TYPE, jobApplicationUUId);
                new Notification().addNotification(accountType, accountSlug, Constants.JOB_APPLICATION_NOTIFICATION, Constants.DISPLAY_JOB_APPLICATION+" - "+ applicantName, Constants.JOB_APPLICATION_CONTENT_TYPE,jobApplicationUUId,Constants.BUSINESS_ACCOUNT_TYPE,toAccountSlug,jobApplicationUUId);
                added = true;
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public JSONArray getBusinessJobApplications(String accountType, String accountSlug){
        //System.out.println("Inside getReceivedTestimonials:"+accountType+" "+accountSlug);
        JSONArray jobapplications = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select ja.uuid,ja.from_account_type,ja.from_account_slug,ja.applicant_name,ja.state_slug,ja.city_slug,ja.status,ja.created,j.type,j.title from _job_application ja, _job j where ja.job_id=j.job_id and to_account_type=? and to_account_slug=? order by created desc");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("from_account_type", rs.getString("from_account_type"));
                jsob.put("from_account_slug", rs.getString("from_account_slug"));
                jsob.put("applicant_name", rs.getString("applicant_name"));
                jsob.put("state", rs.getString("state_slug"));
                jsob.put("city", rs.getString("city_slug"));
                jsob.put("status", rs.getString("status"));
                jsob.put("job_type", rs.getString("type"));
                jsob.put("job_title", rs.getString("title"));
                jsob.put("created",rs.getTimestamp("created").toString());
                jobapplications.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return jobapplications;
    }

    public JSONObject viewJobApplication(String id){
        //System.out.println("Inside getReceivedTestimonials:"+accountType+" "+accountSlug);
        JSONObject jsob = new JSONObject();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select ja.from_account_type,ja.from_account_slug,ja.applicant_name,ja.state_slug,ja.city_slug,ja.covering_letter,ja.resume_path,ja.status,ja.created,j.type,j.title from _job_application ja, _job j where ja.job_id=j.job_id and ja.uuid=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,id);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("from_account_type", rs.getString("from_account_type"));
                jsob.put("from_account_slug", rs.getString("from_account_slug"));
                jsob.put("applicant_name", rs.getString("applicant_name"));
                jsob.put("state", rs.getString("state_slug"));
                jsob.put("city", rs.getString("city_slug"));
                jsob.put("status", rs.getString("status"));
                jsob.put("job_type", rs.getString("type"));
                jsob.put("job_title", rs.getString("title"));
                jsob.put("covering_letter", rs.getString("covering_letter"));
                jsob.put("resume_url", rs.getString("resume_path"));
                jsob.put("created",rs.getTimestamp("created").toString());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return jsob;
    }

    public JSONArray getProfessionalJobApplications(String accountType, String accountSlug){
        //System.out.println("Inside getReceivedTestimonials:"+accountType+" "+accountSlug);
        JSONArray jobapplications = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select ja.uuid,ja.to_account_type,ja.to_account_slug,ja.applicant_name,ja.state_slug,ja.city_slug,ja.status,ja.created,j.type,j.title,j.description,j.posted_by from _job_application ja, _job j where ja.job_id=j.job_id and ja.from_account_type=? and ja.from_account_slug=?");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            rs = pstmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("to_account_type", rs.getString("to_account_type"));
                jsob.put("to_account_slug", rs.getString("to_account_slug"));
                jsob.put("org_name", rs.getString("posted_by"));
                jsob.put("status", rs.getString("status"));
                jsob.put("job_type", rs.getString("type"));
                jsob.put("job_title", rs.getString("title"));
                jsob.put("job_description", rs.getString("description"));
                jsob.put("created",rs.getTimestamp("created").toString());
                jobapplications.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return jobapplications;
    }

    public boolean changeJobApplicationStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _job_application set status=? where uuid=?";
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

    public boolean inviteForDiscussion(String accountType, String accountSlug, JSONObject input){
        boolean invited = false;
        String uuid = (String) input.get("id");
        try{
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _job_application set status=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, Constants.DISCUSSION_JOB_STATUS);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            invited = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return invited;
    }

    public boolean rejectApplication(String accountType, String accountSlug, JSONObject input){
        boolean rejected = false;
        String uuid = (String) input.get("id");
        try{
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _job_application set status=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, Constants.REJECTED_JOB_STATUS);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            rejected = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return rejected;
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
