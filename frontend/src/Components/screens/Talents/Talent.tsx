import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { Button, Checkbox, Modal, Typography } from '@mui/material'
import { calender, image, man, NoData, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIButton from '../../common/Atoms/TSIButton';
import TSITextfield from '../../common/Atoms/TSITextfield';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TSISpreadItems from '../../common/Atoms/TSISpreadItems';
import apiInstance from '../../../services/authService';
import TSIAddTalentModal from '../../common/Molecules/TSIAddTalentModal';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSITalentCard from '../../common/Molecules/TSITalentCard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TSISingleDropdown from '../../common/Atoms/TSISingleDropdown';
import CloseIcon from '@mui/icons-material/Close';
import SyncIcon from '@mui/icons-material/Sync';
const Talent = ({ setQuery, query }: any) => {
    const deviceType = useDeviceType()
    const [searchParams] = useSearchParams();
    const search = searchParams.get('mysearch');
    const q = searchParams.get('q');
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [activity, setActivity] = useState<any>("Recent Activity");
    const [talentOpen, setTalentOpen] = useState<any>(false);
    const [open, setOpen] = useState<any>(false);
    const [isTalent, setIsTalent] = useState<any>(false);
    const [talentData, setTalentData] = useState<any>([]);
    const [selectedPost, setSelectedPost] = useState<any>({});
    const [title, setTitle] = useState<any>("");
    const [quer, setQuer] = useState<any>("");
    const [remainAnonomous, setRemainAnonomous] = useState<any>(false);
    const [load, setLoad] = useState<any>(true);
    const [isEnquiry, setIsEnquiry] = useState<any>(false);
    const [talentSorting, setTalentSorting] = useState([
        { value: "Recommended", slug: "recommended" }, search && { value: "My Search", slug: "mysearch" }
        // { value: "My Shortlist", slug: "myshortlist" },
    ])

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
    const navigation = useNavigate()
    const [mysearch, setMysearch] = useState<any>([]);
    const [selectedSort, setSelectedSort] = useState(search ? "mysearch" : "recommended")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const getTalentData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_professionals_by_skills",
            "pg": currentPage
        }
        apiInstance.getTalent(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setTalentData((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
                setLoad(false);
            })
            .catch((error: any) => {
                setLoader(false)
                setLoad(false);
            });
    }

    useEffect(() => {
        getTalentData()
        return () => {
            console.log('Leaving the screen...');
            setQuery("");
            setIsTalent(false)
        };
    }, [currentPage])

    const items: any = ["Auto Loan", "BNPL", "Crop Loan", "MSME Loan"]
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
    const getViewtalentData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_professional",
            "account_slug": "satish2020@gmail.com"

        }
        apiInstance.getTalent(body)
            .then((response: any) => {
                if (response.data) {
                    setSelectedPost(response.data)
                    setIsTalent(!isTalent)
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

    const addEnquiresData = () => {
        setLoad(true)
        // const email: any = localStorage.getItem("email");
        const domain = talentData?.posted_by_account_slug
        // email.split("@")[1];

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": "TALENT",
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

    const getTalentSearchData = () => {
        setLoad(true);
        const body = {
            "_func": "search_professionals",
            "q": q
        }

        apiInstance.getsearchTalent(body)
            .then((response: any) => {
                if (response.data) {
                    setMysearch(response?.data)
                    setTalentSorting([{ value: "Recommended", slug: "recommended" },
                    search && { value: "My Search", slug: "mysearch" }])
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
        const handler = setTimeout(() => {
            if (search) {
                getTalentSearchData();
            }

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
                {(!isTalent) && (<div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>
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
                        }}>Talent</p>
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
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: 'none', }}>

                        {[...talentSorting]?.map((item: any, index: any) => (
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
                    {(selectedSort == "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {talentData.length > 0 ? (<div
                            ref={containerRef}
                            onScroll={handleScroll}
                            style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {talentData
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSITalentCard post={post} onHandleClick={() => navigation(`/talent/postdetails?id=${post?.posted_by_account_slug || ''}`)} />
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
                                    <img src={NoData} />
                                )}
                            </div>
                        )}
                        {(loader) && (<div className="centered-container">
                            <div className="loader"></div>
                        </div>)}
                    </div>)}
                    {(selectedSort == "myshortlist") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {talentData.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {talentData
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSITalentCard post={post} onHandleClick={() => navigation(`/talent/postdetails?id=${post?.posted_by_account_slug || ''}`)} />
                                    </div>
                                ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}

                    {(selectedSort == "mysearch") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                        {mysearch.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none", paddingTop: '10px' }}>
                            {mysearch
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: any) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", }}>
                                        <TSITalentCard post={post} onHandleClick={() => navigation(`/talent/postdetails?id=${post?.posted_by_account_slug || ''}`)} />
                                    </div>
                                ))}
                        </div>
                        ) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                    </div>)}
                </div>)}

                {(isTalent) && (
                    <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>

                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '10px', }}>
                            <button
                                onClick={() => { setIsTalent(!isTalent) }}
                                style={{
                                    padding: 0, margin: 0, fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "20px",
                                    letterSpacing: "0.10000000149011612px",
                                    textAlign: "center",
                                    textTransform: "capitalize",
                                    backgroundColor: "transparent",
                                    border: "0px solid transparent",
                                    cursor: "pointer"
                                }}>
                                <ArrowBackIcon sx={{ width: '20px', height: "20px" }} />
                            </button>

                        </div>

                        <div style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollbarWidth: 'none', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", padding: '10px', paddingLeft: '0px', paddingRight: '0px' }}>
                            <p style={{
                                margin: 0, padding: '0px',
                                paddingLeft: '10px',
                                fontFamily: "OpenSans",
                                fontSize: "24px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                            }}>Talent Detail:- {selectedPost?.name}</p>

                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '10px', gap: '10px' }}>
                                {
                                    [{ icon: calender, name: selectedPost?.start_year }, { icon: man, name: selectedPost?.gender }]?.map((item: any, index: number) => (
                                        <div
                                            key={index}
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: "8px",
                                                backgroundColor: colors.mintWhisper,
                                                color: colors.darkblack,
                                                fontFamily: "OpenSans",
                                                fontSize: "14px",
                                                fontWeight: 400,
                                                lineHeight: "20px",
                                                letterSpacing: "0.16px",
                                                textAlign: "center",
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: '10px'
                                            }}
                                        >
                                            <img src={item?.icon} /> {item?.name}
                                        </div>
                                    ))
                                }
                            </div>
                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%' }}>
                                <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", gap: '10px', width: '70%' }}>
                                    <p style={{
                                        margin: 0,
                                        padding: '0px',
                                        fontFamily: "OpenSans",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        lineHeight: "21.68px",
                                        textAlign: "left",
                                        textUnderlinePosition: "from-font",
                                        textDecorationSkipInk: "none",
                                    }}>{selectedPost?.about}</p>

                                    <div style={grpstyle}>
                                        <p style={titleStyle}>City</p>
                                        <p style={valueStyle}>{selectedPost.city_slug}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>College</p>
                                        <p style={valueStyle}>{selectedPost.college}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Solutions Used</p>
                                        <TSISpreadItems items={items} />
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Services Used</p>
                                        <TSISpreadItems items={selectedPost?.services_interested} />
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Skills Used</p>
                                        <TSISpreadItems items={selectedPost?.skills_interested} />
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Training Used</p>
                                        <TSISpreadItems items={selectedPost?.training_interested} />
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Training Used</p>
                                        <TSISpreadItems items={selectedPost?.training_interested} />
                                    </div>

                                </div>
                                <div style={{
                                    display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: '30%', border: `1px solid ${colors.mediumSnowyWhite}`, borderRadius: '12px', padding: '10px'
                                }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            cursor: 'pointer',
                                            padding: '10px',
                                            borderRadius: '15px',
                                            backgroundColor: isEnquiry ? colors.primary : colors.white,
                                            border: `1px solid ${colors.primary}`,
                                            color: isEnquiry ? colors.white : colors.primary,
                                            fontWeight: 500,
                                            height: '35px',
                                            paddingLeft: "15px",
                                            paddingRight: '15px',
                                            width: "200px"
                                        }}
                                        onClick={() => {
                                            setIsEnquiry(true)
                                        }}
                                    >
                                        Send Enquiry
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                )
                }
                {(talentOpen) && (<TSIAddTalentModal
                    isOpen={talentOpen}
                    setIsOpen={setTalentOpen}
                    onSubmit={() => { setTalentOpen(false); setOpen(true) }}
                    title={"Talent"}
                    tree1Title={"Solution Tags"}
                    tree2Title={"Skills Offered"}
                />)}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Your enquiry created successfully"}
                    buttonName={"Okay"}
                    image={success}
                    onSubmit={() => { setOpen(false) }}
                />
                <Modal
                    open={isEnquiry}
                    onClose={() => { setIsEnquiry(false); }}
                    sx={{
                        border: "0px solid transparent"
                    }}
                >
                    <div style={style}>
                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '10px', width: '100%', padding: '10px',
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
                                fieldvalue={"Talent"}
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
                                    name={"Submit"}
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

export default Talent
