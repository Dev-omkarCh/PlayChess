import { create } from 'zustand';

const useTurn = create((set) =>({
    turn : "white",
    setTurn: (turn) => {
        set({ turn });
    },
}));

export default useTurn;