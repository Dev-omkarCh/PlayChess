import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profileImg:{
        type : String,
        default : ""
    },
    gender:{
        type : String,
        default : ""
    },
    elo:{
        type : Number,
        default : 400
    },
    friends:[
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User",
            default : []
        }
    ]

},{timestamps : true});

const User = mongoose.model("User", userSchema);

export default User;
