// src/store/authStore.js
import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  register: async (userData) => {
    set({ isLoading: true, error: null });
    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/register`,
        userData,
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        isAuthenticated: true,
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

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        credentials,
        { withCredentials: true }
      );
      set({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        isAuthenticated: true,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    const baseUrl = import.meta.env.PROD
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL;

    try {
      await axios.post(`${baseUrl}/api/auth/logout`, {}, { withCredentials: true });
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Logout failed",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
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
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: error.response?.data?.message || "Authentication check failed",
      });
    }
  },

  setError: (error) => set({ error }), 
  clearError: () => set({ error: null }),
}));