import React, { useState } from 'react'
import colors from '../../../assets/styles/colors';
import { Avatar, Button } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
const TSIApplicationRec = ({ post, onHandleClick }: any) => {
    const [isHover, setIsHover] = useState(false)
    function timeAgo(timestamp: any) {
        const now: any = new Date();
        const past: any = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} days ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} months ago`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} years ago`;
    }
    const navigation = useNavigate()

    return (
        <div
            onClick={() => { navigation(`/jobs/details?id=${post?.id}`) }}
            onMouseEnter={() => { setIsHover(true) }}
            onMouseLeave={() => { setIsHover(false) }}
            style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`, padding: '10px', gap: '5px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, borderRadius: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <Avatar
                        onClick={(event: any) => {
                            event.stopPropagation();
                            if (post?.from_account_type == "PROFESSIONAL") {
                                navigation(`/talent/postdetails?id=${post?.from_account_slug}`)
                            } else {
                                navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`)
                            }

                        }}
                        sx={{
                            bgcolor: colors.lightywhite,
                            width: '44px',
                            height: '44px',
                            cursor: 'pointer',
                            fontFamily: 'OpenSans'
                        }}>

                        <span style={{
                            fontFamily: "OpenSans",
                            fontSize: "16px",
                            fontWeight: 500,
                            lineHeight: "28px",
                            color: colors.black,
                            textTransform: "capitalize"
                        }}>{post?.from_account_slug?.charAt(0)}</span>
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px' }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            fontFamily: "OpenSans",
                            textTransform: "capitalize"
                        }}>  {post?.applicant_name}

                        </p>
                        <p style={{
                            margin: 0, padding: 0,
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            fontFamily: "OpenSans",
                            textTransform: "capitalize"
                        }}>  {post?.job_title}

                        </p>

                        <p style={{
                            margin: 0, padding: 0,
                            color: colors.lightgrey,
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "19px",
                            textAlign: 'left',
                            fontFamily: "OpenSans"
                        }}> {post?.job_type}</p>

                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
                    <span style={{
                        color: colors.lightgrey,
                        fontSize: "14px",
                        fontWeight: 400,
                    }}>{timeAgo(post?.created) || "NA"}  </span>
                    {(post?.status) && (
                        <div
                            style={{
                                color: post?.status == "3" ? colors.red : colors.primary,
                                padding: "5px 20px",
                                backgroundColor: post?.status == "3" ? colors.lightsaturatedRed : colors.lightPrimary,
                                borderRadius: '100px',
                                fontSize: "12px"
                            }}
                        >
                            {post?.status == "1" ? "APPLIED" : post?.status == "2" ? "INVITED FOR DISCUSSION" : post?.status == "3" ?"REJECTED"  : ''}
                        </div>
                    )}
                    <Button
                        id="basic-button"
                        sx={{
                            padding: 0, margin: 0, fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            letterSpacing: "0.10000000149011612px",
                            textAlign: "center",
                            textTransform: "capitalize",
                            backgroundColor: "transparent",
                            border: "0px solid transparent"
                        }}
                        onClick={(event) => { event.stopPropagation(); navigation(`/jobs/details?id=${post?.id}`) }}
                    >
                        <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                    </Button>

                </div>
            </div>
        </div >
    )
}

export default TSIApplicationRec
