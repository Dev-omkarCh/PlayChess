import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GameMenu from './pages/GameMenu';
import ProfilePage from './pages/Profile';
import TestOnlineChess from './test/TestOnlineChess.jsx';
import NotFound from './pages/NotFound.jsx';
import InviteFriend from './pages/InviteFriend.jsx';
import RootLayout from './components/RootLayout';
import PrivateRoute from './components/PrivateRoute';
import Leaderboard from './components/LeaderBoard';
import PublicRoute from './components/PublicRoute';
import ChessConnect from './pages/AddFriend';

const routes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            
            { path: "/", element: <Home />},
            { path: "/", element: <PublicRoute />, 
                children: [
                    { path: "/signup", element: <Signup /> },
                    { path: "/login", element: <Login /> },
                ]
            },
            { path: "/" , element: <PrivateRoute /> , 
                children: [
                    { path: "/menu", element: <GameMenu /> },
                    { path: "/leaderboard", element: <Leaderboard />},
                    { path: "/game/multiplayer", element: <TestOnlineChess /> },
                    { path: "/profile", element: <ProfilePage /> },
                    { path: "/friends/invite", element: <InviteFriend /> },
                ]
            },
            { path: "*", element: <NotFound /> },
            { path: "/add-friend", element: <ChessConnect />}
        ],
    }
]);

export default routes;