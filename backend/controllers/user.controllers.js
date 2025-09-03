import GameHistory from "../models/game.model.js";
import  Notifications from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { isInRoom } from "../socket/socket.js";
import GameStatus from "../models/gameStatus.model.js";
import Settings from "../models/setting.model.js";

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
};

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
};

// optimized
export const declineFreind = async(req, res) =>{
    try {
        const { id } = req.params;
        const user = req.user;

        if(!id) return res.status(400).json({ message: "Invalid User ID" });

        // Check if the friend request is valid
        const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "friend-request", isRead : false });

        if (!validRequest) {
            return res.status(400).json({ error: "Invalid Request" });
        };

        // Mark the request as read
        validRequest.isRead = true;
        await validRequest.save();
        
        Notifications.create({
            from : user._id,
            type : "declined-friend-request",
            message : `${user.username} declined your friend request`,
            to : id,
        });

        const userWhoSendGameRequest =  await User.findById(id).select("username");
        console.log(`Game request declined of ${userWhoSendGameRequest.username}`);

        return res.json({ 
            message: "Friend Request Declined",
            from: userWhoSendGameRequest.username,
        });
    } 
    catch (e) {
        console.log("Error in removeFriend Controller", e.message);
        return res.status(500).json({ message : "Internal Server Error" }); 
    };
};

export const declineGameRequest = async(req,res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if(!id) return res.status(400).json({ message: "Invalid User ID" });

        if (user.friends.includes(id)) {

            const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "game-request", isRead : false });

            if (!validRequest) {
                return res.status(400).json({ message: "Invalid Request" });
            }

            // Mark the request as read
            validRequest.isRead = true;
            await validRequest.save();

            await Notifications.create({
                to : id,
                from : req.user._id,
                type : "decline-game-request",
                message : `${user.username} declined you a game request`,
            });

            const userWhoSendGameRequest =  await User.findById(id).select("username");

            console.log(`Game request declined of ${userWhoSendGameRequest.username}`);

            return res.json({ 
                message: "Decline Game Request Successfully",
                from : userWhoSendGameRequest.username,
            });
        } else {
            return res.json({ message: "Already had send the friend request" });
        }
    } 
    catch (e) {
        if(e.message.includes("Cast to ObjectId failed for value")){
            return res.status(400).json({ message: "Invalid User ID" });
        }
        console.log("Error in declineGameRequest Controller", e.message);
        res.status(500).json({ message: "Internal Server Error" });     
    }
};

export const acceptGameRequest = async(req,res) =>{

    // ******* Duties *******

    // 1. Check if, id(the sender who send us game request's ID) has any notification of type `game-request`,
    // where `to` field is us & `from` is the friend & `isRead` is false
    // 2. Mark the notification(which friend send you) as read i.e `isRead` : true
    // 3. Create a new notification of `accept-game-request` 
    // 4. return new notification object to frontend

    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if(!id) return res.status(400).json({ error : "Invalid User ID" });

        if (user.friends.includes(id)) {
            
            const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "game-request", isRead : false });

            // check if notification exits in database
            if (!validRequest) {
                return res.status(400).json({ error: "Invalid Request" });
            };

            // Mark the request as read
            validRequest.isRead = true;
            await validRequest.save();

            const notification = await Notifications.create({
                to : id,
                from : req.user._id,
                gameId : validRequest.gameId,
                type : "accept-game-request",
                message : `${user.username} accepted you a game request`,
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
        res.status(500).json({ error: "Internal Server Error" });     
    };
};

// end

export const acceptFriend = async(req, res) =>{
    try {
        const { id } = req.params;
        console.log(id);
        const user = await User.findById(req.user._id);
        const sender = await User.findById(id);

        if(!sender) return res.status(400).json({ error: "Invalid Id" });
        
        // TODO : Check in database that is it makes the notification read
        const validRequest = await Notifications.findOne({ from : id, to : req.user._id, type : "friend-request", isRead : false });
        
        if (!validRequest) {
            return res.status(400).json({ error: "Invalid Request" });
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
                to : id,
                from : req.user._id,
                type : "accepted-friend-request",
                message : `${user.username} accepted your friend request`,
            });
            res.json({ msg: "Friend Request Accepted", notification, user, sender });
        } else {
            res.json({ msg: "You are ALready friends" });
        }
    } 
    catch (e) {
        console.log("Error in acceptFriend Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
};


export const sendGameRequest = async(req,res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);

        if(!id) return res.status(400).json({ error: "Invalid User ID" });

        const friend = await User.findById(id);
        if (!friend) return res.status(404).json({ error: "friend not found" });

        if (user.friends.includes(id)) {

            //TODO: Remove Game id as its useless
            const gameId = crypto.randomUUID();

            const notificationAlreadyExists = await Notifications.findOne({ from : user._id, to : id, type : "game-request", isRead : false });

            if(notificationAlreadyExists){
                console.log("You have already sent a game request to this friend");
                return res.status(400).json({ error: `You have already sent a game request to ${friend.username}` });
            };
        
            const notification = await Notifications.create({
                to : id,
                from : req.user._id,
                type : "game-request",
                gameId : gameId,
                message : `${user.username} sent you a game request`,
            });

            res.json({ message : "Game Request send Successfully", notification});
        } else {
            res.json({ message: "You have to be friends first, to send a game request" });
        };
    } 
    catch (e) {
        if(e.message.includes("Cast to ObjectId failed for value")){
            return res.status(400).json({ message : "Invalid User ID" });
        }
        console.log("Error in sendGameRequest Controller", e.message);
        res.status(500).json({ message : "Internal Server Error" });     
    }
};

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

export const getGameRequests = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id);
        const gameRequests = await Notifications.find({ to : req.user._id, type: "game-request", isRead : false }).populate("from", "username profileImg");
        return res.json(gameRequests);
    } 
    catch (e) {
        console.log("Error in getGameRequests Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const getFriendRequests = async(req, res) =>{
    try {
        const user = await User.findById(req.user._id);
        const friendRequests = await Notifications.find({ to : req.user._id, isRead : false })
        .populate("from", "username profileImg")
        .sort({ createdAt : -1 });
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



export const saveGameDetails = async(req,res) =>{
    const { white, black, won, moves, roomId, maxTime, rating, type } = req.body;
    let username = {
        white : "",
        black : ""
    }

    if(!isInRoom(roomId)){
        return res.status(400).json({ error: "You are out of the room" });
    }

    if(!white && !black && !won && !moves && !roomId && !maxTime && !rating && !type){
        return res.status(400).json({ error: "Please Enter all the fields" });
    }

    const playerWhite = await  User.findById(white);
    const playerBlack = await User.findById(black);

    username.white = playerWhite.username.toString();
    username.black = playerBlack.username.toString();

    if(!playerWhite && !playerBlack){
        return res.status(401).json({ error: "No such user Exits" });
    }
    
    // if(rating.white.after <= 0) playerWhite.elo = 0;
    // else playerWhite.elo = rating.white.after;
    playerWhite.elo = rating.white.after;

    // if(rating.black.after <= 0) playerBlack.elo = 0;
    playerBlack.elo = rating.black.after;

    if(won.length === 1){
        if(won[0] === "white"){
            playerWhite.rapid.win += 1;
            playerBlack.rapid.lose += 1;
        }
        else if(won[0] === "black"){
            playerBlack.rapid.win += 1;
            playerWhite.rapid.lose += 1;
        }
    }
    else if(won.length === 2){
        playerWhite.rapid.draw += 1;
        playerBlack.rapid.draw += 1;
    }

    Promise.all([ await playerWhite.save(), await playerBlack.save()]);

    try {
            const newGame = new GameHistory({
              white,
              black,
              won,
              moves,
              roomId,
              maxTime,
              rating,
              username,
              type,
              endedAt: new Date(),
            });
        
            await newGame.save();
            console.log("Game Saved Successfully ✅");
        
            res.status(201).json({ msg: "Game Saved Successfully" });
    } 
    catch (e) {
        console.log("Error in saveGameDetails Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}

export const getBothPlayersDetails = async(req,res) =>{
    const { id  } = req.body;
    const opponentId = id;

    if(!opponentId) return res.status(400).json({ error: "Invalid Opponent ID" });

    try {
        const you = await User.findById(req.user._id);
        const opponent = await User.findById(opponentId);

        if(!opponent) return res.status(400).json({ error: "No such user exists to play" });
        return res.json({ you, opponent });
        
    } 
    catch (e) {
        console.log("Error in getBothPlayersDetails Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}


export const getPlayer = async(req,res) =>{
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.json(user);
    } 
    catch (e) {
        if(e.message.includes("Cast to ObjectId failed for value")){
            return res.status(400).json({ error: "Invalid User ID" });
        }
        console.log("Error in getPlayer Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}

export const getProfile = async(req,res) =>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        const gameHistory = await GameHistory.find({
            $or : [
                { white: userId },
                { black: userId }
            ]
        }).sort({ createdAt: -1 }).limit(10);

        // if (!gameHistory.length) {
        //     return res.status(404).json([]);
        // }

        res.status(200).json({
            msg: "Game history fetched successfully.",
            gameHistory,
            user,
        });
    } 
    catch (e) {
        console.log("Error in getProfile Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}

export const updateProfile = async(req,res) =>{
    const { username, email, oldPassword, newPassword } = req.body;
    const userId = req.user._id;
    // const file = req.file;

    console.log(username, email, oldPassword, newPassword);
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if(user.email === email) return res.status(400).json({ msg : "Email should be different" });
        if(user.username === username) return res.status(400).json({ msg : "Username should be different" });

        // ✅ Check if the old password matches (if provided)
        if (oldPassword && newPassword) {
            if(oldPassword === newPassword){
                return res.status(400).json({ msg : "New Password should be different" })
            }
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Old password is incorrect' });
    
            // ✅ Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }
        // ✅ Handle profile image upload (if provided)
        // if (file) {
        //     const result = await cloudinary.uploader.upload(file.path, {
        //     folder: 'profile_images',
        //     });
        //     user.profileImg = result.secure_url;
        // }

        // ✅ Update other fields (if provided)
        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ msg: 'Profile updated successfully' });
    } 
    catch (e) {
        console.log("Error in updateProfile Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}
export const getAllUsers = async(req,res) =>{
    const userId = req.user._id.toString();
    try {
        const usersb = await User.find({});
        const users = usersb.filter((user) => {
           return  user.id !== userId
        })
        console.log(users)
        res.status(200).json({ msg: 'Profile updated successfully', users });
    } 
    catch (e) {
        console.log("Error in getALlUsers Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });     
    }
}

export const getLeaderboard = async (req, res) => {
    try {
      const leaderboard = await User.find()
        .sort({ elo: -1 })
        .limit(50);
  
      // ✅ Find User Rank
      const user = await User.findById(req.user._id);
      const rank = await User.countDocuments({ elo: { $gt: user.elo } }) + 1;
  
      res.status(200).json({
        message: "Leaderboard fetched successfully",
        leaderboard,
        yourRank: rank,
        yourElo: user.elo,
      });
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };

// TODO : shift the function to notification controller if not lazy
// TODO : On frontend button, only allow once to send this api request
export const markAllNotificationsAsRead = async(req, res) =>{
    try {
        const notifications = await Notifications.find(
            { 
                to : req.user._id, 
                type: { $in: ["accepted-friend-request","declined-friend-request","accept-game-request","decline-game-request"]}, 
                isRead: false
            });
        console.log("before notification : ",notifications)
        if (!notifications) {
            return res.status(404).json({ msg: "Notification not found" });
        }

        notifications.map(async(req)=>{
            req.isRead = true;
            req.save();
        });

        console.log("after notification : ",notifications);
        
        res.json({ msg: "All Notifications are marked as read" });
    } 
    catch (e) {
        console.log("Error in markAllNotificationsAsRead Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const markMessageAsRead = async(req, res) =>{
    try {
        const { id } = req.params;
        const notification = await Notifications.findById(id);
        if (!notification) {
            return res.status(400).json({ msg: "Notification not found" });
        }
        if(notification.isRead){
            return res.status(401).json({ msg: "Notification was already read" });
        }

        notification.isRead = true;
        await notification.save();

        console.log("after notification : ",notification);
        res.json({ msg: "Notification marked as read" });
    } 
    catch (e) {
        console.log("Error in markMessageAsRead Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const saveGameStatusOnReLoad = async(req, res) =>{
    try {
        const { board, turn, notations, playerColor, capturedPieces, opponent, roomId } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user && !opponent && !playerColor && !roomId){
            return res.status(400).json({ msg: "Error Code 1" });
        }

        const white = playerColor === "white" ? user : opponent;
        const black = playerColor === "black" ? user : opponent;

        const alreadySaved = await GameStatus.findOne({
            $or : [
                { white: userId },
                { black: userId }
            ],
            roomId,
            playerColor
        });

        if(!alreadySaved){
            console.log("First Game Reload");
            const gameStatus = await GameStatus.create({
                white,
                black,
                turn,
                playerColor,
                notations,
                roomId,
                board,
            });
            return res.status(201).json({ msg: "The game didn't existed, so we create one", gameStatus });
        }
        else{
            console.log("Nth Game Reload");

            alreadySaved.board = board;
            alreadySaved.turn = turn;
            alreadySaved.notations = notations

            alreadySaved.save();
        }
        return res.json({ msg: "Game Saved Successfully", gameStatus : alreadySaved });
    } 
    catch (e) {
        console.log("Error in saveGameStatusOnReLoad Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const checkIfGameReloaded = async(req, res) =>{
    console.log("Check if we have GameStatus")
    try {
        const userId = req.user._id;

        const gameStatus = await GameStatus.findOne({
            $or : [
                { white: userId },
                { black: userId }
            ],
        });

        if(!gameStatus) return res.status(400).json({ msg: "no gameHistory exists"});

        const playerColor = gameStatus.white.toString() === userId.toString() ? "white" : "black";

        const gameStatusAgain = await GameStatus.findOne({
            $or : [
                { white: userId },
                { black: userId }
            ],
            playerColor
        });

        if(!gameStatusAgain) return res.status(400).json({ msg: `no gameHistory for ${playerColor} exists`});

        res.status(200).json({ msg: "checkIfGameReloaded Ended", gameStatus: gameStatusAgain });
    } 
    catch (e) {
        console.log("Error in checkIfGameReloaded Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getChessAnalytics = async (req, res) => {
  try {
    const users = await User.find();
    const totalPlayers = users.length;
    const activePlayers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 86400000) } });
    
    const totalGames = await GameHistory.countDocuments();
    const avgMovesPerGame = Math.round(await GameHistory.aggregate([{ $group: { _id: null, avgMoves: { $avg: { $size: "$moves.white" } } } }])[0]?.avgMoves || 30);

    const eloProgress = await GameHistory.aggregate([
      { $project: { date: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, elo: "$rating.white.after" } },
      { $group: { _id: "$date", avgElo: { $avg: "$elo" } } },
      { $sort: { _id: 1 } }
    ]);

    const gameResults = await GameHistory.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    const eloDistribution = await User.aggregate([
      {
        $bucket: {
          groupBy: "$elo",
          boundaries: [1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600],
          default: "2600+",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    res.json({
      totalPlayers,
      activePlayers,
      totalGames,
      avgMovesPerGame,
      eloProgress,
      gameResults,
      eloDistribution
    });

  } catch (error) {
    res.status(500).json({ error: "Error fetching analytics data" });
  }
};

export const getAllUserss = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getAllUsers controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notifications.find({})
            .sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error getAllNotifications controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllGameHistory = async (req, res) => {
    try {
        const gameHistory = await GameHistory.find({})
            .sort({ createdAt: -1 });
        res.status(200).json(gameHistory);
    } catch (error) {
        console.error("Error getAllGameHistory controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const changeSettings = async(req,res) =>{
    try {
        const { sound, pieceType, boardColor } = req.body;
        const userId = req.user._id;
        // const user = await User.findById(userId);

        // if(!user) return res.status(400).json({ msg: "No such user exists" });

        const userSetting = await Settings.findOne({ userId });
        if(!userSetting) return res.status(400).json({ msg: "No such settings exists" });

        if(!sound && !pieceType && !boardColor){
            return res.status(400).json({ msg: "Please Change atleast one setting" });
        }

        if(userSetting.sound !== sound) userSetting.sound = sound;
        if(userSetting.pieceType !== pieceType) userSetting.pieceType = pieceType;

        if(userSetting.boardColor.name !== boardColor.name) {
            userSetting.boardColor.name = boardColor.name;
            userSetting.boardColor.blackTile = boardColor.blackTile;
            userSetting.boardColor.whiteTile = boardColor.whiteTile;
        }

        await userSetting.save();
        res.json({ message: "Settings Updated Successfully" });
    } 
    catch (e) {
        console.log("Error in changeSettings Controller", e.message);
        res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const getSettings = async(req,res) =>{
    try {
        
        const userId = req.user._id;
        const userSetting = await Settings.findOne({ userId });
        if (!userSetting) return res.status(404).json({ msg: "Settings not found" });
        
        res.status(200).json(userSetting);

    } catch (error) {
        
        console.error("Error getSettings controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const saveStatus = async (req, res) => {
    try {
      const { roomId, board, turn, notations, playerColor, white, black } = req.body;
  
      await GameStatus.findOneAndUpdate(
        { roomId, playerColor },
        { board, turn, notations, white, black },
        { upsert: true }
      );

      console.log("status saved");
  
      res.status(200).json({ message: "Game status saved" });
    } catch (err) {
      res.status(500).json({ error: "Save failed", err });
    }
  };

// Load game status
export const loadStatus = async (req, res) => {
    try {
      const { playerColor } = req.body;
      const status = await GameStatus.findOne({ roomId: req.params.roomId, playerColor });
      if (!status) return res.status(404).json({ error: "No saved game found" });
  
      res.status(200).json(status);
    } catch (err) {
      res.status(500).json({ error: "Load failed", err });
    }
};

export const checkAdminStatus = async (req, res) => {
    try {
      const id = req.user._id;
      const user = await User.findOne({ _id: id });
      if(!user) return res.status(400).json({ error: "Invalid Credentails"});
    
      console.log(user)
      if(user.username === "Admin"){
        return res.status(200).json({ isAdmin : true });
      }
      return res.status(200).json({isAdmin : false });

    } catch (err) {
      res.status(500).json({ error: "Error in checkAdminStatus Controller", err });
    }
};

