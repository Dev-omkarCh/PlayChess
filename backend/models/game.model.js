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
    moves : {
      white : [],
      black : []
    },
    roomId: {
      type: String,
      required: true,
    },
    //   white: {
    //     type: Array,
    //     default: [],
    //   },
    //   black: {
    //     type: Array,
    //     default: [],
    //   },
    // },

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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
const GameHistory = mongoose.model("Games", gameHistorySchema);

export default GameHistory;
