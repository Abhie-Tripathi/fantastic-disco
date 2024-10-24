import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

const externalAxios: AxiosInstance = axios.create();

externalAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => Promise.reject(error)
);

export default externalAxios;