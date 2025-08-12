import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import colors from '../../../assets/styles/colors';

const TSISingleDropdown = ({
  name,
  fieldvalue,
  setFieldValue,
  dropdown,
  isRequired=false,
  previewMode,
}: any) => {
  const handleChange = (event: any, value: any[]) => {
    setFieldValue(value);
  };

  return (
    <div style={{ width: '100%' }}>
      <Autocomplete
        id="tags-outlined"
        options={dropdown}
        size="small"
        value={fieldvalue} 
        onChange={handleChange}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label={name}
            required={isRequired}
            placeholder={name}
          />
        )}
        disabled={previewMode}
        sx={{
          color: previewMode ? "rgba(0,0,0)" : "#000",
          backgroundColor: previewMode ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
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
      />
    </div>
  );
};

export default TSISingleDropdown;
