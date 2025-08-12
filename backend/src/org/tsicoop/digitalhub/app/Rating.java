package org.tsicoop.digitalhub.app;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.tsicoop.digitalhub.common.Constants;
import org.tsicoop.digitalhub.common.User;
import org.tsicoop.digitalhub.framework.*;
import java.sql.*;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.UUID;

public class Rating implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_ASSESSMENT_QUESTIONAIRE = "get_assessment_questionaire";

    private static final String SAVE_ASSESSMENT = "save_assessment";

    private static final String GET_ASSESSMENT_REPORT = "get_assessment_report";

    private static final String GET_ASSESSMENT_SUMMARY = "get_assessment_summary";



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
        String assessmentType = null;
        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            accountType = InputProcessor.getAccountType(req);
            accountSlug = InputProcessor.getAccountSlug(req);

            if(func != null){
                if(func.equalsIgnoreCase(GET_ASSESSMENT_QUESTIONAIRE)){
                   output = getAssessmentQuestionaire(accountType, accountSlug, input);
                }else if(func.equalsIgnoreCase(SAVE_ASSESSMENT)){
                    output = saveAssessment(accountType, accountSlug, input);
                }else if(func.equalsIgnoreCase(GET_ASSESSMENT_REPORT)){
                    id = (String) input.get("id");
                    output = getAssessmentReport(id);
                }else if(func.equalsIgnoreCase(GET_ASSESSMENT_SUMMARY)){
                    assessmentType = (String) input.get("assessment_type");
                    output = getAssessmentSummary(accountType, accountSlug,assessmentType);
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

    private JSONObject getAssessmentQuestionaire(String accountType, String accountSlug, JSONObject input){
        JSONObject assessment = new JSONObject();
        String assessment_type = (String) input.get("assessment_type");
        String version = (String) input.get("version");
        assessment = SystemConfig.readJSONTemplate("/WEB-INF/assessments/"+assessment_type+"-"+version+".json");
        return assessment;
    }



    public JSONObject saveAssessment(String accountType, String accountSlug, JSONObject input){
        JSONObject jsob = new JSONObject();
        boolean saved = false;

        if(!accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)) {
            jsob.put("_saved",saved);
            return jsob;
        }

        HashMap userDetails = User.getUserDetails(accountType,accountSlug);
        String orgName = (String) userDetails.get("org_name");
        String assessmentType = (String) input.get("assessment_type");
        String version = (String) input.get("version");
        JSONObject assessment = (JSONObject) input.get("assessment");
        JSONObject template = SystemConfig.readJSONTemplate("/WEB-INF/assessments/"+assessmentType+"-"+version+".json");
        JSONObject results = eval(template, assessment);

        try {
            String ratingUUID = UUID.randomUUID().toString();
            Connection conn = new PoolDB().getConnection();
            // Insert Enquiry
            String sql = "INSERT INTO _rating (uuid,account_type,account_slug,assessment_type,version,assessment,results,status,org_name) VALUES (?, ?, ?, ?,?, ?::json,?::json,?,?)";
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            pstmt.setString(1, ratingUUID);
            pstmt.setString(2, accountType);
            pstmt.setString(3, accountSlug);
            pstmt.setString(4, assessmentType);
            pstmt.setString(5, version);
            pstmt.setString(6, assessment.toJSONString());
            pstmt.setString(7, results.toJSONString());
            pstmt.setInt(8, Constants.APPROVED_STATUS);
            pstmt.setString(9, orgName);
            pstmt.executeUpdate();
            saved = true;
            jsob.put("assessment_id",ratingUUID);
        }catch (Exception e){
            e.printStackTrace();
        }
        jsob.put("_saved",saved);
        return jsob;
    }

    private JSONObject eval(JSONObject template, JSONObject data){
        JSONObject results = new JSONObject();
        JSONArray sections = null;
        String sectionTitle = null;
        Iterator<JSONObject> sectionIt = null;
        JSONObject sectionOb = null;
        JSONArray questions = null;
        Iterator<JSONObject> questionIt = null;
        JSONObject questionOb = null;
        String qid = null;
        String value = null;
        int valueInt = 0;
        int score = 0;
        int sectionScore = 0;
        int sectionCount = 0;
        float sectionAvg = 0f;
        String assessmentType = null;
        JSONArray strengths = new JSONArray();
        JSONArray weaknesses = new JSONArray();

        assessmentType = (String) template.get("assessment_type");
        sections = (JSONArray) template.get("sections");
        sectionIt = sections.iterator();
        while(sectionIt.hasNext()){
            sectionOb = (JSONObject) sectionIt.next();
            sectionTitle = (String) sectionOb.get("sectionTitle");
            questions = (JSONArray) sectionOb.get("questions");
            questionIt = questions.iterator();
            sectionScore = 0;sectionCount = 0;
            while(questionIt.hasNext()){
                questionOb = (JSONObject) questionIt.next();
                qid = (String) questionOb.get("questionId");
                valueInt =  (int)(long) data.get(qid);
                score += valueInt;
                sectionCount++;
                sectionScore += valueInt;
            }
            sectionAvg = sectionScore/sectionCount;
            if(sectionAvg>=4){
                strengths.add(sectionTitle);
            }else if(sectionAvg<=2){
                weaknesses.add(sectionTitle);
            }
        }

        if(assessmentType.equalsIgnoreCase(Constants.CAPABILITY_MATURITY_ASSESSMENT)){
            if(score<=24){
                results.put("rating",1);
                results.put("rating_summary","Level 1: Ad-Hoc / Initial");
                results.put("score",score);
                results.put("description","Processes are unpredictable, reactive, and often chaotic. Success depends heavily on individual heroics rather than established procedures. Little documentation or standardization.");
                results.put("characteristics","No formal strategy, inconsistent service delivery, informal client communication, reactive problem-solving, minimal use of defined tools.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Focus on defining basic processes for service delivery and project management, establish clear roles, and implement fundamental tools for communication and basic tracking.");
            }else if(score<=36){
                results.put("rating",2);
                results.put("rating_summary","Level 2: Managed / Basic");
                results.put("score",score);
                results.put("description","Basic project management processes are established to track cost, schedule, and functionality. Success can be repeated on similar projects due to some repeatable practices, but these are often reactive rather than proactive.");
                results.put("characteristics","Some documented procedures, inconsistent but improving service quality, basic client updates, primary digital tools used individually.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Standardize key delivery processes, implement basic quality checks, formalize client communication, and invest in basic training for consistent output.");
            }else if(score<=48){
                results.put("rating",3);
                results.put("rating_summary","Level 3: Defined / Developing");
                results.put("score",score);
                results.put("description","Processes for both management and engineering activities are documented, standardized, and integrated across the organization. Projects use an approved, tailored version of the organization's standard processes.");
                results.put("characteristics","Clear service definitions, defined project methodologies, structured client management, growing technical expertise, some feedback mechanisms.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Optimize existing processes, encourage innovation within defined frameworks, establish robust feedback loops, and strategically adopt FOSS/Open APIs where beneficial.");
            }else if(score<=59){
                results.put("rating",4);
                results.put("rating_summary","Level 4: Quantitatively Managed / Consistent");
                results.put("score",score);
                results.put("description","Detailed measures of the service process and product quality are collected. Both the process and products are quantitatively understood and controlled, enabling predictable performance.");
                results.put("characteristics","Data-driven decision-making, high service quality, predictable project outcomes, strong client relationships, proactive cybersecurity, continuous skill development.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Implement advanced analytics for performance monitoring, explore automation for efficiency, proactively identify new technologies, and expand partnership networks.");
            }else if(score<=70){
                results.put("rating",5);
                results.put("rating_summary","Level 5: Optimizing / Leading");
                results.put("score",score);
                results.put("description","The organization continuously improves its processes based on a quantitative understanding of common causes of variation. Innovation is actively fostered and integrated.");
                results.put("characteristics"," Innovation-driven, highly adaptable, exceptional client satisfaction, continuous process optimization, thought leadership in their digital domains, strong community engagement.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Lead industry best practices, invest in cutting-edge R&D, foster a culture of continuous learning and adaptation, and seek accreditation as a recognized standard.");
            }
        }else if(assessmentType.equalsIgnoreCase(Constants.DIGITAL_MATURITY_ASSESSMENT)){
            if(score<=28){
                results.put("rating",1);
                results.put("rating_summary","Level 1: Nascent");
                results.put("score",score);
                results.put("description","The organisation has very limited digital adoption, largely relies on manual processes, and lacks a clear digital strategy. Digital tools, if used, are isolated and reactive. Awareness of digital potential is low.");
                results.put("characteristics","Primarily offline, basic communication, no structured data, high manual effort, low digital skill set.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Focus on foundational digital literacy, basic online presence (GMB, social media), and initial digitization of core administrative tasks.");
            }else if(score<=41){
                results.put("rating",2);
                results.put("rating_summary","Level 2: Emerging");
                results.put("score",score);
                results.put("description","The organisation has begun to adopt some digital tools, often in an uncoordinated manner. There's an awareness of digital benefits, but no cohesive strategy. Processes might be partially digitized.");
                results.put("characteristics","Some online presence, basic use of digital communication, fragmented data, growing but inconsistent use of software.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Develop a simple digital roadmap, explore cloud tools for efficiency, establish basic cybersecurity, and offer introductory digital training.");
            }else if(score<=54){
                results.put("rating",3);
                results.put("rating_summary","Level 3: Developing");
                results.put("score",score);
                results.put("description","The organisation is actively integrating digital tools into various aspects of its business. There's a nascent digital strategy, and some processes are becoming more efficient. Data collection exists but analysis might be limited.");
                results.put("characteristics","Dedicated website, basic digital marketing, some internal collaboration tools, moderate digital skills, conscious of data.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Integrate existing digital tools, explore CRM/ERP Lite, implement structured digital marketing, and invest in targeted skill development.");
            }else if(score<=67){
                results.put("rating",4);
                results.put("rating_summary","Level 4: Mature");
                results.put("score",score);
                results.put("description","The organisation leverages digital technologies strategically across most functions. They have a clear digital vision, data-driven decision-making is emerging, and cybersecurity is prioritized.");
                results.put("characteristics","Strong online presence, active digital marketing, automated key processes, data-driven insights, proactive cybersecurity, good digital culture.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", "Optimize digital processes, explore advanced analytics, consider AI/automation pilot projects, and foster continuous digital innovation.");
            }else{
                results.put("rating",5);
                results.put("rating_summary","Level 5: Advanced");
                results.put("score",score);
                results.put("description","The organisation is a digitally transformed entity, continuously innovating and leveraging technology to gain a competitive advantage. Digital is ingrained in its culture, strategy, and operations.");
                results.put("characteristics","Digital-first approach, highly automated and integrated systems, advanced analytics, personalized customer experiences, robust cybersecurity, continuous digital learning and adaptation.");
                results.put("strengths",strengths);
                results.put("areas_for_improvement",weaknesses);
                results.put("recommendation", " Explore disruptive technologies, engage in industry leadership, develop digital products/services, and benchmark against global best practices.");
            }
        }
        return results;
    }

    public JSONObject getAssessmentReport(String id){
        JSONObject jsob = new JSONObject();
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String assessmentType = null;
        String title = null;
        String orgName = null;
        String results = null;
        JSONObject resultsOb = null;

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select assessment_type,org_name,results,created from _rating where uuid='"+id+"'");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            if (rs.next()) {
                jsob = new JSONObject();
                assessmentType = rs.getString("assessment_type");
                orgName = rs.getString("org_name");
                if(assessmentType.equalsIgnoreCase("digital-maturity")){
                    title = "Your Digital Maturity Report - "+orgName;
                }else{
                    title = "Your Capability Maturity Report - "+orgName;
                }
                jsob.put("org_name", orgName);
                jsob.put("title", title);
                results = rs.getString("results");
                resultsOb = (JSONObject) new JSONParser().parse(results);

                jsob.put("rating", resultsOb.get("rating"));
                jsob.put("rating_summary",  resultsOb.get("rating_summary"));
                jsob.put("score",  resultsOb.get("score"));
                jsob.put("description",  resultsOb.get("description"));
                jsob.put("characteristics",  resultsOb.get("characteristics"));
                jsob.put("strengths", resultsOb.get("strengths"));
                jsob.put("areas_for_improvement", resultsOb.get("areas_for_improvement"));
                jsob.put("recommendation",  resultsOb.get("recommendation"));

                // Custom pattern for only date (e.g., 01-07-2025)
                Instant instant = rs.getTimestamp("created").toInstant();
                DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                ZoneId kolkataZoneId = ZoneId.of("Asia/Kolkata"); // Indian Standard Time
                ZonedDateTime zonedDateTime = instant.atZone(kolkataZoneId);
                String formattedDate3 = zonedDateTime.format(formatter3);
                jsob.put("report_date", formattedDate3);

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

    public static JSONObject getAssessmentSummary(String accountType, String accountSlug, String assessmentType){
        JSONObject jsob = new JSONObject();
        PreparedStatement pstmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String results = null;
        JSONObject resultsOb = null;

        //System.out.println(accountType+"-"+accountSlug+"-"+assessmentType);

        try {
            con = new PoolDB().getConnection();
            buff = new StringBuffer();
            buff.append("select uuid,results,created from _rating where account_type=? and account_slug=? and assessment_type=? order by created desc");
            pstmt = con.prepareStatement(buff.toString());
            pstmt.setString(1,accountType);
            pstmt.setString(2,accountSlug);
            pstmt.setString(3,assessmentType);
            rs = pstmt.executeQuery();
            if (rs.next()) {
                jsob = new JSONObject();

                results = rs.getString("results");
                resultsOb = (JSONObject) new JSONParser().parse(results);
                jsob.put("rating", resultsOb.get("rating"));
                jsob.put("rating_summary",  resultsOb.get("rating_summary"));
                jsob.put("score",  resultsOb.get("score"));
                jsob.put("recommendation",  resultsOb.get("recommendation"));
                Instant instant = rs.getTimestamp("created").toInstant();
                DateTimeFormatter formatter3 = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                ZoneId kolkataZoneId = ZoneId.of("Asia/Kolkata"); // Indian Standard Time
                ZonedDateTime zonedDateTime = instant.atZone(kolkataZoneId);
                String formattedDate3 = zonedDateTime.format(formatter3);
                jsob.put("report_date", formattedDate3);
                String timeAgo = DBUtil.getTimeAgo(instant);
                jsob.put("time_ago",timeAgo);
                jsob.put("id", rs.getString("uuid"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            PoolDB.close(rs);
            PoolDB.close(pstmt);
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
