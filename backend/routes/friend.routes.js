import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { removeFriend } from "../controllers/friend.controllers.js";
const router = express.Router();

router.delete("/remove/:id", protectedRoute, removeFriend);

export default router;