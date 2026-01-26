import mongoose, { Mongoose } from "mongoose";


//   'pending'   Waiting for B
//   'accepted'  Both in Lobby
//   'declined'  B said no (Visible in A's inbox)
//   'expired'   B took too long (Visible in A's inbox)
//   'cancelled' A changed their mind or disconnected
//   'started'   Transitioned to a real Game

const challengeSchema = new mongoose.Schema(
  {
    hostId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    guestId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    },
    host: {
      type : Object,
      default : null
    },
    guest: {
      type : Object,
      default : null
    },
    status : {
      type : String,
      enum : ["pending", "accepted", "declined", "started", "cancelled", "expired"],
      default : "pending"
    },
    isGuestReady : {
      type : Boolean,
      default : false
    },
    config : {
        timeControl : {
            type : String,
            enum : ["blitz", "rapid", "classical", "custom"],
        },
        increment : {
            type : Number,
            default : 0
        },
        hostColor : {
            type : String,
            enum : ["white", "black", "random"],
            default : "random"
        },
        mode: {
            type : String,
            enum : ["casual", "rated"],
            default : "casual"
        }
    },
    expiry : {
      type : Date,
      default : () => Date.now() + 15*60*1000 // 15 minutes from creation
    },
    isRead : {
      type : Boolean,
      default : false
    }
  },
  { timestamps: true }
);
const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;