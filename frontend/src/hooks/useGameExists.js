import { useToast } from "@/components/ToastProvider";
import { useResultStore } from "@/store/resultStore";
import { useMainSocket } from "@/store/socketIoStore";
import useSocketStore from "./useRoom";
import useChessStore from "@/store/chessStore";
import clearChessData from "@/utils/clearChessData";
import { useNavigate } from "react-router-dom";

const useGameExists = () => {

    const { showToast } = useToast();
    const { socket } = useMainSocket();
    const setGameResult = useResultStore.getState().setGameResult;
    const room = useSocketStore.getState().room;
    const { openGameOverModal, resetBoard } = useChessStore();
    const navigate = useNavigate();

    const onAccept = () =>{
        navigate("/test");
    };

    const onReject = () =>{

        openGameOverModal(true);
        setGameResult("lose", "resign");
        socket?.emit("resign", room);
        resetBoard();
        clearChessData();
        
    };
    
    const trigger = () => {
        showToast({
          text: "There is a game Ongoing!, what do you want to do with it?",
          onAccept,
          onReject,
        });
    };

    const checkIfGameExists = () =>{
        if(localStorage.getItem("gameExists")){
            const count = Number(JSON.parse(localStorage.getItem("reload"))?.count);
            if(typeof(count) === Number){
                if(JSON.parse(localStorage.getItem("reload")).count <= 1){
                    count+=1;
                    localStorage.setItem("reload", { count });
                };
            }
            trigger();  
        };
    };

    return { checkIfGameExists }

};

export default useGameExists;
