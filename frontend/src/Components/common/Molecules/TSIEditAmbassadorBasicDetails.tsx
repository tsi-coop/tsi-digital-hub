import { Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import apiInstance from '../../../services/authService';
const TSIEditAmbassadorBasicDetails = ({ open, setIsOpen, title, buttonName1, buttonName2, btn2Color, data, onClick }: any) => {
    const deviceType = useDeviceType()
    const [industry, setIndustry] = useState(data?.basic_details?.industry || "")
    const [category, setCategory] = useState(data?.basic_details?.category || "")
    const [subType, setSubType] = useState([])
    const [numEmployees, setNumEmployees] = useState([])
    const [numofEmployees, setNumofEmployees] = useState(data?.basic_details?.num_employees || "")
    const [state, setState] = useState<any>({})
    const [startYear, setStartYear] = useState<any>(data?.basic_details?.start_year || "")
    const [city, setCity] = useState(data?.basic_details?.city || "")
    const [indVerticles, setIndVerticles] = useState([])
    const [load, setLoad] = useState(false)
    const [states, setStates] = React.useState<any>([]);
    const [stateCities, setStateCities] = React.useState<any>([]);
    const [categoryValues, setCategoryValues] = React.useState<any>([]);
    const [indSubtypes, setIndSubtypes] = React.useState<any>([]);
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    const getItemByValue = (array: any, value: any) => {
        const item = array.find((item: any) => item.value === value);
        return item ? item : null;
    };


    React.useEffect(() => {
        getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumEmployees);
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
        fetchData({ "_func": "get_state_list" }, setStates);
        // fetchData({ "_func": "get_dropdown_values", "lookup": "ORG_CATEGORY" }, setCategoryValues);
        getData({ "_func": "lookup", "type": "ORG_CATEGORY" }, setCategoryValues);
    }, []);

    React.useEffect(() => {
        if (state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state]);

    // React.useEffect(() => {
    //     if (industry) {
    //         const itemkey: any = getItemByValue(indVerticles, industry)
    //         fetchData({ "_func": "get_industry_subtypes", "industry_slug": itemkey?.key }, setIndSubtypes);
    //     }
    // }, [industry])

    const getItemByKey = (array: any, value: any) => {
        const item = array.find((item: any) => item.key === value);
        return item ? item : null;
    };

    React.useEffect(() => {
        if (states?.length > 0 && data?.basic_details?.state) {
            const itemValue: any = getItemByKey(states, data?.basic_details?.state)
            setState(itemValue)
        }
    }, [states, data?.basic_details?.state])



    const handleEditProfessionalData = () => {
        setLoad(true)
        const body = {
            "_func": "edit_business_details",
            "business_name": "TSI Consulting LLP",
            "name": "Satish Ayyaswami",
            "mobile": "9940161886",
            "start_year": 2021,
            "category": "CONSULTING",
            "num_employees": numofEmployees,
            "industry": industry,
            "state": state?.key,
            "city": city,
            "solutions_interested": ["it-logmgmt", "it-incident-response", "it-threat-intelligence"],
            "services_interested": ["contract-staffing", "perm-placement"],
            "trainings_interested": [],
            "skills_interested": ["seo-sem", "smm", "cms"]

        }

        apiInstance.getUserData(body)
            .then((response: any) => {
                if (response.data) {

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

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '35%',
        height: '80%',
        padding: "10px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '5px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => (currentYear - i).toString());
    return (
        <Modal
            open={open}
            onClose={() => { setIsOpen(false) }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
                {(!load) ? (<div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        gap: '0px',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            padding: '10px',
                            width: '100%',
                            height: '90%',
                            gap: '10px'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: '100%',
                                height: '10%',
                            }}
                        >
                            <Typography
                                style={{
                                    color: '#1D2020',
                                    fontFamily: "OpenSansMedium",
                                    fontSize: deviceType === 'mobile' ? '20px' : '24px',
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    textAlign: 'left',
                                    margin: '0px',
                                }}
                            >
                                {title}
                            </Typography>
                            <button onClick={() => { setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                width: '100%',
                                height: '90%',
                                overflowY: 'scroll',
                                scrollbarWidth: 'none',
                                gap: '20px',
                                paddingTop: "10px"
                            }}
                        >
                            <TSISingleDropdown
                                name={"Industry"}
                                setFieldValue={setIndustry}
                                fieldvalue={industry}
                                dropdown={indVerticles?.map((item: any) => item.value) || []}
                            />
                            <TSISingleDropdown
                                name={"Category"}
                                setFieldValue={setCategory}
                                fieldvalue={category}
                                dropdown={categoryValues.map((item: any) => item.value) || []}
                            />
                            {/* <TSISingleDropdown
                                name={"Sub Type"}
                                setFieldValue={setSubType}
                                fieldvalue={subType}
                                dropdown={indSubtypes.map((item: any) => item.value) || []}
                            /> */}

                            <TSISingleDropdown
                                name={"No. of Employess"}
                                setFieldValue={setNumofEmployees}
                                fieldvalue={numofEmployees}
                                dropdown={numEmployees.map((item: any) => item.value) || []}
                            />
                            <TSISingleDropdown
                                name={"Year"}
                                setFieldValue={(selectedValue: string) => {
                                    setStartYear(selectedValue);
                                }}
                                fieldvalue={startYear || ""}
                                dropdown={years}
                            />
                            <TSISingleDropdown
                                name={"State"}
                                setFieldValue={(selectedValue: string) => {
                                    const selectedState = states.find((item: any) => item.value === selectedValue);
                                    if (selectedState) {
                                        setState({ key: selectedState.key, value: selectedState.value });
                                    }
                                }}
                                fieldvalue={state?.value || ""}
                                dropdown={states.map((item: any) => item.value)}
                            />
                            <TSISingleDropdown
                                name={"City (Nearest City) "}
                                setFieldValue={setCity}
                                fieldvalue={city}
                                dropdown={stateCities.map((item: any) => item.value)}
                            />

                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            width: '100%',
                            height: '10%',
                            padding: '10px',
                            gap: '5px',
                            borderTop: `1px solid ${colors.grey80}`
                        }}
                    >
                        <TSIButton
                            name={buttonName1}
                            disabled={false}
                            variant={'outlined'}
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
                                    setIsOpen(false)
                                }
                            }
                        />
                        <TSIButton
                            name={buttonName2}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${btn2Color}`}
                            customOutlineColorOnHover={`1px solid ${btn2Color}`}
                            customBgColorOnhover={btn2Color}
                            customBgColor={btn2Color}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    handleEditProfessionalData()
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

export default TSIEditAmbassadorBasicDetails
