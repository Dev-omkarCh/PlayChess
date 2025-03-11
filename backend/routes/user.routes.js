import express from "express";
import { searchByUserName, addFriend, acceptFriend, declineFreind, 
    getFriendRequests, markAllNotificationsAsRead, getFriends, 
    sendGameRequest, acceptGameRequest, declineGameRequest, getGameRequests, getPlayer, 
    saveGameDetails, getBothPlayersDetails, getProfile, updateProfile, 
    getAllUsers, getLeaderboard, markMessageAsRead
} from "../controllers/user.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.get("/search",protectedRoute,searchByUserName);
router.post("/send/friend-request/:id",protectedRoute,addFriend);
router.post("/send/accept-request/:id",protectedRoute,acceptFriend);
router.post("/send/deny-request/:id",protectedRoute,declineFreind);

router.post("/game/send/:id", protectedRoute, sendGameRequest);
router.post("/game/accept/:id", protectedRoute, acceptGameRequest);
router.post("/game/decline/:id", protectedRoute, declineGameRequest);
router.get("/game/get", protectedRoute, getGameRequests);

router.get("/get/player/:id", protectedRoute, getPlayer);
router.get("/profile", protectedRoute, getProfile);
router.get("/", protectedRoute, getAllUsers);
router.put("/edit/profile", protectedRoute, updateProfile);
router.get("/leaderboard",protectedRoute,getLeaderboard)

router.post("/game/save",protectedRoute,saveGameDetails);
router.get("/game/players/details/:id",protectedRoute,getBothPlayersDetails);

// Todo-optinal : Give a good name
router.get("/friends",protectedRoute,getFriends);
router.put("/notifications/read",protectedRoute,markAllNotificationsAsRead);
router.post("/notification/read/:id",protectedRoute,markMessageAsRead);
router.get("/requests",protectedRoute,getFriendRequests);


export default router;