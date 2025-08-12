package org.tsicoop.digitalhub.common;

import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.framework.*;
import java.sql.Types;

public class OTP {

    public static JSONObject sendOTP(JSONObject input) throws Exception{
        JSONObject out = new JSONObject();
        String email = (String) input.get("email");
        String otp = Email.generate4DigitOTP();
        updateUserOTP(email, otp);
        Email.sendOTP(email,otp);
        out.put("_sent",true);
        return out;
    }

    private static void updateUserOTP(String email, String otp) throws Exception{
        String sql = null;
        DBQuery query = null;
        sql = "update _user set secret=? where email=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,otp);
        query.setValue(Types.VARCHAR,email);
        new PoolDB().update(query);
    }

    public static JSONObject validateOTP(JSONObject input) throws Exception{
        JSONObject out = new JSONObject();
        boolean auth = false;
        DBQuery query = null;
        DBResult rs = null;
        JSONObject result = null;
        String name = null;
        String role = null;
        String type = null;
        String token = null;
        String email = (String) input.get("email");
        String otp = (String) input.get("otp");
        String sql = "select name,role_slug,account_type from _user where email=? and secret=?";
        query = new DBQuery(sql);
        query.setValue(Types.VARCHAR,email);
        query.setValue(Types.VARCHAR,otp);
        rs = new PoolDB().fetch(query);
        if(rs.hasNext()){
            result = (JSONObject) rs.next();
            name = (String) result.get("name");
            role = (String) result.get("role_slug");
            type = (String) result.get("account_type");
            auth = true;
            token = JWTUtil.generateToken(email,type,name,role);
            out.put("_token",token);
        }
        out.put("_auth",auth);
        return out;
    }
}
