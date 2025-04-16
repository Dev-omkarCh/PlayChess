import toast from "react-hot-toast";
import { useMainSocket } from "../store/socketIoStore";
import useFriendStore from "../store/useFriendStore";
import useSocketStore from "../store/socketStore";
import { useRoom } from "./useRoom";
import { useResultStore } from "../store/resultStore";
import useAuth from "../store/useAuth";
import useChessStore from "../store/chessStore";

export const useFriend = () => {

    const { socket } = useMainSocket();
    const { friendRequests, setFriendRequests, setGameRequests, friends, setFriends, setGameId, setUser, setHistory, setUsers,setFriend, setGameStatus  } = useFriendStore();
    const { isGameStarted, startGameListener } = useSocketStore();
    const { joinGame } = useRoom();
    const { authUser } = useAuth();
    const { opponentId, setOpponentId, you, setYou, opponent, setOpponent, result, type, matchMaked } = useResultStore();
    const { notation } = useChessStore();
    const { playerColor, room } = useSocketStore();

    
    const saveGame = async (newRating, ratingCal) =>{
        
        const white = playerColor === "white" ? you._id : opponent._id;
        const black = playerColor === "black" ? you._id : opponent._id;
        const opponentColor = playerColor === "white" ? "black" : "white";
        
        const won = [];
        const moves = { white : [], black : []};
        const roomId = room;
        const maxTime = 0;
        const rating = { 
            white: { before: 0, after: 0 },
            black: { before: 0, after: 0 },
        }
        
        if(result === "win") won.push(playerColor);
        else if(result === "draw") { 
            won.push(playerColor);
            won.push(opponentColor);
        }

        if(playerColor === "white"){
            // notation
            moves.white.push(notation.you);
            moves.black.push(notation.opponent);
            // rating
            
            rating.white.before = you.elo;
            rating.black.before = opponent.elo;
            
            if(result === "draw") {
                rating.white.after = you.elo;
                rating.black.after = opponent.elo;
            }
            else{
                rating.white.after = newRating;
                rating.black.after = opponent.elo - Math.abs(ratingCal);
            }

            // if(newRating > opponent.elo) rating.black.after = opponent.elo - Math.abs(ratingCal);
            // else if(newRating < opponent.elo) rating.black.after = opponent.elo;
        }
        else if(playerColor === "black"){
            // notation
            moves.black.push(notation.you);
            moves.white.push(notation.opponent);
            
            // rating
            // before
            rating.black.before = you.elo;
            rating.white.before = opponent.elo;
            
            if(result === "draw") {
                rating.black.after = you.elo;
                rating.white.after = opponent.elo;
            }
            else{
                rating.black.after = newRating;
                rating.white.after = opponent.elo - Math.abs(ratingCal);
            }
            
            // for Black
            // if(newRating > opponent.elo) rating.white.after = opponent.elo - ratingCal;
            // else rating.white.after = opponent.elo;
        }

        const response = await fetch(`/api/users/game/save`, {
            method: "POST",
            body: JSON.stringify({white, black, won, moves, roomId, maxTime, rating, type}),
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

        if(data?.length !== 0) setFriendRequests(data);
        return data;
    }

    const getFriends = async () => {
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
        const response = await fetch(`/api/users/send/friend-request/${receiverId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if(!data.notification){
            toast.error(data.msg);
            return;
        }
        toast.success(data.msg);
        socket.emit("friend-request", { receiverId, notification: data.notification });
        return data;
    };

    const markAllMessagesAsRead = async() =>{
        const data = await fetch(`/api/users/notifications/read`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
        const res = await data.json();
        toast.success(res.msg);
    }

    const acceptFriendRequest = async (requestId) => {
        const data = await fetch(`/api/users/send/accept-request/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);
        setFriend(response?.sender);
        socket.emit("accept-friend-request", { requestId, notification: response.notification, sender : response.user });
    };

    const declineFriendRequest = async (requestId) => {
        const data = await fetch(`/api/users/send/deny-request/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);
    };

    const sendGameRequest = async (receiverId) => {
        const response = await fetch(`/api/users/game/send/${receiverId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        toast.success(data.msg);
        setGameId(data?.notification.gameId);
        joinGame(data?.notification.gameId);
        socket.emit("game-request", { id : receiverId, notification:  data.notification});

        return data;
    };

    const acceptGameRequest = async (requestId) => {
        const data = await fetch(`/api/users/game/accept/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);

        setGameId(response?.notification.gameId);
        joinGame(response?.notification.gameId);
        setOpponentId(requestId);
        
        socket.emit("accept-game-request", { id : requestId, notification:  response.notification, userId : authUser._id});
    };

    const getAllUsres = async () => {
        const data = await fetch(`/api/users/`, {
            method: "GET",
        });
        const response = await data.json();
        setUsers(response.users);
    };

    const getBothPlayersDetails = async () =>{
        // if(matchMaked){
        //     return;
        // }
        const response = await fetch(`/api/users/game/players/details/${opponentId}`, {
            method: "GET",
        });
        const data = await response.json();
        if(!data.you && !data.opponent){
            toast.error("Can't get data of both Players");
            return; 
        }
        setYou(data.you);
        setOpponent(data.opponent);
        
    }

    const declineGameRequest = async (requestId) => {
        const data = await fetch(`/api/users/game/decline/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);
    };

    const initSocketListeners = () => {
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
        if(!response) return response;
        setHistory(response.gameHistory);
        setUser(response.user);
    };

    const updateProfile = async (username, email, oldPassword, newPassword) => {
        const data = await fetch(`/api/users/edit/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body : JSON.stringify({ username, email, oldPassword, newPassword }),
            
        });
        const response = await data.json();
    };

    const markMessageAsRead = async(id) =>{
        const data = await fetch(`/api/users/notification/read/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        const res = await data.json();
        toast.success(res.msg);
    }

    const checkIfGameIsReloaded = async(roomId, playerColor)=>{
        const data = await fetch(`/api/users/game/check/`, {
            method: "GET",
        });
        const res = await data.json();
        console.log("data :", res.gameStatus);
        if(res.gameStatus){
            localStorage.setItem("gameStatus", JSON.stringify(res.gameStatus));
            // setGameStatus(res.gameStatus);
            toast.success(res.msg);
            return;
        }
        toast.success(res.msg);
        return;
    }

    return { initSocketListeners, 
        getFriendRequests, 
        getFriends, 
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
    }
}