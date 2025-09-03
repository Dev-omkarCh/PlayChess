import mongoose from "mongoose";

const gameModeSchema = new mongoose.Schema({
    white : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    black : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    board : {
        type: Array,
        default: [],
    },
    turn: {
        type: String,
        default: "white", 
    },
    notations:{
        you: [],
        opponent: [],
    },
    playerColor: {
        type: String,
        default: ""
    },
    roomId: {
        type: String,
        required: true,
    }
});

const GameModel = mongoose.model("GameMode", gameModeSchema);
export default GameModel;
