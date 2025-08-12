import { Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import apiInstance from '../../../services/authService';
const TSIEditBasicDetails = ({ open, setIsOpen, title, buttonName1, buttonName2, btn2Color, onClick }: any) => {
    const deviceType = useDeviceType()
    const [industry, setIndustry] = useState("")
    const [state, setState] = React.useState<any>({});
    const [city, setCity] = useState("")
    const [experience, setExperience] = useState("")
    const [gender, setGender] = useState("")
    const [householdIncome, setHouseholdIncome] = useState("")
    const [college, setCollege] = useState("")
    const [disability, setDisability] = useState("")
    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [states, setStates] = React.useState<any>([]);
     const [stateCities, setStateCities] = React.useState<any>([]);
    const [load, setLoad] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '28%',
        height: '70%',
        padding: "10px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '25px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };


    React.useEffect(() => {
        fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
        fetchData({ "_func": "get_state_list" }, setStates);
    }, []);

    React.useEffect(() => {
        if (state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state]);

    const getEditBusinessData = () => {
        setLoad(true)
        const body = {
            "_func": "edit_professional_details",
            "name": "Satish Ayyaswami2",
            "mobile": "9940161886",
            "gender": gender == "Male" ? "M" : gender == "Female" ? "F" : "",
            "college": college,
            "disability": disability,
            "start_year": 2000,
            "annual_income": householdIncome,
            "industry": industry,
            "state": state,
            "city": city,
            "solutions_interested": ["it-logmgmt", "it-incident-response", "it-threat-intelligence"],
            "services_interested": ["contract-staffing", "perm-placement"],
            "trainings_interested": [],
            "skills_interested": ["seo-sem", "smm", "cms"],
            "solutions_expertise": ["it-logmgmt", "it-incident-response", "it-threat-intelligence"],
            "services_expertise": ["contract-staffing", "perm-placement"],
            "trainings_expertise": [],
            "skills_expertise": ["seo-sem", "smm", "cms"]
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
                            <button onClick={() => { }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
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
                            <TSISingleDropdown
                                name={"Experience (Years)"}
                                setFieldValue={setExperience}
                                fieldvalue={experience}
                                dropdown={[
                                    '1',
                                    '2',
                                    '3',
                                    '4',
                                    '5',
                                ]}
                            />
                            <TSISingleDropdown
                                name={"Gender"}
                                setFieldValue={setGender}
                                fieldvalue={gender}
                                dropdown={[
                                    'Male',
                                    'Female',
                                ]}
                            />
                            <TSISingleDropdown
                                name={"Household Income"}
                                setFieldValue={setHouseholdIncome}
                                fieldvalue={householdIncome}
                                dropdown={[
                                    '3L-5L',
                                    '5L-8L',
                                    '8L-10L',
                                    '10L-13L',
                                    '13L-15L',
                                ]}
                            />
                            <TSISingleDropdown
                                name={"College"}
                                setFieldValue={setCollege}
                                fieldvalue={college}
                                dropdown={[
                                    'Tier-1',
                                    'Tier-2',
                                    'Tier-3',
                                    'Tier-4',
                                ]}
                            />
                            <TSISingleDropdown
                                name={"Disability"}
                                setFieldValue={setDisability}
                                fieldvalue={disability}
                                dropdown={[
                                    'Low Vision',
                                    'No',
                                    "None"
                                ]}
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
                            customOutlineColor="1px solid #006A67"
                            customOutlineColorOnHover="1px solid #006A67"
                            customBgColorOnhover="#FFF"
                            customBgColor={"#FFF"}
                            customTextColorOnHover="#006A67"
                            customTextColor="#006A67"
                            handleClick={
                                () => {
                                    onClick()
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
                                    getEditBusinessData()
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

export default TSIEditBasicDetails
