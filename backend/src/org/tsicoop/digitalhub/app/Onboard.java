package org.tsicoop.digitalhub.app;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.tsicoop.digitalhub.common.Masters;
import org.tsicoop.digitalhub.framework.InputProcessor;
import org.tsicoop.digitalhub.framework.OutputProcessor;
import org.tsicoop.digitalhub.framework.REST;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class Onboard implements REST {

    private static final String FUNCTION = "_func";


    private static final String GET_INDUSTRY_VERTICALS = "get_industry_verticals";
    private static final String GET_INDUSTRY_SUBTYPES = "get_industry_subtypes";

    private static final String GET_STATE_LIST = "get_state_list";

    private static final String GET_STATE_CITIES = "get_state_cities";

    private static final String GET_DROPDOWN_VALUES = "get_dropdown_values";

    private static final String GET_ALL_INDUSTRY_SOLUTIONS_TREE = "get_all_industry_solutions_tree";
    private static final String GET_INDUSTRY_SOLUTIONS_TREE = "get_industry_solutions_tree";

    private static final String GET_GENERAL_IT_SOLUTIONS_TREE = "get_general_it_solutions_tree";
    private static final String GET_SERVICES_TREE = "get_services_tree";
    private static final String GET_TRAININGS_TREE = "get_trainings_tree";
    private static final String GET_SKILLS_TREE = "get_skills_tree";

    private static final String ADD_BUSINESS = "add_business";
    private static final String ADD_PROFESSIONAL = "add_professional";

    private static final String ADD_AMBASSADOR = "add_ambassador";

    private static final String ADD_SOLUTION = "add_solution";
    private static final String GET_PROVIDER_SOLUTIONS = "get_provider_solutions";

    private static final String ADD_SERVICE = "add_service";
    private static final String GET_PROVIDER_SERVICES = "get_provider_services";

    private static final String ADD_TRAINING = "add_training";
    private static final String GET_PROVIDER_TRAININGS = "get_provider_trainings";


    @Override
    public void get(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

    }

    @Override
    public void post(HttpServletRequest req, HttpServletResponse res) {
        JSONObject input = null;
        JSONObject output = null;
        JSONArray outputArray = null;
        String func = null;

        try {
            input = InputProcessor.getInput(req);
            func = (String) input.get(FUNCTION);
            if(func != null){
                if(func.equalsIgnoreCase(GET_INDUSTRY_VERTICALS)){
                    outputArray = new Masters().getIndustryVerticals();
                }else if(func.equalsIgnoreCase(GET_INDUSTRY_SUBTYPES)){
                    String industrySlug = (String) input.get("industry_slug");
                    outputArray = new Masters().getIndustrySubTypes(industrySlug);
                }else if(func.equalsIgnoreCase(GET_STATE_LIST)){
                    outputArray = new Masters().getStateList();
                }else if(func.equalsIgnoreCase(GET_DROPDOWN_VALUES)){
                    String lookup = (String) input.get("lookup");
                    outputArray = new Masters().getDropdownValues(lookup);
                }else if(func.equalsIgnoreCase(GET_STATE_CITIES)){
                    String stateSlug = (String) input.get("state_slug");
                    outputArray = new Masters().getStateCities(stateSlug);
                }else if(func.equalsIgnoreCase(GET_ALL_INDUSTRY_SOLUTIONS_TREE)){
                    outputArray = new Masters().getAllIndustrySolutionsTree();
                }else if(func.equalsIgnoreCase(GET_INDUSTRY_SOLUTIONS_TREE)){
                    String industrySlug = (String) input.get("industry_slug");
                    output = new Masters().getIndustrySolutionsTree(industrySlug);
                }else if(func.equalsIgnoreCase(GET_GENERAL_IT_SOLUTIONS_TREE)){
                    outputArray = new Masters().getGeneralITSolutionsTree();
                }else if(func.equalsIgnoreCase(GET_SERVICES_TREE)){
                    outputArray = new Masters().getServicesTree();
                }else if(func.equalsIgnoreCase(GET_TRAININGS_TREE)){
                    outputArray = new Masters().getTrainingsTree();
                }else if(func.equalsIgnoreCase(GET_SKILLS_TREE)){
                    outputArray = new Masters().getSkillsTree();
                }else if(func.equalsIgnoreCase(ADD_BUSINESS)){
                        String email = InputProcessor.getEmail(req);
                        String accountSlug = new Org().getAccountSlug(email);
                        boolean exists = new Org().accountExists(email);
                        output = new JSONObject();
                        if(exists){
                            output.put("_created", false);
                            output.put("error", accountSlug+" already exists");
                        }else {
                            boolean created = new Org().addBusiness(email, input);
                             if (created) {
                                output.put("_created", true);
                            } else {
                                output.put("_created", false);
                            }
                        }
                }else if(func.equalsIgnoreCase(ADD_PROFESSIONAL)){
                    String email = InputProcessor.getEmail(req);
                    boolean created = new Talent().addProfessional(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(ADD_AMBASSADOR)){
                    String email = InputProcessor.getEmail(req);
                    boolean created = new Ambassador().addAmbassador(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(ADD_SOLUTION)){
                    String email = InputProcessor.getEmail(req);
                    boolean created = new Solution().addSolution(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_SOLUTIONS)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = new Solution().getProviderSolutions(email);
                }else if(func.equalsIgnoreCase(ADD_SERVICE)){
                    String email = InputProcessor.getEmail(req);
                    boolean created = new Service().addService(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_SERVICES)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = new Service().getProviderServices(email);
                }else if(func.equalsIgnoreCase(ADD_TRAINING)){
                    String email = InputProcessor.getEmail(req);
                    boolean created = new Training().addTraining(email, input);
                    output = new JSONObject();
                    if(created){
                        output.put("_created",true);
                    }else{
                        output.put("_created",false);
                    }
                }else if(func.equalsIgnoreCase(GET_PROVIDER_TRAININGS)){
                    String email = InputProcessor.getEmail(req);
                    outputArray = new Training().getProviderTrainings(email);
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
    public void delete(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

    }

    @Override
    public void put(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {

    }

    @Override
    public boolean validate(String s, HttpServletRequest req, HttpServletResponse res) {
        return InputProcessor.validate( req,
                res);
    }
}
