import { Avatar, Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';
const TSIOrgCard = ({ post, onHandleClick }: any) => {
    const navigation = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <div onClick={() => { onHandleClick() }} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `1px solid ${colors.snowywhite}`, padding: '10px', gap: '5px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                    <Avatar
                        onClick={(event) => {
                            event.stopPropagation()
                            navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`)
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
                            fontSize: "16px",
                            fontWeight: 500,
                            lineHeight: "28px",
                            color: colors.black,
                            textTransform: "capitalize"
                        }}>{post?.posted_by?.charAt(0)}</span>
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            fontFamily: "OpenSans",
                            textTransform: "capitalize"
                        }}>{post?.org_name}</p>
                        <span style={{
                            color: colors.lightgrey,
                            fontSize: "14px",
                            fontWeight: 400,
                        }}>{post?.city || "NA"} {(post?.city && post?.time_ago) && "•"} {post?.time_ago}</span>


                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
                    <button
                        style={{
                            padding: 0, margin: 0, fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "20px",
                            letterSpacing: "0.10000000149011612px",
                            textAlign: "center",
                            textTransform: "capitalize",
                            backgroundColor: "transparent",
                            border: "0px solid transparent"
                        }}>
                        <Button
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
                        </Button>

                    </button>
                </div>
            </div>


            <p style={{
                fontFamily: "OpenSans",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "19.6px",
                color: colors.graniteGrey,
                textAlign: "left",
                margin: 0,
                padding: 0,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>{post?.about}</p>

        </div >
    )
}

export default TSIOrgCard
