import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import { benchmark, connect, gettail, NoData, pzW, strweek } from '../../../assets';
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Button, Modal, Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BadgePoster from '../../common/Atoms/BadgePoster';
import TSIButton from '../../common/Atoms/TSIButton';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TSIRatingReceipt from './TSIRatingReceipt';
import CloseIcon from '@mui/icons-material/Close';
const TSIRatingsDM = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [load, setLoad] = useState(false)
    const navigation = useNavigate()
    const role = localStorage.getItem("role");
    const business = role === "BUSINESS";
    const admin = role === "ADMIN";
    const [questionnaireData, setQuestionnaireData] = useState<any>({})
    const [assessmentReport, setAssessmentReport] = useState<any>({})
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id')
    const [previousdata, setPreviousdata] = useState<any>({})
    const [openReport, setOpenReport] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }

    const getAssessmentSummary = () => {
        setLoad(true)
        const body = {
            "_func": "get_assessment_summary",
            "assessment_type": "digital-maturity"
        }

        apiInstance.getAssessmentQuestionnaire(body)
            .then((response: any) => {
                if (response.data) {
                    setPreviousdata(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getAssessmentReport = () => {
        setLoad(true)
        const body = {
            "_func": "get_assessment_report",
            "id": previousdata?.id
        }

        apiInstance.getAssessmentQuestionnaire(body)
            .then((response: any) => {
                if (response.data) {
                    setAssessmentReport(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getAssessmentQuestionnaire = () => {
        setLoad(true)
        const email: any = localStorage.getItem("email")
        const getDomainFromEmail = () => email.split("@")[1] || null;
        const body = {
            "_func": "get_assessment_questionaire",
            "account_type": "BUSINESS",
            "account_slug": role == "BUSINESS" ? getDomainFromEmail() : email,
            "assessment_type": "digital-maturity",
            "version": "v1"

        }
        apiInstance.getAssessmentQuestionnaire(body)
            .then((response: any) => {
                if (response.data) {
                    setQuestionnaireData(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    useEffect(() => {

        getAssessmentSummary()
        getAssessmentQuestionnaire()
    }, [])

    useEffect(() => {
        if (previousdata.id) {
            getAssessmentReport()
        }

    }, [previousdata.id])

    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '40%',
        height: '70%',
        padding: deviceType == "mobile" ? "15px" : "15px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '12px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

    if (!load) {
        return (
            <div style={{ display: 'flex', flexDirection: deviceWidth ? "column" : 'row', justifyContent: deviceWidth ? "flex-start" : "space-between", alignItems: "flex-start", padding: '10px', gap: '20px', backgroundColor: colors.lightPrimary, height: '92%' }}>
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

                <div style={{ width: deviceWidth ? "100%" : '100%', height: "100%", backgroundColor: colors.white, borderRadius: '24px', padding: "10px", display: 'flex', flexDirection: 'column', justifyContent: "flex-start", alignItems: "center", gap: '15px' }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", padding: '10px', borderBottom: `1px solid ${colors.snowywhite}` }}>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "24px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}>Your Digital Maturity Journey</p>
                        <div style={{
                            width: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: '5px'
                        }}>


                        </div>

                    </div>

                    <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "flex-start", gap: '15px', padding: '10px', height: '80vh', scrollbarWidth: "none" }}>


                        <div style={{
                            display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: 'flex-start', gap: "5px"
                        }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 600,
                                lineHeight: "32.68px",
                                textAlign: "left",
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                                color: colors.black
                            }}>{questionnaireData.questionnaireTitle}</p>

                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSansSemiBold",
                                fontSize: "16px",
                                fontWeight: 500,
                                lineHeight: "28px",
                                textAlign: "left",
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                                color: colors.browngrey
                            }}>Assess. Benchmark. Grow.</p>


                        </div>
                        <p style={{
                            margin: 0, padding: 0,
                            fontFamily: "OpenSans",
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "26px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                            color: colors.black
                        }}>
                            Our Digital Maturity Assessment offers businesses a clear way to measure their readiness and capability to effectively use digital technologies. By systematically evaluating key areas like strategy, operations, customer experience, and technology, it helps identify strengths and pinpoint opportunities for improvement. This assessment provides a roadmap for optimizing digital capabilities, enabling continuous growth and value creation in today's evolving digital landscape.
                        </p>
                        <div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: '15px', padding: '5px', }}>
                            <BadgePoster assessmentReport={assessmentReport} />
                            <TSIButton
                                name={"View Full Report"}
                                variant={'outlined'}
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
                                        setOpenReport(true)
                                    }
                                }
                            />

                        </div>
                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-start", gap: '5px', padding: '5px', }}>
                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSansSemiBold",
                                fontSize: "16px",
                                fontWeight: 600,
                                lineHeight: "28px",
                                textAlign: "left",
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                                color: colors.black
                            }}>Benefits</p>
                            {[
                                {
                                    icon: strweek,
                                    value: `Identify Strength & Weaknesses`
                                },
                                {
                                    icon: gettail,
                                    value: `Get Tailored Recommendations`
                                },

                                {
                                    icon: connect,
                                    value: "Connect with Improvements Resources"
                                }, {
                                    icon: benchmark,
                                    value: `Benchmark Against Peers (TSI Index)`,
                                    comingsoon: true
                                },
                            ].map((item, index) => (<span style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "15px",
                                fontWeight: 500,
                                lineHeight: "28px",
                                textAlign: "left",
                                color: colors.black,
                                gap: '10px',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: "flex-start",
                                alignItems: "center"
                            }}>
                                <img src={item.icon} style={{
                                    width: '20px',
                                    height: '20px'
                                }} />
                                {item.value}
                                {(item?.comingsoon)&&(<span style={{ color: colors.red, fontSize: '10px', textAlign: "left" }}>{"Coming soon"}</span>)}
                            </span>))}
                        </div>
                        <div style={{ display: 'flex', width: '100%', flexDirection: (deviceType == "mobile" || deviceType == "small-tablet") ? "column" : "row", justifyContent: (deviceType == "mobile" || deviceType == "small-tablet") ? "flex-start" : "flex-end", alignItems: "center", gap: '10px', padding: '5px', }}>

                            {/* <TSIButton
                                name={"Continue Assessment"}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 10px"}
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

                                    }
                                }

                            /> */}
                            {(previousdata?.id) ? (<TSIButton
                                name={"Retake Assessment"}
                                disabled={false}
                                variant={'contained'}
                                padding={deviceType == "mobile" ? "5px 15px" : "5px 10px"}
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
                                        if (questionnaireData) {
                                            navigation("/tsiratingsquestionnaireDM", {
                                                state: {
                                                    questionnaireData
                                                }
                                            });
                                        }
                                    }
                                }

                            />) : (
                                <TSIButton
                                    name={"Start Your Digital Maturity Assessment"}
                                    disabled={Object.keys(questionnaireData)?.length === 0}
                                    variant={'contained'}
                                    padding={deviceType == "mobile" ? "5px 15px" : "5px 10px"}
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
                                            if (Object.keys(questionnaireData)?.length === 0) {
                                                setSnackbar({
                                                    open: true,
                                                    severity: 'error',
                                                    message: 'The question Data not found',
                                                })
                                            }
                                            else if (questionnaireData) {
                                                navigation("/tsiratingsquestionnaireDM", {
                                                    state: {
                                                        questionnaireData
                                                    }
                                                });
                                            }

                                        }
                                    }

                                />
                            )}
                        </div>

                    </div>


                </div>
                {(openReport) && (<Modal
                    open={openReport}
                    onClose={() => { setOpenReport(false); }}
                    sx={{
                        border: "0px solid transparent"
                    }}
                >
                    <div style={{ ...style, width: (deviceType == "mobile" || deviceType == "small-tablet") ? "90%" : '30%', height: "20%", borderRadius: "10px" }}>

                        <div style={{
                            display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '30px', width: '100%', borderRadius: '12px', padding: '10px',
                        }}>
                            <div style={{
                                display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: '100%',
                            }}>
                                <p style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "20px",
                                    fontWeight: 600,
                                    lineHeight: "28px",
                                    letterSpacing: "0.5px",
                                    textAlign: "left",
                                    color: colors.black,
                                    margin: 0,
                                    padding: 0
                                }}>
                                    Download Report

                                </p>


                                <button onClick={() => { setOpenReport(false); }} style={{ width: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                    <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: '100%', gap: '10px', overflowY: "scroll", scrollbarWidth: "none" }}>

                                {(previousdata?.id) && (<PDFDownloadLink document={<TSIRatingReceipt data={assessmentReport} name={"Digital Maturity Report"} />} fileName={`Report.pdf`} style={{
                                    width: '70%'
                                }}>

                                    {({ loading }) => (loading ? <TSIButton
                                        name={"loading"}
                                        variant={'outlined'}
                                        padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                        load={false}
                                        disabled={true}
                                        isCustomColors={true}
                                        customOutlineColor={`1px solid ${colors.primary}`}
                                        customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                        customBgColorOnhover={colors.white}
                                        customBgColor={colors.white}
                                        customTextColorOnHover={colors.primary}
                                        customTextColor={colors.primary}
                                        handleClick={
                                            () => {

                                            }
                                        }
                                    /> : <TSIButton
                                        name={"Download Report"}
                                        variant={'outlined'}
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

                                            }
                                        }
                                    />)}
                                </PDFDownloadLink>)}

                            </div>
                        </div>
                    </div>
                </Modal>)}


            </div >
        )
    }
    else {
        return (
            <div className="centered-container">
                <div className="loader"></div>
            </div>
        );
    }
}

export default TSIRatingsDM
