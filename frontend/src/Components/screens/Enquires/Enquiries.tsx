import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import AddIcon from '@mui/icons-material/Add';
import { NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import TSIEnquiryAddModal from '../../common/Molecules/TSIEnquiryAddModal';
import apiInstance from '../../../services/authService';
import { Button, Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIEnqCard from '../../common/Molecules/TSIEnqCard';
import { useNavigate } from 'react-router-dom';
import SyncIcon from '@mui/icons-material/Sync';
const Enquiries = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedSort, setSelectedSort] = useState<any>("recommended");
    const [enquiriesOpen, setEnquiriesOpen] = useState<any>(false);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [iseditPost, setIsEditPost] = React.useState<any>(false);
    const [sentEnquires, setSentEnquires] = useState<any>([])
    const [recEnquires, setRecEnquires] = useState<any>([])
    const [recomdEnquires, setRecomdEnquires] = useState<any>([])
    const [open, setOpen] = useState<any>(false);
    const navigation = useNavigate()
    const [load, setLoad] = useState(true)
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
    };
    const sortItems = [
        { value: "Recommended", slug: "recommended" },
        { value: "Received", slug: "received" },
        { value: "Sent", slug: "sent" },
    ];


    const getEnquiresData = () => {
        setLoad(true)
        const body = {
            "_func": "get_sent_enquiries"
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data) {
                    setSentEnquires(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecEnquiresData = () => {
        setLoad(true)
        const body = {
            "_func": "get_received_enquiries"
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data) {
                    setRecEnquires(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecomEnquiresData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_enquiries",
            "pg": currentPage
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setRecomdEnquires((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }

    useEffect(() => {
        getRecomEnquiresData()
    }, [currentPage])

    useEffect(() => {
        getEnquiresData()
        getRecEnquiresData()

    }, [])



    const cancelEnquires = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "cancel_enquiry",
            "id": id
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data?._cancelled) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "cancelled successfully",
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message || "Something went wrong",
                })
            });
    }



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
                        }}>Enquiries</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>

                            <TSIButton
                                name={"Send Enquiry"}
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
                                        setEnquiriesOpen(true)
                                    }
                                }
                            />
                        </div>

                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "center", flexWrap: "wrap", borderBottom: `1px solid ${colors.snowywhite}`, }}>

                        {sortItems?.map((item, index) => (
                            <div
                                key={index}
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
                    {(selectedSort == "received") && (<div style={{ width: deviceWidth ? "100%" : '100%', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {recEnquires.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {recEnquires.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIEnqCard post={post}
                                        setClickedPost={setClickedPost}
                                        setIsEditPost={setIsEditPost}
                                        onHandleClick={() => { navigation(`/enquiries/postdetails?id=${post?.id}`) }} onDelete={() => { cancelEnquires(post?.id) }} isEditable={false} />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}
                    {(selectedSort == "recommended") && (<div style={{ width: deviceWidth ? "100%" : '100%', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {recomdEnquires.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {recomdEnquires.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIEnqCard
                                        post={post}
                                        setClickedPost={setClickedPost}
                                        setIsEditPost={setIsEditPost}
                                        onHandleClick={() => { navigation(`/enquiries/postdetails?id=${post?.id}`) }} onDelete={() => { cancelEnquires(post?.id) }} isEditable={false} />
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
                    {(selectedSort == "sent") && (<div style={{ width: deviceWidth ? "100%" : '100%', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", overflowY: 'scroll', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {sentEnquires.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {sentEnquires.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIEnqCard post={post}
                                        setClickedPost={setClickedPost}
                                        setIsEditPost={setIsEditPost}
                                        onHandleClick={() => { navigation(`/enquiries/postdetails?id=${post?.id}`) }} onDelete={() => { cancelEnquires(post?.id) }} isEditable={false} />
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


                {(enquiriesOpen) && (<TSIEnquiryAddModal
                    isOpen={enquiriesOpen}
                    setIsOpen={setEnquiriesOpen}
                    editablePost={clickedPost}
                    onSubmit={() => {
                        setEnquiriesOpen(false); setOpen(true)
                        getEnquiresData()
                        getRecEnquiresData()
                    }}
                    modaltitle={"Enquiry"}
                    isEnqScreen={true}
                />)}

                {(iseditPost) && (<TSIEnquiryAddModal
                    isOpen={iseditPost}
                    edit={true}
                    editablePost={clickedPost}
                    setIsOpen={setIsEditPost}
                    onSubmit={() => {
                        setEnquiriesOpen(false); setOpen(true)
                        getEnquiresData()
                        getRecEnquiresData()
                    }}
                    modaltitle={"Enquiry"}
                />)}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Your account created successfully"}
                    buttonName={"Go to Home"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
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

export default Enquiries
