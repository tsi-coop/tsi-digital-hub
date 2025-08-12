import React, { useState } from 'react'
import { backgroundImage, officialLogo, success } from '../../../assets'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { CircularProgress, styled } from '@mui/material'
import TSICircularProgress from '../../common/Atoms/TSICircularProgress'
import SetupProfileStep1 from '../BusinessAdminSetup/SetupProfileStep1';
import SetupProfileStep2 from '../BusinessAdminSetup/SetupProfileStep2';
import SetupProfileStep3 from '../BusinessAdminSetup/SetupProfileStep3';
import SetupProfileStep4 from '../BusinessAdminSetup/SetupProfileStep4';
import TSIAlert from '../../common/Molecules/TSIAlert';
import TSIPopup from '../../common/Molecules/TSIPopup';
import { useLocation, useNavigate } from 'react-router-dom';
import StepupHeader from '../../common/Atoms/StepupHeader';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import SetupProfileStep5 from '../BusinessAdminSetup/SetupProfileStep5';


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: colors.yellow,
        ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.grey[800],
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        ...theme.applyStyles('dark', {
            backgroundColor: colors.blue,
        }),
    },
}));

const BusinessAdminForm = ({ registerName }: any) => {
    const deviceType = useDeviceType()
    const [industry, setIndustry] = React.useState('');
    const [category, setCategory] = React.useState("");
    const [subtype, setSubType] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState<any>({});
    const [numberofEmp, setNumberofEmp] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [currentStep, setCurrentStep] = React.useState(1);
    const [name, setName] = React.useState(localStorage.getItem("name"));
    const [load, setLoad] = React.useState(false)
    const [mobile, setMobile] = React.useState("");
    const [startYear, setStartYear] = React.useState<any>("");
    const [solutionsInterested, setSolutionsInterested] = React.useState<any>([]);

    const [servicesInterested, setServicesInterested] = React.useState<any>([]);
    const [skillsInterested, setSkillsInterested] = React.useState<any>([]);
    const [trainingInterested, setTrainingInterested] = React.useState<any>([]);

    const [indVerticles, setIndVerticles] = React.useState<any>([]);
    const [indSubtypes, setIndSubtypes] = React.useState<any>([]);
    const [categoryValues, setCategoryValues] = React.useState<any>([]);
    const [states, setStates] = React.useState<any>([]);
    const [stateCities, setStateCities] = React.useState<any>([]);
    const [industrySolutions, setIndustrySolutions] = React.useState<any>([]);
    const [generalITSolutions, setGeneralITSolutions] = React.useState<any>([]);
    const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([]);
    const [itConsultingData, setItConsultingData] = useState<any>([]);
    const [itInfraServicesData, setItInfraServicesData] = useState<any>([]);
    const [generalITSolutionsData, setGeneralITSolutionsData] = useState<any>([]);

    const [itInfraServices, setItInfraServices] = useState<any>([]);
    const [itConsulting, setItConsulting] = useState<any>([]);

    const [skillsData, setSkillsData] = React.useState([]);
    const [trainingData, setTrainingData] = React.useState([]);

    const [numberOfEmployees, setNumberOfEmployees] = useState([]);
    const [about, setAbout] = useState("")
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const organisation = params.get('org');
    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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

        if (currentStep === 1) {
            fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
            getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumberOfEmployees);
            getData({ "_func": "lookup", "type": "ORG_CATEGORY" }, setCategoryValues);
            fetchData({ "_func": "get_state_list" }, setStates);
        }
        if (currentStep === 2) {
            const itemkey: any = getItemByValue(indVerticles, industry)
            fetchData(
                itemkey?.key == "infotech" ? {
                    "_func": "get_all_industry_solutions_tree",
                } : {
                    "_func": "get_industry_solutions_tree",
                    "industry_slug": itemkey?.key
                }
                , setIndustrySolutionsData);
            fetchData({ "_func": "get_general_it_solutions_tree" }, setGeneralITSolutionsData);
            fetchData({ "_func": "get_services_tree" }, setItConsultingData);
            fetchData({ "_func": "get_trainings_tree" }, setTrainingData);
        }

        if (currentStep === 4) {
           
            fetchData({ "_func": "get_skills_tree" }, setSkillsData);
        }
    }, [currentStep]);

    const getItemByValue = (array: any, value: any) => {
        const item = array.find((item: any) => item.value === value);
        return item ? item : null;
    };


    React.useEffect(() => {
        if (currentStep === 1 && industry) {
            const itemkey: any = getItemByValue(indVerticles, industry)
            fetchData({ "_func": "get_industry_subtypes", "industry_slug": itemkey?.key }, setIndSubtypes);
        }
    }, [industry])

    React.useEffect(() => {
        if (currentStep === 1 && state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state])


    const handleOnBoarding = () => {
        setLoad(true)
        const industrykey: any = getItemByValue(indVerticles, industry)
        const numofEmpkey: any = getItemByValue(numberOfEmployees, numberofEmp)
        const citykey: any = getItemByValue(stateCities, city)
        const categorykey: any = getItemByValue(categoryValues, category)
        const body = {
            "_func": "add_business",
            "industry": industrykey?.key,
            "category": categorykey?.slug,
            "business_name": organisation,
            "name": name,
            // "mobile": mobile,
            "about": about,
            "start_year": parseInt(startYear),
            "num_employees": numofEmpkey?.slug,
            "state": state?.key,
            "city": citykey?.key,
            "solutions_interested": [...industrySolutions, ...generalITSolutions],
            "services_interested": [...servicesInterested],
            "trainings_interested": [...trainingInterested],
            "skills_interested": [...skillsInterested]
        }

        apiInstance.addOnboarding(body)
            .then((response: any) => {
                if (response.data._created) {
                    setLoad(false)
                    setOpen(true)
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Onboarding Business successfull",
                    })
                } else {
                    setLoad(false)
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response?.data?.error || "Something went wrong with Onboarding",
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



    if (!load) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "center", height: '100%', width: "100%", backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: deviceType === "mobile" ? "85%" : (deviceType === "tablet" || deviceType === "small-tablet") ? "75%" : "50%", height: '100%', }}>
                    <StepupHeader value={currentStep === 1 ? 0 : currentStep === 2 ? 20 : currentStep === 3 ? 40 : currentStep === 4 ? 60 : currentStep === 4 ? 80 : 99} />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: "100%", height: '70%', overflowY: "scroll", scrollbarWidth: "none" }}>

                        {currentStep === 1 ? (
                            <SetupProfileStep1
                                setCity={setCity}
                                city={city}
                                state={state}
                                setState={setState}
                                numberofEmp={numberofEmp}
                                setNumberofEmp={setNumberofEmp}
                                setSubType={setSubType}
                                subtype={subtype}
                                category={category}
                                setCategory={setCategory}
                                setIndustry={setIndustry}
                                industry={industry}
                                setStartYear={setStartYear}
                                startYear={startYear}
                                mobile={mobile}
                                setMobile={setMobile}
                                indVerticles={indVerticles}
                                categoryValues={categoryValues}
                                indSubtypes={indSubtypes}
                                states={states}
                                stateCities={stateCities}
                                numberOfEmployees={numberOfEmployees}
                                setNumberOfEmployees={setNumberOfEmployees}

                                about={about}
                                setAbout={setAbout}
                            />
                        ) : currentStep === 2 ? (
                            <SetupProfileStep2
                                solutionsInterested={solutionsInterested}
                                setSolutionsInterested={setSolutionsInterested}
                                industrySolutionsData={industrySolutionsData}
                                setIndustrySolutionsData={setIndustrySolutionsData}
                                generalITSolutionsData={generalITSolutionsData}
                                setGeneralITSolutionsData={setGeneralITSolutionsData}
                                industrySolutions={industrySolutions}
                                setIndustrySolutions={setIndustrySolutions}
                                generalITSolutions={generalITSolutions}
                                setGeneralITSolutions={setGeneralITSolutions}
                            />
                        ) : currentStep === 3 ? (
                            <SetupProfileStep3
                                servicesInterested={servicesInterested}
                                setServicesInterested={setServicesInterested}
                                itConsultingData={itConsultingData}
                                setItConsultingData={setItConsultingData}
                            />
                        ) : currentStep === 4 ? (
                            <SetupProfileStep4
                                skillsInterested={skillsInterested}
                                setSkillsInterested={setSkillsInterested}
                                skillsData={skillsData}
                                setSkillsData={setSkillsData}

                            />
                        ) : (
                            <SetupProfileStep5

                                trainingInterested={trainingInterested}
                                setTrainingInterested={setTrainingInterested}
                                trainingData={trainingData}
                                setTrainingData={setTrainingData}
                            />
                        )
                        }



                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px', width: "100%", height: '10%', padding: "20px", borderTop: `1px solid ${colors.snowywhite}` }}>

                        <TSIButton
                            name={"Back"}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType === "mobile" ? "5px 15px" : "8px 30px"}
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
                                    if (currentStep > 1) {
                                        setCurrentStep(currentStep - 1)
                                    } else {
                                        navigation(-1)
                                    }
                                }
                            }
                        />
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px' }} >
                            {(currentStep === 4) && (
                                //     <TSIButton
                                //     name={"Skip For Now"}
                                //     disabled={false}
                                //     variant={'outlined'}
                                //     padding={deviceType === "mobile" ? "5px 15px" : "8px 20px"}
                                //     load={false}
                                //     isCustomColors={true}
                                //     customOutlineColor="1px solid transparent"
                                //     customOutlineColorOnHover="1px solid transparent"
                                //     customBgColorOnhover={colors.white}
                                //     customBgColor={colors.white}
                                //     customTextColorOnHover={colors.primary}
                                //     customTextColor={colors.primary}
                                //     handleClick={
                                //         () => {
                                //             navigation("/community")
                                //         }
                                //     }
                                // />
                                <></>
                            )}

                            <TSIButton
                                name={currentStep == 1 ? "Submit" : "Submit"}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType === "mobile" ? "5px 15px" : "8px 20px"}
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
                                        if (currentStep == 1) {
                                            if (currentStep === 1) {
                                                const missingFields = [];

                                                if (!industry) missingFields.push("Industry");
                                                if (!category) missingFields.push("Category");
                                                // if (!subtype) missingFields.push("Subtype");
                                                if (!numberofEmp) missingFields.push("Number of Employees");
                                                if (!state) missingFields.push("State");
                                                if (!city) missingFields.push("City");
                                                if (!about) missingFields.push("About");

                                                if (!startYear) missingFields.push("Start Year");

                                                if (missingFields.length === 0) {
                                                    // setCurrentStep(currentStep + 1);
                                                     handleOnBoarding()
                                                } else {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: "error",
                                                        message: `Please fill the required fields: ${missingFields.join(", ")}`,
                                                    });
                                                }
                                            }
                                            else if (currentStep == 2) {
                                                const missingFields = [];

                                                if (!Array.isArray(industrySolutions) || industrySolutions.length === 0) {
                                                    missingFields.push("Industry Solutions");
                                                }
                                                if (!Array.isArray(generalITSolutions) || generalITSolutions.length === 0) {
                                                    missingFields.push("General IT Solutions");
                                                }

                                                if (missingFields.length === 0) {
                                                    setCurrentStep(currentStep + 1);
                                                } else {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: "error",
                                                        message: `Please fill the required fields: ${missingFields.join(", ")}`,
                                                    });
                                                }
                                            }
                                            else if (currentStep == 3) {
                                                const missingFields = [];

                                                if (!Array.isArray(servicesInterested) || servicesInterested.length === 0) {
                                                    missingFields.push("IT Services");
                                                }

                                                if (missingFields.length === 0) {
                                                    setCurrentStep(currentStep + 1);
                                                } else {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: "error",
                                                        message: `Please fill the required fields: ${missingFields.join(", ")}`,
                                                    });
                                                }
                                            }
                                            else if (currentStep == 4) {
                                                const missingFields = [];

                                                if (!Array.isArray(skillsInterested) || skillsInterested.length === 0) {
                                                    missingFields.push("IT Skills");
                                                }


                                                if (missingFields.length === 0) {
                                                    setCurrentStep(currentStep + 1);
                                                } else {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: "error",
                                                        message: `Please fill the required fields: ${missingFields.join(", ")}`,
                                                    });
                                                }
                                            }
                                            else {
                                                setCurrentStep(currentStep + 1)
                                            }

                                        } else {

                                            const missingFields = [];

                                            if (!Array.isArray(trainingInterested) || trainingInterested.length === 0) {
                                                missingFields.push("Training");
                                            }


                                            if (missingFields.length === 0) {
                                                handleOnBoarding()
                                            } else {
                                                setSnackbar({
                                                    open: true,
                                                    severity: "error",
                                                    message: `Please fill the required fields: ${missingFields.join(", ")}`,
                                                });
                                            }

                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
                {/* <TSIAlert
                isOpen={open}
                setIsOpen={setOpen}
                onSubmit={setOpen}
                title={"Success"}
                text={"Your account created successfully"}
                buttonName1={"No"}
                buttonName2={"Setup Profile"}
                image={success}
            /> */}

                <TSIPopup
                    isOpen={open}
                    setIsOpen={setOpen}
                    text1={"Success"}
                    text2={"Your registrations is under review. You will receive an email notification soon"}
                    buttonName={"Go to community"}
                    image={success}
                    onSubmit={() => { navigation("/community") }}
                />
            </div >
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        )
    }
}

export default BusinessAdminForm
