import axios from 'axios';
const API_URL = 'http://localhost:3000';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// REQUEST
axiosClient.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// RESPONSE

axiosClient.interceptors.response.use(
  async (response) => {
    const access_token = response.data.data?.access_token;
    const refreshToken = response.data.data?.refreshToken;
        // LOGIN
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalConfig = error.config;

    if (error?.response?.status === 401 && !originalConfig.sent) {
      console.log('Error 🚀', error);
      originalConfig.sent = true;
      try {
        // Trường hợp không có token thì chuyển sang trang LOGIN
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
          console.log('Token not found', window.location.pathname);
          //Nếu trang hiện tại đang đứng không phải là login thì chuyển hướng login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axiosClient.post('/refresh-token-client', {
            refreshToken: refreshToken,
          });

          const { access_token } = response.data;
          window.localStorage.setItem('access_token', access_token);

          originalConfig.headers = {
            ...originalConfig.headers,
            authorization: `Bearer ${access_token}`,
          };

          return axiosClient(originalConfig);
        } else {
          return Promise.reject(error);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
  },
);

export { axiosClient };
