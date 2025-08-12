import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { calender, image, man, success } from '../../../assets';
import colors from '../../../assets/styles/colors';
import TSIPopup from '../../common/Molecules/TSIPopup';
import TSIJobAddModal from '../../common/Molecules/TSIJobAddModal';
import TSIConfirmationModal from '../../common/Molecules/TSIConfirmationModal';
import TSIMessage from '../../common/Molecules/TSIMessage';
import TSIUserProfile from '../../common/Molecules/TSIUserProfile';
import TSIUserManagement from '../../common/Molecules/TSIUserManagement';
import TSICompanyProfile from '../../common/Molecules/TSICompanyProfile';
import TSIExportData from '../../common/Molecules/TSIExportData';
import TSIKYC from '../../common/Molecules/TSIKYC';
import TSIKYCAddModal from '../../common/Molecules/TSIKYCAddModal';
import apiInstance from '../../../services/authService';
import TSIAmbassadorProfile from '../../common/Molecules/TSIAmbassadorProfile';
const Settings = () => {
  const deviceType = useDeviceType()
  const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
  const role = localStorage.getItem("role")
  const [selected, setSelected] = useState<any>(role == "ADMIN" ? "Admin Profile" : role == "BUSINESS" ? "Organisation Profile" : role == "PROFESSIONAL" ? "My Profile" : role == "AMBASSADOR" ? "My Ambassador" : "");
  const [jobOpen, setJobOpen] = useState<any>(false);
  const [open, setOpen] = useState<any>(false);
  const [isDelete, setIsDelete] = useState<any>(false);
  const [isMessage, setIsMessage] = useState<any>(false);
  const [load, setLoad] = useState(false)
  const [settingData, setSettingData] = useState([])
  const email: any = localStorage.getItem("email")
  useEffect(() => {
    if (email) {
      getOrgData()
    }
  }, [email])

  const getOrgData = () => {
    setLoad(true)

    const getDomainFromEmail = () => email.split("@")[1] || null;
    const orgbody = {
      "_func": "get_org_profile_for_editing",
      "account_slug": getDomainFromEmail()
    }
    const ambbody = {
      "_func": "get_ambassador_profile_for_editing",
      "account_slug": email
    }
    const profbody = {
      "_func": "get_talent_profile_for_editing",
      "account_slug": email
    }
    const adminbody = {
      "_func": "get_org_profile_for_editing",
      "account_slug": email
    }
    apiInstance.getUserData(
      role == "PROFESSIONAL" ? profbody :
        role == "BUSINESS" ? orgbody :
          role == "AMBASSADOR" ? ambbody :
            role == "ADMIN" ? adminbody :
              {}
    )
      .then((response: any) => {
        if (response.data) {

          setSettingData(response.data)
        }
        setLoad(false)
      })
      .catch((error: any) => {
        setLoad(false)

      });
  }

  if (!load) {
    return (
      <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '92%' }}>

        <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", }}>

          <div style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollbarWidth: "none", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", }}>

            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", width: '100%', height: '100%', }}>
              <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", }}>
                <p style={{
                  margin: 0,
                  paddingBottom: "10px",
                  fontFamily: "OpenSans",
                  fontSize: "24px",
                  fontWeight: 600,
                  lineHeight: "32.68px",
                  textAlign: "left",
                  textUnderlinePosition: "from-font",
                  textDecorationSkipInk: "none",
                }}>Settings</p>
              </div>
              <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '0px', width: '100%', height: "100%", overflowY: "scroll", scrollbarWidth: "none" }}>
                <div style={{
                  display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", width: '100%', height: "40px", fontFamily: "Opensans",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "20px",
                  letterSpacing: "0.16px",
                  textAlign: "left",
                  gap: '20px',
                  borderBottom: "1px solid #BEC9C7"
                }}>
                  {

                    (
                      role == "ADMIN" ? [
                        { name: "Admin Profile" },
                        { name: "User Management" },
                      ] :
                        role == "BUSINESS" ? [
                          { name: "Organisation Profile" },
                          { name: "User Management" },
                          // { name: "KYC" },
                          // { name: "Export Data" },
                          // { name: "Cancel Account" }
                        ] : role == "PROFESSIONAL" ? [
                          { name: "My Profile" },
                          // { name: "KYC" },
                          // { name: "Professional Preferences" },
                          // { name: "Export Data" },
                          // { name: "Cancel Account" }
                        ] : role == "AMBASSADOR" ? [
                          { name: "My Ambassador" },
                          // { name: "KYC" },
                          // { name: "Export Data" },
                          // { name: "Ambassador Preferences" },
                          // { name: "Cancel Account" }
                        ] : [])?.map((item: any, index: number) => (
                          <div
                            onClick={() => { setSelected(item.name) }}
                            key={index}
                            style={{
                              display: "flex",
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: "flex-start",
                              fontFamily: '16px',
                              height: '40px',
                              color: colors.darkblack,
                              paddingLeft: "10px",
                              gap: '10px',
                              overflow: "scroll",
                              scrollbarWidth: "none",
                              borderBottom: (item.name == selected) ? `2px solid ${colors.primary}` : "",
                            }}
                          >
                            {item?.name}
                          </div>
                        ))
                  }
                </div>
                <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", padding: '0px', gap: '10px', width: '100%', height: "90%", overflow: 'scroll', scrollbarWidth: "none" }}>
                  {(selected == "User Management") && (<TSIUserManagement
                  />)}
                  {(selected == "Organisation Profile") && (<TSICompanyProfile
                    settingData={settingData}
                    onCall={getOrgData}
                  />)}
                  {(selected == "Admin Profile") && (<TSICompanyProfile
                    settingData={settingData}
                    onCall={getOrgData}
                  />)}

                  {(selected == "My Profile") && (<TSIUserProfile
                    settingData={settingData}
                    onCall={getOrgData}
                  />)}
                  {(selected == "Export Data") && (<TSIExportData
                  />)}
                  {(selected == "My Ambassador") && (<TSIAmbassadorProfile
                    settingData={settingData}
                    onCall={getOrgData}
                  />)}
                  {(selected == "KYC") && (<TSIKYC
                  />)}
                  {(selected == "Cancel Account") && (
                    <></>
                  )}
                </div>

              </div>


            </div>

          </div>

        </div>

        {(jobOpen) && (<TSIJobAddModal
          isOpen={jobOpen}
          setIsOpen={setJobOpen}
          onSubmit={() => { setJobOpen(false); setOpen(true) }}
          modaltitle={"Jobs"}
          tree1Title={"Solutions"}
          tree2Title={"Services"}
          tree3Title={"Skills"}
        />)}

        {(open) && (<TSIPopup
          isOpen={open}
          setIsOpen={setOpen}
          text1={"Success"}
          text2={"Your account created successfully"}
          buttonName={"Go to Home"}
          image={success}
          onSubmit={() => { setOpen(false) }}
        />)}

        <TSIConfirmationModal
          open={isDelete}
          title={"Delete Application"}
          desc={"Are you sure you want to delete this application?"}
          buttonName1={"No"}
          buttonName2={"Yes, Delete"}
          btn2Color={colors.saturatedRed}
          onClick={() => { setIsDelete(false) }}
        />

        <TSIMessage
          open={isMessage}
          setIsOpen={setIsMessage}
          title={"Invite Discussion"}
          buttonName2={"Send"}
          btn2Color={colors.primary}
          onClick={() => { }}
        />


      </div >
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

export default Settings
