import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import withStyles from '@material-ui/core/styles/withStyles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import StepButton from '@material-ui/core/StepButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AdjustRoundedIcon from '@material-ui/icons/AdjustRounded';

import {StepConnector} from '@material-ui/core';
import clsx from 'clsx';
//-------------------------------------

const HorizontalLinearStepper = React.memo(props => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = props.data.map(item => ({
    label: item.name,
    status:
      item.activated === 0
        ? 'NOT_ACTIVATED'
        : item.status === 0
        ? 'WAITING'
        : item.status === 2
        ? 'REJECTED'
        : 'COMPLETED',
    date: item.status !== 0 ? item.date : '',
  }));

  return (
    <div className={classes.root}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        connector={<CustomIconConnector />}>
        {steps.map((step, index) => {
          const completed = step.status !== 0;
          return (
            <Step key={index} completed={completed}>
              <StepButton
                optional={
                  <Typography className={classes.stepTopLabel}>
                    {step.label}
                  </Typography>
                }
                disableRipple
                disableTouchRipple>
                <StepLabel
                  StepIconComponent={CustomStepIcon}
                  StepIconProps={{
                    icon: step.status,
                    onClick: props.onClickStep,
                  }}>
                  {step.date}
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
});

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(4),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepTopLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
    fontWeight: 'bold',
  },
}));

export default HorizontalLinearStepper;

//-------------------------------------

const CustomIconConnector = withStyles(theme => ({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#3f51b5',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#3f51b5',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
}))(StepConnector);

const CustomStepIcon = React.memo(props => {
  const classes = useCustomStepIconStyles();
  const {active, completed} = props;

  const icons = {
    NOT_ACTIVATED: <AdjustRoundedIcon />,
    WAITING: <AccessTimeIcon />,
    COMPLETED: <CheckCircleIcon />,
    REJECTED: <CancelIcon />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
      onClick={props.onClick}>
      {icons[String(props.icon)]}
    </div>
  );
});

const useCustomStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: '#3f51b5',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: '#3f51b5',
    zIndex: 1,
    fontSize: 18,
  },
});
