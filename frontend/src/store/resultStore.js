import { create } from "zustand";

export const useResultStore = create((set) => ({
    you : null,
    setYou : (you) => set({ you : you }),

    matchMaked : false,
    setMatchMaked : (matchMaked) => set({ matchMaked }),

    opponent : null,
    setOpponent : (opponent) => set({ opponent : opponent }),

    opponentId : "680472184cd6cc2efbf63c10",
    setOpponentId : (opponentId) => set({ opponentId }),

    result : null,
    type : null,
    setGameResult: (result, type) => set({ result : result, type : type}),
}));
