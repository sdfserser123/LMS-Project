import axios from "axios";
import { useAuthStore } from "../stores/userAuthStore";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

//tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config;

    //Những api không cần check
    //Những api không cần check
    // Prevent infinite loop: Don't refresh if the failed request was ALREADY a login or refresh attempt
    if (originalRequest.url.includes("auth/login") || originalRequest.url.includes("auth/refresh")) {
        return Promise.reject(error);
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403) {
        window.location.href = "/unauthorized";
        return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest._retryCount < 4) {
        originalRequest._retryCount += 1;
        try {
            const res = await api.post("/auth/refresh");
            const newAccessToken = res.data.accessToken;

            useAuthStore.getState().setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return api(originalRequest);
        } catch (refreshError) {
            useAuthStore.getState().clearState();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export const getFileUrl = (url) => {
    if (!url) return "";
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
    
    // If it's already a full URL that points to localhost:5001, replace it with the configured backend URL
    if (url.startsWith("http://localhost:5001")) {
        return url.replace("http://localhost:5001", backendUrl);
    }
    
    // If it's a relative path, prepend the backend URL
    if (url.startsWith("/")) {
        return `${backendUrl}${url}`;
    }
    
    return url;
};