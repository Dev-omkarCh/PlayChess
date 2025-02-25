import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
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
        // changes
        enum: ["friend-request","accepted-friend-request","declined-friend-request","game-request", "game-result"],
        // end
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: { 
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Notifications = mongoose.model("Notification", notificationSchema);

export default Notifications;