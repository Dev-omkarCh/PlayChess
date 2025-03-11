import { useEffect } from "react";
import useFriendStore from "../store/useFriendStore";

const Toast = ({ message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 60000); // Auto close after 1 minute
      return () => clearTimeout(timer);
    }, [onClose]);

    const {setRequest} = useFriendStore();
  
    return (
      <div className="fixed bottom-4 md:w-[40%] w-[80%] right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex justify-between items-center gap-4 animate-slide-in">
        <div className="pl-5">
          <h2 className="capitalize font-semibold">omkar</h2>
          <p className="text-neutral-200 font-light">Want's to Play a game</p>
        </div>
        <div className="flex gap-5">
          <button onClick={onClose} className="bg-green-500 px-3 py-1 rounded">
            Accept
          </button>
          <button onClick={()=> setRequest(null)} className="bg-red-500 px-3 py-1 rounded">
            Decline
          </button>
        </div>
      </div>
    );
};

export default Toast;