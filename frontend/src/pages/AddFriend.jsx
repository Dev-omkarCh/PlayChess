import React, { useState } from 'react';
import { Menu, X, Users, Search, UserPlus, MessageSquare } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#1e1f22] text-white">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar (Desktop: Fixed | Mobile: Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#2b2d31] border-r border-white/5 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:flex md:flex-col
      `}>
        <div className="p-4 flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-black text-indigo-400">SQUAD</h2>
            <button className="md:hidden p-2" onClick={() => setSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          {/* Friends List in Sidebar */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-4 px-2">
              <Users size={16} className="text-gray-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Online — 3</span>
            </div>
            
            <div className="space-y-1">
              {['Nexus', 'Vortex', 'Echo'].map((user) => (
                <button key={user} className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all group text-left">
                  <div className="relative">
                    <img src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user}`} className="w-10 h-10 rounded-full bg-[#1e1f22]" alt="" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2b2d31] rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold group-hover:text-indigo-400 transition-colors">{user}</p>
                    <p className="text-[10px] text-gray-500">Playing Valorant</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Footer (Profile) */}
          <div className="mt-auto p-2 bg-[#232428] rounded-2xl flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Admin" className="w-10 h-10 rounded-xl" alt="" />
            <div className="flex-1">
              <p className="text-sm font-bold">You</p>
              <p className="text-[10px] text-green-500 font-medium">Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 3. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar for Mobile Toggle */}
        <nav className="md:hidden sticky top-0 z-20 bg-[#2b2d31] p-4 flex items-center justify-between border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg">
            <Menu size={24} />
          </button>
          <span className="font-bold">Add Friends</span>
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
             <img src="https://api.dicebear.com/7.x/pixel-art/svg?seed=Admin" alt="me" />
          </div>
        </nav>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;