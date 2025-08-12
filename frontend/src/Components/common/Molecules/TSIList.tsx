import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import colors from '../../../assets/styles/colors';
const TSIList = ({ post }: any) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "center", borderTop: `1px solid ${colors.snowywhite}`, paddingTop: '10px', gap: '5px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px" }}>
                    <div
                        onClick={() => { }}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 100,
                            background: '#F2F2F2',
                            width: '44px',
                            height: '44px',
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{
                            fontFamily: "Inter",
                            fontSize: "20px",
                            fontWeight: 500,
                            lineHeight: "28px",
                            // marginLeft: '5px'
                        }}>{post?.title.charAt(0)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                        <p style={{
                            margin: 0, padding: 0, fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 600,
                            lineHeight: "19.07px",
                            textAlign: 'left',
                        }}>{post?.title}</p>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "16.34px",
                            textAlign: "left",
                        }}>{post?.role}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
                    <Button sx={{
                        padding: "10px", margin: 0, fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "20px",
                        letterSpacing: "0.10000000149011612px",
                        textAlign: "center",
                        textTransform: "capitalize",
                        backgroundColor: "transparent",
                        color: '#006A67',
                        cursor: "pointer",
                        border: `1px solid ${colors.snowywhite}`,
                        borderRadius:'24px',
                        height:'36px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "10px" }}> {post?.followStatus ? (<AddIcon sx={{ width: '20px' }} />) : (<AddIcon sx={{ width: '20px' }} />)} <p style={{ margin: 0, padding: 0 }}>{"Follow"}</p> </div>
                    </Button>
                   
                   
                </div>
            </div>
        </div>
    )
}

export default TSIList
