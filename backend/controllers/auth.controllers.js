import bcryptJs from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/lib/generateToken.js";
import Settings from "../models/setting.model.js";

export const getUser = async( req, res) =>{
    try{
        console.log("Ypooo")
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
        console.log(req.body);

        // Check if email is valid
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        console.log(email);
        if(!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email" });

        if(gender === "") return res.status(400).json({ message: "Please Enter the gender" });

        if(gender !== "male" && gender !== "female" && gender !== "other") {
            return res.status(400).json({ message: "Please Enter a Valid Gender" });
        }

        // Check if username exists
        const existUser = await User.findOne({ username });
        if(existUser) return res.status(400).json({ message : "This username already exists."});

        // Check if email exists
        const existEmail = await User.findOne({ email });
        if(existEmail) return res.status(400).json({ message: "This email already exists." });

        if(password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters." });

        // Hash password
        const salt = await bcryptJs.genSalt(10);
        const passwordHash = await bcryptJs.hash(password, salt);
        const boyProfilePic = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}&hair=short01&beardProbability=100`;
        const girlProfilePic = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}&hair=long01&beardProbability=0`;

        // Create new user
        const newUser = new User({
            username, email, password: passwordHash, gender, profileImg : gender.toLowerCase() === "male" ? boyProfilePic : girlProfilePic
        });

        const createSettings = new Settings({
            userId: newUser._id,
        });
        await createSettings.save();

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
                elo : newUser.elo,
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

        if(!user || !isCorrectPasswd) return res.status(400).json({ message: "username or password is incorrect" });

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImg: user.profileImg,
            coverImage: user.coverImage,
            friends: user.friends,
            elo : user.elo,
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
