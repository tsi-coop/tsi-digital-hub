import { Checkbox, Modal } from '@mui/material'
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
import TreeSpreading from './TreeSpreading';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import TSISpreadItems from '../Atoms/TSISpreadItems';

const TSIJobAddModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
    modaltitle,
}: any) => {
    const deviceType = useDeviceType()
    const [description, setDescription] = useState("")
    const [jobType, setJobType] = useState("")
    const [title, setTitle] = useState("")
    const [state, setState] = useState<any>({})
    const [city, setCity] = useState("")
    const [preview, setPreview] = useState(false)
    const [states, setStates] = React.useState<any>([]);
    const [stateCities, setStateCities] = React.useState<any>([]);
    const [load, setLoad] = useState(false)
    const [skillData, setSkillData] = useState<any>([])
    const [trainingData, setTrainingData] = useState<any>([])
    const [servicesData, setServicesData] = useState<any>([])
    const [industryData, setIndustryData] = useState<any>([])
    const [selectedTaxonomies, setSelectedTaxonomies] = useState<any>([])
    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [industry, setIndustry] = useState<any>()
    const [jobTypes, setJobTypes] = React.useState<any>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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


    React.useEffect(() => {
        fetchData({ "_func": "get_state_list" }, setStates);
    }, []);

    React.useEffect(() => {
        if (state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state]);



    const getServicesData = () => {
        setLoad(true)
        const body = {
            "_func": "get_services_tree"
        }

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


    const getIndustrySolutions = () => {
        setLoad(true)
        const body = {
            "_func": "get_industry_solutions_tree",
            "industry_slug": industry?.key
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
        const body = { "_func": "get_trainings_tree" }

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
    const getData = () => {
        setLoad(true);
        const body = {
            "_func": "lookup",
            "type": "JOB_TYPE"
        }

        apiInstance.getLookUp(body)
            .then((response: any) => {
                if (response.data) {
                    setJobTypes(response.data);
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

        if (industry?.key) {
            getIndustrySolutions()
        }
    }, [industry])

    useEffect(() => {
        getData()
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);

        getSkills()
        getServicesData()
        getTraining()
    }, [])



    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "55%" : deviceType == "tablet" ? "50%" : '50%',
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


    const addJob = () => {
        setLoad(true)
        const body = {
            "_func": "add_job",
            "job_type": jobType,
            "title": title,
            "description": description,
            "state": state?.key,
            "city": city,
            "taxonomies_offered": selectedTaxonomies,
        }

        apiInstance.addJOBS(body)
            .then((response: any) => {
                if (response?.data._added) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Job added successfull",
                    })
                    setLoad(false)
                    setTimeout(() => {
                        setIsOpen(false)
                        onSubmit()
                    }, 1000)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Job adding went wrong",
                    })
                }
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
                                    {!preview ? `Post Job` : "Preview"}
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
                                        gap: '20px',
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
                                                width: '50%',
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
                                                name={`Job Type`}
                                                fieldvalue={jobType}
                                                setFieldValue={setJobType}
                                                dropdown={jobTypes.map((item: any, index: any) => item.value)}
                                                previewMode={false}
                                                isRequired={true}
                                            />

                                        </div>
                                    </div>


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
                                                name={"State"}
                                                setFieldValue={(selectedValue: string) => {
                                                    const selectedState = states.find((item: any) => item.value === selectedValue);
                                                    if (selectedState) {
                                                        setState({ key: selectedState.key, value: selectedState.value });
                                                    }
                                                }}
                                                isRequired={true}
                                                fieldvalue={state?.value || ""}
                                                dropdown={states.map((item: any) => item.value)}
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
                                                name={"City"}
                                                setFieldValue={setCity}
                                                isRequired={true}
                                                fieldvalue={city}
                                                dropdown={stateCities.map((item: any) => item.value)}
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
                                        fieldvalue={industry?.value}
                                        dropdown={indVerticles?.map((item: any) => item?.value) || []}
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

                                        <TSITextfield
                                            title={`Description`}
                                            placeholder={`Enter description`}
                                            value={description}
                                            isRequired={true}
                                            type={"text"}
                                            name={"field"}
                                            multiline={true}
                                            rows={3}
                                            handleChange={(event: any) => { setDescription(event.target.value) }}
                                        />

                                    </div>
                                    {(industry) && (<div
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
                                            width:'100%',
                                            textAlign:"left"
                                        }}>{"Choose relevant tags "}<span style={{ color: colors.black, marginLeft: "2px" }}>*</span></span>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: "flex-start",
                                                justifyContent: 'center',
                                                width: '100%',
                                                gap: '20px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: "flex-start",
                                                    gap: '20px',
                                                    width: '48%',
                                                }}
                                            >
                                                <TreeSpreading data={industryData} setSelected={setSelectedTaxonomies} selected={selectedTaxonomies} title={"Solutions"} />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: "flex-start",
                                                    gap: '20px',
                                                    width: '48%',
                                                }}
                                            >
                                                <TreeSpreading data={servicesData} setSelected={setSelectedTaxonomies} selected={selectedTaxonomies} title={"Services"} />
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: "flex-start",
                                                justifyContent: 'center',
                                                width: '100%',
                                                gap: '20px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: "flex-start",
                                                    width: '48%',
                                                }}
                                            >
                                                <TreeSpreading data={skillData} setSelected={setSelectedTaxonomies} selected={selectedTaxonomies} title={"Skills"} />
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: "flex-start",
                                                    width: '48%',
                                                }}
                                            >
                                                <TreeSpreading data={trainingData} setSelected={setSelectedTaxonomies} selected={selectedTaxonomies} title={"Training"} />

                                            </div>

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
                                        <p style={titleStyle}>Job Title</p>
                                        <p style={valueStyle}>{title}</p>
                                    </div>


                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Job Type</p>
                                        <p style={valueStyle}>{jobType}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>Description</p>
                                        <p style={valueStyle}>{description}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>State</p>
                                        <p style={valueStyle}>{state?.key}</p>
                                    </div>
                                    <div style={grpstyle}>
                                        <p style={titleStyle}>City</p>
                                        <p style={valueStyle}>{city}</p>
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
                                    name={!preview ? "Preview" : "Post"}
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
                                            if (!title) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please enter a title.",
                                                })
                                            }
                                            else if (!jobType) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please select a job type.",
                                                })
                                            }
                                            else if (!state) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please select a state."
                                                })
                                                return;
                                            }
                                            else if (!city) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please select a city."
                                                })
                                            }
                                            else if (!description) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please enter a job description."
                                                })
                                            }
                                            else if (!selectedTaxonomies || selectedTaxonomies.length === 0) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: "Please select at least one taxonomy."
                                                })
                                                return;
                                            }
                                            else if (!preview) {
                                                setPreview(true);
                                            } else {
                                                addJob();
                                            }
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

export default TSIJobAddModal
