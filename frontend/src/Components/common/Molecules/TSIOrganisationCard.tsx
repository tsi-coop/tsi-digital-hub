import { Avatar, Button, InputBase, Paper } from '@mui/material'
import React, { useState } from 'react'
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import colors from '../../../assets/styles/colors';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import PostFeature from '../Atoms/PostFeature';
import { imageadd, Voice } from '../../../assets';
const TSIOrganisationCard = ({ post }: any) => {
    const [expand, setExpand] = useState(false)
    const fullText = post?.about;


    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", borderBottom: `1px solid ${colors.snowywhite}`, padding: '10px', gap: '5px' }}>
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
                        }}>{post?.title?.charAt(0)}</span>
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
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
                        }}>{post?.role} • {post?.timeAgo}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>


                </div>
            </div>
            <div
                style={{
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    textAlign: 'left'
                }}>
                <p style={{
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "19.6px",
                    textAlign: "left",
                    margin: 0,
                    padding: 0,
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>{fullText}</p>
            </div>

        </div >
    )
}

export default TSIOrganisationCard