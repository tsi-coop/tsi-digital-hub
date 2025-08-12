import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ListItem, Collapse, IconButton, Checkbox, Modal } from '@mui/material';
import { CollapsibleTree } from '../Atoms/CollapsibleList';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSISpreadItems from '../Atoms/TSISpreadItems';
import TSIFileUpload from '../Atoms/TSIFileUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TSIEditor from '../Atoms/TSIEditor';
const TSIAddServicesModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
    editablePost,
    edit,
    title,
}: any) => {
    const deviceType = useDeviceType()
    const [whenLaunched, setWhenLaunched] = useState<any>()
    const [description, setDescription] = useState("")
    const [serviceLink, setServiceLink] = useState("")
    const [positioning, setPositioning] = useState("")
    const [servicesTitle, setServicesTitle] = useState("")
    const [collaterals, setCollaterals] = useState([])
    const [collateralDetails, setCollateralDetails] = useState<any>([])
    const [numofCustomers, setNumofCustomers] = useState("")
    const [preview, setPreview] = useState(false)
    const [industry, setIndustry] = useState<any>({})
    const [load, setLoad] = useState(false)
    const [servicesData, setServicesData] = useState<any>({})

    const [openServicesTags, setOpenServicesTags] = useState<any>([])
    const [selectedServices, setSelectedServices] = useState<any>([])

    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [numEmployees, setNumEmployees] = useState<any>([])
    const [openSkills, setOpenSkills] = useState<any>([])
    const [selectedSkills, setSelectedSkills] = useState<any>([])

    const [industryData, setIndustryData] = useState<any>([])
    const [skillData, setskillData] = useState<any>([])
    const [collateralid, setCollateralId] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const getIndustrySolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_industry_solutions_tree",
            "industry_slug": industry.key
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

    useEffect(() => {

        if (industry.key) {
            getIndustrySolutions()
        }

    }, [industry.key])

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


    React.useEffect(() => {
        if (edit) {
            getViewServicesData(editablePost.uuid)
        }
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
        getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumEmployees);
        getSkills()
    }, []);



    useEffect(() => {
        if (servicesData?.industry && indVerticles?.length > 0) {
            const selected = indVerticles.find((item: any) => item.key === servicesData?.industry);
            if (selected) {
                setIndustry({ key: selected.key, value: selected.value });
            }
        }
    }, [servicesData?.industry, indVerticles])

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
            "_func": `cancel_serice`,
            "id": editablePost.id
        };

        apiInstance.getServices(body)
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

    const addServicesData = () => {
        setLoad(true)

        const getItemByValue = (array: any, value: any) => {
            const item = array.find((item: any) => item.value === value);
            return item ? item : null;
        };



        const editbody = {
            "_func": "edit_service",
            "id": editablePost?.uuid,
            "service_title": servicesTitle,
            "positioning": positioning,
            "description": description,
            "service_link": serviceLink,
            "collaterals": [],
            "start_year": parseInt(whenLaunched),
            "num_customers_range": numofCustomers,
            "industry": industry?.key,
            "services_offered": selectedServices,
            "skills_used": selectedSkills
        }

        const body = {
            "_func": "add_service",
            "service_title": servicesTitle,
            "positioning": positioning,
            "description": description,
            "service_link": serviceLink,
            "collaterals": [],
            "start_year": parseInt(whenLaunched),
            "num_customers_range": numofCustomers,
            "industry": industry?.key,
            "services_offered": selectedServices,
            "skills_used": selectedSkills
        }

        apiInstance.addServices(edit ? editbody : body)
            .then((response: any) => {
                if (response.data._added) {
                    onSubmit()
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Services post added successful",
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 200)
                } else if (response?.data?.edited && edit) {
                    onSubmit()
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Services post edited successful"
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
                    message: "Something went wrong",
                })
            });
    }

    const getViewServicesData = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "view_service",
            "id": id
        }
        apiInstance.viewServices(body)
            .then((response: any) => {
                if (response.data) {
                    setServicesData(response.data)
                    setServicesTitle(response?.data?.title)
                    setServicesTitle(response?.data?.service_link)
                    setPositioning(response?.data?.positioning)
                    setNumofCustomers(response?.data?.num_customers)
                    setDescription(response?.data?.description)
                    if (response?.data?.start_year) {
                        setWhenLaunched(`${response?.data?.start_year}`)
                    }
                    setServiceLink(response?.data?.service_link)
                    setCollateralId(response?.data?.collaterals?.replace(/[{}]/g, '').split(',')[0] || "")
                    setCollaterals(response?.data?.collaterals?.replace(/[{}]/g, '').split(',') || [])
                    setCollateralDetails(response?.data?.collaterals?.replace(/[{}]/g, '').split(',') || [])
                    const selectedIndustry = indVerticles.find((item: any) => item.key === response?.data?.industry);
                    if (selectedIndustry) {
                        setIndustry({ key: selectedIndustry.key, value: selectedIndustry.value });
                    }
                    setSelectedSkills(response?.data?.skills_used?.replace(/[{}]/g, '').split(',') || [])
                    setSelectedServices(response?.data?.services_offered?.replace(/[{}]/g, '').split(',') || [])
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : deviceType == "large-desktop" ? "35%" : deviceType == "extra-large-desktop" ? "35%" : '50%', height: '80%',
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
                {(!load) ? (<div style={{ width: '100%', height: "100%" }}>
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
                            {!preview ? (edit ? `Edit ${title}` : `Add ${title}`) : "Preview Services"}
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
                                gap: '20px'
                            }}
                        >
                            <TSITextfield
                                title={`${title} Title`}
                                placeholder={`Enter ${title} Title`}
                                value={servicesTitle}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setServicesTitle(event.target.value) }}
                            />
                            {/* <TSITextfield
                                title={"Positioning"}
                                placeholder={"Enter Positioning"}
                                value={positioning}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                maxLength={1000}
                                multiline={true}
                                rows={3}
                                handleChange={(event: any) => { setPositioning(event.target.value) }}
                            /> */}

                            <TSIEditor
                                title={"Positioning"}
                                placeholder={"Enter Positioning"}
                                content={positioning}
                                setContent={setPositioning}
                                isRequired={true}
                                maxLength={4000}
                            />
                            <TSITextfield
                                title={"Service Link"}
                                placeholder={"Enter Service Link"}
                                value={serviceLink}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setServiceLink(event.target.value) }}
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




                                    <TSISingleDropdown
                                        name={"No. of customers"}
                                        setFieldValue={setNumofCustomers}
                                        fieldvalue={numofCustomers}
                                        isRequired={true}
                                        dropdown={numEmployees.map((item: any) => item.value) || []}
                                    />

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

                            <TSIEditor
                                title={"Description"}
                                placeholder={"Enter Description"}
                                content={description}
                                setContent={setDescription}
                                isRequired={true}
                                maxLength={4000}
                            />

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
                                    name={""}
                                    fileType={""}
                                    fileSize={""}
                                    isRequired={false}
                                    setUploadedImage={() => { }}
                                    previewMode={false}
                                    showToastMessage={true}
                                    showDownloadIcon={false}
                                    leadingIcon={<UploadFileIcon />}
                                    downloadFile={(fileData: any) => { }}
                                    fileDataArray={collaterals}
                                    fileDataArrayDetails={collateralDetails}
                                    setFileDataArrayDetails={setCollateralDetails}
                                    setFileDataArray={setCollaterals}
                                    collateralid={collateralid}
                                    setCollateralId={setCollateralId}
                                />
                            </div> */}

                            {(industryData && skillData && industry.key) && (
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
                                                    width: '100%',
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
                                                            }}>{"Service Tags"}</span>

                                                        </div>

                                                    </div>
                                                </ListItem>

                                                <ListItem sx={{
                                                    pl: 2, border: `1px solid ${colors.snowywhite}`, borderRadius: "5px", background: colors.lightPrimary,
                                                    borderBottomLeftRadius: openServicesTags ? "0px" : "5px",
                                                    borderBottomRightRadius: openServicesTags ? "0px" : "5px",
                                                    width: '100%',
                                                    paddingTop: "0px",
                                                    paddingBottom: '0px',
                                                    '& .css-10b8wcc-MuiListItem-root': {
                                                        paddingTop: "0px",
                                                        paddingBottom: '0px'
                                                    },
                                                    '& .MuiListItem-root': {
                                                        paddingTop: "0px",
                                                        paddingBottom: '0px'
                                                    },
                                                    '& .css-1wg5ebk-MuiList-root': {
                                                        paddingTop: "0px",
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
                                                            }}>{"Industry Solutions"}</span>
                                                            <IconButton onClick={() => { setOpenServicesTags(!openServicesTags) }}>
                                                                {openServicesTags ? <ExpandLess /> : <ExpandMore />}
                                                            </IconButton>
                                                        </div>

                                                    </div>
                                                </ListItem>
                                                <Collapse in={openServicesTags} sx={{ width: '100%', border: `1px solid ${colors.snowywhite}`, borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }} timeout="auto" unmountOnExit>
                                                    <CollapsibleTree
                                                        data={industryData}
                                                        selectedItems={selectedServices}
                                                        setSelectedItems={setSelectedServices}
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
                                                    pl: 2,
                                                    borderRadius: "5px",
                                                    padding: "0px",
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
                                                            }}>{"Skills Used"}</span>
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
                            )}

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
                                <p style={valueStyle}>{servicesTitle}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>Positioning</p>
                                <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{positioning}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>Description</p>
                                <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{description}</p>
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
                                <p style={titleStyle}>No. of customers</p>
                                <p style={valueStyle}>{numofCustomers}</p>
                            </div>

                            <div style={grpstyle}>
                                <p style={titleStyle}>{`${title} Tags`}</p>
                                <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", }}>
                                    <TSISpreadItems items={selectedServices || []} />

                                </div>
                            </div>
                            <div style={grpstyle}>
                                <p style={titleStyle}>Skills Used</p>
                                <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", }}>
                                    <TSISpreadItems items={selectedSkills || []} />

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
                            name={"Deactivate Service"}
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
                                //     servicesTitle, serviceLink, positioning, industry,
                                //     numofCustomers, whenLaunched, ,
                                //     // collaterals?.length > 0,
                                //     selectedServices?.length > 0, selectedSkills?.length > 0
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
                                            servicesTitle, serviceLink, positioning, industry,
                                            numofCustomers, whenLaunched, ,
                                            // collaterals?.length > 0, 
                                            selectedServices?.length > 0, selectedSkills?.length > 0
                                        ];

                                        if (requiredFields.some(field => !field)) {
                                            setSnackbar({
                                                open: true,
                                                severity: "error",
                                                message: "All fields are required!"
                                            });
                                            return;
                                        }
                                        preview ? addServicesData() : setPreview(true);
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

export default TSIAddServicesModal
