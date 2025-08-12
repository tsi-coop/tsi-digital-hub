import { Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import apiInstance from '../../../services/authService';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
const TSIEditUserRoleChange = ({ open, setIsOpen, userObj, title, buttonName1, buttonName2, btn2Color, refreshUserList }: any) => {
    const deviceType = useDeviceType()
    const [role, setRole] = useState(userObj?.role || "")
    const [email, setEmail] = useState(userObj?.email || "")
    const [load, setLoad] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '28%',
        height: '60%',
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
    const handleUserRoleChange = () => {
        setLoad(true)
        const body = {
            "_func": "change_business_user_role",
            "email": email,
            "role": role
        }

        apiInstance.getUserData(body)
            .then((response: any) => {
                if (response.data?._updated) {
                    refreshUserList()
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Role Updated Successfully",
                    })
                  
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong",
                    })
                }
                setTimeout(() => {
                    setIsOpen(false)
                }, 1000)
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
    return (
        <Modal
            open={open}
            onClose={() => { setIsOpen(false) }}
            sx={{
                border: "0px solid transparent"
            }}
        >
            <div style={style}>
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
                {!load ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: 'space-between',
                            gap: '50px',
                            width: '100%',
                            height: '100%'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: "flex-start",
                                justifyContent: 'center',
                                padding: '10px',
                                width: '100%',
                                gap: '20px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    style={{
                                        color: '#1D2020',
                                        fontFamily: "OpenSansMedium",
                                        fontSize: deviceType === 'mobile' ? '20px' : '24px',
                                        fontStyle: 'normal',
                                        fontWeight: '600',
                                        textAlign: 'left',
                                        margin: '0px',
                                    }}
                                >
                                    {title}
                                </Typography>
                                <button onClick={() => { }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>
                            </div>

                            <TSISingleDropdown
                                name={"Role"}
                                setFieldValue={setRole}
                                fieldvalue={role}
                                dropdown={[
                                    'PROFESSIONAL_USER',
                                    'BUSINESS_USER',
                                    'BUSINESS_ADMIN'
                                ]}
                            />
                            <TSITextfield
                                title={`Email`}
                                placeholder={`Enter Email`}
                                value={email}
                                type={"text"}
                                name={"field"}
                                multiline={true}
                                rows={1}
                                handleChange={(event: any) => { setEmail(event.target.value) }}
                            />
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "flex-end",
                                width: '100%',
                                padding: '10px',
                                gap: '5px',
                                borderTop: `1px solid ${colors.grey80}`
                            }}
                        >
                            <TSIButton
                                name={buttonName1}
                                disabled={false}
                                variant={'outlined'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                load={false}
                                isCustomColors={true}
                                customOutlineColor="1px solid #006A67"
                                customOutlineColorOnHover="1px solid #006A67"
                                customBgColorOnhover="#FFF"
                                customBgColor={"#FFF"}
                                customTextColorOnHover="#006A67"
                                customTextColor="#006A67"
                                handleClick={
                                    () => {
                                        setIsOpen(false)
                                    }
                                }
                            />
                            <TSIButton
                                name={buttonName2}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                load={false}
                                isCustomColors={true}
                                customOutlineColor={`1px solid ${btn2Color}`}
                                customOutlineColorOnHover={`1px solid ${btn2Color}`}
                                customBgColorOnhover={btn2Color}
                                customBgColor={btn2Color}
                                customTextColorOnHover={colors.white}
                                customTextColor={colors.white}
                                handleClick={
                                    () => {
                                        handleUserRoleChange()
                                    }
                                }
                            />
                        </div>
                    </div>
                ) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}
            </div>
        </Modal >
    )
}

export default TSIEditUserRoleChange
