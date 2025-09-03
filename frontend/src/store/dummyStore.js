import { create } from "zustand";

export const useDummyStore = create((set) => ({

  room: [],
  setRoom: (roomId) => set({ room: roomId }),

}));