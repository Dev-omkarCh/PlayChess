import { Send, Smile } from 'lucide-react'
import React, { useState } from 'react'

const ChatTab = () => {

    const commonEmojis = ['😊', '😂', '🤔', '👍', '🔥', '👏', '😮', '😢', '🤝', '👑', '♟️', '⌛'];
    const [showEmojis, setShowEmojis] = useState(false);
    const [message, setMessage] = useState('');

    const addEmoji = (emoji) => {
        setMessage(prev => prev + emoji);
        setShowEmojis(false);
    };

    return (
        <>
            <div className="flex-1 flex flex-col h-[300px] lg:h-auto overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            <div className="text-xs text-zinc-500 text-center uppercase tracking-widest my-2">Game Started</div>
                            <div className="flex flex-col">
                                <span className="text-blue-400 text-xs font-bold">System</span>
                                <p className="bg-[#2b2925] p-2 rounded-r-md rounded-bl-md text-sm text-zinc-200">Good luck, have fun!</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-zinc-400 text-xs font-bold">You</span>
                                <p className="bg-[#3d3a35] p-2 rounded-l-md rounded-br-md text-sm text-zinc-200">Thanks! 🤝</p>
                            </div>
                        </div>

                        {/* Chat Input Container */}
                        <div className="p-3 bg-[#211f1c] border-t border-zinc-800 absolute bottom-0 left-0 w-full">

                            {/* Emoji Dialog Popover */}
                            {showEmojis && (
                                <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#2b2925] border border-zinc-700 rounded-lg shadow-2xl grid grid-cols-6 gap-2 z-50 animate-in fade-in slide-in-from-bottom-2">
                                    {commonEmojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => addEmoji(emoji)}
                                            className="text-xl hover:bg-[#3d3a35] p-1 rounded transition-colors"
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-2 bg-[#161512] rounded-md px-3 py-1 ring-1 ring-zinc-700 focus-within:ring-[#81b64c] transition-all">
                                <button
                                    onClick={() => setShowEmojis(!showEmojis)}
                                    className={`text-zinc-500 hover:text-yellow-500 transition-colors ${showEmojis ? 'text-yellow-500' : ''}`}
                                >
                                    <Smile size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none py-2 text-sm text-white focus:outline-none placeholder:text-zinc-600"
                                />
                                <button className="text-zinc-500 hover:text-[#81b64c] disabled:opacity-30" disabled={!message.trim()}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
            </div>
        </>
    );
};

export default ChatTab;
