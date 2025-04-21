import { FaChess } from 'react-icons/fa';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { MdOutlineSettings } from 'react-icons/md';
import { HiMenu } from 'react-icons/hi';
import ChessBoard from '../components/chess/ChessBoard';
import { useEffect, useState } from 'react';
import useSocketStore from '../store/socketStore';
import useChessStore from '../store/chessStore';
import PromotionModal from '../components/chess/PromotionModal';
import useFriendStore from '../store/useFriendStore';
import useSocket from '../hooks/useSocket';
import { useMainSocket } from '../store/socketIoStore';
import MoveHistory from '../components/chess/MoveHistory';
import ResultModel from '../components/chess/ResultModel';
import DrawRequestModal from '../components/chess/DrawRequestModal';
import { useResultStore } from '../store/resultStore';
import { useFriend } from '../hooks/useFriend';
import PlayerProfile from '../components/chess/PlayerProfile';
import Button from '../components/Button';
import useSettingStore from '../store/settingStore';

export default function ChessGamePage() {

  const { joinGame, isGameStarted, startGameListener } = useSocketStore();
  const { listenForMoves, promotion } = useChessStore();
  const { gameStatus } = useFriendStore();
  const { gameId } = useFriendStore();
  const { gameOver, openGameOverModal, changeGameState } = useChessStore();
  const { room } = useSocketStore();
  const {setGameResult, you, opponent} = useResultStore();
  const { getBothPlayersDetails, checkIfGameIsReloaded } = useFriend();
  const { getSettings } = useSettingStore();

  const { socket } = useMainSocket();

  const handleResign = () => {
    
  }

  const handleDraw = () => {
    
  }

  useEffect(()=>{
    getSettings();
  },[])

  return (
    <>
      {gameOver && <ResultModel /> }
      <div className="min-h-screen flex flex-col bg-primary text-white">
      <div className="flex flex-col md:flex-row flex-1">

        <div className="w-full flex flex-col items-center justify-start p-2 relative bg-primary border-r border-sectionBorder">
          <div className='player-section w-full h-[10%] flex justify-start items-center'>
            <PlayerProfile username={opponent?.username} elo={opponent?.elo} />
          </div>
          <div className="aspect-square w-full sm:w-[400px] md:w-[500px] lg:w-[500px] max-w-[700px] flex-grow">
          {promotion && <PromotionModal />}
            <ChessBoard />
          </div>
          <div className='player-section w-full h-[10%] flex justify-end items-center'>
            <PlayerProfile username={you?.username} elo={you?.elo} you={true} />
          </div>
        </div>

        <div className="w-full md:w-1/4 bg-secondary flex-grow p-4 flex flex-col gap-4 md:h-screen">
          <div className='flex h-[100%] flex-col flex-grow'>
            <MoveHistory />
            <div className=" flex justify-center items-center gap-4 mt-4 flex-col mb-3">
              <div className='flex w-full items-center gap-3 justify-evenly'>
                <Button text={"Draw"} handleOnClick={handleDraw} color='purple'  />
                <Button text={"Resign"} handleOnClick={handleResign} color='red' />
              </div>
              <DrawRequestModal />
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}

