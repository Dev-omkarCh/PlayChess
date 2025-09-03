import mongoose from "mongoose";

const gameMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      content : String,
      type : {
        type: String,
        enum: ["text", "image"],
        default: "text"
      }
    },
  },{ timestamps: true }
);
const GameMessage = mongoose.model("GameMessage", gameMessageSchema);

export default GameMessage;
