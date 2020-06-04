import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
//-------------------------------------

const StampPlaceholder = React.memo(props => {
  const classes = useStyles();
  return <div className={classes.placeholder} />;
});

const useStyles = makeStyles({
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6e6e6',
    border: '1px dotted #808080',
    marginBottom: 5,
  },
});

export default StampPlaceholder;
