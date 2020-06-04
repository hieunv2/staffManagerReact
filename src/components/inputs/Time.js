import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//-------------------------------------

const TimeInput = React.memo(({order, label, value, onChange}) => (
  <Grid container item xs={12} alignItems="center">
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1">
        {order}. {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          margin="normal"
          format="HH:mm"
          value={value || null}
          onChange={onChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </MuiPickersUtilsProvider>
    </Grid>
  </Grid>
));

export default TimeInput;
