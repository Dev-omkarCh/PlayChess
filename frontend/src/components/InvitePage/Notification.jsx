import useFriendStore from "@/store/useFriendStore.js";
import { formatDateTime } from "../../utils/formatDate.js";
import Button from "../Button.jsx";

import { FiCheck } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useOnlineStore } from "@/store/onlineStore.js";
import useRequest from "@/hooks/useRequest.js";
import { notificationStore } from "@/store/notificationStore.js";

const NotificationCard = ({ notification, onClose }) => {

    const { friendRequests, setFriendRequests } = useFriendStore();
    const { onlineUsers } = useOnlineStore();
    const {
        acceptFriendRequest, declineFriendRequest,
        acceptGameRequest, declineGameRequest
    } = useRequest();
    const { notifications, setNotifications } = notificationStore();

    const handleAccept = (request) => {

        // request.from OR request.hostId

        // TODO: Fix this db conflicts
        const fromId = request?.from?._id ? request.from._id : request.hostId;

        if (!fromId) return toast.error("Can't Accept Request, Something went wrong!");
        const isOnline = onlineUsers.includes(fromId);

        // Handle friend request acceptance
        // no need to have user(from) to be online to accept friend request
        if (request?.type === "send") {

            acceptFriendRequest(fromId);
            setNotifications(friendRequests.filter((req) => req._id !== notification._id));
            console.log(`Friend request accepted from ${fromId}`);
            onClose();
            return;
        };

        // Handle game request acceptance
        // Needs the user(from) to be online to accept Game request
        if (isOnline) {
            if (request?.type === "game-request") {

                // Accepts Game Request and Sends User into game room(Where there is one player already joined?)
                acceptGameRequest(fromId);
                return;
            };
        };

        return toast.success(`Can't Start, ${fromId} went offline`);
    };

    const handleDecline = (request) => {

        // TODO: DB Conflicts
        const fromId = request.from._id ? request.from._id : request.hostId;

        if (request?.type === "send") {
            declineFriendRequest(fromId);
        }
        else {
            declineGameRequest(fromId);
        };
        
        const filteredNotifications = notifications?.filter((req) => req._id !== request._id);
        setNotifications(filteredNotifications);
    };

    const message = notification?.type === "send" ? 
    `${notification?.from?.username} wants to be friends` : 
    `${notification?.host?.username} has challenged you to a game`;

    return (
        <div
            key={notification?._id}
            className={`p-3 rounded-lg cursor-pointer w-fit transition-all gap-5 duration-300 flex justify-between items-center border-l-4 
                ${notification?.isRead ? "border-transparent bg-gray-700" : "border-blue-500 bg-gray-700"}`}
        >
            {/* Message Content & buttons */}
            <p className="text-gray-300 capitalize">{message}</p>
            <div className="flex gap-2">

                {/* Accept Request Button */}
                <p className="text-gray-300">
                    <Button
                        color={"red"} className={"mt-0"}
                        handleOnClick={() => handleDecline(notification)}
                        text={<IoMdClose />}
                    />
                </p>

                {/* Decline Request Button */}
                <p className="text-gray-300">
                    <Button color={"green"} className={"mt-0"}
                        handleOnClick={() => handleAccept(notification)}
                        text={<FiCheck />}
                    />
                </p>
            </div>

            {/* Date Indicator */}
            <p className="text-gray-400 text-sm italic">{formatDateTime(notification?.createdAt)}</p>
        </div>
    );
};

export default NotificationCard;
