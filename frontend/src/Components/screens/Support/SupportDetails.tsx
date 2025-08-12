import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Modal, Typography } from '@mui/material'
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
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import CloseIcon from '@mui/icons-material/Close';
import TSIButton from '../../common/Atoms/TSIButton';
const SupportDetails = ({ isAdmin }: any) => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
     const status = searchParams.get('status');
    const notifid = searchParams.get("notifid");
    const navigation = useNavigate()
    const [supportData, setSupportDetails] = useState<any>([])
    const [changingstatus, setChangingStatus] = useState("OPEN")
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [load, setLoad] = useState(false)
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const [openChangeReqModal, setOpenChangeReqModal] = useState(false)
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
            getViewSupportData(id)
        }
    }, [id])


    const getViewSupportData = (row: any) => {
        setLoad(true);
        const body = {
            "_func": "view_support_request",
            "id": id
        };

        apiInstance
            .getSupports(body, notifid)
            .then((response: any) => {
                if (response.data) {
                    setSupportDetails(response.data);
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };


    React.useEffect(() => {
        if (id) {
            getDiscussionData(id)
        }
    }, [id])

    const getDiscussionData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "SUPPORT",
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
            "content_type": "SUPPORT",
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
            "content_type": "SUPPORT",
            "id": id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "SUPPORT",
            "id": id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Support is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Support is UnFlagged`,
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

    const getAdminRoleChangingData = (id: any, status: any) => {
        setLoad(true);
        const body = {
            "_func": "change_support_request_status",
            "id": id,
            "status": status
        };

        apiInstance
            .postAccount(body)
            .then((response: any) => {
                if (response.data._changed) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Status Changed"
                    })
                    navigation(-1)
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };

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

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", padding: '10px', paddingTop: "0px", paddingBottom: '0px' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: "flex-start",
                            alignItems: "center"
                        }}>
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
                            }}><span style={{ color: colors.primary }}>Support - </span>{supportData?.type}</span>
                            {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                                <FlagIcon sx={{ color: colors.primary }} />
                            </button>)}
                        </div>

                        <TSIButton
                            name={"Status Change"}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover={colors.primary}
                            customBgColor={colors.primary}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    setOpenChangeReqModal(true)
                                }
                            }

                        />
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
                                    <p style={valueStyle}>{supportData?.query}</p>
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
                                                                <TSIPostComment key={index} comment={comment} type={"SUPPORT"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
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

                <Modal
                    open={openChangeReqModal}
                    onClose={() => { setOpenChangeReqModal(false) }}
                    aria-labelledby="status-modal-title"
                    aria-describedby="status-modal-description"
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: colors.white,
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            width: '35%',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                width: '100%',
                                borderBottom: `1px solid ${colors.snowywhite}`,
                                height: '10%',
                                padding: '10px'
                            }}
                        >
                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                textAlign: "left",
                            }}>
                                Change Support Request Status
                            </span>
                            <button onClick={() => { setOpenChangeReqModal(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>

                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "center",
                                justifyContent: "flex-start",
                                width: '100%',
                                padding: '20px',
                                gap: "15px",
                                height: '80%'
                            }}
                        >
                            <TSISingleDropdown
                                name="Changing Status"
                                setFieldValue={(value: string) => {
                                }}
                                previewMode={true}
                                fieldvalue={status}
                                dropdown={[
                                    { key: 1, value: "OPEN" },
                                    { key: 2, value: "CLOSED" },
                                    { key: 3, value: "CANCELLED" }
                                ].map((item) => item.value)}
                            />

                            <TSISingleDropdown
                                name="Changing Status"
                                setFieldValue={(value: string) => {
                                    setChangingStatus(value);

                                }}
                                fieldvalue={changingstatus}
                                dropdown={[
                                    { key: 1, value: "OPEN" },
                                    { key: 2, value: "CLOSED" },
                                    { key: 3, value: "CANCELLED" }
                                ].filter((item) => item.value !== supportData?.status)?.map((item) => item.value)}
                            />

                            <TSIButton
                                name={"Submit"}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "8px 50px"}
                                load={false}
                                isCustomColors={true}
                                customOutlineColor="1px solid #006A67"
                                customOutlineColorOnHover="1px solid #006A67"
                                customBgColorOnhover="#006A67"
                                customBgColor={"#006A67"}
                                customTextColorOnHover="#FFF"
                                customTextColor="#FFF"
                                handleClick={
                                    () => {
                                        getAdminRoleChangingData(id,
                                            changingstatus == "OPEN" ? 1 : changingstatus == "CLOSED" ? 2 : changingstatus == "CANCELLED" ? 3 : 1
                                        );
                                    }
                                }
                            />

                        </div>

                    </div>
                </Modal>




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

export default SupportDetails
