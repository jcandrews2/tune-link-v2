import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import useStore from "../store";

// User API axios instance
export const userAxios = axios.create({
  withCredentials: true,
});

// Spotify API axios instance
export const spotifyAxios = axios.create();

spotifyAxios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { user } = useStore.getState();
  if (user.spotifyAccessToken) {
    config.headers.Authorization = `Bearer ${user.spotifyAccessToken}`;
  }
  return config;
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
