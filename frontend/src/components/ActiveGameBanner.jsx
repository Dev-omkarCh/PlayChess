import { useSocketContext } from '@/context/SocketContext';
import { useAppNavigator } from '@/hooks/useAppNavigator';

const ActiveGameBanner = () => {

  const { goTo, replaceWith } = useAppNavigator();
  const isActive = localStorage.getItem("isGameActive") === "true";
  const socket = useSocketContext();

  if (!isActive) return null;

  const handleResign = () => {
    if(!socket) {
        console.error("No Socket Found : ActiveBanner/Resign");
        return;
    };

    // Tell the server the player left
    socket?.emit("resign"); 
    
    // Clean up local state
    localStorage.removeItem("isGameActive");
    
    // Refresh or redirect to home
    replaceWith("/menu");
  };

  return (
    // <div style={bannerStyle}>
    <div>
      <span>You have an active game in progress!</span>
      <div>
        <button onClick={() => goTo("/game/multiplayer")}>Continue Game</button>
        <button onClick={handleResign} style={{ color: 'red' }}>Resign</button>
      </div>
    </div>
  );
};

export default ActiveGameBanner;