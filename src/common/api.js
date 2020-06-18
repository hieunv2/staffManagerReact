import axios from 'axios';
//-----------------------------------------------

export const API_URL = process.env.REACT_APP_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'},
  timeout: 10 * 1000,
  validateStatus: (status) => status < 500,
});

export const apiProtected = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {'Content-Type': 'application/json'},
  timeout: 10 * 1000,
  validateStatus: (status) => status < 500,
});

export const setAccessToken = (token) => {
  apiProtected.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const login = async ({email, password}) => {
  try {
    const res = await api.post('/login', {
      email,
      password,
    });
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const logout = async () => {
  try {
    const res = await apiProtected.post('/logout');
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const forgotPassword = async (data) => {
  try {
    const res = await api.post('/forgot-password', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await api.post('/reset-password', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const me = async () => {
  try {
    const res = await apiProtected.post('/me');
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const searchUser = async (data) => {
  try {
    const res = await apiProtected.post('/users/search?per_page=1000', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const searchTask = async (data) => {
  try {
    const res = await apiProtected.post('/tasks/search?per_page=1000', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await apiProtected.post('me/update-profile', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const getResourceData = async (resource) => {
  try {
    const res = await apiProtected.get(`/${resource}`);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const createResource = async (resource, data) => {
  try {
    const res = await apiProtected.post(`/${resource}`, data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const updateResource = async (resource, id, data) => {
  try {
    const res = await apiProtected.put(`/${resource}/${id}`, data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const deleteResource = async (resource, id) => {
  try {
    const res = await apiProtected.delete(`/${resource}/${id}`);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const getFileUrl = () => {
  return `${API_URL}/files`;
};

export const genPdf = async (data) => {
  try {
    const res = await apiProtected.post('/files', data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const activateApproval = async (id, data) => {
  try {
    const res = await apiProtected.post(`/activate-approval/${id}`, data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const approve = async (id, data) => {
  try {
    const res = await apiProtected.post(`/approval-requests/${id}`, data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};

export const updateStamp = async (data) => {
  try {
    const res = await apiProtected.post(`/stamps`, data);
    return res.data;
  } catch (e) {
    return {error: 'server_error'};
  }
};
