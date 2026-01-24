import ChessGame from "../models/chessGame.model.js";

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

export const checkGameExists = (req, res) => {
    // Implementation for checking if a game exists by ID
};

export const playedMove = (req, res) => {
    // Implementation for making a move in the game
}