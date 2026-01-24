import toast from "react-hot-toast";
import useFriendStore from "../store/useFriendStore";
import useSocketStore from "../store/socketStore";
import { useRoom } from "./useRoom";
import { useResultStore } from "../store/resultStore";
import useChessStore from "../store/chessStore";
import useAdmin from "../store/useAdmin";
import { useSocketContext } from "@/context/SocketContext";
import axios from "axios";
import useAuthStore from "@/store/authStore";

export const useFriend = () => {

    const socket = useSocketContext();
    const { friendRequests, setFriendRequests, setGameRequests, friends, setFriends, setGameId, setUser, setHistory, setUsers, setFriend, setGameStatus } = useFriendStore();
    const { isGameStarted, startGameListener } = useSocketStore();
    const { joinGame } = useRoom();
    const { authUser, setAuthUser } = useAuthStore();
    const { opponentId, setOpponentId, you, setYou, opponent, setOpponent, result, type, matchMaked } = useResultStore();
    const { notation } = useChessStore();
    const { setIsAdmin } = useAdmin();
    const { playerColor, setPlayerColor } = useSocketStore();
    const { room } = useSocketStore();


    const saveGame = async (newRating, ratingCal) => {

        const white = playerColor === "white" ? you._id : opponent._id;
        const black = playerColor === "black" ? you._id : opponent._id;
        const opponentColor = playerColor === "white" ? "black" : "white";

        const won = [];
        const moves = { white: [], black: [] };
        const roomId = room;
        const maxTime = 0;
        const rating = {
            white: { before: 0, after: 0 },
            black: { before: 0, after: 0 },
        }

        if (result === "win") won.push(playerColor);
        else if (result === "draw") {
            won.push(playerColor);
            won.push(opponentColor);
        }

        if (playerColor === "white") {
            // notation
            moves.white.push(notation.you);
            moves.black.push(notation.opponent);
            // rating

            rating.white.before = you.elo;
            rating.black.before = opponent.elo;

            if (result === "draw") {
                rating.white.after = you.elo;
                rating.black.after = opponent.elo;
            }
            else {
                rating.white.after = newRating;
                rating.black.after = opponent.elo - Math.abs(ratingCal);
            }

            // if(newRating > opponent.elo) rating.black.after = opponent.elo - Math.abs(ratingCal);
            // else if(newRating < opponent.elo) rating.black.after = opponent.elo;
        }
        else if (playerColor === "black") {
            // notation
            moves.black.push(notation.you);
            moves.white.push(notation.opponent);

            // rating
            // before
            rating.black.before = you.elo;
            rating.white.before = opponent.elo;

            if (result === "draw") {
                rating.black.after = you.elo;
                rating.white.after = opponent.elo;
            }
            else {
                rating.black.after = newRating;
                rating.white.after = opponent.elo - Math.abs(ratingCal);
            }

            // for Black
            // if(newRating > opponent.elo) rating.white.after = opponent.elo - ratingCal;
            // else rating.white.after = opponent.elo;
        }

        const response = await fetch(`/api/users/game/save`, {
            method: "POST",
            body: JSON.stringify({ white, black, won, moves, roomId, maxTime, rating, type }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        toast.success(data.msg);
        return data;
    }

    const getFriendRequests = async () => {
        const response = await fetch("/api/users/requests", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log()
        setFriendRequests(data);
        return data;
    };

    const getGameRequests = async () => {
        const response = await fetch("/api/users/game/get", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setGameId(data?.gameId);

        if (data?.length !== 0) setFriendRequests(data);
        return data;
    }

    const getAllFriendsList = async () => {
        const response = await fetch("/api/users/friends", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.status === 500) {
            toast.error("Internet Connection Error")
            return
        }
        const data = await response.json();
        setFriends(data);
    };

    const sendFriendRequest = async (receiverId) => {
        try {
            const response = await axios.post(`/api/users/send/friend-request/${receiverId}`);
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
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    const markAllMessagesAsRead = async () => {
        const data = await fetch(`/api/users/notifications/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res = await data.json();
        toast.success(res.msg);
    }

    // optimized

    const declineFriendRequest = async (requestId) => {

        try {
            const response = await fetch(`/api/users/send/deny-request/${requestId}`, {
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
            const response = await fetch(`/api/users/game/decline/${requestId}`, {
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

    const sendGameRequest = async (receiverId) => {
        try {
            const response = await axios.post(`/api/users/game/send/${receiverId}`);

            const data = response.data;

            setGameId(data?.notification.gameId);
            joinGame(data?.notification.gameId);

            socket.emit("game-request", { id: receiverId, notification: data.notification });
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
            const response = await axios.post(`/api/users/send/accept-request/${requestId}`);
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
            const response = await axios.post(`/api/users/game/accept/${requestId}`);
            const data = response.data;
            toast.success(data?.message);

            setGameId(data?.notification.gameId);
            joinGame(data?.notification.gameId);
            setOpponentId(requestId);

            socket.emit("accept-game-request", { 
                id: requestId, 
                notification: data.notification, 
                userId: authUser._id 
            });
            return;

        } catch (error) {
            console.error(error.response?.data?.message || "Something went wrong");
            toast.error(error.response?.data?.message || "Something went wrong");
            return;
        }
    };

    const getAllUsres = async () => {
        const data = await fetch(`/api/users/`, {
            method: "GET",
        });
        const response = await data.json();
        setUsers(response.users);
    };

    const getBothPlayersDetails = async () => {
        const response = await fetch(`/api/users/game/players/details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: opponentId }),

        });
        const data = await response.json();
        if (!data.you && !data.opponent) {
            toast.error("Can't get data of both Players");
            return;
        }
        setYou(data?.you);
        setOpponent(data?.opponent);

    };



    const friendRequestListener = () => {
        if (!socket) return;
        socket.on("friendRequest", (data) => {
            set((state) => ({ friendRequests: [...state.friendRequests, data] }));
        });

        socket.on("friendRequestAccepted", (data) => {
            set((state) => ({ friends: [...state.friends, data] }));
        });
    }

    const getProfileDetails = async () => {
        const data = await fetch(`/api/users/profile`, {
            method: "GET",
        });
        const response = await data.json();
        console.log(response)
        if (!response) return response;
        setHistory(response.gameHistory);
        setUser(response.user);
    };

    const updateProfile = async (username, email, oldPassword, newPassword) => {
        const data = await fetch(`/api/users/edit/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, oldPassword, newPassword }),

        });
        const response = await data.json();
    };

    const markMessageAsRead = async (id) => {
        const data = await fetch(`/api/users/notification/read/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const res = await data.json();
        toast.success(res.msg);
    }

    const checkIfGameIsReloaded = async (roomId, playerColor) => {
        const data = await fetch(`/api/users/game/check/`, {
            method: "GET",
        });
        const res = await data.json();
        console.log("data :", res.gameStatus);
        if (res.gameStatus) {
            localStorage.setItem("gameStatus", JSON.stringify(res.gameStatus));
            // setGameStatus(res.gameStatus);
            toast.success(res.msg);
            return;
        }
        toast.success(res.msg);
        return;
    }

    const checkIfIsAdmin = async () => {
        try {
            const data = await fetch(`/api/users/admin`, {
                method: "GET",
            });
            const res = await data.json();
            setIsAdmin(res.isAdmin);
            return;
        } catch (error) {
            console.error("Something went wrong")
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

    const getBothPlayersDetail = async (id) => {
        try {
            const response = await axios.get(`/api/game/players/${id}`);
            const data = response.data;
            
            setAuthUser(data?.game?.you);
            setOpponent(data?.game?.opponent);

        } catch (error) {
            console.log("Error in getBothPlayersDetail : ",error);
        }
    };

    return {
        friendRequestListener,
        getFriendRequests,
        getAllFriendsList,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        getGameRequests,
        sendGameRequest,
        acceptGameRequest,
        declineGameRequest,
        saveGame,
        getBothPlayersDetails,
        getProfileDetails,
        updateProfile,
        getAllUsres,
        markAllMessagesAsRead,
        markMessageAsRead,
        checkIfGameIsReloaded,
        checkIfIsAdmin,
        removeFriend,
        getBothPlayersDetail,
    }
}