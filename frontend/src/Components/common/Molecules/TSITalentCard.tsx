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
const TSITalentCard = ({ post, type, onHandleClick, setClickedPost, setIsEditPost }: any) => {
    const fullText = post?.about
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [data, setData] = useState<any>({})
    const [isHover, setIsHover] = useState(false)
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



    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", }}>
            <div
                onClick={() => { onHandleClick() }}
                onMouseEnter={() => { setIsHover(true) }}
                onMouseLeave={() => { setIsHover(false) }}
                style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px', padding: '10px', borderBottom: `0.5px solid ${colors.snowywhite}`, borderRadius: "0px", backgroundColor: isHover ? colors.lightPrimarybackground : colors.white, }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", alignItems: "center", }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
                        <Avatar
                            onClick={() => { navigation(`/talent/postdetails?id=${post?.posted_by_account_slug || ''}`); }}
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
                                fontWeight: 600,
                                lineHeight: "28px",
                                color: colors.black,
                                textTransform: "capitalize"
                            }}>{post?.posted_by?.charAt(0)}</span>
                        </Avatar>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '2px' }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "19.07px",
                                textAlign: 'left',
                                fontFamily: "OpenSans",
                                textTransform: "capitalize"
                            }}>{post?.posted_by}</p>

                            <p style={{
                                color: colors.lightgrey,
                                fontSize: "14px",
                                fontWeight: 400,
                                margin:0,padding:0,
                                fontFamily:'OpenSans'
                            }}><span style={{ color: colors.graniteGrey }}>{post?.city}</span>  {(post?.city && post?.time_ago) && (" • ")} {post?.time_ago || "NA"}</p>

                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: "20px" }}>
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
                            <MenuItem onClick={() => { handleClose(); setClickedPost(post); setIsEditPost(true); }}>Edit</MenuItem>
                        </Menu>
                    </div>
                </div>

                {/* <p style={{
                    margin: 0, padding: 0,
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "19.07px",
                    textAlign: 'left',
                    fontFamily: "OpenSans",
                    textTransform: "capitalize"
                }}>{post?.college}</p> */}
                {/* <p style={{
                    margin: 0, padding: 0,
                    color: colors.lightgrey,
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: "24px",
                    textAlign: 'left',
                    fontFamily: "OpenSans"
                }}>{post?.city} {(post?.city && post?.state) && (" • ")} {post?.state} </p> */}

                {/* <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "5px", padding: '2px', paddingLeft: '0px', paddingTop: "2px" }}>
                    <TSISpreadItems items={[...post?.solutions_interested, ...post?.services_interested, ...post?.skills_interested, ...post?.training_interested]} />
                </div> */}

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
                    {fullText}

                </p>
            </div >

        </div>
    )
}

export default TSITalentCard
