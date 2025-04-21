import { create } from "zustand";

export const useResponsiveStore = create((set) => ({
  width : window.innerWidth,
  setWidth : (width) => set({ width }),
  WIDTH : 700
}));
