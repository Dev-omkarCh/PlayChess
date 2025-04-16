import { create } from 'zustand';

const useSettingStore = create((set) =>({
    settingsModal : false,
    openSettingsModal : (settings) => set({ settingsModal: settings }),

    sound : true,
    setSound : (sound) => set({ sound }),

    boardColor : {
        name: "wooden",
        white: "bg-[#edd6b0]",
        black: "bg-[#b88762]",
    },
    setBoardColor : (boardColor) => set({ boardColor }),

    pieceType : "classic",
    setPieceType : (pieceType) => set({ pieceType }),

}));

export default useSettingStore;