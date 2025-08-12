import { Avatar, Button, InputBase, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { imageadd, Voice } from '../../../assets';
import LaunchIcon from '@mui/icons-material/Launch';
import TSIButton from '../Atoms/TSIButton';
import useDeviceType from '../../../Utils/DeviceType';
import { useNavigate } from 'react-router-dom';
import { handleProfileNavigation } from '../../../Utils/ProfileRouting';
const TSIApplicationCard = ({ post, sideDisplay, apply = false, handleApply, onHandleClick }: any) => {

    const deviceType = useDeviceType()
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
    function timeAgo(timestamp: any) {
        const now: any = new Date();
        const past: any = new Date(timestamp);
        const diffInSeconds = Math.floor((now - past) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} seconds ago`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes} minutes ago`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) {
            return `${diffInDays} days ago`;
        }

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) {
            return `${diffInMonths} months ago`;
        }

        const diffInYears = Math.floor(diffInMonths / 12);
        return `${diffInYears} years ago`;
    }
    const navigation = useNavigate()
    return (
        <div onClick={() => { onHandleClick() }} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `1px solid ${colors.snowywhite}`, padding: sideDisplay ? "2px" : '10px', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                    <Avatar
                        onClick={(event: any) => {
                            event.stopPropagation()
                            navigation(`/community/postdetails?id=${post?.posted_by_account_slug ? post?.posted_by_account_slug : post?.to_account_slug}`)
                            // handleProfileNavigation(navigation, post?.posted_by_account_slug ? post?.posted_by_account_slug : post?.to_account_slug)
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
                        }}>{post?.posted_by_account_slug ? post?.posted_by_account_slug?.charAt(0) : post?.to_account_slug?.charAt(0)}</span>
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                        <p style={{
                            margin: 0, padding: 0, fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            textTransform: "capitalize"
                        }}>{post?.title}</p>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "16.34px",
                            textAlign: "left",
                        }}>{timeAgo(post?.created) || "NA"} • {post?.job_type}</p>
                        <span style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "16.34px",
                            textAlign: "left",
                        }}>{post?.city} {post?.city && ("•")} {post?.state} {(post?.state) && ("•")} </span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "center", gap: "20px" }}>


                    {(post?.status) && (
                        <div
                            style={{
                                color: post?.status == "3" ? colors.red : colors.primary,
                                padding: sideDisplay ? "5px 10px" : "5px 20px",
                                backgroundColor: post?.status == "Rejected" ? colors.lightsaturatedRed : colors.lightPrimary,
                                borderRadius: '100px',
                                fontSize: sideDisplay ? "12px" : "12px"
                            }}
                        >
                            {post?.status == "1" ? "APPLIED" : post?.status == "2" ? "INVITED FOR DISCUSSION" : post?.status == "3" ?"REJECTED"  : ''}
                        </div>
                    )}
                    {/* {(apply) && (
                        <TSIButton
                        name={"Apply"}
                        disabled={false}
                        variant={'contained'}
                        leadingIcon={}
                        padding={sideDisplay ? "5px 20px" : "5px 20px"}
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
                                handleApply()
                            }
                        }
                    />
                     )}  */}
                    <Button
                        id="basic-button"
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
                        onClick={(event) => { event.stopPropagation(); handleApply() }}
                    >
                        <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                    </Button>
                </div>
            </div>
            {(post?.job_description) && (<p style={{
                margin: 0, padding: 0, fontFamily: "OpenSans",
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: "19.07px",
                textAlign: 'left',
                textTransform: "capitalize",
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>{post?.job_description}</p>)}


            {(!post.status && !apply) && (<div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", gap: sideDisplay ? "5px" : '15px', width: '100%' }}>
                <TSIButton
                    name={"Reject"}
                    disabled={false}
                    variant={'outlined'}
                    padding={sideDisplay ? "5px 20px" : "5px 20px"}
                    load={false}
                    isCustomColors={true}
                    customOutlineColor={`1px solid ${colors.browngrey}`}
                    customOutlineColorOnHover={`1px solid ${colors.browngrey}`}
                    customBgColorOnhover={colors.white}
                    customBgColor={colors.white}
                    customTextColorOnHover={colors.saturatedRed}
                    customTextColor={colors.saturatedRed}
                    handleClick={
                        () => {

                        }
                    }
                />
                <TSIButton
                    name={deviceType == "mobile" ? "Invite" : deviceType == "small-tablet" ? "Invite" : deviceType == "tablet" ? "Invite" : "Invite For Discussion"}
                    disabled={false}
                    variant={'contained'}
                    padding={sideDisplay ? "5px 20px" : "5px 20px"}
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

                        }
                    }
                />
            </div>)
            }


        </div >
    )
}

export default TSIApplicationCard