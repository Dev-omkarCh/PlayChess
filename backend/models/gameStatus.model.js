import mongoose, { Mongoose } from "mongoose";

const gameStatusSchema = new mongoose.Schema(
  {
    white: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    black: {
      type: mongoose.Schema.Types.ObjectId,
      ref : "User",
      required: true,
    },
    board : {
        type: Array,
        default: [],
    },
    turn : {
        type: String,
        default: "",
    },
    notations : {
      you : [],
      opponent : []
    },
    playerColor: {
      type: String,
      default: ""
    },
    roomId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const GameStatus = mongoose.model("GameStatus", gameStatusSchema);

export default GameStatus;
