import { create } from 'zustand';

const useAuth = create((set) =>({
    authUser : localStorage.getItem("Chess-User") ? JSON.parse(localStorage.getItem("Chess-User")) : null,
    setAuthUser : (authUser) => set({ authUser }),
}));

export default useAuth;