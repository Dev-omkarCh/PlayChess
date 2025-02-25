import Logo from '../../assets/gg.png';
import { IoPerson } from 'react-icons/io5';
import { Link, useLocation } from "react-router-dom";
import ToggleTheme from './ToggleTheme';

const NavBar = () => {

  const url = useLocation().pathname;
  
  return (
    <div className={`h-[8%] w-full flex bg-primary_dark_deep text-white`}>
      <div className='w-[50%] h-full flex justify-center items-center text-white gap-7 relative'>
        <img src={Logo} alt="hello" className='pl-2 h-[10rem] mb-2 absolute left-0 hidden md:flex' />
        <Link to={"/"} className={`${url === "/" && "text-accent_color_dark font-bold"}`}>Home</Link>
        <Link to={"/about"} className={`${url === "/about" && "text-accent_color_dark font-bold"}`}>About</Link>
      </div>
      
      <div className={`w-[50%] flex justify-end items-center gap-3 text-white`}>
          {/* Icons Section */}
          <ToggleTheme />
          <div className='h-fit p-2 bg-gray-700 rounded-full mr-2 '>
            <IoPerson className='text-[1.2rem]' />
          </div>
      </div>
      
    </div>
  )
}

export default NavBar
