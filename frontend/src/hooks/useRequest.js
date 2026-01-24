import useFriendStore from "@/store/useFriendStore";
import useSocketStore from "@/store/socketStore";
import useAuthStore from "@/store/authStore";
import { useSocketContext } from "@/context/SocketContext";
import { useResultStore } from "@/store/resultStore";
import axios from "axios";
import toast from "react-hot-toast";
import { useGameDataStore } from "@/store/gameDataStore";
import { useAppNavigator } from "./useAppNavigator";

const useRequest = () => {

    const socket = useSocketContext();
    const { setFriendRequests, setGameId, setFriend } = useFriendStore();
    const { joinGame } = useSocketStore();
    const { authUser } = useAuthStore();
    const { setOpponentId } = useResultStore();
    const { setGameData } = useGameDataStore();
    const { goTo } = useAppNavigator();

    const getFriendAndGameRequests = async () => {
        try {
            const response = await axios.get("/api/notifications?types=friend,game");
            const data = response.data;
            setFriendRequests(data);
            console.log("Successfully get friend and game requests");
            return;
        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
        };
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await axios.post(`/api/notifications/send/friend-request/${receiverId}`);
            const data = response.data;
            if (!data.notification) {
                toast.error(data.message);
                return;
            }
            toast.success(data.message);
            socket.emit("friend-request", { receiverId, notification: data.notification });
            return;

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
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

            toast.success(data?.message);

            return data;

        } catch (error) {
            const message = error.response?.data?.message
            console.error(message || "Something went wrong");
            toast.error(message || "Something went wrong");
        }
    };

    const acceptFriendRequest = async (requestId) => {

        try {
            const response = await axios.post(`/api/notifications/send/accept-request/${requestId}`);
            const data = response.data;

            setFriend(data?.sender);
            socket?.emit("accept-friend-request", { requestId, notification: data?.notification, sender: data?.user });
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
            
            return;

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    const declineFriendRequest = async (requestId) => {

        try {
            const response = await fetch(`/api/notifications/send/deny-request/${requestId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (!response.ok) return toast.error(data?.message);

            // optional
            console.log(`Friend Request Declined of ${data?.from}`);
            toast.success(`Friend Request Declined of ${data?.from}`);

        } catch (error) {
            toast.error(error.message);
        }
    };

    const declineGameRequest = async (requestId) => {

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
            toast.error(error.message);
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

    return {
        sendFriendRequest, acceptFriendRequest, declineFriendRequest,
        sendGameRequest, acceptGameRequest, declineGameRequest,
        friendRequestListener, getFriendAndGameRequests
    };
};

export default useRequest;