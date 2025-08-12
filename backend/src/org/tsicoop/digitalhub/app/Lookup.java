package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Masters;
import org.tsicoop.digitalhub.framework.InputProcessor;
import org.tsicoop.digitalhub.framework.OutputProcessor;
import org.tsicoop.digitalhub.framework.REST;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Lookup implements REST {

    private static final String FUNCTION = "_func";

    private static final String LOOKUP = "lookup";
    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        JSONArray outputArray = null;
        String func = null;
        String type = null;
        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            type = (String) input.get("type");

            if(func != null){
                if(func.equalsIgnoreCase(LOOKUP)){
                    outputArray = Masters.getLookup(type);
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
