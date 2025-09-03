import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect } from 'react'

const MessagesContainer = ({ messages, messagesEndRef }) => {

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages]);

    return (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 border border-sectionBorder rounded-xl bg-primary custom-scrollbar">

            {messages?.length === 0 && (
                <p className="text-gray-400 text-center text-sm">No messages yet...</p>
            )}

            <AnimatePresence>
                {messages?.map((data, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${data?.sender === "You" ? "justify-end" : "justify-start"}`}
                >
                    <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`${data?.message?.type === "image" ? "" : "px-4 py-2"} rounded-2xl shadow-lg max-w-[70%] text-sm transition-all duration-200 ${
                        data?.sender === "You"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "bg-gray-800 text-gray-200"
                    }`}
                    >
                    {data?.message?.type === "image" ? (
                        <img src={data?.message?.content} alt="emoji" className="w-36" />
                    ) : (
                        data?.message?.content
                    )}
                    </motion.div>
                </motion.div>
                ))}
            </AnimatePresence>
            <div ref={messagesEndRef} className='h-1' /> {/* Invisible marker */}
        </div>  
    );
};

export default MessagesContainer;
