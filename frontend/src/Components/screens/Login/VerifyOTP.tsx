import React, { useState } from 'react'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import { officialLogo, success } from '../../../assets'
import TSIPopup from '../../common/Molecules/TSIPopup'
import TSIAlert from '../../common/Molecules/TSIAlert'
import TSIOtpInput from '../../common/Atoms/TSIOtpInput'
import { backgroundImage } from '../../../assets'
import { useNavigate, useSearchParams } from 'react-router-dom'
import apiInstance from '../../../services/authService'
import { Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import colors from '../../../assets/styles/colors'
const VerifyOTP = () => {
    const deviceType = useDeviceType()
    const [open, setOpen] = useState(false)
    const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
    const [searchParams] = useSearchParams();
    const email: any = searchParams.get('email');
    const [load, setLoad] = useState(false)
    const [userData, setUserData] = useState<any>({})
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const handleSubmit = () => {
        setOpen(true)
    };

    const navigation = useNavigate()

    const handleVerifyOTP = () => {
        setLoad(true)
        const body = {
            "_func": "login",
            "email": email,
            "otp": otp?.join("")
        }
        apiInstance.login(body)
            .then((response: any) => {
                if (response.data) {
                    if (response?.data?._auth == true) {
                        setUserData({
                            "token": response.data._token,
                            "role": response.data._system,
                            "name": response.data._name
                        })
                        localStorage.setItem("token", response.data._token)
                        localStorage.setItem("role", response.data._system)
                        localStorage.setItem("email", email)
                        localStorage.setItem("name", response.data._name)
                        setTimeout(() => {
                            navigation("/community")
                        }, 1000)
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: 'Successfully Logged In',
                        });

                    } else if (response?.data?._auth == false) {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: 'Authentication Failed',
                        });
                    } else {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: 'Authentication Failed',
                        });
                    }
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
                <img src={officialLogo} style={{
                    width: "105.39px",
                    height: "62.98px",
                    top: "3%",
                    left: "3%",
                    position: "absolute"
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "80%" : deviceType == "extra-large-desktop" ? "30%" : deviceType == "desktop" ? "35%" : deviceType == "large-desktop" ? "30%" : "30%", height: '100%', }}>

                    <TSIOtpInput
                        otp={otp}
                        setOtp={setOtp}
                        title={"Check your email address"}
                        text={"We have sent you a OTP for the email verification. Enter the received"}
                        onSubmit={() => { handleVerifyOTP() }}
                    />

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
                    onSubmit={() => {
                        localStorage.setItem("role", userData.role)
                        localStorage.setItem("token", userData.token)
                        localStorage.setItem("email", email)
                        localStorage.setItem("name", userData.name)
                        setTimeout(() => {
                            navigation("/community")
                        }, 1000)
                    }}
                    text1={"Success"}
                    text2={"You have logged In"}
                    buttonName={"Go to community"}
                    image={success}
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

export default VerifyOTP
