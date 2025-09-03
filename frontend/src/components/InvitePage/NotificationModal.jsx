import { useEffect, useRef } from "react";

import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useFriend } from "../../hooks/useFriend.js";

import useFriendStore from "../../store/useFriendStore.js";
import { useOnlineStore } from "../../store/onlineStore.js";
import { useResponsiveStore } from "../../store/responsiveStore.js";
import NotificationCard from "./Notification.jsx";


const NotificationModal = ({ isOpen, onClose }) => {

  /*
  TODO: Functionality to be added
  1. add typography for username and message.
  2. when user accepts or declines a request, the previous request of type : friend-request should be marked as read. (Verify)
  3. we create a new notificate of type : accepted-friend-request or declined-friend-request 
  4. after accepting or declining a request, the request should be removed from the list. ✅
  and store it in sender's inbox(who send the friend request) and inbox only has these two types of messages [..>]. ✅
  5. sort notification based on inbox and requests ✅
  */

  const modalRef = useRef(null);
  const { width } = useResponsiveStore();
  const { WIDTH } = useResponsiveStore();
  const { friendRequests, setFriendRequests } = useFriendStore();

  const notifications = friendRequests.filter((request) => request?.type === "friend-request" || request?.type === "game-request");

  const { friendRequestListener } = useFriend();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    friendRequestListener();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);


  if (!isOpen) return null;

  return (
    <div className=" NotificationDailog fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className={`
        Modal
        bg-secondary ${width < WIDTH && isOpen ? "w-[90%]" : ""} min-w-[50%] p-4 rounded-lg 
        shadow-lg relative animate-slide-in border border-sectionBorder`
      }>

        {/* Close button */}
        <button className="absolute top-2 right-2 text-white hover:text-red-500 transition" onClick={onClose}> 
          <IoClose className="text-xl font-extrabold" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b-2 border-b-[#3f3c38]">
          Notifications
        </h2>

        {/* Notification messages */}
        <div className="space-y-2 max-h-60 overflow-y-auto dark-scrollbar pr-2 dark-scrollbar">
          { notifications.length === 0 ? <p className="text-gray-400">No Notification</p> : (
            notifications.map((message) => (
              <NotificationCard notification={message} key={message._id} />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default NotificationModal;