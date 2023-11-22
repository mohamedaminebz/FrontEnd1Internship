import axios from 'axios';
import {API_URL, TOKEN_KEY} from "./config";

// Set up default config for axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem(TOKEN_KEY)}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add a request interceptor to refresh the token if expired
axios.interceptors.request.use(
    (config) => {
        // Add the Authorization header if token exists
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
