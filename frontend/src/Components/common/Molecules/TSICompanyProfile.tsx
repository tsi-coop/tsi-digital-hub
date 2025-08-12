import { Avatar, Badge, Button, Checkbox, Collapse, IconButton, ListItem, ListItemText, Snackbar, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import colors from '../../../assets/styles/colors'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TSIButton from '../Atoms/TSIButton';
import TSIEditUserProfile from './TSIEditUserProfile';
import TSIConfirmationModal from './TSIConfirmationModal';
import TSIEditCompanyBasicDetails from './TSIEditCompanyBasicDetails';
import apiInstance from '../../../services/authService';
import useDeviceType from '../../../Utils/DeviceType';
import TreeSpreading from './TreeSpreading';
const TSICompanyProfile = ({ settingData, onCall }: any) => {
  const [isEditUserProfile, setisEditUserProfile] = useState(false)
  const [isEditBasic, setisEditBasic] = useState(false)
  const deviceType = useDeviceType()
  const [isDelete, setIsDelete] = useState<any>(false);
  const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([]);
  const [generalITSolutionsData, setGeneralITSolutionsData] = useState<any>([]);
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [selectedTraining, setSelectedTraining] = useState<any>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<any>([]);
  const [selected, setSelected] = useState(0)
  const [selectedSkills, setSelectedSkills] = useState<any>([]);
  const [trainingData, setTrainingData] = useState<any>([]);
  const [servicesData, setServicesData] = useState<any>([]);
  const [skillsData, setSkillsData] = useState<any>([]);
  const [data, setData] = useState<any>(settingData);

  const [industry, setIndustry] = useState("")
  const [category, setCategory] = useState(data?.basic_details?.category || "")
  const [numEmployees, setNumEmployees] = useState([])
  const [about, setAbout] = useState(data?.basic_details?.about || "")
  const [numofEmployees, setNumofEmployees] = useState(data?.basic_details?.num_employees || "")
  const [state, setState] = useState<any>({})
  const [startYear, setStartYear] = useState<any>(data?.basic_details?.start_year || "")
  const [city, setCity] = useState(data?.basic_details?.city || "")
  const [indVerticles, setIndVerticles] = useState([])
  const [states, setStates] = React.useState<any>([]);
  const [stateCities, setStateCities] = React.useState<any>([]);
  const [categoryValues, setCategoryValues] = React.useState<any>([]);

  const [load, setLoad] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const email = localStorage.getItem("email")
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  }
  const Style: any = {
    fontFamily: "OpenSans",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "24px",
    letterSpacing: "0.5px",
    textAlign: "left",
    margin: 0,
    padding: 0,
    color: colors.lightgrey
  }

  const handleDeleteAccount = () => {
    setLoad(true)
    const email = localStorage.getItem("email")
    const body = {
      "_func": "deactivate_user",
      "email": email
    }

    apiInstance.deleteAccount(body)
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


  const fetchData = (
    body: object,
    setData: React.Dispatch<React.SetStateAction<any>>,
    successMessage: string = ''
  ) => {
    setLoad(true);
    apiInstance
      .getGetOptions(body)
      .then((response: any) => {
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
            message: response.data?.code || 'Something went wrong',
          });
        }
      })
      .catch((error: any) => {
        setSnackbar({
          open: true,
          severity: 'error',
          message: error?.message || 'Something went wrong',
        });
      })
      .finally(() => setLoad(false));
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
    getData({ "_func": "lookup", "type": "ORG_NUM_EMP_RANGE" }, setNumEmployees);
    fetchData({ "_func": "get_industry_verticals" }, setIndVerticles);
    fetchData({ "_func": "get_state_list" }, setStates);
    getData({ "_func": "lookup", "type": "ORG_CATEGORY" }, setCategoryValues);
  }, []);

  React.useEffect(() => {
    if (state?.key) {
      fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
    }
  }, [state]);



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

  React.useEffect(() => {
    if (indVerticles?.length > 0 && data?.basic_details?.industry) {
      const itemValue: any = getItemByKey(indVerticles, data?.basic_details?.industry)
      setIndustry(itemValue?.value)
    }
  }, [states, data?.basic_details?.industry])



  const getItemByValue = (array: any, value: any) => array.find((item: any) => item.value === value) || null;
  const getItemBySlug = (array: any, value: any) => array.find((item: any) => item.slug === value) || null;

  const handleEditBusinessData = () => {
    setLoad(true);
    const name = localStorage.getItem("name")
    const getItemByValue = (array: any, value: any) => {
      const item = array.find((item: any) => item.value === value);
      return item ? item : null;
    };
    const itemIndustry = getItemByValue(indVerticles, industry)
    const body = {
      "_func": "edit_business_details",
      "business_name": data?.basic_details?.org_name,
      "about": about,
      "name": name,
      "start_year": parseInt(startYear),
      "category": category,
      "num_employees": getItemByValue(numEmployees, numofEmployees)?.slug || numofEmployees,
      "industry": itemIndustry?.key,
      "state": state?.key,
      "city": city,
      "solutions_interested": selectedSolutions?.filter((item: any) => item != null),
      "services_interested": selectedServices?.filter((item: any) => item != null),
      "trainings_interested": selectedTraining?.filter((item: any) => item != null),
      "skills_interested": selectedSkills?.filter((item: any) => item != null),
      // "mobile": "9940161886",
    }

    apiInstance.getUserData(body)
      .then((response: any) => {
        if (response.data?._edited) {

          setSnackbar({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
          setTimeout(() => {
            onCall()
          }, 1000)
        }
        setLoad(false);
      })
      .catch((error: any) => {
        setLoad(false);
        setSnackbar({
          open: true,
          severity: "error",
          message: error.message || "Something went wrong",
        });
      });
  };


  useEffect(() => {
    if (settingData?.interests) {
      setSelectedSolutions(settingData.interests?.solutions_interested || []);
      setSelectedServices(settingData.interests?.services_interested || []);
      setSelectedTraining(settingData.interests?.training_interested || []);
      setSelectedSkills(settingData.interests?.skills_interested || []);
    }
    fetchData({ _func: 'get_general_it_solutions_tree' }, setGeneralITSolutionsData);
    fetchData({ _func: 'get_services_tree' }, setServicesData);
    fetchData({ _func: 'get_trainings_tree' }, setTrainingData);
    fetchData({ _func: 'get_skills_tree' }, setSkillsData);
  }, []);


  useEffect(() => {
    if (industry) {
      if (indVerticles?.length > 0 && industry) {
        const itemValue: any = getItemByValue(indVerticles, industry)
        fetchData(
          itemValue.key == "infotech" ? {
            "_func": "get_all_industry_solutions_tree",
          } : {
            "_func": "get_industry_solutions_tree",
            "industry_slug": itemValue.key

          }
          , setIndustrySolutionsData);
      }
    }

  }, [industry])



  const userData = [
    {
      key: "About",
      value: about
    },
    {
      key: "Industry",
      value: industry
    },
    {
      key: "Category",
      value: category
    },
    {
      key: "Start Year",
      value: startYear
    },
    {
      key: "No. of Employees",
      value: numofEmployees
    },
    {
      key: "State",
      value: state?.value
    },
    {
      key: "City",
      value: city
    },
  ]
  if (!load) {
    return (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', height: "100%" }}>
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
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "20px", borderBottom: "1px solid #BEC9C7" }}>
          <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", padding: '2px', gap: '15px', }}>

            <IconButton
              onClick={() => { }}
              sx={{
                bgcolor: "transparent",
                width: '96px',
                height: '96px',
                fontFamily: 'OpenSans',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: colors.buttonBackground,
                },
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <div style={{
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: '10px',
                    background: "#E3E9E8",
                    boxShadow: "0px 0.6px 1.8px 0px #0000004D",
                  }}>
                    <EditOutlinedIcon sx={{

                      color: colors.primary,
                      width: '24px',
                      height: '24px',
                      borderRadius: "7.2px"
                    }} />
                  </div>
                }
              >
                <Avatar sx={{
                  bgcolor: colors.lightywhite,
                  width: '96px',
                  height: '96px',
                  cursor: 'pointer',
                  fontFamily: 'OpenSans'
                }}>
                  <span style={{
                    fontFamily: "OpenSans",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "28px",
                    color: colors.black,
                    textTransform: "capitalize"
                  }}>{settingData?.basic_details?.org_name?.charAt(0)}</span>
                </Avatar>
              </Badge>
            </IconButton>
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '2px', }}>
              <p
                style={{
                  fontFamily: "OpenSans",
                  fontSize: "24px",
                  fontWeight: 600,
                  lineHeight: "32.68px",
                  textAlign: "left",
                  textUnderlinePosition: "from-font",
                  textDecorationSkipInk: "none",
                  color: colors.black,
                  padding: 0,
                  margin: 0
                }}
              >{settingData?.basic_details?.org_name}</p>
              <p
                style={{
                  fontFamily: "OpenSans",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "32.68px",
                  textAlign: "left",
                  textUnderlinePosition: "from-font",
                  textDecorationSkipInk: "none",
                  color: colors.black,
                  padding: 0,
                  margin: 0
                }}
              >{email}</p>
            </div>
          </div>
          {/* <Button
            onClick={() => { setisEditUserProfile(true) }}
            sx={{
              width: "auto",
              height: "32px",
              padding: "5px",
              paddingLeft: "10px",
              paddingRight: '10px',
              gap: "2px",
              borderRadius: "100px",
              border: `1px solid ${colors.snowywhite}`
            }}>
            <EditOutlinedIcon sx={{
              width: "20px",
              height: "15px",
              color: colors.lightgrey
            }} />
            <Typography sx={{
              fontFamily: "OpenSans",
              fontSize: "12px",
              fontWeight: 400,
              lineHeight: "20px",
              letterSpacing: "0.10000000149011612px",
              textAlign: "center",
              color: colors.lightgrey,
              textTransform: "capitalize"
            }}>Edit</Typography>
          </Button> */}
        </div>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '2px', width: '100%', }}>
          {(selected == 0) && (
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '2px', width: '100%', }}>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: '100%', paddingBottom: "15px", }}>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", gap: '15px', }}>
                  <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", }}>
                    <p
                      style={{
                        fontFamily: "OpenSans",
                        fontSize: "18px",
                        fontWeight: 600,
                        lineHeight: "32.68px",
                        textAlign: "left",
                        textUnderlinePosition: "from-font",
                        textDecorationSkipInk: "none",
                        color: colors.black,
                        padding: 0,
                        margin: 0
                      }}
                    >Basic Details</p>
                  </div>
                </div>
                <Button
                  onClick={() => { setisEditBasic(true) }}
                  sx={{
                    width: "auto",
                    height: "32px",
                    padding: "5px",
                    paddingLeft: "10px",
                    paddingRight: '10px',
                    gap: "2px",
                    borderRadius: "100px",
                    border: `1px solid ${colors.snowywhite}`
                  }}>
                  <EditOutlinedIcon sx={{
                    width: "20px",
                    height: "15px",
                    color: colors.lightgrey
                  }} />
                  <Typography sx={{
                    fontFamily: "OpenSans",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    letterSpacing: "0.10000000149011612px",
                    textAlign: "center",
                    color: colors.lightgrey,
                    textTransform: "capitalize"
                  }}>Edit</Typography>
                </Button>
              </div>
              {userData.map((item, index) => (<div key={index} style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", padding: '2px', width: '100%', paddingBottom: "10px", }}>
                <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                  <p style={Style}>{item.key}</p>
                </div>
                <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                  <span style={{ marginRight: '10px' }}>:</span> <p style={{ ...Style, color: colors.black }}>{item.value}</p>
                </div>
              </div>))}
            </div>
          )}
          {(selected == 1) && (<div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '2px', width: '100%', paddingBottom: "20px", }}>
            <p style={{
              fontFamily: "OpenSans",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "24px",
              letterSpacing: "0.5px",
              textAlign: "left",
              margin: 0,
              padding: 0,
              width: '100%',
              color: colors.primary
            }}>Taxonomy Tags</p>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '10px', }}>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>
                <TreeSpreading data={industrySolutionsData} setSelected={setSelectedSolutions} selected={selectedSolutions} title={"Industry Solutions"} isOpen={true} />
              </div>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>
                <TreeSpreading data={generalITSolutionsData} setSelected={setSelectedSolutions} selected={selectedSolutions} title={"General IT Solutions"} isOpen={true} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>
                <TreeSpreading data={servicesData} setSelected={setSelectedServices} selected={selectedServices} title={"Services"} isOpen={true} />
              </div>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>
                <TreeSpreading data={trainingData} setSelected={setSelectedTraining} selected={selectedTraining} title={"Training"} isOpen={true} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px' }}>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>
                <TreeSpreading data={skillsData} setSelected={setSelectedSkills} selected={selectedSkills} title={"Skills"} isOpen={true} />
              </div>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width: deviceType == "mobile" ? "100%" : "50%", }}>

              </div>
            </div>
          </div>)}
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", gap: '0px', width: '100%', height: "100%", borderTop: "1px solid #BEC9C7", paddingTop: '10px' }}>
          {(selected == 1) ? (<TSIButton
            name={"Back"}
            disabled={false}
            variant={'outlined'}
            padding={"5px 10px"}
            load={false}
            isCustomColors={true}
            customOutlineColor={`1px solid ${colors.browngrey}`}
            customOutlineColorOnHover={`1px solid ${colors.browngrey}`}
            customBgColorOnhover={colors.white}
            customBgColor={colors.white}
            customTextColorOnHover={colors.primary}
            customTextColor={colors.primary}
            handleClick={
              () => {
                setSelected(0)
              }
            }
          />) : (<div></div>)}
          <TSIButton
            name={selected == 0 ? "Next" : "Update"}
            disabled={false}
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
                if (selected == 0) {
                  if (!about) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "About is missing",
                    });

                  } else if (!industry) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "Industry is missing",
                    });
                  } else if (!category) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "Category is missing",
                    });
                  } else if (!startYear) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "Start Year is missing",
                    });
                  } else if (!state?.key) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "state is missing",
                    });
                  } else if (!numofEmployees) {
                    setSnackbar({
                      open: true,
                      severity: "error",
                      message: "No of emp is missing",
                    });
                  } else {
                    setSelected(1)
                  }

                } else {
                  handleEditBusinessData()
                }
              }}
          />
        </div>
        {(isEditUserProfile) && (<TSIEditUserProfile
          open={isEditUserProfile}
          setIsOpen={setisEditUserProfile}
          title={"Edit Company Profile"}
          buttonName1={"Cancel"}
          buttonName2={"Save"}
          btn2Color={colors.primary}
          onClick={() => { }}
        />)}
        {(isEditBasic) && (<TSIEditCompanyBasicDetails
          open={isEditBasic}
          setIsOpen={setisEditBasic}
          title={"Edit Company Profile"}
          buttonName1={"Cancel"}
          buttonName2={"Save"}
          btn2Color={colors.primary}
          data={settingData}
          industry={industry}
          setIndustry={setIndustry}
          category={category}
          setCategory={setCategory}
          numEmployees={numEmployees}
          setNumEmployees={setNumEmployees}
          numofEmployees={numofEmployees}
          setNumofEmployees={setNumofEmployees}
          about={about}
          setAbout={setAbout}
          state={state}
          setState={setState}
          startYear={startYear}
          setStartYear={setStartYear}
          city={city}
          setCity={setCity}
          indVerticles={indVerticles}
          setIndVerticles={setIndVerticles}
          states={states}
          setStates={setStates}
          stateCities={stateCities}
          setStateCities={setStateCities}
          categoryValues={categoryValues}
          setCategoryValues={setCategoryValues}
        />)}
        <TSIConfirmationModal
          open={isDelete}
          title={"Delete Application"}
          desc={"Are you sure you want to delete this application?"}
          buttonName1={"No"}
          buttonName2={"Yes, Delete"}
          btn2Color={colors.primary}
          onClose={() => { setIsDelete(false) }}
          onClick={() => { handleDeleteAccount() }}
        />
      </div>
    )
  }
  else {
    return (
      <div className="centered-container">
        <div className="loader"></div>
      </div>
    );
  }
}

export default TSICompanyProfile
