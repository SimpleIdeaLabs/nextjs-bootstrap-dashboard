import axios from 'axios';
import Cookies from 'js-cookie';

export const authenticatedRequest = axios.create({
  baseURL: `${process.env.API_URL}`,
});

authenticatedRequest.interceptors.request.use(
  config => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  }
);

