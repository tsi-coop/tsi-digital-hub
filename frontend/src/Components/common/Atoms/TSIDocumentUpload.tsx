import { Typography ,styled} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Close, Delete } from '@mui/icons-material';
import { useState } from 'react';
import useDeviceType from '../../../Utils/DeviceType';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import apiInstance from '../../../services/authService';
import { deleteIcon, editIcon } from '../../../assets';
import colors from '../../../assets/styles/colors';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
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

export interface TSIDocumentUploadProps {
    uploadedImage: any;
    name: string;
    imgCardLabel?: string;
    uploadTitle?: string;
    fileType?: string;
    fileSize?: string;
    isRequired?: boolean;
    isTooltip?: any
    setUploadedImage: (name: string, imageUrl: any, file: any, type: any) => void;
    previewMode?: boolean;
    showToastMessage?: boolean;
    showDownloadIcon?: boolean;
    downloadFile?: (filedata: any) => void;
    index?: any;
    handleDelete?: any
}

export function TSIDocumentUpload({
    uploadedImage,
    uploadTitle = "Link or drag and drop",
    imgCardLabel,
    name,
    fileType,
    fileSize,
    handleDelete,
    isRequired = false,
    setUploadedImage,
    previewMode = false,
    showToastMessage = true,
    showDownloadIcon = false,
    downloadFile = (fileData: any) => { },
}: TSIDocumentUploadProps) {
    const [errorMessage, setErrorMessage] = useState('');
    const deviceType = useDeviceType();

    const [loader, setLoader] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState([{
        filename: "document_file_name.pdf",
        size: "100kb",
        load: true
      }])
    const [snackbar, setSnackbar] = useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const imageStyle = {
        maxWidth: '200px',
        height: "100%",
        borderRadius: '4px',

    };
    const onDrop = async (acceptedFiles: any) => {
        setLoader(true)
        const file = acceptedFiles[0];
        const maxSize = 10 * 1024 * 1024;

        if (fileType === 'pdf') {
            if (file.size > maxSize) {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: 'File size exceeded',
                });
                return;
            }

            if (file.type === 'application/pdf') {
                apiInstance.uploadDocument(file)
                    .then((res2: any) => {
                        setUploadedImage(name, res2.data.data[0], file, "document");
                        setErrorMessage('');
                        if (showToastMessage) {
                            setSnackbar({
                                open: true,
                                severity: 'success',
                                message: 'File uploaded successfully',
                            });
                        }
                        setLoader(false)
                    })
                    .catch((error: any) => {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: error?.response?.data?.error || 'something went wrong!!',
                        });
                        setLoader(false)
                    });




            } else {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: 'Please Upload Valid PDF File',
                });
                setLoader(false)
            }
        }
        else {
            if (file.type.startsWith('image/')) {
                const maxImageSize = 10 * 1024 * 1024; // 10 MB
                if (file.size > maxImageSize) {
                    setSnackbar({
                        open: true,
                        severity: 'error',
                        message: 'Image size exceeded',
                    });
                    return;
                }
                apiInstance.uploadDocument(file)
                    .then((res2: any) => {
                        setUploadedImage(name, res2.data.data[0], file, "image");
                        setErrorMessage('');
                        if (showToastMessage) {
                            setSnackbar({
                                open: true,
                                severity: 'success',
                                message: 'Image uploaded successfully',
                            });
                        }
                        setLoader(false)
                    })
                    .catch((error: any) => {
                        setSnackbar({
                            open: true,
                            severity: 'error',
                            message: error?.response?.data?.error || 'something went wrong!!',
                        });
                        setLoader(false)
                    });

            } else {
                setSnackbar({
                    open: true,
                    severity: 'error',
                    message: 'Please Upload JPG/PNG Image',
                });
                setLoader(false)
            }
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            {(loader) && (
                <div className="centered-container">
                    <div className="loader"></div>
                </div>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity as AlertColor}
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                {/* {!previewMode && ( */}
                <>
                    {imgCardLabel && (
                        <Typography
                            style={{
                                marginBottom: '2px',
                                color: 'var(--Gray-1, #333)',
                                fontFamily: 'Inter',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: '600',
                                lineHeight: '140%',
                            }}
                        >
                            {imgCardLabel}{' '}
                            {isRequired && (
                                <span
                                    style={{
                                        color: `var(--Zupotso-Primary, ${colors.red})`,
                                        fontFamily: 'Inter',
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
                                fontFamily: 'Inter',
                                fontSize: '12px',
                                fontStyle: 'normal',
                                fontWeight: '500',
                                lineHeight: '140%',
                                textAlign: "left"
                            }}
                        >
                            <i>{fileSize}</i>
                        </Typography>
                    )}
                </>
                {/* )} */}
                <div style={{
                    width: '100%', height: '100px', background: colors.white,
                }}>
                    {fileType !== 'pdf' ? (
                        <>
                            {!previewMode && (
                                <div
                                    style={{
                                        // width: '330px',
                                        cursor: 'pointer',
                                        background: colors.white,
                                    }}
                                >
                                    {!uploadedImage && (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div
                                                style={{
                                                    padding:
                                                        deviceType === 'mobile' ? '12px 8px' : '20px',
                                                    border: `1.5px dashed ${colors.snowywhite}`,
                                                    borderRadius: '4px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <UploadFileIcon sx={{ color: colors.primary, width: '30px', height: "30px" }} />
                                                <Typography
                                                    style={{
                                                        textAlign: 'center',
                                                        marginTop: '10px',
                                                        color: 'var(--Gray-1, #333)',
                                                        fontFamily: 'Inter',
                                                        fontSize: '12px',
                                                        fontStyle: 'normal',
                                                        fontWeight: '500',
                                                        lineHeight: '140%',
                                                    }}
                                                >
                                                    {uploadTitle}
                                                </Typography>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {uploadedImage && (
                                <div
                                    style={{
                                        position: 'relative',
                                        textAlign: 'center',
                                        color: 'white',
                                        height: '112px',
                                        border: "1px solid #dfd2d2",
                                        borderRadius: '4px',
                                    }}
                                >
                                    <div
                                        style={{
                                            // marginTop: '10px',
                                            height: '100%',
                                            width: '100%',
                                            objectFit: 'fill',
                                            position: 'relative',
                                            textAlign: 'center',
                                            color: 'white',
                                        }}
                                    >
                                        <img
                                            id={'test-' + uploadedImage}
                                            src={
                                                uploadedImage?.startsWith('data:image')
                                                    ? uploadedImage
                                                    : uploadedImage?.startsWith('https://')
                                                        ? uploadedImage
                                                        : `data:image/png;base64,${uploadedImage}`
                                            }
                                            alt="Uploaded"
                                            style={imageStyle}
                                        />
                                        {!previewMode && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '8px',
                                                    right: '8px',
                                                    display: 'flex',
                                                    gap: '10px',
                                                }}
                                            >
                                                <div>
                                                    <div {...getRootProps()}>
                                                        <input {...getInputProps()} />
                                                        <img
                                                            src={editIcon}
                                                            style={{ cursor: 'pointer' }}
                                                            alt="edit-icon"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <img
                                                        src={deleteIcon}
                                                        alt="delete-icon"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            handleDelete(name)

                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div
                                {...getRootProps()}
                                style={{
                                    pointerEvents: showDownloadIcon ? 'none' : 'auto',
                                }}
                            >
                                <input {...getInputProps()} />
                                <>
                                    {fileType === 'pdf' && (
                                        <>
                                            {!previewMode && (
                                                <div
                                                    style={{
                                                        cursor: 'pointer',
                                                        background: colors.white,
                                                    }}
                                                >
                                                    <div
                                                        className="dashed-border"
                                                        style={{
                                                            padding:
                                                                deviceType === 'mobile' ? '12px 8px' : '20px',
                                                            border: `1.5px dashed ${colors.snowywhite}`,
                                                            borderRadius: '4px',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            flexDirection: 'column',
                                                        }}
                                                    >
                                                        <UploadFileIcon sx={{ color: colors.primary, width: '30px', height: "30px" }} />

                                                        <Typography
                                                            style={{
                                                                textAlign: 'center',
                                                                marginTop: '10px',
                                                                color: 'var(--Gray-1, #333)',
                                                                fontFamily: 'Inter',
                                                                fontSize: '12px',
                                                                fontStyle: 'normal',
                                                                fontWeight: '500',
                                                                lineHeight: '140%',
                                                            }}
                                                        >
                                                            {uploadTitle}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            </div>
                            {uploadedImage && (
                                <div
                                    style={{
                                        marginTop: '10px',
                                        border: '1px solid grey',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '5px',
                                    }}
                                >
                                    <Typography
                                        style={{
                                            color: 'var(--Gray-1, #333)',
                                            fontFamily: 'Inter',
                                            fontSize: '16px',
                                            fontStyle: 'normal',
                                            fontWeight: '700',
                                            lineHeight: '140%',
                                            overflow: 'hidden',          // Hide overflowed text
                                            textOverflow: 'ellipsis',    // Add ellipsis if text overflows
                                            whiteSpace: 'nowrap',        // Prevent text from wrapping to next line
                                            maxWidth: deviceType == "mobile" ? "110px" : '330px',
                                        }}
                                    >
                                        {uploadedImage ? uploadedImage.split("__")[1]?.replaceAll("%20", " ") : ""}
                                    </Typography>
                                    {!previewMode &&
                                        (showDownloadIcon ? (
                                            <FileDownloadIcon
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    downloadFile(uploadedImage);
                                                }}
                                            />
                                        ) : (
                                            <Close
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => { handleDelete(name) }}
                                            />
                                        ))}
                                </div>
                            )}
                        </>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: "center", marginTop: '10px' }}>


                        {uploadedFiles.map((item, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", alignItems: "center", width: '100%' }}>
                                <div style={{ width: '10%' }}>
                                    <UploadFileIcon sx={{ color: colors.primary, width: '25px', height: "25px" }} />
                                </div>
                                <div style={{ width: '70%', display: "flex", flexDirection: 'column', justifyContent: 'flex-start', alignItems: "flex-start", gap: '5px' }}>
                                    <p
                                        style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "16px",
                                            fontWeight: 400,
                                            lineHeight: "22.4px",
                                            textAlign: "left",
                                            margin: 0,
                                            padding: 0
                                        }}
                                    >{item.filename}</p>
                                    <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center", gap: "5px" }}>
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            lineHeight: "19.6px",
                                            color: colors.lightgrey
                                        }}>{item.size}</span>
                                        <FiberManualRecordIcon sx={{ width: '5px', height: "5px" }} />
                                        <span style={{
                                            fontFamily: "OpenSans",
                                            fontSize: "14px",
                                            fontWeight: 400,
                                            lineHeight: "19.6px",
                                            color: colors.lightgrey
                                        }}>
                                            {item.load ? "Loading" : ""}
                                        </span>

                                    </div>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '100%' }} />
                                </div>
                                <button
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: "transparent",
                                        border: "0px solid transparent",
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => { }}
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
                    <div style={{ color: 'red', marginTop: '5px' }}>{errorMessage}</div>
                </div>
            </div>
        </>
    );
}

export default TSIDocumentUpload;
