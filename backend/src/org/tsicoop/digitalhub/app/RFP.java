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

public class RFP implements REST {

    private static final String FUNCTION = "_func";

    private static final String ADD_RFP = "add_rfp";
    private static final String GET_SENT_RFPS = "get_sent_rfps";

    private static final String GET_RECEIVED_RFPS = "get_received_rfps";

    private static final String GET_RECOMMENDED_RFPS = "get_recommended_rfps";

    private static final String VIEW_RFP = "view_rfp";

    private static final String CANCEL_RFP = "cancel_rfp";

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
                if(func.equalsIgnoreCase(ADD_RFP)){
                    boolean added = addRFP(accountType, accountSlug, input);
                    output = new JSONObject();
                    if(added){
                        output.put("_added",true);
                    }else{
                        output.put("_added",false);
                    }
                }else  if(func.equalsIgnoreCase(GET_SENT_RFPS)){
                    outputArray = getSentRFPs(accountType, accountSlug);
                }else  if(func.equalsIgnoreCase(GET_RECEIVED_RFPS)){
                    outputArray = getReceivedRFPs(accountType, accountSlug);
                }else  if(func.equalsIgnoreCase(VIEW_RFP)){
                    id = (String) input.get("id");
                    output = viewRFP(id);
                }else  if(func.equalsIgnoreCase(CANCEL_RFP)){
                    id = (String) input.get("id");
                    boolean cancelled = changeRFPStatus(id, Constants.CANCELLED_STATUS);
                    output = new JSONObject();
                    if(cancelled){
                        output.put("_cancelled",true);
                    }else{
                        output.put("_cancelled",false);
                    }
                }else  if(func.equalsIgnoreCase(GET_RECOMMENDED_RFPS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedRFPs(accountType, accountSlug, pg);
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

    public boolean addRFP(String accountType, String accountSlug, JSONObject input){
        boolean added = false;
        String senderName = (String) input.get("sender_name");
        String rfpType = (String) input.get("rfp_type");
        String title = (String) input.get("title");
        String summary = (String) input.get("summary");
        String expiry = (String) input.get("expiry");
        String[] docs = (String[]) JSONUtil.toStringArray((JSONArray) input.get("docs"));
        String[] toBusinesses = (String[]) JSONUtil.toStringArray((JSONArray) input.get("to_businesses"));
        String[] toProfessionals = (String[]) JSONUtil.toStringArray((JSONArray) input.get("to_professionals"));
        int discoverable = (int)(long) input.get("discoverable");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            postedBy = (String) userDetails.get("org_name");
        }else{
            postedBy = (String) userDetails.get("name");
        }
        int anonymous = (int)(long) input.get("anonymous");
        if(anonymous == 1){
            postedBy = Constants.ANONYMOUS_PERSONA;
        }
        try{
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            java.util.Date utilDate = formatter.parse(expiry);
            java.sql.Date sqlDate = new java.sql.Date(utilDate.getTime());
            int rfpId = 0;
            Connection conn = new PoolDB().getConnection();
            String rfpuuid = UUID.randomUUID().toString();
            // Insert Enquiry
            String sql = "INSERT INTO _rfp (rfp_type,title,summary,expiry,docs,from_account_type,from_account_slug,discoverable,txy_offered,txy_offered_vector,posted_by,uuid) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?, ?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, rfpType);
            pstmt.setString(2, title);
            pstmt.setString(3, summary);
            pstmt.setDate(4, sqlDate);
            Array docsArray = conn.createArrayOf("text", docs);
            pstmt.setArray(5, docsArray);
            pstmt.setString(6, accountType);
            pstmt.setString(7, accountSlug);
            pstmt.setInt(8, discoverable);
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(9, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(10, txyOfferedVectorObject);
            pstmt.setString(11, postedBy);
            pstmt.setString(12, rfpuuid);
            pstmt.executeUpdate();
            ResultSet rs = pstmt.getGeneratedKeys();
            if (rs.next()) {
                rfpId = rs.getInt(1);
            }

            if(rfpId>0) {
                for (int i = 0; i < toBusinesses.length; i++) {
                    String sql2 = "INSERT INTO _rfp_recipients (rfp_id,sender_name,account_type,account_slug) VALUES (?, ?, ?, ?)";
                    PreparedStatement pstmt2 = conn.prepareStatement(sql2);
                    pstmt2.setInt(1, rfpId);
                    pstmt2.setString(2, senderName);
                    pstmt2.setString(3, "BUSINESS");
                    pstmt2.setString(4, toBusinesses[i]);
                    pstmt2.executeUpdate();
                    new Notification().addNotification(accountType, accountSlug, Constants.RFP_NOTIFICATION, Constants.DISPLAY_RFP+" - "+title, Constants.RFP_CONTENT_TYPE,rfpuuid,Constants.BUSINESS_ACCOUNT_TYPE,toBusinesses[i],postedBy);
                }

                for (int j = 0; j < toProfessionals.length; j++) {
                    String sql3 = "INSERT INTO _rfp_recipients (rfp_id,sender_name,account_type,account_slug) VALUES (?, ?, ?, ?)";
                    PreparedStatement pstmt3 = conn.prepareStatement(sql3);
                    pstmt3.setInt(1, rfpId);
                    pstmt3.setString(2, senderName);
                    pstmt3.setString(3, "PROFESSIONAL");
                    pstmt3.setString(4, toProfessionals[j]);
                    pstmt3.executeUpdate();
                    new Notification().addNotification(accountType, accountSlug, Constants.RFP_NOTIFICATION, Constants.DISPLAY_RFP+" - "+title, Constants.RFP_CONTENT_TYPE,rfpuuid,Constants.PROFESSIONAL_ACCOUNT_TYPE,toProfessionals[j],postedBy);
                }
            }
            if(discoverable==1) {
                new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_RFP+" - " + title, summary, Constants.RFP_CONTENT_TYPE, rfpuuid, Constants.RFPS_COMMUNITY_SECTION, txyOffered);
            }
            //new Review().addReview(accountType, accountSlug, Constants.RFP_CONTENT_TYPE, rfpuuid);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }
        return added;
    }

    public JSONArray getSentRFPs(String accountType, String accountSlug){
        //System.out.println("Inside post:"+accountType+" - "+accountSlug);
        JSONArray rfpList = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,from_account_type,from_account_slug,title,summary,expiry,created from _rfp where from_account_type='"+accountType+"' and from_account_slug='"+accountSlug+"' ORDER BY created desc");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("title", rs.getString("title"));
                jsob.put("summary", rs.getString("summary"));
                jsob.put("expiry", rs.getString("expiry"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                rfpList.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return rfpList;
    }

    public JSONArray getReceivedRFPs(String accountType, String accountSlug){
        JSONArray enquiryList = new JSONArray();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select r.uuid,posted_by,r.from_account_type,r.from_account_slug,r.title,r.summary,r.created from _rfp r,_rfp_recipients rr where r.rfp_id=rr.rfp_id and rr.account_type=? and rr.account_slug=? ORDER BY created desc");
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
                jsob.put("title", rs.getString("title"));
                jsob.put("summary", rs.getString("summary"));
                jsob.put("created",rs.getTimestamp("created").toString());
                Instant instant = rs.getTimestamp("created").toInstant();
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                enquiryList.add(jsob);
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(pstmt);
            PoolDB.close(con);
        }
        return enquiryList;
    }

    public JSONObject viewRFP(String uuid){
        JSONObject rfp = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select title,summary,created from _rfp where uuid='"+uuid+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                rfp.put("title", rs.getString("title"));
                rfp.put("summary", rs.getString("summary"));
                rfp.put("created",rs.getTimestamp("created").toString());
            }
        } catch(Exception e) {
            e.printStackTrace();
        }finally{
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
        }
        return rfp;
    }

    public boolean changeRFPStatus(String uuid, int status){
        boolean added = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _rfp set status=? where uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, uuid);
            pstmt.executeUpdate();
            new Community().changeCommunityFeedStatus(Constants.RFP_CONTENT_TYPE, uuid, status);
            added = true;
        }catch(Exception e){
            e.printStackTrace();
        }finally{
            PoolDB.close(pstmt);
            PoolDB.close(conn);
        }
        return added;
    }

    public JSONArray getRecommendedRFPs(String accountType, String accountSlug, int pg) throws Exception {
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
        sql = "SELECT uuid,posted_by,title,summary,created,txy_offered,from_account_type,from_account_slug from _rfp WHERE status=? and from_account_type <> ? and from_account_slug <> ? ORDER BY created desc,txy_offered_vector <#> ?::vector LIMIT ? OFFSET ?";
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
                    jsob.put("title", rs.getString("title"));
                    jsob.put("summary", rs.getString("summary"));
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
