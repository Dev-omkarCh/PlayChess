import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getMessages, sendMessage } from "../controllers/message.controllers.js";
const router = express.Router();

router.get("/:roomId", protectedRoute, getMessages);
router.post("/message/send/", protectedRoute, sendMessage);

export default router;