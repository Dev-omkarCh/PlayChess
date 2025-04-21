import { create } from 'zustand';
import { toast } from 'react-hot-toast';

const useSettingStore = create((set) =>({
    settingsModal : false,
    openSettingsModal : (val) => set({ settingsModal : val}),

    sound : true,
    setSound : (sound) => set({ sound }),

    boardColor : {
        
    },
    setBoardColor : (boardColor) => set({ boardColor }),

    pieceType : "classic",
    setPieceType : (pieceType) => set({ pieceType }),

    getSettings : async() =>{
        const response = await fetch("/api/users/settings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (response.ok) {
            console.log("settings from backend: ", data);
            set({ sound: data.sound, boardColor: data.boardColor, pieceType: data.pieceType });
        } else {
            console.error(data.message);
        }
    },

    setSettings : async(sound, pieceType, boardColor) =>{
        const response = await fetch("/api/users/settings/change", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sound, pieceType, boardColor }),
        });
        const data = await response.json();
        if (response.ok) {
            console.log("settings from backend: ", data);
            toast.success(data.message)
        } else {
            console.error(data.message);
        }
    }


}));

export default useSettingStore;