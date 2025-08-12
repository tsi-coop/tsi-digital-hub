import React, { memo, useState } from 'react';
import { InputAdornment, Typography, Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import colors from '../../../assets/styles/colors';

const TSITextfield = ({
  title = '',
  placeholder = '',
  value = '',
  isRequired = false,
  errorMessage = '',
  type,
  name = '',
  multiline = false,
  rows = 0,
  trailingIcon = null,
  toolTipMessage = '',
  bracketText = '',
  trailImageHeight = 'auto',
  trailImageWidth = 'auto',
  handleChange = () => { },
  previewMode = false,
  description = '',
  currencyFormat = false,
  maxLength = null,
  hideLabel = false,
  isPassword = false,
  onKeyDown = () => { },
  minDate = null,
  maxDate = null,
}: any) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  };

  const handlePasswordToggle = () => setIsPasswordVisible((prev) => !prev);

  return (
    <Box
      sx={{
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '100%'
      }}
    >
      <TextField
        id="outlined-basic"
        label={(type === "date" || type === "time") ? title : title}
        variant="outlined"
        multiline={multiline}
        rows={multiline ? rows : 0}
        size="small"
        required={isRequired}
        value={type === "date" ? formatDate(value) : value}
        disabled={previewMode}
        placeholder={(type === "date" || type === "time") ? "" : placeholder}
        fullWidth
        type={type === "password" && !isPasswordVisible ? "password" : type ? type : "text"}
        sx={{
          fontFamily: 'OpenSans',
          fontSize: '14px',
          color: previewMode ? colors.black : colors.black,
          backgroundColor: previewMode ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              fontSize: "14px",
              fontFamily: 'OpenSans',
              borderColor: colors.lightPrimaryBorder,
            },
            '&:hover fieldset': {
              borderColor: colors.primary,
            },
            '&.Mui-focused fieldset': {
              border: `1.5px solid ${colors.primary}`,
            },
          },
        }}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (type == "date") {
            e.preventDefault()
          } else {
            if (e.key === "Enter") {
              onKeyDown(e);
              if (type === "date") e.preventDefault();
            }
          }
        }}
        InputLabelProps={{
          shrink: (type === "date" || type === "time") ? true : undefined,
        }}
        inputProps={{
          ...(maxLength ? { maxLength } : {}),
          ...(type === "date" && minDate ? { min: minDate } : {}),
          ...(type === "date" && maxDate ? { max: maxDate } : {}),
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {type === "password" && (
                isPasswordVisible ? (
                  <RemoveRedEyeIcon
                    sx={{ fontSize: 18, cursor: 'pointer' }}
                    onClick={handlePasswordToggle}
                  />
                ) : (
                  <VisibilityOffIcon
                    sx={{ fontSize: 18, cursor: 'pointer' }}
                    onClick={handlePasswordToggle}
                  />
                )
              )}
              {trailingIcon && (
                <img
                  src={trailingIcon}
                  alt="trailing icon"
                  style={{ width: trailImageHeight, height: trailImageWidth }}
                />
              )}
            </InputAdornment>
          )
        }}
      />

      {errorMessage && (
        <Typography
          sx={{
            color: 'red',
            fontSize: '12px',
            mt: '4px',
            textAlign: 'left'
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default memo(TSITextfield);
