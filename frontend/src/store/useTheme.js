import { create } from 'zustand'

const useTheme = create((set) =>({
    darkTheme : true,
    setDarkTheme : (darkTheme) => set({ darkTheme }),
}));

export default useTheme;