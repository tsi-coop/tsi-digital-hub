import { useRef, useState } from "react";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import useDeviceType from "../../../Utils/DeviceType";
import apiInstance from "../../../services/authService";
import colors from "../../../assets/styles/colors";
import { LinearProgress, linearProgressClasses, styled, Typography } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Delete } from "@mui/icons-material";
const maxSize = 5 * 1024 * 1024;
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: colors.lightPrimary,
        ...theme.applyStyles('dark', {
            backgroundColor: colors.primary,
        }),
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: colors.primary,
        ...theme.applyStyles('dark', {
            backgroundColor: colors.primary,
        }),
    },
}));

const TSIFileUpload = ({
    uploadedImage,
    uploadTitle = "Link or drag and drop",
    imgCardLabel,
    name,
    fileType,
    fileSize,
    isRequired = false,
    setUploadedImage,
    previewMode = false,
    fileDataArray,
    fileDataArrayDetails,
    setFileDataArrayDetails,
    setFileDataArray,
    downloadFile = (fileData: any) => { },
    collateralid,
    setCollateralId
}: any) => {

    const [loader, setLoader] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const deviceType = useDeviceType();

    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: "success" as AlertColor,
        message: "",
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoader(true);
        const files = event.target.files;
        if (!files || files.length === 0) {
            setLoader(false);
            return;
        }

        const file = files[0];

        if (file.size > maxSize) {
            setSnackbar({
                open: true,
                severity: "error",
                message: "File size exceeded",
            });
            setLoader(false);
            return;
        }

        if (file.type !== "application/pdf") {
            setSnackbar({
                open: true,
                severity: "error",
                message: "Please upload a valid PDF file",
            });
            setLoader(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
                const fileContent = e.target.result as string;
                const newFileData = {
                    filename: file.name,
                    size: `${(file.size / 1024).toFixed(2)} KB`,
                    load: true,
                    filedata: fileContent,
                };

                setFileDataArray((prevData: any) => [...prevData, fileContent]);
                setFileDataArrayDetails((prevData: any) => [...prevData, newFileData]);

                const fileData = {
                    "_func": "upload_file",
                    "file_data": fileContent,
                    "file_extn": file.name.split('.').pop() || "pdf"
                };

                apiInstance
                    .uploadDocument(fileData)
                    .then((response) => {
                        if (response?.data?._docid) {
                            setCollateralId(response?.data?._docid)
                            setFileDataArrayDetails((prevData: any) =>
                                prevData.map((item: any) =>
                                    item.filename === newFileData.filename ? { ...item, load: false } : item
                                )
                            );
                            setSnackbar({
                                open: true,
                                severity: "success",
                                message: "File uploaded successfully",
                            });
                        }
                      
                    })
                    .catch((error: any) => {
                        setSnackbar({
                            open: true,
                            severity: "error",
                            message: error?.response?.data?.error || "Something went wrong!!",
                        });
                    })
                    .finally(() => setLoader(false));
            } else {
                setLoader(false);
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: "Failed to read file",
                });
            }
        };

        reader.readAsText(file);
    };


    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div style={{
            width: '100%',
            background: colors.white,
        }} >

            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    sx={{
                        backgroundColor: snackbar.severity == "error" ? colors.red : colors.primary
                    }}
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
            <>
                {imgCardLabel && (
                    <Typography
                        style={{
                            marginBottom: '2px',
                            color: colors.black,
                            fontFamily: 'OpenSans',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '140%',
                            textAlign: 'left'
                        }}
                    >
                        {imgCardLabel}{' '}
                        {isRequired && (
                            <span
                                style={{
                                    color: `var(--Zupotso-Primary, ${colors.red})`,
                                    fontFamily: 'OpenSans',
                                    fontSize: '14px',
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    lineHeight: '140%',
                                }}
                            >
                                *
                            </span>
                        )}
                    </Typography>
                )}
                {fileSize && (
                    <Typography
                        style={{
                            marginBottom: '10px',
                            color: `var(--Gray-1, ${colors.grey})`,
                            fontFamily: 'OpenSans',
                            fontSize: '12px',
                            fontStyle: 'normal',
                            fontWeight: '500',
                            lineHeight: '140%',
                        }}
                    >
                        <i>{fileSize}</i>
                    </Typography>
                )}
            </>
            <div
                onClick={triggerFileInput}
                style={{
                    maxWidth: '100%',
                    marginTop: '10px',
                    height: "100px",
                    border: `1px dashed ${colors.snowywhite}`,
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    cursor: "pointer",
                }}
            >
                <UploadFileIcon sx={{ color: colors.primary, width: '30px', height: "30px" }} />
                <Typography
                    style={{
                        textAlign: 'center',
                        color: 'var(--Gray-1, #333)',
                        fontFamily: 'OpenSans',
                        fontSize: '12px',
                        fontStyle: 'normal',
                        fontWeight: '500',
                        lineHeight: '140%',
                    }}
                >
                    {uploadTitle}
                </Typography>
                <Typography
                    style={{
                        textAlign: 'center',
                        marginTop: '5px',
                        color: colors.lightgrey,
                        fontStyle: 'normal',
                        fontFamily: "OpenSans",
                        fontSize: "12px",
                        fontWeight: 400,
                        lineHeight: "19.6px",
                        letterSpacing: "-0.02em",
                        textUnderlinePosition: "from-font",
                        textDecorationSkipInk: "none",

                    }}
                >
                    SVG, PNG, JPG or GIF (max. 3MB)
                </Typography>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", marginTop: '10px' }}>


                {fileDataArrayDetails?.map((item: any, index: any) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", width: '100%',gap:"25px" }}>
                        <div >
                            <UploadFileIcon sx={{ color: colors.primary, width: '25px', height: "25px" }} />
                        </div>
                        <div style={{  display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '5px' }}>
                            <p
                                style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "22.4px",
                                    textAlign: "left",
                                    margin: 0,
                                    padding: 0
                                }}
                            >{item?.filename}</p>
                            <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", gap: "5px" }}>
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "19.6px",
                                    color: colors.lightgrey
                                }}>{item?.size}</span>
                                {(item?.load) && (<FiberManualRecordIcon sx={{ width: '5px', height: "5px" }} />)}
                                <span style={{
                                    fontFamily: "OpenSans",
                                    fontSize: "14px",
                                    fontWeight: 400,
                                    lineHeight: "19.6px",
                                    color: colors.lightgrey
                                }}>
                                    {item?.load ? "Loading" : ""}
                                </span>

                            </div>
                            {(item?.load)&&(<BorderLinearProgress variant="determinate" value={(item?.load == true && item?.filename) ? 50 : (item?.load == false && !item?.filename) ? 0 : 100} sx={{ width: '100%' }} />)}
                        </div>
                        <button
                            style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: "transparent",
                                border: "0px solid transparent",
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setFileDataArray((prevData: any) => prevData.filter((_: any, i: any) => i !== index));
                                setFileDataArrayDetails((prevData: any) => prevData.filter((_: any, i: any) => i !== index));

                            }}
                        >
                            <Delete sx={{
                                color: colors.lightgrey,
                                width: "20px",
                                height: "20px",
                            }} />
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default TSIFileUpload;
