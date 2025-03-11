import { useState } from 'react';
import { FaAngleDoubleDown, FaAngleDown, FaAngleUp, FaChartLine } from 'react-icons/fa';
import { BiSolidChess } from "react-icons/bi";
import { BsThreeDotsVertical } from 'react-icons/bs';

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import useFriendStore from '../../store/useFriendStore';

const ProfileMainSection = () => {
    const {user, history} = useFriendStore();
    const [activeTab, setActiveTab] = useState('games');

    const Games = ({ ratingCal, date, game }) => {

      let playerWon;
      let elo;

        if(game?.won.length > 0){
          game?.won[0] === "white" ? playerWon = "white" : playerWon = "black";
        }

        if(game?.white === user?._id && playerWon === "white"){
          elo = game?.rating.white.after;
        }
        else{
          elo = game?.rating.black.after;
        }

        return (
          <div className="bg-[#313338] p-3 flex items-center justify-between rounded-md w-full">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-fit h-fit bg-red-500 rounded-full flex items-center justify-center">
                <img className='w-12 h-12' src={user.profileImg} />
              </div>
              <div>
                <p className="text-white text-base font-semibold capitalize">{user.username}</p>
                <p className="text-gray-400 text-xs">Elo : {elo}</p>
              </div>
            </div>
      
            {/* Icons */}
            <div className="flex items-center gap-4">
                <div className='flex gap-2'>
                   { ratingCal > 0 ? <FaArrowTrendUp className='text-green-500 text-2xl' /> : <FaArrowTrendDown className='text-red-500 text-2xl' /> }
                   {<span className={`${ratingCal > 0 ? "text-green-500" : "text-red-500 font-bold"}`}>{ratingCal > 0 && "+"}{ratingCal}</span>}  
                </div>  
              <BiSolidChess className='text-blue-500 text-2xl hover:text-blue-700 ' />
              <div className='text-gray-300'>{date}</div>
            </div>
          </div>
        );
    };

    const calulateRatingDifference = (game) => {
      const userId = user._id;
      if(game?.white === userId){
        const before = game.rating.white.before;
        const after = game.rating.white.after;
        return after - before;
      }
      else{
         const before = game.rating.black.before;
         const after = game.rating.black.after;
         return after - before;
      }

   }

  return (
    <div className="w-3/4 p-5 bg-[#2b2d31] overflow-y-auto">
            <div className="flex border-b border-gray-700 mb-4">
              <button 
                className={`px-4 py-2 ${activeTab === 'games' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`} 
                onClick={() => setActiveTab('games')}>Games</button>
              {/* <button 
                className={`px-4 py-2 ${activeTab === 'stats' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`} 
                onClick={() => setActiveTab('stats')}>Stats</button> */}
            </div>
    
            {activeTab === 'games' && (
                <div className="bg-[#1e1f22] rounded p-4 space-y-4 h-[90%]">
                    {history?.map((game)=>{
                        return <Games key={game._id} game={game} ratingCal={calulateRatingDifference(game)} />
                    })}
                </div>
            )}
    
            {/* {activeTab === 'stats' && (
              <div className="bg-[#1e1f22] rounded p-4 text-center">
                <FaChartLine className="text-green-400 text-4xl mb-4" />
                <p className="text-gray-400">Detailed stats coming soon...</p>
              </div>
            )} */}
    </div>
  )
}

export default ProfileMainSection
