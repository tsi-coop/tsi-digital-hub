import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { calender, cityB, enqB, enqW, image, man, NoData, pzW, success } from '../../../assets';
import TSICard from '../../common/Molecules/TSICard';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Avatar, Button, Checkbox, Modal, Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SyncIcon from '@mui/icons-material/Sync';
const Solutions = ({ setQuery, query }: any) => {
    const deviceType = useDeviceType()
    const [searchParams] = useSearchParams();
    const search = searchParams.get('mysearch');
    const q = searchParams.get('q');
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [load, setLoad] = useState(true)
    const [clickedPost, setClickedPost] = useState<any>({});
    const [solutioneditOpen, setSolutionEditOpen] = useState<any>({});
    const [solutions, setSolutions] = useState<any>([]);
    const [recommSolutions, setRecommSolutions] = useState<any>([]);
    const [mysearch, setMysearch] = useState<any>([]);
    const navigation = useNavigate()
    const [solutionsSorting, setSolutionsSorting] = useState([
        { value: "Recommended", slug: "recommended" }, { value: "My Solutions", slug: "mysolutions" }, search && { value: "My Search", slug: "mysearch" }
    ])
    const [selectedSort, setSelectedSort] = useState(search ? "mysearch" : "recommended")
    const role = localStorage.getItem("role");
    const business = role === "BUSINESS";
    const admin = role === "ADMIN";
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hasMore, setHasMore] = useState(true);
    const anchorRef: any = React.useRef(null);
    const [open, setOpen] = React.useState(false);
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
    const getSolutionsData = () => {
        setLoad(true)
        const body = {
            "_func": "get_provider_solutions"
        }

        apiInstance.getSolutions(body)
            .then((response: any) => {
                if (response.data) {
                    setSolutions(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecommSolutionsData = () => {

        setLoader(true)
        const body = {
            "_func": "get_recommended_solutions",
            "pg": currentPage
        }

        apiInstance.getSolutions(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setRecommSolutions((prev: any) => [...prev, ...response.data]);
                    }
                }

                setLoader(false)
            })
            .catch((error: any) => {

                setLoader(false)
            });
    }

    useEffect(() => {
        getRecommSolutionsData()
    }, [currentPage])


    useEffect(() => {
        setLoad(true)
        getSolutionsData()
        return () => {
            console.log('Leaving the screen...');
            setQuery("");

        };
        setLoad(false)
    }, [])



    const getSolutionSearchData = () => {
        setLoad(true);
        const body = {
            "_func": "search_solutions",
            "q": q
        }

        apiInstance.getsearchSolutions(body)
            .then((response: any) => {
                if (response.data) {
                    setMysearch(response?.data)
                    setSelectedSort("mysearch")
                    setSolutionsSorting([{ value: "Recommended", slug: "recommended" }, { value: "My Solutions", slug: "mysolutions" }, q && { value: "My Search", slug: "mysearch" }])
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
                getSolutionSearchData();
            }

            setLoad(false)
        }, 500);

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
                        }}>Solutions</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>

                            {(business || admin) && (<Button
                                onClick={() => { navigation(`/pZone?sel=solutions`) }}
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
                                />  Provider Zone
                            </Button>)}
                        </div>

                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: "none" }}>

                        {[...solutionsSorting]?.map((item: any, index: any) => (
                            <div
                                key={index}
                                onClick={() => { setSelectedSort(item?.slug) }}
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
                    {(selectedSort === "mysolutions") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {solutions.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {solutions
                                // ?.slice().sort((a: any, b: any) => (
                                //     activity === "Recent Activity"
                                //         ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                //         : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                // ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard post={post} type={"solution"} setClickedPost={setClickedPost} onHandleClick={() => { navigation(`/solutions/details?id=${post?.id}`) }} setIsEditPost={setSolutionEditOpen} onEditClick={() => { navigation(`/solutions/details?id=${post?.id}`) }} />
                                    </div>
                                ))}


                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>
                    )}
                    {(selectedSort === "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {recommSolutions.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {recommSolutions
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard post={post} type={"solution"} setClickedPost={setClickedPost} onHandleClick={() => { navigation(`/solutions/details?id=${post?.id}`) }} setIsEditPost={setSolutionEditOpen} onEditClick={() => { navigation(`/solutions/details?id=${post?.id}`) }} />
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
                    </div>
                    )}

                    {(selectedSort === "mysearch") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {mysearch.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {mysearch
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSICard post={post} type={"solution"} setClickedPost={setClickedPost} onHandleClick={() => { navigation(`/solutions/details?id=${post?.id}`) }} setIsEditPost={setSolutionEditOpen} onEditClick={() => { }} />
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

export default Solutions
