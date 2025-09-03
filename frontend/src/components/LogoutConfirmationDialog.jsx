import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import Button from "./Button";

export default function LogoutConfirmationDialog({ open, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl border-2 border-sectionBorder bg-primary"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">
              Logout
            </h2>
            <p className="mb-6 text-sm text-neutral-300">
              Are you sure you want to log out of your account?
            </p>

            <div className="flex flex-col gap-3">
              <Button handleOnClick={onConfirm} text={"logout"} color="red" />
              <Button handleOnClick={onCancel} text={"Cancel"} color="gray" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
