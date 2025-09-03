import { useEffect } from 'react';
import useChessStore from '../../hooks/useChessStore';
import { useMainSocket } from '../../store/socketIoStore';
import useSettingStore from '../../store/settingStore';

import LeftBoardSection from './LeftBoardSection';
import RightMovesSection from './RightMovesSection';
import ResultModel from '../../components/chess/ResultModel';

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
      <div className="MultiplayerGame min-h-screen flex flex-col bg-primary text-white">
        <div className="flex flex-col md:flex-row flex-1">
            <LeftBoardSection />
            <RightMovesSection />
        </div>
      </div>
    </>
  );
}

// import { useEffect } from 'react';
// import useChessStore from '../store/chessStore';
// import { useMainSocket } from '../store/socketIoStore';
// import useSettingStore from '../store/settingStore';

// import LeftBoardSection from '../pages/MutiplayerGame/LeftBoardSection';
// import RightMovesSection from '../pages/MutiplayerGame/RightMovesSection';
// import ResultModel from '../Test/ResultModel';
// import useSocketStore from '../store/socketStore';
// import { useMatchmaking } from '../hooks/useMatchMaking';
// import WaitingScreen from '../components/WaitingScreen';

// export default function TestOnlineChess() {

//   const { listenForMoves, gameOver } = useChessStore();
//   const { getSettings } = useSettingStore();
//   const { socket } = useMainSocket();

//   const { joinQueue } = useMatchmaking();
//   const { room } = useSocketStore();
//   // const { authUser } = useAuth();
//   let getDataLoading = false;

//   //* Expiremental

//   useEffect(() => {
//     if (socket) {

//       // check is reload count is more than 2, then we can get the game state from localStorage/database
//       if(JSON.parse(localStorage.getItem("reload"))?.count >= 2){
//         getDataLoading = true;
//         if(localStorage.getItem("state")){

//           const state = JSON.parse(localStorage.getItem("state"));

//           const board = state?.board;
//           const turn = state?.turn;
//           const roomId = state?.roomId;
//           const playerColor = state?.playerColor;

//           console.log("Restored board state", board);
          
//           useChessStore.setState({ board, turn });
//           useSocketStore.setState({ playerColor, room : roomId });

//           socket?.emit("joinGameOnReload", roomId);

//         }
//       }
//       else{
        
//       }

//       getSettings();
//       joinQueue();
//     }

//     return () => {

//       // check if reload happened before?
//       if(localStorage.getItem("reload")){

//         // if yes, then increase the count
//         const reloadDetails = JSON.parse(localStorage.getItem("reload"));
        
//         reloadDetails.count += 1;
//         localStorage.setItem("reload", JSON.stringify(reloadDetails));
        
//         // reloadDetails.user = authUser?._id;
        
//       }
//       // if not, then we know its the inital load
//       else{
//         localStorage.setItem("reload", JSON.stringify({ count : 1}));
//       }
//     }

//   },[socket]);

//   listenForMoves();

//   if(getDataLoading){
//     return <div className='min-h-screen flex flex-col justify-center items-center bg-primary text-white '>
//       Loading...
//       <button className='bg-purple-500 hover:bg-purple-600 p-2 px-10 rounded-md my-3' 
//         onClick={()=>{ localStorage.removeItem("reload") }}>
//           Clear
//       </button>
//       For testing purpose only
//       (Please reload again after clicking)
//       </div>
//   }

//   if(!room){
//     return (
//       <div className='min-h-screen w-full flex flex-col bg-primary text-white'>
//         <WaitingScreen open  />
//       </div>
//     )
//   }

//   return (
//     <>
//       { gameOver && <ResultModel /> }
//       <div className="min-h-screen flex flex-col bg-primary text-white">
//         <div className="flex flex-col md:flex-row flex-1">
//             <LeftBoardSection />
//             <RightMovesSection />
//         </div>
//       </div>
//     </>
//   );
// }


