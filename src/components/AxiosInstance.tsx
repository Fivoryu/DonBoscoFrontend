import axios from "axios";
import Cookies from "js-cookie";

const isDevelopment: boolean = import.meta.env.MODE === "development";
export const myBaseUrl = isDevelopment
  ? import.meta.env.VITE_API_BASE_URL_LOCAL
  : import.meta.env.VITE_API_BASE_URL_DEPLOY;

const AxiosInstance = axios.create({
  baseURL: myBaseUrl,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  withCredentials: true,
});

AxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
    config.headers["Authorization"] = `Token ${token}`;
    }
  const csrfToken = Cookies.get("csrftoken");
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  console.log("Token:", token);
  console.log("Token CSRF:", csrfToken);

  return config;
});


AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("No autorizado. Redirigiendo al login...");
      // Lógica para redirigir al login aquí si quieres
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
