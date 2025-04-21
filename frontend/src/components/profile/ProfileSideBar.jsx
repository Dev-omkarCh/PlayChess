import { useState } from "react"
import { FaChessKnight, FaUserEdit, FaChartLine, FaWifi, FaChartPie } from 'react-icons/fa';
import { BsBarChartFill } from "react-icons/bs";
import { BiSolidChess } from "react-icons/bi";
import { MdElectricBolt } from "react-icons/md";
import { SiZcool } from "react-icons/si";
import { FaEdit } from "react-icons/fa";
import { TfiMoreAlt } from "react-icons/tfi";
import { getRandomColor } from '../../utils/randomColorGenerator';
import { MdLeaderboard } from "react-icons/md";
import Test from "../../Test"
import useFriendStore from "../../store/useFriendStore";
import { SiChessdotcom } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const ProfileSideBar = () => {
  const {user, history} = useFriendStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const Card = ({ name, value, icon, span }) => {
     return (
      <div className={`bg-secondary p-4 rounded border border-sectionBorder flex justify-center items-center cursor-pointer gap-3 hover:scale-105 flex-col hover:bg-secondaryVaraint transition-all duration-300 ease-in-out ${span && `col-span-2 `}`}>
        <p className=" text-gray-400 text-sm font-medium">{name}</p>
        <p className='hover:scale-110 transition-all duration-300 ease-in-out'>{icon}</p>
        <p className="text-lg font-semibold myfont">{value}</p>
      </div>
     )
  }

  const winRate = () => {
     const totalValue = history?.length;
     if(totalValue === 0) return 0;
     const value = user?.rapid?.win;
     const rate = (value / totalValue) * 100;
     return rate.toFixed(2);
  }

  return (
      <div className="w-1/4 h-full p-5 overflow-y-hidden bg-primary">
        <button className="text-3xl" onClick={()=> navigate("/menu")}><IoArrowBack /></button>
         <Test 
              isOpen={isOpen} 
              onClose={() => setIsOpen(false)}
              user={user}
               />
              {/*  */}
              <div className="flex justify-center items-center gap-5">
                <div className={`h-fit w-fit ml-5 rounded-full mb-4 ${getRandomColor()} border-4 border-sectionBorder`}>
                  {user?.profileImg && <img className='h-32 w-32 rounded-full' src={user?.profileImg} />}  
                </div>
                <div>
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                  {user?.username} <button onClick={() => setIsOpen(true)}> <FaEdit className="text-gray-400" /></button>
                </h2>
                <p className="text-gray-400">Rapid: {user?.elo}</p>
                </div>
                
      
              </div>
      
              {/*  */}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <Card name={"Games"} value={history?.length} icon={<BiSolidChess className='text-green-500 text-2xl' />} />
                <Card name={"Wins"} value={user?.rapid?.win} icon={<SiZcool className='text-orange-500 text-2xl' />} />
                <Card name={"Lose"} value={user?.rapid?.lose} icon={<MdElectricBolt className='text-red-500 text-2xl' />} />
                <Card name={"Draw"} value={user?.rapid?.draw} icon={<SiChessdotcom className='text-gray-500 text-2xl' />} />
                <Card name={"Win Rate"} value={Math.round(winRate())+"%"} icon={<FaChartPie className='text-blue-500 text-3xl' />} span={3} />
                <button className="bg-secondary border border-sectionBorder hover:bg-secondaryVaraint p-4 rounded col-span-3 hover flex flex-col hover:scale-105 transition-all duration-300 ease-in-out"
                onClick={()=> navigate("/leaderboard")}>
                  <div className='flex gap-3 justify-center'>
                    <h3 className="font-semibold text-lg ">LeaderBoard</h3>
                    <MdLeaderboard className='text-purple-500 text-2xl' />
                  </div>
                  <p className="text-gray-400">Checkout your rank</p>
                </button>
              </div>
            </div>
  )
}

export default ProfileSideBar
