import { create } from "zustand";

export const useGameStore = create((set) => ({

  game: [],
  setGame: (game) => set({ game }),
  
}));