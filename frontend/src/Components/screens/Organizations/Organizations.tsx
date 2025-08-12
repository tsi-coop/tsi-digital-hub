import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import TSIMessage from '../../common/Molecules/TSIMessage';
import TSIOrgCard from '../../common/Molecules/TSIOrgCard';
import apiInstance from '../../../services/authService';
import { Button, Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIJobAddModal from '../../common/Molecules/TSIJobAddModal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SyncIcon from '@mui/icons-material/Sync';
const Organisations = ({ setQuery, query }: any) => {
    const deviceType = useDeviceType()
    const [searchParams] = useSearchParams();
    const search = searchParams.get('mysearch');
    const q = searchParams.get('q');
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [jobOpen, setJobOpen] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [isEnquirySubmitted, setIsEnquirySubmitted] = useState<any>(false);
    const [isRejection, setRejection] = useState<any>(false);
    const [isMessage, setIsMessage] = useState<any>(false);
    const [organisations, setOrganisations] = useState<any>([]);
    const [mysearch, setMysearch] = useState<any>([]);
    const [orgSorting, setOrgSorting] = useState([
        { value: "Recommended", slug: "recommended" },
        search && { value: "My search", slug: "mysearch" },
    ])
    const [selectedSort, setSelectedSort] = useState(search ? "mysearch" : "recommended")
    const [load, setLoad] = useState<any>(true);
    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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



    const getRecommandedOrgData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_organizations_by_skills",
            "pg": currentPage
        }
        apiInstance.getRecomOrgSkills(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setOrganisations((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }



    useEffect(() => {
        // setLoad(true)
        getRecommandedOrgData()
        return () => {
            console.log('Leaving the screen...');
            setQuery("");
            // setLoad(false)
        };
    }, [currentPage])


    const getOrgSearchData = () => {
        setLoad(true);
        const body = {
            "_func": "search_organizations",
            "q": q
        }

        apiInstance.getsearchorg(body)
            .then((response: any) => {
                if (response.data) {
                    setMysearch(response?.data)
                    setOrgSorting([{ value: "Recommended", slug: "recommended" }, query && { value: "My Search", slug: "mysearch" }])
                    setSelectedSort("mysearch")
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
        setLoad(true)
        const handler = setTimeout(() => {

            if (search) {
                getOrgSearchData()
            }
        }, 500);
        setLoad(false)
        return () => clearTimeout(handler);
    }, [q])


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
                        }}>Organizations</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>

                        </div>

                    </div>

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: "none" }}>

                        {[...orgSorting]?.map((item: any, index: any) => (
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
                                    cursor: 'pointer',
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}
                    </div>


                    {(selectedSort == "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '5px', height: '80vh', scrollbarWidth: "none" }}>
                        {organisations.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {organisations.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIOrgCard post={post} onHandleClick={() => { navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`) }} />
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

                    {(selectedSort == "myshortlist") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '5px', height: '80vh', scrollbarWidth: "none" }}>
                        {organisations.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {organisations.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIOrgCard post={post} onHandleClick={() => { navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`) }} />
                                </div>
                            ))}  </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}



                    {(selectedSort == "mysearch") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '5px', height: '80vh', scrollbarWidth: "none" }}>
                        {mysearch.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {mysearch.map((post: any, index: any) => (
                                <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                    <TSIOrgCard post={post} onHandleClick={() => {
                                        // viewOrgData(post?.posted_by_account_slug)
                                        navigation(`/organisations/postdetails?id=${post?.posted_by_account_slug}`)
                                    }} />
                                </div>
                            ))}  </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}

                </div>


                {
                    (jobOpen) && (<TSIJobAddModal
                        isOpen={jobOpen}
                        setIsOpen={setJobOpen}
                        onSubmit={() => { setJobOpen(false); setOpen(true) }}
                        modaltitle={"Jobs"}
                        tree1Title={"Solutions"}
                        tree2Title={"Services"}
                        tree3Title={"Skills"}
                    />)
                }

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Your account created successfully"}
                    buttonName={"Go to Home"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
                <TSIConfirmationModal
                    open={isRejection}
                    title={"Reject Application"}
                    desc={"Are you sure you want to reject this application?"}
                    buttonName1={"No"}
                    buttonName2={"Yes, Reject"}
                    btn2Color={colors.saturatedRed}
                    onClick={() => { setRejection(false) }}
                />



                <TSIMessage
                    open={isMessage}
                    setIsOpen={setIsMessage}
                    title={"Invite Discussion"}
                    buttonName2={"Send"}
                    btn2Color={colors.primary}
                    onClick={() => { }}
                />

                <TSIPopup
                    isOpen={isEnquirySubmitted}
                    setIsOpen={setIsEnquirySubmitted}
                    text1={"Success"}
                    text2={"Submited successfully"}
                    buttonName={"Go to Home"}
                    image={success}
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

export default Organisations
