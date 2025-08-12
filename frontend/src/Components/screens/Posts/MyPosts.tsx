import { Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react'
import AddIcon from '@mui/icons-material/Add';
import useDeviceType from '../../../Utils/DeviceType';
import TSIPosts from '../../common/Molecules/TSIPosts';
import TSIButton from '../../common/Atoms/TSIButton';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import TSIAddPost from '../../common/Molecules/TSIAddPost';
import { commentLoad, NoData } from '../../../assets';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SyncIcon from '@mui/icons-material/Sync';
const MyPosts = ({ setQuery, query }: any) => {
    const [activity, setActivity] = useState<any>("Recent Activity");
    const [searchParams] = useSearchParams();
    const search = searchParams.get('mysearch');
    const q = searchParams.get('q');
    const [postSorting, setPostSorting] = useState([
        { value: "Recommended", slug: "recommended" }, { value: "My Posts", slug: "myposts" }, search && { value: "My Search", slug: "mysearch" }
    ])
    const [selectedSort, setSelectedSort] = useState(search ? "mysearch" : "recommended")
    const [open, setOpen] = React.useState(false);
    const [addpostOpen, setAddpostOpen] = React.useState(false);
    const [load, setLoad] = React.useState(true);
    const [clickedPost, setClickedPost] = React.useState<any>({});
    const [iseditPost, setIsEditPost] = React.useState<any>(false);
    const [postView, setPostView] = React.useState(false);
    const [myPostsData, setMyPostsData] = React.useState<any>([]);
    const [recommPostsData, setRecommPostsData] = React.useState<any>([]);
    const [mysearch, setMysearch] = React.useState<any>([]);
    const [discussionData, setDiscussionData] = React.useState([]);
    const deviceType = useDeviceType()
    const navigate = useNavigate()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [selectedindSolutions, setSelectedindSolutions] = React.useState<any>([]);
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


    const getPostSearchData = () => {
        setLoad(true);
        const body = {
            "_func": "search_posts",
            "q": q
        }

        apiInstance.getsearchPost(body)
            .then((response: any) => {
                if (response.data) {
                    setMysearch(response.data)
                    setPostSorting([{ value: "Recommended", slug: "recommended" }, { value: "My Posts", slug: "myposts" }, query && { value: "My Search", slug: "mysearch" }])
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
        getRecommPostsData()
    }, [currentPage])
    useEffect(() => {
        getMyPostsData()

        return () => {
            console.log('Leaving the screen...');
            setQuery("");
        };
    }, [])




    useEffect(() => {
        setLoad(true)
        const handler = setTimeout(() => {

            if (search) {
                getPostSearchData();
            }

            setLoad(false)
        }, 500);

        return () => clearTimeout(handler);
    }, [q])




    const getMyPostsData = () => {
        setLoad(true)
        const body = {
            "_func": "get_my_posts"
        }
        apiInstance.getPosts(body)
            .then((response: any) => {
                if (response.data) {
                    setMyPostsData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getRecommPostsData = () => {
        setLoader(true)
        const body = {
            "_func": "get_recommended_posts",
            "pg": currentPage
        }
        apiInstance.getPosts(body)
            .then((response: any) => {
                if (response.data) {
                    if (response.data.length === 0) {
                        setHasMore(false);
                    } else {
                        if (response.data.length < 5) {
                            setHasMore(false);
                        }
                        setRecommPostsData((prev: any) => [...prev, ...response.data]);
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
                        }}>Posts</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>



                            <TSIButton
                                name={"New Post"}
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
                                        setAddpostOpen(true)
                                    }
                                }
                            />
                        </div>

                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", gap: '20px', alignItems: "flex-end", borderBottom: `1px solid ${colors.snowywhite}`, overflowX: "scroll", scrollbarWidth: "none" }}>

                        {[...postSorting]?.map((item: any, index: any) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedSort(item?.slug)
                                }}
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


                    {(selectedSort == "myposts") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {myPostsData.length > 0
                            ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                                {myPostsData
                                    .map((post: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (post) {
                                                    navigate(`/posts/postdetails?id=${post.id}`)
                                                }
                                            }}

                                            style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                        >
                                            <TSIPosts
                                                post={post}
                                                iscommunity={false}
                                                isFullText={true}
                                                setClickedPost={setClickedPost}
                                                setPostView={setPostView}
                                                setIsEditPost={setIsEditPost}
                                                discussionData={discussionData}
                                                onSubmit={() => { getMyPostsData() }}
                                                isCommentNeeded={false}
                                            />
                                        </div>
                                    )
                                    )
                                }
                            </div>) : (
                                <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "center", alignItems: "center", gap: '10px', paddingTop: '2px', height: '80vh', scrollbarWidth: "none" }}>
                                    <img src={NoData} />
                                </div>
                            )}
                    </div>)}
                    {(selectedSort == "recommended") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {recommPostsData.length > 0
                            ? (<div
                                ref={containerRef}
                                onScroll={handleScroll}
                                style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                                {recommPostsData
                                    .map((post: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                if (post) {
                                                    navigate(`/posts/postdetails?id=${post.id}`)
                                                }
                                            }}

                                            style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                        >
                                            <TSIPosts
                                                post={post}
                                                iscommunity={true}
                                                isFullText={true}
                                                setClickedPost={setClickedPost}
                                                setPostView={setPostView}
                                                setIsEditPost={setIsEditPost}
                                                discussionData={discussionData}
                                                onSubmit={() => { getMyPostsData() }}
                                                isCommentNeeded={false}
                                            />
                                        </div>
                                    ))
                                }
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
                    {(selectedSort === "mysearch") && (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", gap: '10px', paddingTop: '10px', height: '80vh', scrollbarWidth: "none" }}>
                        {mysearch.length > 0 ? (<div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "center", height: '80vh', scrollbarWidth: "none" }}>
                            {mysearch
                                ?.slice().sort((a: any, b: any) => (
                                    activity === "Recent Activity"
                                        ? new Date(b?.posted ?? 0).getTime() - new Date(a?.posted ?? 0).getTime()
                                        : new Date(a?.posted ?? 0).getTime() - new Date(b?.posted ?? 0).getTime()
                                ))
                                .map((post: any, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            if (post) {
                                                navigate(`/posts/postdetails?id=${post.id}`)
                                            }
                                        }}

                                        style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}
                                    >
                                        <TSIPosts
                                            post={post}
                                            iscommunity={false}
                                            isFullText={true}
                                            setClickedPost={setClickedPost}
                                            setPostView={setPostView}
                                            setIsEditPost={setIsEditPost}
                                            discussionData={discussionData}
                                            onSubmit={() => { getMyPostsData() }}
                                            isCommentNeeded={false}
                                        />
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
                    (addpostOpen) && (<TSIAddPost
                        isOpen={addpostOpen}
                        edit={false}
                        editablePost={clickedPost}
                        selectedindSolutions={selectedindSolutions}
                        setSelectedindSolutions={setSelectedindSolutions}
                        setIsOpen={setAddpostOpen}
                        onSubmit={() => { getMyPostsData(); getRecommPostsData() }}
                    />)
                }

                {
                    (iseditPost) && (<TSIAddPost
                        isOpen={iseditPost}
                        edit={true}
                        editablePost={clickedPost}
                        selectedindSolutions={selectedindSolutions}
                        setSelectedindSolutions={setSelectedindSolutions}
                        setIsOpen={setIsEditPost}
                        onSubmit={() => { getMyPostsData(); getRecommPostsData() }}
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

export default MyPosts
