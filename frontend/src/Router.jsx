import { createBrowserRouter } from 'react-router-dom';

// Imports for Pages
import Home from './components/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

import GameMenu from './pages/GameMenu';
import ProfilePage from './pages/Profile';
import NotFound from './pages/NotFound.jsx';
import Leaderboard from './components/LeaderBoard';
import InviteFriend from './pages/InviteFriend.jsx';
import MutiplayerGame from './pages/MultiplayerGame';

import RootLayout from './components/RootLayout';
import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';

// Test Component
import ChessConnect from './pages/AddFriend';
import Matchmaking from './components/MatchMaking';
import MultiplayerGame1 from './pages/MultiplayerGame1';
import ChessLobby from './pages/ChessLobby';

const routes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [

            { path: "/", element: <Home /> },
            {
                path: "/", element: <PublicRoute />,
                children: [
                    { path: "/signup", element: <Signup /> },
                    { path: "/login", element: <Login /> },
                ]
            },
            {
                path: "/", element: <PrivateRoute />,
                children: [
                    { path: "/menu", element: <GameMenu /> },
                    { path: "/leaderboard", element: <Leaderboard /> },
                    { path: "/game/multiplayer", element: < MultiplayerGame1 /> },
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/friends/invite", element: <InviteFriend /> },
                    { path: "/game/matchmaking", element: <Matchmaking />},
                    { path: "/game/lobby", element: <ChessLobby />}
                    
                ]
            },
            { path: "*", element: <NotFound /> },
            { path: "/test", element: <ChessConnect /> },
        ],
    }
]);

export default routes;