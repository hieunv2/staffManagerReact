import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from '@material-ui/core/styles';
//-------------------------------------

const Loading = React.memo(props => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      {props.size === 'small' ? <CircleSpinner /> : <CircularProgress />}
    </div>
  );
});

const useStyles = makeStyles({
  container: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loading;

//-------------------------------------

const CircleSpinner = React.memo(props => {
  const classes = useCircleStyles();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        value={100}
        className={classes.top}
        size={24}
        thickness={4}
        {...props}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.bottom}
        size={24}
        thickness={4}
        {...props}
      />
    </div>
  );
});

const useCircleStyles = makeStyles({
  root: {
    position: 'relative',
  },
  top: {
    color: '#eef3fd',
  },
  bottom: {
    color: '#6798e5',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
});
