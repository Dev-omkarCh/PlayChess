import Notifications from "../models/notification.model.js";
import User from "../models/user.model.js";

export const addFriend = async(req, res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        
        // Check if the user exists
        const reqExists = await Notifications.findOne({ from: req.user._id, to: id , type: "friend-request", isRead: false });
        if(reqExists) return res.json({ msg: "You have already send a request, and not yet Accepted" });

        if (!user.friends.includes(id)) {
            const notification = await Notifications.create({
                to : id,
                from : req.user._id,
                type : "friend-request",
                message : `${user.username} sent you a friend request`,
            });

            res.json({ msg: "Request send Successfully", notification });
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