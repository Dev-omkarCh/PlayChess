import toast from "react-hot-toast";
import { create } from "zustand";

const useFriendStore = create((set) => ({

    request: null,
    setRequest: (request) => set({ request }),
    
    friends: [],
    setFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
    
    friendRequests: [],
    setFriendRequests: (requests, isOne=false) => set((state)=>{
        // friend -> {} -> { ...requests }
        // game -> [] -> ...requests
        if(isOne){
            if(requests?.from){
                return { friendRequests : [...state.friendRequests, { ...requests }] }
            }
            return { friendRequests : [...state.friendRequests, ...requests ] }
        } 
        return { friendRequests : requests}
    }),

    // setFriendRequest: (request) => set((state) => ({ friendRequests: [...state.friendRequests, request] })),

    gameRequests : [],
    users : [],

    gameStatus : null,
    setGameStatus : ( gameStatus ) => set({ gameStatus }),

    setUsers : ( users ) => set({ users }),
    gameId : "",
    user : null,
    setUser : (user) => set({ user }),

    history : [],
    setHistory : (history) => set({ history }),

    saveGame : async (room, white, black,notation,newResult,beforeElo, afterElo) =>{
        
        const response = await fetch(`/api/users/save`, {
            method: "POST",
            body: JSON.stringify({room, white, black, moves : notation, result : newResult, beforeElo, afterElo}),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        toast.success(data.msg);
        return data;
    },

    opponent : {},
    setOpponent : (opponent) => set({ opponent : opponent }),

    setGameId : (gameId) => set({ gameId : gameId }),

    setFriends: (friends) => set({ friends }),
    // setFriends: (friends) => set({ friends }),

    // setFriendRequests: (requests) => set((state) => ({ friendRequests: [...state.friendRequests, requests] })),
    
    setGameRequests: (requests) => set({ gameRequests: requests }),
    // setGameRequests: (requests) => set((state) => ({ gameRequests: [...state.gameRequests, requests] })),

}));

export default useFriendStore;