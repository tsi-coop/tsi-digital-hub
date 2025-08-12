import * as React from 'react';
import Popover from '@mui/material/Popover';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Avatar, Checkbox, Modal, Snackbar } from '@mui/material';
import colors from '../../../assets/styles/colors';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { calender, category, community, enquires, industry, man, rfps, serB, services, solB, solutions, success, trB } from '../../../assets';
import apiInstance from '../../../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIButton from '../../common/Atoms/TSIButton';
import useDeviceType from '../../../Utils/DeviceType';
import TSIPopup from '../../common/Molecules/TSIPopup';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import TSIAddPost from '../../common/Molecules/TSIAddPost';
import FlagIcon from '@mui/icons-material/Flag';
import TSIPostFlagModal from '../../common/Molecules/TSIPostFlagModal';
const TSIMyPostDetails = () => {
    const [load, setLoad] = React.useState(false)
    const [data, setData] = React.useState<any>({})
    const deviceType = useDeviceType()
    const navigation = useNavigate()
    const [searchParams] = useSearchParams();
    const [discussionData, setDiscussionData] = React.useState([])
    const [currentUser, setCurrentUser] = React.useState(localStorage.getItem("name"));
    const [commentValue, setCommentValue] = React.useState("")
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [iseditPost, setIsEditPost] = React.useState<any>(false);
    const [selectedindSolutions, setSelectedindSolutions] = React.useState<any>([]);
    const [isDetailFlagged, setIsDetailFlagged] = React.useState<any>(false);
    const [isFlag, setIsFlag] = React.useState<any>(false);
    const [comment, setComment] = React.useState<any>("");
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [open, setOpen] = React.useState<any>(false);
    const [isEnquiry, setIsEnquiry] = React.useState<any>(false);
    const role = localStorage.getItem("role")
    const admin = role === "ADMIN";
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

    const id = searchParams.get("id");
    const notifid = searchParams.get("notifid")
    React.useEffect(() => {
        if (id) {
            getViewData(id)
            getDiscussionData(id)
        }
    }, [])

    const getViewData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_post",
            "id": id,
        }
        apiInstance.viewPosts(body, notifid)
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
            "content_type": "POST",
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
            "content_type": "POST",
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
            "content_type": "POST",
            "id": id,
            "comments": comment
        }

        const unflagbody = {
            "_func": "unflag",
            "content_type": "POST",
            "id": id,
            "comments": comment
        }

        apiInstance.postFlag(isDetailFlagged ? unflagbody : flagbody)
            .then((response: any) => {
                if (response.data?._flagged) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Post is Flagged`,
                    })
                    setComment("")
                    setIsFlag(false)
                } else if (response.data?._flagged == false) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `Post is UnFlagged`,
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
                <div style={{ width: '100%', height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '10px', borderRadius: '24px', }}>

                    <div style={{ width: '100%', backgroundColor: colors.white, display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", padding: deviceType == "mobile" ? "5px" : '10px', gap: '10px' }}>
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
                        <span
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
                        ><span style={{ color: colors.primary }}>Post - </span>{data.title}</span>
                        {(admin) && (<button onClick={() => { setIsFlag(true) }} style={{ padding: 0, margin: 0, backgroundColor: "transparent", border: "0px solid transparent", cursor: "pointer" }}>
                            <FlagIcon sx={{ color: colors.primary }} />
                        </button>)}
                    </div>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: deviceType == "mobile" ? "100%" : '70%', paddingTop: '0px', overflow: "scroll", scrollbarWidth: 'none' }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: '10px', padding: "10px", flexWrap: "wrap" }}>
                            {(data?.source_link) && (<div style={{
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
                            }} onClick={() => { window.open(data?.source_link) }}>

                                <InsertLinkIcon sx={{ width: '20px', color: colors.primary }} />{"Post Link"}
                            </div>)}
                        </div>

                        {(!load) ? (<div style={{ width: '100%', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: "5px", paddingTop: '2px' }}>
                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', }}>
                                <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '100%', }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: "flex-start",
                                            gap: '5px',
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
                                                overflowY: "scroll",
                                                scrollbarWidth: "none"
                                            }}
                                        >

                                            <div onClick={() => { }} style={{
                                                color: colors.lightgrey,
                                                fontSize: "14px",
                                                fontWeight: 500,
                                                lineHeight: "21px",
                                                textAlign: 'left',
                                                padding: 0,
                                                margin: 0,
                                                fontFamily: "Opensans",
                                                whiteSpace: "pre-wrap"
                                                // display: '-webkit-box',
                                                // WebkitBoxOrient: 'vertical',
                                                // WebkitLineClamp: 2,
                                                // overflow: 'hidden',
                                                // textOverflow: 'ellipsis',
                                            }} dangerouslySetInnerHTML={{ __html: data?.content }} />
                                        </div>

                                        {(data?.type) && (<div style={grpstyle}>
                                            <p style={titleStyle}>Type</p>
                                            <p style={valueStyle}>{data?.type}</p>
                                        </div>)}






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
                                                    paddingLeft: '0px',
                                                    paddingRight: '0px',
                                                    paddingTop: '10px',
                                                }}
                                            >
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
                                                }}>{"Discussions"}</p>
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
                                                                    <>
                                                                        <TSIPostComment key={index} comment={comment} type={"POST"} reply={true} discussionData={discussionData} callAgain={() => { getDiscussionData(id) }} />
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

                            <TSIPostFlagModal
                                isOpen={isFlag}
                                setIsOpen={() => { setIsFlag(false); setComment("") }}
                                comment={comment}
                                setComment={setComment}
                                onSubmit={() => { handlePostFlag() }}
                            />




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

export default TSIMyPostDetails
