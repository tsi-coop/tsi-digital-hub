package org.tsicoop.digitalhub.common;

import org.tsicoop.digitalhub.app.Ambassador;
import org.tsicoop.digitalhub.app.Org;
import org.tsicoop.digitalhub.app.Talent;
import org.tsicoop.digitalhub.framework.JSONUtil;

import java.util.HashMap;

public class User {

    public static HashMap getUserDetails(String accountType, String accountSlug) {
        HashMap userDetails = null;
        if (accountType.equalsIgnoreCase(Constants.BUSINESS_ACCOUNT_TYPE)) {
            userDetails = new Org().getOrgDetails(accountSlug);
        } else if (accountType.equalsIgnoreCase(Constants.PROFESSIONAL_ACCOUNT_TYPE)) {
            userDetails = new Talent().getTalentDetails(accountSlug);
        } else if (accountType.equalsIgnoreCase(Constants.AMBASSADOR_ACCOUNT_TYPE)) {
            userDetails = new Ambassador().getAmbassadorDetails(accountSlug);
        } else if (accountType.equalsIgnoreCase(Constants.ADMIN_ACCOUNT_TYPE)){
            userDetails = new HashMap();
            userDetails.put("name",Constants.ADMIN_ACCOUNT_TYPE);
            userDetails.put("solutions_interested", JSONUtil.toJSONArray(Masters.getSolutionList()));
            userDetails.put("services_interested",JSONUtil.toJSONArray(Masters.getServiceList()));
            userDetails.put("trainings_interested",JSONUtil.toJSONArray(Masters.getTrainingList()));
            userDetails.put("skills_interested",JSONUtil.toJSONArray(Masters.getSkillList()));
            userDetails.put("txy_interested",JSONUtil.toJSONArray(Masters.getTaxonomiesList()));
        }
        return userDetails;
    }

    public static boolean isContentOwner(String accountType, String accountSlug, String fromAccountType, String fromAccountSlug) {
        boolean isContentOwner = false;

        if(accountType.equalsIgnoreCase(fromAccountType) &&
                accountSlug.equalsIgnoreCase(fromAccountSlug)){
            isContentOwner = true;
        }
        return isContentOwner;
    }
}

