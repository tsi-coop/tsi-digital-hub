import React, { useEffect, useState } from 'react'
import TSISelection from '../../common/Atoms/TSISelection'
import TSITextfield from '../../common/Atoms/TSITextfield'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import { officialLogo, success, backgroundImage } from '../../../assets'
import TSIAlert from '../../common/Molecules/TSIAlert'
import { useNavigate } from 'react-router-dom'
import apiInstance from '../../../services/authService'
import colors from '../../../assets/styles/colors'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import CaptchaTest from '../../common/Atoms/CaptchaTest'

const Login = () => {
    const deviceType = useDeviceType()
    const [open, setOpen] = useState(false)
    const [email, setEmail] = useState("")
    const [load, setLoad] = useState(false)
    const [isCaptchaMatched, setIsCaptchaMatched] = useState<Boolean>(false);
    const [isCaptchaModal, setIsCaptchaModal] = useState(false);

    const navigation = useNavigate()
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    useEffect(() => {
        // localStorage.clear()
        localStorage.removeItem("token")
        localStorage.removeItem("role")
        localStorage.removeItem("email")
        localStorage.removeItem("name")
    }, [])
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const isValidEmail = (email: any) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    function getCookie(name: string): string | undefined {
        const cookieString = document.cookie;
        const cookies = cookieString.split('; ').reduce<Record<string, string>>((acc, current) => {
            const [key, value] = current.split('=');
            acc[key] = value;
            return acc;
        }, {});
        return cookies[name];
    }

    const sendOTP = () => {
        setLoad(true)
        const body = {
            "_func": "send_otp",
            "email": email,
        }
        apiInstance.login(body)
            .then((response: any) => {
                if (response?.data?._sent) {
                    navigation(`/otp?email=${email?.toLowerCase()}`)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong with email",
                    });
                }
            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error?.message || "Something went wrong",
                });
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
                <img src={officialLogo} style={{
                    width: "105.39px",
                    height: "62.98px",
                    top: "3%",
                    left: "3%",
                    position: "absolute"
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "80%" : "30%", height: '100%', }}>
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
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '0px', width: "100%" }}>
                        <p style={{
                            fontFamily: "OpenSans",
                            fontSize: "40px",
                            fontWeight: 600,
                            lineHeight: "54.47px",
                            textAlign: "center",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                            margin: 0,
                            padding: 0,
                            paddingBottom: '10px'
                        }} >Welcome back!</p>
                        <p style={{
                            fontFamily: "OpenSans",
                            fontSize: "16px",
                            fontWeight: 400,
                            lineHeight: "22.4px",
                            letterSpacing: "-0.02em",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                            margin: 0,
                            padding: 0,
                            color: colors.lightgrey,
                            paddingBottom: "30px"
                        }}>Please enter your details to login </p>
                    </div>

                    <TSITextfield
                        title={"Email"}
                        placeholder={"Email"}
                        value={email?.toLowerCase()}
                        isRequired={true}
                        type={"text"}
                        name={"field"}
                        multiline={false}
                        rows={1}
                        onKeyDown={() => {
                            if (email) {
                                if (isCaptchaMatched) {
                                    sendOTP()
                                } else {
                                    setIsCaptchaModal(true)
                                }
                            }
                            /*if (email) {
                                if (document.cookie.includes('user_consent=true')) {
                                    if (isCaptchaMatched) {
                                        sendOTP()
                                    } else {
                                        setIsCaptchaModal(true)
                                    }
                                } else {
                                    setSnackbar({
                                        open: true,
                                        severity: 'error',
                                        message: "Please accept the privacy policy to continue",
                                    });
                                }
                            }*/
                        }}
                        handleChange={(e: any) => { setEmail(e.target.value) }}
                        previewMode={false}
                    />
                    {(isCaptchaModal) && (<CaptchaTest
                        isCaptchaMatched={isCaptchaMatched}
                        setIsCaptchaMatched={setIsCaptchaMatched}
                        setIsCaptchaModal={setIsCaptchaModal}
                        isCaptchaModal={isCaptchaModal}
                        call={() => { sendOTP() }}
                    />)}

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", gap: '10px', width: "100%", paddingRight: "10px", paddingBottom: "10px" }}>
                        <TSIButton
                            name={"Continue"}
                            disabled={!isValidEmail(email)}
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
                                    if (isCaptchaMatched) {
                                        sendOTP()
                                    } else {
                                        setIsCaptchaModal(true)
                                    }
                                    /*if (email) {
                                        if (document.cookie.includes('user_consent=true')) {
                                            if (isCaptchaMatched) {
                                                sendOTP()
                                            } else {
                                                setIsCaptchaModal(true)
                                            }
                                        } else {
                                            setSnackbar({
                                                open: true,
                                                severity: 'error',
                                                message: "Please accept the privacy policy to continue",
                                            });
                                        }
                                    }*/
                                }
                            }
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px', width: "100%", backgroundColor: colors.lightPrimary, padding: "15px", borderRadius: "8px" }}>
                        <div style={{
                            display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px'
                        }}>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "12px",
                                fontWeight: 400,
                                lineHeight: "16.8px",
                                letterSpacing: " -0.02em",
                                textAlign: "left",
                                margin: 0,
                                padding: 0,
                                color: colors.primary
                            }}>Don’t have an account?</p>
                            <p style={{
                                fontFamily: "OpenSans",
                                fontSize: "14px",
                                fontWeight: 600,
                                lineHeight: "19.6px",
                                letterSpacing: " -0.02em",
                                textAlign: "left",
                                margin: 0,
                                padding: 0,
                                color: colors.black
                            }}>Join Us and Explore the offerings </p>
                        </div>
                        <TSIButton
                            name={"Register"}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.lightPrimaryBorder}`}
                            customOutlineColorOnHover={`1px solid ${colors.lightPrimaryBorder}`}
                            customBgColorOnhover={colors.lightPrimary}
                            customBgColor={colors.lightPrimary}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    navigation("/register")
                                }
                            }
                        />
                    </div>
                </div>


                <TSIAlert
                    isOpen={open}
                    setIsOpen={setOpen}
                    onSubmit={setOpen}
                    title={"Success"}
                    text={"Your account created successfully"}
                    buttonName1={"No"}
                    buttonName2={"Setup Profile"}
                    image={success}
                />
            </div >
        )
    } else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default Login
