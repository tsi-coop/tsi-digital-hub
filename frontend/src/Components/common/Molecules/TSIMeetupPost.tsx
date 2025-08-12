import { Avatar, Button, CircularProgress, InputBase, Menu, MenuItem, Paper, Popover, Snackbar } from '@mui/material'
import React, { useState } from 'react'
import EditNoteIcon from '@mui/icons-material/EditNote';
import colors from '../../../assets/styles/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import apiInstance from '../../../services/authService';
const TSIMeetupPost = ({ post, setClickedPost, discussionData, onHandleClick, setIsEditPost, onSubmit, isEditable = true }: any) => {
    const [isHover, setIsHover] = useState(false)
    const fullText = post?.description
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
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const cancelMeetup = () => {
        setLoad(true)
        const body = {
            "_func": "cancel_meetup",
            "id": post?.id
        }
        apiInstance.getMeetupApi(body)
            .then((response: any) => {
                if (response.data?._cancelled) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: 'Meetup Cancelled',
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }

    const openInNewTab = (url: any) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const style: any = {
        cursor: 'pointer',
        fontFamily: 'OpenSans',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '19.07px',
        textAlign: 'left',
        color: colors.primary,
        textDecoration: 'underline',
    }



    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", gap: '10px', }}>
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
                onClick={() => onHandleClick()}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`, gap: '10px', padding: '10px', borderRadius: '0px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                    <div
                        style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Avatar
                            onClick={(event) => {
                                event?.preventDefault()
                                event.stopPropagation();
                                navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`)
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
                        </button>
                        )}
                    </div>
                </div>
                {(post.title) && (<p style={{
                    margin: 0, padding: 0, fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                }}>{post?.title}</p>)}
                {(post?.meeting_address || post?.meeting_link || post?.meeting_geo_link) && (
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            gap: '10px',
                        }}>
                        {post.meeting_address && (
                            <span
                                onClick={() => openInNewTab(post?.meeting_address)}
                                style={style}
                            >
                                Meeting Address
                            </span>
                        )}

                        {post.meeting_link && (
                            <span
                                onClick={() => openInNewTab(post?.meeting_link)}
                                style={style}
                            >
                                Meeting Link
                            </span>
                        )}

                        {post.meeting_geo_link && (
                            <span
                                onClick={() => openInNewTab(post?.meeting_geo_link)}
                                style={style}
                            >
                                Meeting Geo Link
                            </span>
                        )}
                    </div>)}

                {(post?.description) && (<div
                    style={{
                        fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "19.6px",
                        textAlign: 'left',
                    }}>
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 500,
                        lineHeight: "19.6px",
                        textAlign: "left",
                        margin: 0,
                        padding: 0,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>{fullText}</span>


                </div>)}


            </div>

        </div >
    )
}

export default TSIMeetupPost
