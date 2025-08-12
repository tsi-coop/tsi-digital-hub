import React, { useEffect, useRef, useState } from 'react';
import colors from '../../../assets/styles/colors';
import useDeviceType from '../../../Utils/DeviceType';
import { Box, Button, Modal, Paper, Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { recaptcha } from '../../../assets';
import RefreshIcon from '@mui/icons-material/Refresh';
const CaptchaTest = ({ isCaptchaMatched, setIsCaptchaMatched, setIsCaptchaModal, isCaptchaModal, call }: any) => {
    const [captchaText, setCaptchaText] = useState('');
    const [input, setInput] = useState('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const deviceType = useDeviceType();
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 4; // Length of the CAPTCHA
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(result);
    };

    useEffect(() => {
        if (isCaptchaModal) {
            generateCaptcha();
        }
    }, [isCaptchaModal]);

    useEffect(() => {
        if (isCaptchaModal) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [isCaptchaModal]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && captchaText) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Clear canvas and set background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f2f2f2';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Character rendering
            const totalTextWidth = captchaText.length * 30; // Approximate width
            const startX = (canvas.width - totalTextWidth) / 2;

            for (let i = 0; i < captchaText.length; i++) {
                const char = captchaText[i];
                const fontSize = 30 + Math.floor(Math.random() * 8);
                const angle = (Math.random() - 0.5) * 0.5; // small rotation
                ctx.font = `${fontSize}px Arial`;
                ctx.save();
                ctx.translate(startX + i * 30, canvas.height / 2);
                ctx.rotate(angle);
                // ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16); // random color
                ctx.fillStyle = '#000'; // random color
                ctx.textBaseline = 'middle';
                ctx.textAlign = 'center';
                ctx.fillText(char, 0, 0);
                ctx.restore();
            }

            // Optional: add noise lines
            for (let i = 0; i < 3; i++) {
                ctx.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }
        }
    }, [captchaText]);

    const doSubmit = () => {
        if (!input) {
            showSnackbar('error', '⚠️ Please enter the CAPTCHA value.');
            return;
        }
        if (input.trim().toUpperCase() === captchaText.toUpperCase()) {
            setIsCaptchaMatched(true);
            showSnackbar('success', '✅ Captcha matched successfully!');
            setIsCaptchaModal(false);
            call();
        } else {
            showSnackbar('error', '❌ Captcha did not match. Please try again.');
            generateCaptcha();
            setInput('');
            inputRef.current?.focus();
        }
    };

    const showSnackbar = (severity: 'success' | 'error', message: string) => {
        setSnackbar({
            open: true,
            severity,
            message,
        });
    };

    const boxRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
                setIsCaptchaModal(false);
            }
        };
        if (isCaptchaModal) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isCaptchaModal]);

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType === 'mobile' ? '75%' : '35%',
        padding: '2%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `1px solid ${colors.lightPrimaryBorder}`,
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    };

    return (
        <div ref={boxRef} className="container mt-5" style={{ ...style, minWidth: '300px' }}>
            {/* <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    sx={{
                        backgroundColor: snackbar.severity === 'error' ? colors.red : colors.primary,
                    }}
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as AlertColor}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar> */}

            <div className="card shadow-sm p-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100%' }}>


                <img src={recaptcha} style={{
                    width: deviceType === 'mobile' ? '100px' : '100px',
                    height: deviceType === 'mobile' ? '100px' : '100px',
                }} />

                <canvas ref={canvasRef} width={300} height={70} style={{ border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} />

                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px', borderRadius: "12px", display: 'flex', alignItems: 'center', width: deviceType == "small-tablet" ? "auto" : "75%", border: "0px solid transparent", boxShadow: "none", backgroundColor: "#f3f7f6ff",
                        height: "40px"
                    }}
                >
                    <input
                        style={{ padding: 8, flex: 1, border: "0px solid transparent", backgroundColor: "transparent", fontSize: "16px", outline: "none", textAlign: 'center' }}
                        placeholder="Enter Characters"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                doSubmit()
                            }
                        }}
                    />

                </Paper>

                {snackbar.open && (
                    <div
                        className={`alert ${snackbar.severity === 'success' ? 'alert-success' : 'alert-danger'}`}
                        role="alert"
                    >
                        {snackbar.message}
                    </div>
                )}

                <div style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'space-between'
                }}>
                    <Button
                        onClick={generateCaptcha}
                        variant="outlined"
                        sx={{
                            border: '0px solid transparent',
                            fontSize: "14px"
                        }}
                        startIcon={<RefreshIcon sx={{
                            border: '0px solid transparent',
                            width: '30px',
                            height: '30px'
                        }} />}
                    >
                        Reload CAPTCHA
                    </Button>

                    <Button
                        variant="outlined"
                        fullWidth
                        color="error"
                        sx={{
                            width: '150px',
                            padding: '8px 12px',
                            textTransform: 'none',
                            color: colors.white,
                            fontFamily: 'Inter',
                            fontSize: '16px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            background: colors.primary,
                            border: `0.5px solid ${colors.white}`,
                        }}
                        onClick={doSubmit}
                    >
                        <span
                            style={{
                                color: colors.white,
                                fontFamily: 'OpenSans',
                                fontSize: '14px',
                                fontWeight: 600,
                                lineHeight: '21px',
                            }}
                        >
                            Verify
                        </span>
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default CaptchaTest;
