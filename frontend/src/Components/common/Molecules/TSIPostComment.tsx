import { Button, InputBase, Paper, Avatar, Snackbar } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import SendIcon from '@mui/icons-material/Send';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import LaunchIcon from '@mui/icons-material/Launch';
// interface TSIPostCommentProps {
//     comment?: any;
//     reply?: any;
//     type?: string;
//     discussionData?: any;
//     callAgain: () => void;
//     isLaunch?: boolean;
// }

const TSIPostComment = ({
    comment, reply, type, discussionData, callAgain, isLaunch = false
}: any) => {

    const [isReply, setIsReply] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [expandReplies, setExpandReplies] = useState(false)
    const [replyValue, setReplyvalue] = useState("")
    const [load, setLoad] = useState(false)
    const [commentRepliesData, setCommentRepliesData] = useState([])
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const style: any = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        background: '#F2F2F2',
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        border: "0px solid transparent"
    }
    const timeAgo = (timestamp: any) => {
        if (timestamp) {
            const givenDate = new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

            const givenIST = new Date(givenDate);
            const currentIST = new Date(currentDate);

            const diffInSeconds = Math.floor((currentIST.getTime() - givenIST.getTime()) / 1000);
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            const diffInHours = Math.floor(diffInMinutes / 60);
            const diffInDays = Math.floor(diffInHours / 24);

            if (diffInMinutes < 1) {
                return "Just now";
            } else if (diffInMinutes < 60) {
                return `${diffInMinutes} minutes ago`;
            } else if (diffInHours < 24) {
                return `${diffInHours} hours ago`;
            } else if (diffInDays === 1) {
                return "Yesterday";
            } else {
                return `${diffInDays} days ago`;
            }
        }
    };

    useEffect(() => {
        setLoad(true)
        const commentRepliesData = discussionData?.filter((comment1: any) => comment?.id === comment1?.parent_uuid)
        setCommentRepliesData(commentRepliesData || [])
        setLoad(false)
    }, [isReply])


    const replyDiscussion = () => {
        setLoad(true)
        const role = localStorage.getItem("role")
        const email: any = localStorage.getItem("email")
        const getDomainFromEmail = () => email.split("@")[1] || null;
        const body = {
            "_func": "add_discussion",
            "to_account_type": role,
            "to_account_slug": role == "BUSINESS" ? getDomainFromEmail() : email,
            "content_type": type,
            "content_id": comment.content_id,
            "parent_uuid": comment?.id,
            "discussion": replyValue
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response?.data?._added) {
                    callAgain()
                    setReplyvalue("")
                    setIsReply(!isReply)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Unable to post the comment. Please try again.",
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            })

    }

    const isHTML = (str: string): boolean => {
        const doc = new DOMParser().parseFromString(str, 'text/html');
        return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Check if the click was on an <a> tag
        const target = e.target as HTMLElement;
        if (target.closest('a')) {
            e.stopPropagation(); // Prevent triggering outer click
        }
    };

    if (!load) {
        return (
            <div
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", paddingLeft: '10px', gap: '5px', paddingBottom: '10px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, cursor: "pointer" }}>
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MuiAlert
                        sx={{
                            backgroundColor: snackbar.severity == "error" ? colors.red : colors.primary
                        }}
                        elevation={6}
                        variant="filled"
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity as AlertColor}
                    >
                        {snackbar.message}
                    </MuiAlert>
                </Snackbar>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: 'auto', padding: "5px" }}>
                            <Avatar sx={{
                                bgcolor: colors.lightywhite,
                                width: '32px',
                                height: '32px',
                                cursor: 'pointer',
                            }}>

                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "20px",
                                    fontWeight: 500,
                                    lineHeight: "28px",
                                    color: colors.black,
                                    textTransform: "capitalize",
                                }}>{comment?.posted_by?.charAt(0)}</span>
                            </Avatar>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '2px', width: '95%' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '100%' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px', width: '100%' }}>
                                    <span style={{
                                        margin: 0, padding: 0, fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        lineHeight: "19.07px",
                                        textAlign: 'left',
                                        textTransform: "capitalize"
                                    }}>{comment?.posted_by} </span>
                                    {"•"}
                                    <span style={{
                                        margin: 0, padding: 0, fontFamily: "OpenSans",
                                        fontSize: "12px",
                                        fontWeight: 400,
                                        lineHeight: "19.07px",
                                        textAlign: 'left',
                                    }}>{timeAgo(comment?.created || comment?.posted)} </span>
                                </div>
                                {(comment?.role && comment?.timeAgo) && (<p style={{
                                    margin: 0, padding: 0,
                                    fontFamily: "OpenSans",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    lineHeight: "16.34px",
                                    textAlign: "left",
                                }}>{comment?.role} • {comment?.created}</p>)}
                            </div>
                            <div
                                onClick={handleClick}
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "13px",
                                    fontWeight: 400,
                                    lineHeight: "19.6px",
                                    width: '100%'
                                }}>
                                <p
                                    style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "19.6px",
                                        textAlign: "left",
                                        margin: 0,
                                        padding: 0
                                    }}
                                    {...(comment?.discussion_note && isHTML(comment.discussion_note)
                                        ? { dangerouslySetInnerHTML: { __html: comment.discussion_note } }
                                        : {})}
                                >
                                    {!comment?.discussion_note || isHTML(comment.discussion_note)
                                        ? null
                                        : comment.discussion_note}
                                </p>
                            </div>

                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>


                        {(isLaunch) && (
                            <button
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "22.4px",
                                    textAlign: "left",
                                    backgroundColor: "transparent",
                                    border: "0px solid transparent",
                                    padding: "0px",
                                    cursor: "pointer"
                                }}
                            >
                                <LaunchIcon sx={{ width: '20px', height: "20px", color: colors.primary }} />
                            </button>
                        )}
                    </div>
                </div>

                {(isReply && reply) ? (
                    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-end", alignItems: "center", gap: "10px", }}>
                        <div style={{ display: 'flex', flexDirection: 'row', width: "5%", justifyContent: "center", alignItems: "center", gap: "10px", padding: '5px', }}>
                            <TurnLeftIcon sx={{ transform: "rotate(180deg)", color: colors.primary }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: "80%", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: '5px', backgroundColor: colors.lightPrimary, borderRadius: '12px' }}>

                            <span
                                style={{ borderRadius: "30px", display: 'flex', alignItems: 'center', width: '80%', border: "0px solid transparent", boxShadow: "none", backgroundColor: "transparent" }}
                            >
                                <input
                                    style={{ marginLeft: 1, flex: 1, color: '#3F4948', width: "100%", backgroundColor: "transparent", borderColor: "transparent", outline: "none" }}
                                    placeholder="Write a reply"
                                    value={replyValue}
                                    onKeyDown={(e) => { if (e.key == "Enter" && replyValue) replyDiscussion() }}
                                    onChange={(event) => setReplyvalue(event.target.value)}
                                />
                            </span>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "5px", width: '10%' }}>

                                <button
                                    onClick={() => { if (replyValue) { replyDiscussion() } }}
                                    style={{ ...style, backgroundColor: "transparent", cursor: "pointer" }}
                                >
                                    <SendIcon sx={{ color: colors.primary }} />
                                </button>
                            </div>
                        </div>
                        <div onClick={() => { setIsReply(!isReply) }} style={{ display: 'flex', flexDirection: 'row', width: "5%", justifyContent: "center", alignItems: "center", gap: "10px", padding: '5px', cursor: "pointer" }}>
                            <CancelIcon style={{ color: colors.primary }} />
                        </div>

                    </div>) : (
                    (reply) && (<div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '2px', paddingLeft: '50px' }}>

                        <button
                            onClick={() => { setIsReply(!isReply); setReplyvalue("") }}
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "22.4px",
                                textAlign: "left",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                padding: "0px",
                                cursor: "pointer"
                            }}
                        >
                            Reply
                        </button>
                        {(commentRepliesData?.length > 0) && ("•")}
                        {(commentRepliesData?.length > 0) && (<button
                            onClick={() => { setExpandReplies(!expandReplies) }}
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "22.4px",
                                textAlign: "left",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                padding: "0px",
                                cursor: "pointer"
                            }}
                        >
                            {expandReplies ? "Collapse Replies" : "Show Replies"}
                        </button>)}

                    </div>)
                )}
                {(expandReplies) && (<div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        justifyContent: "flex-start",
                        width: '100%',
                        paddingLeft: '6%',
                        paddingRight: '6%',
                    }}
                >
                    {
                        commentRepliesData
                            ?.filter((comment1: any) => comment?.id === comment1?.parent_uuid)
                            .map((comment1: any, index1: number) => (
                                <TSIPostComment key={index1} comment={comment1} reply={false}
                                    type={""} discussionData={[]} callAgain={() => { }} isLaunch={false}
                                />
                            ))
                    }
                </div>)}
            </div >
        )
    } else {
        <div className="centered-container">
            <div className="loader"></div>
        </div>
    }
}

export default TSIPostComment