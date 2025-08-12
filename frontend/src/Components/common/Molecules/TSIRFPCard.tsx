import { Avatar, Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import PostFeature from '../Atoms/PostFeature';
import { imageadd, Voice } from '../../../assets';
import LaunchIcon from '@mui/icons-material/Launch';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useNavigate } from 'react-router-dom';
import { handleProfileNavigation } from '../../../Utils/ProfileRouting';
const TSIRFPCard = ({ post, onHandleClick, setClickedPost, setIsEditPost, isCommentDisplay, isEditable = true }: any) => {
    const [isHover, setIsHover] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigation = useNavigate()
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

    return (
        <div
            onClick={() => onHandleClick()}
            onMouseEnter={() => { setIsHover(true) }}
            onMouseLeave={() => { setIsHover(false) }}
            style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.2px solid ${colors.snowywhite}`, backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, padding: '10px', gap: '5px', borderRadius: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <Avatar
                        onClick={(event) => {
                            if (post?.posted_by !== "Anonymous") {
                                event?.preventDefault()
                                event.stopPropagation();
                                navigation(`/community/postdetails?id=${post?.posted_by_account_slug || ''}`);
                                //   handleProfileNavigation(navigation, post?.posted_by_account_slug)
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
                            fontSize: "20px",
                            fontWeight: 500,
                            lineHeight: "28px",
                            color: colors.black,
                            textTransform: "capitalize"
                        }}>{post?.posted_by?.charAt(0)}</span>
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                        <p style={{
                            margin: 0, padding: 0, fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            textTransform: "capitalize"
                        }}>{post?.posted_by}</p>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "16.34px",
                            textAlign: "left",
                        }}>{post?.role} {(post?.time_ago && post?.role) && ("•")} {post?.time_ago}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
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
                        onClick={(event) => { event.stopPropagation(); onHandleClick() }}
                    >
                        <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                    </Button>
                    {/* {(isEditable) && (<button
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
                    </button>)} */}
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: 'flex-start',
                    width: '100%',
                    alignItems: "flex-start",
                    gap: '5px'
                }}>
                <p style={{
                    margin: 0, padding: 0, fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                    textTransform: "capitalize"
                }}>{post?.title}</p>
                <span style={{
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    textAlign: "left",
                    margin: 0,
                    padding: 0,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{post?.summary}</span>

            </div>



        </div >
    )
}

export default TSIRFPCard