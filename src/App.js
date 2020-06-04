import React, {Suspense} from 'react';
import {SnackbarProvider} from 'notistack';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import routes from './routes/routes';
import ProtectedRoute from './routes/ProtectedRoute';
import AuthProvider from './containers/Auth/AuthProvider';
import DialogProvider from './components/Dialog';
import Loading from './components/Loading';
import Layout from './containers/Layout';
import {ThemeProvider} from '@material-ui/core/styles';
import {createMuiTheme, responsiveFontSizes} from '@material-ui/core/styles';

import './common/i18n';
import MSMinchoFont from './assets/fonts/msmincho.ttc';
//-------------------------------------

const mincho = {
  fontFamily: 'MS Mincho',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('MS Mincho'),
    local('MS Mincho-Regular'),
    url(${MSMinchoFont}) format('ttc')
  `,
};

const NotFound = React.lazy(() => import('./containers/NotFound'));

let theme = createMuiTheme({
  typography: {
    fontFamily: ['Roboto', 'MS Mincho'].join(','),
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [mincho],
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const App = React.memo(() => (
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogProvider>
        <SnackbarProvider>
          <Router>
            <Switch>
              {routes.map((route, i) => {
                if (!route.protected) {
                  return (
                    <Route key={i} exact trict path={route.path}>
                      <Suspense fallback={<Loading />}>
                        <route.component />
                      </Suspense>
                    </Route>
                  );
                }
              })}

              <Route path="/">
                <Layout>
                  {routes.map((route, i) => {
                    if (route.protected) {
                      return (
                        <ProtectedRoute key={i} exact trict path={route.path}>
                          <Suspense fallback={<Loading />}>
                            <route.component />
                          </Suspense>
                        </ProtectedRoute>
                      );
                    }
                  })}
                </Layout>
              </Route>

              <Route exact trict path="*">
                <Suspense fallback={<Loading />}>
                  <NotFound />
                </Suspense>
              </Route>
            </Switch>
          </Router>
        </SnackbarProvider>
      </DialogProvider>
    </ThemeProvider>
  </AuthProvider>
));

export default App;
