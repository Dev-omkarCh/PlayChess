// src/Router.js
import { Outlet, useLocation } from "react-router-dom";
import { SocketProvider } from "@/context/SocketContext";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import ActiveGameBanner from "./ActiveGameBanner";
import LoadingSpinner from "./LoadingSpinner";
import FriendRequestToast from "./FriendRequestToast";
import useToastStore from "@/store/toastStore";

// It ensures the SocketProvider is always active
const RootLayout = () => {

  const { authUser, isAuthenticated, checkAuth, loading } = useAuthStore();
  const location = useLocation();
  const isCurrentlyInGame = location.pathname === "/game/multiplayer";
  const { toast, hideToast, type  } = useToastStore();

  useEffect(() => {
    if(!isAuthenticated && !authUser){
      checkAuth();
    }
  }, [authUser, isAuthenticated, checkAuth, toast]);

  if (loading) {
    return <div className="h-screen w-screen flex justify-center items-center">
      <LoadingSpinner size={200} />
    </div> 
  };
  
  return(
    <SocketProvider>
      <>
        {/* Future Navbar */}
        {!isCurrentlyInGame && <ActiveGameBanner />}
        { toast.show && 
          <FriendRequestToast 
            data={toast?.data} 
            onClose={hideToast}
            type={type}
          />}
        <Outlet /> {/* This renders the current route's component */}
      </>
    </SocketProvider>
  )
};

export default RootLayout;