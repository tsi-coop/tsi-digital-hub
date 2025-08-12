import React, { Autocomplete, Avatar, Badge, Divider, Fade, IconButton, Menu, MenuItem, MenuList, Paper, TextField } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import useDeviceType from '../../Utils/DeviceType';
import colors from '../../assets/styles/colors';
import TSIAlert from '../common/Molecules/TSIAlert';
import { handleNotificationNavigation } from '../../Utils/DetailRouting';
import { NoData } from '../../assets';
import apiInstance from '../../services/authService';
import MenuIcon from '@mui/icons-material/Menu';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
export function Header({ isOpen, setIsOpen, setQuery, query, selected, setSelected, showConsent, setShowConsent, iframeRef }: any) {
    const navigate = useNavigate();
    const [q, setQ] = useState("")
    const location = useLocation();
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const open = Boolean(anchorEl);
    const [logoutpop, setLogoutPopup] = useState(false)
    const handleClick = (event: any) => { setAnchorEl(event.currentTarget) };
    const handleClose = () => { setAnchorEl(null); };
    const isSettingsRoute = location.pathname === '/settings';
    const role = localStorage.getItem("role");
    const professional = role === "PROFESSIONAL";
    const admin = role === "ADMIN";
    const business = role === "BUSINESS";
    const ambassador = role === "AMBASSADOR";
    const navigation = useNavigate()
    const style: any = { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", gap: deviceType === "mobile" ? "5px" : '10px' }
    const styles = {
        buttonStyle: {
            color: "#3F4948",
        },
    };
    const name = localStorage.getItem("name")

    const [anchorEl2, setAnchorEl2] = useState(null);
    const open2 = Boolean(anchorEl2);
    const handleOpenNotification: any = (event: any) => {
        setAnchorEl2(event.currentTarget);
    };

    const handleClose2 = () => {
        setAnchorEl2(null);
        getNotification()
    };

    useEffect(() => {
        getNotification()
    }, [])

    const getNotification = () => {
        setLoad(true);

        const body = {
            "_func": "get_notifications"
        }
        apiInstance.getNotificationApi(body)
            .then((response: any) => {
                if (response.data) {
                    setNotifications(
                        response.data.map((notification: any) => ({
                            ...notification,
                            read: false,
                        }))
                    );
                }
            })
            .catch((error: any) => {
                console.log("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };


    const sendMessageToIframe = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                {
                    type: 'FROM_PARENT',
                    payload: {
                        openPreferences: true,
                    },
                },
                '*'
            );
        }
    };



    const menuItems = [
        {
            key: 2,
            name: "Logout",
            disabled: false,
        }
    ]


    const pathWithoutParams = location.pathname.split('?')[0];

    let dropdownItems;

    if (pathWithoutParams === "/posts") {
        dropdownItems = [{
            key: 5,
            name: "Posts",
            value: "posts",
        }];
        setSelected("posts")
    } else if (pathWithoutParams === "/training") {
        dropdownItems = [{
            key: 3,
            name: "Training",
            value: "training",
        }];
        setSelected("training")
    } else if (pathWithoutParams === "/solutions") {
        dropdownItems = [{
            key: 1,
            name: "Solutions",
            value: "solutions",
        }];
        setSelected("solutions")
    } else if (pathWithoutParams === "/services") {
        dropdownItems = [{
            key: 2,
            name: "Services",
            value: "services",
        }];
        setSelected("services")
    } else if (pathWithoutParams === "/talent") {
        dropdownItems = [{
            key: 2,
            name: "Talent",
            value: "talent",
        }];
        setSelected("talent")
    } else {
        dropdownItems = [
            (business || ambassador || admin) && {
                key: 1,
                name: "Solutions",
                value: "solutions",
            },
            (business || ambassador || admin) && {
                key: 2,
                name: "Services",
                value: "services",
            },
            (business || ambassador || admin) && {
                key: 3,
                name: "Training",
                value: "training",
            },
            (business || ambassador || admin) && {
                key: 4,
                name: "Talent",
                value: "talent",
            },
            (professional || business || ambassador || admin) && {
                key: 5,
                name: "Posts",
                value: "posts",
            },
            (professional || ambassador || admin) && {
                key: 6,
                name: "Organisations",
                value: "organisations",
            },
        ].filter(Boolean);
    }





    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: deviceType == "mobile" ? "5px" : '10px',
                paddingTop: '15px',
                backgroundColor: colors.lightPrimary,
                height: "8vh",
                width: '100%'
            }}
        >

            <div style={style}>

                {(deviceType == "mobile") && (<button
                    style={{
                        backgroundColor: "transparent",
                        border: "0px solid transparent",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        setIsOpen(!isOpen)
                    }}>
                    <MenuIcon sx={{ width: '24px', color: colors.primary }} />
                </button>)}
                {(deviceType !== "mobile") && (<Autocomplete
                    id="tags-outlined"
                    options={dropdownItems || []}
                    getOptionLabel={(option: any) => option?.name}
                    size="small"
                    value={dropdownItems?.find((item: any) => item?.value === selected) || null}
                    onChange={(event: any, value: any) => {
                        setSelected(value?.value || null);
                        setQ("");
                    }}
                    filterSelectedOptions
                    renderInput={(params: any) => (
                        <TextField
                            {...params}
                            placeholder={"Select"}
                        />
                    )}
                    sx={{
                        ...style,
                        color: "#000",
                        fontSize: "14px",
                        width: '200px',
                        border: `0px solid ${colors.primary}`,
                        borderRadius: "30px",
                        backgroundColor: "#E6F1EE",
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: colors.primary,
                                borderRadius: "30px",
                                border: `0px solid ${colors.primary}`,
                            },
                            '&:hover fieldset': {
                                borderColor: colors.primary,
                                border: `0px solid ${colors.primary}`,
                                borderRadius: "30px",
                            },
                            '&.Mui-focused fieldset': {
                                border: `0px solid ${colors.primary}`,
                                borderRadius: "30px",
                            },
                        },
                    }}
                />)}

                {(selected && deviceType !== "mobile") && (<Paper
                    component="form"
                    sx={{ p: '2px 4px', borderRadius: "30px", display: 'flex', alignItems: 'center', width: deviceType == "small-tablet" ? "auto" : 200, border: "0px solid transparent", boxShadow: "none", backgroundColor: "#E6F1EE" }}
                >
                    <IconButton type="button" sx={{ p: '5px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                    <input
                        style={{ marginLeft: 1, flex: 1, border: "0px solid transparent", backgroundColor: "transparent", fontSize: "14px", outline: "none", }}
                        placeholder="Global search"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && selected && q) {
                                e.preventDefault();
                                if (selected == "services") {
                                    navigate(`/services?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }
                                if (selected == "solutions") {
                                    navigate(`/solutions?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }
                                if (selected == "posts") {
                                    navigate(`/posts?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }
                                if (selected == "training") {
                                    navigate(`/training?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }
                                if (selected == "talent") {
                                    navigate(`/talent?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }
                                if (selected == "organisations") {
                                    navigate(`/organisations?mysearch=true&&q=${q}`)
                                    setQuery(q)
                                }

                            }
                        }
                        }
                    />

                </Paper>
                )}

                {(selected && q && deviceType !== "mobile") && (<div
                    onClick={(e) => {
                        e.preventDefault();
                        if (selected == "services") {
                            navigate(`/services?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                        if (selected == "solutions") {
                            navigate(`/solutions?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                        if (selected == "posts") {
                            navigate(`/posts?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                        if (selected == "training") {
                            navigate(`/training?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                        if (selected == "talent") {
                            navigate(`/talent?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                        if (selected == "organisations") {
                            navigate(`/organisations?mysearch=true&&q=${q}`)
                            setQuery(q)
                        }
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: '10px',
                        borderRadius: '30px',
                        backgroundColor: colors.primary,
                        color: colors.white,
                        height: '40px',
                        paddingLeft: "15px",
                        paddingRight: '15px',
                        width: "40px"
                    }}>
                    <SearchIcon />
                </div>)}

            </div>
            <div style={style}>
                {(!load) && (<IconButton
                    color="inherit"
                    onClick={handleOpenNotification}
                    style={{ marginTop: '3px' }}
                >
                    {(notifications) && (
                        <Badge
                            badgeContent={notifications?.filter((n: any) => !n?.read).length}
                            color="success"
                            sx={{
                                '& .MuiBadge-badge': {
                                    backgroundColor: colors.primary,
                                    color: colors.white
                                }
                            }}
                        >
                            <NotificationsNoneOutlinedIcon style={{ margin: '5px', fontSize: '25px' }} />
                        </Badge>
                    )}

                </IconButton>)}



                {(!load) && (<Menu
                    anchorEl={anchorEl2}
                    open={open2}
                    onClose={handleClose2}
                    sx={{
                        borderRadius: '10px',
                        width: '400px',
                        flexWrap: 'wrap',
                        boxShadow: 'none',
                        padding: '8px',
                        height: '400px',
                        '& .MuiPaper-root': {
                            minWidth: '250px',
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            backgroundColor: '#fff',

                        },

                    }}
                >
                    <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: colors.primary,
                        fontFamily: "OpenSans",
                        textAlign: "left",
                        padding: '20px',
                        paddingTop: '10px',
                        paddingBottom: '10px'
                    }}>
                        Notifications

                    </div>
                    <Divider sx={{ margin: '8px 0' }} />
                    <MenuList sx={{
                        outline: 'none', borderRadius: '10px', width: '100%', backgroundColor: "transparent", padding: '10px', paddingTop: '10px',
                        height: "200px",
                        overflow: "scroll",
                        scrollbarWidth: "none",
                        '& .MuiPaper-root': {
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '12px',
                            backgroundColor: '#fff',
                            minWidth: '400px',
                            minHeight: '200px',
                            maxHeight: '300px'
                        },
                    }}>

                        {notifications?.length > 0 ? (<div>
                            {notifications?.map((item: any, index: any) => (
                                <MenuItem
                                    key={index}
                                    onClick={
                                        async () => {
                                            setLoad(true);
                                            const a: any = notifications?.map((notification: any, i: any) =>
                                                i === index ? { ...notification, read: true } : notification
                                            )
                                            setNotifications(a)
                                            await handleNotificationNavigation(item, navigation);
                                            setTimeout(() => {
                                                getNotification()
                                            }, 1000)

                                            setLoad(false);
                                            handleClose2();
                                        }
                                    }
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        justifyContent: 'flex-start',
                                        backgroundColor: colors.white,
                                        '&:hover': {
                                            backgroundColor: colors.lightPrimary,
                                        },
                                        padding: '5px',
                                        maxWidth: '100%',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'row', padding: '8px', gap: '10px', alignItems: "center", paddingLeft: '2px', paddingTop: "2px", paddingBottom: '2px', fontSize: '14px', fontFamily: 'OpenSans', width: '100%', }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: colors.lightywhite,
                                                width: '35px',
                                                height: '35px',
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
                                            }}>{item?.posted_by?.charAt(0)}</span>
                                        </Avatar>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: "flex-start", width: '90%', }}>
                                            <p style={{ margin: 0, padding: 0, fontFamily: "OpenSans", fontSize: "12px", fontWeight: 600 }}>{item?.content_type} • <span style={{ fontFamily: "OpenSans", fontSize: "12px", fontWeight: 400 }}>{item?.time_ago}</span></p>
                                            <p style={{ margin: 0, padding: 0, fontFamily: "OpenSans", fontSize: "12px", fontWeight: 400, flexWrap: "wrap", width: '100%', whiteSpace: "pre-wrap" }}> {item?.title}</p>
                                        </div>
                                    </div>

                                </MenuItem>
                            ))}
                        </div>
                        ) : (<div style={{ width: '100%', display: "flex", flexDirection: 'row', justifyContent: "center" }}>
                            <img src={NoData} alt="No Data Available" style={{ width: '100px', height: '100px' }} />
                        </div>)}


                    </MenuList>
                </Menu>)}

                <IconButton
                    onClick={() => { navigate("/settings") }}
                    sx={{
                        bgcolor: isSettingsRoute ? colors.buttonBackground : "transparent",
                        width: '44px',
                        height: '44px',
                        fontFamily: 'OpenSans',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: colors.buttonBackground,
                        },
                    }}
                >
                    <SettingsOutlinedIcon style={styles.buttonStyle} />
                </IconButton>
                <IconButton
                    onClick={handleClick}
                    sx={{
                        bgcolor: isSettingsRoute ? colors.buttonBackground : "transparent",
                        width: '44px',
                        height: '44px',
                        fontFamily: 'OpenSans',
                        cursor: 'pointer',
                        '&:hover': {
                            bgcolor: colors.buttonBackground,
                        },
                    }}
                >
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
                        }}>{name?.charAt(0)}</span>
                    </Avatar>
                </IconButton>


                <Menu
                    id="fade-menu"
                    MenuListProps={{
                        'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Fade}

                    sx={{
                        boxShadow: 'none',
                        '& .MuiPaper-root': {
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '20px',
                            padding: '2px 0',
                            backgroundColor: '#fff',
                            minWidth: '200px',
                        },

                    }}
                >
                    {menuItems.map((item: any, index: number) => (
                        <MenuItem
                            key={index}
                            sx={{
                                borderBottom: index !== menuItems.length - 1 ? `1px solid ${colors.lightPrimaryBorder}` : 'none'
                            }}
                            onClick={() => {
                                if (item.name === 'Logout') {
                                    setLogoutPopup(true);
                                    handleClose();
                                }
                            }}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Menu>


            </div>

            <TSIAlert
                isOpen={logoutpop}
                setIsOpen={setLogoutPopup}
                onSubmit={() => {
                    setLogoutPopup(false);
                    // localStorage.clear(); 
                    localStorage.removeItem("token")
                    localStorage.removeItem("role")
                    localStorage.removeItem("email")
                    localStorage.removeItem("name")
                    navigate("/")
                }}
                title={"Logout"}
                text={"Are you sure you want to logout?"}
                buttonName1={"Cancel"}
                buttonName2={"Yes"}
            />


        </div >
    );
}

export default memo(Header);