import { profile } from "console";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";

export const removeFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?._id;

        console.log(id);

        if (!userId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!id || id === 'undefined') return res.status(400).json({ message: "No friend ID provided" });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: id } }, // Removes the specific ID from array
            { new: true }
        );

        await User.findByIdAndUpdate(
            id,
            { $pull: { friends: userId } }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            message: "Friend removed successfully",
        });

    } catch (error) {
        console.error("Error in removeFriend Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    };
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { id : receiverId } = req.params;
        const senderId = req?.user?._id;

        if (!senderId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!receiverId || receiverId === 'undefined') return res.status(400).json({ message: "No receiver ID provided" });

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender) {
            return res.status(404).json({ message: "Sender not found" });
        }

        if (!receiver) {
            return res.status(404).json({ message: "Receiver not found" });
        }

        // Check if they are already friends
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ message: `You are already friends with this ${receiver.username}` });
        }

        // Check if a friend request has already been sent
        const existingFriendRequest = await FriendRequest.findOne({
            from: senderId,
            to: receiverId,
            type: "send"
        });

        if (existingFriendRequest) {
            return res.status(400).json({ message: "Friend request already sent." });
        }

        const friendRequest = new FriendRequest({
            from: senderId,
            to: receiverId,
            type: "send"
        });

        await friendRequest.save();

        const notification = {
            ...friendRequest.toObject(),
            from: {
                _id: sender._id,
                username: sender.username,
                profileImg: sender.profileImg,        
            },
            receiver: {
                id: receiver._id,
                username: receiver.username,
                profileImg: receiver.profileImg,
            }
        };
        return res.status(200).json({ message: "Friend request sent successfully.", notification });

    } catch (error) {
        console.error("Error in sendFriendRequest Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { id: requesterId } = req.params;
        const userId = req?.user?._id;

        if (!userId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!requesterId || requesterId === 'undefined') return res.status(400).json({ message: "No requester ID provided" });

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const existingFriendRequest = await FriendRequest.findOne({
            from: requesterId,
            to: userId,
            type: "send"
        })

        if (!existingFriendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        await FriendRequest.findByIdAndDelete(existingFriendRequest._id);
        const newNotification = await FriendRequest.create({
            from: userId,
            to: requesterId,
            type: "decline"
        });

        const notification = {
            ...newNotification.toObject(),
            from: {
                _id: user._id,
                username: user.username,
                profileImg: user.profileImg,
            },
            receiver: {
                id: requesterId,
            }
        }

        return res.status(200).json({ message: "Friend request declined successfully.", notification });

    } catch (error) {
        console.error("Error in declineFriendRequest Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};