import { io } from "socket.io-client";
import useAuth from "../store/useAuth";
import { useMainSocket } from "../store/socketIoStore";
import { useOnlineStore } from "../store/onlineStore";
import useFriendStore from "../store/useFriendStore";
import { useEffect } from "react";
import { showCustomToast } from "../utils/CustomToast";
import useChessStore from "../store/chessStore";
import { useResultStore } from "../store/resultStore";
import useSocketStore from "./useRoom";

const useSocket = () => {

    const { authUser } = useAuth();
    const { socket, setSocket } = useMainSocket();
    const { onlineUsers, setOnlineUsers }  = useOnlineStore();
    const { setFriendRequests, friends, setFriends, setFriend, setFriendRequest, setRequest } = useFriendStore();
    const { setRoom } = useSocketStore();
    const { setOpponentId } = useResultStore();


    useEffect(()=>{
        if( authUser ){
            const socket = io("http://localhost:4000", {
                query : {
                    userId : authUser._id
                }
            });

            setSocket(socket);

            socket.on("online_users",(users)=>{
                setOnlineUsers(users);
            });

            socket.on("reloaded",(room)=>{
                console.log("got Room Id",room);
            })

            socket.on("hasfriendRequest",(data)=>{
                setFriendRequest(data);
                console.log(friends);
            });

            socket.on("hasAcceptRequest",({ notification, sender })=>{
                // newNotification
                console.log("notification: ",notification,", sender: ", sender);
                if(notification && sender){
                    setFriend(sender);
                }
                setFriendRequests(notification);
                
            });

            socket.on("hasAccepted",({ newNotification, userId })=>{
                setOpponentId(userId);
                setFriendRequests(newNotification);
            });

            socket.on("hasGameRequest",(data)=>{
                setRequest(data);
                setFriendRequests(data);
            });

            socket.on("new-accept-request",(data)=>{
                console.log("Stage 4 : In new-accept-request",data);
                setFriendRequests(data);
                playSound(messageSound);
            })

            return () => socket.close();
        }
        else{
            if(socket){
                socket.close()
                setSocket(null);
            }
        }
    },[authUser]);
    return {socket, setSocket} ;
}

export default useSocket;

