import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
//-------------------------------------

const RadioInput = React.memo(({order, label, value, onChange, list}) => (
  <Grid container item xs={12} alignItems="center">
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1">
        {order}. {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      <RadioGroup value={value} onChange={onChange} row>
        {list &&
          list.map(option => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio color="primary" />}
              label={option}
              labelPlacement="end"
            />
          ))}
      </RadioGroup>
    </Grid>
  </Grid>
));

export default RadioInput;
