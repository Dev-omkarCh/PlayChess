import mongoose from "mongoose";
import ChessGame from "../models/chessGame.model.js";
import User from "../models/user.model.js";

export const createNewGame = async (req, res) => {
    // Implementation for creating a new game
    const { playerWhite, playerBlack } = req.body;
    const userrId = req?.user?._id;

    if (!userrId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!playerWhite || !playerBlack) {
        return res.status(400).json({ message: "Both player IDs are required." });
    };

    const game = await ChessGame.create({
        players: {
            white: playerWhite,
            black: playerBlack
        }
    });

    return res.status(201).json({ message: "Game created successfully", game });
};

export const getBothPlayersDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?._id;
        console.log("getBothPlayersDetails");

        console.log("userId", userId);
        console.log("opponentId", id);
        console.log(!id);

        if (!userId) {
            return res.status(400).json({ message: "UnAuthorized" });
        }
        if (!id) {
            return res.status(400).json({ message: "OpponentId is required" });
        }

        const user = await User.findById(userId).select("-password");
        const opponent = await User.findById(id).select("-password");

        if (!user) {
            return res.status(400).json({ message: "AuthUser Not found" });
        }
        if (!opponent) {
            return res.status(400).json({ message: "Opponent Not found" });
        }

        return res.status(200).json({
            message: "OpponentId is required", game: {
                you: user,
                opponent
            }
        });
    } catch (error) {
        console.log("Error in getBothPlayerDetails Controller : ", error?.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkGameExists = (req, res) => {
    // Implementation for checking if a game exists by ID
};

export const playedMove = (req, res) => {
    // Implementation for making a move in the game
}