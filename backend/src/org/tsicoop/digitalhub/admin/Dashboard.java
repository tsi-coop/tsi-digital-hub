package org.tsicoop.digitalhub.admin;

import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.framework.InputProcessor;
import org.tsicoop.digitalhub.framework.OutputProcessor;
import org.tsicoop.digitalhub.framework.REST;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Dashboard implements REST {

    private static final String FUNCTION = "_func";

    private static final String GET_DASHBOARD_SUMMARY = "get_dashboard_summary";

    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        System.out.println("Inside Dashboard API");
        JSONObject input = null;
        JSONObject output = null;
        String func = null;

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);

            if(func != null){
                if(func.equalsIgnoreCase(GET_DASHBOARD_SUMMARY)){
                    output = getSummary(input);
                }
            }
            OutputProcessor.send(res, HttpServletResponse.SC_OK, output);
        }catch(Exception e){
            OutputProcessor.sendError(res,HttpServletResponse.SC_INTERNAL_SERVER_ERROR,"Unknown server error");
            e.printStackTrace();
        }
    }

    private JSONObject getSummary(JSONObject input){
        JSONObject out = new JSONObject();
        System.out.println("This works");
        return out;
    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        return true;
    }
}
