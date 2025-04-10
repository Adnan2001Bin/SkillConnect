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

  clearError: () => set({ error: null }),
}));
