import { Checkbox, Collapse, IconButton, ListItem, ListItemText, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import { CollapsibleTree2 } from '../Atoms/CollapsibleList2';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const TSIRFPAddModal = ({
    isOpen,
    setIsOpen,
    isEdit = false,
    editablePost,
    isRFPScreen = false,
    isSolutionScreen = false,
    isServiceScreen = false,
    isTrainingScreen = false
}: any) => {
    const deviceType = useDeviceType()
    const [title, setTitle] = useState("")
    const [type, setType] = useState(isSolutionScreen ? "Solution" : isServiceScreen ? "Service" : isTrainingScreen ? "Training" : "")
    const [document, setDocument] = useState<any>([])
    const [summary, setSummary] = useState("")
    const [preview, setPreview] = useState(false)
    const [remainAnonomous, setRemainAnonomous] = React.useState(false);
    const [makeItDiscourable, setMakeItDiscourable] = React.useState(true);
    const [load, setLoad] = useState(false)
    const [solutionTags, setSolutionTags] = useState<any>([])
    const [fileDataArray, setFileDataArray] = useState<string[]>([]);
    const [fileDataArrayDetails, setFileDataArrayDetails] = useState<any>([]);
    const [collateralid, setCollateralId] = useState("")
    const [selectedRFPTags, setSelecetedRFPTags] = useState<any>([])
    const [openAllIndustrySolutions, setOpenAllIndustrySolutions] = useState(true)
    const [allindustrySolutionsData, setAllIndustrySolutionsData] = useState<any>([])
    const [openIndustrySolutions, setOpenIndustrySolutions] = useState(true)
    const [openServices, setOpenServices] = useState(true)
    const [openTraining, setOpenTraining] = useState(true)
    const [openSkills, setOpenSkills] = useState(true)
    const [skillData, setSkillData] = useState<any>([])
    const [trainingData, setTrainingData] = useState<any>([])
    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])

    const [rfpOptions, setRFPOptions] = useState<any>([])
    const [expiry, setExpiry] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


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


    const getViewRFPData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_rfp",
            "id": id
        }
        apiInstance.getRFPs(body)
            .then((response: any) => {
                if (response.data) {
                    setTitle(response.data.title)
                    setSummary(response.data.summary)
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

    const funcLookUp = () => {
        setLoad(true);

        const body = {
            "_func": "lookup",
            "type": "RFP_TYPE"
        }

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setRFPOptions(response.data)
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
        if (isEdit) {
            getViewRFPData(editablePost.id)
        }
        fetchData({ "_func": "get_all_industry_solutions_tree" }, setAllIndustrySolutionsData);
        funcLookUp()
        getTraining()
        getSkills()
        getIndustrySolutions()
        getServices()
    }, [])

    const uploadDocApi = () => {
        setLoad(true)
        const body = {
            "_func": "upload_file",
            "file_data": "iVBORw0KGgoAAAANSUhEUgAAASwAAAEBCA……BJRU5ErkJggg==",
            "file_extn": "png"
        }
        apiInstance.uploadDocument(body)
            .then((response: any) => {
                if (response.data) {
                    setSolutionTags(response.data)
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "40%" : (deviceType == "large-desktop" || deviceType == "extra-large-desktop") ? "35%" : '45%',
        height: (deviceType == "large-desktop" || deviceType == "extra-large-desktop") ? "65%" : '80%',
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

    const reverseDateString = (date: any) => {
        const [day, month, year] = date?.split('-');
        return `${day}/${month}/${year}`;
    };

    const sendRFPData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email")
        const role = localStorage.getItem("role")
        const busem: any = email.split("@")[1]

        const body = {
            "_func": "add_rfp",
            "rfp_type": type,
            "title": title,
            "summary": summary,
            "expiry": reverseDateString(expiry),
            // "docs": [collateralid],
            "docs": [],
            "to_businesses": role == "BUSINESS" ? [busem] : [],
            "to_professionals": role !== "BUSINESS" ? [email] : [],
            "discoverable": isRFPScreen ? 1 : 0,
            "anonymous": remainAnonomous ? 1 : 0,
            "taxonomies_offered": selectedRFPTags
        }

        apiInstance.addRFPs(body)
            .then((response: any) => {
                if (response?.data._added) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "RFP Post added",
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 1000)

                } else if (response?.data?.edited) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "RFP post edited successful"
                    })
                    setIsOpen(false)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong"
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

    const downloadFile = (id: any) => {
        const fileData = {
            "_func": "download_file",
            "id": id,
            "file_extn": "pdf"
        }

        apiInstance
            .downloadDocument(fileData)
            .then((response) => {

                if (response?.data) {
                    setSnackbar({
                        open: true,
                        severity: "success",
                        message: "Download the file",
                    });
                }

            })
            .catch((error: any) => {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: error?.response?.data?.error || "Something went wrong!!",
                });
            })
            .finally(() => setLoad(false));
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
                {(!load) ?
                    (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', }}>
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
                                    {!preview ? (isEdit ? "Edit RFP" : `Send RFP`) : "Preview"}
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
                                        height: '80%'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: "flex-start",
                                            justifyContent: 'center',
                                            width: '100%',
                                            gap: '20px',
                                        }}
                                    >
                                        <TSISingleDropdown
                                            name={"Type"}
                                            setFieldValue={setType}
                                            previewMode={isSolutionScreen || isServiceScreen || isTrainingScreen}
                                            fieldvalue={type}
                                            isRequired={true}
                                            dropdown={rfpOptions?.map((item: any, index: any) => item.value)}
                                        />
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
                                        <TSITextfield
                                            title={`Summary`}
                                            placeholder={`Enter Summary`}
                                            value={summary}
                                            isRequired={true}
                                            type={"text"}
                                            name={"field"}
                                            multiline={true}
                                            rows={3}
                                            handleChange={(event: any) => { setSummary(event.target.value) }}
                                        />

                                        <TSITextfield
                                            title={`Expiry`}
                                            placeholder={`Enter Expiry`}
                                            value={expiry}
                                            isRequired={true}
                                            type={"date"}
                                            handleChange={(event: any) => { setExpiry(event.target.value); }}
                                            minDate={new Date().toISOString().split('T')[0]}
                                        />
                                        {/* <TSIFileUpload
                                            uploadedImage={"Document"}
                                            uploadTitle={"Drop a file or click to upload"}
                                            imgCardLabel={"Document"}
                                            name={""}
                                            fileType={""}
                                            fileSize={""}
                                            isRequired={false}
                                            setUploadedImage={() => { }}
                                            previewMode={false}
                                            showToastMessage={true}
                                            showDownloadIcon={false}
                                            downloadFile={(fileData: any) => { }}
                                            fileDataArray={fileDataArray}
                                            fileDataArrayDetails={fileDataArrayDetails}
                                            setFileDataArrayDetails={setFileDataArrayDetails}
                                            setFileDataArray={setFileDataArray}
                                            collateralid={collateralid}
                                            setCollateralId={setCollateralId}
                                        /> */}


                                    </div>

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
                                                paddingLeft: "0px",
                                                '&.Mui-checked': {
                                                    color: colors.primary,
                                                },
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "14px",
                                            fontWeight: 600,
                                            lineHeight: "25.2px",
                                            textAlign: "left",
                                            color: colors.black
                                        }}>
                                            Remain Anonymous?

                                        </span>
                                    </div>



                                    {(isRFPScreen) && (<div
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
                                                    selectedItems={selectedRFPTags}
                                                    setSelectedItems={setSelecetedRFPTags}
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
                                                <CollapsibleTree2
                                                    data={industrySolutionsData}
                                                    selectedItems={selectedRFPTags}
                                                    setSelectedItems={setSelecetedRFPTags}
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
                                                    selectedItems={selectedRFPTags}
                                                    setSelectedItems={setSelecetedRFPTags}
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
                                                    selectedItems={selectedRFPTags}
                                                    setSelectedItems={setSelecetedRFPTags}
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
                                                    selectedItems={selectedRFPTags}
                                                    setSelectedItems={setSelecetedRFPTags}
                                                />
                                            </Collapse>
                                        </div>


                                    </div>)}

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
                                        padding: '10px',
                                        paddingTop: '0px',
                                        marginTop: '20px',
                                        overflowY: "scroll",
                                        scrollbarWidth: 'none',
                                        height: '80%',
                                        gap: '10px'
                                    }}
                                >
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>{`${title} Title`}</p>
                                        <p style={valueStyle}>{title}</p>
                                    </div>

                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Summary</p>
                                        <p style={valueStyle}>{summary}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Type</p>
                                        <p style={valueStyle}>{type}</p>
                                    </div>
                                    {/* <div style={grpstyle}>
                                      
                                        <TSIButton
                                            name={`Download Document`}
                                            variant={'outlined'}
                                            disabled={false}
                                            leadingIcon={<UploadFileIcon />}
                                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                            load={false}
                                            isCustomColors={true}
                                            customOutlineColor={`1px solid ${colors.mintWhisper}`}
                                            customOutlineColorOnHover={`1px solid ${colors.mintWhisper}`}
                                            customBgColorOnhover={colors.mintWhisper}
                                            customBgColor={colors.mintWhisper}
                                            customTextColorOnHover={colors.primary}
                                            customTextColor={colors.primary}
                                            handleClick={() => downloadFile(collateralid)}
                                        />
                                    </div> */}

                                    {(isRFPScreen) && (<div style={grpstyle}>
                                        <p style={titleStyle}>{`Relevant Tags`}</p>
                                        <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', }}>
                                            <TSISpreadItems items={selectedRFPTags || []} />

                                        </div>
                                    </div>)}
                                    {/* {(isRFPScreen)&&(<div style={grpstyle}>
                                        <p style={titleStyle}>Recommended Providers</p>
                                        <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', }}>
                                            <TSISpreadItems items={provider || []} />

                                        </div>
                                    </div>)} */}

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
                                    customBgColorOnhover={colors.white}
                                    customBgColor={colors.white}
                                    customTextColorOnHover={colors.primary}
                                    customTextColor={colors.primary}
                                    handleClick={
                                        () => {
                                            setPreview(false)
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
                                                type, title,
                                                summary, expiry, ,
                                                // collateralid, 
                                                selectedRFPTags?.length > 0
                                            ];

                                            if (requiredFields.some(field => !field)) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: "error",
                                                    message: "All fields are required!"
                                                });
                                                return;
                                            }
                                            preview ? sendRFPData() : setPreview(true);

                                        }
                                    }
                                />
                            </div>
                        </div>
                    ) :
                    (
                        <div className="centered-container">
                            <div className="loader"></div>
                        </div>
                    )}
            </div>

        </Modal >
    )

}

export default TSIRFPAddModal
