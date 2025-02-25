import { create } from "zustand";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { getFriends } from "../../../backend/controllers/user.controllers";
import { Navigate, useNavigate } from "react-router-dom";
import Login from "../pages/Login";
import { useSocket } from "../hooks/useSocket";

// TODO : socketStore already consists of socket connection, so we can use that instead of creating a new one here, if Anything went wrong
// const socket = io("http://localhost:4000");
const socket = useSocket();

const useFriendStore = create((set, get) => ({

    // changes
    friendRequests: [],
    friends: [],
    setFriendRequests: (requests) => set({ friendRequests: requests }),

    getFriendRequests: async () => {
        const response = await fetch("/api/users/requests", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        set({ friendRequests: data });
        return data;
    },

    getFriends: async () => {
        const response = await fetch("/api/users/friends", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if(response.status === 500){
            toast.error("Internet Connection Error")
            return
        }
        const data = await response.json();
        console.log("data", data);
        set({ friends: data });
        return data;
    },
    
    sendFriendRequest: async (receiverId) => {
        const response = await fetch(`/api/users/send/friend-request/${receiverId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        toast.success(data.msg);
        return data;
    },

    acceptFriendRequest: async (requestId) => {
        const data = await fetch(`/api/users/send/accept-request/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);
    },

    declineFriendRequest: async (requestId) => {
        const data = await fetch(`/api/users/send/deny-request/${requestId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const response = await data.json();
        toast.success(response.msg);
    },
    
    setFriends: (friends) => set({ friends }),

    // end


    initSocketListeners: () => {
        socket.on("friendRequest", (data) => {
            set((state) => ({ friendRequests: [...state.friendRequests, data] }));
        });

        socket.on("friendRequestAccepted", (data) => {
            set((state) => ({ friends: [...state.friends, data] }));
        });
    }
}));

export default useFriendStore;