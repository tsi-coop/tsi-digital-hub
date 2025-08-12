import { Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../../common/Atoms/TSIButton';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import TSICommunityFilterModal from '../../common/Molecules/TSICommunityFilterModal';
import { NoData } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import TSIPostComment from '../../common/Molecules/TSIPostComment';
import TSICommunityPost from '../../common/Molecules/TSICommunityPost';
import { handlePostNavigation } from '../../../Utils/DetailRouting';
import SyncIcon from '@mui/icons-material/Sync';
const Community = () => {
    const [selectedSort, setSelectedSort] = useState<any>("all");
    const [selectedCards, setSelectedCards] = useState<any>("What's New");
    const [recentDiscussionData, setRecentDiscussionData] = useState([])
    const [open, setOpen] = React.useState(false);
    const [filterOpen, setFilterOpen] = React.useState(false);
    const [filteringList, setFilteringList] = React.useState<any>([]);
    const [load, setLoad] = React.useState(true);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [postView, setPostView] = React.useState(false);
    const [communityData, setCommunityData] = React.useState<any>([]);
    const [discussionData, setDiscussionData] = React.useState([]);
    const anchorRef: any = React.useRef(null);
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType == "small-tablet")
    const [isEditPost, setIsEditPost] = React.useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigation = useNavigate()
    const [loader, setLoader] = useState(false)
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

    function getCookie(name: string): string | undefined {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce<Record<string, string>>((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name];
    }
    const linkPrincipal = async ({ fiduciary_id, consent_id, name, email, mobile }: any) => {
        const url = 'https://dpdp-cms.tsicoop.org/api/consent';

        const requestBody = {
            _func: 'link_principal',
            fiduciary_id,
            consent_id,
            "name": name,
            "email": email,
            mobile,
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            if (data?.principal_id) {
                document.cookie = `principal_id=${data?.principal_id}; path=/; max-age=${60 * 60 * 24 * 365}`;
                localStorage.setItem("principal_id", data?.principal_id);
                localStorage.setItem("is_principalCalled", "true");
            }
            return data; // { principal_id: '...' }
        } catch (error: any) {
            console.log('error:', error);
        }
    }


    const getRecommDiscusData = () => {
        setLoad(true)
        const body = {
            "_func": "get_recommended_discussions"
        }
        apiInstance.getDiscussion(body)
            .then((response: any) => {
                if (response.data) {
                    setRecentDiscussionData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    useEffect(() => {
        const mobile = ""
        const name = localStorage.getItem("name")
        const email = localStorage.getItem("email")
        const consent_id = getCookie('consent_id');
        const fiduciary_id = "bfa42245-214a-45e3-bdb4-53c34404bc62"
        if (localStorage.getItem("principal_id") && !localStorage.getItem("is_principalCalled")) {
            linkPrincipal({ fiduciary_id, consent_id, name, email, mobile })
        }
        getRecommDiscusData()
    }, [])

    useEffect(() => {

        getCommunityData()

    }, [selectedSort, currentPage])

    const getCommunityData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommendations",
            "type": selectedSort,
            "pg": currentPage
        }
        apiInstance.getCommunityApi(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setCommunityData((prev: any) => [...prev, ...response.data]);
                    }

                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }

    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);


    const handleScroll = () => {
        const container = containerRef.current;
        if (container && hasMore && !load && !loader) {
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                setCurrentPage((prev) => prev + 1);
            }
        }
    };

    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", height: "92%", backgroundColor: colors.lightPrimary, }}>
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
                {(deviceType == "mobile") ? (
                    <div style={{ width: '100%', display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", padding: '5px', borderRadius: '24px', height: "100%", backgroundColor: colors.white, }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: selectedCards == "Discussions" ? "row-reverse" : 'row', justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${colors.snowywhite}`, height: '8%' }}>
                            <div
                                onClick={() => { setSelectedCards("What's New") }}
                                style={{
                                    width: selectedCards == "What's New" ? "70%" : "30%",
                                    fontFamily: "OpenSans",
                                    fontSize: selectedCards == "What's New" ? "24px" : "16px",
                                    fontWeight: 600,
                                    lineHeight: "32.68px",
                                    color: selectedCards == "What's New" ? colors.primary : colors.snowywhite,
                                    borderRadius: '24px',
                                    borderBottomLeftRadius: '0px',
                                    borderBottomRightRadius: '0px',
                                    height: '100%',
                                    padding: '8px',
                                    cursor: "pointer",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start'
                                    // backgroundColor: selectedCards == "What's New" ? colors.lightPrimary : colors.white
                                }}>What's New</div>
                            <div
                                onClick={() => { setSelectedCards("Discussions") }}
                                style={{
                                    width: selectedCards == "Discussions" ? "70%" : "30%",
                                    fontFamily: "OpenSans",
                                    fontSize: selectedCards == "Discussions" ? "24px" : "16px",
                                    fontWeight: 600,
                                    color: selectedCards == "Discussions" ? colors.primary : colors.snowywhite,
                                    borderRadius: '24px',
                                    borderBottomLeftRadius: '0px',
                                    borderBottomRightRadius: '0px',
                                    lineHeight: "32.68px",
                                    height: '100%',
                                    padding: '8px',
                                    cursor: "pointer",
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start'
                                    // backgroundColor: selectedCards == "Discussions" ? colors.lightPrimary : colors.white
                                }}>
                                Discussions
                            </div>

                        </div>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", height: '90%' }}>
                            {(selectedCards == "What's New") && (<div style={{
                                width: deviceWidth ? "100%" : '80%'
                                , height: "100%", backgroundColor: colors.white, display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center",
                            }}>


                                {communityData
                                    .length > 0 ? (
                                    <div
                                        ref={containerRef}
                                        onScroll={handleScroll}
                                        style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '80vh', borderRadius: '24px', scrollbarWidth: "none" }}>
                                        {communityData
                                            .map((post: any, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                                >
                                                    <TSICommunityPost
                                                        post={post}
                                                        iscommunity={true}
                                                        isFullText={false}
                                                        setClickedPost={setClickedPost}
                                                        setPostView={setPostView}
                                                        setIsEditPost={setIsEditPost}
                                                        discussionData={discussionData}
                                                        onSubmit={() => { getCommunityData() }}
                                                        isCommentNeeded={false}
                                                    />
                                                </div>
                                            ))}
                                        {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                            <Button sx={{ padding: '10px', }} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                                        </div>)}
                                    </div>) : (
                                    <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '75vh', scrollbarWidth: "none" }}>
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
                            {(selectedCards == "Discussions") && (<div style={{ width: deviceWidth ? "100%" : '40%', height: "100%", borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: "10px", backgroundColor: "#FFF" }}>

                                {(recentDiscussionData?.length > 0) ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none", }}>
                                    {
                                        recentDiscussionData?.map((comment: any, index: number) => {
                                            return (
                                                <div style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }} onClick={() => {
                                                    handlePostNavigation(comment, navigation)
                                                }}>
                                                    <TSIPostComment key={index} comment={comment} reply={false} discussionData={discussionData} callAgain={() => { }} isLaunch={true} />

                                                </div>
                                            )
                                        })
                                    }
                                </div>) : (
                                    <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none", }}>
                                        {(loader) ? (<div className="centered-container">
                                            <div className="loader"></div>
                                        </div>) : (
                                            <img src={NoData} style={{ width: '90%' }} />
                                        )}
                                    </div>
                                )}



                            </div>)}

                        </div>
                    </div>
                ) : (<div style={{ display: 'flex', width: '100%', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', height: deviceWidth ? "auto" : "100%", backgroundColor: colors.lightPrimary, }}>
                    <div style={{
                        width: deviceWidth ? "100%" : '80%'
                        , height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "20px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center",
                    }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: '10px', borderBottom: `1px solid ${colors.snowywhite}` }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "24px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                                color: colors.primary,
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                            }}>What's New</p>
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

                        {communityData
                            .length > 0 ? (
                            <div
                                ref={containerRef}
                                onScroll={handleScroll}
                                style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '80vh', borderRadius: '24px', scrollbarWidth: "none" }}>
                                {communityData
                                    .map((post: any, index: number) => (
                                        <div
                                            key={index}
                                            style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                        >
                                            <TSICommunityPost
                                                post={post}
                                                iscommunity={true}
                                                isFullText={false}
                                                setClickedPost={setClickedPost}
                                                setPostView={setPostView}
                                                setIsEditPost={setIsEditPost}
                                                discussionData={discussionData}
                                                onSubmit={() => { getCommunityData() }}
                                                isCommentNeeded={false}
                                            />
                                        </div>
                                    )
                                    )
                                }
                                {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                    <Button sx={{ padding: '10px', }} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                                </div>)}
                            </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '75vh', scrollbarWidth: "none" }}>
                                <img src={NoData} />
                            </div>
                        )}
                        {(loader) && (<div className="centered-container">
                            <div className="loader"></div>
                        </div>)}

                    </div>
                    <div style={{ width: deviceWidth ? "100%" : '40%', height: "100%", borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: "10px", backgroundColor: "#FFF" }}>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", borderBottom: "1px solid #BEC9C7", padding: "15px", }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                                color: colors.primary,
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                            }}>Active Discussions</p>


                        </div>
                        {(recentDiscussionData?.length > 0) ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none", }}>
                            {
                                recentDiscussionData?.map((comment: any, index: number) => {
                                    return (
                                        <div style={{ width: '100%', display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", cursor: "pointer" }} onClick={() => {
                                            handlePostNavigation(comment, navigation)
                                        }}>
                                            <TSIPostComment key={index} comment={comment} reply={false} discussionData={discussionData} callAgain={() => { }} isLaunch={true} />

                                        </div>
                                    )
                                })
                            }
                        </div>) : (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none", }}>
                                <img src={NoData} style={{ width: '90%' }} />
                            </div>
                        )}



                    </div>
                </div>)}


                {
                    (filterOpen) && (<TSICommunityFilterModal
                        isOpen={filterOpen}
                        setIsOpen={setFilterOpen}
                        filteringList={filteringList}
                        setFilteringList={setFilteringList}
                        onSubmit={() => { }}
                    />)
                }


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

export default Community
