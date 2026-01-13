import React, {useEffect, useRef, useState} from "react";

import Button from "../Button.jsx";
import { formatDateTime } from "../../utils/formatDate";
import useFriendStore from "../../store/useFriendStore.js";

import { IoClose } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { useOnlineStore } from "../../store/onlineStore.js";
import toast from "react-hot-toast";
import { useResponsiveStore } from "../../store/responsiveStore.js";
import useRequest from "@/hooks/useRequest.js";

const InboxModal = ({ isOpen, onClose ,sortByRequest }) => {

  /*
  TODO: Functionality to be added
  1. add typography for username and message.
  2. when user accepts or declines a request, the previous request of type : friend-request should be marked as read. (Verify)
  3. we create a new notificate of type : accepted-friend-request or declined-friend-request 
  4. after accepting or declining a request, the request should be removed from the list. ✅
     and store it in sender's inbox(who send the friend request) and inbox only has these two types of messages [..>]. ✅
  5. sort notification based on inbox and requests ✅
  */
  
  // changes
  const [messages, setMessages] = useState([]);
  const { friendRequests, setFriendRequests } = useFriendStore();
  const { initSocketListeners, acceptFriendRequest, declineFriendRequest, acceptGameRequest, declineGameRequest } = useRequest();
  const {onlineUsers} = useOnlineStore();
  const { width, setWidth } = useResponsiveStore();
  const { WIDTH } = useResponsiveStore();
  
  useEffect(() => {
    initSocketListeners();
  }, []);
  
  
  const handleAccept = (request) => {
    const id = request.from._id ? request.from._id : request.from;
    const isOnline = onlineUsers.includes(id);
    
    if(request.type === "friend-request"){
      acceptFriendRequest(id);
      setFriendRequests(sortByRequest.filter((req) => req._id !== request._id))
    }
    
    if(isOnline){
      if(request.type === "game-request"){
        acceptGameRequest(id);
      }
    }
    else{
      toast.success(`${request?.username} went offline`)
    }
  }

  const handleDecline = (request) => {
    if(request.type === "game-request"){
      declineGameRequest(request.from._id);
    }
    else{
      declineFriendRequest(request.from._id);
    }

     // changed oneLiner
     setFriendRequests(friendRequests.filter((req) => req.from._id !== request.from._id));
  }

  // end

  const modalRef = useRef(null);

  const markAllAsRead = () => setMessages(messages.map(msg => ({ ...msg, read: true })));
  const deleteAll = () => setMessages([]);
  const markAsRead = (id) => setMessages(messages.map(msg => msg.id === id ? { ...msg, read: true } : msg));

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  // changes
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div 
        ref={modalRef} 
        className={`bg-secondary ${width < WIDTH && isOpen ? "w-[90%]" : ""} min-w-[30%] p-4 rounded-lg shadow-lg relative animate-slide-in border border-sectionBorder`}
      >
        <button className="absolute top-2 right-2 text-white hover:text-red-500 transition" onClick={onClose}> <IoClose className="text-xl font-extrabold" /></button>
        <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b-2 border-b-[#3f3c38]">Inbox</h2>
        <div className="space-y-2 max-h-60 overflow-y-auto dark-scrollbar pr-2 dark-scrollbar">
          {sortByRequest.length === 0 ? (
            <p className="text-gray-400">No messages</p>
          ) : (
            sortByRequest.map((msg) => (
              <div
                key={msg._id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center border-l-4 ${
                  msg.isRead ? "border-transparent bg-gray-700" : "border-blue-500 bg-gray-700"
                }`}
                onClick={() => markAsRead(msg.id)}
              >
                <div className="flex gap-2">
                  <p className="text-gray-300 capitalize">{msg.message}</p>
                  <p className="text-gray-300"><Button color={"red"} className={"mt-0"} handleOnClick={()=>{ handleDecline(msg)}} text={<IoMdClose />}/></p>
                  <p className="text-gray-300"><Button color={"green"} className={"mt-0"} handleOnClick={()=>{ handleAccept(msg)}} text={<FiCheck />}/></p>
                </div>
                <p className="text-gray-400 text-sm italic">{formatDateTime(msg.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      
      </div>
    </div>
  );
};
// end

export default InboxModal;