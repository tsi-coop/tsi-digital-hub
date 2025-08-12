import React, { useState } from 'react';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import colors from '../../../assets/styles/colors';

interface TSISwitchProps {
  // Define props here if needed
  checkstatus: boolean;
  setStatus: any
}

const TSISwitch = styled((props: TSISwitchProps) => {
  const [checked, setChecked] = useState(props.checkstatus); // State for checked status

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    props.setStatus(event.target.checked)
  };

  return (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  );
})

  (({ theme }: { theme: Theme }) => ({
    width: 36,
    height: 22,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,

      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0,106,103,0.8)' : colors.primary,
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 17,
      height: 17,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,

      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

export default TSISwitch;
