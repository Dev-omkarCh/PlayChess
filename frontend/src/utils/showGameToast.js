import toast from "react-hot-toast";

export default function showGameToast(){
    if(localStorage.getItem("gameExists")){
        toast.error("Game Exists, Please Enter the game or resign");
    }
}