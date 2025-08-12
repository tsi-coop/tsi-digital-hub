import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Typography } from '@mui/material'
import colors from '../../../assets/styles/colors';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FlagIcon from '@mui/icons-material/Flag';
import TSIPostFlagModal from '../../common/Molecules/TSIPostFlagModal';
const EnquiriesDetails = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const notifid = searchParams.get("notifid");
    const navigation = useNavigate()
    const [enquiryData, setEnquiryData] = useState<any>([])
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [load, setLoad] = useState(false)
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const role = localStorage.getItem("role")
    const admin = role === "ADMIN";
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const titleStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const valueStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }

    useEffect(() => {
        if (id) {
            getViewEnquiryData(id)
        }
    }, [id])

    const getViewEnquiryData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_enquiry",
            "id": id,

        }
        apiInstance.viewEnquires(body, notifid)
            .then((response: any) => {
                if (response.data) {
                    setEnquiryData(response.data)
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


    const cancelEnquires = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "cancel_enquiry",
            "id": id
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data?._cancelled) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "cancelled successfully",
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

    React.useEffect(() => {
        if (id) {
            getDiscussionData(id)
        }
    }, [id])

    const getDiscussionData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "ENQUIRY",
            "content_id": id
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
            "content_type": "ENQUIRY",
            "content_id": id,
            "parent_uuid": "",
            "discussion": commentValue
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response?.data?._added) {
                    getDiscussionData(id)
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

    const handlePostFlag = () => {
        setLoad(true)
        const flagbody = {
            "_func": "flag",
            "content_type": "ENQUIRY",
            "id": id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "ENQUIRY",
            "id": id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Enquiry is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Enquiry is UnFlagged`,
                    })
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Something went wrong`,
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

    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '92%' }}>
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



                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px', paddingTop: "0px", paddingBottom: '0px' }}>
                        <button
                            onClick={() => { navigation(-1) }}
                            style={{
                                padding: 0, margin: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "20px",
                                letterSpacing: "0.10000000149011612px",
                                textAlign: "center",
                                textTransform: "capitalize",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                cursor: "pointer"
                            }}>
                            <ArrowBackIcon sx={{ width: '20px', height: "20px" }} />
                        </button>
                        <span style={{
                            margin: 0,
                            padding: '10px',
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                        }}><span style={{ color: colors.primary }}>Enquiry - </span>{enquiryData?.title}</span>
                        {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                            <FlagIcon sx={{ color: colors.primary }} />
                        </button>)}
                    </div>
                    <div style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '10px', paddingLeft: '0px', paddingRight: '0px', paddingTop: "0px", paddingBottom: '0px' }}>



                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '20px', paddingTop: "10px", gap: '10px', width: deviceType == "mobile" ? "100%" : '70%', height: '100%' }}>

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    height: '100%',
                                    overflowY: "scroll",
                                    scrollbarWidth: "none",
                                    gap: '30px'
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', width: '100%' }}>
                                    <p style={valueStyle}>{enquiryData?.query}</p>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        width: '100%',
                                        height: '100%',
                                    }}
                                >
                                    {(!load) ? (<div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            width: '100%',
                                            overflowY: "scroll",
                                            scrollbarWidth: "none"
                                        }}
                                    >



                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: "flex-start",
                                                justifyContent: "flex-start",
                                                width: '100%',
                                                padding: '10px',
                                                paddingTop: "10px",
                                                paddingLeft: '0px',
                                                paddingRight: '0px',
                                            }}
                                        >
                                            <p style={titleStyle}>{"Discussions"}</p>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start",
                                                    width: '100%',
                                                    height: '98%',
                                                    overflowY: "scroll",
                                                    padding: '0px',
                                                    paddingTop: '10px',
                                                    scrollbarWidth: "none"
                                                }}
                                            >
                                                {
                                                    discussionData?.map((comment: any, index: number) => {
                                                        if (comment?.parent_uuid == "") {
                                                            return (
                                                                <>
                                                                    <TSIPostComment key={index} comment={comment} type={"ENQUIRY"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
                                                                </>
                                                            )
                                                        }
                                                        return null;
                                                    })
                                                }
                                            </div>
                                        </div>

                                    </div>) : (
                                        (load) && (<div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "center", alignItems: "flex-start", }}>
                                            <div className="loader"></div>
                                        </div>)
                                    )}

                                    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", gap: "10px", backgroundColor: colors.lightPrimary, borderRadius: '12px', paddingLeft: '10px', paddingRight: '10px', height: '15s%' }}>
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
                                                onKeyDown={(event) => {
                                                    if (event.key == "Enter" && commentValue !== "") {
                                                        setCommentValue("");
                                                        if (commentValue) {
                                                            postDiscussion()
                                                        }
                                                    }
                                                }}
                                                onChange={(event) => setCommentValue(event.target.value)}
                                            />


                                        </span>

                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "center", gap: "5px", width: '10%', }}>

                                            <button
                                                onClick={() => {
                                                    if (commentValue !== "") {
                                                        setCommentValue("");
                                                        if (commentValue) {
                                                            postDiscussion()
                                                        }
                                                    }
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 100,
                                                    width: '32px',
                                                    height: '32px',
                                                    cursor: 'pointer',
                                                    backgroundColor: "transparent",
                                                    border: "0px solid transparent"
                                                }}
                                            >
                                                <SendIcon sx={{ color: colors.primary }} />
                                            </button>
                                        </div>
                                    </div>

                                </div>



                            </div>


                        </div>
                    </div>

                </div>
                <TSIPostFlagModal
                    isOpen={isFlag}
                    setIsOpen={() => { setIsFlag(false); setComment("") }}
                    comment={comment}
                    setComment={setComment}
                    onSubmit={() => { handlePostFlag() }}
                />




            </div >
        )
    }
    else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default EnquiriesDetails
