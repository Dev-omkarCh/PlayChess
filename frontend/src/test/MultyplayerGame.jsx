import { useEffect } from 'react';
import useChessStore from '../hooks/useChessStore';
import { useMainSocket } from '../store/socketIoStore';
import useSettingStore from '../store/settingStore';

import LeftBoardSection from '../pages/MutiplayerGame/LeftBoardSection';
import RightMovesSection from '../pages/MutiplayerGame/RightMovesSection';
import ResultModel from '../components/chess/ResultModel';
import useSocketStore from '../store/socketStore';

export default function MultiplayerGame() {

  const { listenForMoves, gameOver} = useChessStore();
  const { getSettings } = useSettingStore();
  const { socket } = useMainSocket();

  //* Expiremental

  useEffect(() => {
    if (socket) {
        getSettings();
    }
  },[socket]);

  listenForMoves();

  return (
    <>
      { gameOver && <ResultModel /> }
      <div className="min-h-screen flex flex-col bg-primary text-white">
        <div className="flex flex-col md:flex-row flex-1">
            <LeftBoardSection />
            <RightMovesSection />
        </div>
      </div>
    </>
  );
}

