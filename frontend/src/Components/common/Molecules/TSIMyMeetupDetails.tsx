import * as React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Checkbox, Modal, Snackbar } from '@mui/material';
import colors from '../../../assets/styles/colors';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { calender, category, community, enquires, industry, man, rfps, serB, services, solB, solutions, success, trB } from '../../../assets';
import apiInstance from '../../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TSIPosts from '../../common/Molecules/TSIPosts';
import SendIcon from '@mui/icons-material/Send';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIButton from '../../common/Atoms/TSIButton';
import useDeviceType from '../../../Utils/DeviceType';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIPostComment from './TSIPostComment';
import TSIAddPost from './TSIAddPost';
const TSIMyMeetupDetails = () => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({})
    const [title, setTitle] = React.useState("")
    const [query, setQuery] = React.useState("")
    const deviceType = useDeviceType()
    const navigation = useNavigate()
    const [searchParams] = useSearchParams();
    const [remainAnonomous, setRemainAnonomous] = React.useState<any>(false)
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [iseditPost, setIsEditPost] = React.useState<any>(false);
    const [selectedindSolutions, setSelectedindSolutions] = React.useState<any>([]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [open, setOpen] = React.useState<any>(false);
    const [isEnquiry, setIsEnquiry] = React.useState<any>(false);
    const [isRFP, setIsRFP] = React.useState<any>(false);
    const [isTest, setIsTest] = React.useState<any>(false);
    const [snackbar, setSnackbar] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });
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

    const id = searchParams.get("id");
    React.useEffect(() => {
        if (id) {
            getViewData(id)
            getDiscussionData(id)
        }
    }, [])

    const getViewData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_meetup",
            "id": id
        }
        apiInstance.getMeetupApi(body)
            .then((response: any) => {
                if (response.data) {
                    setData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

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


    const addEnquiresData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email");
        const domain = email.split("@")[1];

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": "MEETUP",
            "title": title,
            "query": query,
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
                    setQuery("")
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
            })
            .finally(() => {
                setIsEnquiry(false);
                setIsRFP(false);
                setIsTest(false)
            })
    }

    const style1: any = {
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

    if (!load) {
        return (
            <div style={{
                width: "100%"
                , height: "92%", backgroundColor: colors.lightPrimary, paddingTop: '5px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px',
            }}>
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
                <div style={{ width: '100%', height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '10px', borderRadius: '24px', }}>
                    <div style={{ width: '100%', backgroundColor: colors.white, display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: '10px', gap: '10px' }}>
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
                        <p
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: "24px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                                color: colors.black,
                                padding: 0,
                                margin: 0
                            }}
                        >{"Meet Details"}</p>
                    </div>

                    {(!load) ? (<div style={{ width: '100%', height: "100%", overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: "5px", paddingTop: '2px' }}>
                        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', height: "100%" }}>
                            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '70%', height: "100%" }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '5px',
                                        width: '100%',
                                        height: '100%',
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
                                                        height: '20%',
                                                        overflowY: "scroll",
                                                        padding: '10px',
                                                        scrollbarWidth: "none"
                                                    }}
                                                >
                                                    {(data.title) && (<p style={{
                                                        margin: 0, padding: 0, fontFamily: "OpenSans",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        lineHeight: "19.07px",
                                                        textAlign: 'left',
                                                    }}>{data?.title}</p>)}
                                                    {(data.description) && (<p style={{
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
                                                    }}>{data?.description}</p>)}

                                                </div>

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
                                                    }}
                                                >
                                                    <p style={{
                                                        margin: 0, padding: 0, fontFamily: "OpenSans",
                                                        fontSize: "14px",
                                                        fontWeight: 600,
                                                        lineHeight: "19.07px",
                                                        textAlign: 'left',
                                                        paddingLeft: '10px',
                                                        width: '100%',
                                                        paddingBottom: '10px',
                                                        borderBottom: `1px solid ${colors.snowywhite}`
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
                                                                        <>
                                                                            <TSIPostComment key={index} comment={comment} type={"MEETUP"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
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
                            <div style={{
                                display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: '30%', padding: '10px',
                            }}>

                                <TSIButton
                                    name={"Send Enquiry"}
                                    variant={'contained'}
                                    disabled={false}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover={colors.primary}
                                    customBgColor={colors.primary}
                                    customTextColorOnHover={colors.white}
                                    customTextColor={colors.white}
                                    handleClick={() => setIsEnquiry(true)}
                                />
                                <TSIButton
                                    name={"Send RFP"}
                                    variant={'contained'}
                                    disabled={false}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover={colors.primary}
                                    customBgColor={colors.primary}
                                    customTextColorOnHover={colors.white}
                                    customTextColor={colors.white}
                                    handleClick={() => setIsRFP(true)}
                                />

                                <TSIButton
                                    name={"Send Testimonial"}
                                    variant={'contained'}
                                    disabled={false}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover={colors.primary}
                                    customBgColor={colors.primary}
                                    customTextColorOnHover={colors.white}
                                    customTextColor={colors.white}
                                    handleClick={() => setIsTest(true)}
                                />
                            </div>
                        </div>



                        <Modal
                            open={isEnquiry || isTest || isRFP}
                            onClose={() => { setIsEnquiry(false); setIsRFP(false); setIsTest(false) }}
                            sx={{
                                border: "0px solid transparent"
                            }}
                        >
                            <div style={style1}>
                                <div style={{
                                    display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '20px', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '12px', padding: '10px',
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
                                        value={query}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={true}
                                        rows={4}
                                        handleChange={(event: any) => { setQuery(event.target.value) }}
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
                                            name={"Submit"}
                                            disabled={!title || !query}
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
                                                    if (title && query) {
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


                        {
                            (iseditPost) && (<TSIAddPost
                                isOpen={iseditPost}
                                edit={true}
                                editablePost={clickedPost}
                                selectedindSolutions={selectedindSolutions}
                                setSelectedindSolutions={setSelectedindSolutions}
                                setIsOpen={setIsEditPost}
                                onSubmit={() => { }}
                            />)
                        }

                        <TSIPopup
                            isOpen={open}
                            setIsOpen={setOpen}
                            text1={"Success"}
                            text2={"Submited successfully"}
                            buttonName={"Okay"}
                            image={success}
                            onSubmit={() => { setOpen(false); }}
                        />

                    </div>) : (
                        <div className="centered-container">
                            <div className="loader"></div>
                        </div>
                    )}

                </div>
            </div >
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default TSIMyMeetupDetails
