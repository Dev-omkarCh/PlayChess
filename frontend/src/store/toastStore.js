import { create } from "zustand";

const useToastStore = create((set) => ({
    type: "FRIEND",
    toast: { 
        show: false, 
        data: null 
    },

    setType: (type) => set({ type }),

    showToast: (data) => set({ 
        toast: { show: true, data },
    }),
    
    hideToast: () => set({ 
        toast: { show: false, data: null } 
    }),

}));

export default useToastStore;