import { Button, styled, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Delete } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import colors from '../../../assets/styles/colors';
import TSIButton from './TSIButton';
import { useDropzone } from 'react-dropzone';
import apiInstance from '../../../services/authService';
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertColor } from '@mui/material/Alert';

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

export function TSIDocUpload({
  uploadedImage,
  uploadTitle = "Link or drag and drop",
  imgCardLabel,
  name,
  fileType,
  fileSize,
  isRequired = false,
  setUploadedImage,
  previewMode = false,
  showToastMessage = true,
  showDownloadIcon = false,
  downloadFile = (fileData: any) => { },
}: any) {
  const [errorMessage, setErrorMessage] = useState('');
  const [load, setLoad] = useState(false)
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
    width: '100%',
    height: '100%',
    borderRadius: '4px',
  };


  const [files, setFiles] = useState<any>([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'File size exceeded',
      });
      return;
    }

    const fileData = {
      "_func": "upload_file",
      "file_data": new Blob([file], { type: file.type }),
      "file_extn": file.name.split('.').pop() || "png"
    };


    if (file.type === 'application/pdf') {
      apiInstance.uploadDocument(fileData)
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
          setLoad(false);
        })
        .catch((error: any) => {
          setSnackbar({
            open: true,
            severity: 'error',
            message: error?.response?.data?.error || 'Something went wrong!!',
          });
          setLoad(false);
        });
    } else {
      setSnackbar({
        open: true,
        severity: 'error',
        message: 'Please upload a valid PDF file',
      });
      setLoad(false);
    }
  }, []);




  useEffect(() => {

    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: {
    //   'image/*': [],
    // },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (

    <div style={{ width: '100%', }}>

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

      <div style={{ maxWidth: '100%', marginTop: '10px' }}>
        {fileType !== 'pdf' ? (
          <>
            {!previewMode && (
              <div
                style={{
                  maxWidth: '100%',
                  height: '100%',
                  cursor: 'pointer',
                  background: colors.white,
                }}
              >
                {!uploadedImage && (
                  <div
                    {...getRootProps()}
                    style={{
                      padding: '20px',
                      paddingTop: '15px',
                      border: `1px dashed ${colors.snowywhite}`,
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column',
                      gap: '5px'
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
                    {/* <input type="file" onChange={onFileChange} accept="image/*" /> */}
                    <input {...getInputProps()} />
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
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* <input type="file" onChange={onFileChange} accept=".pdf"  /> */}
            <div {...getRootProps()} style={{ width: '100px', backgroundColor: '#FFF' }}>
              <input {...getInputProps()} />
              <p>Drop files here</p>
            </div>
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
    </div >
  );
}

export default TSIDocUpload;
