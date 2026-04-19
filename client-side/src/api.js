import axios from "axios";

// Axios instance for Bookstore API (uses VITE_BOOKSTORE_API from .env)
const api = axios.create({
    baseURL: import.meta.env.VITE_BOOKSTORE_API,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;