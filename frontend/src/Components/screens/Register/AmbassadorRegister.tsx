import React, { useEffect, useState } from 'react'
import TSISelection from '../../common/Atoms/TSISelection'
import TSITextfield from '../../common/Atoms/TSITextfield'
import TSIButton from '../../common/Atoms/TSIButton'
import useDeviceType from '../../../Utils/DeviceType'
import { account, adminB, alertCircle, ambassador, backgroundImage, business, officialLogo, success } from '../../../assets'
import { useNavigate } from 'react-router-dom'
import apiInstance from '../../../services/authService'
import colors from '../../../assets/styles/colors'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { isValidEmail, validateEmail } from '../../../Utils/validations'
import CaptchaTest from '../../common/Atoms/CaptchaTest'

const AmbassadorRegister = () => {
    const deviceType = useDeviceType()
    const [selected, setSelected] = useState<any>("Ambassador");
    const [name, setName] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [load, setLoad] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState(email);
    const [isCaptchaMatched, setIsCaptchaMatched] = useState<Boolean>(false);
    const [isCaptchaModal, setIsCaptchaModal] = useState(false);
    const [isEmailExist, setIsEmailExist] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const navigation = useNavigate()
    const isDisabled = () => {
        if (selected === "Ambassador") {
            return !(selected && isValidEmail(email) && name);
        }
        return true;
    };
    const options = [

        {
            icon: ambassador,
            name: "Ambassador"
        }
    ];

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(email);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }, [email]);


    const handleEmailExist = () => {
        if (validateEmail(email)) {
            setLoad(true)
            const body = {
                "_func": "dedup_account",
                "email": email,
                "type": "AMBASSADOR"
            }

            apiInstance.doRegister(body)
                .then((response: any) => {
                    if (response.data._exists == true) {
                        setIsEmailExist(true)
                        setLoad(false)
                    } else if (response.data._exists == false) {
                        localStorage.setItem("name", name)
                        if (selected == "Ambassador") {
                            handleRegister()
                        }
                        setIsEmailExist(false)
                        setLoad(false)
                    }

                })
                .catch((error) => {
                    setLoad(false)
                    setIsEmailExist(false)
                });
        }
    }

    const handleRegister = () => {
        setLoad(true)
        const body = {
            "_func": "register_member_send_otp",
            "email": email,
            "account_type": selected == "Business Admin" ? "BUSINESS" : selected == "Ambassador" ? "AMBASSADOR" : "PROFESSIONAL"
        }

        apiInstance.doRegister(body)
            .then((response: any) => {
                if (response.data._sent == true) {
                    if (selected == "Ambassador") {
                        navigation(`/registerOTP?usertype=AMBASSADOR&&email=${email}`)
                    }
                    setLoad(false);
                } else {
                    setLoad(false);
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
                    message: error?.message || "Something went wrong",
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


                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: deviceType == "mobile" ? "flex-start" : "center", alignItems: "flex-start", gap: '20px', width: deviceType == "mobile" ? "100%" : (deviceType == "large-desktop" || deviceType == "extra-large-desktop") ? "25%" : "35%", height: '100%', padding: deviceType == "mobile" ? "20px" : "0px" }}>
                    {(deviceType == "mobile") && (<img src={officialLogo} style={{
                        width: "105.39px",
                        height: "62.98px",
                        top: "3%",
                        left: "3%",
                    }} />)}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px', width: "100%", paddingBottom: "15px" }}>
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

                        }}>Register</p>
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
                        }}>Join our platform to explore the offerings</p>
                    </div>

                    <>
                        <TSITextfield
                            title={"Name"}
                            placeholder={"Enter name"}
                            value={name}
                            isRequired={true}
                            type={"text"}
                            name={"field"}
                            multiline={false}
                            rows={1}
                            handleChange={(event: any) => {
                                setName(event?.target.value);

                            }}
                            previewMode={false}
                        />
                        <TSITextfield
                            title={"Ambassador Email"}
                            placeholder={"Ambassador Email"}
                            value={email?.toLowerCase()}
                            isRequired={true}
                            type={"text"}
                            errorMessage={isEmailExist && "Account already exist...!"}
                            name={"field"}
                            multiline={false}
                            rows={1}
                            handleChange={(event: any) => { setEmail(event?.target.value) }}
                            previewMode={false}
                        />
                        <div style={{ height: "40px" }}>

                        </div>
                    </>




                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", gap: '10px', width: "100%" }}>
                        <TSIButton
                            name={"Continue"}
                            disabled={isDisabled()}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.lightPrimaryBorder}`}
                            customOutlineColorOnHover={`1px solid ${colors.lightPrimaryBorder}`}
                            customBgColorOnhover={colors.primary}
                            customBgColor={isDisabled() ? colors.lightPrimary : colors.primary}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    if (isCaptchaMatched) {
                                        handleEmailExist()
                                    } else {
                                        setIsCaptchaModal(true)
                                    }
                                }
                            }
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px', width: "100%", backgroundColor: colors.lightPrimary, padding: "15px", borderRadius: "8px" }}>
                        <div style={{

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
                                color: colors.black,
                                paddingBottom: '5px'
                            }}>Already have an account?</p>
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
                            }}>Explore the Offerings </p>
                        </div>
                        <TSIButton
                            name={"Login"}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover={colors.lightPrimary}
                            customBgColor={colors.lightPrimary}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    navigation("/login")
                                }
                            }
                        />
                    </div>
                </div>

                {(isCaptchaModal) && (<CaptchaTest
                    isCaptchaMatched={isCaptchaMatched}
                    setIsCaptchaMatched={setIsCaptchaMatched}
                    setIsCaptchaModal={setIsCaptchaModal}
                    isCaptchaModal={isCaptchaModal}
                    call={() => {
                        handleEmailExist()
                    }}
                />)}




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

export default AmbassadorRegister
