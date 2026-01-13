import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import notificationSound from "@/sounds/notification.mp3"
import { FaMessage } from "react-icons/fa6";
import { messageStore } from "@/store/messageStore";
import { useMessage } from "@/hooks/useMessage";
import useSocketStore from "@/store/socketStore";
import { stickers } from "@/utils/stickers";
import StrickersDailog from "./StrickersDailog";
import MessagesContainer from "./MessagesContainer";


export default function GameChatDialog() {
  const { messages } = messageStore();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { room, messageListener } = useSocketStore();
  const { getMessages, sendMessage } = useMessage();

  const playSendSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  const sendMsg = (content, type = "text") => {
    sendMessage(room, { content, type });
    playSendSound();
  };

  useEffect(()=>{
    messageListener();
  },[])


   useEffect(() => {
    getMessages(room);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [room]);
  
  // useEffect(()=>{
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // },[messages,room]);


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className=" absolute bottom-10 left-3 rounded-full p-6 shadow-md bg-primary border border-sectionBorder hover:bg-secondaryVaraint z-50">
            <span className={`absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border z-50 border-gray-800 `}></span>
            <FaMessage className="text-3xl text-blue-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md flex flex-col h-[500px] bg-secondary text-white border border-gray-800 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-100 tracking-wide">Game Chat</DialogTitle>
        </DialogHeader>

        {/* Chat Window */}
        <MessagesContainer 
          messages={messages} 
          messagesEndRef={messagesEndRef} 
        />

        {/* Emoji Quick Actions */}
        <motion.div
          className="flex space-x-2 overflow-x-auto py-2 border-t border-sectionBorder justify-start items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StrickersDailog stickers={stickers} onSend={sendMsg} />
          {stickers.map((emoji, idx) => (
            <div key={idx} className="flex justify-between items-start overflow-hidden">
              { emoji.type == "text" && (
                <Button
                size="sm"
                variant="ghost"
                className="bg-primary hover:bg-secondaryVaraintHover text-lg rounded-xl shadow-md"
                onClick={() => sendMsg(emoji.content, "text")}
              >
                {emoji.content}
              </Button>
              )}
              
            </div>
          ))}
        </motion.div>

        {/* Input & Send */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-800">
          <Input
            placeholder="Type a message..."
            value={input}
            className="bg-primary border-sectionBorder text-white placeholder-gray-500 rounded-xl"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg(input, "text")}
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={() => sendMsg(input, "text")} className="bg-green-500 hover:bg-green-600 rounded-xl shadow-md">
              <Send className="w-4 h-4 text-white" />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
