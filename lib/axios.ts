import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BaseURL } from "@/config";

const axiosInstance = axios.create({
  baseURL: BaseURL,
  timeout: 120000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login page or refresh token
      window.location.href = "/signin";
    }
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;

export const fetcher = async <T>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];
    const res = await axiosInstance.get<{ data: T }>(url, { ...config });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};