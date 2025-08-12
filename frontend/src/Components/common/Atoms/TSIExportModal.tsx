import { Checkbox, Collapse, IconButton, ListItem, Modal } from '@mui/material'
import React, { useEffect, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType';
import TSIButton from '../Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import TSITextfield from '../Atoms/TSITextfield';
import TSISingleDropdown from '../Atoms/TSISingleDropdown';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';

const TSIExportModal = ({
    isOpen,
    setIsOpen,
}: any) => {
    const deviceType = useDeviceType()
    const [load, setLoad] = useState(false)
    const [reportType, setReportType] = useState("")
    const [dateRange, setDateRange] = useState("")
    const [fromDate, setFromDate] = useState("")
    const [toDate, setToDate] = useState("")
    const role = localStorage.getItem("role")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };


    const addExportData = () => {
        setLoad(true)
        const body = {
            "_func": "add_testimonial",

            "to_account_type": role,
            "to_account_slug": "xyz.com"
        }

        apiInstance.addTestimonial(body)
            .then((response: any) => {
                if (response.data._added) {

                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Testimonial Post added",
                    })
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 1000)
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Testimonial Post failed to add",
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

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '30%',
        height: '50%',
        padding: deviceType == "mobile" ? "15px" : "15px",
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "space-between",
                        width: '100%',
                        borderBottom: `1px solid ${colors.snowywhite}`,
                    }}
                >
                    <span style={{
                        fontFamily: "OpenSans",
                        fontSize: "24px",
                        fontWeight: 600,
                        textAlign: "left",
                        lineHeight: "28px"

                    }}>
                        Export
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
                        padding: '15px',
                        marginTop: '20px',
                        overflowY: "scroll",
                        scrollbarWidth: 'none',
                        height: '80%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            width: '100%',
                            gap: '20px',
                        }}
                    >

                        <TSISingleDropdown
                            name={"Report Type"}
                            fieldvalue={reportType}
                            setFieldValue={setReportType}
                            dropdown={["Services"]}
                        />
                        <TSISingleDropdown
                            name={"Date Range"}
                            fieldvalue={dateRange}
                            setFieldValue={setDateRange}
                            dropdown={["Custom"]}
                        />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: '100%',
                                gap: '10px'
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: '48%',
                                }}
                            >
                                <TSITextfield
                                    title={`From`}
                                    placeholder={`Enter From`}
                                    value={fromDate}
                                    type={"date"}
                                    name={"field"}
                                    handleChange={(event: any) => { setFromDate(event.target.value) }}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: '48%',
                                }}
                            >
                                <TSITextfield
                                    title={`To`}
                                    placeholder={`Enter To`}
                                    value={toDate}
                                    type={"date"}
                                    name={"field"}
                                    handleChange={(event: any) => { setToDate(event.target.value) }}
                                />
                            </div>


                        </div>


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
                        height: 'auto',
                        paddingTop: '20px',
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
                        name={"Export"}
                        disabled={false}
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
                                addExportData()
                            }
                        }
                    />
                </div>
            </div>
        </Modal >
    )
}

export default TSIExportModal
