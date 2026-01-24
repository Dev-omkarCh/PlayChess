import useAuthStore from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { useResultStore } from "@/store/resultStore";
import axios from "axios";
import toast from "react-hot-toast";

const useGame = () => {
    const { setGame } = useGameStore();
    const { authUser } = useAuthStore();
    const { opponent } = useResultStore();

    const createNewGame = async () => {
        try {
            const authUserID = authUser?._id;
            const opponentId = opponent?._id;

            if(!authUserID){
                throw new Error("Authentication user ID not found");
            }
            if(!opponentId){
                throw new Error("Opponent user ID not found");
            }

            const response = await axios.post('/api/game/new', {
                playerWhite: authUserID,
                playerBlack: opponentId
            });

            const { game, message } = response.data;
            setGame(game);
            toast.success(message || "Game created successfully");
            console.log(game);
            return;
        } catch (error) {
            console.error("Error creating new game:", error);
            toast.error(error?.response?.data?.message || error?.message || "Failed to create game");
        }
    }

    return { createNewGame };
};

export default useGame;