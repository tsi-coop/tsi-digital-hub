import React, { useCallback, useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Checkbox, Modal, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { calender, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import TSITextfield from '../../common/Atoms/TSITextfield';
import apiInstance from '../../../services/authService';
import TSITestimonialAddModal from '../../common/Molecules/TSITestimonialAddModal';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSITestiCard from '../../common/Molecules/TSITestiCard';
import { useNavigate } from 'react-router-dom';
import SyncIcon from '@mui/icons-material/Sync';
const Testimonial = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedSort, setSelectedSort] = useState<any>("recommended");
    const [testimonialOpen, setTestimonialOpen] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [isTestimonial, setIsTestimonial] = useState<any>(false);
    const [testimonialReceivedData, setTestimonialReceivedData] = useState<any>([]);
    const [testimonialSentData, setTestimonialSentData] = useState<any>([]);
    const [testimonialRecommData, setTestimonialRecommData] = useState<any>([]);
    const [testimoniaViewData, setTestimonialViewData] = useState<any>([]);
    const [title, setTitle] = useState<any>("");
    const [query, setQuery] = useState<any>("");
    const [remainAnonomous, setRemainAnonomous] = useState<any>(false);
    const [isEnquiry, setIsEnquiry] = useState(false)
    const [fileData, setFileData] = useState<any>([]);
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

    const [load, setLoad] = useState(true)
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
    const navigation = useNavigate()

    const getViewTestimonialData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_testimonial",
            "id": id
        }
        apiInstance.viewTestimonial(body)
            .then((response: any) => {
                if (response.data) {
                    setIsTestimonial(!isTestimonial)
                    setTestimonialViewData(response.data)
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

    const getTestimonialData = () => {
        setLoad(true)
        const body = {
            "_func": "get_received_testimonials"
        }


        apiInstance.getReceivedTestimonials(body)
            .then((response: any) => {
                if (response.data) {
                    setTestimonialReceivedData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecommTestimonialData = () => {
        setLoad(true)
        const body = {
            "_func": "get_recommended_testimonials",
            "pg": currentPage
        }


        apiInstance.getReceivedTestimonials(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setTestimonialRecommData((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getSentTestimonialData = () => {
        setLoad(true)
        const body = {
            "_func": "get_sent_testimonials"
        }

        apiInstance.getSentTestimonials(body)
            .then((response: any) => {
                if (response.data) {
                    setTestimonialSentData(response?.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    useEffect(() => {
        getRecommTestimonialData()
    }, [currentPage])

    useEffect(() => {
        getTestimonialData()
        getSentTestimonialData()

    }, [])


    const handleFileChange = useCallback(
        (name: string, imageUrl: string, file: any) => {
            if (file) {
                setFileData((prevData: any) => ({
                    ...prevData,
                    [name]: { file: file, imageUrl },
                }));
            } else {
                setFileData((prev: any) => {
                    delete prev[name];
                    return prev;
                });
                console.error('No file selected');
            }
        },
        []
    );
    const addEnquiresData = () => {
        setLoad(true)
        // const email: any = localStorage.getItem("email");
        // const domain = email.split("@")[1];
        const domain = testimoniaViewData?.posted_by_account_slug

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": "TESTIMONIAL",
            "title": title,
            "query": query,
            "to_businesses": [domain],
            "to_professionals": [],
            "discoverable": 1,
            "anonymous": remainAnonomous ? 1 : 0,
            "taxonomies_offered": []

        }

        apiInstance.addEnquires(body)
            .then((response: any) => {
                if (response.data._added) {
                    setTitle("")
                    setQuery("")
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Enquires added successfull",
                    })


                    setIsEnquiry(false)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Enquires is unsuccesfull",
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
                        }}>Testimonial</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>

                            {/* <TSIButton
                                name={"Add New"}
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
                                        setTestimonialOpen(true)
                                    }
                                }
                            /> */}
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
                                    color: colors.brownCharcoal,
                                    cursor: "pointer",
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}


                    </div>
                    {(selectedSort == "sent") && (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: '100%', overflowY: 'scroll', scrollbarWidth: "none" }}>
                        {testimonialSentData.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {testimonialSentData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSITestiCard post={post} onHandleClick={() => { navigation(`/testimonial/postdetails?id=${post?.id}`) }} />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}
                    {(selectedSort == "received") && (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: '100%', overflowY: 'scroll', scrollbarWidth: "none", }}>
                        {testimonialReceivedData.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {testimonialReceivedData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSITestiCard post={post} onHandleClick={() => { navigation(`/testimonial/postdetails?id=${post?.id}`) }} />
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>
                    )}
                    {(selectedSort == "recommended") && (<div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: '100%', overflowY: 'scroll', scrollbarWidth: "none", }}>
                        {testimonialRecommData.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {testimonialRecommData.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSITestiCard post={post} onHandleClick={() => { navigation(`/testimonial/postdetails?id=${post?.id}`) }} />
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
                    </div>
                    )}
                </div>


                <Modal
                    open={isEnquiry}
                    onClose={() => { setIsEnquiry(false); }}
                    sx={{
                        border: "0px solid transparent"
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: deviceType == "mobile" ? "75%" : '33%',
                        padding: deviceType == "mobile" ? "15px" : "2%",
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: colors.white,
                        border: '0px solid #000',
                        borderRadius: '16px',
                        fontFamily: 'OpenSans',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: '100%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '12px', padding: '10px',
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                lineHeight: "28px",
                                letterSpacing: "0.5px",
                                textAlign: "left",
                                color: colors.black,
                                margin: 0,
                                padding: 0
                            }}>
                                Send Enquiry
                            </p>
                            <TSITextfield
                                title={"Title"}
                                placeholder={"Enter Title"}
                                value={title}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                handleChange={(event: any) => { setTitle(event.target.value) }}
                            />
                            <TSITextfield
                                title={"Query"}
                                placeholder={"Enter Query"}
                                value={query}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                rows={4}
                                handleChange={(event: any) => { setQuery(event.target.value) }}
                            />
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "flex-start",
                                    gap: '20px',
                                    width: '100%',
                                }}
                            >
                                <Checkbox
                                    checked={remainAnonomous}
                                    onChange={(event) => { setRemainAnonomous(event.target.checked); }}
                                    sx={{
                                        '&.Mui-checked': {
                                            color: colors.primary,
                                        },
                                    }}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "16px",
                                    fontWeight: 600,
                                    lineHeight: "25.2px",
                                    textAlign: "left",
                                    color: colors.black
                                }}>
                                    Remain Anonymous?

                                </span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: '100%' }}>
                                <TSIButton
                                    name={"Submit"}
                                    disabled={!title || !query}
                                    variant={'contained'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                    load={false}
                                    isCustomColors={true}
                                    customOutlineColor={`1px solid ${colors.primary}`}
                                    customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                    customBgColorOnhover={colors.primary}
                                    customBgColor={colors.primary}
                                    customTextColorOnHover={colors.white}
                                    customTextColor={colors.white}
                                    handleClick={
                                        () => {
                                            if (title && query) {
                                                addEnquiresData()
                                            } else if (!title) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Title is Required",
                                                })
                                            } else if (!title) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Query is Required",
                                                })
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Modal>

                {
                    (testimonialOpen) && (<TSITestimonialAddModal
                        isOpen={testimonialOpen}
                        setIsOpen={setTestimonialOpen}
                        onSubmit={() => {
                            getTestimonialData()
                            getSentTestimonialData()
                        }}
                        modaltitle={"Enquiries"}
                        tree1Title={"Enquiries Tags"}
                        tree2Title={"Skills Offered"}
                        isSolutionScreen={false}
                        isServiceScreen={false}
                        isTrainingScreen={false}
                        isTestimonialTagsneeded={true}
                    />)
                }

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Testimonial created successfully"}
                    buttonName={"Okay"}
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

export default Testimonial
