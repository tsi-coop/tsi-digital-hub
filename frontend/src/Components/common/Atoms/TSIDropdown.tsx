import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "100%",
    },
  },
};



function getStyles(dropdownvalue: any, fieldvalue: any, theme: any) {
  return {
    fontWeight: fieldvalue.includes(dropdownvalue)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function TSIDropdown({
  name,
  fieldvalue,
  setFieldValue,
  dropdown
}: any) {
  const theme = useTheme();

  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFieldValue(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div style={{ width: "100%", }}>
      <FormControl sx={{ width: "100%" }} size="small">
        <InputLabel id="demo-multiple-chip-label">{name}</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          sx={{
            textAlign: 'left'
          }}
          value={fieldvalue}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          MenuProps={MenuProps}
        >
          {dropdown.map(({ dropdownvalue, index }: any) => (
            <MenuItem
              key={index}
              value={dropdownvalue}
              style={getStyles(dropdownvalue, fieldvalue, theme)}
            >
              {dropdownvalue}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}