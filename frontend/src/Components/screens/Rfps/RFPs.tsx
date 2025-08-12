import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Checkbox, Modal, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { calender, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIButton from '../../common/Atoms/TSIButton';
import TSIRFPCard from '../../common/Molecules/TSIRFPCard';
import TSIRFPAddModal from '../../common/Molecules/TSIRFPAddModal';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import SyncIcon from '@mui/icons-material/Sync';
import { useNavigate } from 'react-router-dom';
const RFPS = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedSort, setSelectedSort] = useState<any>("recommended");
    const [rfpsOpen, setrfpsOpen] = useState<any>(false);
    const [load, setLoad] = useState(true)
    const [open, setOpen] = useState<any>(false);
    const [rfpSentData, setRFPSentData] = useState<any>([])
    const [rfpReceivedData, setRFPReceivedData] = useState<any>([])
    const [rfpRecommData, setRFPRecommData] = useState<any>([])
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [rfpEditOpen, setRfpEditOpen] = useState<any>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasMore, setHasMore] = useState(true);
    const anchorRef: any = React.useRef(null);
    const [loader, setLoader] = useState(false)
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    const handleScroll = () => {
        const container = containerRef.current;
        if (container && hasMore && !load) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const sortItems = [
        { value: "Recommended", slug: "recommended" },
        { value: "Received", slug: "received" },
        { value: "Sent", slug: "sent" },
    ];
    const grpstyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: '100%',
        gap: '5px'
    }
    const titleStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const valueStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }

    const getRFPReceievedData = () => {
        setLoad(true)
        const body = {
            "_func": "get_received_rfps"
        }

        apiInstance.getRFPs(body)
            .then((response: any) => {
                if (response.data) {
                    setRFPReceivedData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRFPSentData = () => {
        setLoad(true)
        const body = {
            "_func": "get_sent_rfps"
        }

        apiInstance.getRFPs(body)
            .then((response: any) => {
                if (response.data) {
                    setRFPSentData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }
    const getRFPRecommData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_rfps",
            "pg": currentPage
        }

        apiInstance.getRFPs(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setRFPRecommData((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }

    useEffect(() => {
        getRFPRecommData()
    }, [currentPage])

    useEffect(() => {
        getRFPReceievedData()
        getRFPSentData()

    }, [])

    const navigation = useNavigate()



    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '92%' }}>
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
                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: '10px', }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>RFPs</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>

                            <TSIButton
                                name={"Send RFP"}
                                disabled={false}
                                variant={'contained'}
                                padding={"5px 10px"}
                                load={false}
                                leadingIcon={<AddIcon sx={{ width: "20px" }} />}
                                isCustomColors={true}
                                customOutlineColor={`0px solid ${colors.snowywhite}`}
                                customOutlineColorOnHover={`0px solid ${colors.snowywhite}`}
                                customBgColorOnhover={colors.primary}
                                customBgColor={colors.primary}
                                customTextColorOnHover={colors.white}
                                customTextColor={colors.white}
                                handleClick={
                                    () => {
                                        setrfpsOpen(true)
                                    }
                                }
                            />
                        </div>

                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${colors.snowywhite}`, }}>

                        {sortItems?.map((item, index) => (
                            <div
                                onClick={() => { setSelectedSort(item.slug) }}
                                style={{
                                    margin: 0, padding: 8,
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "20px",
                                    textAlign: "left",
                                    textUnderlinePosition: "from-font",
                                    textDecorationSkipInk: "none",
                                    textTransform: 'capitalize',
                                    cursor: "pointer",
                                    color: colors.brownCharcoal,
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}


                    </div>

                    {(selectedSort == "received") && (<div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none" }}>
                        {rfpReceivedData.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {rfpReceivedData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIRFPCard post={post} onHandleClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} setClickedPost={setClickedPost} setIsEditPost={setRfpEditOpen} onEditClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} isCommentDisplay={true} isEditable={false} />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}

                    {(selectedSort == "recommended") && (<div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none" }}>
                        {rfpRecommData.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {rfpRecommData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIRFPCard post={post} onHandleClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} setClickedPost={setClickedPost} setIsEditPost={setRfpEditOpen} onEditClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} isCommentDisplay={true} isEditable={false} />
                                </div>
                            ))}
                            {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                <Button sx={{ padding: '10px', }} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                            </div>)}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                {(loader) ? (<div className="centered-container">
                                    <div className="loader"></div>
                                </div>) : (
                                    <img src={NoData} alt="No Data Available" />
                                )}
                            </div>
                        )}
                        {(loader) && (<div className="centered-container">
                            <div className="loader"></div>
                        </div>)}
                    </div>)}

                    {(selectedSort == "sent") && (<div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none" }}>
                        {rfpSentData.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {rfpSentData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIRFPCard post={post} onHandleClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} setClickedPost={setClickedPost} setIsEditPost={setRfpEditOpen} onEditClick={() => { navigation(`/rfps/postdetails?id=${post?.id}`) }} isCommentDisplay={true} />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}
                </div>


                {(rfpsOpen) && (<TSIRFPAddModal
                    isOpen={rfpsOpen}
                    setIsOpen={setrfpsOpen}
                    isEdit={false}
                    editablePost={clickedPost}
                    onSubmit={() => { setrfpsOpen(false); setOpen(true) }}
                    modaltitle={"RFP"}
                    isRFPScreen={true}
                    isSolutionScreen={false}
                    isServiceScreen={false}
                    isTrainingScreen={false}
                />)}

                {(rfpEditOpen) && (<TSIRFPAddModal
                    isOpen={rfpEditOpen}
                    setIsOpen={setRfpEditOpen}
                    isEdit={true}
                    editablePost={clickedPost}
                    onSubmit={() => { setRfpEditOpen(false); setOpen(true) }}
                    modaltitle={"RFP"}
                    isRFPScreen={true}
                    isSolutionScreen={false}
                    isServiceScreen={false}
                    isTrainingScreen={false}
                />)}


            </div >
        )
    }
    else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default RFPS
