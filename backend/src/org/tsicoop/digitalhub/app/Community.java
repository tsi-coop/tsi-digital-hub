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

public class Community implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_RECOMMENDATIONS = "get_recommendations";

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
               if(func.equalsIgnoreCase(GET_RECOMMENDATIONS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendations(accountType, accountSlug, pg);
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

    public JSONObject addCommunityFeed( String accountType,
                                        String accountSlug,
                                        String postedBy,
                                        String title,
                                        String summary,
                                        String contentType,
                                        String contentUUID,
                                        String communitySection,
                                        String[] txyOffered){
        JSONObject jsob = new JSONObject();
        boolean added = false;
        summary = summary.replaceAll("\n","<br/>");
        String[] txyOfferedPlus = RecoUtil.addString(txyOffered,communitySection);
        //RecoUtil.printStringArray(txyOfferedPlus);
        try {
            String cfeedUUID = UUID.randomUUID().toString();
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOfferedPlus);
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _cfeed (content_type,content_uuid,title,summary,txy_offered,txy_offered_vector,from_account_type,from_account_slug,uuid,posted_by,community_section) VALUES (?, ?, ?, ?,?, ?,?,?,?,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, contentType);
            pstmt.setString(2, contentUUID);
            pstmt.setString(3, title);
            pstmt.setString(4, summary);
            Array txyOfferedArray = conn.createArrayOf("text", txyOfferedPlus);
            pstmt.setArray(5, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(6, txyOfferedVectorObject);
            pstmt.setString(7, accountType);
            pstmt.setString(8, accountSlug);
            pstmt.setString(9, cfeedUUID);
            pstmt.setString(10, postedBy);
            pstmt.setString(11, communitySection);
            pstmt.executeUpdate();
            added = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("added",added);
        return jsob;
    }

    public boolean changeCommunityFeedStatus(String contentType, String contentUUID, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{

            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _cfeed set status=? where content_type=? and content_uuid=?";
            pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setInt(1, status);
            pstmt.setString(2, contentType);
            pstmt.setString(3, contentUUID);
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

    public JSONArray getRecommendations(String accountType, String accountSlug, int pg) throws Exception {
        //System.out.println(accountType+" - "+accountSlug);
        JSONArray recommendations = new JSONArray();
        String sql = null;
        int offset = 0;
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String[] taxonomyInterested = JSONUtil.toStringArray((JSONArray) userDetails.get("txy_interested"));
        //System.out.println(Arrays.toString(taxonomyInterested));
        double[] queryVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), taxonomyInterested) ;
        String vectorString = RecoUtil.vectorToString(queryVector);

        if(pg == 0||pg == 1) {
            pg = 1;
            offset = 0;
        }else{
            offset = (pg-1)*Constants.RECORDS_PER_PAGE;
        }

        Connection con = null;
        JSONObject jsob = null;
        con = new PoolDB().getConnection();
        sql = "SELECT uuid,posted_by,content_type,content_uuid,title,summary,created,txy_offered,from_account_type,from_account_slug from _cfeed where status=? ORDER BY created desc,txy_offered_vector <#> ?::vector LIMIT ? OFFSET ?";
        try (PreparedStatement pstmt = con.prepareStatement(sql)) {
            pstmt.setInt(1, Constants.APPROVED_STATUS);
            pstmt.setString(2, vectorString);
            pstmt.setInt(3, Constants.RECORDS_PER_PAGE);
            pstmt.setInt(4,offset);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    jsob = new JSONObject();
                    String title = rs.getString("title");
                    String topic = title.substring(0,title.indexOf("-")-1);
                    String realtitle = title.substring(title.indexOf("-"));
                    jsob.put("id", rs.getString("uuid"));
                    jsob.put("posted_by", rs.getString("posted_by"));
                    jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                    jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                    jsob.put("content_type", rs.getString("content_type"));
                    jsob.put("content_uuid", rs.getString("content_uuid"));
                    jsob.put("title", "<font color=\"#006A67\">"+topic+"</font>"+" -"+realtitle);
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
