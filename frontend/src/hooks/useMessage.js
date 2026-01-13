import { useSocketContext } from "@/context/SocketContext";
import { messageStore } from "@/store/messageStore";
import toast from "react-hot-toast";

export const useMessage = () => {
    const { messages,setMessages } = messageStore();
    const socket = useSocketContext();

    const getMessages = async(roomId) =>{
        try {
            if(!roomId) return toast.error("Room ID is required");
            const response = await fetch(`/api/game/messages/${roomId}`, {
                method: "GET",
            });
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            console.log("Fetched messages:", data);
            setMessages(data);
            return data;
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendMessage = async(roomId, message) =>{
        try {
            console.log("send Message")
            if(!roomId || !message) return toast.error("Room ID and message are required");
            const response = await fetch(`/api/game/messages/message/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ roomId, message }),
            });
            if (!response.ok) throw new Error("Failed to send message");
            const data = await response.json();
            setMessages(data,true);
            socket?.emit("hasSendMessage", roomId, data);
            return data;
        } catch (error) {
            toast.error(error.message);
        }
    };

    return { getMessages, sendMessage }
};