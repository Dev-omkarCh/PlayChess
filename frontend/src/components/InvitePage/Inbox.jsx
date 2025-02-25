import React, { useState, useEffect, useRef } from "react";
import { FaEnvelope } from "react-icons/fa";
import { formatDateTime } from "../../utils/formatDate";
import { IoClose } from "react-icons/io5";
import useFriendStore from "../../store/useFriendStore";
import toast from "react-hot-toast";

const InboxModal = ({ isOpen, onClose, messages, setMessages }) => {

  const modalRef = useRef(null);

  const markAllAsRead = () => setMessages(messages.map(msg => ({ ...msg, isRead: true })));
  const deleteAll = () => setMessages([]);
  const markAsRead = async(id) => {
     const data = await fetch(`/api/users/notification/read/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await data.json();
    setMessages(messages.map(msg => msg._id === id ? { ...msg, isRead: true } : msg));
  }


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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div ref={modalRef} className="bg-gray-800 w-96 p-4 rounded-lg shadow-lg relative animate-slide-in">
        <button className="absolute top-2 right-2 text-white hover:text-red-500 transition" onClick={onClose}><IoClose className="text-xl font-extrabold" /></button>
        <h2 className="text-lg font-bold text-white mb-4">Inbox</h2>
        <button className="text-white bg-gray-600 px-3 py-1 rounded mb-3 hover:bg-gray-700 transition" onClick={markAllAsRead}>
          ✓ Mark all as read
        </button>
        
        {/* Messages List with Dark-Themed Scrollbar */}
        <div className="space-y-2 max-h-60 overflow-y-auto dark-scrollbar pr-2">
          {messages.length === 0 ? (
            <p className="text-gray-400">No messages</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center border-l-4 ${
                  msg.isRead ? "border-transparent bg-gray-700" : "border-blue-500 bg-gray-500 hover:bg-gray-600"
                }`}
                onClick={() => markAsRead(msg._id)}
              >
                <div>
                  <p className="text-white font-bold">{msg.username}</p>
                  <p className="text-gray-300">{msg.message}</p>
                </div>
                <p className="text-gray-400 text-sm italic">{formatDateTime(msg.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        <button className="bg-red-600 text-white px-4 py-2 w-full mt-3 rounded hover:bg-red-700 transition" onClick={deleteAll}>
          Delete All
        </button>
      </div>
    </div>
  );
};

/* Floating Inbox Button */
const Inbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
        { id: 1, sender: "User1", text: "wants to be your friend", read: false, timestamp: "2023-11-29T10:15:00" },
        { id: 2, sender: "User2", text: "sent you a message", read: false, timestamp: "2025-02-10T14:30:00" },
        { id: 3, sender: "User3", text: "liked your post", read: true, timestamp: "2025-02-05T09:45:00" },
        { id: 4, sender: "User4", text: "commented on your photo", read: false, timestamp: "2024-10-20T18:00:00" },
        { id: 5, sender: "User5", text: "shared your story", read: true, timestamp: "2023-06-05T08:20:00" },
        { id: 6, sender: "User6", text: "mentioned you in a comment", read: false, timestamp: "2021-09-10T22:10:00" },
      ]);

  // changes
  const { friendRequests, setFriendRequests } = useFriendStore();
  const sortByRequest = friendRequests.filter((request) => request.type !== "friend-request").reverse();

  // end

  const unreadMessages = messages.filter((mess)=>{
    return !mess.read
  });

  return (
    <>
      {/* Floating Inbox Button */}
      <button 
        className="fixed bottom-6 right-6 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition"
        onClick={() => setIsOpen(true)}
      >
        <FaEnvelope size={24} />
        { sortByRequest.length !== 0 ? <span 
            className="absolute top-0 right-0 bg-red-500 w-5 h-5 font-bold rounded-full text-[10px] flex justify-center items-center">
              {sortByRequest.length}
          </span> :
          ""
        }
      </button>

      {/* Inbox Modal */}
      <InboxModal isOpen={isOpen} onClose={() => setIsOpen(false)} messages={sortByRequest} setMessages={setFriendRequests} />
    </>
  );
};

export default Inbox;