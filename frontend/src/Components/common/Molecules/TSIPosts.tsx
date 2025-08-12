import { Avatar, Button, CircularProgress, InputBase, Menu, MenuItem, Paper, Popover, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { image, imageadd, Voice } from '../../../assets';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import PostFeature from '../Atoms/PostFeature';
import colors from '../../../assets/styles/colors';
import CancelIcon from '@mui/icons-material/Cancel';
import apiInstance from '../../../services/authService';
import TSIPostComment from './TSIPostComment';
import SendIcon from '@mui/icons-material/Send';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { handleProfileNavigation } from '../../../Utils/ProfileRouting';
import LaunchIcon from '@mui/icons-material/Launch';
const TSIPosts = ({ post, iscommunity, isFullText = false, setClickedPost, setPostView, setIsEditPost, onSubmit, isCommentNeeded, isProfile = false }: any) => {

    const [isHover, setIsHover] = useState(false)
    const [isComment, setIsComment] = useState(false)

    const fullText: any = (post?.content_brief || post?.summary) ? (post?.content_brief || post?.summary) : post?.content || post?.summary
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [discussionData, setDiscussionData] = useState([])
    const [commentValue, setCommentValue] = useState("")
    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [load, setLoad] = useState(false)

    const style: any = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        background: colors.lightywhite,
        width: '32px',
        height: '32px',
        cursor: 'pointer',
        border: "0px solid transparent"
    }

    const getDiscussionData = () => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "POST",
            "content_id": post.id
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response.data) {
                    setDiscussionData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const postDiscussion = () => {
        setLoad(true)
        const role = localStorage.getItem("role")
        const email: any = localStorage.getItem("email")
        const getDomainFromEmail = () => email.split("@")[1] || null;
        const body = {
            "_func": "add_discussion",
            "to_account_type": role,
            "to_account_slug": role == "BUSINESS" ? getDomainFromEmail() : email,
            "content_type": "POST",
            "content_id": post.id,
            "parent_uuid": "",
            "discussion": commentValue
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response?.data?._added) {
                    getDiscussionData()
                    setCommentValue("")
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
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Unable to post the comment. Please try again.",
                })
            });
    }




    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", borderBottom: isComment ? `0px solid ${colors.snowywhite}` : "", gap: '10px', }}>
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
            <div
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`, boxShadow: `20px 20px 50px ${colors.lightmediumSnowyWhite}`, gap: '10px', padding: '10px', borderRadius: '0px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white }}>
                {(!isProfile) && (<div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                    <div
                        //  onMouseEnter={handleMouseEnter}
                        //  onMouseLeave={handleMouseLeave}
                        // onClick={() => { setClickedPost(post); setPostView(true) }}
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Avatar
                            onClick={(event) => {
                                event.stopPropagation();
                                navigation(`/community/postdetails?id=${post?.posted_by_account_slug || ''}`);
                                // handleProfileNavigation(navigation, post?.posted_by_account_slug)
                            }}
                            sx={{
                                bgcolor: colors.lightywhite,
                                width: '44px',
                                height: '44px',
                                cursor: 'pointer',
                            }}>

                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 500,
                                lineHeight: "28px",
                                textTransform: "capitalize",
                                color: colors.black
                            }}>{post?.posted_by?.charAt(0)}</span>
                        </Avatar>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                            <p style={{
                                margin: 0, padding: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "19.07px",
                                textAlign: 'left',
                                textTransform: 'capitalize'
                            }}>{post?.posted_by}</p>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "16.34px",
                                textAlign: "left",
                            }}>
                                {post?.time_ago}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
                        {(!isProfile) && (<Button
                            sx={{
                                padding: 0, margin: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "20px",
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "center",
                                textTransform: "capitalize",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                color: colors.primary,
                                cursor: "pointer"
                            }}>
                            <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                        </Button>)}
                        {(!iscommunity) && (<button
                            onClick={(event) => {
                                event.stopPropagation();
                                setClickedPost(post); setIsEditPost(true)
                            }}
                            style={{
                                padding: 0, margin: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "20px",
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "center",
                                textTransform: "capitalize",
                                backgroundColor: "transparent",
                                border: "0px solid transparent"
                            }}>
                            <EditNoteIcon sx={{ width: '25px', height: "25px" }} />
                        </button>)}

                    </div>
                </div>)}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", gap: "20px", width: '100%' }}>
                    {(post.title) && (<span style={{
                        margin: 0, padding: 0,
                        fontSize: "14px",
                        fontWeight: isProfile ? "500" : 600,
                        lineHeight: "19.07px",
                        textAlign: 'left',
                        fontFamily: "OpenSans",
                        textTransform: "capitalize",
                        color: colors.black
                    }}>{post?.title} </span>)}
                    <span style={{
                        color: colors.lightgrey,
                        fontSize: "14px",
                        fontWeight: 400,
                    }}>{(isProfile) && (post?.time_ago)}</span>
                </div>
                {(post?.content || post?.content_brief || post?.summary) && (<div
                    style={{
                        fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "19.6px",
                        textAlign: 'left',
                    }}>

                    <div style={{
                        color: colors.lightgrey,
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "19.6px",
                        textAlign: 'left',
                        padding: 0,
                        margin: 0,
                        fontFamily: "OpenSans",
                        ...(isFullText && {
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        })
                    }} dangerouslySetInnerHTML={{ __html: fullText }} />


                </div>)}

                {(post?.image) && (<div onClick={() => { }} style={{ padding: '10px' }}>
                    <img src={post?.image} style={{ maxWidth: "70%", minWidth: '400px', borderRadius: '12px', objectFit: 'contain' }} />
                </div>)}
            </div>

            {(isCommentNeeded) && (<div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", padding: '10px', paddingTop: "2px", }}>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "flex-start",
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >

                    {(
                        isComment) && (<div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", gap: '10px' }}>
                            {(discussionData?.length > 0 && isComment && !load) ? (<div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: "flex-start",
                                    width: '100%',
                                }}
                            >
                                {
                                    discussionData?.map((comment: any, index: number) => {
                                        if (comment?.parent_uuid == "") {
                                            return (
                                                <>
                                                    <TSIPostComment key={index} comment={comment} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData() }} />
                                                </>
                                            )
                                        }
                                        return null;
                                    })
                                }


                            </div>) : (
                                (load) && (<div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center", alignItems: "flex-start", }}>
                                    <div className="loader"></div>
                                </div>)
                            )}

                        </div>)}
                    {(isComment) && (
                        <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", gap: "10px", backgroundColor: colors.lightPrimary, borderRadius: '12px', paddingLeft: '10px', paddingRight: '10px', height: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "5px", }}>

                                <Avatar sx={{
                                    bgcolor: colors.lightywhite,
                                    width: '32px',
                                    height: '32px',
                                    cursor: 'pointer',
                                    margin: "5px"
                                }}>

                                    <span style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "20px",
                                        fontWeight: 500,
                                        lineHeight: "28px",
                                        color: colors.black,
                                        textTransform: 'capitalize'
                                    }}>{currentUser?.charAt(0)}</span>
                                </Avatar>
                            </div>

                            <span
                                style={{ borderRadius: "30px", display: 'flex', alignItems: 'center', width: '80%', border: "0px solid transparent", boxShadow: "none", backgroundColor: "transparent" }}
                            >
                                <input
                                    style={{ marginLeft: 1, flex: 1, color: '#3F4948', width: "100%", backgroundColor: "transparent", borderColor: "transparent", outline: "none" }}
                                    placeholder="Write a comment"
                                    value={commentValue}
                                    onChange={(event) => setCommentValue(event.target.value)}
                                />


                            </span>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "5px", width: '10%' }}>

                                <button
                                    onClick={() => {
                                        setCommentValue("");
                                        if (commentValue) {
                                            postDiscussion()
                                        }
                                    }}
                                    style={{ ...style, backgroundColor: "transparent" }}
                                >
                                    <SendIcon sx={{ color: colors.primary }} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '10px'
                    }}
                >
                    {(isComment) && (<PostFeature
                        icon={<CancelIcon style={{ color: colors.primary }} />}
                        count={""}
                        onHandleClick={() => {
                            setCommentValue("")
                            setIsComment(!isComment);
                        }}
                    />)}
                    <PostFeature
                        icon={<InsertCommentOutlinedIcon sx={{ color: colors.primary }} />}
                        count={post.discussion_count}
                        onHandleClick={() => {
                            if (!isComment) {
                                getDiscussionData();
                            }
                            setCommentValue("")
                            setIsComment(!isComment);
                        }}
                    />
                </div>


            </div>)}

        </div >
    )
}

export default TSIPosts
