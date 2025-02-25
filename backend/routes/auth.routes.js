import express from "express";
import { login, logout, signup, getUser } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
const router = express.Router();

router.get("/getme", protectedRoute, getUser);
router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);

export default router;