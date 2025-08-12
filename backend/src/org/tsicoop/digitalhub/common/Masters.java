package org.tsicoop.digitalhub.common;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.framework.PoolDB;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

public class Masters {

    private static String[] solutionList = null;

    private static HashMap<String,String> solutionTaxonomyMap = null;
    private static HashMap<String,String> solutionNameMap = null;
    private static String[] serviceList = null;

    private static HashMap<String,String> serviceTaxonomyMap = null;
    private static HashMap<String,String> serviceNameMap = null;
    private static String[] trainingList = null;

    private static HashMap<String,String> trainingTaxonomyMap = null;
    private static HashMap<String,String> trainingNameMap = null;
    private static String[] skillList = null;

    private static HashMap<String,String> skillTaxonomyMap = null;
    private static HashMap<String,String> skillNameMap = null;

    private static String[] taxonomiesList = null;
    private static JSONArray industryVerticals = null;
    private static HashMap<String,JSONArray> industrySubTypeMap = null;
    private static HashMap<String,float[]> geoCache = null;

    private static JSONArray stateList = null;

    private static HashMap<String,JSONArray> stateCitiesMap = null;

    private static HashMap<String,JSONArray> dropdownValuesMap = null;

    private static HashMap<String,JSONObject> industrySolutionsTreeMap = null;
    private static JSONArray generalITSolutionsTree = null;

    private static JSONArray servicesTree = null;
    private static JSONArray trainingsTree = null;

    private static JSONArray skillsTree = null;

    private static HashMap<String,JSONArray> lookupMap = null;

    public static JSONArray getLookup(String type) throws SQLException {
        return lookupMap.get(type);
    }

    public static void loadLookup() throws SQLException{
        Statement stmt = null;
        StringBuffer buff = null;
        Connection con = null;
        ResultSet rs = null;
        String lookupType = null;
        String lookupSlug = null;
        String lookupValue = null;
        JSONArray details = null;
        lookupMap = new HashMap<String,JSONArray>();
        try {
            con = new PoolDB().getConnection();
            // insert schema mgr
            buff = new StringBuffer();
            buff.append("select lookup_type,lookup_slug,lookup_value from _lookup");
            stmt = con.createStatement();
            rs = stmt.executeQuery(buff.toString());
            int i=0;
            while(rs.next()) {
                lookupType = rs.getString("lookup_type");
                lookupSlug = rs.getString("lookup_slug");
                lookupValue = rs.getString("lookup_value");
                JSONObject jsob = new JSONObject();
                jsob.put("slug", lookupSlug);
                jsob.put("value", lookupValue);
                if (lookupMap.get(lookupType) == null) {
                    details = new JSONArray();
                    details.add(jsob);
                    lookupMap.put(lookupType, details);
                } else {
                    details = lookupMap.get(lookupType);
                    details.add(jsob);
                    lookupMap.put(lookupType, details);
                }
            }
        } catch(Exception e){
            e.printStackTrace();
           }
          finally
          {
            PoolDB.close(rs);
            PoolDB.close(stmt);
            PoolDB.close(con);
          }
    }

    public static String[] getSolutionList() {
        if (solutionList != null)
            return  solutionList;
        else{
            if(solutionTaxonomyMap == null) {
                solutionTaxonomyMap = new HashMap<String, String>();
                solutionNameMap = new HashMap<String, String>();
            }
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[500];

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,solution_slug,name from _solution_tags");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                while(rs.next()) {
                    list[i] = rs.getString("solution_slug");
                    solutionTaxonomyMap.put(rs.getString("solution_slug"),rs.getString("txy_slug"));
                    solutionNameMap.put(rs.getString("solution_slug"),rs.getString("name"));
                    i++;
                }
                solutionList = list;
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(Arrays.toString(solutionList));
        return solutionList;
    }

    public static JSONArray getSolutionNames(JSONArray solutionKeys){
        JSONArray solutionNames = new JSONArray();
        if(solutionKeys == null) return solutionNames;
        Iterator<String> it = solutionKeys.iterator();
        String key = null;
        String name = null;
        while(it.hasNext()){
            key = (String) it.next();
            name = (String) solutionNameMap.get(key);
           // System.out.println("key:"+key+" name:"+name);
            solutionNames.add(name);
        }
        return solutionNames;
    }

    public static String[] getServiceList(){
        if (serviceList != null)
            return  serviceList;
        else{
            if(serviceTaxonomyMap == null) {
                serviceTaxonomyMap = new HashMap<String, String>();
                serviceNameMap = new HashMap<String, String>();
            }
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[100];

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,service_slug,name from _service_tags");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                while(rs.next()) {
                    list[i] = rs.getString("service_slug");
                    serviceTaxonomyMap.put(rs.getString("service_slug"),rs.getString("txy_slug"));
                    serviceNameMap.put(rs.getString("service_slug"),rs.getString("name"));
                    i++;
                }
                serviceList = list;
            } catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(Arrays.toString(serviceList));
        return serviceList;
    }

    public static JSONArray getServiceNames(JSONArray serviceKeys){
        JSONArray serviceNames = new JSONArray();
        if(serviceKeys == null) return serviceKeys;
        Iterator<String> it = serviceKeys.iterator();
        String key = null;
        String name = null;
        while(it.hasNext()){
            key = (String) it.next();
            name = (String) serviceNameMap.get(key);
            serviceNames.add(name);
        }
        return serviceNames;
    }

    public static String[] getTrainingList(){
        if (trainingList != null)
            return  trainingList;
        else{
            if(trainingTaxonomyMap == null) {
                trainingTaxonomyMap = new HashMap<String, String>();
                trainingNameMap = new HashMap<String, String>();
            }
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[100];

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,training_slug,name from _training_tags");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                while(rs.next()) {
                    list[i] = rs.getString("training_slug");
                    trainingTaxonomyMap.put(rs.getString("training_slug"),rs.getString("txy_slug"));
                    trainingNameMap.put(rs.getString("training_slug"),rs.getString("txy_slug"));
                    i++;
                }
                trainingList = list;
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(Arrays.toString(trainingList));
        return trainingList;
    }

    public static JSONArray getTrainingNames(JSONArray trainingKeys){
        JSONArray trainingNames = new JSONArray();
        if(trainingKeys == null) return trainingKeys;
        Iterator<String> it = trainingKeys.iterator();
        String key = null;
        String name = null;
        while(it.hasNext()){
            key = (String) it.next();
            name = (String) trainingNameMap.get(key);
            trainingNames.add(name);
        }
        return trainingNames;
    }

    public static String[] getSkillList(){
        if (skillList != null)
            return  skillList;
        else{
            if(skillTaxonomyMap == null) {
                skillTaxonomyMap = new HashMap<String, String>();
                skillNameMap = new HashMap<String, String>();
            }
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[100];

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,skill_slug,name from _skill_tags");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                while(rs.next()) {
                    list[i] = rs.getString("skill_slug");
                    skillTaxonomyMap.put(rs.getString("skill_slug"),rs.getString("txy_slug"));
                    skillNameMap.put(rs.getString("skill_slug"),rs.getString("name"));
                    i++;
                }
                skillList = list;
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(Arrays.toString(skillList));
        return skillList;
    }

    public static JSONArray getSkillNames(JSONArray skillKeys){
        JSONArray skillNames = new JSONArray();
        if(skillKeys == null) return skillKeys;
        Iterator<String> it = skillKeys.iterator();
        String key = null;
        String name = null;
        while(it.hasNext()){
            key = (String) it.next();
            name = (String) skillNameMap.get(key);
            //System.out.println("key:"+key+" name:"+name);
            skillNames.add(name);
        }
        return skillNames;
    }

    public static String[] getTaxonomiesList() {
        if (taxonomiesList != null)
            return  taxonomiesList;
        else{
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[500];

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug from _taxonomy");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                while(rs.next()) {
                    list[i] = rs.getString("txy_slug");
                    i++;
                }
                taxonomiesList = list;
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(Arrays.toString(solutionList));
        return taxonomiesList;
    }

    public static String[] getTaxonomiesList(String[] solutions, String[] services, String[] trainings, String[] skills){
        HashMap<String,String> txMap = new HashMap<String,String>();
        String tx = null;

        for(int i=0; i<solutions.length; i++){
            tx = (String) solutionTaxonomyMap.get(solutions[i]);
            if(tx!=null) {
                txMap.put(tx, tx);
            }
        }

        for(int j=0; j<services.length; j++){
            tx = (String) serviceTaxonomyMap.get(services[j]);
            if(tx!=null) {
                txMap.put(tx, tx);
            }
        }

        for(int k=0; k<trainings.length; k++){
            tx = (String) trainingTaxonomyMap.get(trainings[k]);
            if(tx!=null) {
                txMap.put(tx, tx);
            }
        }

        for(int l=0; l<skills.length; l++){
            tx = (String) skillTaxonomyMap.get(skills[l]);
            if(tx!=null) {
                txMap.put(tx, tx);
            }
        }

        Set txSet = txMap.keySet();
        String[] taxonomies = new String[txSet.size()];
        int i=0;
        Iterator<String> it = txSet.iterator();
        while(it.hasNext()){
             taxonomies[i] = it.next();
             i++;
        }
        return taxonomies;
    }

    public static JSONArray getIndustryVerticals() {
        if (industryVerticals == null) {
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[200];
            JSONArray verticals = new JSONArray();
            JSONObject jsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where type='VERTICAL' and is_root is true");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("key", rs.getString("txy_slug"));
                    jsob.put("value", rs.getString("name"));
                    verticals.add(jsob);
                }
                industryVerticals = verticals;
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return industryVerticals;
    }

    public static JSONArray getIndustrySubTypes(String industrySlug) {
        JSONArray industrySubTypes = null;
        if(industrySubTypeMap == null)
            industrySubTypeMap = new HashMap<String,JSONArray>();

        if (industrySubTypeMap.get(industrySlug) == null) {
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[200];
            JSONArray subverticals = new JSONArray();
            JSONObject jsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where parent='"+industrySlug+"'");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("key", rs.getString("txy_slug"));
                    jsob.put("value", rs.getString("name"));
                    subverticals.add(jsob);
                }
                industrySubTypeMap.put(industrySlug,subverticals);
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return (JSONArray) industrySubTypeMap.get(industrySlug);
    }

    public static JSONArray getStateList() throws SQLException {
        JSONArray stateList = null;
        if(stateList == null){
            stateList = new JSONArray();
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            JSONObject jsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select state_slug,name from _state");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("key", rs.getString("state_slug"));
                    jsob.put("value", rs.getString("name"));
                    stateList.add(jsob);
                }
            } finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return stateList;
    }

    public static JSONArray getStateCities(String stateSlug) {
        JSONArray stateCities = null;
        if(stateCitiesMap == null)
            stateCitiesMap = new HashMap<String,JSONArray>();

        if (stateCitiesMap.get(stateSlug) == null) {
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[200];
            JSONArray cities = new JSONArray();
            JSONObject jsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select city_slug from _city where state_slug='"+stateSlug+"'");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("key", rs.getString("city_slug"));
                    jsob.put("value", rs.getString("city_slug"));
                    cities.add(jsob);
                }
                stateCitiesMap.put(stateSlug,cities);
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return (JSONArray) stateCitiesMap.get(stateSlug);
    }

    public static JSONArray getDropdownValues(String lookup) {
        JSONArray dropdownValues = null;
        if(dropdownValuesMap == null)
            dropdownValuesMap = new HashMap<String,JSONArray>();

        if (dropdownValuesMap.get(lookup) == null) {
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            JSONArray values = new JSONArray();
            JSONObject jsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select lookup_slug,lookup_value from _lookup where lookup_type='"+lookup+"'");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    jsob = new JSONObject();
                    jsob.put("key", rs.getString("lookup_slug"));
                    jsob.put("value", rs.getString("lookup_value"));
                    values.add(jsob);
                }
                dropdownValuesMap.put(lookup,values);
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return (JSONArray) dropdownValuesMap.get(lookup);
    }

    public static JSONObject getIndustrySolutionsTree(String industrySlug) {
        if(industrySolutionsTreeMap == null)
            industrySolutionsTreeMap = new HashMap<String,JSONObject>();

        if (industrySolutionsTreeMap.get(industrySlug) == null) {
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            JSONArray solutions = new JSONArray();
            JSONObject nodejsob = null;
            JSONObject leafjsob = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where txy_slug='"+industrySlug+"'");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                if (rs.next()) {
                    nodejsob = new JSONObject();
                    nodejsob.put("key", rs.getString("txy_slug"));
                    nodejsob.put("value", rs.getString("name"));

                    buff = new StringBuffer();
                    buff.append("select solution_slug,name from _solution_tags where txy_slug='"+industrySlug+"'");
                    stmt = con.createStatement();
                    rs = stmt.executeQuery(buff.toString());
                    while (rs.next()) {
                        leafjsob = new JSONObject();
                        leafjsob.put("key", rs.getString("solution_slug"));
                        leafjsob.put("value", rs.getString("name"));
                        solutions.add(leafjsob);
                    }
                    nodejsob.put("solutions",solutions);
                    industrySolutionsTreeMap.put(industrySlug,nodejsob);
                }
            } catch(Exception e){
                e.printStackTrace();
            } finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return (JSONObject) industrySolutionsTreeMap.get(industrySlug);
    }

    public static JSONArray getAllIndustrySolutionsTree(){
        JSONArray industrySolutions = new JSONArray();
        JSONArray verticals = getIndustryVerticals();
        Iterator<JSONObject> it = verticals.iterator();
        String industrySlug = null;
        JSONObject vertical = null;
        JSONObject industrySolutionsTree = null;
        while(it.hasNext()){
            vertical = (JSONObject) it.next();
            industrySlug = (String) vertical.get("key");
            industrySolutionsTree = getIndustrySolutionsTree(industrySlug);
            industrySolutions.add(industrySolutionsTree);
        }

        return industrySolutions;
    }

    public static JSONArray getGeneralITSolutionsTree(){
        if(generalITSolutionsTree == null){
            generalITSolutionsTree = new JSONArray();
            Statement stmt=null,stmt2 = null;
            StringBuffer buff=null,buff2 = null;
            Connection con = null;
            ResultSet rs=null,rs2 = null;
            JSONArray solutions = null;
            JSONObject nodejsob = null;
            JSONObject leafjsob = null;
            String genITSlug = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where type='HORIZONTAL' and is_root is true");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    nodejsob = new JSONObject();
                    genITSlug = rs.getString("txy_slug");
                    nodejsob.put("nkey", rs.getString("txy_slug"));
                    nodejsob.put("nval", rs.getString("name"));

                    generalITSolutionsTree.add(nodejsob);
                }

                // Add leaf nodes
               Iterator<JSONObject> it = generalITSolutionsTree.iterator();
                while(it.hasNext()){
                    nodejsob = (JSONObject) it.next();
                    solutions = new JSONArray();
                    genITSlug = (String) nodejsob.get("nkey");
                    buff2 = new StringBuffer();
                    buff2.append("select solution_slug,name from _solution_tags where txy_slug='" + genITSlug + "'");
                    stmt2 = con.createStatement();
                    rs2 = stmt2.executeQuery(buff2.toString());
                    while (rs2.next()) {
                        leafjsob = new JSONObject();
                        leafjsob.put("lkey", rs2.getString("solution_slug"));
                        leafjsob.put("lval", rs2.getString("name"));
                        solutions.add(leafjsob);
                    }
                    nodejsob.put("solutions", solutions);
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return generalITSolutionsTree;
    }

    public static JSONArray getServicesTree() {
        if(servicesTree == null){
            servicesTree = new JSONArray();
            Statement stmt=null,stmt2 = null;
            StringBuffer buff=null,buff2 = null;
            Connection con = null;
            ResultSet rs=null,rs2 = null;
            JSONArray services = null;
            JSONObject nodejsob = null;
            JSONObject leafjsob = null;
            String serviceSlug = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where type='SERVICE' and is_root is true");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    nodejsob = new JSONObject();
                    serviceSlug = rs.getString("txy_slug");
                    nodejsob.put("nkey", rs.getString("txy_slug"));
                    nodejsob.put("nval", rs.getString("name"));

                    servicesTree.add(nodejsob);
                }

                // Add leaf nodes
                Iterator<JSONObject> it = servicesTree.iterator();
                while(it.hasNext()){
                    nodejsob = (JSONObject) it.next();
                    services = new JSONArray();
                    serviceSlug = (String) nodejsob.get("nkey");
                    buff2 = new StringBuffer();
                    buff2.append("select service_slug,name from _service_tags where txy_slug='" + serviceSlug + "'");
                    stmt2 = con.createStatement();
                    rs2 = stmt2.executeQuery(buff2.toString());
                    while (rs2.next()) {
                        leafjsob = new JSONObject();
                        leafjsob.put("lkey", rs2.getString("service_slug"));
                        leafjsob.put("lval", rs2.getString("name"));
                        services.add(leafjsob);
                    }
                    nodejsob.put("services", services);
                }
            }  catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return servicesTree;
    }

    public static JSONArray getTrainingsTree() {
        if(trainingsTree == null){
            trainingsTree = new JSONArray();
            Statement stmt=null,stmt2 = null;
            StringBuffer buff=null,buff2 = null;
            Connection con = null;
            ResultSet rs=null,rs2 = null;
            JSONArray trainings = null;
            JSONObject nodejsob = null;
            JSONObject leafjsob = null;
            String trainingSlug = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where type='TRAINING' and is_root is true");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    nodejsob = new JSONObject();
                    trainingSlug = rs.getString("txy_slug");
                    nodejsob.put("nkey", rs.getString("txy_slug"));
                    nodejsob.put("nval", rs.getString("name"));

                    trainingsTree.add(nodejsob);
                }

                // Add leaf nodes
                Iterator<JSONObject> it = trainingsTree.iterator();
                while(it.hasNext()){
                    nodejsob = (JSONObject) it.next();
                    trainings = new JSONArray();
                    trainingSlug = (String) nodejsob.get("nkey");
                    buff2 = new StringBuffer();
                    buff2.append("select training_slug,name from _training_tags where txy_slug='" + trainingSlug + "'");
                    stmt2 = con.createStatement();
                    rs2 = stmt2.executeQuery(buff2.toString());
                    while (rs2.next()) {
                        leafjsob = new JSONObject();
                        leafjsob.put("lkey", rs2.getString("training_slug"));
                        leafjsob.put("lval", rs2.getString("name"));
                        trainings.add(leafjsob);
                    }
                    nodejsob.put("trainings", trainings);
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return trainingsTree;
    }

    public static JSONArray getSkillsTree() {
        if(skillsTree == null){
            skillsTree = new JSONArray();
            Statement stmt=null,stmt2 = null;
            StringBuffer buff=null,buff2 = null;
            Connection con = null;
            ResultSet rs=null,rs2 = null;
            JSONArray skills = null;
            JSONObject nodejsob = null;
            JSONObject leafjsob = null;
            String skillSlug = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select txy_slug,name from _taxonomy where type='SKILL' and is_root is true");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                while (rs.next()) {
                    nodejsob = new JSONObject();
                    skillSlug = rs.getString("txy_slug");
                    nodejsob.put("nkey", rs.getString("txy_slug"));
                    nodejsob.put("nval", rs.getString("name"));

                    skillsTree.add(nodejsob);
                }

                // Add leaf nodes
                Iterator<JSONObject> it = skillsTree.iterator();
                while(it.hasNext()){
                    nodejsob = (JSONObject) it.next();
                    skills = new JSONArray();
                    skillSlug = (String) nodejsob.get("nkey");
                    buff2 = new StringBuffer();
                    buff2.append("select skill_slug,name from _skill_tags where txy_slug='" + skillSlug + "'");
                    stmt2 = con.createStatement();
                    rs2 = stmt2.executeQuery(buff2.toString());
                    while (rs2.next()) {
                        leafjsob = new JSONObject();
                        leafjsob.put("lkey", rs2.getString("skill_slug"));
                        leafjsob.put("lval", rs2.getString("name"));
                        skills.add(leafjsob);
                    }
                    nodejsob.put("skills", skills);
                }
            }catch(Exception e){
                e.printStackTrace();
            }finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        return skillsTree;
    }

    public static HashMap<String,float[]> getGeoCache(){
        if (geoCache != null)
            return  geoCache;
        else{
            Statement stmt = null;
            StringBuffer buff = null;
            Connection con = null;
            ResultSet rs = null;
            String[] list = new String[100];
            String state = null;
            String city = null;
            float latitude = 0f;
            float longitude = 0f;
            float[] geocode = null;

            try {
                con = new PoolDB().getConnection();
                // insert schema mgr
                buff = new StringBuffer();
                buff.append("select state_slug,city_slug,latitude,longitude from _city");
                stmt = con.createStatement();
                rs = stmt.executeQuery(buff.toString());
                int i=0;
                geoCache = new HashMap<String,float[]>();
                while(rs.next()) {
                    state = rs.getString("state_slug");
                    city = rs.getString("city_slug");
                    latitude = rs.getFloat("latitude");
                    longitude = rs.getFloat("longitude");
                    geocode = new float[2];
                    geocode[0] = latitude;
                    geocode[1] = longitude;
                    geoCache.put((state+"_"+city).toLowerCase(),geocode);
                }
            } catch(Exception e){
                e.printStackTrace();
            } finally {
                PoolDB.close(rs);
                PoolDB.close(stmt);
                PoolDB.close(con);
            }
        }
        //System.out.println(geoCache);
        return geoCache;
    }

    public static float[] geoGeoCode(String state, String city){
        float[] geocode = null;
        HashMap<String,float[]> geoCache = getGeoCache();
        geocode = (float[]) geoCache.get((state+"_"+city).toLowerCase());
        return geocode;
    }
}
