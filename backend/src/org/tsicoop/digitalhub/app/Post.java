package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.postgresql.util.PGobject;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import org.tsicoop.digitalhub.common.Masters;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.sql.*;
import java.time.Instant;
import java.util.*;

public class Post implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_MY_POSTS = "get_my_posts"; // for creators

    private static final String VIEW_POST = "view_post";
    private static final String EDIT_POST = "edit_post";
    private static final String ADD_POST = "add_post";

    private static final String GET_RECOMMENDED_POSTS = "get_recommended_posts";

    private static final String SEARCH_POSTS = "search_posts";

    private static final int MAX_CONTENT_LENGTH = 1000;

    // Post type -> Launch, Tech Event, Give Away, Used IT Asset for Sale, Looking for Job, Tech Advisory, Reviews, Technical Article

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
                if(func.equalsIgnoreCase(ADD_POST)){
                    output = addPost(accountType, accountSlug, input);
                }else if(func.equalsIgnoreCase(GET_MY_POSTS)){
                    outputArray = getMyPosts(accountType,accountSlug);
                }else if(func.equalsIgnoreCase(VIEW_POST)){
                    String id =  (String) input.get("id");
                    output = viewPost(id);
                }else if(func.equalsIgnoreCase(EDIT_POST)){
                    output = editPost(input);
                }else if(func.equalsIgnoreCase(SEARCH_POSTS)){
                    String query = (String) input.get("q");
                    outputArray = searchPost(StringUtil.formatSearchQuery(query));
                }else if(func.equalsIgnoreCase(GET_RECOMMENDED_POSTS)){
                    int pg = 0;
                    if(input.get("pg")!=null)
                        pg = (int)(long)input.get("pg");
                    outputArray = getRecommendedPosts(accountType,accountSlug,pg);
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

    public JSONObject addPost(String accountType, String accountSlug, JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean added = false;
        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String postedBy = null;
        if(accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)){
            postedBy = (String) userDetails.get("org_name");
        }else{
            postedBy = (String) userDetails.get("name");
        }

        String type = (String) input.get("post_type");
        String title = (String) input.get("title");
        String content = (String) input.get("content");
        String sourceLink = (String) input.get("source_link");
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        try {
            String postUUID = UUID.randomUUID().toString();
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _post (type,title,content,content_brief,txy_offered,txy_offered_vector,from_account_type,from_account_slug,uuid,posted_by,source_link,tsv_body) VALUES (?, ?, ?, ?,?, ?,?,?,?,?,?,to_tsvector('english', ?))";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, type);
            pstmt.setString(2, title);
            pstmt.setString(3, content);
            pstmt.setString(4, getContentBrief(content));
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(5, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(6, txyOfferedVectorObject);
            pstmt.setString(7, accountType);
            pstmt.setString(8, accountSlug);
            pstmt.setString(9, postUUID);
            pstmt.setString(10, postedBy);
            pstmt.setString(11, sourceLink);
            pstmt.setString(12, tsvBody(type, title, content, txyOffered));
            pstmt.executeUpdate();
            new Community().addCommunityFeed(accountType, accountSlug, postedBy, Constants.DISPLAY_POST+" - "+title, getContentBrief(content), Constants.POST_CONTENT_TYPE, postUUID, Constants.POSTS_COMMUNITY_SECTION, txyOffered);
            //new Review().addReview(accountType, accountSlug, Constants.POST_CONTENT_TYPE, postUUID);
            added = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("added",added);
        return jsob;
    }

    private String tsvBody(String type, String title, String content, String[] txyOffered){
        StringBuffer buff = new StringBuffer();
        buff.append(type+" ");
        buff.append(title+" ");
        buff.append(content+" ");
        buff.append(StringUtil.arrayToString(txyOffered));
        return buff.toString();
    }

    private String getContentBrief(String content){
        String brief = "";
        if(content.length() <= MAX_CONTENT_LENGTH){
            brief = content;
        }
        else{
            brief = content.substring(0,MAX_CONTENT_LENGTH);
        }
        return brief;
    }

    public JSONObject editPost(JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean edited = false;
        String id = (String) input.get("id");
        String type = (String) input.get("post_type");
        String title = (String) input.get("title");
        String content = (String) input.get("content");
        String sourcelink = (String) input.get("source_link");
        //System.out.println("source link:"+sourcelink);
        String[] txyOffered = JSONUtil.toStringArray((JSONArray) input.get("taxonomies_offered"));
        try {
            double[] txyOfferedVector = RecoUtil.calculateVector(Masters.getTaxonomiesList(), txyOffered);
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _post set type=?,title=?,content=?,content_brief=?,txy_offered=?,txy_offered_vector=?,source_link=? where uuid=?";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, type);
            pstmt.setString(2, title);
            pstmt.setString(3, content);
            pstmt.setString(4, getContentBrief(content));
            Array txyOfferedArray = conn.createArrayOf("text", txyOffered);
            pstmt.setArray(5, txyOfferedArray);
            PGobject txyOfferedVectorObject = new PGobject();
            txyOfferedVectorObject.setType("vector");
            txyOfferedVectorObject.setValue(RecoUtil.vectorToString(txyOfferedVector));
            pstmt.setObject(6, txyOfferedVectorObject);
            pstmt.setString(7, sourcelink);
            pstmt.setString(8, id);
            pstmt.executeUpdate();
            edited = true;
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("edited",edited);
        return jsob;
    }

    public boolean changePostStatus(String uuid, int status){
        boolean changed = false;
        Connection conn = null;
        PreparedStatement pstmt = null;
        try{
            conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "update _post set status=? where uuid=?";
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

    public static JSONArray getMyPosts(String accountType, String accountSlug){
        JSONArray posts = new JSONArray();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,type,title,content_brief,created,source_link,disscount,txy_offered,from_account_type,from_account_slug from _post where from_account_type='"+accountType+"' and from_account_slug='"+accountSlug+"' ORDER BY created desc");
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
                jsob.put("content_brief", rs.getString("content_brief"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                jsob.put("source_link",rs.getString("source_link"));
                jsob.put("discussion_count",rs.getInt("disscount"));
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

    public JSONArray getRecommendedPosts(String accountType, String accountSlug, int pg) throws Exception {
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
        sql = "SELECT uuid,posted_by,title,content_brief,created,txy_offered,from_account_type,from_account_slug from _post where status=? ORDER BY txy_offered_vector <#> ?::vector,created desc LIMIT ? OFFSET ?";
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
                    jsob.put("content_brief", rs.getString("content_brief"));
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

    public static JSONArray searchPost(String query){
        JSONArray posts = new JSONArray();
        PreparedStatement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        JSONObject jsob = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,posted_by,type,title,content_brief,created,source_link,disscount,txy_offered,from_account_type,from_account_slug from _post where tsv_body @@ to_tsquery('english', ?)");
            stmt = con.prepareStatement(buff.toString());
            stmt.setString(1,query);
            rs = stmt.executeQuery();
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("id", rs.getString("uuid"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("posted_by_account_type", rs.getString("from_account_type"));
                jsob.put("posted_by_account_slug", rs.getString("from_account_slug"));
                jsob.put("type", rs.getString("type"));
                jsob.put("title", rs.getString("title"));
                jsob.put("content_brief", rs.getString("content_brief"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                jsob.put("source_link",rs.getString("source_link"));
                jsob.put("discussion_count",rs.getInt("disscount"));
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

    public static JSONObject viewPost(String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select type,posted_by,title,content,created,source_link,disscount,txy_offered from _post where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            while (rs.next()) {
                jsob = new JSONObject();
                jsob.put("content", rs.getString("content"));
                jsob.put("posted_by", rs.getString("posted_by"));
                jsob.put("type", rs.getString("type"));
                jsob.put("title", rs.getString("title"));
                jsob.put("posted",rs.getTimestamp("created").toString());
                jsob.put("source_link",rs.getString("source_link"));
                jsob.put("discussion_count",rs.getInt("disscount"));
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
