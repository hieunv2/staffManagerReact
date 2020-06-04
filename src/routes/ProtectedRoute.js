import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';

import {AuthContext} from '../containers/Auth/AuthProvider';
//-------------------------------------

const ProtectedRoute = React.memo(({children, ...rest}) => {
  const {user} = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={({location}) =>
        user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: {from: location},
            }}
          />
        )
      }
    />
  );
});

export default ProtectedRoute;
