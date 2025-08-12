import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import colors from '../../../assets/styles/colors';

const TSIMultipleDropdown = ({
  name,
  fieldvalue,
  setFieldValue,
  dropdown,
  previewMode
}: any) => {
  const handleChange = (event: any, value: any[]) => {
    setFieldValue(value);
  };

  return (
    <div style={{ width: '100%' }}>
      <Autocomplete
        multiple
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
            placeholder={name}
            sx={{
              "& .MuiButtonBase-root.MuiChip-root.MuiChip-filled.MuiChip-sizeSmall.MuiChip-colorDefault.MuiChip-deletable.MuiChip-deletableColorDefault.MuiChip-filledDefault.MuiAutocomplete-tag.MuiAutocomplete-tagSizeSmall.css-1okiqdd-MuiButtonBase-root-MuiChip-root":  {
                backgroundColor: colors.lightPrimary
              }

            }}
          />
        )}
        sx={{
          color: previewMode ? "rgba(0,0,0)" : colors.black,
          backgroundColor: previewMode ? 'rgba(255, 255, 255, 0.5)' : 'transparent',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: colors.primary,
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

export default TSIMultipleDropdown;
