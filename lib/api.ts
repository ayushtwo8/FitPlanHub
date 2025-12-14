import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ROUTES = [
  "/", // Public plans listing
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/me"
];

const isPublicRoute = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ROUTES.some((route) => url.includes(route));
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicRoute(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        if (
          typeof window !== "undefined" &&
          (window.location.pathname.includes("/dashboard") ||
            window.location.pathname.includes("/profile") ||
            window.location.pathname.includes("/settings"))
        ) {
          window.location.href = "/";

          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  }
);

export default api;
