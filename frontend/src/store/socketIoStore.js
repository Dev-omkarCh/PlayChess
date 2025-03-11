import { create } from 'zustand';

export const useMainSocket = create((set) =>({
    socket : null,
    setSocket: (socket) => { set({ socket: socket });  },
}));
