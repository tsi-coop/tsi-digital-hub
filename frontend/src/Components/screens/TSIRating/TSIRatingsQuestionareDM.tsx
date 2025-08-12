import React, { useEffect, useRef, useState } from 'react'
import useDeviceType from '../../../Utils/DeviceType'
import colors from '../../../assets/styles/colors';
import apiInstance from '../../../services/authService';
import { Modal, Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import TSIButton from '../../common/Atoms/TSIButton';
import CloseIcon from '@mui/icons-material/Close';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TSIRatingReceipt from './TSIRatingReceipt';
const TSIRatingsQuestionareDM = () => {
    const deviceType = useDeviceType()
    const deviceWidth = (deviceType === "mobile" || deviceType === "small-tablet")
    const [load, setLoad] = useState(false)
    const navigation = useNavigate()
    const role = localStorage.getItem("role");
    const business = role === "BUSINESS";
    const admin = role === "ADMIN";
    const location = useLocation();
    const data = location.state?.questionnaireData;
    const [page, setPage] = useState(0)
    const [selectedQA, setSelectedQA] = useState<any>({});
    const [assessmentReport, setAssessmentReport] = useState<any>({});
    const [isAssesmentFinalOpen, setIsAssesmentFinalOpen] = useState(false)
    const [assesmentId, setAssesmentId] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    }
    const currentQuestions = data?.sections?.[page]?.questions;

    const currentQuestionIds = currentQuestions?.map((q: any) => q?.questionId) || [];

    const allQuestionsAnswered = currentQuestionIds.length > 0 && currentQuestionIds.every(
        (qid: string) => selectedQA[qid] !== undefined && selectedQA[qid] !== ""
    );


    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "75%" : '30%',
        height: 'auto',
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

    const saveQuestionnaireData = () => {
        setLoad(true)
        const body = {
            "_func": "save_assessment",
            "assessment_type": "digital-maturity",
            "version": "v1",
            "assessment": selectedQA
        }

        apiInstance.getAssessmentQuestionnaire(body)
            .then((response: any) => {
                if (response.data?._saved) {

                    getAssessmentReport(response.data?.assessment_id)
                    setAssesmentId(response.data?.assessment_id)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const getAssessmentReport = (id: any) => {
        setLoad(true)
        const body = {
            "_func": "get_assessment_report",
            "id": id
        }

        apiInstance.getAssessmentQuestionnaire(body)
            .then((response: any) => {
                if (response.data) {
                    setIsAssesmentFinalOpen(true)
                    setAssessmentReport(response.data)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

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
                            fontSize: "22px",
                            fontWeight: 600,
                            lineHeight: "32.68px",
                            textAlign: "left",
                            textUnderlinePosition: "from-font",
                            textDecorationSkipInk: "none",
                        }}> Digital Maturity Assessment Questionaire</p>


                    </div>

                    <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", overflowY: 'scroll', alignItems: "flex-start", gap: '15px', padding: '10px', height: '80vh', scrollbarWidth: "none" }}>

                        <div style={{
                            display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: 'flex-start',
                        }}>

                            <p style={{
                                margin: 0, padding: 0,
                                fontFamily: "OpenSans",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "28px",
                                textAlign: "left",
                                textUnderlinePosition: "from-font",
                                textDecorationSkipInk: "none",
                                color: colors.browngrey
                            }}>{data?.sections[page]?.sectionTitle}</p>


                        </div>

                        <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: '15px', padding: '5px', height: "100%", scrollbarWidth: "none", overflowY: "scroll" }}>
                            {data?.sections[page]?.questions?.map((item: any, index: any) => (
                                <div style={{ display: 'flex', width: '100%', flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "5px" }}>
                                    <span style={{ fontFamily: "OpenSansSemiBold", fontSize: "14px", textAlign: "left" }}>{item.questionId} {item.questionText}</span>
                                    {item?.options?.map((item1: any, index: any) => (
                                        <div
                                            onClick={() => {
                                                setSelectedQA((prev: any) => ({
                                                    ...prev,
                                                    [item.questionId]: item1.value
                                                }));
                                            }}

                                            style={{ display: 'flex', flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start", gap: '10px', fontSize: '12px', cursor: "pointer" }}>
                                            <div style={{
                                                width: '15px',
                                                height: '15px',
                                                borderRadius: "10px",
                                                border: `1px solid ${colors.snowywhite}`,
                                                marginTop: '3px',
                                                backgroundColor: selectedQA[item.questionId] === item1.value
                                                    ? colors.lightgrey
                                                    : 'transparent',

                                            }}>

                                            </div>
                                            <span style={{ textAlign: "left" }}>
                                                {item1?.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                            <div style={{ display: 'flex', width: '100%', flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: '10px', padding: '5px', }}>
                                {(page !== 0) ? (<TSIButton
                                    name={"Previous"}
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
                                            if (page == 0) {

                                            } else {
                                                setPage(page - 1)
                                            }

                                        }
                                    }

                                />) : (<div></div>)}
                                {
                                    (data?.sections?.length - 1 !== page) ? (<TSIButton
                                        name={"Next"}
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
                                                if (!allQuestionsAnswered) {
                                                    setSnackbar({
                                                        open: true,
                                                        severity: 'error',
                                                        message: 'Please fill all the questions in this section',
                                                    })
                                                } else {
                                                    setPage(page + 1)
                                                }

                                            }
                                        }

                                    />) :
                                        (<TSIButton
                                            name={(data?.sections?.length == page) ? "" : "Save & Exit"}
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
                                                    if (!allQuestionsAnswered) {
                                                        setSnackbar({
                                                            open: true,
                                                            severity: 'error',
                                                            message: 'Please fill all the questions in this section',
                                                        })
                                                    }
                                                    else if (data?.sections?.length - 1 == page) {
                                                        saveQuestionnaireData()
                                                    }
                                                    else {
                                                        setPage(page + 1)
                                                    }

                                                }
                                            }

                                        />)}
                            </div>

                        </div>


                    </div>
                    <Modal
                        open={isAssesmentFinalOpen}
                        onClose={() => { setIsAssesmentFinalOpen(false); navigation(`/tsiratingsdigitialmaturity?id=${assesmentId}`) }}
                        sx={{
                            border: "0px solid transparent"
                        }}
                    >
                        <div style={{ ...style, width: (deviceType == "mobile" || deviceType == "small-tablet") ? "90%" : '50%', borderRadius: "10px" }}>

                            <div style={{
                                display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '5px', width: '100%', borderRadius: '12px', padding: '10px',
                            }}>
                                <div style={{
                                    display: "flex", flexDirection: 'row', justifyContent: "space-between", alignItems: "flex-start", width: '100%',
                                }}>
                                    <div></div>
                                    <button onClick={() => { setIsAssesmentFinalOpen(false); navigation(`/tsiratingsdigitialmaturity?id=${assesmentId}`) }} style={{ width: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                        <CloseIcon sx={{ width: '20px', height: '20px' }} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: '100%', gap: '5px', overflowY: "scroll", scrollbarWidth: "none" }}>
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
                                        Assessment Complete!

                                    </p>
                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        lineHeight: "28px",
                                        letterSpacing: "0.5px",
                                        textAlign: "center",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Thank you for completing your Digital Maturity Assessment.

                                    </p>
                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        lineHeight: "28px",
                                        letterSpacing: "0.5px",
                                        textAlign: "center",
                                        color: colors.yellow,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Your preliminary score is <span style={{ color: colors.primary }}>{assessmentReport?.score}</span>
                                    </p>
                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        lineHeight: "28px",
                                        letterSpacing: "0.5px",
                                        textAlign: "center",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Your detailed report

                                        <PDFDownloadLink document={<TSIRatingReceipt data={assessmentReport} name={"Digital Maturity Report"} />} fileName={`Report.pdf`} style={{
                                            width: '70%'
                                        }}>
                                            {/* {({ loading }) => (loading ?
                                                <button onClick={() => {  }} disabled={true} style={{ color: colors.primary, border: "0px solid transparent", backgroundColor: "transparent", cursor: "pointer" }}>loading</button>
                                                :
                                                <button onClick={() => {  }} disabled={true} style={{ color: colors.primary, border: "0px solid transparent", backgroundColor: "transparent", cursor: "pointer" }}>Download</button>
                                            )} */}
                                            {({ loading }) => (loading ? <TSIButton
                                                name={"loading"}
                                                variant={'contained'}
                                                padding={deviceType == "mobile" ? "5px 15px" : "5px 20px"}
                                                load={false}
                                                disabled={true}
                                                isCustomColors={true}
                                                customOutlineColor={`1px solid ${colors.primary}`}
                                                customOutlineColorOnHover={`1px solid ${colors.primary}`}
                                                customBgColorOnhover={colors.primary}
                                                customBgColor={colors.primary}
                                                customTextColorOnHover={colors.white}
                                                customTextColor={colors.white}
                                                handleClick={
                                                    () => {

                                                    }
                                                }
                                            /> : <TSIButton
                                                name={"Download"}
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

                                                    }
                                                }
                                            />)}
                                        </PDFDownloadLink>

                                    </p>

                                    <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        lineHeight: "23px",
                                        letterSpacing: "0.5px",
                                        textAlign: "center",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Recommendation:-  {assessmentReport?.recommendation}
                                    </p>

                                    {/* <p style={{
                                        fontFamily: "OpenSans",
                                        fontSize: "16px",
                                        fontWeight: 600,
                                        lineHeight: "28px",
                                        letterSpacing: "0.5px",
                                        textAlign: "center",
                                        color: colors.black,
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        Consulting Partner list:
                                    </p>
                                     <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: '100%', gap: '5px', fontSize: "14px" }}>
                                        <span>
                                            Name: {assessmentReport?.org_name}
                                        </span>
                                        <span>
                                            Specialization
                                        </span>
                                        <TSIButton
                                            name={"Connect"}
                                            variant={'contained'}
                                            padding={deviceType == "mobile" ? "5px 15px" : "5px 15px"}
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

                                                }
                                            }
                                        />
                                    </div> */}




                                </div>
                            </div>
                        </div>
                    </Modal>


                </div>



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

export default TSIRatingsQuestionareDM
