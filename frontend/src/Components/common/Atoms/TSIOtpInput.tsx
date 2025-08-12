import React, { useEffect, useRef, useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from './TSIButton';
import { email } from '../../../assets';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { useSearchParams } from 'react-router-dom';
import { Button, Snackbar, Typography } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
const TSIOtpInput = ({
    title,
    text,
    otp,
    setOtp,
    onSubmit
}: any) => {
    const inputRefs: any = useRef([]);
    const deviceType = useDeviceType();
    const [timer, setTimer] = useState(300)
    const [searchParams] = useSearchParams();
    const email1: any = searchParams.get('email');
    const [load, setLoad] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    clearInterval(interval);
                    return 0;
                }
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value.length === 1 && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        } else if (e.key === 'Enter' && otp?.join("")?.length == 4) {
            onSubmit()
        }
    };


    const formatTime = (time: any) => {
        const minutes = String(Math.floor(time / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${minutes}:${seconds}`;
    };
    // 'desktop'
    //     | 'large-desktop'
    //     | 'extra-large-desktop'

    const sendOTP = () => {
        setLoad(true)
        const body = {
            "_func": "send_otp",
            "email": email1,
        }
        apiInstance.login(body)
            .then((response: any) => {
                if (response?.data?._sent) {
                    setTimer(300)
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "OTP Sent successfully",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong with email",
                    });
                }
                setLoad(false)
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
            <div style={{ display: "flex", flexDirection: "column", justifyContent: deviceType === "mobile" ? "center" : "flex-start", alignItems: "center", gap: '30px', width: '100%', marginTop: '10px' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "flex-start", gap: '5px', width: "100%" }}>
                    <img src={email} alt="email" />
                    <p style={{
                        fontFamily: "OpenSans",
                        fontSize: deviceType === "mobile" ? "35px" : "35px",
                        fontWeight: 600,
                        lineHeight: "54.47px",
                        textAlign: "left",
                        margin: 0,
                        padding: 0,
                        color: colors.black,
                    }}>{title}</p>
                    <p style={{
                        fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "22.4px",
                        margin: 0,
                        padding: 0,
                        color: colors.lightgrey,
                        textAlign: "left"
                    }}>
                       {text}
                    </p>
                    <p style={{
                        fontFamily: "OpenSans",
                        fontSize: "14px",
                        fontWeight: 400,
                        lineHeight: "22.4px",
                        margin: 0,
                        padding: 0,
                        color: colors.red,
                        textAlign: "left"
                    }}>
                        If you don't see the OTP, please check your spam folder and mark the email as 'Not Spam'.
                    </p>

                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", gap: deviceType === "mobile" ? "15px" : deviceType == "tablet" ? "20px" : deviceType == "small-tablet" ? "20px" : deviceType === "desktop" ? "20px" : deviceType === "large-desktop" ? "20px" : '30px', width: '100%' }}>
                    {otp.map((digit: any, index: any) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            ref={(el: any) => inputRefs.current[index] = el}
                            value={digit}
                            onChange={(e) => handleInputChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onFocus={(e) => (e.currentTarget.style.border = `1px solid ${colors.primary}`)}
                            onBlur={(e) => (e.currentTarget.style.border = '1px solid #6F7978')}
                            style={{
                                width: deviceType === "mobile" ? "35px" : "50px",
                                height: deviceType === "mobile" ? "35px" : "50px",
                                fontSize: deviceType === "mobile" ? "20px" : "25px",
                                borderRadius: "4px",
                                fontWeight: 400,
                                fontFamily: "OpenSans",
                                border: "1px solid #6F7978",
                                textAlign: "center",
                            }}
                        />
                    ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", gap: '10px', width: "100%" }}>
                    {(timer !== 0) ? (<div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: "space-between",
                        height: '100%'
                    }}>
                        <p style={{
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 600,
                            color: colors.primary,
                            margin: 0,
                            padding: 0,
                        }}>Resend Code?</p>
                        <p style={{
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 400,
                            color: colors.lightgrey,
                            margin: 0,
                            padding: 0,
                        }}>{formatTime(timer)} Minutes</p>
                    </div>) : (
                        <TSIButton
                            name={"Resend"}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "8px 25px"}
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
                                    sendOTP()

                                }
                            }
                        />
                    )}

                    <TSIButton
                        name={"Submit"}
                        disabled={otp.includes('')}
                        variant={'contained'}
                        padding={deviceType == "mobile" ? "5px 15px" : "8px 25px"}
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
                                onSubmit()
                            }
                        }
                    />
                </div>
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
};

export default TSIOtpInput;
