import axios from 'axios';
import {AsyncStorage} from 'react-native';

// const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL || 'http://localhost:3010/' }); // todo .env
const axiosServices = axios.create({ baseURL: "http://10.0.2.2:8080" });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        const accessToken = AsyncStorage.getItem('serviceToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/login';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;

export const fetcher = async (args) => {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosServices.get(url, { ...config });

    return res.data;
};


/*
Developer note
    This is intented to be used in the future to automatice the token use
    And the logout by session expiration thing, not been used right now
    Just a copy from another proyect that is working right with this code
*/