import React, {useState, useEffect, createContext} from 'react';
import Cookies from 'js-cookie';
import * as api from '../../common/api';
import Loading from '../../components/Loading';
//-------------------------------------

export const AuthContext = createContext(null);

/**
 * Restore auth user from access_token is persisted in localStorage.
 *
 * TODO: handle refresh token in here.
 */
const AuthProvider = React.memo(props => {
  const [user, setUser] = useState(null);
  const [isLoaded, setLoaded] = useState(false);

  const updateToken = async (token, remember) => {
    if (remember) {
      localStorage.setItem('access_token', token);
    } else {
      Cookies.set('access_token', token);
    }
    api.setAccessToken(token);
    let res = await api.me();
    if (res.success && res.data) {
      setUser(res.data);
    }
  };

  const updateUser = async data => {
    setUser(data);
  };

  const clear = async () => {
    localStorage.clear();
    Cookies.remove('access_token');
    setUser(null);
  };

  const value = {
    user,
    updateToken,
    updateUser,
    clear,
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem('access_token')
        ? localStorage.getItem('access_token')
        : Cookies.get('access_token');
      if (token) {
        api.setAccessToken(token);
        let res = await api.me();
        if (res.data) {
          setUser(res.data);
        }
      }
      setLoaded(true);
    };
    getUserInfo();
  }, []);

  if (!isLoaded) {
    return <Loading />;
  }

  return <AuthContext.Provider value={value} {...props} />;
});

export default AuthProvider;
