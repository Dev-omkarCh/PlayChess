import  Notifications from "../models/notification.model.js";
import User from "../models/user.model.js";

export const searchByUserName = async(req, res) =>{
    try {
        const { query } = req.query;
        const id = req.user._id;

        if (!query) {
            return res.json({ msg: "Please Type something before search" });
        }

        const users = await User.find(
            { username: { $regex: new RegExp(query, "i") } },
        )
        .limit(10)
        .select("-password");

        const usersExcludingMe = users.filter((user)=>{
            return user.id != id;
        })

        res.json(usersExcludingMe);
    } 
    catch (e) {
        console.log("Error in searchByUsername Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const addFriend = async(req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        // Check if the user exists
        const userExists = await User.findById(id);

        if (!user.friends.includes(id)) {

            console.log(" friends Id ",id)
            user.friends.push(id);
            await user.save();
            Notifications.create({
                to : id,
                from : req.user._id,
                type : "friend-request",
                message : `${user.username} sent you a friend request`,
            });

            res.json({ msg: "Request send Successfully" });
        } else {
            res.json({ msg: "Already had send the friend request" });
        }
    } 
    catch (e) {
        if(e.message.includes("Cast to ObjectId failed for value")){
            return res.status(400).json({ error: "Invalid User ID" });
        }
        console.log("Error in addFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}

export const declineFreind = async(req, res) =>{
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const user = req.user;
        const otherUser = await User.findById(id);

        // Check if the friend request is valid
        const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "friend-request", isRead : false });
        if (!validRequest) {
            return res.status(400).json({ error: "Invalid Request" });
        }

        // Mark the request as read
        validRequest.isRead = true;
        await validRequest.save();

        if (otherUser.friends.includes(userId)) {
            otherUser.friends = otherUser.friends.filter((friendId) => {
                return friendId.toString() !== userId.toString();
            });
            await otherUser.save();
            Notifications.create({
                to : id,
                from : userId,
                type : "declined-friend-request",
                message : `${user.username} declined your friend request`,
            });
            res.json({ msg: "Friend Request Declined" });
        } else {
            res.json({ msg: "Already Removed" });
        }
    } 
    catch (e) {
        console.log("Error in removeFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const acceptFriend = async(req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "friend-request", isRead : false });

        if (!validRequest) {
            return res.status(400).json({ error: "Invalid Request" });
        }

        // Mark the request as read
        validRequest.isRead = true;
        await validRequest.save();
        
        if (!user.friends.includes(id)) {
            user.friends.push(id);
            await user.save();
            Notifications.create({
                to : id,
                from : req.user._id,
                type : "accepted-friend-request",
                message : `${user.username} accepted your friend request`,
            });
            res.json({ msg: "Friend Request Accepted" });
        } else {
            res.json({ msg: "You are ALready friends" });
        }
    } 
    catch (e) {
        console.log("Error in acceptFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const removeFriend = async(req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if (user.friends.includes(id)) {
            user.friends = user.friends.filter((friendId) => friendId != id);
            await user.save();
            res.json({ msg: "Friend Removed" });
        } else {
            res.json({ msg: "Already Removed" });
        }
    } 
    catch (e) {
        console.log("Error in removeFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

// changes tested

export const getFriendRequests = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id);
        const friendRequests = await Notifications.find({ to : req.user._id, isRead : false }).populate("from", "username profileImg");
        res.json(friendRequests);
    } 
    catch (e) {
        console.log("Error in getFriendRequests Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const getFriends = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id).populate("friends", "username profileImg");
        res.json(user.friends);
    } 
    catch (e) {
        console.log("Error in getFriends Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

// TODO : shift the function to notification controller if not lazy
// TODO : On frontend button, only allow once to send this api request
export const markNotificationAsRead = async(req, res) =>{
    try {
        const { id } = req.params;
        const notification = await Notifications.findById(id);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        notification.isRead = true;
        await notification.save();
        res.json({ msg: "Notification marked as read" });
    } 
    catch (e) {
        console.log("Error in markNotificationAsRead Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

// end
