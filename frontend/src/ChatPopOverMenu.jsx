import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react";
import notificationSound from "@/sounds/notification.mp3";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

const quickEmojis = ["😀", "😂", "🔥", "❤️", "👏"];

const ChatPopOverMenu = () => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socket = useSocketContext();

  const playSendSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  const sendMessage = (content, type = "text") => {
    if (!content.trim()) return;
    setMessages([...messages, { content, type, sender: "You" }]);
    setInput("");
    playSendSound();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 h-[500px]">
        {/* Chat Window */}
        <div className="flex-1 p-3 space-y-3 border border-gray-800 rounded-xl bg-gray-900 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-gray-500 text-center text-sm">No messages yet...</p>
          )}
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`px-4 py-2 rounded-2xl shadow-lg max-w-[70%] text-sm transition-all duration-200 ${msg.sender === "You"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-gray-800 text-gray-200"
                    }`}
                >
                  {msg.content}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Emoji Quick Actions */}
        <motion.div
          className="flex space-x-2 overflow-x-auto py-2 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {quickEmojis.map((emoji, idx) => (
            <motion.div whileTap={{ scale: 0.8 }} key={idx}>
              <Button
                size="sm"
                variant="ghost"
                className="bg-gray-800 hover:bg-gray-700 text-lg rounded-xl shadow-md"
                onClick={() => sendMessage(emoji)}
              >
                {emoji}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Input & Send */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-800">
          <Input
            placeholder="Type a message..."
            value={input}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-xl"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={() => sendMessage(input)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 rounded-xl shadow-md">
              <Send className="w-4 h-4 text-white" />
            </Button>
          </motion.div>
        </div>
      </PopoverContent>
    </Popover>
  )
};

export default ChatPopOverMenu;
