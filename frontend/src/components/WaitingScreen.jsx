import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Crown, Swords } from "lucide-react";
import NavigateBack from "./NavigateBack";
import { useNavigate } from "react-router-dom";

// Pure React + Tailwind modal (no shadcn)
export default function WaitingModal({ open }) {
  const [time, setTime] = useState(0);

  const navigate = useNavigate();

  function onCancel() {
    localStorage.removeItem("reload");
    navigate(-1);
  }

  // Tick timer only while open
  useEffect(() => {
    if (!open) return;
    setTime(0);
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [open]);

  // ESC to cancel
  // useEffect(() => {
  //   if (!open) return;
  //   const onKey = (e) => {
  //     if (e.key === "Escape") onCancel?.();
  //   };
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [open, onCancel]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
        >
          {/* Backdrop */}
          <motion.button
            aria-label="Close dialog"
            onClick={() => onCancel?.()}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog content */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="waiting-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-white
                       bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            {/* Animated chessboard background */}
            <div className="pointer-events-none absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-10">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className={(Math.floor(i / 8) + i) % 2 === 0 ? "bg-gray-700" : "bg-gray-900"}
                />
              ))}
            </div>

            {/* Floating icons */}
            <motion.div
              className="absolute top-6 left-5"
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Crown className="w-9 h-9 text-yellow-400" />
            </motion.div>
            {/* <motion.div
              className="absolute bottom-6 right-5"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 2.4 }}
            >
              <Swords className="w-9 h-9 text-red-400" />
            </motion.div> */}

            {/* Body */}
            <div className="relative z-10 px-6 pt-7 pb-4 text-center">
              <h2 id="waiting-title" className="text-2xl font-bold">Waiting for Opponent</h2>

              <div className="mt-5 flex flex-col items-center">
                <Loader2 className="w-12 h-12 animate-spin text-green-400" />
                <motion.p
                  className="mt-4 text-base font-medium tracking-wide"
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Searching for opponent...
                </motion.p>
                <p className="mt-2 text-sm text-gray-300">Time Elapsed: {formatTime(time)}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onCancel()}
                  className="w-full select-none rounded-xl px-4 py-2 font-semibold shadow-lg
                             bg-red-500 hover:bg-red-600 active:bg-red-700
                             focus:outline-none focus-visible:ring focus-visible:ring-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}