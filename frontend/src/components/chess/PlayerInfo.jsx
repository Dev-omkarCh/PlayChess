import useAuthStore from '@/store/authStore';
import { useResultStore } from '@/store/resultStore';
import useSocketStore from '@/store/socketStore';
import { formatMs } from '@/utils/formatTime';
import React from 'react';
import toast from 'react-hot-toast';

const PlayerInfo = ({ timer, isMe, turn }) => {
    const { authUser } = useAuthStore();
    const { opponent } = useResultStore();
    const { playerColor } = useSocketStore();
    console.log(opponent);

    const isMyturn = playerColor === turn

    // if (!authUser) return toast.error("Can't render PlayerInfo as `AuthUser` is null");
    // if(!opponent) return toast.error("Can't render PlayerInfo as `AuthUser` is null");

    return (
        <>
            <div className={`flex justify-between items-center p-2 bg-[#262421] rounded 
                ${isMyturn ? "ring-2 ring-[#81b64c]" : "bg-[#262421]"} `}>
                <div className="flex items-center gap-2">
                    {authUser?.profileImg ?
                        <img src={authUser.profileImg} className='w-8 h-8' /> :
                        <div className="w-8 h-8 bg-blue-600 rounded-sm" />
                    }
                    <span className="font-bold text-sm text-white">
                        {isMe ? "You" : opponent?.username || 'opponent'} 
                        ({isMe ? authUser?.elo : opponent?.elo || ' - '})
                    </span>
                </div>
                <div className="bg-white text-black px-2 py-1 font-mono text-xl rounded font-bold">{formatMs(timer)}</div>
            </div>
        </>
    );
};

export default PlayerInfo;;
