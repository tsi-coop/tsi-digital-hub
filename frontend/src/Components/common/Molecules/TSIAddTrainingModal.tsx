import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSIDropdown from '../Atoms/TSIDropdown';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import TSISwitch from '../Atoms/TSISwitch';
import colors from '../../../assets/styles/colors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import apiInstance from '../../../services/authService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { List, ListItem, ListItemText, Collapse, IconButton, Switch, Checkbox, Modal } from '@mui/material';
import { CollapsibleTree } from '../Atoms/CollapsibleList';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSIFileUpload from '../Atoms/TSIFileUpload';
import TSIEditor from '../Atoms/TSIEditor';

const TSIAddTrainingModal = ({
    isOpen,
    setIsOpen,
    edit,
    editablePost,
    onSubmit,
    title,
}: any) => {
    const deviceType = useDeviceType()
    const [whenLaunched, setWhenLaunched] = useState<any>()
    const [courseOutline, setCourseOutline] = useState("")
    const [positioning, setPositioning] = useState("")
    const [trainingTitle, setTrainingTitle] = useState("")
    const [collaterals, setCollaterals] = useState([])
    const [collateralDetails, setCollateralDetails] = useState<any>([])
    const [numofStudents, setNumofStudents] = useState("")
    const [trainingLink, setTrainingLink] = useState("")
    const [preview, setPreview] = useState(false)
    const [industry, setIndustry] = useState<any>({})
    const [trainingData, setTrainingData] = useState<any>({})
    const [load, setLoad] = useState(false)

    const [openTrainingTags, setOpenTrainingTags] = useState<any>([])
    const [selectedTraining, setSelectedTraining] = useState<any>([])

    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [collateralid, setCollateralId] = useState("")
    const [openSkills, setOpenSkills] = useState<any>([])
    const [selectedSkills, setSelectedSkills] = useState<any>([])

    const [industryData, setIndustryData] = useState<any>([])
    const [skillData, setskillData] = useState<any>([])
    const [numEmployees, setNumEmployees] = useState<any>([])
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const getTrainingSolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_trainings_tree"
        }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {
                    setIndustryData(response.data)
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
                    setskillData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getViewTrainingData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_training",
            "id": id
        }
        apiInstance.viewTraining(body)
            .then((response: any) => {
                if (response.data) {
                    setTrainingData(response?.data)
                    setTrainingTitle(response?.data?.title)
                    setTrainingLink(response?.data?.training_link)
                    setCourseOutline(response?.data?.course_outline)
                    setNumofStudents(response?.data?.num_students)
                    setPositioning(response?.data?.positioning)
                    setWhenLaunched(parseInt(response?.data?.start_year))
                    setCollateralId(response?.data?.collaterals?.replace(/[{}]/g, '').split(',')[0] || "")
                    setCollaterals(response?.data?.collaterals?.replace(/[{}]/g, '').split(',') || [])
                    setCollateralDetails(response?.data?.collaterals?.replace(/[{}]/g, '').split(',') || [])
                    setSelectedSkills(response?.data?.skills_offered?.replace(/[{}]/g, '').split(',') || [])
                    const selectedIndustry = indVerticles?.find((item: any) => item?.key == response?.data?.industry);

                    if (selectedIndustry) {
                        setIndustry({ key: response?.data?.industry, value: selectedIndustry.value });
                    }
                    setSelectedTraining(response?.data?.trainings_offered?.replace(/[{}]/g, '').split(',') || [])
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


    useEffect(() => {

        getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumEmployees);
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
        getTrainingSolutions()
        getSkills()
        if (edit) {
            getViewTrainingData(editablePost.id)
        }
    }, [])






    const downloadFile = () => {

        const fileData = {
            "_func": "download_file",
            "id": collateralid,
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

    const deletePost = () => {
        setLoad(true);
        const body = {
            "_func": `cancel_training`,
            "id": editablePost.id
        };

        apiInstance.getTraining(body)
            .then((response) => {

                if (response?.data?._cancelled) {
                    setIsOpen(false)
                    setSnackbar({
                        open: true,
                        severity: "success",
                        message: "Solution Cancelled Successfully",
                    });
                }

            })
            .catch((error: any) => {
                console.error(error);
            })
            .finally(() => {
                setLoad(false);
            });
    };

    const addTrainingData = () => {
        setLoad(true)

        const editbody = {
            "_func": "edit_training",
            "id": editablePost.id,
            "training_title": trainingTitle,
            "positioning": positioning,
            "course_outline": courseOutline,
            // "collaterals": [collateralid],
            "collaterals": [],
            "start_year": parseInt(whenLaunched),
            "num_students_range": numofStudents,
            "industry": industry.key,
            "training_link": trainingLink,
            "trainings_offered": selectedTraining,
            "skills_offered": selectedSkills
        }

        const body = {
            "_func": "add_training",
            "training_title": trainingTitle,
            "positioning": positioning,
            "course_outline": courseOutline,
            // "collaterals": [collateralid],
            "collaterals": [],
            "start_year": parseInt(whenLaunched),
            "num_students_range": numofStudents,
            "industry": industry.key,
            "training_link": trainingLink,
            "trainings_offered": selectedTraining,
            "skills_offered": selectedSkills
        }

        apiInstance.addTraining(edit ? editbody : body)
            .then((response: any) => {
                if (response.data._added) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Training post added successful",
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                        onSubmit()
                    }, 1000)

                } else if (response?.data?.edited && edit) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Training post edited successful"
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                        onSubmit()
                    }, 1000)


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
    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : deviceType == "large-desktop" ? "35%" : deviceType == "extra-large-desktop" ? "35%" : '50%',
        height: '80%',
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
    useEffect(() => {
        if (trainingData?.industry && indVerticles?.length > 0) {
            setLoad(true)
            const selected = indVerticles.find((item: any) => item.key === trainingData?.industry);
            if (selected) {
                setIndustry({ key: selected.key, value: selected.value });
                setLoad(false)
            }

        }
    }, [trainingData?.industry, indVerticles])
    const currentYear = new Date().getFullYear();
    const dropdown = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (currentYear - i).toString());

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
                    <div style={{ width: '100%', height: "100%" }}>
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
                                {!preview ? (edit ? `Edit ${title}` : `Add ${title}`) : "Preview Training"}
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
                                    padding: '5px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '20px',
                                }}
                            >
                                <TSITextfield
                                    title={`${title} Title`}
                                    placeholder={`Enter ${title} Title`}
                                    value={trainingTitle}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => { setTrainingTitle(event.target.value) }}
                                />

                                <TSIEditor
                                    title={"Positioning"}
                                    placeholder={"Enter Positioning"}
                                    content={positioning}
                                    setContent={setPositioning}
                                    isRequired={true}
                                    maxLength={1000}
                                />
                                <TSITextfield
                                    title={"Training Link"}
                                    placeholder={"Enter Training Link"}
                                    value={trainingLink}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => { setTrainingLink(event.target.value) }}
                                />
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: "flex-start",
                                        justifyContent: 'center',
                                        width: '100%',
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
                                            width: '50%',
                                        }}
                                    >


                                        <TSITextfield
                                            title={"Course Outline"}
                                            placeholder={"Enter Course Outline"}
                                            value={courseOutline}
                                            isRequired={true}
                                            type={"text"}
                                            name={"field"}
                                            multiline={false}
                                            rows={1}
                                            handleChange={(event: any) => { setCourseOutline(event.target.value) }}
                                        />



                                        {/* <TSISingleDropdown
                                            name={"State"}
                                            setFieldValue={(selectedValue: string) => {
                                                const selectedState = states.find((item: any) => item.value === selectedValue);
                                                if (selectedState) {
                                                    setState({ key: selectedState.key, value: selectedState.value });
                                                }
                                                setCity("")
                                            }}
                                            fieldvalue={state?.value || ""}
                                            dropdown={states.map((item: any) => item.value)}
                                        /> */}

                                        <TSISingleDropdown
                                            name={"No. of Students"}
                                            setFieldValue={setNumofStudents}
                                            fieldvalue={numofStudents}
                                            isRequired={true}
                                            dropdown={numEmployees.map((item: any) => item.value) || []}
                                        />


                                        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '40px', alignItems: 'center', width: "100%" }}>
                                            <span style={{
                                                fontFamily: "OpenSans",
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                lineHeight: "25.2px",
                                                textAlign: "left",
                                                color: colors.black
                                            }}>
                                                Status
                                            </span>
                                            <TSISwitch checkstatus={status} setStatus={setStatus} />
                                        </div> */}

                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: "flex-start",
                                            gap: '20px',
                                            width: '50%',
                                        }}
                                    >
                                        <TSISingleDropdown
                                            name={"Industry"}
                                            setFieldValue={(selectedValue: string) => {
                                                const selectedIndustry = indVerticles.find((item: any) => item.value === selectedValue);
                                                if (selectedIndustry) {
                                                    setIndustry({ key: selectedIndustry.key, value: selectedIndustry.value });
                                                }
                                            }}
                                            isRequired={true}
                                            fieldvalue={industry.value}
                                            dropdown={indVerticles?.map((item: any) => item.value) || []}
                                        />



                                        <TSISingleDropdown
                                            name={"When Launched"}
                                            setFieldValue={(selectedValue: string) => {
                                                setWhenLaunched(selectedValue);
                                            }}
                                            isRequired={true}
                                            fieldvalue={whenLaunched || ""}
                                            dropdown={dropdown}
                                        />



                                    </div>
                                </div>
                                {/* <div
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                    }}
                                >
                                    <TSIFileUpload
                                        uploadedImage={"Upload File"}
                                        uploadTitle={"Drop a file or click to upload"}
                                        imgCardLabel={"Collaterals"}
                                        leadingIcon={<UploadFileIcon />}
                                        name={""}
                                        fileType={""}
                                        fileSize={""}
                                        isRequired={false}
                                        setUploadedImage={() => { }}
                                        previewMode={false}
                                        showToastMessage={true}
                                        showDownloadIcon={false}
                                        downloadFile={(fileData: any) => { }}
                                        fileDataArray={collaterals}
                                        fileDataArrayDetails={collateralDetails}
                                        setFileDataArrayDetails={setCollateralDetails}
                                        setFileDataArray={setCollaterals}
                                        collateralid={collateralid}
                                        setCollateralId={setCollateralId}
                                    />
                                </div> */}


                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: "flex-start",
                                        gap: '10px',
                                        width: '100%',
                                    }}
                                >
                                    <span style={{
                                        fontSize: "18px",
                                        fontWeight: 700,
                                        textAlign: "left",
                                        width: '100%'
                                    }}>{"Choose relevant tags "}<span style={{ color: colors.black, marginLeft: "2px" }}>*</span></span>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: "flex-start",
                                            justifyContent: 'center',
                                            gap: '20px',
                                            width: '100%',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: "flex-start",
                                                gap: '20px',
                                                width: '50%',
                                            }}
                                        >

                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                                <ListItem sx={{
                                                    pl: 2, borderRadius: "5px",
                                                    padding: "0px",
                                                    borderBottomLeftRadius: openTrainingTags ? "0px" : "5px",
                                                    borderBottomRightRadius: openTrainingTags ? "0px" : "5px",
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
                                                    <div style={{
                                                        display: 'flex', flexDirection: 'column', justifyContent: 'flex-strat', alignItems: "flex-start", width: '100%',
                                                        paddingLeft: 10,

                                                    }}>
                                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", width: '100%', }}>
                                                            <span style={{
                                                                fontFamily: "OpenSans",
                                                                fontSize: "16px",
                                                                fontWeight: 600,
                                                                lineHeight: "24px",
                                                                letterSpacing: "0.5px",
                                                                textAlign: "left",
                                                            }}>{"Training Tags"}</span>
                                                            <IconButton onClick={() => { setOpenTrainingTags(!openTrainingTags) }}>
                                                                {openTrainingTags ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </div>

                                                    </div>
                                                </ListItem>
                                                <Collapse in={openTrainingTags} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", }} timeout="auto" unmountOnExit>
                                                    <CollapsibleTree
                                                        data={industryData}
                                                        selectedItems={selectedTraining}
                                                        setSelectedItems={setSelectedTraining}
                                                    />
                                                </Collapse>
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: "flex-start",
                                                gap: '20px',
                                                width: '50%',
                                            }}
                                        >
                                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", }}>
                                                <ListItem sx={{
                                                    pl: 2, borderRadius: "5px",
                                                    padding: "0px",
                                                    borderBottomLeftRadius: openTrainingTags ? "0px" : "5px",
                                                    borderBottomRightRadius: openTrainingTags ? "0px" : "5px",
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
                                                            <span style={{
                                                                fontFamily: "OpenSans",
                                                                fontSize: "16px",
                                                                fontWeight: 600,
                                                                lineHeight: "24px",
                                                                letterSpacing: "0.5px",
                                                                textAlign: "left",
                                                            }}>{"Skills Offered"}</span>
                                                            <IconButton onClick={() => { setOpenSkills(!openSkills) }}>
                                                                {openSkills ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </div>

                                                    </div>
                                                </ListItem>
                                                <Collapse in={openSkills} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", }} timeout="auto" unmountOnExit>
                                                    <CollapsibleTree
                                                        data={skillData}
                                                        selectedItems={selectedSkills}
                                                        setSelectedItems={setSelectedSkills}
                                                    />
                                                </Collapse>
                                            </div>
                                        </div>

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
                                    <p style={titleStyle}>{`${title} Title`}</p>
                                    <p style={valueStyle}>{trainingTitle}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>Positioning</p>
                                    <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{positioning}</p>
                                </div>
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Course Outline</p>
                                    <p style={valueStyle}>{courseOutline}</p>
                                </div>

                                {/* <div style={grpstyle}>
                                    <p style={titleStyle}>Collaterals</p>
                                    <p style={{ ...valueStyle, fontWeight: 'bold' }} onClick={() => { if (collateralid) { downloadFile() } }}>{collateralDetails[0]?.filename}</p>
                                </div> */}
                                <div style={grpstyle}>
                                    <p style={titleStyle}>When Launched</p>
                                    <p style={valueStyle}>{whenLaunched}</p>
                                </div>
                                <div style={grpstyle}>
                                    <p style={titleStyle}>No. of Students</p>
                                    <p style={valueStyle}>{numofStudents}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>{`${title} Tags`}</p>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', flexWrap: "wrap" }}>
                                        {
                                            selectedTraining?.map((item: string, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "100px",
                                                        backgroundColor: colors.lightPrimary,
                                                        color: colors.darkblack,
                                                        fontFamily: "OpenSans",
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        lineHeight: "18px",
                                                        letterSpacing: "0.16px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Skills Used</p>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', flexWrap: "wrap" }}>
                                        {
                                            selectedSkills?.map((item: string, index: number) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: "4px 10px",
                                                        borderRadius: "100px",
                                                        backgroundColor: colors.lightPrimary,
                                                        color: colors.darkblack,
                                                        fontFamily: "OpenSans",
                                                        fontSize: "14px",
                                                        fontWeight: 400,
                                                        lineHeight: "18px",
                                                        letterSpacing: "0.16px",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {item}
                                                </div>
                                            ))
                                        }

                                    </div>
                                </div>

                            </div>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                width: '100%',
                                borderTop: `1px solid ${colors.snowywhite}`,
                                height: 'auto',
                                padding: '10px',
                                gap: '20px'
                            }}
                        >
                            {(edit) ? (<TSIButton
                                name={"Deactivate Training"}
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
                                        if (editablePost.id) {
                                            deletePost()
                                        }
                                    }
                                }
                            />) : (<div></div>)}

                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: "flex-end",
                                    gap: '20px'
                                }}
                            >
                                {(preview) && (<TSIButton
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
                                />)}
                                <TSIButton
                                    name={!preview ? "Preview" : (edit ? "Submit" : "Add")}
                                    // disabled={[
                                    //     trainingTitle, trainingLink, positioning, industry,
                                    //     numofStudents, whenLaunched, courseOutline,
                                    //     // collaterals?.length > 0,
                                    //     selectedTraining?.length > 0, selectedSkills?.length > 0
                                    // ].some(field => !field)}
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
                                                trainingTitle, trainingLink, positioning, industry,
                                                numofStudents, whenLaunched, courseOutline,
                                                // collaterals?.length > 0, 
                                                selectedTraining?.length > 0, selectedSkills?.length > 0
                                            ];

                                            if (requiredFields.some(field => !field)) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: "error",
                                                    message: "All fields are required!"
                                                });
                                                return;
                                            }
                                            preview ? addTrainingData() : setPreview(true);
                                        }
                                    }
                                />
                            </div>
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

export default TSIAddTrainingModal
