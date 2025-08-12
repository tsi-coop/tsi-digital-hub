import { Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import LaunchIcon from '@mui/icons-material/Launch';
const TSIJobCard = ({ post, onHandleClick }: any) => {
    const [expand, setExpand] = useState(false)
    const [isHover, setIsHover] = useState(false)
    const fullText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
    const truncatedText = fullText.slice(0, 100) + "...";
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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

    return (
        <div
            onClick={() => onHandleClick()}
            onMouseEnter={() => { setIsHover(true) }}
            onMouseLeave={() => { setIsHover(false) }}
            style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`, padding: '10px', gap: '5px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, borderRadius: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px' }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontSize: "16px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                            fontFamily: "OpenSans",
                            textTransform: "capitalize"
                        }}>{post?.title}

                        </p>

                        {/* <span style={{
                            color: colors.lightgrey,
                            fontSize: "14px",
                            fontWeight: 400,
                        }}>{timeAgo(post?.created) || "NA"}  <span style={{ fontWeight: 400,paddingLeft:'5px' }}> 
                         {(post?.city) && ("• ")} 
                          {/* {post?.city} 
                           {/* {(post?.city && post?.state) && ("•")} {post?.state} 
                           </span> </span> */}
                        <p style={{
                            margin: 0, padding: 0,
                            color: colors.lightgrey,
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "24px",
                            textAlign: 'left',
                            fontFamily: "OpenSans"
                        }}> {post?.type}</p>
                        {/* {post?.city} {post?.city && ("•")} {post?.state} {(post?.state) && ("•")} */}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
                    <span style={{
                        color: colors.lightgrey,
                        fontSize: "14px",
                        fontWeight: 400,
                    }}>{timeAgo(post?.created) || "NA"}  </span>
                    <Button
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
                        onClick={(event) => {event.stopPropagation(); onHandleClick() }}
                    >
                        <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                    </Button>
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
                    </Menu>
                </div>
            </div>

            {(post?.content) && (<div style={{
                fontFamily: "OpenSans",
                fontSize: "14px",
                fontWeight: 400,
                lineHeight: "19.6px",
                textAlign: "left",
            }}>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    textAlign: "left",
                    margin: 0,
                    padding: 0
                }}>{expand ? fullText : truncatedText}<span style={{ color: colors.primary }} onClick={() => { setExpand(!expand) }}>{expand ? "See Less" : "See More"}</span></p>
            </div>)}

            {/* <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', paddingLeft: '0px', paddingTop: "2px" }}>
                <TSISpreadItems items={items} />
            </div> */}

        </div >
    )
}

export default TSIJobCard
