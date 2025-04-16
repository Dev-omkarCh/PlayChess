import { create } from "zustand";
import axios from "axios";

const useDashboardStore = create((set) => ({
  users: [],
  games: [],
  statistics: {},
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const [usersRes, gamesRes, statsRes] = await Promise.all([
        axios.get("/api/admin/users"),
        axios.get("/api/admin/games"),
        axios.get("/api/admin/statistics"),
      ]);

      set({
        users: usersRes.data,
        games: gamesRes.data,
        statistics: statsRes.data,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      set({ loading: false });
    }
  },
}));

export default useDashboardStore;
