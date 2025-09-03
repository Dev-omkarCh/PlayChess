import mongoose, { Mongoose } from "mongoose";

const gameHistorySchema = new mongoose.Schema(
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
    won : {
      type : Array,
      required : true
    },
    board : {
      type: Array,
      default: [],
    },
    turn : {
      type: String,
      default: "white",
    },
    moves : {
      white : [],
      black : []
    },
    roomId: {
      type: String,
      required: true,
    },
    notations : {
      white: [],
      balck: [],
    },
    maxTime: {
      type: Number,
      default: 0,
    },
    rating : {
      white : {
        before : Number,
        after : Number
      },
      black : {
        before : Number,
        after : Number
      }
    },
    username: {
      white : {
        type: String,
        required: true,
      },
      black : {
        type: String,
        required: true,
      }
    },
    type:{
      type: String,
      enum : ["checkmate","resign","draw","timeout"],
      required : true
    },
    
  },
  { timestamps: true }
);
const GameHistory = mongoose.model("Games", gameHistorySchema);

export default GameHistory;
