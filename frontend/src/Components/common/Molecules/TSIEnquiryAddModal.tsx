import { Checkbox, Collapse, IconButton, ListItem, ListItemText, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSIDropdown from '../Atoms/TSIDropdown';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import TSISwitch from '../Atoms/TSISwitch';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { CollapsibleTree } from '../Atoms/CollapsibleList';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const TSIEnquiryAddModal = ({
    isOpen,
    setIsOpen,
    editablePost,
    edit = false,
    onSubmit,
    modaltitle,
    isEnqScreen = false
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [query, setQuery] = useState(edit ? editablePost?.query : "")
    const [title, setTitle] = useState(edit ? editablePost?.title : "")
    const [type, setType] = useState("")
    const [preview, setPreview] = useState(false)
    const [remainAnonomous, setRemainAnonomous] = React.useState(false);
    const [makeItDiscourable, setMakeItDiscourable] = React.useState(false);
    const [enquiryTags, setEnquiryTags] = React.useState<any>([]);
    const [selectedenquiryTags, setSelectedEnquiryTags] = React.useState<any>([]);
    const [openEnquiry, setOpenEnquiry] = React.useState<any>([]);
    const [provider, setProvider] = useState("")

    const [openIndustrySolutions, setOpenIndustrySolutions] = useState(true)
    const [openServices, setOpenServices] = useState(true)
    const [openTraining, setOpenTraining] = useState(true)
    const [openSkills, setOpenSkills] = useState(true)
    const [openAllIndustrySolutions, setOpenAllIndustrySolutions] = useState(true)
    const [allindustrySolutionsData, setAllIndustrySolutionsData] = useState<any>([])
    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])
    const [skillData, setSkillData] = useState<any>([])
    const [trainingData, setTrainingData] = useState<any>([])
    const [enqTypes, setEnqTypes] = useState([])
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

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


    const getViewEnquiryData = () => {
        setLoad(true)
        const body = {
            "_func": "view_enquiry",
            "id": editablePost.id
        }

        apiInstance.getEnquires(body)
            .then((response: any) => {
                if (response.data) {
                    setTitle(response.data?.title)
                    setQuery(response.data?.query)
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
    const getData = () => {
        setLoad(true);
        const body = {
            "_func": "lookup",
            "type": "ENQUIRY_TYPE"
        }

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setEnqTypes(response.data);
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
        getData()
        getIndustrySolutions()
        getServices()
        getSkills()
        getTraining()
        fetchData({ "_func": "get_all_industry_solutions_tree" }, setAllIndustrySolutionsData)
        if (edit) {
            getViewEnquiryData()
        }
    }, [])

    const addEnquiresData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email");
        const domain = email.split("@")[1];

        const body = {
            "_func": "add_enquiry",
            "enquiry_type": type,
            "title": title,
            "query": query,
            "to_businesses": [domain],
            "to_professionals": [],
            "discoverable": isEnqScreen ? 1 : type == "SOLUTION" ? 0 : 1,
            "anonymous": remainAnonomous ? 1 : 0,
            "taxonomies_offered": selectedenquiryTags,

        }

        apiInstance.addEnquires(body)
            .then((response: any) => {
                if (response.data._added) {
                    setTitle("")
                    setQuery("")
                    setType("")
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Enquires added successfull",
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 1000)


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

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : '50%', height: '80%',
        padding: deviceType == "mobile" ? "15px" : "20px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

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


    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false); setPreview(false) }}
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

                {(!load) ? (
                    <div
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                width: '100%',
                                borderBottom: `1px solid ${colors.snowywhite}`,
                                height: '8%'
                            }}
                        >
                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "25px",
                                fontWeight: 400,
                                textAlign: "left",
                            }}>
                                {!preview ? `${edit ? "Edit" : "Send"} ${modaltitle}` : "Preview"}
                            </span>
                            <button onClick={() => { setPreview(false); setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>

                        </div>
                        {(!preview) && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    padding: '15px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '20px',
                                }}
                            >

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '100%',
                                    }}
                                >
                                    <TSITextfield
                                        title={`Title`}
                                        placeholder={`Enter ${title} Title`}
                                        value={title}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setTitle(event.target.value) }}
                                    />

                                    <TSISingleDropdown
                                        name={"Type"}
                                        setFieldValue={setType}
                                        isRequired={true}
                                        fieldvalue={type}
                                        dropdown={enqTypes?.map((item: any, index: any) => item.value)}
                                    />




                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '20px',
                                        width: '100%',
                                    }}
                                >
                                    <TSITextfield
                                        title={"Query"}
                                        placeholder={"Enter Query"}
                                        value={query}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        multiline={true}
                                        maxLength={1000}
                                        rows={3}
                                        handleChange={(event: any) => { setQuery(event.target.value) }}
                                    />

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: "flex-start",
                                            gap: '5px',
                                            width: '100%',
                                        }}
                                    >
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
                                        {/* <div
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
                                                    checked={makeItDiscourable}
                                                    onChange={(event) => { setMakeItDiscourable(event.target.checked); }}
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
                                                    Make it discoverable
                                                </span>
                                            </div> */}


                                    </div>



                                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: "100%" }}>


                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                                <ListItem sx={{
                                                    pl: 2, borderRadius: "5px",
                                                    padding: "0px",
                                                    borderBottomLeftRadius: "5px",
                                                    borderBottomRightRadius: "5px",
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
                                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', paddingBottom: '10px' }}>
                                                            <span style={{
                                                                fontFamily: "OpenSans",
                                                                fontSize: "16px",
                                                                fontWeight: 600,
                                                                lineHeight: "24px",
                                                                letterSpacing: "0.5px",
                                                                textAlign: "left",
                                                            }}>{"Recommended Providers"}</span>

                                                        </div>

                                                    </div>
                                                </ListItem>
                                                <Collapse in={true} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px" }} timeout="auto" unmountOnExit>
                                                    <CollapsibleTree
                                                        data={providersData}
                                                        selectedItems={provider}
                                                        setSelectedItems={setProvider}
                                                    />
                                                </Collapse>
                                            </div>
                                        </div> */}




                                </div>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: "flex-start",
                                        justifyContent: 'center',
                                        width: '100%',
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
                                                    <ListItemText primary={"Industry Solutions "} />
                                                    <IconButton onClick={() => { setOpenAllIndustrySolutions(!openAllIndustrySolutions) }}>
                                                        {openAllIndustrySolutions ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                </div>

                                            </div>
                                        </ListItem>
                                        <Collapse in={openAllIndustrySolutions} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", borderRadius: '5px' }} timeout="auto" unmountOnExit>
                                            <CollapsibleTree
                                                data={allindustrySolutionsData}
                                                selectedItems={selectedenquiryTags}
                                                setSelectedItems={setSelectedEnquiryTags}
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

                                            </div>
                                        </ListItem>
                                        <Collapse in={openIndustrySolutions} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", borderRadius: '5px' }} timeout="auto" unmountOnExit>
                                            <CollapsibleTree
                                                data={industrySolutionsData}
                                                selectedItems={selectedenquiryTags}
                                                setSelectedItems={setSelectedEnquiryTags}
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
                                            <CollapsibleTree
                                                data={servicesData}
                                                selectedItems={selectedenquiryTags}
                                                setSelectedItems={setSelectedEnquiryTags}
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
                                            <CollapsibleTree
                                                data={trainingData}
                                                selectedItems={selectedenquiryTags}
                                                setSelectedItems={setSelectedEnquiryTags}
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
                                            <CollapsibleTree
                                                data={skillData}
                                                selectedItems={selectedenquiryTags}
                                                setSelectedItems={setSelectedEnquiryTags}
                                            />
                                        </Collapse>
                                    </div>




                                </div>


                            </div>
                        )}

                        {(preview) && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    padding: '15px',
                                    paddingTop: '0px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '10px'
                                }}
                            >
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Title</p>
                                    <p style={valueStyle}>{title}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>Query</p>
                                    <p style={valueStyle}>{query}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>Type</p>
                                    <p style={valueStyle}>{type}</p>
                                </div>




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
                                paddingTop: '20px',
                                gap: '20px'
                            }}
                        >
                            {/* {(preview) && (<TSIButton
                                name={"Edit"}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                load={false}
                                isCustomColors={true}
                                customOutlineColor={`1px solid ${colors.primary}`}
                                customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                customBgColorOnhover="#FFF"
                                customBgColor={colors.white}
                                customTextColorOnHover={colors.primary}
                                customTextColor={colors.primary}
                                handleClick={
                                    () => {
                                        setPreview(!preview)
                                    }
                                }

                            />)} */}
                            <TSIButton
                                name={!preview ? "Preview" : "Send"}
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
                                        const requiredFields = [
                                            title, query, type,
                                            selectedenquiryTags?.length > 0,
                                        ];

                                        if (requiredFields.some(field => !field)) {
                                            setSnackbar({
                                                open: true,
                                                severity: "error",
                                                message: "All fields are required!"
                                            });
                                            return;
                                        }
                                        preview ? addEnquiresData() : setPreview(true);
                                    }
                                }
                            />
                        </div>

                    </div>) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </Modal >
    )
}

export default TSIEnquiryAddModal
