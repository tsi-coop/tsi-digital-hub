import { Checkbox, Collapse, IconButton, ListItem, ListItemText, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { CollapsibleTree2 } from '../Atoms/CollapsibleList2';

const TSITestimonialAddModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
    modaltitle,
    tree1Title,
    tree2Title,
    discoverable = 0,
    isSolutionScreen = false,
    isServiceScreen = false,
    isTrainingScreen = false,
    isTalentScreen = false,
    isTestimonialTagsneeded = false
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [query, setQuery] = useState("")
    const [testimonial, setTestimonial] = useState("")
    const [testimonialType, setTestimonialType] = useState(isSolutionScreen ? "Solution" : isServiceScreen ? "Service" : isTrainingScreen ? "Training" : "")
    const [preview, setPreview] = useState(false)

    const [openIndustrySolutions, setOpenIndustrySolutions] = useState(true)
    const [openServices, setOpenServices] = useState(true)
    const [openTraining, setOpenTraining] = useState(true)
    const [openSkills, setOpenSkills] = useState(true)
    const [skillData, setSkillData] = useState<any>([])
    const [trainingData, setTrainingData] = useState<any>([])
    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])
    const [testimonialOptions, setTestimonialOptions] = useState<any>([])
    const [openAllIndustrySolutions, setOpenAllIndustrySolutions] = useState(true)
    const [allindustrySolutionsData, setAllIndustrySolutionsData] = useState<any>([])
    const [selectedTestimonialTags, setSelecetedTestimonialTags] = useState<any>([])

    const role = localStorage.getItem("role")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const email = localStorage.getItem("email")
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const getEnquirySolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_industry_solutions_tree",
        }

        apiInstance.getGetOptions(body)
            .then((response: any) => {
                if (response.data) {

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

    const funcLookUp = () => {
        setLoad(true);

        const body = {
            "_func": "lookup",
            "type": "TESTIMONIAL_TYPE"
        }

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setTestimonialOptions(response.data)
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
        funcLookUp()
        getTraining()
        getSkills()
        getIndustrySolutions()
        getServices()
        fetchData({ "_func": "get_all_industry_solutions_tree" }, setAllIndustrySolutionsData);
    }, [])

    const addTestimonialData = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email")
        const role = localStorage.getItem("role")
        const busem: any = email.split("@")[1]
        const body = {
            "_func": "add_testimonial",
            "testimonial_type": testimonialType,
            "testimonial": testimonial,
            "to_account_type": role,
            "to_account_slug": email || "",
            "taxonomies_offered": selectedTestimonialTags || [],
            "discoverable": discoverable,
            "to_businesses": role == "BUSINESS" ? [busem] : [],
            "to_professionals": [],
        }

        apiInstance.addTestimonial(body)
            .then((response: any) => {
                if (response.data._added) {
                    onSubmit()
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Testimonial Post added",
                    })

                    setIsOpen(false)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Testimonial Post failed to add",
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : '50%',
        height: '80%',
        padding: deviceType == "mobile" ? "15px" : "15px",
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
            {(!load) ? (<div style={style}>
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
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "25px",
                        fontWeight: 400,
                        textAlign: "left",
                    }}>
                        {!preview ? `Send Testimonial` : "Preview"}
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
                                    width: "100%"
                                }}
                            >


                                <TSISingleDropdown
                                    name={"Testimonial Type"}
                                    setFieldValue={setTestimonialType}
                                    fieldvalue={testimonialType}
                                    previewMode={isSolutionScreen ||
                                        isServiceScreen ||
                                        isTrainingScreen}
                                    isRequired={true}
                                    dropdown={testimonialOptions?.map((item: any) => item.value)}
                                />


                                <TSITextfield
                                    title={`Testimonial`}
                                    placeholder={`Enter Testimonial`}
                                    value={testimonial}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={true}
                                    rows={3}
                                    handleChange={(event: any) => { setTestimonial(event.target.value) }}
                                />


                            </div>
                        </div>

                        {(discoverable == 1 || isTestimonialTagsneeded) && (<div
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
                                        selectedItems={selectedTestimonialTags}
                                        setSelectedItems={setSelecetedTestimonialTags}
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
                                        selectedItems={selectedTestimonialTags}
                                        setSelectedItems={setSelecetedTestimonialTags}
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
                                        selectedItems={selectedTestimonialTags}
                                        setSelectedItems={setSelecetedTestimonialTags}
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
                                        selectedItems={selectedTestimonialTags}
                                        setSelectedItems={setSelecetedTestimonialTags}
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
                                        selectedItems={selectedTestimonialTags}
                                        setSelectedItems={setSelecetedTestimonialTags}
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
                            <p style={titleStyle}>Testimonial Type</p>
                            <p style={valueStyle}>{testimonialType}</p>
                        </div>



                        <div style={grpstyle}>
                            <p style={titleStyle}>Testimonial </p>
                            <p style={valueStyle}>{testimonial}</p>
                        </div>


                        <div style={grpstyle}>
                            <p style={titleStyle}>{`Relevant Tags`}</p>
                            <div style={{ display: 'flex', flexDirection: 'row', width: "100%", justifyContent: "flex-start", alignItems: "center", gap: "10px", padding: '5px', flexWrap: "wrap" }}>
                                {
                                    selectedTestimonialTags?.map((item: string, index: number) => (
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
                        justifyContent: "flex-end",
                        width: '100%',
                        borderTop: `1px solid ${colors.snowywhite}`,
                        height: 'auto',
                        paddingTop: '20px',
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
                        name={!preview ? "Preview" : "Send"}
                        // disabled={[
                        //     testimonial, testimonialType, selectedTestimonialTags?.length > 0
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
                                    testimonial, testimonialType, selectedTestimonialTags?.length > 0
                                ];

                                if (requiredFields.some(field => !field)) {
                                    setSnackbar({
                                        open: true,
                                        severity: "error",
                                        message: "All fields are required!"
                                    });
                                    return;
                                }
                                preview ? addTestimonialData() : setPreview(true);
                            }
                        }
                    />
                </div>
            </div>) : (
                <div style={style}>
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                </div>
            )
            }
        </Modal >
    )
}

export default TSITestimonialAddModal
