import express from "express";
import { searchByUserName, addFriend, acceptFriend, declineFreind, getFriendRequests, markNotificationAsRead, getFriends} from "../controllers/user.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.get("/search",protectedRoute,searchByUserName);
router.post("/send/friend-request/:id",protectedRoute,addFriend);
router.post("/send/accept-request/:id",protectedRoute,acceptFriend);
router.post("/send/deny-request/:id",protectedRoute,declineFreind);

// Todo-optinal : Give a good name
router.get("/friends",protectedRoute,getFriends);
router.post("/notification/read/:id",protectedRoute,markNotificationAsRead);
router.get("/requests",protectedRoute,getFriendRequests);


export default router;