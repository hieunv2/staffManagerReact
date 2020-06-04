import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//-------------------------------------

const DateInput = React.memo(({order, label, value, onChange}) => (
  <Grid container item xs={12} alignItems="center">
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1">
        {order}. {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          disableToolbar
          format="yyyy/MM/dd"
          value={value || null}
          onChange={onChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>
    </Grid>
  </Grid>
));

export default DateInput;
