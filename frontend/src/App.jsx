import toast, { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes} from 'react-router-dom';

import Home from './components/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';

import Signup from './pages/Signup.jsx';
import GameMenu from './pages/GameMenu.jsx';
import PuzzleCard from './components/PuzzleCard.jsx';

import Profile from './pages/Profile.jsx';
// import Dashboard from './pages/DashBoard.jsx';
import ChessGame from './components/chess/ChessGame.jsx';

import MultiplayerGame from './pages/MutiplayerGame/MultiplayerGame.jsx';
import useAuth from './store/useAuth.js';

import NotFound from './pages/NotFound.jsx';
import InviteFriend from './pages/InviteFriend.jsx';
// import ChessHomepage from './Test.jsx';

import useSocket from './hooks/useSocket.js';
import LeaderBoard from './components/LeaderBoard.jsx';
import useFriendStore from './store/useFriendStore.js';
import MatchMaking from './components/MatchMaking.jsx';

import SettingsModal from './components/Settings.jsx';
// import MultiplayerDemo from './pages/M.jsx';
import GameAnalytics from './pages/GameAnalytics.jsx';
import useAdmin from './store/useAdmin.js';
import TestOnlineChess from './test/TestOnlineChess.jsx';
import { ToastProvider} from './components/ToastProvider.jsx';


const App = () => {

  const { authUser } = useAuth();
  const { isAdmin } = useAdmin();
  
  useSocket();
  return (
    <>
    <ToastProvider>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={authUser ? <Navigate to="/menu" /> :<Login />} />
          <Route path="/signup" element={authUser ? <Navigate to="/menu" /> :<Signup />} />
          <Route path="/menu" element={authUser ? <GameMenu /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
          {/* <Route path="/dash" element={<Dashboard />} /> */}
          <Route path="/chess" element={<ChessGame />} />
          <Route path="/multiplayer" element={<MultiplayerGame />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/invite' element={authUser? <InviteFriend /> : <Navigate to={"/login"}/>} />
          <Route path='/leaderBoard' element={authUser? <LeaderBoard /> : <Navigate to={"/login"}/>} />
          <Route path='/matchmaking' element={<MatchMaking />} />
          <Route path="/puzzle" element={<PuzzleCard />} />
          <Route path="/settings" element={<SettingsModal />} />
          <Route path='/test' element={authUser ? <TestOnlineChess /> : <Navigate to={"/login"} />} />
          <Route path='/design' element={authUser ? <MultiplayerGame /> : <Navigate to={"/login"} />} />
          <Route path='/admin' element={authUser && isAdmin ? <GameAnalytics /> : <Navigate to={"/login"}/>} />
      </Routes>
    </ToastProvider>
    <Toaster 
      position="bottom-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 80,
        left: 20,
        paddingTop: 20,
        zIndex: 50,
      }}
    />

    {/* {request && <Toast />} */}
    </>
  );
};

export default App;
