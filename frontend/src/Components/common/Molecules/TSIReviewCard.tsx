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
import TSIButton from '../Atoms/TSIButton';
const TSIReviewCard = ({ post, onHandleClick, }: any) => {
    const [contentExapnd, setContentExpand] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = useState<any>({})
    const [load, setLoad] = useState(false)
    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const getViewData = (id: any, type: "solution" | "service" | "training") => {
        setLoad(true);
        const body = {
            "_func": "get_review_content",
            "content_type": "TESTIMONIAL",
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
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderRadius: "15px", border: `0.1px solid ${colors.snowywhite}` }}>
            <div
                // onDoubleClick={() => { onHandleClick() }}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px', padding: '10px', borderRadius: "15px", backgroundColor: isHover ? colors.lightPrimary : colors.lightPrimarybackground, }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px' }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "21px",
                                textAlign: 'left',
                                fontFamily: "OpenSans"
                            }}>{post?.from_account_type} </p>

                            {/* <span style={{
                                color: colors.lightgrey,
                                fontSize: "14px",
                                fontWeight: 400,
                            }}>{timeAgo(post?.created) || "NA"}</span> */}


                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>

                        {/* {(type !== "") && (<Button
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
                            onClick={() => { onHandleClick() }}
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
                        </Menu> */}
                    </div>
                </div>
                <p style={{
                    margin: 0, padding: 0,
                    fontSize: "16px",
                    fontWeight: 500,
                    lineHeight: "21px",
                    textAlign: 'left',
                    fontFamily: "OpenSans"
                }}>{post?.content_type} </p>

                <TSIButton
                    name={"Review"}
                    variant={'contained'}
                    padding={"5px 20px"}
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
                            onHandleClick()
                        }
                    }
                />
            </div >

        </div>
    )
}

export default TSIReviewCard
