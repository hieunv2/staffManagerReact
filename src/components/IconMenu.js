import React, {Fragment, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
//-------------------------------------

const CustomizedMenu = React.memo(props => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();

  return (
    <Fragment>
      <IconButton onClick={handleClick}>{props.icon}</IconButton>
      <Menu
        className={classes.menu}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}>
        {props.items &&
          props.items.map((item, i) => (
            <Fragment key={i}>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  item.onClick();
                }}>
                {item.icon && (
                  <ListItemIcon className={classes.itemIcon}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <Typography variant="inherit">{item.text}</Typography>
              </MenuItem>
              {i + 1 < props.items.length && <Divider />}
            </Fragment>
          ))}
      </Menu>
    </Fragment>
  );
});

const useStyles = makeStyles(theme => ({
  menu: {
    width: 200,
  },
  itemIcon: {
    minWidth: 36,
  },
}));

export default CustomizedMenu;
