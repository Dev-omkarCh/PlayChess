import useFriendStore from "@/store/useFriendStore.js";
import { formatDateTime } from "../../utils/formatDate.js";
import Button from "../Button.jsx";

import { FiCheck } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useOnlineStore } from "@/store/onlineStore.js";
import useRequest from "@/hooks/useRequest.js";

const NotificationCard = ({ notification }) => {

    const { friendRequests, setFriendRequests } = useFriendStore();
    const { onlineUsers } = useOnlineStore();
    const {
        acceptFriendRequest, declineFriendRequest,
        acceptGameRequest, declineGameRequest
    } = useRequest();

    const handleAccept = (request) => {

        // TODO: Fix this db conflicts
        const fromId = request.from._id ? request.from._id : request.from;

        if (!fromId) return toast.error("Can't Accept Request, Something went wrong!");
        const isOnline = onlineUsers.includes(fromId);

        // Handle friend request acceptance
        // no need to have user(from) to be online to accept friend request
        if (request?.type === "friend-request") {

            acceptFriendRequest(fromId);
            setFriendRequests(friendRequests.filter((req) => req._id !== notification._id));
            console.log(`Friend request accepted from ${fromId}`);
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
        const fromId = request.from._id ? request.from._id : request.from;

        if (request.type === "game-request") {
            declineGameRequest(fromId);
        }
        else {
            declineFriendRequest(fromId);
        };

        setFriendRequests(
            friendRequests?.filter((req) => req._id !== notification._id)
        );
    };

    return (
        <div
            key={notification?._id}
            className={`p-3 rounded-lg cursor-pointer w-fit transition-all gap-5 duration-300 flex justify-between items-center border-l-4 
                ${notification?.isRead ? "border-transparent bg-gray-700" : "border-blue-500 bg-gray-700"}`}
        >
            {/* Message Content & buttons */}
            <p className="text-gray-300 capitalize">{notification?.message}</p>
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
