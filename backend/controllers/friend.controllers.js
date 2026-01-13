import User from "../models/user.model.js";

export const removeFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req?.user?._id;

        console.log(id);

        if (!userId) return res.status(401).json({ message: "Unauthorized Access" });
        if (!id || id === 'undefined') return res.status(400).json({ message: "No friend ID provided" });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: id } }, // Removes the specific ID from array
            { new: true }
        );

        await User.findByIdAndUpdate(
            id,
            { $pull: { friends: userId } }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ 
            message: "Friend removed successfully",
        });

    } catch (error) {
        console.error("Error in removeFriend Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    };
};