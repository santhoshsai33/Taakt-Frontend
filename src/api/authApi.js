import axiosClient from './axiosClient';

export const loginUser = (payload) => {
  return axiosClient.post('/auth/login', payload);
};

export const getProfile = () => {
  return axiosClient.get('/auth/me');
};

export const updateProfile = (payload) => {
  return axiosClient.put('/auth/me/update', payload);
};

