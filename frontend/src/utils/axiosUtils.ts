import axios, { AxiosInstance } from "axios";

// User API axios instance
export const userAxios = axios.create({
  withCredentials: true,
});

// Spotify API axios instance
export const spotifyAxios = axios.create({
  withCredentials: false,
});

// Add response interceptor for error handling
const addErrorInterceptor = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

// Add interceptors to both instances
addErrorInterceptor(userAxios);
addErrorInterceptor(spotifyAxios);
