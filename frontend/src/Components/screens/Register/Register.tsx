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


const Register = () => {
    const deviceType = useDeviceType()
    const [selected, setSelected] = useState<any>("Business Admin");
    const [name, setName] = useState<any>("");
    const [organisation, setOrganisation] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [load, setLoad] = useState(false)
    const [isCaptchaMatched, setIsCaptchaMatched] = useState<Boolean>(false);
    const [isCaptchaModal, setIsCaptchaModal] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState(email);
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
        if (selected === "Tech Professional") {
            return !(selected && name);
        } else if (selected === "Business Admin") {
            return !(selected && isValidEmail(email) && organisation && name);
        } else if (selected === "Ambassador") {
            return !(selected && isValidEmail(email) && name);
        }
        return true;
    };
    const options = [
        {
            icon: business,
            name: "Business Admin"
        },
        {
            icon: account,
            name: "Tech Professional"
        },
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
                "type": selected == "Business Admin" ? "BUSINESS" : selected == "Ambassador" ? "AMBASSADOR" : "PROFESSIONAL"
            }

            apiInstance.doRegister(body)
                .then((response: any) => {
                    if (response.data._exists == true) {
                        setIsEmailExist(true)
                        setLoad(false)
                    } else if (response.data._exists == false) {
                        localStorage.setItem("name", name)
                        if (selected == "Tech Professional") {
                            if (selected && name) {
                                handleRegister()
                            }
                        } else if (selected == "Business Admin") {
                            if (selected && email && organisation && name) {
                                handleRegister()
                            }
                        } else if (selected == "Ambassador") {
                            handleRegister()
                        }
                        setIsEmailExist(false)
                    }
                    setLoad(false)
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
                    if (selected == "Business Admin") {
                        navigation(`/registerOTP?org=${organisation}&&usertype=${selected == "Business Admin" ? "BUSINESS" : selected == "Tech Professional" ? "PROFESSIONAL" : ""}&&email=${email}`)
                    } else if (selected == "Tech Professional") {
                        navigation(`/registerOTP?usertype=${selected == "Business Admin" ? "BUSINESS" : "PROFESSIONAL"}&&email=${email}`)
                    } else if (selected == "Ambassador") {
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

    const isValidBusinessEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const personalDomains = [
            "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "live.com", "icloud.com"
        ];

        if (!emailRegex.test(email)) return false;

        const domain = email.split("@")[1]
        return domain && !personalDomains.includes(domain.toLowerCase()) ? true : false;
    };

    const isValidPersonalEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const personalDomains = [
            "gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "live.com", "icloud.com"
        ];

        if (!emailRegex.test(email)) return false;

        const domain = email.split("@")[1];
        return domain && personalDomains.includes(domain.toLowerCase()) ? true : false;
    };




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
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '10px', width: "100%", paddingBottom: "10px" }}>
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

                        }} >Register</p>
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
                    <TSISelection
                        selected={selected}
                        setSelected={setSelected}
                        options={options}
                    />
                    {(selected == "Business Admin") && (
                        <>
                            <TSITextfield
                                title={"Organisation Name"}
                                placeholder={"Enter Organisation Name"}
                                value={organisation}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setOrganisation(event.target.value) }}
                            />

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
                                title={selected == "Business Admin" ? "Business Email" : "Email"}
                                placeholder={selected == "Business Admin" ? "Business Email" : "Email"}
                                value={email?.toLowerCase()}
                                isRequired={true}
                                type={"text"}
                                errorMessage={
                                    isEmailExist
                                        ? "Account already exist...!"
                                        : (selected === "Business Admin" && email && !isValidBusinessEmail(email)
                                            ? "Please enter your company email id"
                                            : "")
                                }
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setEmail(event?.target.value) }}
                                previewMode={false}
                            />
                        </>
                    )}

                    {(selected == "Tech Professional") && (
                        <>
                            <TSITextfield
                                title={"Name"}
                                placeholder={"Enter Name"}
                                value={name}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setName(event.target.value) }}
                                previewMode={false}
                            />

                            <TSITextfield
                                title={"Email"}
                                placeholder={"Email"}
                                value={email?.toLowerCase()}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                errorMessage={
                                    isEmailExist
                                        ? "Account already exist...!"
                                        : (selected === "Tech Professional" && email && !isValidPersonalEmail(email)
                                            ? "Please enter your personal gmail/yahoo/outlook email id"
                                            : "")
                                }
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setEmail(event?.target.value) }}
                                previewMode={false}
                            />

                            <div style={{ height: "40px" }}>

                            </div>
                        </>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end", alignItems: "center", gap: '10px', width: "100%" }}>
                        <TSIButton
                            name={"Continue"}
                            disabled={isDisabled()}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
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
                                   /* if (document.cookie.includes('user_consent=true')) {
                                        if (isCaptchaMatched) {
                                            handleEmailExist()
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
                                    */
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
                            customOutlineColor={`1px solid ${colors.lightPrimaryBorder}`}
                            customOutlineColorOnHover={`1px solid ${colors.lightPrimaryBorder}`}
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
                    call={() => { handleEmailExist() }}
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

export default Register
