import move from "../sounds/move.mp3";
import capture from "../sounds/capture.mp3";
import check from "../sounds/check.mp3";
import checkmate from "../sounds/checkmate.mp3";        
import useSettingStore from "../store/settingStore";

export const playChessSound = (type) => {

    if(!useSettingStore.getState().sound){
        return;
    }

    if(type === "move"){
        const audio = new Audio(move);
        audio.play();
    }
    if(type === "capture"){
        const audio = new Audio(capture);
        audio.play();
    }
    if(type === "check"){
        const audio = new Audio(check);
        audio.play();
    }
    if(type === "checkmate"){
        const audio = new Audio(checkmate);
        audio.play();
    }
}
