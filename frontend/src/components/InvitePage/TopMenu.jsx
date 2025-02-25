import { useEffect, useState } from "react";
import { FaSearch, FaBell } from "react-icons/fa";
import InboxModal from "./InboxModal";
import useSeachedUsers from "../../store/searchStore";
import useFriendStore from "../../store/useFriendStore";

export default function TopMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { setSearchUser } = useSeachedUsers();
  // const [loading, setLoading] = useState(false);

  // changes
  const { friendRequests} = useFriendStore();
  const sortByRequest = friendRequests.filter((request) => request.type === "friend-request");

  // end

  useEffect(() => {
    const fetchResults = async () => {
        if (query.trim() === "") {
            // setResults([]);
            setSearchUser([]);
            return;
        }
        // setLoading(true);
        try {
          const res = await fetch(`/api/users/search?query=${query}`,{
            method : "GET",
            headers : { "Content-Type": "application/json"},
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
    <div className="flex items-center justify-evenly w-full h-[8%] bg-[#0d121e] p-2">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 text-gray-300 px-3 py-2 rounded-lg w-[80%] ml-8">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search username"
          className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
          value={query}
          onChange={(e)=> setQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition">
          <FaSearch className="text-white" />
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(true)} 
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition"
          >
            <FaBell className="text-white text-[1.1rem]" />
            { sortByRequest.length !== 0 ? <span 
            className="absolute top-0 left-[60%] bg-red-500 w-4 h-4 text-white font-bold rounded-full text-[10px] flex justify-center items-center">
              {sortByRequest.length}
          </span> :
          ""
        }
          
          </button>
        
        </div>
        <InboxModal isOpen={isOpen} onClose={() => setIsOpen(false)} sortByRequest={sortByRequest} />
      </div>
    </div>
  );
}
