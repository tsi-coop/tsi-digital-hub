import {  Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import colors from '../../../assets/styles/colors';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
const TSIPostFlagModal = ({
    isOpen,
    setIsOpen,
    comment,
    setComment,
    onSubmit
}: any) => {
    const deviceType = useDeviceType()
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "50%" : deviceType == "tablet" ? "45%" : '45%',
        height: '50%',
        padding: "0px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '10px',
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        width: '100%',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                        height: '10%',
                        padding: '20px'
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "24px",
                        fontWeight: 600,
                        textAlign: "left",
                    }}>
                        Flag
                    </span>
                    <button onClick={() => { setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                    </button>

                </div>

                {(!load) ? (

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            width: '100%',
                            padding: '30px',
                            overflowY: "scroll",
                            scrollbarWidth: 'none',
                            height: '80%'
                        }}
                    >

                        <TSITextfield
                            title={`Comment`}
                            placeholder={`Enter Comment`}
                            value={comment}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={4}
                            handleChange={(event: any) => { setComment(event.target.value) }}
                        />

                    </div>

                ) : (
                    <div className="centered-container">
                        <div className="loader"></div>
                    </div>
                )}

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "flex-end",
                        width: '100%',
                        borderTop: `1px solid ${colors.snowywhite}`,
                        height: 'auto',
                        gap: '20px',
                        padding: '15px'
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
                        customBgColorOnhover={colors.white}
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
                        name={"Flag"}
                        variant={'contained'}
                        disabled={!comment}
                        padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                        load={load}
                        isCustomColors={true}
                        customOutlineColor={`1px solid ${colors.primary}`}
                        customOutlineColorOnHover={`1px solid ${colors.primary}`}
                        customBgColorOnhover={colors.primary}
                        customBgColor={colors.primary}
                        customTextColorOnHover={colors.white}
                        customTextColor={colors.white}
                        handleClick={
                            () => {
                                if(comment){
                                    onSubmit()
                                }
                               
                            }
                        }
                    />
                </div>
            </div>
        </Modal >
    )
}

export default TSIPostFlagModal
