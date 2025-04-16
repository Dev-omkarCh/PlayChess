import React from 'react'
import { getRandomColor } from '../../utils/randomColorGenerator'

const PlayerProfile = ({ you, username = "username", elo = "elo", img}) => {
  return (
    <div className={`p-3 flex items-center justify-between rounded-md w-fit absolute ${you ? "bottom-2 right-5": "top-1 left-1"}`}>
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${getRandomColor()}  rounded-full flex items-center justify-center`}>
            {
                img && <img className='w-fit h-fit' src={img} />
            }
          </div>
          <div>
            <p className="text-white text-base font-semibold capitalize">{username}({elo})</p>
            <p className="text-gray-400 text-xs">{you ? "you" : "opponent"}</p>
          </div>
        </div>
    </div>
  )
}

export default PlayerProfile
