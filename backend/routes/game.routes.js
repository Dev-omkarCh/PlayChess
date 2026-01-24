import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { checkGameExists, createNewGame, playedMove } from "../controllers/game.controller.js";
const router = express.Router();

router.post("/new", protectedRoute, createNewGame);
router.get('/:id', protectedRoute, checkGameExists);
router.post("/:id/move", protectedRoute, playedMove);

export default router;