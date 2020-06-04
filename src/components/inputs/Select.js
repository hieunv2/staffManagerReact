import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
//-------------------------------------

const SelectInput = React.memo(
  ({order, label, value_list, value, onChange}) => (
    <Grid container item xs={12} alignItems="center">
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1">
          {order}. {label}
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <TextField
          select
          variant="outlined"
          size="small"
          value={value}
          onChange={onChange}
          fullWidth>
          {value_list &&
            value_list.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
        </TextField>
      </Grid>
    </Grid>
  ),
);

export default SelectInput;
