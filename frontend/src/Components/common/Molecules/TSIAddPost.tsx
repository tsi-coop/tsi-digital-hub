import { List, ListItem, ListItemText, Collapse, IconButton, Switch, Checkbox, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { CollapsibleTree } from '../Atoms/CollapsibleList';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { CollapsibleTree2 } from '../Atoms/CollapsibleList2';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import TSIEditor from '../Atoms/TSIEditor';
const TSIAddPost = ({
    isOpen,
    edit,
    setIsOpen,
    editablePost,
    onSubmit,
    selectedindSolutions,
    setSelectedindSolutions,
}: any) => {
    const deviceType = useDeviceType()
    const [type, setType] = useState("")
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [load, setLoad] = useState(false)
    const [openIndustrySolutions, setOpenIndustrySolutions] = useState(true)
    const [openServices, setOpenServices] = useState(true)
    const [openTraining, setOpenTraining] = useState(true)
    const [openSkills, setOpenSkills] = useState(true)
    const [preview, setPreview] = useState(false)
    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([])
    const [openAllIndustrySolutions, setOpenAllIndustrySolutions] = useState(true)
    const [allindustrySolutionsData, setAllIndustrySolutionsData] = useState<any>([])
    const [communityData, setCommunityData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])
    const [viewData, setViewData] = useState<any>([])
    const [skillData, setSkillData] = useState<any>([])
    const [trainingData, setTrainingData] = useState<any>([])
    const [postLink, setPostLink] = useState<any>("")
    const [id, setId] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
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
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    console.log("editablePost", editablePost)
    const getData = (body: any, setState: any) => {
        setLoad(true);

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setState(response.data);
                }
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                setLoad(false);
            });
    };
    const fetchData = (body: object, setData: React.Dispatch<React.SetStateAction<any>>, successMessage: string = "") => {
        setLoad(true);
        apiInstance.getGetOptions(body)
            .then((response: any) => {
                setLoad(false);
                if (response.status === 200 && response.data) {
                    setData(response.data);
                    if (successMessage) {
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: successMessage,
                        });
                    }
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response.data?.code || "Something went wrong",
                    });
                }
            })
            .catch((error: any) => {
                setLoad(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error?.message || "Something went wrong",
                });
            });
    };

    useEffect(() => {
        getIndustrySolutions()
        getServices()
        getSkills()
        getTraining()
        fetchData({ "_func": "get_all_industry_solutions_tree" }, setAllIndustrySolutionsData);
        getData({ "_func": "lookup", "type": "POST_TYPE" }, setCommunityData);
        if (edit) {
            getViewData()
            setSelectedindSolutions(editablePost?.taxonomies_offered || [])
        } else {
            setSelectedindSolutions([])
        }
    }, [])
    const handleaddPost = () => {
        setLoad(true)
        const getSlugByValue = (value: string) => {
            const item = communityData.find((item: any) => item.value === value);
            return item ? item?.slug : null;
        };

        const body = {
            "_func": "add_post",
            "post_type": getSlugByValue(type),
            "title": title,
            "content": content,
            "source_link": postLink,
            "taxonomies_offered": selectedindSolutions
        }
        const editbody = {
            "_func": "edit_post",
            "id": id,
            "post_type": type,
            "title": title,
            "content": content,
            "source_link": postLink,
            "taxonomies_offered": selectedindSolutions
        }

        apiInstance.getPosts(edit ? editbody : body)
            .then((response: any) => {
                if (edit) {
                    if (response?.data?.edited) {
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: `${type?.toUpperCase()} post edited`,
                        })
                        setTimeout(() => {
                            setIsOpen(false)
                            onSubmit()
                        }, 1000)

                    } else {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: "Something went wrong",
                        })
                    }
                }
                else if (response?.data?.added) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: `${type?.toUpperCase()} post added`,
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                        onSubmit()
                    }, 1000)

                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong",
                    })
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error.message,
                })
            });
    }

    const getViewData = () => {
        setLoad(true)
        const body = {
            "_func": "view_post",
            "id": editablePost?.id
        }
        apiInstance.getPosts(body)
            .then((response: any) => {
                if (response.data) {
                    setViewData(response.data)
                    setType(response.data?.type)
                    setTitle(response.data?.title)
                    setContent(response.data?.content || response.data?.content_brief)
                    setId(editablePost?.id)
                    setPostLink(response.data?.source_link)
                    setSelectedindSolutions(response.data?.taxonomies_offered || [])
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getTraining = () => {
        setLoad(true)
        const body = {
            "_func": "get_trainings_tree"
        }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setTrainingData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getSkills = () => {
        setLoad(true)
        const body = { "_func": "get_skills_tree" }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setSkillData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getIndustrySolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_general_it_solutions_tree"

        }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setIndustrySolutionsData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getServices = () => {
        setLoad(true)
        const body = { "_func": "get_services_tree" }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setServicesData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "50%" : deviceType == "tablet" ? "45%" : '45%',
        height: '80%',
        padding: "0px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '24px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

    const disabled = !title || !content || !type || !(selectedindSolutions?.length > 0)

    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false); }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        width: '100%',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                        height: '10%',
                        padding: '20px'
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "24px",
                        fontWeight: 600,
                        textAlign: "left",
                    }}>
                        {edit ? "Edit" : "New"} Post
                    </span>
                    <button onClick={() => { setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                    </button>

                </div>

                {(!load) ? (

                    (!preview) ? (<div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            width: '100%',
                            padding: '30px',
                            overflowY: "scroll",
                            scrollbarWidth: 'none',
                            height: '80%'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                width: '100%',
                                gap: '20px',
                            }}
                        >
                            <TSISingleDropdown
                                name={"Type"}
                                setFieldValue={setType}
                                fieldvalue={type || ""}
                                isRequired={true}
                                previewMode={edit}
                                dropdown={communityData.map((item: any) => item.value)}
                            />
                            <TSITextfield
                                title={`Title`}
                                placeholder={`Enter Title`}
                                value={title}
                                type={"text"}
                                name={"field"}
                                isRequired={true}
                                multiline={false}
                                rows={1}
                                previewMode={edit}
                                handleChange={(event: any) => { setTitle(event.target.value) }}
                            />

                            <TSIEditor
                                title={`Content`}
                                placeholder={`Enter Content`}
                                content={content}
                                setContent={setContent}
                                isRequired={true}
                                maxLength={1000}
                            />

                            <TSITextfield
                                title={"Post Link"}
                                placeholder={"Enter Training Link"}
                                value={postLink}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setPostLink(event.target.value) }}
                            />

                        </div>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: 'center',
                                width: '100%',
                                marginTop: '20px',
                            }}
                        >
                            <span style={{
                                fontSize: "18px",
                                fontWeight: 700
                            }}>{"Choose relevant tags "}<span style={{ color: colors.black, marginLeft: "2px" }}>*</span></span>
                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                <ListItem sx={{
                                    pl: 2, borderRadius: "5px",
                                    padding: "0px",
                                    borderBottomLeftRadius: openAllIndustrySolutions ? "0px" : "5px",
                                    borderBottomRightRadius: openAllIndustrySolutions ? "0px" : "5px",
                                    width: '100%',
                                    '& .css-10b8wcc-MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .css-1wg5ebk-MuiList-root': {
                                        padding: "0px",
                                        paddingBottom: '0px',
                                        borderRadius: "5px",
                                    },
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                            <ListItemText primary={"Industry Solutions"} />
                                            <IconButton onClick={() => { setOpenAllIndustrySolutions(!openAllIndustrySolutions) }}>
                                                {openAllIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div>

                                    </div>
                                </ListItem>
                                <Collapse in={openAllIndustrySolutions} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                    <CollapsibleTree2
                                        data={allindustrySolutionsData}
                                        selectedItems={selectedindSolutions}
                                        setSelectedItems={setSelectedindSolutions}
                                    />
                                </Collapse>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>


                                <ListItem sx={{
                                    pl: 2, borderRadius: "5px",
                                    padding: "0px",
                                    borderBottomLeftRadius: openIndustrySolutions ? "0px" : "5px",
                                    borderBottomRightRadius: openIndustrySolutions ? "0px" : "5px",
                                    width: '100%',
                                    '& .css-10b8wcc-MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .css-1wg5ebk-MuiList-root': {
                                        padding: "0px",
                                        paddingBottom: '0px',
                                        borderRadius: "5px",
                                    },
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                            <ListItemText primary={"Solutions "} />
                                            <IconButton onClick={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}>
                                                {openIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div>
                                        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', backgroundColor: colors.lightPrimary, border: `1px solid ${colors.snowywhite}`, borderTopLeftRadius: '5px', borderTopRightRadius: "5px", borderBottomLeftRadius: openIndustrySolutions ? "0px" : '5px', borderBottomRightRadius: openIndustrySolutions ? "0px" : '5px', }}>
                                            <Checkbox
                                                checked={selectedindSolutions?.length > 0 ? true : false}
                                                onChange={() => { }}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: colors.graniteGrey,
                                                    },
                                                }}
                                            />
                                            <ListItemText primary={"Industry Solutions "} />
                                            <IconButton onClick={() => { setOpenIndustrySolutions(!openIndustrySolutions) }}>
                                                {openIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div> */}
                                    </div>
                                </ListItem>
                                <Collapse in={openIndustrySolutions} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", borderRadius: '5px' }} timeout="auto" unmountOnExit>
                                    <CollapsibleTree2
                                        data={industrySolutionsData}
                                        selectedItems={selectedindSolutions}
                                        setSelectedItems={setSelectedindSolutions}
                                    />
                                </Collapse>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                <ListItem sx={{
                                    pl: 2, borderRadius: "5px",
                                    padding: "0px",
                                    borderBottomLeftRadius: openServices ? "0px" : "5px",
                                    borderBottomRightRadius: openServices ? "0px" : "5px",
                                    width: '100%',
                                    '& .css-10b8wcc-MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .css-1wg5ebk-MuiList-root': {
                                        padding: "0px",
                                        paddingBottom: '0px',
                                        borderRadius: "5px",
                                    },
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                            <ListItemText primary={"Services "} />
                                            <IconButton onClick={() => { setOpenServices(!openServices) }}>
                                                {openServices ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div>

                                    </div>
                                </ListItem>
                                <Collapse in={openServices} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                    <CollapsibleTree2
                                        data={servicesData}
                                        selectedItems={selectedindSolutions}
                                        setSelectedItems={setSelectedindSolutions}
                                    />
                                </Collapse>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                <ListItem sx={{
                                    pl: 2, borderRadius: "5px",
                                    padding: "0px",
                                    borderBottomLeftRadius: openTraining ? "0px" : "5px",
                                    borderBottomRightRadius: openTraining ? "0px" : "5px",
                                    width: '100%',
                                    '& .css-10b8wcc-MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .css-1wg5ebk-MuiList-root': {
                                        padding: "0px",
                                        paddingBottom: '0px',
                                        borderRadius: "5px",
                                    },
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                            <ListItemText primary={"Training "} />
                                            <IconButton onClick={() => { setOpenTraining(!openTraining) }}>
                                                {openTraining ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div>

                                    </div>
                                </ListItem>
                                <Collapse in={openTraining} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                    <CollapsibleTree2
                                        data={trainingData}
                                        selectedItems={selectedindSolutions}
                                        setSelectedItems={setSelectedindSolutions}
                                    />
                                </Collapse>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                <ListItem sx={{
                                    pl: 2, borderRadius: "5px",
                                    padding: "0px",
                                    borderBottomLeftRadius: openSkills ? "0px" : "5px",
                                    borderBottomRightRadius: openSkills ? "0px" : "5px",
                                    width: '100%',
                                    '& .css-10b8wcc-MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .MuiListItem-root': {
                                        padding: "0px",
                                        paddingBottom: '0px'
                                    },
                                    '& .css-1wg5ebk-MuiList-root': {
                                        padding: "0px",
                                        paddingBottom: '0px',
                                        borderRadius: "5px",
                                    },
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%', }}>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                            <ListItemText primary={"Skills "} />
                                            <IconButton onClick={() => { setOpenSkills(!openSkills) }}>
                                                {openSkills ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </div>

                                    </div>
                                </ListItem>
                                <Collapse in={openSkills} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                    <CollapsibleTree2
                                        data={skillData}
                                        selectedItems={selectedindSolutions}
                                        setSelectedItems={setSelectedindSolutions}
                                    />
                                </Collapse>
                            </div>

                        </div>
                    </div>) : (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                width: '100%',
                                padding: '30px',
                                gap: '5px',
                                overflowY: "scroll",
                                scrollbarWidth: 'none',
                                height: '80%'
                            }}
                        >
                            <div style={grpstyle}>
                                <p style={titleStyle}>Type</p>
                                <p style={valueStyle}>{type}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>Title</p>
                                <p style={valueStyle}>{title}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Content</p>
                                <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{content}</p>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Post Link</p>
                                <p style={{
                                    ...valueStyle,
                                    wordBreak: "break-all",
                                    whiteSpace: "normal"
                                }}>
                                    {postLink}
                                </p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>{`Tags`}</p>
                                <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", }}>
                                    <TSISpreadItems items={selectedindSolutions || []} />

                                </div>
                            </div>


                        </div>
                    )

                ) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "flex-end",
                        width: '100%',
                        borderTop: `1px solid ${colors.snowywhite}`,
                        height: 'auto',
                        gap: '20px',
                        padding: '15px'
                    }}
                >
                    {preview && (
                        <TSIButton
                            name={"Edit"}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover={colors.white}
                            customBgColor={colors.white}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    setPreview(!preview)
                                }
                            }
                        />)}
                    <TSIButton
                        name={!preview ? "Preview" : "Save"}
                        variant={'contained'}
                        padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                        load={load}
                        isCustomColors={true}
                        customOutlineColor={`1px solid ${colors.primary}`}
                        customOutlineColorOnHover={`1px solid ${colors.primary}`}
                        customBgColorOnhover={colors.primary}
                        customBgColor={colors.primary}
                        customTextColorOnHover={colors.white}
                        customTextColor={colors.white}
                        handleClick={
                            () => {
                                const requiredFields = [
                                    title, content, type, postLink, selectedindSolutions?.length > 0
                                ];

                                if (requiredFields.some(field => !field)) {
                                    setSnackbar({
                                        open: true,
                                        severity: "error",
                                        message: "All fields are required!"
                                    });
                                    return;
                                }
                                preview ? handleaddPost() : setPreview(true);
                            }
                        }
                    />
                </div>
            </div>
        </Modal >
    )
}

export default TSIAddPost
