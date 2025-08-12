import React, { useEffect, useState } from 'react'
import { backgroundImage, officialLogo, success } from '../../../assets'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import TSIPopup from '../../common/Molecules/TSIPopup';
import { useNavigate } from 'react-router-dom';
import TechProfSetup1 from '../TechProfessionalSetup/TechProfSetup1';
import TechProfSetup2 from '../TechProfessionalSetup/TechProfSetup2';
import TechProfSetup3 from '../TechProfessionalSetup/TechProfSetup3';
import TechProfSetup4 from '../TechProfessionalSetup/TechProfSetup4';
import TechProfSetup5 from '../TechProfessionalSetup/TechProfSetup5';
import StepupHeader from '../../common/Atoms/StepupHeader';
import apiInstance from '../../../services/authService';
import colors from '../../../assets/styles/colors';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';


const TechProfessionalForm = () => {
  const deviceType = useDeviceType()
  const [industry, setIndustry] = React.useState("");
  const [houseHoldIncome, setHouseHoldIncome] = React.useState("");
  const [disability, setDisability] = React.useState("");
  const [college, setCollege] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState<any>({});
  const [gender, setGender] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [name, setName] = React.useState(localStorage.getItem("name"));
  const [load, setLoad] = useState(false)
  const [mobile, setMobile] = React.useState("");
  const [experience, setExperience] = useState("Fresher")
  const [startYear, setStartYear] = React.useState<any>();
  const [solutionsInterested, setSolutionsInterested] = React.useState([]);
  const [servicesInterested, setServicesInterested] = React.useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const navigation = useNavigate()

  const [indVerticles, setIndVerticles] = React.useState<any>([]);
  const [states, setStates] = React.useState<any>([]);
  const [stateCities, setStateCities] = React.useState<any>([]);
  const [industrySolutions, setIndustrySolutions] = React.useState<any>([]);
  const [generalITSolutions, setGeneralITSolutions] = React.useState<any>([]);
  const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([]);
  const [generalITSolutionsData, setGeneralITSolutionsData] = useState<any>([]);
  const [trainingsTree, setTrainingsTree] = React.useState<any>([]);
  const [skillsTree, setSkillsTree] = React.useState<any>([]);
  const [selectedSkills, setSelectedSkills] = React.useState<any>([]);
  const [selectedTraining, setSelectedTraining] = React.useState<any>([]);

  const [itConsultingData, setItConsultingData] = useState<any>([]);


  const [professionalIncome, setProfessionalIncome] = useState([]);
  const [genders, setGenders] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [disabilities, setDisabilities] = useState([]);
  const [about, setAbout] = useState("")

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
    getData({ "_func": "lookup", "type": "PROFESSIONAL_HH_INCOME" }, setProfessionalIncome);
    getData({ "_func": "lookup", "type": "GENDER" }, setGenders);
    getData({ "_func": "lookup", "type": "COLLEGE" }, setColleges);
    getData({ "_func": "lookup", "type": "DISABILITY" }, setDisabilities);
  }, []);


  const getItemByValue = (array: any, value: any) => {
    const item = array.find((item: any) => item.value === value);
    return item ? item : null;
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
      fetchData({ "_func": "get_state_list" }, setStates);
    }
    if (currentStep === 2) {
      if (currentStep === 2 && industry) {
        const itemkey: any = getItemByValue(indVerticles, industry)
        fetchData(
          itemkey?.key == "infotech" ? {
            "_func": "get_all_industry_solutions_tree",
          } : {
            "_func": "get_industry_solutions_tree",
            "industry_slug": itemkey?.key
          }
          , setIndustrySolutionsData);
      }
      fetchData({ "_func": "get_general_it_solutions_tree" }, setGeneralITSolutionsData);
      fetchData({ "_func": "get_services_tree" }, setItConsultingData);
      fetchData({ "_func": "get_trainings_tree" }, setTrainingsTree);
    }

    if (currentStep === 4) {
      fetchData({ "_func": "get_skills_tree" }, setSkillsTree);
    }


  }, [currentStep]);

  React.useEffect(() => {
    if (currentStep === 1 && state?.key) {
      fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
    }
  }, [state])

  const handleOnBoarding = () => {
    setLoad(true)

    const industrykey: any = getItemByValue(indVerticles, industry)
    const disabilitykey: any = getItemByValue(disabilities, disability)
    const incomekey: any = getItemByValue(professionalIncome, houseHoldIncome)
    const collegekey: any = getItemByValue(colleges, college)
    const citykey: any = getItemByValue(stateCities, city)

    const body = {
      "_func": "add_professional",
      "name": name,
      // "mobile": mobile,
      "about": about,
      "gender": gender == 'Male' ? "M" : "F",
      "college": collegekey?.slug || "",
      "disability": disabilitykey?.slug || "",
      "start_year": experience == "Fresher" ? new Date().getFullYear() : parseInt(startYear),
      "annual_income": incomekey?.slug || "",
      "industry": industrykey?.key || "",
      "state": state?.key || "",
      "city": citykey?.key || "",
      "solutions_interested": [...industrySolutions, ...generalITSolutions],
      "services_interested": [...servicesInterested],
      "trainings_interested": [...selectedTraining],
      "skills_interested": [...selectedSkills],

    }


    apiInstance.addOnboarding(body)
      .then((response: any) => {
        if (response.data._created) {
          setOpen(true);
          setLoad(false)
          setSnackbar({
            open: true,
            severity: 'success',
            message: "Onboarding Professional successfull",
          })
        }
        else {
          setOpen(true)
          setLoad(false)
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
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: deviceType === "mobile" ? "85%" : (deviceType === "tablet" || deviceType === "small-tablet") ? "75%" : "50%", height: '100%', }}>
          <StepupHeader value={currentStep === 1 ? 0 : currentStep === 2 ? 25 : currentStep === 3 ? 50 : currentStep === 4 ? 75 : 99} />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '20px', width: "100%", height: '70%', overflowY: "scroll", scrollbarWidth: "none" }}>


            {currentStep === 1 ? (
              <TechProfSetup1
                setCity={setCity}
                city={city}
                state={state}
                setState={setState}
                experience={experience}
                setExperience={setExperience}
                gender={gender}
                setGender={setGender}
                setIndustry={setIndustry}
                industry={industry}
                houseHoldIncome={houseHoldIncome}
                setHouseHoldIncome={setHouseHoldIncome}
                disability={disability}
                setDisability={setDisability}
                college={college}
                setCollege={setCollege}
                setStartYear={setStartYear}
                startYear={startYear}
                mobile={mobile}
                setMobile={setMobile}
                indVerticles={indVerticles}
                states={states}
                stateCities={stateCities}
                about={about}
                setAbout={setAbout}

                professionalIncome={professionalIncome}
                genders={genders}
                colleges={colleges}
                disabilities={disabilities}
              />
            ) : currentStep === 2 ? (
              <TechProfSetup2
                experience={experience}
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
              <TechProfSetup3
                servicesInterested={servicesInterested}
                setServicesInterested={setServicesInterested}
                itConsultingData={itConsultingData}
                setItConsultingData={setItConsultingData}

              />
            ) : currentStep === 4 ? (

              <TechProfSetup4 skillsTree={skillsTree} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} />
            )
              : (
                <TechProfSetup5
                  trainingsTree={trainingsTree}
                  selectedTraining={selectedTraining}
                  setSelectedTraining={setSelectedTraining}
                />
              )
            }



          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px', width: "100%", height: '10%', padding: "20px", borderTop: `1px solid ${colors.snowywhite}` }}>

            <TSIButton
              name={"Back"}
              disabled={false}
              variant={'outlined'}
              padding={deviceType == "mobile" ? "5px 15px" : "8px 30px"}
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
              {(currentStep == 5) && (
                // <TSIButton
                //   name={"Skip For Now"}
                //   disabled={false}
                //   variant={'outlined'}
                //   padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                //   load={false}
                //   isCustomColors={true}
                //   customOutlineColor="1px solid transparent"
                //   customOutlineColorOnHover="1px solid transparent"
                //   customBgColorOnhover={colors.white}
                //   customBgColor={colors.white}
                //   customTextColorOnHover={colors.primary}
                //   customTextColor={colors.primary}
                //   handleClick={
                //     () => {
                //       navigation("/community")
                //     }
                //   }
                // />
                <></>
              )}

              <TSIButton
                name={currentStep == 1 ? "Submit" : "Submit"}
                disabled={false}
                variant={'contained'}
                padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
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

                        if (!industry && experience == "Experienced") missingFields.push("Industry");
                        if (!college && experience == "Fresher") missingFields.push("College");
                        if (!disability && experience == "Fresher" && college == "Tier-3 or Rural College") missingFields.push("Disability");
                        if (!gender) missingFields.push("Gender");
                        if (!state) missingFields.push("State");
                        if (!city) missingFields.push("City");
                        if (!startYear && experience == "Experienced") missingFields.push("Start Year");
                        if (!houseHoldIncome && experience == "Fresher" && college == "Tier-3 or Rural College") missingFields.push("House Hold Income");
                        if (!about) missingFields.push("About")

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
                      } else if (currentStep == 2) {
                        const missingFields = [];

                        if (((!Array.isArray(industrySolutions)) || industrySolutions.length === 0) && experience == "Experienced") {
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
                      } else if (currentStep == 3) {
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
                      } else if (currentStep == 4) {
                        const missingFields = [];

                        if (!Array.isArray(selectedSkills) || selectedSkills.length === 0) {
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

                    } else {

                      const missingFields = [];

                      if (!Array.isArray(selectedTraining) || selectedTraining.length === 0) {
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


        <TSIPopup
          isOpen={open}
          setIsOpen={setOpen}
          text1={"Success"}
          text2={"Your account created successfully"}
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

export default TechProfessionalForm
