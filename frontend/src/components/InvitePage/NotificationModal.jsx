import { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import NotificationCard from "./Notification.jsx";
import useRequest from "@/hooks/useRequest.js";

const NotificationModal = ({ isOpen, onClose, notifications }) => {

  const modalRef = useRef(null);
  const { friendRequestListener } = useRequest();

  useEffect(() => {

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      };
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // friendRequestListener();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className=" NotificationDailog fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={modalRef} className={`
        Modal
        bg-secondary sm:w-fit w-[95%] p-4 rounded-lg 
        shadow-lg relative animate-slide-in border border-sectionBorder`
      }>

        {/* Close button */}
        <button
          className="absolute top-2 right-2 text-white hover:text-red-500 transition"
          onClick={onClose}>
          <IoClose className="text-xl font-extrabold" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-bold text-white mb-4 pb-3 border-b-2 w-full border-b-[#3f3c38]">
          Notifications
        </h2>

        {/* Notification messages */}
        <div className="space-y-2 max-h-60 w-fit overflow-y-auto dark-scrollbar pr-2 dark-scrollbar">
          {notifications.length === 0 ?
            <p className="text-gray-400">No Notification</p> :
            (
              notifications.map((message) => (
                <NotificationCard
                  notification={message}
                  key={message._id}
                />
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;