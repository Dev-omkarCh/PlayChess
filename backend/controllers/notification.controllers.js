import Notifications from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getFriendAndGameRequests = async (req, res) => {
    try {
        const userId = req?.user?._id;
        const typesQuery = req.query.types; // e.g., "friend,game" or "friend"

        if (!userId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!typesQuery) return res.status(400).json({ message: "Provide a Notification Type" });

        // Map the short names from frontend to your DB type strings
        const typeMapping = {
            friend: "friend-request",
            game: "game-request"
        };

        // Convert query string into an array and filter for valid ones
        const requestedTypes = typesQuery.split(",").map(t => t.trim());
        const validDbTypes = requestedTypes
            .filter(t => typeMapping[t])     // Only keep 'friend' or 'game'
            .map(t => typeMapping[t]);      // Convert to 'friend-request', etc.

        if (validDbTypes.length === 0) {
            return res.status(400).json({ message: "Invalid Notification Type(s) provided" });
        }

        // 3. One single query handles everything!
        const requests = await Notifications.find({
            to: userId,
            isRead: false,
            type: { $in: validDbTypes } // This handles 1 type OR multiple types automatically
        })
            .populate("from", "username profileImg")
            .sort({ createdAt: -1 });

        return res.status(200).json(requests);

    } catch (error) {
        console.error("Error in getNotifications:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        // Check if the user exists
        const reqExists = await Notifications.findOne({ from: req.user._id, to: id, type: "friend-request", isRead: false });
        if (reqExists) return res.json({ message: "You have already send a request, and not yet Accepted" });

        if (!user.friends.includes(id)) {
            const newNotification = await Notifications.create({
                to: id,
                from: req.user._id,
                type: "friend-request",
                message: `${user.username} sent you a friend request`,
            });

            const notification = {
                ...newNotification.toObject(),
                senderName: user.username,
                profileImg: user.profileImg,
            }

            res.json({ message: "Request send Successfully", notification });
        } else {
            res.json({ message: "Already had send the friend request" });
        }
    }
    catch (e) {
        if (e.message.includes("Cast to ObjectId failed for value")) {
            return res.status(400).json({ error: "Invalid User ID" });
        }
        console.log("Error in addFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const sendGameRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if (!id) return res.status(400).json({ message: "Invalid User ID" });

        const friend = await User.findById(id);
        if (!friend) return res.status(404).json({ message: "friend not found" });

        if (user.friends.includes(id)) {

            //TODO: Remove Game id as its useless
            const gameId = crypto.randomUUID();

            const notificationAlreadyExists = await Notifications.findOne({ from: user._id, to: id, type: "game-request", isRead: false });

            if (notificationAlreadyExists) {
                console.log("You have already sent a game request to this friend");
                return res.status(400).json({ message: `You have already sent a game request to ${friend.username}` });
            };

            const newNotification = await Notifications.create({
                to: id,
                from: req.user._id,
                type: "game-request",
                gameId: gameId,
                message: `${user.username} sent you a game request`,
            });

            const notification = {
                ...newNotification.toObject(),
                senderName: user.username,
                profileImg: user.profileImg
            }

            res.json({ message: "Game Request send Successfully", notification });
        } else {
            res.json({ message: "You have to be friends first, to send a game request" });
        };
    }
    catch (e) {
        if (e.message.includes("Cast to ObjectId failed for value")) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        console.log("Error in sendGameRequest Controller", e.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user._id);
        const sender = await User.findById(id);

        if (!sender) return res.status(400).json({ message: "Invalid Id" });

        // TODO : Check in database that is it makes the notification read
        const validRequest = await Notifications.findOne({ from: id, to: req.user._id, type: "friend-request", isRead: false });

        if (!validRequest) {
            return res.status(400).json({ message: "Invalid Request" });
        }

        if (!user.friends.includes(id)) {

            // Mark the request as read
            validRequest.isRead = true;
            await validRequest.save();

            user.friends.push(id);
            sender.friends.push(req.user._id);

            await user.save();
            await sender.save();
            // Promise.all([await user.save(), await sender.save()])
            const notification = await Notifications.create({
                to: id,
                from: req.user._id,
                type: "accepted-friend-request",
                message: `${user.username} accepted your friend request`,
            });

            res.json({ message: "Friend Request Accepted", notification, user, sender });
        } else {
            res.json({ message: "You are ALready friends" });
        }
    }
    catch (e) {
        console.log("Error in acceptFriend Controller", e.message);
        res.status(500).json({ message: "Internal Server Error" });

    }
};

export const acceptGameRequest = async (req, res) => {

    // ******* Duties *******

    // 1. Check if, id(the sender who send us game request's ID) has any notification of type `game-request`,
    // where `to` field is us & `from` is the friend & `isRead` is false
    // 2. Mark the notification(which friend send you) as read i.e `isRead` : true
    // 3. Create a new notification of `accept-game-request` 
    // 4. return new notification object to frontend

    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if (!id) return res.status(400).json({ message: "Invalid User ID" });

        if (user.friends.includes(id)) {

            const validRequest = await Notifications.findOne({
                from: id,
                to: req.user._id,
                type: "game-request",
                isRead: false
            });

            // check if notification exits in database
            if (!validRequest) {
                return res.status(400).json({ message: "Invalid Request" });
            };

            // Mark the request as read
            validRequest.isRead = true;
            await validRequest.save();

            const notification = await Notifications.create({
                to: id,
                from: req.user._id,
                gameId: validRequest.gameId,
                type: "accept-game-request",
                message: `${user.username} accepted you a game request`,
            });

            return res.json({
                message: "Request send Successfully",
                notification
            });
        }
        else {
            return res.json({ message: "Can't Accept!, you are not friends" });
        };
    }
    catch (error) {
        console.log("Error in acceptGameRequest Controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    };
};

export const declineFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?._id;

        if (!id) return res.status(400).json({ message: "Invalid Request ID" });
        if (!userId) return res.status(400).json({ message: "Invalid User ID" });

        const user = await User.findById(userId);

        // Check if the friend request is valid
        const validRequest = await Notifications.findOne({ from: id, to: userId, type: "friend-request", isRead: false });

        if (!validRequest) {
            return res.status(400).json({ error: "Invalid Request" });
        };

        // Mark the request as read
        validRequest.isRead = true;
        await validRequest.save();

        Notifications.create({
            from: userId,
            type: "declined-friend-request",
            message: `${user.username} declined your friend request`,
            to: id,
        });

        const userWhoSendGameRequest = await User.findById(id).select("username");
        console.log(`Game request declined of ${userWhoSendGameRequest.username}`);

        return res.json({
            message: "Friend Request Declined",
            from: userWhoSendGameRequest.username,
        });
    }
    catch (e) {
        console.log("Error in removeFriend Controller", e.message);
        return res.status(500).json({ message: "Internal Server Error" });
    };
};

export const declineGameRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?._id;

        if (!id) return res.status(400).json({ message: "Invalid Request ID" });
        if (!userId) return res.status(400).json({ message: "Invalid User ID" });

        const user = await User.findById(userId);

        if (user.friends.includes(id)) {
            const validRequest = await Notifications.findOne({ 
                from: id, 
                to: userId, 
                type: "game-request", 
                isRead: false 
            });

            if (!validRequest) {
                return res.status(400).json({ message: "Invalid Request" });
            }

            // Mark the request as read
            validRequest.isRead = true;
            await validRequest.save();

            await Notifications.create({
                to: id,
                from: req.user._id,
                type: "decline-game-request",
                message: `${user.username} declined you a game request`,
            });

            const userWhoSendGameRequest = await User.findById(id).select("username");

            console.log(`Game request declined of ${userWhoSendGameRequest.username}`);

            return res.json({
                message: "Decline Game Request Successfully",
                from: userWhoSendGameRequest.username,
            });
        } else {
            return res.json({ message: "Already had send the friend request" });
        }
    }
    catch (e) {
        if (e.message.includes("Cast to ObjectId failed for value")) {
            return res.status(400).json({ message: "Invalid User ID" });
        }
        console.log("Error in declineGameRequest Controller", e.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};