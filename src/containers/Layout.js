import React, {Fragment} from 'react';
import {useTheme} from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Header from './Header';
import Sidebar from './Sidebar';
//-------------------------------------

const Layout = React.memo(props => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true,
  });

  const [openSidebar, setOpenSidebar] = React.useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = matches ? true : openSidebar;

  const drawerWidth = 300;

  const useStyles = makeStyles(theme => ({
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
    },
    container: {
      flexGrow: 1,
      // padding: theme.spacing(3),
      paddingLeft: matches ? drawerWidth : 0,
      paddingTop: 60,
    },
    content: {
      [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    },
  }));

  const classes = useStyles();

  return (
    <Fragment>
      <Header onSidebarOpen={handleSidebarOpen} />
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={matches ? 'persistent' : 'temporary'}
      />
      <div className={classes.container}>
        <div className={classes.content}> {props.children}</div>
      </div>
    </Fragment>
  );
});

export default Layout;
