import { Button, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Modal, Typography, Box, Snackbar, Avatar, } from '@mui/material';
import React, { useState } from 'react';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
// import { Closed, DocumentDownloadIcon, editIcon, FlipView, forward, Pinned, pin } from '../../../assets';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TSIButton from './TSIButton';
import TSITextfield from './TSITextfield';
import colors from '../../../assets/styles/colors';
const TSIChat = ({ item, setForwardOpen, setReplyOpen, setForwardingChat, chatUpdations }: any) => {
    const [loader, setLoader] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const [expand, setExpand] = useState(false)
    const fullText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";
    const truncatedText = fullText.slice(0, 100) + "..."; const [isSent, setIsSent] = useState(true)






    if (loader) {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        )
    } else {
        return (
            <div style={{ width: '100%', display: 'flex', flexDirection: "row", justifyContent: isSent ? 'space-between' : "flex-end", alignItems: 'flex-start' }}>
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
                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", gap: '5px', alignItems: 'flex-start', width: '100%' }}>
                    {(isSent) ? (

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: "10px", width: '100%' }}>
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
                                    color: colors.black
                                }}>{item?.title?.charAt(0)}</span>
                            </Avatar>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>
                                <p style={{
                                    margin: 0, padding: 0, fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "19.07px",
                                    textAlign: 'left',
                                }}>{item?.title}</p>
                                <p style={{
                                    margin: 0, padding: 0,
                                    fontFamily: "OpenSans",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    lineHeight: "16.34px",
                                    textAlign: "left",
                                }}>{item?.role} • {item?.timeAgo}</p>
                            </div>

                        </div>

                    ) : (<></>)}
                    <div
                        style={{
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "19.6px",
                            textAlign: 'left'
                        }}>
                        <span onClick={() => { setExpand(true) }} style={{
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "19.6px",
                            textAlign: "left",
                            margin: 0,
                            padding: 0
                        }}>{expand ? fullText : truncatedText}</span><span style={{ color: colors.primary }} onClick={() => { setExpand(!expand) }}>{expand ? "See Less" : "See More"}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", gap: '10px', width: '100%' }}>
                        <div style={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: colors.lightPrimary,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: "center",
                            alignItems: 'center'
                        }}>
                            <UploadFileIcon sx={{ color: colors.primary, width: '25px', height: "25px" }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '5px', width: '100%' }}>
                            <p
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "22.4px",
                                    textAlign: "left",
                                    margin: 0,
                                    padding: 0
                                }}
                            >document_file_name.pdf</p>

                        </div>


                    </div>

                    <div style={{
                        display: 'flex', flexDirection: "column", justifyContent: "flex-start", gap: '5px', alignItems: 'flex-start', width: '100%', backgroundColor: colors.lightPrimary,
                        padding: "10px 14px 10px 14px",
                        borderRadius: "12px",
                    }}>
                        <p
                            style={{
                                fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 400,
                                lineHeight: "22.4px",
                                textAlign: "left",
                                margin: 0,
                                padding: 0
                            }}
                        >{item.content}</p>
                    </div>
                </div>

            </div >
        );
    }
};

export default TSIChat;
