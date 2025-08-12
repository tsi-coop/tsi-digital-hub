import { useNavigate } from "react-router-dom";

export const handleProfileNavigation = (
    post: any,
    navigation: (path: string) => void
) => {
    if (!post || !post.content_type) return;
    const { content_type, posted_by_account_slug } = post;

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
        default:
            navigation(`/community/postdetails?id=${posted_by_account_slug}`);
           
    }
};
