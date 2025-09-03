import { IoMdArrowRoundBack } from "react-icons/io"
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "react-tooltip";

const NavigateBack = ({ path }) => {
    const navigate = useNavigate()
    return (
        <div className="w-full pl-2">
            <Tooltip id="back-tooltip" place="top" effect="solid">Go back</Tooltip>
                <button data-tooltip-id="back-tooltip" className="w-6 h-6 hover:bg-secondaryVaraintHover transition duration-500 ease-in-out hover:text-red-400 flex justify-center items-center rounded-full" onClick={() => navigate(path)}>
                    <IoMdArrowRoundBack className='text-lg' />
                </button>
        </div>
    );
};

export default NavigateBack;
