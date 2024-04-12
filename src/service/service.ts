import axios from 'axios';
import config from '../configs/configs';

const api = axios.create({
    baseURL: config.baseUrl,
    withCredentials: true,
});


api.interceptors.request.use(
    (config) => {
        console.log('Sending request to:', config.url);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        console.log('Response received from:', response.config.url);
        return response;
    },
    (error) => {
        console.error('Response error from:', error.config.url, 'with status:', error.response?.status);

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.error('Unauthorized, please check credentials or session.');
                    break;
                case 403:
                    console.error('Forbidden, insufficient permissions.');
                    break;
                case 404:
                    console.error('Not Found, check endpoint or network.');
                    break;
                case 500:
                    console.error('Server error, try again later.');
                    break;
                default:
                    console.error('Unhandled error:', error.response.status);
                    break;
            }
        } else if (error.request) {
            console.error('No response received, check network.');
        } else {
            console.error('Error setting up request:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
