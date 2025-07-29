import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

let logoutCallback = null;

export const setLogoutCallback = (callback) => {
  logoutCallback = callback;
};

const axiosServices = axios.create({
  baseURL: Config.API_URL || 'http://localhost:3010/',
});

axiosServices.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('serviceToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosServices.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (logoutCallback) {
        // Limpia token
        await AsyncStorage.removeItem('serviceToken').catch(() => {});
        // Ejecuta logout en la app
        logoutCallback();
      }
    }
    return Promise.reject(error.response?.data || 'Wrong Services');
  }
);

export { axiosServices as axios };