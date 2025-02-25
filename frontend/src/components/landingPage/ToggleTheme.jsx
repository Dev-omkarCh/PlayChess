import React, { useState } from 'react'
import { IoSunny, IoMoon } from 'react-icons/io5';
import useTheme  from '../../store/useTheme.js';

const ToggleTheme = () => {

    const { darkTheme, setDarkTheme} = useTheme();

    const handleTheme = () => {
        setDarkTheme(!darkTheme);
    }

    const LightBtn = () => {
       return (<button type='button' onClick={handleTheme} >
            <IoSunny className='text-[1.5rem]' />
       </button>)
    }

    const DarkBtn = () => {
       return (<button type="button" onClick={handleTheme} >
            <IoMoon className='text-[1.5rem]' />
       </button>)
    }
    
    return (
        <div className={`text-white`}>
            {darkTheme ? <LightBtn /> : <DarkBtn />}
        </div>
    )
}

export default ToggleTheme
