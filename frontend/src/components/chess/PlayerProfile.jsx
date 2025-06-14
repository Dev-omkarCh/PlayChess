import React from 'react'
import { getRandomColor } from '../../utils/randomColorGenerator'
import { useResultStore } from '../../store/resultStore';

const PlayerProfile = ({ you, username = "username", elo = "elo", img}) => {
  return (
    <div className={`p-3 flex rounded-md w-fit  ${you && "justify-center items-end"}`}>
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${getRandomColor()}  rounded-full flex items-center justify-center`}>
            {
                img && <img className='w-fit h-fit' src={img} />
            }
          </div>
          <div>
            <p className="text-white text-base sm: font-semibold capitalize">{you?.username || username}({you?.elo || elo})</p>
            <p className="text-gray-400 text-xs lg:text-sm">{you ? "you" : "opponent"}</p>
          </div>
        </div>
    </div>
  )
}

export default PlayerProfile
