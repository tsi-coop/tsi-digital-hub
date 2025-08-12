import { Avatar, Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import useDeviceType from '../../../Utils/DeviceType';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import { calender, cityB, man, NoData } from '../../../assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import FlagIcon from '@mui/icons-material/Flag';
import TSIPostFlagModal from '../../common/Molecules/TSIPostFlagModal';

const MeetupDetails = () => {
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(true);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const notifid = searchParams.get('notifid')
    const [meetupData, setMeetupData] = React.useState<any>({});
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const anchorRef: any = React.useRef(null);
    const deviceType = useDeviceType()
    const navigate = useNavigate()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
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


    const grpstyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: '100%',
        gap: '5px'
    }
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
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        flexWrap: "wrap",
        padding: 0,
        margin: 0,
        color: colors.black
    }

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


    useEffect(() => {
        if (id) {
            getDiscussionData(id)
            getViewMeetup(id)
        }
    }, [])




    const getViewMeetup = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_meetup",
            "id": id,
        }
        apiInstance.getMeetupApi(body, notifid)
            .then((response: any) => {
                if (response.data) {
                    setMeetupData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    const getDiscussionData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "MEETUP",
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
            "content_type": "MEETUP",
            "content_id": meetupData?.id,
            "parent_uuid": "",
            "discussion": commentValue
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response?.data?._added) {
                    getDiscussionData(meetupData?.id)
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
            "content_type": "MEETUP",
            "id": id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "MEETUP",
            "id": id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Meetup is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Meetup is UnFlagged`,
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
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', height: "92%", backgroundColor: colors.lightPrimary }}>
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

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px', gap: '10px', paddingBottom: '0px', }}>
                        <button
                            onClick={() => { navigate(-1) }}
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
                            paddingBottom: "10px",
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                            textTransform: 'capitalize'
                        }}><span style={{ color: colors.primary }}>Meetup - </span>{meetupData?.title}</span>
                        {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                            <FlagIcon sx={{ color: colors.primary }} />
                        </button>)}

                    </div>
                    <div style={{
                        width: '100%',
                        height: '85%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        padding: '10px',
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: "center",
                            gap: '10px',
                            width: '100%',
                            paddingBottom: '0px',
                            paddingTop: "0px",
                        }}>
                            {
                                [
                                    meetupData?.meeting_date ? { icon: calender, name: meetupData?.meeting_date } : null,
                                    meetupData?.meeting_state ? { icon: cityB, name: meetupData?.meeting_state } : null,
                                    meetupData?.meeting_city ? { icon: cityB, name: meetupData?.meeting_city } : null
                                ].filter(Boolean).map((item: any, index: number) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "8px",
                                            backgroundColor: colors.mintWhisper,
                                            color: colors.darkblack,
                                            fontFamily: "OpenSans",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            lineHeight: "20px",
                                            letterSpacing: "0.16px",
                                            textAlign: "center",
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <img src={item?.icon} alt="" /> {item?.name}
                                    </div>
                                ))
                            }
                            {(meetupData?.meeting_geo_link && meetupData?.type == "IN-PERSON") && (
                                <div style={{
                                    ...grpstyle,
                                    width: '180px',
                                    padding: "4px 10px",
                                    borderRadius: "8px",
                                    backgroundColor: colors.mintWhisper,
                                    color: colors.darkblack,
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "20px",
                                    letterSpacing: "0.16px",
                                    textAlign: "center",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: "pointer"
                                }} onClick={() => window.open(meetupData?.meeting_geo_link)}>

                                    <InsertLinkIcon sx={{ width: '20px', color: colors.primary }} />{"Meeting Geo Link"}
                                </div>
                            )}
                        </div>


                        <div style={{
                            display: "flex",
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            overflowY: 'auto',
                            scrollbarWidth: "none",
                            alignItems: "flex-start",
                            gap: '10px',
                            width: deviceType == "mobile" ? "100%" : '70%',
                            padding: '10px',
                        }}>


                            <div style={grpstyle}>
                                <p style={titleStyle}>Description</p>
                                <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{meetupData?.description}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Meeting Time</p>
                                <p style={{ ...valueStyle }}>{meetupData?.meeting_time}</p>
                            </div>

                            {meetupData?.type == "IN-PERSON" && (
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Meeting Address</p>
                                    <p style={valueStyle}>{meetupData?.meeting_address}</p>
                                </div>
                            )}

                            {(meetupData?.meeting_link && meetupData?.type == "WEBINAR") && (
                                <div style={grpstyle} onClick={() => window.open(meetupData?.meeting_link)}>
                                    <p style={{
                                        ...titleStyle,
                                        color: colors.primary,
                                        alignItems: "center",
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        gap: '5px'
                                    }}>
                                        <InsertLinkIcon sx={{ width: "20px" }} /> Meeting Link
                                    </p>
                                </div>
                            )}



                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                gap: '5px',
                                width: '100%',
                            }}>
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    lineHeight: "24px",
                                    letterSpacing: "0.5px",
                                    textAlign: "left",
                                    padding: 0,
                                    margin: 0,
                                    color: colors.black
                                }}>
                                    Discussions
                                </p>

                                {!load ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: "flex-start",
                                        justifyContent: "flex-start",
                                        width: '100%',
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            width: '100%',
                                            padding: '0px',
                                            paddingTop: '10px',
                                        }}>
                                            {
                                                discussionData?.map((comment: any, index: number) => {
                                                    if (comment?.parent_uuid === "") {
                                                        return (
                                                            <>
                                                                <TSIPostComment
                                                                    key={index}
                                                                    comment={comment}
                                                                    type={"MEETUP"}
                                                                    reply={true}
                                                                    discussionData={discussionData}
                                                                    callAgain={() => getDiscussionData(meetupData?.id)}
                                                                />
                                                            </>
                                                        );
                                                    }
                                                    return null;
                                                })
                                            }
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        width: "100%",
                                        justifyContent: "center",
                                        alignItems: "flex-start",
                                    }}>
                                        <div className="loader"></div>
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    width: "100%",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "10px",
                                    backgroundColor: colors.lightPrimary,
                                    borderRadius: '12px',
                                    paddingLeft: '10px',
                                    paddingRight: '10px',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "5px",
                                    }}>
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
                                            }}>
                                                {currentUser?.charAt(0)}
                                            </span>
                                        </Avatar>
                                    </div>

                                    <span style={{
                                        borderRadius: "30px",
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '80%',
                                        backgroundColor: "transparent"
                                    }}>
                                        <input
                                            style={{
                                                marginLeft: 1,
                                                flex: 1,
                                                color: '#3F4948',
                                                width: "100%",
                                                backgroundColor: "transparent",
                                                borderColor: "transparent",
                                                outline: "none"
                                            }}
                                            placeholder="Write a comment"
                                            value={commentValue}
                                            onKeyDown={(event) => {
                                                if (event.key === "Enter") {
                                                    setCommentValue("");
                                                    if (commentValue) {
                                                        postDiscussion()
                                                    }
                                                }
                                            }}
                                            onChange={(event) => setCommentValue(event.target.value)}
                                        />
                                    </span>

                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "5px",
                                        width: '10%',
                                    }}>
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

export default MeetupDetails
