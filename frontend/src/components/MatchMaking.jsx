import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMainSocket } from '../store/socketIoStore';
// import { useMatchmaking } from '../hooks/useMatchMaking';
import Button from './Button';
import { useMatchmaking } from '../hooks/useMatchMaking';
import useSocketStore from '../store/socketStore';
import useAuth from '../store/useAuth';

export default function Matchmaking() {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
    const [searchText, setSearchText] = useState('Finding Match...');
    const { startGameListener  } = useSocketStore();
    // const navigate = useNavigate();
    const { joinQueue } = useMatchmaking();
    const { socket } = useMainSocket();
    const navigate = useNavigate();
    const { authUser } = useAuth();
    
    // Dynamic Text Changes

    socket?.on("startRandomGame",(roomId)=>{
        navigate("/multiplayer");
    })

    const handleStartMatchMaking = () => {

        joinQueue();

        const texts = [
            'Finding Match...',
            'Almost There...',
            'Searching for Opponent...',
            'Preparing Board...',
            'Waiting for Player...'
        ];
        let index = 0;
        const textInterval = setInterval(() => {
            setSearchText(texts[index]);
            index = (index + 1) % texts.length;
        }, 3000);

        // Countdown Timer
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        // Auto Redirect After 5 Minutes
        const timeout = setTimeout(() => {
            navigate('/menu');
        }, 300000);

        return () => {
            clearInterval(timer);
            clearInterval(textInterval);
            clearTimeout(timeout);
        };
    }

    

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex h-screen items-center justify-center bg-[#1a1a2e]">
            <div className="bg-[#1b1b3a] p-6 rounded-xl shadow-2xl border-4 border-purple-600 w-[600px] flex flex-col gap-5 relative overflow-hidden">

                {/* Animated Glow Effect */}
                <div className="absolute -inset-2 bg-purple-600 opacity-10 blur-2xl rounded-xl"></div>

                {/* Header */}
                <h1 className="text-white text-2xl font-bold text-center">
                    🔥 Random Matchmaking
                </h1>

                {/* Player & Opponent Card */}
                <div className="flex items-center justify-between">
                    
                    {/* Your Profile */}
                    <div className="flex flex-col items-center gap-2">
                        <img 
                            src={authUser?.profileImg}
                            alt="You"
                            className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-lg"
                        />
                        <h2 className="text-white font-semibold">You</h2>
                        <p className="text-gray-400 text-sm">{authUser?.elo}</p>
                    </div>

                    {/* Versus */}
                    <div className="text-purple-400 text-3xl font-bold">
                        VS
                    </div>

                    {/* Opponent Profile */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-gray-700 rounded-full border-4 border-gray-600 animate-pulse">
                            {/* Placeholder Opponent */}
                        </div>
                        <h2 className="text-gray-500 font-semibold">
                            Finding...
                        </h2>
                        <p className="text-gray-500 text-sm">Elo: ???</p>
                    </div>
                </div>

                {/* Searching Text */}
                <p className="text-purple-300 text-center text-lg mt-4 animate-fade-in">
                    {searchText}
                </p>

                {/* Countdown Timer */}
                <div className="text-white text-center text-4xl font-bold mt-2 animate-bounce">
                    {formatTime(timeLeft)}
                </div>

                {/* Dots Animation */}
                <Button text={"Start"} color='green' handleOnClick={handleStartMatchMaking} />

                {/* Footer */}
                <p className="text-gray-500 text-xs text-center mt-5">
                    Auto-returning to menu in {formatTime(timeLeft)}
                </p>
            </div>
        </div>
    );
}
