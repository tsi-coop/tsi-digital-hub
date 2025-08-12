import { Box } from '@mui/material';
import React, { useState } from 'react';
import colors from '../../../assets/styles/colors';

function CustomTimePicker({
  title = '',
  isRequired = false,
  hour,
  minute,
  period,
  onTimeChange = () => {},
  previewMode = false,
}: any) {
  const [isFocused, setIsFocused] = useState(true);
  const showLabelAsFloating = isFocused;

  const handleHourChange = (e: any) => onTimeChange({ hour: e.target.value, minute, period });
  const handleMinuteChange = (e: any) => onTimeChange({ hour, minute: e.target.value, period });
  const handlePeriodChange = (e: any) => onTimeChange({ hour, minute, period: e.target.value });

  return (
    <Box
      sx={{
        position: "relative",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: 'center',
        width: '100%',
        height: '40px',
        fontSize: "14px",
        fontFamily: 'OpenSans',
        borderRadius: '5px',
        border: `1px solid ${showLabelAsFloating ? colors.primary : colors.lightPrimaryBorder}`,
        '&:hover': { borderColor: colors.primary },
      }}
    >
      <Box
        component="label"
        sx={{
          position: "absolute",
          top: showLabelAsFloating ? "-10px" : "10px",
          left: "10px",
          fontSize: showLabelAsFloating ? "12px" : "15px",
          fontWeight: 500,
          color: colors.grey,
          backgroundColor: "white",
          padding: "0 4px",
          transition: "0.2s ease all",
        }}
      >
        {title}
        {isRequired && (<Box component="span" sx={{ color: colors.black, marginLeft: "2px" }}>*</Box>)}
      </Box>

      <Box
        onFocus={() => setIsFocused(true)}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: "space-evenly",
          alignItems: 'center',
          width: '100%',
          height: '35px',
          fontFamily: 'OpenSans',
          fontSize: '14px',
        }}
      >
        <select value={hour} onChange={handleHourChange} style={{ border: "none", outline: "none", width: '30%', height: '35px' }}>
          {[...Array(12).keys()].map((h) => {
            const hourStr = (h + 1).toString().padStart(2, '0');
            return <option key={hourStr} value={hourStr}>{hourStr}</option>;
          })}
        </select>

        <select value={minute} onChange={handleMinuteChange} style={{ border: "none", outline: "none", width: '30%', height: '35px' }}>
          <option value="00">00</option>
          <option value="30">30</option>
        </select>

        <select value={period} onChange={handlePeriodChange} style={{ border: "none", outline: "none", width: '30%', height: '35px' }}>
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </Box>
    </Box>
  );
}

export default CustomTimePicker;
