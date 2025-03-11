import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";

export const showCustomToast = (username) => {
  toast.custom((t) => (
    <div
      className={`bg-gray-800 text-white w-fit p-4 shadow-lg rounded-xl border flex flex-row gap-5 transition-all duration-300 transform ${
        t.visible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <p className="text-lg font-semibold">{username} wants to play</p>
      <div className="flex justify-start items-start gap-2">
        <button
          onClick={() => {
            toast.dismiss(t.id);
          }}
          className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-green-600 transition"
        >
          <FiCheck size={18} />
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600 transition"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  ));
};