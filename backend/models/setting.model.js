import mongoose from "mongoose";
const settingSchema = new mongoose.Schema({

    sound: {
        type: Boolean,
        default: true
    },

    boardColor : {
        name : {
            type: String,
            default: "wooden",
        },
        whiteTile : {
            type: String,
            default: "#edd6b0"
        },
        blackTile : {
            type: String,
            default: "#b88762"
        }
    },

    pieceType : { 
        type: String,
        default: "classic",
        emun: ["classic","wooden"]
       
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

});

const Settings = mongoose.model("Settings", settingSchema);

export default Settings;