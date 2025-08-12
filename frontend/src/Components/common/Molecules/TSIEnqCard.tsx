import { Avatar, Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import { imageadd, Voice } from '../../../assets';
import LaunchIcon from '@mui/icons-material/Launch';
import { DeleteForever } from '@mui/icons-material';
import apiInstance from '../../../services/authService';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useNavigate } from 'react-router-dom';
import { handleProfileNavigation } from '../../../Utils/ProfileRouting';
const TSIEnqCard = ({ post, onHandleClick, setClickedPost, setIsEditPost, onDelete, isEditable = true }: any) => {
    const [isHover, setIsHover] = useState(false)
    const [load, setLoad] = useState(false)
    const [isComment, setIsComment] = useState(false)
    const navigation = useNavigate()

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
    const timeAgo = (timestamp: any) => {
        const givenDate = new Date(timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const currentDate = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });

        const givenIST = new Date(givenDate);
        const currentIST = new Date(currentDate);

        const diffInSeconds = Math.floor((currentIST.getTime() - givenIST.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
            return `Just now`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        } else if (diffInDays === 1) {
            return `Yesterday`;
        } else {
            return `${diffInDays} days ago`;
        }
    };


    if (!load) {
        return (
            <div
                onClick={() => { onHandleClick() }}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`, padding: '10px', gap: '5px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, borderRadius: "0px" }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Avatar
                            onClick={(event) => {
                                if (post?.posted_by !== "Anonymous") {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    navigation(`/community/postdetails?id=${post?.posted_by_account_slug || ''}`);
                                    //  handleProfileNavigation(navigation, post?.posted_by_account_slug)
                                }
                            }}
                            sx={{
                                bgcolor: colors.lightywhite,
                                width: '44px',
                                height: '44px',
                                cursor: 'pointer',
                                fontFamily: 'OpenSans',
                                textTransform: "capitalize"
                            }}>

                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 500,
                                lineHeight: "28px",
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
                                textTransform: "capitalize",
                            }}>{post?.posted_by}</p>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "16.34px",
                                textAlign: "left",
                            }}>{post?.role} {(post?.role && post?.time_ago) && "•"} {post?.time_ago}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
                        <button
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
                            }}
                            onClick={(event) => { event.stopPropagation(); onHandleClick() }}
                        >
                            <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                        </button>


                        {(isEditable) && (<button
                            onClick={(event: any) => {
                                event.stopPropagation()
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
                </div>
                <p style={{
                    margin: 0, padding: 0, fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                    textTransform: "capitalize"
                }}>{post?.title}</p>
                <p style={{
                    margin: 0, padding: 0, fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{post?.query}</p>


                {/* <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', paddingLeft: '2px', paddingTop: "2px" }}>


                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <PostFeature
                        icon={<InsertCommentOutlinedIcon sx={{ color: '#3F4948' }} />}
                        count={6}
                        onHandleClick={() => { setIsComment(!isComment) }}
                    />
                </div>

            </div> */}
                {(isComment) && (<div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: '5px', backgroundColor: colors.lightPrimary, borderRadius: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "5px", width: 'auto' }}>

                        <Avatar sx={{
                            bgcolor: colors.lightywhite,
                            width: '32px',
                            height: '32px',
                            cursor: 'pointer',
                        }}>

                            <span style={{
                                fontFamily: "Inter",
                                fontSize: "20px",
                                fontWeight: 500,
                                lineHeight: "28px",
                                color: colors.black
                            }}>{post?.title?.charAt(0)}</span>
                        </Avatar>
                    </div>

                    <Paper
                        component="form"
                        sx={{ borderRadius: "30px", display: 'flex', alignItems: 'center', width: '85%', border: "0px solid transparent", boxShadow: "none", backgroundColor: "transparent" }}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: '#3F4948', width: "100%" }}
                            placeholder="Answer"
                            inputProps={{ 'aria-label': 'search google maps' }}
                        />

                    </Paper>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "10px", width: 'auto' }}>
                        <button
                            onClick={() => { }}
                            style={{ ...style, backgroundColor: "transparent" }}
                        >
                            <img src={Voice} alt='/blank' />
                        </button>
                        <button
                            onClick={() => { }}
                            style={{ ...style, backgroundColor: "transparent" }}
                        >
                            <img src={imageadd} alt='/blank' />
                        </button>
                    </div>
                </div>)}

            </div >
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        )
    }
}

export default TSIEnqCard