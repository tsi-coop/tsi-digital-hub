import { Avatar, Button, InputBase, Menu, MenuItem, Paper } from '@mui/material'
import React, { useState } from 'react'
import colors from '../../../assets/styles/colors';

import LaunchIcon from '@mui/icons-material/Launch';

const TSITestiCard = ({ post, onHandleClick }: any) => {
    const [isHover, setIsHover] = useState(false)

    return (
        <div
            onMouseEnter={() => { setIsHover(true) }}
            onMouseLeave={() => { setIsHover(false) }}
            onClick={() => onHandleClick()} style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px', }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `0.5px solid ${colors.snowywhite}`,borderRadius: '0px', padding: '10px', gap: '5px', backgroundColor: isHover ? colors.lightPrimarybackground : colors.white }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between" }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                        <Avatar sx={{
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
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>

                            <p style={{
                                margin: 0, padding: 0, fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "19.07px",
                                textAlign: 'left',
                                textTransform: "capitalize"
                            }}>{post?.posted_by}</p>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "16.34px",
                                textAlign: "left",
                            }}>{post?.type} {post?.type && "•"} {post?.time_ago}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", gap: "20px" }}>
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
                            onClick={(event) => {event.stopPropagation(); onHandleClick() }}
                        >
                            <LaunchIcon sx={{ width: '20px', height: "20px" }} />
                        </Button>

                    </div>
                </div>
                <p style={{
                    margin: 0, padding: 0,
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "16.34px",
                    textAlign: "left",
                    textTransform: "capitalize"
                }}>{post?.title}</p>
                {(post?.testimonial)&&(<p style={{
                    margin: 0, padding: 0, fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                    textTransform: "capitalize",
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{post?.testimonial}</p>)}
                
            </div>
           
            

        </div >
    )
}

export default TSITestiCard