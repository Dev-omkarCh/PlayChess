import axios from "axios";
import { create } from "zustand";

const useAuthStore = create((set) => ({
    authUser: null,
    setAuthUser: (authUser) => {
        set(() => ({ authUser }));
    },

    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => {
        set(() => ({ isAuthenticated }));
    },

    loading: true,
    setLoading: (loading) => {
        set(() => ({ loading }));
    },

    logout: () => {
        set(() => ({ authUser: null, isAuthenticated: false }));
    },

    checkAuth: async () => {
        set({ loading: true });

        try {
            const response = await axios.get("/api/auth/me");
            const data = response.data;

            set({
                authUser: data,
                isAuthenticated: true,
                loading: false
            });

        } catch (error) {

            if (error.status !== 401) {
                console.error("Auth check failed", error);
            }

            // Clear auth state on error
            set({
                authUser: null,
                isAuthenticated: false,
                loading: false
            });
        }
    },

}));

export default useAuthStore;