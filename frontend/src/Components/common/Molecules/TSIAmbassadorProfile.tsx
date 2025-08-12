import { Avatar, Badge, Button, Checkbox, Collapse, IconButton, ListItem, ListItemText, Modal, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import colors from '../../../assets/styles/colors'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TSIButton from '../Atoms/TSIButton';
import TSIEditUserProfile from './TSIEditUserProfile';
import TSIConfirmationModal from './TSIConfirmationModal';
import CloseIcon from '@mui/icons-material/Close';
import apiInstance from '../../../services/authService';
import useDeviceType from '../../../Utils/DeviceType';
import TreeSpreading from './TreeSpreading';
import TSITextfield from '../Atoms/TSITextfield';
const TSIAmbassadorProfile = ({ settingData, onCall }: any) => {
  const deviceType = useDeviceType()
  const [isDelete, setIsDelete] = useState<any>(false);
  const [industrySolutionsData, setIndustrySolutionsData] = useState<any>([]);
  const [generalITSolutionsData, setGeneralITSolutionsData] = useState<any>([]);
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [selectedTraining, setSelectedTraining] = useState<any>([]);
  const [selectedSolutions, setSelectedSolutions] = useState<any>([]);
  const [selectedSkills, setSelectedSkills] = useState<any>([]);
  const [trainingData, setTrainingData] = useState<any>([]);
  const [servicesData, setServicesData] = useState<any>([]);
  const [skillsData, setSkillsData] = useState<any>([]);
  const [about, setAbout] = useState<any>(settingData?.basic_details?.about);
  const [load, setLoad] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const email = localStorage.getItem("email")
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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



  const handleEditAmbassadorData = () => {
    setLoad(true);
    const name = localStorage.getItem("name")

    const body = {
      "_func": "edit_ambassador_details",
      "name": name,
      "about": about,
      "solutions_interested": selectedSolutions?.filter((item:any) => item != null),
      "services_interested": selectedServices?.filter((item:any) => item != null),
      "trainings_interested": selectedTraining?.filter((item:any) => item != null),
      "skills_interested": selectedSkills?.filter((item:any) => item != null)
    }

    apiInstance.getUserData(body)
      .then((response: any) => {
        if (response.data?._edited) {
          onCall()
          setSnackbar({
            open: true,
            severity: "success",
            message: "Updated successfully",
          });
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

  useEffect(() => {
    if (settingData?.interests) {
      setSelectedSolutions(settingData.interests?.solutions_interested || []);
      setSelectedServices(settingData.interests?.services_interested || []);
      setSelectedTraining(settingData.interests?.training_interested || []);
      setSelectedSkills(settingData.interests?.skills_interested || []);
    }
    fetchData({"_func": "get_all_industry_solutions_tree"}, setIndustrySolutionsData);
    fetchData({ _func: 'get_general_it_solutions_tree' }, setGeneralITSolutionsData);
    fetchData({ _func: 'get_services_tree' }, setServicesData);
    fetchData({ _func: 'get_trainings_tree' }, setTrainingData);
    fetchData({ _func: 'get_skills_tree' }, setSkillsData);
  }, []);


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
  if (!load) {
    return (
      <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '10px', gap: '10px', width: '100%', height: "100%" }}>

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
                  }}>{settingData?.basic_details?.name?.charAt(0)}</span>
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
              >{settingData?.basic_details?.name}</p>
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

        </div>
        <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", width: '100%', paddingBottom: "20px", borderBottom: "1px solid #BEC9C7" }}>
          <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", padding: '2px', width: '100%', borderBottom: "1px solid #BEC9C7", marginBottom: '20px' }}>
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
                onClick={() => { setIsOpen(true) }}
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
            {[{
              key: "About",
              value: about
            },].map((item, index) => (<div key={index} style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", padding: '2px', width: '100%', paddingBottom: "10px", }}>
              <div style={{ display: "flex", flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", width: '25%', gap: '10px' }}>
                <p style={{
                  fontFamily: "OpenSans",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "0.5px",
                  textAlign: "left",
                  margin: 0,
                  padding: 0,
                  color: colors.lightgrey
                }}>{item.key}</p>
              </div>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", width: '75%', }}>
                <span style={{ marginRight: '10px' }}>:</span> <p style={{
                  fontFamily: "OpenSans",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "24px",
                  letterSpacing: "0.5px",
                  textAlign: "left",
                  margin: 0,
                  padding: 0,
                  color: colors.black
                }}>{item.value}</p>
              </div>
            </div>))}
          </div>
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
          }}>Taxonomies Tags</p>

          <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px', }}>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>
              <TreeSpreading data={industrySolutionsData} setSelected={setSelectedSolutions} selected={selectedSolutions} title={"Industry Solutions"} isOpen={true} />
            </div>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>
              <TreeSpreading data={generalITSolutionsData} setSelected={setSelectedSolutions} selected={selectedSolutions} title={"General IT Solutions"} isOpen={true} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>
              <TreeSpreading data={servicesData} setSelected={setSelectedServices} selected={selectedServices} title={"Services"} isOpen={true} />
            </div>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>
              <TreeSpreading data={trainingData} setSelected={setSelectedTraining} selected={selectedTraining} title={"Training"} isOpen={true} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: deviceType == "mobile" ? "column" : 'row', justifyContent: "space-evenly", alignItems: "flex-start", gap: '20px', width: "100%", marginTop: '20px' }}>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>
              <TreeSpreading data={skillsData} setSelected={setSelectedSkills} selected={selectedSkills} title={"Skills"} isOpen={true} />
            </div>
            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", width:  deviceType == "mobile" ? "100%":"50%", }}>

            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-end", alignItems: "flex-start", gap: '0px', width: '100%', height: "100%" }}>
          {/* <TSIButton
            name={"Delete Account"}
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
                setIsDelete(true)
              }
            }
          /> */}
          <TSIButton
            name={"Update"}
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
                handleEditAmbassadorData()
              }
            }
          />
        </div>




        <Modal
          open={isOpen}
          onClose={() => { setIsOpen(false) }}
          sx={{
            border: "0px solid transparent"
          }}
        >
          <div style={{ ...style, height: '40%' }}>
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
                  height: '80%',
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
                      fontSize: deviceType === 'mobile' ? '20px' : '20px',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      textAlign: 'left',
                      margin: '0px',
                    }}
                  >
                    Edit Ambassador Profile
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
                    height: '80%',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    gap: '20px',
                    paddingTop: "10px"
                  }}
                >

                  <TSITextfield
                    title={"About"}
                    placeholder={`Enter About`}
                    value={about}
                    type={"text"}
                    name={"field"}
                    multiline={true}
                    rows={3}
                    handleChange={(event: any) => { setAbout(event.target.value) }}
                  />

                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: "center",
                  justifyContent: "center",
                  width: '100%',
                  height: '20%',
                  padding: '10px',
                  gap: '5px',
                  borderTop: `1px solid ${colors.grey80}`
                }}
              >

                <TSIButton
                  name={"Okay"}
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
                      setIsOpen(false)
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
        </Modal>




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

export default TSIAmbassadorProfile
