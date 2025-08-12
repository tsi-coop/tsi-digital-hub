package org.tsicoop.digitalhub.common;

public class Constants {

    // Account Type definition
    public static String BUSINESS_ACCOUNT_TYPE = "BUSINESS";
    public static String PROFESSIONAL_ACCOUNT_TYPE = "PROFESSIONAL";
    public static String ADMIN_ACCOUNT_TYPE = "ADMIN";
    public static String ADMIN_ACCOUNT_SLUG = "tsicoop.org";
    public static String AMBASSADOR_ACCOUNT_TYPE = "AMBASSADOR";

    // Role definition
    public static String BUSINESS_ADMIN_ROLE = "BUSINESS_ADMIN";
    public static String BUSINESS_USER_ROLE = "BUSINESS_USER";
    public static String TECH_PROFESSIONAL_ROLE = "TECH_PROFESSIONAL";
    public static String AMBASSADOR_ROLE = "AMBASSADOR";

    // Job Status
    public static int APPLIED_JOB_STATUS = 1;
    public static int DISCUSSION_JOB_STATUS = 2;
    public static int REJECTED_JOB_STATUS = 3;
    public static int OFFERED_JOB_STATUS = 4;
    public static int ACCEPTED_JOB_STATUS = 5;

    // User Status
    public static int ACTIVE_USER = 1;
    public static int INACTIVE_USER = 0;

    // User Type
    public static String BUSINESS_ADMIN_USER_TYPE = "BUSINESS_ADMIN";
    public static String BUSINESS_USER_USER_TYPE = "BUSINESS_USER";

    // Error constants
    public static String USER_EMAIL_ALREADY_EXISTS_ERROR = "USER_EMAIL_ALREADY_EXISTS";

    // Status definition
    public static int APPROVED_STATUS = 0;
    public static int REJECTED_STATUS = -1;
    public static int CANCELLED_STATUS = -2;

    public static int HIDDEN_STATUS = -3;


    // Content Type definition
    public static String TESTIMONIAL_CONTENT_TYPE = "TESTIMONIAL";
    public static String RFP_CONTENT_TYPE = "RFP";
    public static String SOLUTION_CONTENT_TYPE = "SOLUTION";
    public static String SERVICE_CONTENT_TYPE = "SERVICE";
    public static String TRAINING_CONTENT_TYPE = "TRAINING";
    public static String POST_CONTENT_TYPE = "POST";
    public static String ENQUIRY_CONTENT_TYPE = "ENQUIRY";
    public static String JOB_CONTENT_TYPE = "JOB";
    public static String JOB_APPLICATION_CONTENT_TYPE = "JOB_APPLICATION";

    public static String MEETUP_CONTENT_TYPE = "MEETUP";

    public static String NEW_ORG_CONTENT_TYPE = "NEW_ORG";

    public static String SUPPORT_REQUEST_CONTENT_TYPE = "SUPPORT";

    public static String NEW_PROFESSIONAL_CONTENT_TYPE = "NEW_PROFESSIONAL";

    public static String NEW_AMBASSADOR_CONTENT_TYPE = "NEW_AMBASSADOR";

    public static String DISCUSSION_CONTENT_TYPE = "DISCUSSION";

    // Privacu for sensitive interactions
    public static String ANONYMOUS_PERSONA = "Anonymous";

    // Community Section
    public static String ANNOUNCEMENTS_COMMUNITY_SECTION = "announcements";
    public static String POSTS_COMMUNITY_SECTION = "posts";
    public static String MEETUPS_COMMUNITY_SECTION = "meetups";
    public static String ENQUIRY_COMMUNITY_SECTION = "enquiries";
    public static String RFPS_COMMUNITY_SECTION = "rfps";
    public static String JOBS_COMMUNITY_SECTION = "jobs";
    public static String TESTIMONIAL_COMMUNITY_SECTION = "testimonials";

    // Notification
    public static int READ = 1;
    public static int UNREAD = 0;
    public static String NOTIF_PARAM = "notif";
    public static String ENQUIRY_NOTIFICATION = "enquiry_notif";
    public static String RFP_NOTIFICATION = "rfp_notif";
    public static String TESTIMONIAL_NOTIFICATION = "testimonial_notif";
    public static String COMMENT_NOTIFICATION = "comment_notif";

    public static String SUPPORT_REQUEST_NOTIFICATION = "supp_req_notif";

    public static String JOB_APPLICATION_NOTIFICATION = "jobapp_notif";

    // Pagination
    public static int RECORDS_PER_PAGE = 5;

    // Display Constants
    public static String DISPLAY_ORGANISATION = "Organisation";
    public static String DISPLAY_ENQUIRY = "Enquiry";

    public static String DISPLAY_PROFESSIONAL = "Professional";

    public static String DISPLAY_AMBASSADOR = "Ambassador";
    public static String DISPLAY_JOB = "Job";

    public static String DISPLAY_JOB_APPLICATION = "JobApplication";

    public static String DISPLAY_MEETUP = "Meetup";

    public static String DISPLAY_POST = "Post";

    public static String DISPLAY_RFP = "RFP";
    public static String DISPLAY_SERVICE = "Service";
    public static String DISPLAY_SOLUTION = "Solution";

    public static String DISPLAY_TESTIMONIAL = "Testimonial";

    public static String DISPLAY_SUPPORT_REQUEST = "Support Request";
    public static String DISPLAY_TRAINING = "Training";
    public static String DISPLAY_COMMENT = "Comment";

    public static int DONATION_PAID_STATUS = 1;
    public static int DONATION_CANCELLED_STATUS = 2;

    public static int FREE_PLAN = 0;
    public static int PAID_PLAN = 1;

    public static int JOB_STATUS_APPLIED = 1;
    public static int JOB_STATUS_REJECTED = 2;
    public static int JOB_STATUS_INVITED_FOR_DISCUSSION = 3;

    public static String PRODUCTION_ENVT = "production";
    public static String SANDBOX_ENVT = "sandbox";
    public static String LOCAL_ENVT = "local";

    public static int SUPPORT_STATUS_OPEN = 1;
    public static int SUPPORT_STATUS_CLOSED = 2;
    public static int SUPPORT_STATUS_CANCELLED = 3;

    public static String DIGITAL_MATURITY_ASSESSMENT = "digital-maturity";
    public static String CAPABILITY_MATURITY_ASSESSMENT = "capability-maturity";
    public static String VERSION_1 = "v1";
    public static String VERSION_2 = "v2";

}
