import { profile } from "console";
import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const removeFriend = async (req, res) => {
    try {
        const { id: friendId } = req.params;
        const userId = req?.user?._id;

        // 1. VALIDATE FIRST
        if (!userId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!friendId || friendId === 'undefined') {
            return res.status(400).json({ message: "No friend ID provided" });
        }

        // 2. PARSE SAFELY (Notice we use userId for parsedUserId)
        const parsedUserId = new mongoose.Types.ObjectId(userId);
        const parsedFriendId = new mongoose.Types.ObjectId(friendId);

        // 3. EXECUTE UPDATES (Using Promise.all for speed)
        const [updatedUser, updatedFriend] = await Promise.all([
            User.findByIdAndUpdate(
                parsedUserId,
                { $pull: { friends: parsedFriendId } },
                { new: true }
            ),
            User.findByIdAndUpdate(
                parsedFriendId,
                { $pull: { friends: parsedUserId } }
            )
        ]);

        // 4. CHECK RESULTS
        if (!updatedUser || !updatedFriend) {
            return res.status(404).json({ message: "One or both users not found" });
        }

        const notification = await FriendRequest.create({
            from: userId,
            to: friendId,
            type: "remove",
        });

        return res.status(200).json({
            message: "Friend removed successfully",
            updatedUser, // Optional: send back the new friends list
            notification
        });

    } catch (error) {
        console.error("Error in removeFriend Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
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
        const alreadyFriends = await User.findOne({
            _id: senderId,
            friends: {
                $in: [receiverId]
            }
        });

        if (alreadyFriends) {
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

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: senderId } = req.params;
        const userId = req?.user?._id;

        if (!userId) return res.status(400).json({ message: "UnAuthorized" });
        if (!senderId) return res.status(400).json({ message: "Sender Id is Required" });

        const user = await User.findById(new mongoose.Types.ObjectId(userId));
        const sender = await User.findById(new mongoose.Types.ObjectId(senderId));

        const validRequest = await FriendRequest.findOne({
            from: senderId,
            to: userId,
            type: "send",
            isRead: false
        });

        if (!validRequest) {
            return res.status(400).json({ message: "Invalid Request" });
        }

        if (!user.friends.includes(senderId)) {

            // Mark the request as read
            validRequest.isRead = true;

            user.friends.push(senderId);
            sender.friends.push(userId);

            await Promise.all([
                await validRequest.save(),
                await user.save(),
                await sender.save()
            ]);

            const newNotification = await FriendRequest.create({
                from: userId,
                to: senderId,
                type: "accept",
            });

            const notification = {
                ...newNotification.toObject(),
                sender: {
                    _id: userId,
                    username: user.username,
                    profileImg: user.profileImg,
                    elo: user.elo,
                },
                reciever: {
                    _id: senderId,
                    username: sender.username,
                    profileImg: sender.profileImg,
                    elo: sender.elo,
                }
            }

            res.json({ message: "Friend Request Accepted", notification });
        } else {
            res.json({ message: "You are Already friends" });
        }
    }
    catch (e) {
        console.log("Error in acceptFriend Controller", e.message);
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