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


const TSIKYCAddModal = ({
    isOpen,
    setIsOpen,
    onSubmit,
}: any) => {
    const deviceType = useDeviceType()
    const [documentType, setDocumentType] = useState("")
    const [documentId, setDocumentId] = useState("")
    const [preview, setPreview] = useState(false)
    const [fileDataArray, setFileDataArray] = useState<string[]>([]);
    const [fileDataArrayDetails, setFileDataArrayDetails] = useState<any>([]);
    const [load, setLoad] = useState(false)
    const [fileData, setFileData] = React.useState<any>([]);
    const [collateralid, setCollateralId] = useState("")
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
        width: deviceType == "mobile" ? "90%" : deviceType == "small-tablet" ? "60%" : deviceType == "tablet" ? "40%" : '35%',
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



    const addJobApplication = () => {
        setLoad(true)
        const body = {
            "_func": "add_jobapplication",
            "job_id": "518ec253-5e0c-488e-a28b-8f6172711ab6",
            "applicant_name": documentId,
            "resume_uri": fileDataArray[0],
           
        }

        apiInstance.addJOBS(body)
            .then((response: any) => {
                if (response?.data._added) {
                    setSnackbar({
                        open: true,
                        severity: 'success',
                        message: "Job added successfull",
                    })
                    setLoad(false)
                    setTimeout(() => {
                        setIsOpen(false)
                    }, 1000)

                } else {
                    setLoad(false)
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: "Something went wrong",
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
                                height: '8%'
                            }}
                        >
                            <span style={{
                                fontFamily: "OpenSans",
                                fontSize: "20px",
                                fontWeight: 500,
                                textAlign: "left",
                            }}>
                                Update KYC
                            </span>
                            <button onClick={() => { setPreview(false); setIsOpen(false) }} style={{ width: '24px', height: '24px', backgroundColor: "transparent", border: '0px solid transparent' }}>
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
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                    width: '100%',
                                    gap: '20px',
                                }}
                            >

                                <TSITextfield
                                    title={`Document Id`}
                                    placeholder={`Enter Document Id`}
                                    value={documentId}
                                    isRequired={true}
                                    type={"text"}
                                    name={"field"}
                                    multiline={false}
                                    rows={1}
                                    handleChange={(event: any) => { setDocumentId(event.target.value) }}
                                />
                                <TSISingleDropdown
                                    name={"Document Type"}
                                    setFieldValue={setDocumentType}
                                    fieldvalue={documentType}
                                    dropdown={[]}
                                />

                            </div>


                            <TSIFileUpload
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
                            />




                        </div>
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
                                if (preview == false) {
                                    setPreview(true)
                                } else {
                                    addJobApplication()
                                }
                            }
                        }
                    />
                </div>

            </div>
        </Modal >
    )
}

export default TSIKYCAddModal
