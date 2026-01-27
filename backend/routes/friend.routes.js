import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { acceptFriendRequest, declineFriendRequest, removeFriend, sendFriendRequest } from "../controllers/friend.controllers.js";
const router = express.Router();

router.delete("/remove/:id", protectedRoute, removeFriend);
router.post("/request/:id", protectedRoute, sendFriendRequest);
router.post("/accept/:id", protectedRoute, acceptFriendRequest);
router.post("/decline/:id", protectedRoute, declineFriendRequest);

export default router;