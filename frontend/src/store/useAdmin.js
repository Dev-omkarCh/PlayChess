import { create } from 'zustand';

const useAdmin = create((set, get) =>({
    isAdmin : false,
    setIsAdmin: (val) => {
        set({ isAdmin: val });
    },
}));

export default useAdmin;