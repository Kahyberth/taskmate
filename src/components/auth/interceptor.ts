import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`, 
  withCredentials: true, 
});


axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
  
        await axiosClient.post('/auth/refresh-token', {}, { withCredentials: true });

        return axiosClient(originalRequest);
      } catch (refreshError) {

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
