import { useNavigate } from "react-router-dom";

export const handlePostNavigation = (
  post: any,
  navigation: (path: string) => void
) => {
  if (!post || !post.content_type) return;
  const { content_type, posted_by_account_slug, content_uuid } = post;

  switch (content_type) {
    case "NEW_ORG":
      navigation(`/community/postdetails?id=${posted_by_account_slug}`);
      break;
    case "NEW_PROFESSIONAL":
      navigation(`/talent/postdetails?id=${posted_by_account_slug}`);
      break;
    case "NEW_AMBASSADOR":
      navigation(`/ambassador/postdetails?id=${posted_by_account_slug}`);
      break;
    case "TESTIMONIAL":
      navigation(`/testimonial/postdetails?id=${content_uuid}`);
      break;
    case "RFP":
      navigation(`/rfps/postdetails?id=${content_uuid}`);
      break;
    case "ENQUIRY":
      navigation(`/enquiries/postdetails?id=${content_uuid}`);
      break;
    case "SOLUTION":
      navigation(`/solutions/details?id=${content_uuid}`);
      break;
    case "SERVICE":
      navigation(`/services/details?id=${content_uuid}`);
      break;
    case "TRAINING":
      navigation(`/training/details?id=${content_uuid}`);
      break;
    case "POST":
      navigation(`/posts/postdetails?id=${content_uuid}`);
      break;
    case "JOB_APPLICATION":
      navigation(`/jobs/applicationdetails?id=${content_uuid}`);
      break;
    case "JOB":
      navigation(`/jobs/details?id=${content_uuid}`);
      break;
    case "MEETUP":
      navigation(`/meetup/detail?id=${content_uuid}`);
      break;
    default:
      console.warn("Unknown content type:", content_type);
  }
};

export const handleNotificationNavigation = (
  post: any,
  navigation: (path: string) => void
) => {
  if (!post || !post.content_type) return;
  const { content_type, posted_by_account_slug, content_uuid, id } = post;

  switch (content_type) {
    case "NEW_ORG":
      navigation(`/community/postdetails?id=${posted_by_account_slug}&&notifid=${id}`);
      break;
    case "NEW_PROFESSIONAL":
      navigation(`/talent/postdetails?id=${posted_by_account_slug}&&notifid=${id}`);
      break;
    case "NEW_AMBASSADOR":
      navigation(`/ambassador/postdetails?id=${posted_by_account_slug}&&notifid=${id}`);
      break;
    case "TESTIMONIAL":
      navigation(`/testimonial/postdetails?id=${content_uuid}&&notifid=${id}`);
      break;
    case "RFP":
      navigation(`/rfps/postdetails?id=${content_uuid}&&notifid=${id}`);
      break;
    case "ENQUIRY":
      navigation(`/enquiries/postdetails?id=${content_uuid}&&notifid=${id}`);
      break;
    case "SOLUTION":
      navigation(`/solutions/details?id=${content_uuid}&&notifid=${id}`);
      break;
    case "SERVICE":
      navigation(`/services/details?id=${content_uuid}&&notifid=${id}`);
      break;
    case "TRAINING":
      navigation(`/training/details?id=${content_uuid}&&notifid=${id}`);
      break;
    case "POST":
      navigation(`/posts/postdetails?id=${content_uuid}&&notifid=${id}`);
      break;
    case "JOB_APPLICATION":
      navigation(`/jobs/applicationdetails?id=${content_uuid}&&notifid=${id}`);
      break;
    case "JOB":
      navigation(`/jobs/details?id=${content_uuid}&&notifid=${id}`);
      break;
    case "MEETUP":
      navigation(`/meetup/detail?id=${content_uuid}&&notifid=${id}`);
      break;
    case "SUPPORT":
      navigation(`/support/details?id=${content_uuid}&&notifid=${id}`);
      break;
    default:
      console.warn("Unknown content type:", content_type);
  }
};

