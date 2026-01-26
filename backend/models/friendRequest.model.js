import mongoose from "mongoose";
const friendRequestSchema = new mongoose.Schema({
    from: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    to: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: { 
        type: String,
        enum: ["send", "accept", "decline"],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);

export default FriendRequest;