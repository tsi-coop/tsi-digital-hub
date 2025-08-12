import { Avatar, Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../../common/Atoms/TSIButton';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import { calender, cityB, man, NoData } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import TSIAddMeetupPost from '../../common/Molecules/TSIAddMeetupPost';
import TSIMeetupPost from '../../common/Molecules/TSIMeetupPost';
import SyncIcon from '@mui/icons-material/Sync';

const Meetups = ({ setData }: any) => {
    const [discussionData, setDiscussionData] = React.useState([])
    const [selectedSort, setSelectedSort] = useState<any>("recommended");
    const [open, setOpen] = React.useState(false);
    const [addmeetupOpen, setAddMeetupOpen] = React.useState(false);
    const [load, setLoad] = React.useState(true);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [iseditPost, setIsEditPost] = React.useState<any>(false);
    const [myRecommandData, setMyRecommandData] = React.useState<any>([]);
    const [myPostsData, setMyPostsData] = React.useState<any>([]);
    const [meetupSorting, setMeetupSorting] = React.useState([
        { value: "Recommended", slug: "recommended" }, { value: "My Meetups", slug: "mymeetups" }
    ]);
    const deviceType = useDeviceType()
    const navigate = useNavigate()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedindSolutions, setSelectedindSolutions] = React.useState<any>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    useEffect(() => {
        getMyPostsData()

    }, [])

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


    useEffect(() => {
        getRecomData()
    }, [currentPage])



    const getMyPostsData = () => {
        setLoad(true)
        const body = {
            "_func": "get_my_meetups"
        }
        apiInstance.getMeetupApi(body)
            .then((response: any) => {
                if (response.data) {
                    setMyPostsData(response.data)
                    setData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }


    const getRecomData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_meetups",
            "pg": currentPage
        }
        apiInstance.getMeetupApi(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setMyRecommandData((prev: any) => [...prev, ...response.data]);
                    }
                }
                setLoader(false)
            })
            .catch((error: any) => {
                setLoader(false)
            });
    }

    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', height: "92%", backgroundColor: colors.lightPrimary }}>
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
                <div style={{
                    width: "100%"
                    // deviceWidth ? "100%" : '80%'
                    , height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", paddingTop: '5px', display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center",
                }}>


                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", padding: '10px', alignItems: "center", flexWrap: "wrap", }}>


                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>Meetups</p>
                        <TSIButton
                            name={"New Meetup"}
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
                                    setAddMeetupOpen(true)
                                }
                            }
                        />
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: "none" }}>

                        {[...meetupSorting]?.map((item: any, index: any) => (
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
                                    borderBottom: item?.slug == selectedSort ? (`2px solid ${colors.primary}`) : (`0px solid ${colors.primary}`)
                                }}>
                                {item?.value}
                            </div>
                        ))}
                    </div>
                    {(selectedSort === "mymeetups") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {selectedSort === "mymeetups" && myPostsData?.filter((post: any) => selectedSort === "mymeetups").length > 0 ? (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                                {myPostsData.map((post: any, index: number) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <TSIMeetupPost
                                            post={post}
                                            setClickedPost={setClickedPost}
                                            setIsEditPost={setIsEditPost}
                                            onHandleClick={() => navigate(`/meetup/detail?id=${post?.id}`)}
                                            discussionData={discussionData}
                                            onSubmit={getMyPostsData}
                                            isEditable={true}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : selectedSort === "mymeetups" && (
                            <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                <img src={NoData} alt="No Data Available" />
                            </div>
                        )}
                    </div>)}
                    {(selectedSort === "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {selectedSort === "recommended" && myRecommandData?.filter((post: any) => selectedSort === "recommended").length > 0 ? (
                            <div
                                ref={containerRef}
                                onScroll={handleScroll}
                                style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                                {myRecommandData.map((post: any, index: number) => (
                                    <div key={index} style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                                        <TSIMeetupPost
                                            post={post}
                                            setClickedPost={setClickedPost}
                                            setIsEditPost={setIsEditPost}
                                            onHandleClick={() => navigate(`/meetup/detail?id=${post?.id}`)}
                                            discussionData={discussionData}
                                            onSubmit={getMyPostsData}
                                            isEditable={false}
                                        />
                                    </div>
                                ))}
                                {(hasMore) && (<div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center", gap: '5px', scrollbarWidth: "none", }}>
                                    <Button sx={{ padding: '10px', }} onClick={() => { setCurrentPage(currentPage + 1) }}><SyncIcon sx={{ color: colors.primary }} /></Button>
                                </div>)}
                            </div>
                        ) : selectedSort === "recommended" && (
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
                </div>






                {(iseditPost) && (<TSIAddMeetupPost
                    isOpen={iseditPost}
                    edit={true}
                    editablePost={clickedPost}
                    selectedindSolutions={selectedindSolutions}
                    setSelectedindSolutions={setSelectedindSolutions}
                    setIsOpen={setIsEditPost}
                    onSubmit={() => { getMyPostsData() }}
                />)}

                {(addmeetupOpen) && (<TSIAddMeetupPost
                    isOpen={addmeetupOpen}
                    edit={false}
                    editablePost={clickedPost}
                    selectedindSolutions={selectedindSolutions}
                    setSelectedindSolutions={setSelectedindSolutions}
                    setIsOpen={setAddMeetupOpen}
                    onSubmit={() => { getMyPostsData() }}
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

export default Meetups
