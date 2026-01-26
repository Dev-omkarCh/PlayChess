import { create } from "zustand";

export const notificationStore = create((set) => ({

  notifications: [],
  setNotification: (notification) => set((state)=>{
    return { notifications: [...state.notifications, notification] }
  }),

  setNotifications: (notifications) => set(() => {
    return { notifications }
  }),

}));