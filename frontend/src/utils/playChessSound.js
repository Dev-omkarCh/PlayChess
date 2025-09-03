import move from "../sounds/move.mp3";
import capture from "../sounds/capture.mp3";
import check from "../sounds/check.mp3";
import checkmate from "../sounds/checkmate.mp3"; 
import castle from "../sounds/castle.mp3"       
import useSettingStore from "../store/settingStore";
import illegal from "../sounds/illegal.mp3";

export const playChessSound = (type) => {

    // if(!useSettingStore.getState().sound){
    //     return;
    // }

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
    if(type === "castle"){
        const audio = new Audio(castle);
        audio.play();
    }
    if(type === "illegal"){
        const audio = new Audio(illegal);
        audio.play();
    }
}
