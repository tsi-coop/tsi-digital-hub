import { Modal, Typography } from '@mui/material'
import React, { useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import colors from '../../../assets/styles/colors';
import TSITextfield from '../Atoms/TSITextfield';
import apiInstance from '../../../services/authService';
import { useSearchParams } from 'react-router-dom';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
const TSIShortlistModal = ({ open, title, desc, buttonName1, buttonName2, btn2Color, onClose, onClick }: any) => {
    const deviceType = useDeviceType()
    const [comment, setComment] = useState("")
    const [load, setLoad] = useState<any>(false);
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
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
        width: deviceType == "mobile" ? "75%" : deviceType == "tablet" ? "35%" : deviceType == "large-desktop" ? "35%" : deviceType == "small-tablet" ? '35%' : '35%',
        padding: "2%",
        transform: 'translate(-50%, -50%)',
        backgroundColor: "#FFF",
        border: '0px solid #000',
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    };
    const shortlistJobApplication = () => {
        setLoad(true)
        const body = {
            "_func": "invite_for_discussion",
            "id": id,
            // "comment":comment
        }
        apiInstance.rejectJOBS(body)
            .then((response: any) => {
                if (response.data._invited) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Shortlist Successful",
                    })
                    setTimeout(() => {
                        onClose()
                        onClick()
                    }, 1000)
                }else{
                     setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Shortlist unsuccessful",
                    })
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

    return (
        <Modal
            open={open}
            onClose={() => { onClose() }}
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
                        flexDirection: 'column',
                        alignItems: "flex-start",
                        justifyContent: 'center',
                        gap: '30px',
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: 'center',
                            gap: '5px',
                            width: '100%'
                        }}
                    >
                        <Typography
                            style={{
                                color: '#1D2020',
                                fontFamily: "OpenSansMedium",
                                fontSize: deviceType === 'mobile' ? '20px' : '25px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                textAlign: 'left',
                                margin: '0px',
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            style={{
                                color: colors.lightgrey,
                                fontFamily: 'OpenSans',
                                fontSize: deviceType === 'mobile' ? '14px' : '16px',
                                fontStyle: 'normal',
                                fontWeight: '400',
                                lineHeight: '22.4px',
                                textAlign: 'left',
                            }}
                        >
                            {desc}
                        </Typography>

                        {/* <TSITextfield
                            title={`Write comment`}
                            placeholder={`Write comment`}
                            value={comment}
                            isRequired={true}
                            type={"text"}
                            name={"field"}
                            multiline={true}
                            rows={3}
                            handleChange={(event: any) => { setComment(event.target.value) }}
                        /> */}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: '10px',
                            width: '100%'
                        }}
                    >
                        <TSIButton
                            name={buttonName1}
                            disabled={false}
                            variant={'outlined'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={false}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${colors.primary}`}
                            customOutlineColorOnHover={`1px solid ${colors.primary}`}
                            customBgColorOnhover="#FFF"
                            customBgColor={"#FFF"}
                            customTextColorOnHover={colors.primary}
                            customTextColor={colors.primary}
                            handleClick={
                                () => {
                                    onClose()
                                }
                            }
                        />
                        <TSIButton
                            name={buttonName2}
                            disabled={!comment}
                            variant={'contained'}
                            padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                            load={load}
                            isCustomColors={true}
                            customOutlineColor={`1px solid ${btn2Color}`}
                            customOutlineColorOnHover={`1px solid ${btn2Color}`}
                            customBgColorOnhover={btn2Color}
                            customBgColor={btn2Color}
                            customTextColorOnHover={colors.white}
                            customTextColor={colors.white}
                            handleClick={
                                () => {
                                    shortlistJobApplication()
                                }
                            }
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default TSIShortlistModal
