import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Modal, Typography } from '@mui/material'
import { calender, cityB, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import TSIMessage from '../../common/Molecules/TSIMessage';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIJobApplicantAddModal from '../../common/Molecules/TSIJobApplicantAddModal';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import { useNavigate, useSearchParams } from 'react-router-dom';

const JobDetails = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [jobApplicantOpen, setJobApplicantOpen] = useState<any>(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const notifid = searchParams.get('notifid')
    const [open, setOpen] = useState<any>(false);
    const [isRejection, setRejection] = useState<any>(false);
    const [isMessage, setIsMessage] = useState<any>(false);
    const role = localStorage.getItem("role")
    const navigation = useNavigate()
    const [jobsData, setJobsData] = useState<any>([]);
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [load, setLoad] = useState<any>(false);
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
        gap: '2px'
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



    const getViewJobData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_job",
            "id": id,
        }
        apiInstance.viewJOBS(body, notifid)
            .then((response: any) => {
                if (response.data) {
                    setJobsData(response.data)
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
            getViewJobData(id)
            // getDiscussionData(id)
        }
    }, [id])

    const getDiscussionData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "JOB",
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
            "content_type": "JOB",
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
                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: "scroll", scrollbarWidth: "none" }}>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '10px', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", }}>
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
                                    cursor:'pointer'
                                }}>
                                <ArrowBackIcon sx={{ width: '20px', height: "20px" }} />
                            </button>
                            <p style={{
                                margin: 0,
                                padding: '0px',
                                paddingLeft: '10px',
                                fontFamily: "OpenSans",
                                fontSize: "24px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                            }}>Job - {jobsData?.title}</p>

                        </div>
                        {(role !== "BUSINESS") && (<TSIButton
                            name={"Apply"}
                            disabled={false}
                            variant={'contained'}
                            padding={"5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`0px solid ${colors.snowywhite}`}
                            customOutlineColorOnHover={`0px solid ${colors.snowywhite}`}
                            customBgColorOnhover={colors.primary}
                            customBgColor={colors.primary}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    setJobApplicantOpen(true)
                                }
                            }
                        />)}

                    </div>
                    <div style={{ width: '100%', overflow: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '15px', paddingTop: "5px", height: "90%" }}>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                width: deviceType == "mobile" ? "100%" : "70%",
                                overflowY: "scroll",
                                scrollbarWidth: "none",
                                gap: '20px',
                                height: "100%"
                            }}
                        >

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    gap: '10px',
                                    padding: "10px"
                                }}
                            >
                                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', paddingTop: "0px", gap: '10px', paddingLeft: '0px', paddingBottom: "0px" }}>
                                    {
                                        [{ icon: cityB, name: jobsData?.city }]?.map((item: any, index: number) => (
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
                                                    gap: '10px'
                                                }}
                                            >
                                                <img src={item?.icon} /> {item?.name}
                                            </div>
                                        ))
                                    }
                                </div>


                                {(jobsData?.description) && (<div style={grpstyle}>
                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 400,
                                        lineHeight: "21px",
                                        letterSpacing: "0.5px",
                                        textAlign: "left",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        {jobsData?.description}
                                    </p>
                                </div>)}

                                {(jobsData?.job_type) && (<div style={grpstyle}>
                                    <p style={titleStyle}>Job Type</p>
                                    <p style={valueStyle}>{jobsData?.job_type}</p>
                                </div>)}
                               {/* <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '0px', width: '100%' }}>

                                    <p style={{
                                        ...titleStyle
                                    }}>{"Discussions"}</p>
                                    {(!load) ? (<div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: "flex-start",
                                            justifyContent: "flex-start",
                                            width: '100%',
                                            height: '90%',
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
                                                paddingLeft: '0px',
                                                paddingRight: '0px',
                                                paddingTop: "0px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: "flex-start",
                                                    justifyContent: "flex-start",
                                                    width: '100%',
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
                                                                <TSIPostComment key={index} comment={comment} type={"JOB"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
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

                                    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", gap: "10px", backgroundColor: colors.lightPrimary, borderRadius: '12px', paddingLeft: '10px', paddingRight: '10px', height: '60px' }}>
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
                                                    if (event.key == "Enter") {
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
                                                    setCommentValue("");
                                                    if (commentValue) {
                                                        postDiscussion()
                                                    }
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 100,
                                                    backgroundColor: "transparent",
                                                    width: '32px',
                                                    height: '32px',
                                                    cursor: 'pointer',
                                                    border: "0px solid transparent"
                                                }}
                                            >
                                                <SendIcon sx={{ color: colors.primary }} />
                                            </button>
                                        </div>
                                    </div>
                                </div> */}

                            </div>



                        </div>




                    </div>

                </div>

                {(jobApplicantOpen) && (<TSIJobApplicantAddModal
                    isOpen={jobApplicantOpen}
                    setIsOpen={setJobApplicantOpen}
                    onSubmit={() => { setJobApplicantOpen(false); }}
                    modaltitle={"Job Application"}
                    tree1Title={"Solutions"}
                    tree2Title={"Services"}
                    tree3Title={"Skills"}
                    jobId={id}
                    jobData={jobsData}
                />)}



                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Job created successfully"}
                    buttonName={"Go to Home"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
                <TSIConfirmationModal
                    open={isRejection}
                    title={"Reject Application"}
                    desc={"Are you sure you want to reject this application?"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Reject"}
                    btn2Color={colors.saturatedRed}
                    onClick={() => { setRejection(false) }}
                />

                <TSIMessage
                    open={isMessage}
                    setIsOpen={setIsMessage}
                    title={"Invite Discussion"}
                    buttonName2={"Send"}
                    btn2Color={colors.primary}
                    onClick={() => { }}
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

export default JobDetails
