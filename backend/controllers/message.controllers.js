import GameMessage from "../models/gameMessage.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { roomId, message } = req.body;
    const senderId = req.user._id; // assuming you have auth middleware

    if(!roomId || !message) {
      return res.status(400).json({ error: "Room ID and message are required" });
    };

    // Create and save chat message
    const chat = new GameMessage({
      roomId,
      senderId,
      message,
    });

    await chat.save();

    return res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    if(!roomId) return res.status(400).json({ error: "Room ID is required" });
    console.log("Fetching messages for room:", roomId);
    const messages = await GameMessage.find({ roomId });

    return res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};