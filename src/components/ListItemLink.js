import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {NavLink as RouterLink} from 'react-router-dom';
import * as colors from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
//-------------------------------------

const ListItemTextMenu = withStyles({
  primary: {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 18,
  },
})(ListItemText);

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    textTransform: 'none',
    letterSpacing: 0,
    fontWeight: theme.typography.fontWeightMedium,
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      borderRadius: 5,
    },
  },
  active: {
    color: theme.palette.primary.main,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.primary.main,
    },
  },
}));

const ListItemLink = React.memo((props) => {
  const {icon, primary, to, className} = props;

  const classes = useStyles();

  const renderLink = useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to],
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        className={className}
        classes={{button: classes.button}}
        activeClassName={classes.active}
        exact>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemTextMenu primary={primary} />
      </ListItem>
    </li>
  );
});

export default ListItemLink;
