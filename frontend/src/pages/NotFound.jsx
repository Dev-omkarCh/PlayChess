import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import NotFoundImage from "./../assets/Group.png";
import Button from "../components/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handle = () => {
    return navigate("/");
  }
  return (
    <div className="w-[100dvw] h-[100dvh] flex flex-col bg-gray-800">
      {/* 404 Content */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-start px-10 py-20 w-full h-full">
        {/* Left Text Content */}
        <div className="text-left w-full h-1/2 flex justify-center flex-col items-center md:items-start">
          <h2 className="text-5xl font-bold text-red-500 font ">Ooops....</h2>
          <p className="text-3xl text-gray-200 mt-7 font-mono">Page Not Found</p>
          <p className="text-md mt-1 text-gray-400">Please go back.</p>
          <Button handleOnClick={handle} text={"Go Home"} className={"w-2/4"} />
        </div>

        {/* Right Image */}
        <div className="w-full h-1/3 flex justify-center mt-10 md:mt-0">
          <img src={NotFoundImage} alt="404 Not Found" className="w-96 h-fit" />
        </div>
      </div>
    </div>
  );
}
