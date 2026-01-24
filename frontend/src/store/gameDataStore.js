import { create } from "zustand";

export const useGameDataStore = create((set) => ({
  gameData: [],
  setGameData: (gameData) => set({ gameData }),
}));