import { Avatar, Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import apiInstance from '../../../services/authService';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useNavigate } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import { handleProfileNavigation } from '../../../Utils/ProfileRouting';
const TSICard = ({ post, type, onHandleClick, setClickedPost, setIsEditPost, isProfile = false }: any) => {
    const [contentExapnd, setContentExpand] = useState(false)
    const [expand, setExpand] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = useState<any>({})
    const fullText = post?.positioning
    // const truncatedText = post?.positioning?.slice(0, 100)
    const [load, setLoad] = useState(false)
    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const getViewData = (id: any, type: "solution" | "service" | "training") => {
        setLoad(true);
        const body = {
            "_func": `view_${type}`,
            "id": id
        };

        const apiMethod = {
            solution: apiInstance.viewSolutions,
            service: apiInstance.viewServices,
            training: apiInstance.viewTraining
        }[type];

        apiMethod(body)
            .then((response: any) => {
                if (response.data) {
                    setData(response.data);
                    setContentExpand(!contentExapnd)
                }
            })
            .catch((error: any) => {
                console.error(error);
            })
            .finally(() => {
                setLoad(false);
            });
    };


    const downloadFile = (id: any) => {
        const fileData = {
            "_func": "download_file",
            "id": id[0],
            "file_extn": "pdf"
        }

        apiInstance
            .downloadDocument(fileData)
            .then((response) => {

                if (response?.data) {
                    setSnackbar({
                        open: true,
                        severity: "success",
                        message: "Download the file",
                    });
                }

            })
            .catch((error: any) => {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: error?.response?.data?.error || "Something went wrong!!",
                });
            })
            .finally(() => setLoad(false));
    }


    const Style: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        margin: 0,
        padding: 0,
        color: colors.lightgrey
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", }}>
            <div
                onClick={() => { onHandleClick() }}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px', padding: '10px', borderRadius: "0px", borderBottom: `0.5px solid ${colors.snowywhite}`, backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                    {(!isProfile) && (<div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                        <Avatar
                            onClick={(event: any) => {
                                if (post?.posted_by !== "Anonymous") {
                                    event.stopPropagation()
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
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px' }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "21px",
                                textAlign: 'left',
                                fontFamily: "OpenSans",
                                textTransform: "capitalize"
                            }}>{post?.posted_by} </p>

                            <span style={{
                                color: colors.lightgrey,
                                fontSize: "14px",
                                fontWeight: 400,
                            }}>{post?.time_ago || "NA"}</span>


                        </div>
                    </div>)}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>

                        {(type !== "") && (<Button
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
                        </Button>)}
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => { handleClose(); onHandleClick() }}>Detail</MenuItem>
                            <MenuItem onClick={() => { handleClose(); setClickedPost(post); setIsEditPost(true); }}>Edit</MenuItem>
                        </Menu>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", gap: "20px", width: '100%' }}>
                    <span style={{
                        margin: 0, padding: 0,
                        fontSize: "14px",
                        lineHeight: "21px",
                        textAlign: 'left',
                        fontFamily: "OpenSans",
                        textTransform: "capitalize",
                        fontWeight: isProfile ? "500" : 600,
                        color: colors.black
                    }}>{post?.title} </span>
                    <span style={{
                        color: colors.lightgrey,
                        fontSize: "14px",
                        fontWeight: 400,
                    }}>{(isProfile) && (post?.time_ago)}</span>
                </div>
                <p style={{
                    margin: 0, padding: 0,
                    color: colors.lightgrey,
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "21px",
                    textAlign: 'left',
                    fontFamily: "OpenSans",
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {/* {expand ? */}
                    {fullText}
                    {/* : truncatedText} */}
                    {/* {(fullText?.length > 100) && (
                        <span style={{ color: colors.primary, marginLeft: '10px', fontSize: "12px", }} onClick={() => { setExpand(!expand) }}>{expand ? "See Less" : "See More"}</span>
                    )} */}
                </p>

            </div >
            {(contentExapnd) && (<div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '2px', padding: '10px', borderTop: `0.5px solid ${colors.snowywhite}` }}>

                {(data.positioning) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Positioning</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data.positioning}</p>
                    </div>
                </div>)}
                {(data?.industry) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Industry</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data.industry}</p>
                    </div>
                </div>)}
                {(data?.course_outline) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Course Outline</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.course_outline}</p>
                    </div>
                </div>)}
                {(data?.features) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Key Features</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.features}</p>
                    </div>
                </div>)}
                {(data?.benefits) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Benefits</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{data?.benefits}</p>
                    </div>
                </div>)}
                {/* {(data?.collaterals) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Collaterals</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span>
                        <button style={{ ...Style, color: colors.black, border: '0px solid transparent', backgroundColor: "transparent" }} onClick={() => { downloadFile(data.collaterals?.replace(/[{}]/g, '').split(',')) }}>
                            {data.collaterals?.replace(/[{}]/g, '').split(',')[0]}
                        </button>
                    </div>
                </div>)} */}
                {(data?.solutions_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Solutions Offered</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data.solutions_offered?.replace(/[{}]/g, '').split(',') || []} />
                    </div>
                </div>)}
                {(data?.services_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Services Offered</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data.services_offered?.replace(/[{}]/g, '').split(',') || []} />
                    </div>
                </div>)}
                {(data?.skills_used || data?.skills_offered) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                    <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                        <p style={{ ...Style, }}>Skills Used</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                        <span style={{ marginRight: '10px' }}>:</span>  <TSISpreadItems items={data?.skills_used?.replace(/[{}]/g, '').split(',') || data?.skills_offered?.replace(/[{}]/g, '').split(',') || []} />
                    </div>

                </div>)}
            </div>)}
        </div>
    )
}

export default TSICard
