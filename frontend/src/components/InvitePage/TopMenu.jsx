import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import NotificationModal from "./NotificationModal";
import useSeachedUsers from "../../store/searchStore";
import useFriendStore from "../../store/useFriendStore";
import { BiSidebar } from "react-icons/bi";
import { useResponsiveStore } from "../../store/responsiveStore";
import { useOnlineStore } from "../../store/onlineStore";
import { notificationStore } from "@/store/notificationStore";


export default function TopMenu({ width, setIsOpen }) {

  const [query, setQuery] = useState("");
  const { setSearchUser } = useSeachedUsers();
  const { WIDTH } = useResponsiveStore();
  const [isOpenNotification, setIsOpenNotification] = useState();
  const { onlineUsers } = useOnlineStore();
  const activePlayer = onlineUsers?.length || 0;

  const { notifications } = notificationStore();

  console.log(notifications);

  const notificationsFiltered = notifications.filter((request) =>
    request?.type === "send" || request?.status === "pending"
  );

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim() === "") {
        // setResults([]);
        setSearchUser([]);
        return;
      }
      // setLoading(true);
      try {
        const res = await fetch(`/api/users/search?query=${query}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setSearchUser(data);
      } catch (error) {
        console.error("Search error:", error);
      }
      // setLoading(false);
    };

    const debounceTimeout = setTimeout(fetchResults, 300); // Debounce API calls (best practice)

    return () => clearTimeout(debounceTimeout); // Cleanup on unmount or retype
  }, [query]);

  return (
    <div
      className={`topMenu flex items-center justify-evenly w-full h-[8%] bg-primary p-2 border-b border-sectionBorder`}>
      {
        width < WIDTH &&
        <button
          className="p-1 rounded-md bg-secondary ml-2 hover:bg-[#454545] 
          transition-all duration-300 border border-sectionBorder relative z-10"
          onClick={() => setIsOpen(true)}
        >

          <BiSidebar className="text-[1.5rem] text-white" />
          {activePlayer > 0 && (
            <span className="absolute top-0 right-0 text-[10px] w-3 h-3 bg-red-500 rounded-full border-2 z-50 border-gray-800 "></span>
          )}
        </button>
      }
      {/* Search Bar */}
      <div className={`flex items-center bg-secondary 
        text-gray-300 px-3 py-2 rounded-lg w-[80%] border border-sectionBorder ${width < WIDTH ? "ml-3" : "ml-8"}`}
      >
        <FaSearch className="text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Search username"
          className="bg-transparent outline-none text-sm w-full placeholder-gray-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center ml-4 mr-4 h-full">
        <button className="p-3 rounded-full bg-secondary ml-2 hover:bg-[#454545] transition-all duration-300 border border-sectionBorder">
          <FaSearch className="text-white" />
        </button>

        {/* Notification Bell */}
        <div className="relative ml-4">
          <button
            onClick={() => setIsOpenNotification(true)}
            className="p-3 rounded-full bg-secondaryVaraint hover:bg-[#454545] transition-all duration-300 border border-sectionBorder"
          >
            <FaBell className="text-white text-[1.1rem]" />
            {notificationsFiltered?.length > 0 &&
              <span
                className="absolute top-0 left-[60%] bg-red-500 w-4 h-4 text-white font-bold rounded-full text-[10px] flex justify-center items-center">
                {notificationsFiltered?.length}
              </span>
            }
          </button>
        </div>

        <NotificationModal
          onClose={() => setIsOpenNotification(false)}
          isOpen={isOpenNotification}
          notifications={notificationsFiltered}
        />

      </div>
    </div>
  );
}
