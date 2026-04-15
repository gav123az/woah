import axios from "axios";

// Create an instance of axios that we can use throughout our application
/*
 * Axios instance for Bookstore API
 * Uses VITE_BOOKSTORE_API from .env for base URL
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_BOOKSTORE_API,
});

/*
 * Attach Authorization header for every request if token is present.
 * Token should be kept in Pinia global store and/or localStorage for persistence, per app setup.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Export the instance of axios so that we can use it in our components
export default api;
