import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const backendInstance = axios.create({
  baseURL: "https://fireeyes-detector-ib01.onrender.com",
  headers: { "Content-Type": "application/json" },
});

let onUnauthenticated: (() => void) | null = null;
export const setOnUnauthenticated = (fn: () => void) => {
  onUnauthenticated = fn;
};

backendInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    const url = config.url || "";
    const isAuthRoute = /\/login$|\/register$|\/auth|\/forgotPassword/.test(url);
    if (token && !isAuthRoute) {
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

backendInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const data = error?.response?.data;
    if (data?.message === "Unauthenticated.") {
      await AsyncStorage.removeItem("token").catch(() => {});
      if (onUnauthenticated) onUnauthenticated();
    }
    return Promise.reject(error);
  }
);

export default backendInstance;
