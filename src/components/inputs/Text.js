import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
//-------------------------------------

const TextInput = React.memo(({order, label, value, onChange}) => (
  <Grid container item xs={12} alignItems="center">
    <Grid item xs={12} md={4}>
      <Typography variant="subtitle1">
        {order}. {label}
      </Typography>
    </Grid>
    <Grid item xs={12} md={8}>
      <TextField
        variant="outlined"
        size="small"
        value={value}
        onChange={onChange}
        fullWidth
      />
    </Grid>
  </Grid>
));

export default TextInput;
