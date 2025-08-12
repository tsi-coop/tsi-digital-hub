import { Checkbox, Modal } from '@mui/material'
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
import TSIFileUpload from '../Atoms/TSIFileUpload';
import TSIEditor from '../Atoms/TSIEditor';


const TSIJobApplicantAddModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
    modaltitle,
    jobId,
    jobData
}: any) => {
    const deviceType = useDeviceType()
    const [coverLetter, setCoverLetter] = useState("")
    const [applicationName, setApplicationName] = useState(localStorage.getItem("name"))
    const [state, setState] = useState<any>({})
    const [city, setCity] = useState("")
    const [preview, setPreview] = useState(false)
    const [fileDataArray, setFileDataArray] = useState<string[]>([]);
    const [fileDataArrayDetails, setFileDataArrayDetails] = useState<any>([]);
    const [load, setLoad] = useState(false)
    const [fileData, setFileData] = React.useState<any>([]);
    const [states, setStates] = React.useState<any>([]);
    const [stateCities, setStateCities] = React.useState<any>([]);
    const [collateralid, setCollateralId] = useState("")
    const [resumeURL, setResumeURL] = useState("")
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleMediaDel = (e: any) => {

        setLoad(true)
        let arr = fileData.filter((item: any) => { return item.tags[0] != e })
        setFileData(arr.length > 0 ? arr : [])
        setSnackbar({
            open: true,
            severity: 'success',
            message: 'Deleted successfully',
        });
        setLoad(false)

    }

    const handleFileChange = (name: string, imageUrl: string, file: any, mediaType: any) => {
        let updatedFileData = fileData.filter((item: any) => item.tags[0] !== name.trim())
        updatedFileData.push({
            "media_type": mediaType,
            "media_url": imageUrl,
            "tags": [name]
        });

        setFileData(updatedFileData);
    }


    const style: any = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "50%" : deviceType == "tablet" ? "45%" : '40%',
        height: '75%',
        padding: deviceType == "mobile" ? "15px" : "20px",
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.white,
        border: `0px solid ${colors.black}`,
        borderRadius: '16px',
        fontFamily: 'OpenSans',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'center',
    };

    const grpstyle: any = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: '100%',
        gap: '5px'
    }
    const titleStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "16px",
        fontWeight: 600,
        lineHeight: "24px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }
    const valueStyle: any = {
        fontFamily: "OpenSans",
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22.4px",
        letterSpacing: "0.5px",
        textAlign: "left",
        padding: 0,
        margin: 0,
        color: colors.black
    }

    const getJobApplicatonData = () => {
        setLoad(true)
        const body = {
            "_func": "view_job",
            "id": jobId
        }

        apiInstance.viewJOBS(body)
            .then((response: any) => {
                if (response.data) {
                    // setApplicationName(jobData?.title)
                }
                setLoad(false)
            })
            .catch((error: any) => {
                setLoad(false)
            });
    }

    const fetchData = (body: object, setData: React.Dispatch<React.SetStateAction<any>>, successMessage: string = "") => {
        setLoad(true);
        apiInstance.getGetOptions(body)
            .then((response: any) => {
                setLoad(false);
                if (response.status === 200 && response.data) {
                    setData(response.data);
                    if (successMessage) {
                        setSnackbar({
                            open: true,
                            severity: 'success',
                            message: successMessage,
                        });
                    }
                } else {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response.data?.code || "Something went wrong",
                    });
                }
            })
            .catch((error: any) => {
                setLoad(false);
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: error?.message || "Something went wrong",
                });
            });
    };


    React.useEffect(() => {
        fetchData({ "_func": "get_state_list" }, setStates);
        // if (jobId) {
        //     getJobApplicatonData()
        // }
    }, []);

    React.useEffect(() => {
        if (state?.key) {
            fetchData({ "_func": "get_state_cities", "state_slug": state?.key }, setStateCities);
        }
    }, [state]);


    const addJobApplication = () => {
        setLoad(true)
        const body = {
            "_func": "add_jobapplication",
            "job_id": jobId,
            "applicant_name": applicationName,
            "covering_letter": coverLetter,
            "resume_uri": resumeURL,
            "state": state?.key,
            "city": city,

        }

        apiInstance.addJOBS(body)
            .then((response: any) => {
                if (response?.data._added) {

                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Job application submitted successfully!",
                    });
                    setLoad(false)
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 1000)

                } else {
                    setLoad(false)
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: response?.data.message || "Something went wrong",
                    })
                }
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
            open={isOpen}
            onClose={() => { setIsOpen(false); setPreview(false) }}
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
                {(!load) ? (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: 'center',
                            justifyContent: "flex-start",
                            width: '100%',
                            height: '90%'
                        }}
                    >

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: "space-between",
                                width: '100%',
                                borderBottom: `1px solid ${colors.snowywhite}`,
                                height: '8%'
                            }}
                        >
                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 400,
                                textAlign: "left",
                            }}>
                                {!preview ? `Apply - ${jobData?.title}` : "Preview"}
                            </span>
                            <button onClick={() => { setPreview(false); setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
                                <CloseIcon sx={{ width: '20px', height: '20px' }} />
                            </button>

                        </div>
                        {(!preview) && (
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
                                    gap: '20px',
                                    scrollbarWidth: 'none',
                                    height: '90%'
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: "flex-start",
                                        justifyContent: 'center',
                                        width: '100%',
                                        gap: '20px',
                                    }}
                                >

                                    <TSITextfield
                                        title={`Application Name`}
                                        placeholder={`Enter Application name`}
                                        value={applicationName}
                                        isRequired={true}
                                        type={"text"}
                                        name={"field"}
                                        previewMode={true}
                                        multiline={false}
                                        rows={1}
                                        handleChange={(event: any) => { setApplicationName(event.target.value) }}
                                    />





                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: "flex-start",
                                        justifyContent: 'center',
                                        width: '100%',
                                        gap: '20px',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: "flex-start",
                                            gap: '20px',
                                            width: '50%',
                                        }}
                                    >
                                        <TSISingleDropdown
                                            name={"State"}
                                            setFieldValue={(selectedValue: string) => {
                                                const selectedState = states.find((item: any) => item.value === selectedValue);
                                                if (selectedState) {
                                                    setState({ key: selectedState.key, value: selectedState.value });
                                                }
                                                setCity("")
                                            }}
                                            fieldvalue={state?.value || ""}
                                            dropdown={states.map((item: any) => item.value)}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: "flex-start",
                                            gap: '20px',
                                            width: '50%',
                                        }}
                                    >


                                        <TSISingleDropdown
                                            name={"City"}
                                            setFieldValue={setCity}
                                            fieldvalue={city}
                                            dropdown={stateCities.map((item: any) => item.value)}
                                        />

                                    </div>


                                </div>

                                <TSITextfield
                                    title={`Resume URL`}
                                    placeholder={`Enter Resume URL`}
                                    value={resumeURL}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={false}
                                    handleChange={(event: any) => { setResumeURL(event.target.value) }}
                                />
                                <TSIEditor
                                    title={`Cover Letter`}
                                    placeholder={`Enter Cover letter`}
                                    content={coverLetter}
                                    setContent={setCoverLetter}
                                    isRequired={false}
                                    maxLength={4000}
                                />

                                {/* <TSIFileUpload
                                    uploadedImage={"Document"}
                                    uploadTitle={"Link or drag and drop"}
                                    imgCardLabel={"Document"}
                                    name={""}
                                    fileType={""}
                                    fileSize={""}
                                    isRequired={false}
                                    setUploadedImage={() => { }}
                                    previewMode={false}
                                    showToastMessage={true}
                                    showDownloadIcon={false}
                                    downloadFile={(fileData: any) => { }}
                                    fileDataArray={fileDataArray}
                                    fileDataArrayDetails={fileDataArrayDetails}
                                    setFileDataArrayDetails={setFileDataArrayDetails}
                                    setFileDataArray={setFileDataArray}
                                    collateralid={collateralid}
                                    setCollateralId={setCollateralId}
                                /> */}




                            </div>
                        )}

                        {(preview) && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    padding: '15px',
                                    paddingTop: '0px',
                                    marginTop: '20px',
                                    overflowY: "scroll",
                                    scrollbarWidth: 'none',
                                    height: '80%',
                                    gap: '10px'
                                }}
                            >
                                <div style={grpstyle}>
                                    <p style={titleStyle}>Applicant Name</p>
                                    <p style={valueStyle}>{applicationName}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>State</p>
                                    <p style={valueStyle}>{state?.value}</p>
                                </div>
                                <div style={grpstyle}>
                                    <p style={titleStyle}>City</p>
                                    <p style={valueStyle}>{city}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>Cover Letter</p>
                                    <p style={{ ...valueStyle, whiteSpace: "pre-wrap" }}>{coverLetter}</p>
                                </div>

                                <div style={grpstyle}>
                                    <p style={titleStyle}>Resume URL</p>
                                    <p style={valueStyle}>{resumeURL}</p>
                                </div>

                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: "column",
                            alignItems: 'center',
                            justifyContent: "center",
                            width: '100%',
                            height: '90%'
                        }}
                    >
                        <div className="centered-container">
                            <div className="loader"></div>
                        </div>
                    </div>)}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: "flex-end",
                        width: '100%',
                        borderTop: `1px solid ${colors.snowywhite}`,
                        height: '10%',
                        paddingTop: '20px',
                        gap: '20px'
                    }}
                >
                    {(preview) && (<TSIButton
                        name={"Edit"}
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
                                setPreview(!preview)
                            }
                        }
                    />)}
                    <TSIButton
                        name={!preview ? "Preview" : "Add"}
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
                                if (!preview) {
                                    if (applicationName && state && city && coverLetter) {
                                        setPreview(true);

                                    } else {
                                        setSnackbar({
                                            open: true,
                                            severity: 'error',
                                            message: "Please fill in all required fields before previewing.",
                                        });
                                    }
                                } else {
                                    addJobApplication();

                                }

                            }
                        }
                    />
                </div>

            </div>
        </Modal >
    )
}

export default TSIJobApplicantAddModal
