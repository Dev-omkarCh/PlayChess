import { create } from 'zustand';

const useAuth = create((set, get) =>({
    authUser : localStorage.getItem("Chess-User") ? JSON.parse(localStorage.getItem("Chess-User")) : null,
    setAuthUser: (user) => {
        set({ authUser: user });
    },
}));

export default useAuth;

// const { authUser } = useAuth();
//   const userId = authUser._id;