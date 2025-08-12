package org.tsicoop.digitalhub.admin;

import org.tsicoop.digitalhub.framework.REST;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Data implements REST {

    private static final String FUNCTION = "_func";

    private static final String ADD_TAXONOMY = "add_taxonomy";
    private static final String UPDATE_TAXONOMY = "update_taxonomy";
    private static final String DEACTIVATE_TAXONOMY = "deactivate_taxonomy";

    private static final String ADD_SOLUTION = "add_solution";
    private static final String UPDATE_SOLUTION = "update_SOLUTION";
    private static final String DEACTIVATE_SOLUTION = "deactivate_solution";

    private static final String ADD_SERVICE = "add_service";
    private static final String UPDATE_SERVICE = "update_service";
    private static final String DEACTIVATE_SERVICE = "deactivate_service";

    private static final String ADD_TRAINING = "add_training";
    private static final String UPDATE_TRAINING = "update_training";
    private static final String DEACTIVATE_TRAINING = "deactivate_training";

    private static final String ADD_SKILL = "add_skill";
    private static final String UPDATE_SKILL = "update_skill";
    private static final String DEACTIVATE_SKILL = "deactivate_skill";

    private static final String ADD_STATE = "add_state";
    private static final String UPDATE_STATE = "update_state";
    private static final String DEACTIVATE_STATE = "deactivate_state";

    private static final String ADD_CITY = "add_city";
    private static final String UPDATE_CITY = "update_city";
    private static final String DEACTIVATE_CITY = "deactivate_city";

    private static final String BAN_BUSINESS = "ban_business";
    private static final String BAN_TECH_PROFESSIONAL = "ban_tech_professional";

    private static final String VIEW_ACTIVITY_LOG = "view_activity_log";





    @Override
    public void get(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void delete(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public void put(HttpServletRequest req, HttpServletResponse res) {

    }

    @Override
    public boolean validate(String method, HttpServletRequest req, HttpServletResponse res) {
        return false;
    }
}
