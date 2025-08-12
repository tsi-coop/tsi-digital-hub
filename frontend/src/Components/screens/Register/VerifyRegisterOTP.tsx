import React, { useState } from 'react'
import TSISelection from '../../common/Atoms/TSISelection'
import TSITextfield from '../../common/Atoms/TSITextfield'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import { backgroundImage, business, officialLogo, success } from '../../../assets'
import TSIPopup from '../../common/Molecules/TSIPopup'
import TSIOtpInput from '../../common/Atoms/TSIOtpInput'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import apiInstance from '../../../services/authService'
import colors from '../../../assets/styles/colors'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
const VerifyRegisterOTP = () => {
  const deviceType = useDeviceType()
  const [open, setOpen] = useState(false)
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selected: any = params.get('usertype');
  const organisation = params?.get('org');
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const [load, setLoad] = useState(false)
  const [searchParams] = useSearchParams();
  const email: any = searchParams.get('email');
  const navigation = useNavigate()
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRegMemSendOTP = () => {
    setLoad(true)
    const body = {
      "_func": "validate_member_otp",
      "email": email,
      "otp": otp?.join("")
    }

    apiInstance.doRegister(body)
      .then((response: any) => {
        if (response.data._auth) {
          // setOpen(true)

          localStorage.setItem("token", response.data._token)
          if (selected) {
            localStorage.setItem("role", selected)
          }
          localStorage.setItem("email", email)
          setTimeout(() => {
            if (selected == "BUSINESS") {
              navigation(`/businesssetup?org=${organisation}`)
            } else if (selected == "PROFESSIONAL") {
              navigation("/techsetup")
            } else if (selected == "AMBASSADOR") {
              navigation("/ambassadorsetup")
            }
          }, 1000)
          setLoad(false)
        } else {
          setLoad(false)
          setSnackbar({
            open: true,
            severity: 'error',
            message: response.data?.code || "Something went wrong",
          })
        }
      })
      .catch((error: any) => {
        setLoad(false)
        setSnackbar({
          open: true,
          severity: 'error',
          message: error?.code || "Something went wrong",
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
        backgroundColor: colors.white
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
        {(deviceType !== "mobile") && (<img src={officialLogo} style={{
          width: "105.39px",
          height: "62.98px",
          top: "3%",
          left: "3%",
          position: "absolute"
        }} alt='/blank' />)}

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "80%" : deviceType == "extra-large-desktop" ? "25%" : deviceType == "desktop" ? "40%" : deviceType == "large-desktop" ? "25%" : "35%", height: '100%', }}>
          

          <TSIOtpInput
            otp={otp}
            setOtp={setOtp}
            title={"Check your email address"}
            text={"We have sent you a OTP for the email verification. Enter the received"}
            onSubmit={() => { handleRegMemSendOTP() }}
          />


        </div>

        <TSIPopup
          isOpen={open}
          setIsOpen={setOpen}
          text1={"Success"}
          text2={"Your account created successfully"}
          buttonName={"Setup Profile"}
          image={success}
          onSubmit={() => {
            if (selected == "BUSINESS") {
              navigation(`/businesssetup?org=${organisation}`)
            } else if (selected == "PROFESSIONAL") {
              navigation("/techsetup")
            } else if (selected == "AMBASSADOR") {
              navigation(`/ambassadorsetup`)
            }
          }}
        />

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

export default VerifyRegisterOTP

