import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Checkbox, Modal, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import { calender, cityB, image, man, NoData, pzB, pzW, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import apiInstance from '../../../services/authService';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIAddServicesModal from '../../common/Molecules/TSIAddServicesModal';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TSIRFPAddModal from '../../common/Molecules/TSIRFPAddModal';
import CloseIcon from '@mui/icons-material/Close';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import TSITestimonialAddModal from '../../common/Molecules/TSITestimonialAddModal';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import TSIPostFlagModal from '../../common/Molecules/TSIPostFlagModal';
import FlagIcon from '@mui/icons-material/Flag';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
const ServicesDetails = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [servicesOpen, setServicesOpen] = useState<any>(false);
    const [isServices, setIsServices] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const notifid = searchParams.get("notifid")
    const [servicesEditOpen, setServicesEditOpen] = useState<any>(false);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [serviceData, setServiceData] = useState<any>({});
    const [title, setTitle] = useState<any>("");
    const [quer, setQuer] = useState<any>("");
    const [remainAnonomous, setRemainAnonomous] = useState<any>(false);
    const [isEnquiry, setIsEnquiry] = React.useState<any>(false);
    const [isRfp, setIsRFP] = React.useState<any>(false);
    const [isTestimonial, setIsTestimonial] = React.useState<any>(false);
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const role = localStorage.getItem("role")
    const admin = role === "ADMIN";
    const navigate = useNavigate()
    const [isContentOwner, setIsContentOwner] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const [load, setLoad] = useState(true)

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

    const getViewServicesData = (id: any) => {

        setLoad(true)
        const body = {
            "_func": "view_service",
            "id": id,
        }
        apiInstance.viewServices(body, notifid)
            .then((response: any) => {
                if (response.data) {
                    setServiceData(response.data)
                    setIsContentOwner(!response.data?.is_content_owner)
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

    const addEnquiresData = () => {
        setLoad(true)
        // const email: any = localStorage.getItem("email");
        const domain = serviceData?.posted_by_account_slug
        // email.split("@")[1];

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": "SERVICE",
            "title": title,
            "query": quer,
            "to_businesses": [domain],
            "to_professionals": [],
            "discoverable": 1,
            "anonymous": remainAnonomous ? 1 : 0,
            "taxonomies_offered": []
        }

        apiInstance.addEnquires(body)
            .then((response: any) => {
                if (response.data._added) {
                    setTitle("")
                    setQuer("")
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Enquires added successfull",
                    })
                    setIsEnquiry(false)


                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Enquires is unsuccesfull",
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
        getViewServicesData(id)
        if (id) {
            getDiscussionData(id)
        }
    }, [id])

    const getDiscussionData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_discussion_thread",
            "content_type": "SERVICE",
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
            "content_type": "SERVICE",
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

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '33%',
        padding: deviceType == "mobile" ? "15px" : "1%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: '0px solid #000',
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const handlePostFlag = () => {
        setLoad(true)
        const flagbody = {
            "_func": "flag",
            "content_type": "SERVICE",
            "id": id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "SERVICE",
            "id": id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Service is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Service is UnFlagged`,
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

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px', gap: '10px' }}>
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
                            margin: 0, padding: 0,
                            paddingLeft: '10px',
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                        }}><span style={{ color: colors.primary }}>Service - </span>{serviceData?.title}</span>
                        {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                            <FlagIcon sx={{ color: colors.primary }} />
                        </button>)}
                    </div>
                    <div style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollbarWidth: "none", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '10px', paddingLeft: '0px', paddingRight: '0px', paddingTop: '0px' }}>

                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '10px', gap: '10px', flexWrap: "wrap" }}>
                            {
                                [
                                    serviceData?.start_year ? { icon: calender, name: serviceData?.start_year } : null,
                                    serviceData?.num_customers ? { icon: man, name: serviceData?.num_customers } : null,
                                    serviceData?.city ? { icon: cityB, name: serviceData?.city } : null
                                ]?.map((item: any, index: number) => (
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
                            {(serviceData?.service_link) && (<div style={{
                                ...grpstyle,
                                width: '150px',
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
                            }} onClick={() => { window.open(serviceData?.service_link) }}>

                                <InsertLinkIcon sx={{ width: '20px', color: colors.primary }} />{"Service Link"}
                            </div>)}
                        </div>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%' }}>
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : "70%", }}>
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Positioning</p>
                                    <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}> {serviceData?.positioning}</p>
                                </div>


                                <div style={grpstyle}>
                                    <p style={titleStyle}>Description</p>
                                    <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{serviceData?.description}</p>
                                </div>


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
                                                    height: '80%',
                                                    padding: '10px',
                                                    paddingLeft: '0px',
                                                    paddingRight: '0px',
                                                    paddingTop: '0px'
                                                }}
                                            >
                                                <p style={{
                                                    ...titleStyle
                                                }}>{"Discussions"}</p>
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
                                                                    <TSIPostComment key={index} comment={comment} type={"SERVICE"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
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

                                        <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "space-between", alignItems: "center", gap: "10px", backgroundColor: colors.lightPrimary, borderRadius: '12px', paddingLeft: '10px', paddingRight: '10px', height: '10%' }}>
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
                                                        cursor: 'pointer',
                                                        backgroundColor: "transparent",
                                                        border: "0px solid transparent"
                                                    }}
                                                >
                                                    <SendIcon sx={{
                                                        color: colors.primary, width: '32px',
                                                        height: '32px',
                                                    }} />
                                                </button>
                                            </div>
                                        </div>

                                    </div>



                                </div>

                            </div>
                            {(deviceType !== "mobile") && (<div style={{
                                display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '30%', padding: '10px'
                            }}>
                                {(isContentOwner) && (<div style={{
                                    display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '100%',
                                }}>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            backgroundColor: isEnquiry ? colors.primary : colors.white,
                                            border: `1px solid ${colors.primary}`,
                                            color: isEnquiry ? colors.white : colors.primary,
                                            fontWeight: 500,
                                            height: '35px',
                                            paddingLeft: "15px",
                                            paddingRight: '15px',
                                            width: "200px"
                                        }}
                                        onClick={() => {
                                            setIsEnquiry(true)
                                        }}
                                    >
                                        Send Enquiry
                                    </div>
                                    {(role !== "PROFESSIONAL" && role !== "NEW_PROFESSIONAL") && (<div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            backgroundColor: isRfp ? colors.primary : colors.white,
                                            border: `1px solid ${colors.primary}`,
                                            color: isRfp ? colors.white : colors.primary,
                                            fontWeight: 500,
                                            height: '35px',
                                            paddingLeft: "15px",
                                            paddingRight: '15px',
                                            width: "200px"
                                        }}
                                        onClick={() => {
                                            setIsRFP(true)
                                        }}
                                    >
                                        Send RFP
                                    </div>)}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            backgroundColor: isTestimonial ? colors.primary : colors.white,
                                            border: `1px solid ${colors.primary}`,
                                            color: isTestimonial ? colors.white : colors.primary,
                                            fontWeight: 500,
                                            height: '35px',
                                            paddingLeft: "15px",
                                            paddingRight: '15px',
                                            width: "200px"
                                        }}
                                        onClick={() => {
                                            setIsTestimonial(true)
                                        }}
                                    >
                                        Send Testimonial
                                    </div>
                                </div>)}
                            </div>)}

                        </div>
                    </div>

                </div>

                {
                    (servicesOpen) && (<TSIAddServicesModal
                        isOpen={servicesOpen}
                        setIsOpen={setServicesOpen}
                        edit={false}
                        editablePost={clickedPost}
                        onSubmit={() => { setServicesOpen(false); setOpen(true) }}
                        title={"Services"}
                    />)
                }

                {
                    (servicesEditOpen) && (<TSIAddServicesModal
                        isOpen={servicesEditOpen}
                        setIsOpen={setServicesEditOpen}
                        edit={true}
                        editablePost={clickedPost}
                        onSubmit={() => { setServicesEditOpen(false); setOpen(true) }}
                        title={"Services"}
                    />)
                }

                <Modal
                    open={isEnquiry}
                    onClose={() => { setIsEnquiry(false); }}
                    sx={{
                        border: "0px solid transparent"
                    }}
                >
                    <div style={{ ...style, }}>
                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '20px', width: '100%', padding: '10px',
                        }}>
                            <div style={{
                                display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: '100%',
                            }}>
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "20px",
                                    fontWeight: 600,
                                    lineHeight: "28px",
                                    letterSpacing: "0.5px",
                                    textAlign: "left",
                                    color: colors.black,
                                    margin: 0,
                                    padding: 0
                                }}>
                                    Send Enquiry
                                </p>
                                <button onClick={() => { setIsEnquiry(false) }} style={{ width: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>
                            </div>

                            <TSISingleDropdown
                                name={"Enquiry Type"}
                                setFieldValue={() => { }}
                                fieldvalue={"Service"}
                                previewMode={true}
                                dropdown={[]}
                            />
                            <TSITextfield
                                title={"Title"}
                                placeholder={"Enter Title"}
                                value={title}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                handleChange={(event: any) => { setTitle(event.target.value) }}
                            />
                            <TSITextfield
                                title={"Query"}
                                placeholder={"Enter Query"}
                                value={quer}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                rows={4}
                                handleChange={(event: any) => { setQuer(event.target.value) }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "flex-start",
                                    gap: '20px',
                                    width: '100%',
                                }}
                            >
                                <Checkbox
                                    checked={remainAnonomous}
                                    onChange={(event) => { setRemainAnonomous(event.target.checked); }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: colors.primary,
                                        },
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    lineHeight: "25.2px",
                                    textAlign: "left",
                                    color: colors.black
                                }}>
                                    Remain Anonymous?

                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: '100%' }}>
                                <TSIButton
                                    name={"Send"}
                                    disabled={!title || !quer}
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
                                            if (title && quer) {
                                                addEnquiresData()
                                            } else if (!title) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Title is Required",
                                                })
                                            } else if (!title) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Query is Required",
                                                })
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Modal>

                {(isRfp) && (<TSIRFPAddModal
                    isOpen={isRfp}
                    setIsOpen={setIsRFP}
                    onSubmit={() => { setIsRFP(false); setOpen(true) }}
                    modaltitle={"RFP"}
                    isRFPScreen={false}
                    isSolutionScreen={false}
                    isServiceScreen={true}
                    isTrainingScreen={false}
                />)}

                {/* {(isTraining) && (<TSIAddTrainingModal
                    isOpen={isTraining}
                    setIsOpen={setIsTraining}
                    edit={false}
                    editablePost={clickedPost}
                    title={"Training"}
                />)} */}

                {(isTestimonial) && (<TSITestimonialAddModal
                    isOpen={isTestimonial}
                    setIsOpen={setIsTestimonial}
                    onSubmit={() => {

                    }}
                    modaltitle={"Enquiries"}
                    tree1Title={"Enquiries Tags"}
                    tree2Title={"Skills Offered"}
                    discoverable={1}
                    isSolutionScreen={false}
                    isServiceScreen={true}
                    isTrainingScreen={false}
                />)}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Submited successfully"}
                    buttonName={"Okay"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
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

export default ServicesDetails
