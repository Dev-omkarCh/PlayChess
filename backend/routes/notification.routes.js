import express from 'express';
import { protectedRoute } from "../middleware/protectedRoute.js";
import { 
    acceptFriendRequest, acceptGameRequest, declineFriendRequest, 
    declineGameRequest, getFriendAndGameRequests, sendFriendRequest, 
    sendGameRequest 
} from '../controllers/notification.controllers.js';

const router = express.Router();

router.get("/requests", protectedRoute, getFriendAndGameRequests);

router.post("/send/friend-request/:id", protectedRoute, sendFriendRequest);
router.post("/send/accept-request/:id", protectedRoute, acceptFriendRequest);
router.post("/send/deny-request/:id", protectedRoute, declineFriendRequest);

router.post("/game/send/:id", protectedRoute, sendGameRequest);
router.post("/game/accept/:id", protectedRoute, acceptGameRequest);
router.post("/game/decline/:id", protectedRoute, declineGameRequest);

export default router;