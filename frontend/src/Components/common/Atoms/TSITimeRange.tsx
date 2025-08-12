import React, { useEffect, useRef, useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import colors from '../../../assets/styles/colors';
import TSITextfield from './TSITextfield';
import CustomTimePicker from './CustomTimePicker';

const TSITimeRange = ({ meetingTime, setMeetingTime }: any) => {
  const [startTimeObj, setStartTimeObj] = useState({ hour: '01', minute: '00', period: 'AM' });
  const [endTimeObj, setEndTimeObj] = useState({ hour: '01', minute: '00', period: 'AM' });
  const [snackbar, setSnackbar] = useState({ open: false, severity: 'error', message: '' });

  const didMount = useRef(false); 

  const showError = (message: string) => {
    setSnackbar({ open: true, severity: 'error', message });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const to24HourFormat = ({ hour, minute, period }: any) => {
    let h = parseInt(hour, 10);
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return `${h?.toString()?.padStart(2, '0')}:${minute}`;
  };

  const to12HourString = ({ hour, minute, period }: any) => {
    return `${parseInt(hour, 10)}:${minute} ${period}`;
  };

  useEffect(() => {
    if (meetingTime && meetingTime?.includes('-')) {
      const [start12, end12] = meetingTime?.split('-')?.map((str: any) => str?.trim());

      const parse12 = (time12: string) => {
        const [t, mod] = time12?.split(' ');
        const [h, m] = t?.split(':');
        return {
          hour: (parseInt(h, 10) % 12)?.toString()?.padStart(2, '0'),
          minute: m,
          period: mod?.toUpperCase(),
        };
      };

      setStartTimeObj(parse12(start12));
      setEndTimeObj(parse12(end12));
    }
  }, [meetingTime]);

  useEffect(() => {
    if (!didMount?.current) {
      didMount.current = true;
      return;
    }

    const start = new Date(`1970-01-01T${to24HourFormat(startTimeObj)}:00`);
    const end = new Date(`1970-01-01T${to24HourFormat(endTimeObj)}:00`);

    if (end <= start) {
      showError('End time must be greater than start time.');
      return;
    }

    const formatted = `${to12HourString(startTimeObj)}-${to12HourString(endTimeObj)}`;
    setMeetingTime(formatted);
    handleCloseSnackbar();
  }, [startTimeObj, endTimeObj]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '10px' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MuiAlert
          sx={{ backgroundColor: snackbar.severity === 'error' ? colors.red : colors.primary }}
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as AlertColor}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>

      <CustomTimePicker
        title="Meeting Start Time"
        isRequired
        hour={startTimeObj.hour}
        minute={startTimeObj.minute}
        period={startTimeObj.period}
        onTimeChange={setStartTimeObj}
      />

      <CustomTimePicker
        title="Meeting End Time"
        isRequired
        hour={endTimeObj.hour}
        minute={endTimeObj.minute}
        period={endTimeObj.period}
        onTimeChange={setEndTimeObj}
      />
    </div>
  );
};

export default TSITimeRange;