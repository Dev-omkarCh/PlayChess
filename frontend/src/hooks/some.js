// TODO: Chnage the file Name and use it in the App.js where comments are available

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      toast.error("You are Offline, Please check your Internet Connection")
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;

// import { useEffect, useState } from "react";

// const OfflinePopup = () => {
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOnline(true);
//       setTimeout(() => setShow(false), 3000); // Hide after 3 seconds
//     };

//     const handleOffline = () => {
//       setIsOnline(false);
//       setShow(true); // Show immediately when offline
//     };

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);

//   const Offline = () =>{
//     return (
//       <div
//       className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded-lg shadow-lg transition-all duration-500 ${
//         isOnline ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
//       }`}
//     >
//       ⚠️ You are offline! Some features may not work.
//     </div>
//     )
//   }

//   const Online = () =>{
//     return (
//       <div
//       className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg transition-all duration-500 ${
//         isOnline ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
//       }`}
//     >
//        You now Online, Welcome back!
//     </div>
//     )
//   }

//   if (!show) return null; // Hide component when not needed

//   return (
//     <>
//       {isOnline ? <Online /> : <Offline />}
//     </>
//   );
// };