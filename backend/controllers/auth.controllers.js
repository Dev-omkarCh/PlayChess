import bcryptJs from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/lib/generateToken.js";

export const getUser = async( req, res) =>{
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user) return res.status(404).json({error: "User not found"});
        res.status(200).json(user);
    }
    catch(e){
        console.log("Error in getUser Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signup = async( req, res) =>{
    try{
        const { username, email, password, gender} = req.body;

        // Check if email is valid
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)) return res.status(400).json({error: "Invalid email"});

        if(gender === "") return res.status(400).json({error: "Please Enter the gender"});
        if(gender !== "male" && gender !== "female" && gender !== "other") {
            return res.status(400).json({error: "Please Enter a Valid Gender"});
        }

        // Check if username exists
        const existUser = await User.findOne({ username });
        if(existUser) return res.status(400).json({error: "This username already exists."});

        // Check if email exists
        const existEmail = await User.findOne({ email });
        if(existEmail) return res.status(400).json({error: "This email already exists."});

        if(password.length < 6) return res.status(400).json({error: "Password must be at least 6 characters."});

        // Hash password
        const salt = await bcryptJs.genSalt(10);
        const passwordHash = await bcryptJs.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // Create new user
        const newUser = new User({
            username, email, password: passwordHash, gender, profileImg : gender.toLowerCase() === "male" ? boyProfilePic : girlProfilePic
        });

        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id, 
                username: newUser.username,
                email: newUser.email,
                profileImg: newUser.profileImg,
                friends: newUser.friends,
                gender : newUser.gender,
            });
        }
        else{
            return res.status(400).json({msg: "Invalid credentials"});
        }
        
    }
    catch(e){
        console.log("Error in Signup Controller", e.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async( req, res) =>{
    try{
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        const isCorrectPasswd = await bcryptJs.compare(password, user?.password || "");

        if(!user || !isCorrectPasswd) return res.status(400).json({error: "username or password is incorrect"});

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            coverImage: user.coverImage,
            friends: user.friends,
        });
    }
    catch(e){
        console.log("Error in Login Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const logout = ( req, res) =>{
    try{
        res.cookie("jwtToken", "", {maxAge: 0});
        res.status(200).json({msg: "Logged out successfully"});
    }
    catch(e){
        console.log("Error in Logout Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
