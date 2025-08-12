import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Avatar, Button, Checkbox, Modal, Typography } from '@mui/material'
import { calender, cityB, image, man, NoData, pzB, pzW, success } from '../../../assets';
import TSICard from '../../common/Molecules/TSICard';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import apiInstance from '../../../services/authService';
import TSITextfield from '../../common/Atoms/TSITextfield';
import TSIAddServicesModal from '../../common/Molecules/TSIAddServicesModal';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TSIRFPAddModal from '../../common/Molecules/TSIRFPAddModal';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
import TSITestimonialAddModal from '../../common/Molecules/TSITestimonialAddModal';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';

const Services = ({ setQuery, query }: any) => {
    const deviceType = useDeviceType()
    const [searchParams] = useSearchParams();
    const search = searchParams.get('mysearch');
    const q = searchParams.get('q');
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [activity, setActivity] = useState<any>("Recent Activity");
    const [servicesOpen, setServicesOpen] = useState<any>(false);
    const [isServices, setIsServices] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [services, setServices] = useState<any>([]);
    const [recomservices, setRecomServices] = useState<any>([]);
    const [mysearch, setMysearch] = useState<any>([]);
    const [servicesSorting, setServicesSorting] = useState([
        { value: "Recommended", slug: "recommended" }, { value: "My Services", slug: "myservices" }, search && { value: "My Search", slug: "mysearch" }
    ])
    const navigation = useNavigate()
    const [selectedSort, setSelectedSort] = useState(search ? "mysearch" : "recommended")
    const [servicesEditOpen, setServicesEditOpen] = useState<any>(false);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [serviceData, setServiceData] = useState<any>({});
    const [title, setTitle] = useState<any>("");
    const [quer, setQuer] = useState<any>("");
    const [remainAnonomous, setRemainAnonomous] = useState<any>(false);
    const [isEnquiry, setIsEnquiry] = React.useState<any>(false);
    const [isRfp, setIsRFP] = React.useState<any>(false);
    const [isTestimonial, setIsTestimonial] = React.useState<any>(false);
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
    const [load, setLoad] = useState(true)
    const role = localStorage.getItem("role");
    const business = role === "BUSINESS";
    const admin = role === "ADMIN";

    const getServicesData = () => {
        setLoad(true)
        const body = {
            "_func": "get_provider_services"
        }

        apiInstance.getServices(body)
            .then((response: any) => {
                if (response.data) {
                    setServices(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecomServicesData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_services",
            "pg": currentPage
        }

        apiInstance.getServices(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setRecomServices((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }
    useEffect(() => {
        getRecomServicesData()
    }, [currentPage])
    useEffect(() => {
        getServicesData()

        return () => {
            console.log('Leaving the screen...');
            setQuery("");
            setIsServices(false)
        };
    }, [])


    const addEnquiresData = () => {
        setLoad(true)
        // const email: any = localStorage.getItem("email");
        const domain = serviceData?.posted_by_account_slug
        // email.split("@")[1];

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": "SERVICE",
            "title": title,
            "query": quer,
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
                    setQuer("")
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

    const getServicesSearchData = () => {
        setLoad(true);
        const body = {
            "_func": "search_services",
            "q": q
        }

        apiInstance.getsearchServices(body)
            .then((response: any) => {
                if (response.data) {
                    setMysearch(response?.data)
                    setSelectedSort("mysearch")
                    setServicesSorting([{ value: "Recommended", slug: "recommended" }, { value: "My Services", slug: "myservices" }, q && { value: "My Search", slug: "mysearch" }])
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };
    useEffect(() => {
        const handler = setTimeout(() => {
            if (search) {
                getServicesSearchData();
            }
            if (query.length < 3 && query.length > 0) {
                getServicesData()
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query, q])



    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '33%',
        padding: deviceType == "mobile" ? "15px" : "1%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: '0px solid #000',
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };


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
                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", gap: '10px' }}>
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
                        }}>Services</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>



                            {(business || admin) && (<Button
                                onClick={() => { navigation(`/pZone?sel=services`) }}
                                sx={{
                                    gap: "2px",
                                    borderRadius: "100px",
                                    fontFamily: "OpenSans",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    lineHeight: "20px",
                                    textAlign: "center",
                                    color: colors.white,
                                    backgroundColor: colors.primary,
                                    width: "auto",
                                    height: "35px",
                                    padding: "10px",
                                    border: `1px solid ${colors.snowywhite}`,
                                }}
                            >

                                <img
                                    src={pzW}
                                    style={{ width: '24px', height: '24px', marginRight: '5px' }}
                                />
                                Provider Zone
                            </Button>)}
                        </div>

                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: "none" }}>

                        {[...servicesSorting]?.map((item: any, index: any) => (
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
                                    height: '40px',
                                    cursor: "pointer",
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}
                    </div>

                    {(selectedSort === "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {recomservices.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {recomservices
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard key={index} type={"service"} post={post} onHandleClick={() => { navigation(`/services/details?id=${post?.id}`) }} setClickedPost={setClickedPost} setIsEditPost={setServicesEditOpen} onEditClick={() => { navigation(`/services/details?id=${post?.id}`) }} />
                                    </div>
                                ))}
                            {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                <Button sx={{ padding: '10px', }} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                            </div>)}

                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                {(loader) ? (<div className="centered-container">
                                    <div className="loader"></div>
                                </div>) : (
                                    <img src={NoData} />
                                )}
                            </div>
                        )}
                        {(loader) && (<div className="centered-container">
                            <div className="loader"></div>
                        </div>)}
                    </div>)}
                    {(selectedSort === "myservices") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {services.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {services
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard key={index} type={"service"} post={post} onHandleClick={() => { navigation(`/services/details?id=${post?.uuid}`) }} setClickedPost={setClickedPost} setIsEditPost={setServicesEditOpen} onEditClick={() => { navigation(`/services/details?id=${post?.uuid}`) }} />
                                    </div>
                                ))}


                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}


                    {(selectedSort === "mysearch") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {mysearch.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {mysearch
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard post={post} type={"solution"} setClickedPost={setClickedPost} onHandleClick={() => { navigation(`/services/details?id=${post?.id}`) }} setIsEditPost={setServicesEditOpen} onEditClick={() => { navigation(`/services/details?id=${post?.id}`) }} />
                                    </div>
                                ))}


                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>
                    )}
                </div>



                {
                    (servicesOpen) && (<TSIAddServicesModal
                        isOpen={servicesOpen}
                        setIsOpen={setServicesOpen}
                        edit={false}
                        editablePost={clickedPost}
                        onSubmit={() => { setServicesOpen(false); setOpen(true) }}
                        title={"Services"}
                    />)
                }

                {
                    (servicesEditOpen) && (<TSIAddServicesModal
                        isOpen={servicesEditOpen}
                        setIsOpen={setServicesEditOpen}
                        edit={true}
                        editablePost={clickedPost}
                        onSubmit={() => { setServicesEditOpen(false); setOpen(true) }}
                        title={"Services"}
                    />)
                }

                <Modal
                    open={isEnquiry}
                    onClose={() => { setIsEnquiry(false); }}
                    sx={{
                        border: "0px solid transparent"
                    }}
                >
                    <div style={{ ...style, }}>
                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '20px', width: '100%', padding: '10px',
                        }}>
                            <div style={{
                                display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: '100%',
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
                                <button onClick={() => { setIsEnquiry(false) }} style={{ width: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>
                            </div>

                            <TSISingleDropdown
                                name={"Enquiry Type"}
                                setFieldValue={() => { }}
                                fieldvalue={"Service"}
                                previewMode={true}
                                dropdown={[]}
                            />
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
                                value={quer}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                rows={4}
                                handleChange={(event: any) => { setQuer(event.target.value) }}
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
                                    name={"Send"}
                                    disabled={!title || !quer}
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
                                            if (title && quer) {
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

                {(isRfp) && (<TSIRFPAddModal
                    isOpen={isRfp}
                    setIsOpen={setIsRFP}
                    onSubmit={() => { setIsRFP(false); setOpen(true) }}
                    modaltitle={"RFP"}
                    isRFPScreen={false}
                    isSolutionScreen={false}
                    isServiceScreen={true}
                    isTrainingScreen={false}
                />)}


                {(isTestimonial) && (<TSITestimonialAddModal
                    isOpen={isTestimonial}
                    setIsOpen={setIsTestimonial}
                    onSubmit={() => {

                    }}
                    modaltitle={"Enquiries"}
                    tree1Title={"Enquiries Tags"}
                    tree2Title={"Skills Offered"}
                    discoverable={1}
                    isSolutionScreen={false}
                    isServiceScreen={true}
                    isTrainingScreen={false}
                />)}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Submited successfully"}
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

export default Services
