import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
//-------------------------------------

const TabPanel = React.memo(props => {
  const {children, value, index, ...other} = props;
  const classes = useStyles();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      <Paper variant="outlined" square className={classes.box}>
        {children}
      </Paper>
    </Typography>
  );
});

const useStyles = makeStyles(theme => ({
  box: {
    padding: theme.spacing(3),
  },
}));

export default TabPanel;
