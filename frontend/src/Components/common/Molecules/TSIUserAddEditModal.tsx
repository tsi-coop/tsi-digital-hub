import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Modal } from '@mui/material';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const TSIAddEditUserModal = ({
    isOpen,
    setIsOpen,
    edit,
    isuserObj,
    setIsUserObj,
    refreshUserList
}: any) => {
    const deviceType = useDeviceType()
    const [name, setName] = useState(isuserObj?.name || "")
    const [load, setLoad] = useState(false)
    const [mobile, setMobile] = useState(isuserObj?.mobile || "")
    const [email, setEmail] = useState(isuserObj?.email || "")
    const [role, setRole] = useState(isuserObj?.role || "")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const addUserData = () => {
        setLoad(true)
        const editbody = {
            "_func": "edit_business_user",
            "name": name,
            "email": email,
            "role": role,
            "mobile": mobile
        }
        const body = {
            "_func": "add_business_user",
            "name": name,
            "email": email,
            "role": role,
            "mobile": mobile
        }
        apiInstance.addUserData(edit ? editbody : body)
            .then((response: any) => {
                if (response.data._added) {
                    refreshUserList()
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "User added successful",
                    })
                } else if (response.data.edited) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "User edited successful",
                    })
                } else if (response?.data?.edited) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "User edited successful"
                    })

                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response?.data?._error || "Something went wrong"
                    })
                }
                setLoad(false)
                setTimeout(() => {
                    setIsOpen(false)
                    setSnackbar({ ...snackbar, open: false });
                }, 1000)

            })
            .catch((error: any) => {
                setLoad(false)
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: "Something went wrong",
                })
            });
    }

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "35%" : deviceType == "tablet" ? "35%" : '35%',
        height: '60%',
        padding: deviceType == "mobile" ? "15px" : "20px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '5px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };



    return (
        <Modal
            open={isOpen}
            onClose={() => { setIsOpen(false); }}
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
                {(!load) ? (<div style={{ width: '100%', height: "100%" }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            width: '100%',
                            height: '8%'
                        }}
                    >
                        <span style={{
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            textAlign: "left",
                        }}>
                            {edit ? "Edit User" : "Add User"}
                        </span>
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
                            padding: '0px',
                            paddingTop: '25px',
                            overflowY: "scroll",
                            scrollbarWidth: 'none',
                            height: '80%'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: "flex-start",
                                gap: '20px',
                                width: '100%',
                            }}
                        >
                            <TSITextfield
                                title={`Name`}
                                placeholder={`Enter Name`}
                                value={name}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setName(event.target.value) }}
                            />

                            <TSITextfield
                                title={"Email"}
                                placeholder={"Enter Email"}
                                value={email}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => { setEmail(event.target.value) }}
                            />
                            {/* <TSITextfield
                                title={"Mobile"}
                                placeholder={"Enter Mobile"}
                                value={mobile}
                                isRequired={true}
                                type={"text"}
                                name={"field"}
                                multiline={false}
                                rows={1}
                                handleChange={(event: any) => {
                                    if (event.target.value.length < 11) {
                                        setMobile(event.target.value);
                                        setErrorMessage("");
                                    } else {
                                        setErrorMessage("Mobile number cannot exceed 10 digits.");
                                    }
                                }}
                                errorMessage={errorMessage}
                            /> */}

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


                        </div>

                    </div>

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: "flex-end",
                            width: '100%',
                            borderTop: `1px solid ${colors.snowywhite}`,
                            height: '15%',
                            gap: '20px'
                        }}
                    >
                        <TSIButton
                            name={"Cancel"}
                            disabled={false}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover="#FFF"
                            customBgColor={colors.white}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    setIsOpen(false)
                                }
                            }
                        />
                        <TSIButton
                            name={edit ? "Update" : "Add"}
                            disabled={(role && name && email) ? false : true}
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
                                    addUserData()
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
        </Modal >
    )
}

export default TSIAddEditUserModal
