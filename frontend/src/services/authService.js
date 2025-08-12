import axios from 'axios';

// Create an Axios instance
//const baseURL = "https://sandbox.tsicoop.org"
const baseURL = process.env.REACT_APP_TSI_API_BASE_URL;
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_TSI_API_BASE_URL,
});


const token = localStorage.getItem("token");

const header = {
    headers: {
        Authorization: `Bearer ${token}`
    }
};

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);



class Apis {

    sendOTP(body) {
        return axiosInstance.post(baseURL + `/api/app/send-otp`, body)
    }

    login(body) {
        return axiosInstance.post(baseURL + `/api/app/login`, body);
    }

    doRegister(body) {
        return axiosInstance.post(baseURL + `/api/app/register`, body);
    }

    doRegisterSendOTP(body) {
        return axiosInstance.post(baseURL + `/api/app/register/send-otp`, body);
    }

    validateMemberOTP(body) {
        return axiosInstance.post(baseURL + `/api/app/register/validate-otp`, body);
    }

    getCommunityApi(body) {
        return axiosInstance.post(baseURL + `/api/app/community`, body);
    }

    getMeetupApi(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/meetup?notif=${notifid}`, body);
    }



    getDiscussion(body) {
        return axiosInstance.post(baseURL + `/api/app/discussion`, body);
    }

    getGetOptions(body) {
        return axiosInstance.post(baseURL + `/api/app/onboard`, body);
    }

    addOnboarding(body) {
        return axiosInstance.post(baseURL + `/api/app/onboard`, body);
    }

    addPost(body) {
        return axiosInstance.post(baseURL + `/api/app/post`, body);
    }
    getPosts(body) {
        return axiosInstance.post(baseURL + `/api/app/post`, body);
    }
    viewPosts(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/post?notif=${notifid}`, body);
    }
    getsearchPost(body) {
        return axiosInstance.post(baseURL + `/api/app/post`, body);
    }


    //Solutions
    getSolutions(body) {
        return axiosInstance.post(baseURL + `/api/app/solution`, body);
    }
    addSolutions(body) {
        return axiosInstance.post(baseURL + `/api/app/solution`, body);
    }
    viewSolutions(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/solution?notif=${notifid}`, body);
    }
    getsearchSolutions(body) {
        return axiosInstance.post(baseURL + `/api/app/solution`, body);
    }

    //Services
    getServices(body) {
        return axiosInstance.post(baseURL + `/api/app/service`, body);
    }
    addServices(body) {
        return axiosInstance.post(baseURL + `/api/app/service`, body);
    }
    viewServices(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/service?notif=${notifid}`, body);
    }
    getsearchServices(body) {
        return axiosInstance.post(baseURL + `/api/app/service`, body);
    }


    //Talent
    getTalent(body) {
        return axiosInstance.post(baseURL + `/api/app/talent`, body);
    }
    addTalent(body) {
        return axiosInstance.post(baseURL + `/api/app/talent`, body);
    }
    getsearchTalent(body) {
        return axiosInstance.post(baseURL + `/api/app/talent`, body);
    }

    //Ambassador
    getAmbassador(body) {
        return axiosInstance.post(baseURL + `/api/app/ambassador`, body);
    }

    //Training
    getTraining(body) {
        return axiosInstance.post(baseURL + `/api/app/training`, body);
    }
    addTraining(body) {
        return axiosInstance.post(baseURL + `/api/app/training`, body);
    }
    viewTraining(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/training?notif=${notifid}`, body);
    }
    getsearchTraining(body) {
        return axiosInstance.post(baseURL + `/api/app/training`, body);
    }

    //Enquires
    getEnquires(body) {
        return axiosInstance.post(baseURL + `/api/app/enquiry`, body);
    }
    addEnquires(body) {
        return axiosInstance.post(baseURL + `/api/app/enquiry`, body);
    }
    viewEnquires(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/enquiry?notif=${notifid}`, body);
    }

    //Jobs
    getJobs(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    addJobs(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    getBusinessJobs(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    getRecommendedJobs(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    getReceivedJobs(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    viewJobDetail(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/job?notif=${notifid}`, body);
    }
    editJob(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    addJobApplication(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    getBusinessJobApplications(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    invitefordiscussion(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    rejectApplication(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }

    //RFPs
    getRFPs(body) {
        return axiosInstance.post(baseURL + `/api/app/rfp`, body);
    }
    viewRFPs(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/rfp?notif=${notifid}`, body);
    }
    addRFPs(body) {
        return axiosInstance.post(baseURL + `/api/app/rfp`, body);
    }

    //ORGANISATION
    viewORG(body) {
        return axiosInstance.post(baseURL + `/api/app/org`, body);
    }
    getRecomOrgSkills(body) {
        return axiosInstance.post(baseURL + `/api/app/org`, body);
    }
    getsearchorg(body) {
        return axiosInstance.post(baseURL + `/api/app/org`, body);
    }


    //JOB
    getJOBS(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    rejectJOBS(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    getRecommandedJOBS(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    addJOBS(body) {
        return axiosInstance.post(baseURL + `/api/app/job`, body);
    }
    viewJOBS(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/job?notif=${notifid}`, body);
    }



    //TESTIMONIAL
    getSentTestimonials(body) {
        return axiosInstance.post(baseURL + `/api/app/testimonial`, body);
    }
    getReceivedTestimonials(body) {
        return axiosInstance.post(baseURL + `/api/app/testimonial`, body);
    }
    addTestimonial(body) {
        return axiosInstance.post(baseURL + `/api/app/testimonial`, body);
    }
    viewTestimonial(body, notifid) {
        return axiosInstance.post(baseURL + `/api/app/testimonial?notif=${notifid}`, body);
    }


    //UPLOAD DOC
    uploadDocument(body) {
        return axiosInstance.post(baseURL + `/api/app/document`, body);
    }
    downloadDocument(body) {
        return axiosInstance.post(baseURL + `/api/app/document`, body);
    }

    //SETTINGS
    getUserData(body) {
        return axiosInstance.post(baseURL + `/api/app/setting`, body);
    }
    addUserData(body) {
        return axiosInstance.post(baseURL + `/api/app/setting`, body);
    }
    deleteAccount(body) {
        return axiosInstance.post(baseURL + `/api/app/setting`, body);
    }


    //LOOKUP Api
    getLookUp(body) {
        return axiosInstance.post(baseURL + `/api/app/lookup`, body);
    }

    //MODERATE
    postFlag(body) {
        return axiosInstance.post(baseURL + `/api/admin/moderate`, body);
    }

    //REVIEW
    getPendingReview(body) {
        return axiosInstance.post(baseURL + `/api/admin/review`, body);
    }
    getReviewContent(body) {
        return axiosInstance.post(baseURL + `/api/admin/review`, body);
    }

    //ACCOUNT
    getSubscriptionDetails(body) {
        return axiosInstance.post(baseURL + `/api/admin/account`, body);
    }
    getKYC(body) {
        return axiosInstance.post(baseURL + `/api/admin/account`, body);
    }
    postAccount(body) {
        return axiosInstance.post(baseURL + `/api/admin/account`, body);
    }

    addOnboardingAccount(body) {
        return axiosInstance.post(baseURL + `/api/admin/account`, body);
    }

    //NOTIFICATION
    getNotificationApi(body) {
        return axiosInstance.post(baseURL + `/api/app/notification`, body);
    }


    // Assessment Questionnaire
    getAssessmentQuestionnaire(body) {
        return axiosInstance.post(baseURL + `/api/app/rating`, body);
    }


     //Support
    getSupports(body,notifid) {
        return axiosInstance.post(baseURL + `/api/app/support?notif=${notifid}`, body);
    }
    addSupport(body) {
        return axiosInstance.post(baseURL + `/api/app/support`, body);
    }
    viewSupport(body) {
        return axiosInstance.post(baseURL + `/api/app/support`, body);
    }

}

const apiInstance = new Apis();
export default apiInstance;
