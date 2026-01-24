import { create } from "zustand";

export const useGameStore = create((set) => ({

  game: {
    white: null,
    black: null,
    isHost: false,
    gameId: null,
  },
  setGame: (game) => set({ game }),
  
}));