import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { addFriend } from "../controllers/friend.controllers.js";
const router = express.Router();

router.post("/send/friend-request/:id",protectedRoute,addFriend);

export default router;