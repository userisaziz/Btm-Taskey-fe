import axios from "axios";

// Create an Axios instance with a base URL
const baseUrl = import.meta.env.VITE_BASE_URL;
const axiosInstance = axios.create({
  baseURL: baseUrl, // Replace with your actual base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add common headers here, like authorization tokens
    // config.headers['Authorization'] = `Bearer ${token}`;
    console.log("Request:", config);
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful response
    console.log("Response:", response);
    return response;
  },
  (error) => {
    // Handle response error
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
