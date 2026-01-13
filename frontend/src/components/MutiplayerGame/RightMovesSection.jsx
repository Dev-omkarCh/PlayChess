import DrawRequestModal from "@/components/chess/DrawRequestModal";
import MoveHistory from "../../components/chess/MoveHistory"
import useChessStore from "@/store/chessStore";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

const RightMovesSection = () => {
    const { drawRequest } = useChessStore();
    return (
        <div className="Right w-full md:w-1/4 bg-secondary flex-grow p-4 flex flex-col gap-4 md:h-screen">
            <div className='flex h-[100%] flex-col flex-grow'>
                {drawRequest && <DrawRequestModal />}
                <MoveHistory />
            </div>

        </div>
    );
};

export default RightMovesSection;
