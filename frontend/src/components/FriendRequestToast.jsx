import { useAppNavigator } from '@/hooks/useAppNavigator';
import { useFriend } from '@/hooks/useFriend';
import useRequest from '@/hooks/useRequest';
import { notificationStore } from '@/store/notificationStore';
import useFriendStore from '@/store/useFriendStore';
import React, { useEffect } from 'react';

const RequestToast = ({ data, onClose, duration = 10000, type }) => {

    const { goTo } = useAppNavigator();
    const { acceptFriendRequest } = useRequest();
    const { friendRequests, setFriendRequests } = useFriendStore();
    const sender = type === "FRIEND" ? data?.from : data?.host;
    const senderId = data?.status === "pending" ? data.hostId : data?.from?._id;
    const { notifications, setNotifications } = notificationStore();

    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    // Handle clicking the toast body to navigate
    const handleBodyClick = (e) => {
        // Prevent navigation if the user clicks the buttons specifically
        if (e.target.tagName !== 'BUTTON') {
            goTo('/friends/invite');
            onClose();
        }
    };

    const onAccept = () => {
        acceptFriendRequest(senderId || '');
        const filteredFriendRequest = notifications?.filter((req) => req._id !== data._id);
        setNotifications(filteredFriendRequest);
        onClose();
    };

    console.log(data, type);

    return (
        <div className="fixed top-5 right-5 z-[9999] animate-discord-slide">
            <div
                onClick={handleBodyClick}
                className="relative w-[320px] bg-[#35373c] text-[#dbdee1] rounded-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#35373c] transition-colors overflow-hidden border border-black/20"
            >
                {/* Discord-style Accent Bar (Animated Progress) */}
                <div
                    className="absolute top-0 left-0 h-[3px] bg-[#5865f2] shadow-[0_0_10px_#5865f2]"
                    style={{ animation: `shrink ${duration}ms linear forwards` }}
                />

                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Discord Avatar Style */}
                        <div className="relative flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-lg font-semibold overflow-hidden">
                                {sender?.profileImg ? (
                                    <img src={sender?.profileImg} alt="User" className="h-full w-full object-cover" />
                                ) : (
                                    sender?.username?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-[#23a55a] rounded-full border-[3px] border-[#313338]"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="text-white font-bold text-[15px] truncate cursor-pointer hover:underline">
                                    {sender?.username || "UnknownUser"}
                                </span>
                            </div>
                            <p className="text-[13px] text-[#b5bac1] mt-0.5">
                                Sent you a {type == "FRIEND" ? "Friend" : "Game"} request.
                            </p>
                        </div>
                    </div>

                    {/* Discord Action Buttons */}
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onAccept(); }}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-[14px] font-medium py-1.5 rounded-[3px] transition-colors"
                        >
                            {type === "GAME" ? "Start Game" : "Accept"}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="px-4 bg-red-500 hover:bg-red-600 text-white text-[14px] font-medium py-1.5 rounded-[3px] transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
            @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
            }
            .animate-discord-slide {
            animation: discordSlide 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
            }
            @keyframes discordSlide {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
            }
        `}</style>
        </div>
    );
};
export default RequestToast;