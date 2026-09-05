import axios from "axios";
import { USER_API_END_POINT } from "./Constant";

const axiosInstance = axios.create({
  withCredentials: true
});

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const code = error.response?.data?.code;

    // don't try to refresh for the refresh/login endpoints themselves
    const isAuthRoute =
      originalRequest?.url?.includes("/login") ||
      originalRequest?.url?.includes("/refresh-token");

    if (status === 401 && code === "TOKEN_EXPIRED" && !originalRequest._retry && !isAuthRoute) {
      if (isRefreshing) {
        // a refresh is already in flight - wait for it, then retry
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post(`${USER_API_END_POINT}/refresh-token`);
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // refresh token is invalid/expired too - force re-login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;