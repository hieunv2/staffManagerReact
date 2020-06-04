import React, {useState} from 'react';
import indexOf from 'lodash/indexOf';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//-------------------------------------

const CheckboxInput = React.memo(({order, label, value_list, onChange}) => {
  const [checked, setChecked] = useState([]);

  const handleChange = (event, option) => {
    if (event.target.checked) {
      checked.push(option);
    } else {
      let idx = indexOf(checked, option);
      if (idx !== -1) {
        checked.splice(idx, 1);
      }
    }
    setChecked(checked);

    const tmp = value_list.map(v => {
      if (indexOf(checked, v) !== -1) {
        return `<span style="padding-right:5px"><input type="checkbox" checked="true"><label>${v}</label></span>`;
      }
      return `<span style="padding-right:5px"><input type="checkbox"><label>${v}</label></span>`;
    });

    onChange(tmp.join(' - '));
  };

  return (
    <Grid container item xs={12} alignItems="center">
      <Grid item xs={12} md={4}>
        <Typography variant="subtitle1">
          {order}. {label}
        </Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        {value_list &&
          value_list.map(option => (
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  value={option}
                  onChange={event => handleChange(event, option)}
                />
              }
              label={option}
            />
          ))}
      </Grid>
    </Grid>
  );
});

export default CheckboxInput;
