import useFriendStore from "@/store/useFriendStore";
import useSocketStore from "@/store/socketStore";
import useAuthStore from "@/store/authStore";
import { useSocketContext } from "@/context/SocketContext";
import { useResultStore } from "@/store/resultStore";
import axios from "axios";
import toast from "react-hot-toast";
import { useGameDataStore } from "@/store/gameDataStore";
import { useAppNavigator } from "./useAppNavigator";
import { notificationStore } from "@/store/notificationStore";

const useRequest = () => {

    const socket = useSocketContext();
    const { setFriendRequests, setGameId, setFriend } = useFriendStore();
    const { joinGame } = useSocketStore();
    const { authUser } = useAuthStore();
    const { setOpponentId } = useResultStore();
    const { setGameData } = useGameDataStore();
    const { goTo } = useAppNavigator();
    const { notifications, setNotifications } = notificationStore();

    const getFriendAndGameRequests = async () => {
        try {
            const response = await axios.get("/api/notifications/requests");
            const data = response.data;

            console.log(data);

            setNotifications([...data.friendRequests, ...data.challengeRequests]);
            console.log("Successfully get friend and game requests");
            return;
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        };
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await axios.post(`/api/friends/request/${receiverId}`);
            const data = response.data;
            if (!data.notification) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            socket.emit("send-friend-request", { receiverId, notification: data.notification });
            return;

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    const sendGameRequest = async (receiverId) => {
        try {
            const response = await axios.post(`/api/notifications/game/send/${receiverId}`);

            const data = response.data;

            setGameId(data?.notification.gameId);
            // joinGame(data?.notification.gameId);

            socket.emit("game-request", {
                id: receiverId,
                notification: data.notification,
                userId: authUser?._id,
                gameId: data?.notification?.gameId,
            });

            localStorage.setItem("gameDataNew", JSON.stringify({
                white: authUser._id,
                black: receiverId,
                isHost: true,
                gameId: data?.notification.gameId,
            }));

            setGameData({
                white: authUser._id,
                black: receiverId,
                isHost: true,
                gameId: data?.notification.gameId,
            });

            // Send Challenge to Backend to create a game instance

            const response1 = await axios.post(`/api/game/challenge/${receiverId}`);
            const data1 = response1.data;
            console.log("Challenge Data : ", data1?.challenge);
            socket.emit("challenge-player", { notification: data1?.challenge });

            toast.success(data1?.message);

            return data;

        } catch (error) {
            const message = error.response?.data?.message
            console.error(message || "Something went wrong");
            toast.error(message || "Something went wrong");
        }
    };

    const acceptFriendRequest = async (requestId) => {

        try {
            const response = await axios.post(`/api/friends/accept/${requestId}`);
            const data = response.data;

            setFriend(data?.notification?.reciever);
            socket?.emit("accept-friend-request", { 
                requestId, 
                notification: data?.notification, 
                sender: data?.notification?.sender 
            });
            toast.success(data?.message);

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        };
    };

    const acceptGameRequest = async (requestId) => {
        try {
            const response = await axios.post(`/api/notifications/game/accept/${requestId}`);
            const data = response.data;
            toast.success(data?.message);

            setGameId(data?.notification.gameId);
            // joinGame(data?.notification.gameId);
            setOpponentId(requestId);

            socket.emit("accept-game-request", {
                id: requestId,
                notification: data.notification,
                userId: authUser._id
            });

            goTo("/game/lobby");

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const declineFriendRequest = async (receiverId) => {

        try {
            const response = await axios.post(`/api/friends/decline/${receiverId}`);
            const data = response.data;

            toast.success(data?.message);
            socket.emit("decline-friend-request", { receiverId, notification: data.notification });

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    const declineGameRequest = async (requestId) => {

        console.log(requestId);

        try {
            const response = await fetch(`/api/notifications/game/decline/${requestId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) return toast.error(data?.message);

            // optional
            console.log(`Game Request Declined of ${data?.from}`);
            toast.success(`Game Request Declined of ${data?.from}`);

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        };
    };

    const friendRequestListener = () => {
        if (!socket) return;
        socket.on("friendRequest", (data) => {
            set((state) => ({ friendRequests: [...state.friendRequests, data] }));
        });

        socket.on("friendRequestAccepted", (data) => {
            set((state) => ({ friends: [...state.friends, data] }));
        });
    };

    const markAsRead = async (id) => {
        try {

            const response = await axios.delete(`/api/notifications/markAsRead/${id}`);
            const data = response.data;

            const filteredNotifications = notifications.filter((notification) => notification._id !== id);
            setNotifications(filteredNotifications);
            toast.success(data?.message);

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const markAllMessagesAsRead = async (messages) => {
        try {
            const response = await axios.delete("/api/notifications/markAsRead");
            const data = response.data;

            const filteredNotifications = notifications.filter((notification) => {
                return !messages.some((message) => message._id === notification._id);
            });

            setNotifications(filteredNotifications);
            toast.success(data?.message);

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const removeFriend = async (id) => {
        try {
            const response = await axios.delete(`/api/friends/remove/${id}`);
            const data = response.data;
            toast.success(data?.message);
            const filteredfriends = friends.filter((friend)=> friend._id !== id );
            setFriends(filteredfriends);
            socket?.emit("remove-friend", { removedUser: id, user : authUser._id });
            return;

        } catch (error) {
            console.log(error);
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    return {
        sendFriendRequest, acceptFriendRequest, declineFriendRequest,
        sendGameRequest, acceptGameRequest, declineGameRequest,
        friendRequestListener, getFriendAndGameRequests, markAllMessagesAsRead, markAsRead,
        removeFriend
    };
};

export default useRequest;