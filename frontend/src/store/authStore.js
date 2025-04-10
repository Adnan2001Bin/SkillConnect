import axios from "axios";
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null });

    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/register`,
        userData,
        {
          withCredentials: true,
        }
      );

      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (userData) => {
    set({ isLoading: true, error: null });

    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(`${baseUrl}/api/auth/login`, userData, {
        withCredentials: true,
      });

      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.get(`${baseUrl}/api/auth/is-auth`, {
        withCredentials: true,
      });
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isLoading: false,
        error: error.response?.data?.message || "Not authenticated",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
