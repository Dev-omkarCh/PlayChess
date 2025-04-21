import React, { useEffect } from 'react'
import { calculateElo } from '../../utils/calculateElo';
import { getRandomColor } from '../../utils/randomColorGenerator';
import {} from "react-icons/io";
import Button from '../Button';
import { IoClose } from 'react-icons/io5';
import useChessStore from '../../store/chessStore';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../store/useAuth';
import useFriendStore from '../../store/useFriendStore';
import useSocketStore from '../../store/socketStore';
import { useFriend } from '../../hooks/useFriend';
import useSocket from '../../hooks/useSocket';
import { useMainSocket } from '../../store/socketIoStore';
import { useResultStore } from '../../store/resultStore';


const ResultModel = () => {

  const {authUser} = useAuth();
  // const { opponent } = useFriendStore();
  const { closeGameOverModal, setNotation } = useChessStore();
  const { joinGame, isGameStarted, startGameListener, gameOver, playerColor } = useSocketStore();
  const { room } = useSocketStore();
  const navigate = useNavigate();
  const {result, type, opponent, you} = useResultStore();
  const { saveGame } = useFriend();
  const { newRating, isRise, ratingCal } = calculateElo(you.elo,opponent.elo,result);
  const { socket } = useMainSocket();

  const clearGameData = () =>{
    closeGameOverModal();
    socket.emit("gameOver", room);
    localStorage.removeItem("roomId");
    localStorage.removeItem("playerColor");
    setNotation({you: [], opponent: []});
  }

  useEffect(()=>{
    console.log(result);
    if(result === "win" || (result === "draw" && playerColor === "white" )){
      saveGame(Math.round(newRating), ratingCal);
    }
  },[])

    const handleNewGame = () => {
      clearGameData();
      navigate("/menu");
    }

    const handleRematch = () => {
       clearGameData();
      navigate("/leaderboard");
    }

    const handleClose = () => {
      clearGameData();
      navigate("/menu");
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="absolute bg-gray-900 text-white w-96 rounded-2xl shadow-lg border border-gray-700">
            
            {/* Header */}
            <div className="bg-gray-800 text-white py-3 px-4 flex justify-center flex-col items-center rounded-t-2xl relative">
              <h2 className="text-2xl font-bold">You{isRise === 0.5 ? "r Match Ended" : " "+result}</h2>
              <div className="text-sm text-gray-300">by {type}</div>
              <button onClick={handleClose} className="absolute top-5 right-2">
                <IoClose size={24} className="cursor-pointer absolute right-2"/>
                </button>
            </div>
    
            {/* Player Section */}
            <div className="flex items-center justify-between px-6 py-4">
              {/* White Player */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 ${getRandomColor()} flex items-center justify-center text-2xl font-bold rounded-md`}>
                  {you?.username.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-gray-300">{you?.username}</p>
              </div>
    
              {/* Score */}
              <div className="text-2xl font-bold text-white">Vs</div>
    
              {/* Black Player */}
              <div className="flex flex-col items-center">
                <div className={`w-16 h-16 ${getRandomColor()} flex items-center text-2xl font-bold justify-center rounded-md`}>
                    {opponent?.username.charAt(0).toUpperCase()}
                </div>
                <p className="mt-2 text-gray-300">{opponent?.username}</p>
              </div>
            </div>
    
            {/* Bullet Rating & League */}
            <div className="text-center py-2 my-3">
              <p className="text-sm font-semibold text-gray-400">RATING</p>
              <p className="text-2xl font-bold">
                {newRating} 
                {isRise === 1 && <span className="text-green-500 text-lg px-3">+ {ratingCal}</span>}
                {isRise === 0 && <span className="text-red-500 text-lg px-3">{ratingCal}</span>}
              </p>
            </div>
    
            {/* Buttons */}
            <div className="px-4 pb-4 flex justify-center items-center flex-col gap-4">
              <Button color="green" text={"New Game"} className={" w-[84%]"} handleOnClick={ handleNewGame} />
              <Button color="gray" text={"View Stats"} className={"w-[84%]"} handleOnClick={handleRematch} />
            </div>
          </div>
        </div>
      );
}

export default ResultModel
