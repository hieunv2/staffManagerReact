import React, {useState, useContext} from 'react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {AuthContext} from './Auth/AuthProvider';
import {positions} from '../common/constants';
import ListItemLink from '../components/ListItemLink';

import logo from '../assets/images/logo.png';

//-------------------------------------

const ClippedDrawer = React.memo((props) => {
  const location = useLocation();
  const {t} = useTranslation();
  const auth = useContext(AuthContext);

  const [openUM, setOpenUM] = useState(
    location.pathname.indexOf('/users') !== -1,
  );
  const [openAM, setOpenAM] = useState(
    location.pathname.indexOf('/departments') !== -1,
  );
  const [openSM, setOpenSM] = useState(
    location.pathname.indexOf('/status') !== -1,
  );
  const [openTM, setOpenTM] = useState(
    location.pathname.indexOf('/templates') !== -1,
  );

  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      onClose={props.onClose}
      open={props.open}
      variant={props.variant}>
      <div className={classes.toolbar}>
        <img src={logo} alt="Logo" className={classes.logo} />
      </div>
      <Divider />
      <div className={classes.menuList}>
        {auth.user?.position === positions.ADMIN && (
          <List>
            <ListItemMenu
              button
              onClick={() => setOpenUM(!openUM)}
              classes={{button: classes.button}}>
              <ListItemIcon classes={{root: classes.icon}}>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemTextMenu primary="Quản lý nhân viên" />
              {openUM ? <ExpandLess /> : <ExpandMore />}
            </ListItemMenu>
            <Collapse in={openUM} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                onClick={() => props.onClose(false)}>
                <ListItemLink
                  to="/users"
                  primary="Danh sách nhân viên"
                  className={classes.nested}
                />
                <ListItemLink
                  to="/users/create"
                  primary="Thêm nhân viên"
                  className={classes.nested}
                />
              </List>
            </Collapse>
          </List>
        )}

        <List>
          <ListItemMenu button onClick={() => setOpenAM(!openAM)}>
            <ListItemIcon classes={{root: classes.icon}}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemTextMenu primary="Quản lý phòng ban" />
            {openAM ? <ExpandLess /> : <ExpandMore />}
          </ListItemMenu>
          <Collapse in={openAM} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              onClick={() => props.onClose(false)}>
              <ListItemLink
                to="/departments"
                primary="Danh sách phòng ban"
                className={classes.nested}
              />
              <ListItemLink
                to="/departments/create"
                primary="Thêm phòng ban"
                className={classes.nested}
              />
            </List>
          </Collapse>
        </List>

        <List>
          <ListItemMenu button onClick={() => setOpenSM(!openSM)}>
            <ListItemIcon classes={{root: classes.icon}}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemTextMenu primary="Công việc" />
            {openSM ? <ExpandLess /> : <ExpandMore />}
          </ListItemMenu>
          <Collapse in={openSM} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              onClick={() => props.onClose(false)}>
              <ListItemLink
                to="/tasks"
                primary="Danh sách công việc"
                className={classes.nested}
              />
              <ListItemLink
                to="/tasks/create"
                primary="Thêm công việc"
                className={classes.nested}
              />
            </List>
          </Collapse>
        </List>

        <List>
          <ListItemMenu button onClick={() => setOpenSM(!openSM)}>
            <ListItemIcon classes={{root: classes.icon}}>
              <InboxIcon />
            </ListItemIcon>
            <ListItemTextMenu primary="Trạng thái công việc" />
            {openSM ? <ExpandLess /> : <ExpandMore />}
          </ListItemMenu>
          <Collapse in={openSM} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              onClick={() => props.onClose(false)}>
              <ListItemLink
                to="/status"
                primary="Danh sách trạng thái"
                className={classes.nested}
              />
              <ListItemLink
                to="/status/create"
                primary="Thêm trang thái"
                className={classes.nested}
              />
            </List>
          </Collapse>
        </List>

        <Divider />

        {auth.user?.position === positions.MANAGER && (
          <List>
            <ListItemMenu button onClick={() => setOpenTM(!openTM)}>
              <ListItemIcon classes={{root: classes.icon}}>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemTextMenu primary={t('sidebar.template_management')} />
              {openTM ? <ExpandLess /> : <ExpandMore />}
            </ListItemMenu>
            <Collapse in={openTM} timeout="auto" unmountOnExit>
              <List
                component="div"
                disablePadding
                onClick={() => props.onClose(false)}>
                <ListItemLink
                  to="/templates"
                  primary={t('sidebar.template_list')}
                  className={classes.nested}
                />
                <ListItemLink
                  to="/templates/create"
                  primary={t('sidebar.create_template')}
                  className={classes.nested}
                />
              </List>
            </Collapse>
          </List>
        )}
      </div>
    </Drawer>
  );
});

const ListItemMenu = withStyles({
  button: {
    textTransform: 'none',
    letterSpacing: 0,
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      borderRadius: 5,
    },
  },
})(ListItem);

const ListItemTextMenu = withStyles({
  primary: {
    fontFamily: 'Roboto',
    fontWeight: 600,
  },
})(ListItemText);

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    flexShrink: 0,
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  menuList: {
    marginTop: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {},
  logo: {
    paddingTop: 6,
    paddingBottom: 6,
  },
  nested: {
    paddingLeft: theme.spacing(2) + 40, // + minWidth icon
  },
  icon: {
    minWidth: 40,
  },
  copyright: {
    position: 'absolute',
    bottom: 0,
    padding: theme.spacing(2),
    marginRight: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.grey[200]}`,
  },
}));

export default ClippedDrawer;
