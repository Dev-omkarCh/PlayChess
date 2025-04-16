import mongoose from "mongoose";
const settingSchema = new mongoose.Schema({

    sound: {
        type: String,
        default: "on",
        enum : ["on","off"]
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
        name : {
            type: String,
            default: "classic",
            emun: ["classic","wooden"]
        },
    },

});

const Settings = mongoose.model("Settings", settingSchema);

export default Settings;