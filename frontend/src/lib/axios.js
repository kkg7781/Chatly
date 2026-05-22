import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chatly-fm17.onrender.com",
  withCredentials: true,
});

// Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;