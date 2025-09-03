// ---------- ToastProvider.jsx ----------
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((opts) => {
    const id = crypto.randomUUID();
    const toast = {
      id,
      text: opts.text,
      onAccept: opts.onAccept || (() => {}),
      onReject: opts.onReject || (() => {}),
    };
    setToasts((prev) => [...prev, toast]);
    return id;
  }, []);

  const value = useMemo(() => ({ showToast, closeToast }), [showToast, closeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex w-80 flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => closeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const { text, onAccept, onReject } = toast;

  const handleAccept = async () => {
    try { await onAccept(); } finally { onClose(); }
  };
  const handleReject = async () => {
    try { await onReject(); } finally { onClose(); }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.6 }}
      className="relative flex flex-col gap-3 rounded-2xl border-2 p-4 shadow-xl backdrop-blur-md border-sectionBorder bg-[#31302e]"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-neutral-100">
        {text}
      </p>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleAccept}
          className="flex items-center justify-center gap-2 w-full rounded-2xl border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-600 active:opacity-80"
        >
          <Check size={16}/> Continue Playing
        </button>
        {/* <button
          onClick={handleReject}
          className="flex items-center justify-center gap-2 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition duration-400 ease-in-out active:bg-red-600 hover:bg-red-500 hover:text-white"
        >
          <X size={16}/> Resign
        </button>
        */}
      </div>
    </motion.div>
  );
};