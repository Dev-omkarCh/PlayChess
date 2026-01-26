import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { challengePlayer, checkGameExists, createNewGame, getBothPlayersDetails, playedMove } from "../controllers/game.controllers.js";
const router = express.Router();

router.post("/new", protectedRoute, createNewGame);
router.get("/players/:id", protectedRoute, getBothPlayersDetails);
router.get('/:id', protectedRoute, checkGameExists);
router.post("/:id/move", protectedRoute, playedMove);
router.post("/challenge/:id", protectedRoute, challengePlayer);

export default router;