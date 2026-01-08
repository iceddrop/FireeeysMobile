import axios from "axios";

const backendInstance = axios.create({
  baseURL: "https://copper-imprint-479922-p4.uc.r.appspot.com",
  headers: {
    "Content-Type": "application/json",
  },
});

backendInstance.interceptors.request.use(
   (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }    
        return config;
   },
   (error) => Promise.reject(error) 
)

backendInstance.interceptors.response.use(
  (response) => {
    if (response?.data?.message === "Unauthenticated.") {
      localStorage.removeItem("token");
      window.location.href = "/"; 
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const responseData = error.response.data;

    if (responseData?.message === "Unauthenticated.") {
      localStorage.removeItem("token");
      window.location.href = "/"; 
    }

    return Promise.reject(error);
  }
);

export default backendInstance;