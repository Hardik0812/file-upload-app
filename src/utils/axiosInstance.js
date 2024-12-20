import axios from "axios";

export const API_BASE_URL =
  "https://file-upload-api-112857677948.us-central1.run.app";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request Interceptor to add token
axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const endPoints = {
  login: "/login",
  forgotPassword: "/send_reset_link",
  createNewPassword: "/reset_password",
};
