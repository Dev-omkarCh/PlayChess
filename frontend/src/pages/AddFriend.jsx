import React, { useEffect, useState } from 'react';
import { Menu, X, Users } from 'lucide-react';
import useChessStore from '@/store/chessStore';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { board } = useChessStore();
  let section1 = '';
  const turn = 'white';
  const whiteCastlingRights = "K";
  const blackCastlingRights = "kq";
  const enpassant = '-'
  const lastPawnOrCapture = 10;
  const moveNumber = 24;

  useEffect(() => {

    function pieceMapper(piece) {
      if (!piece) return null
      else if (piece.color === 'black' && piece.type === 'rook') return 'bR'
      else if (piece.color === 'black' && piece.type === 'knight') return 'bN'
      else if (piece.color === 'black' && piece.type === 'bishop') return 'bB'
      else if (piece.color === 'black' && piece.type === 'queen') return 'bQ'
      else if (piece.color === 'black' && piece.type === 'king') return 'bK'
      else if (piece.color === 'black' && piece.type === 'pawn') return 'bP'
      else if (piece.color === 'white' && piece.type === 'rook') return 'wR'
      else if (piece.color === 'white' && piece.type === 'knight') return 'wN'
      else if (piece.color === 'white' && piece.type === 'bishop') return 'wB'
      else if (piece.color === 'white' && piece.type === 'queen') return 'wQ'
      else if (piece.color === 'white' && piece.type === 'king') return 'wK'
      else if (piece.color === 'white' && piece.type === 'pawn') return 'wp'
    };

    function typeMapper(type){
      if(type === "R") return 'rook'
      else if(type === "B") return 'bishop'
      else if(type === "N") return 'knight'
      else if(type === "Q") return 'queen'
      else if(type === "K") return 'king'
      else if(type === "P") return 'pawn'
    };

    function generateFEN(board, turn, castling, enPassant, halfMove, fullMove) {
      let fen = "";

      // 1. Piece Placement (Rank 8 down to Rank 1)
      for (let r = 0; r < 8; r++) {
        let emptyCount = 0;
        for (let c = 0; c < 8; c++) {
          const pieceObject = board[r][c]; // Expected format: 'wP', 'bK', or null
          const piece = pieceMapper(pieceObject);

          if (piece === null) {
            emptyCount++;
          } else {
            if (emptyCount > 0) {
              fen += emptyCount;
              emptyCount = 0;
            }
            // Convert 'wP' -> 'P', 'bK' -> 'k'
            const char = piece[1];
            fen += (piece[0] === 'w') ? char.toUpperCase() : char.toLowerCase();
          }
        }
        if (emptyCount > 0) fen += emptyCount;
        if (r < 7) fen += "/";
      }

      // 2. Active Color
      fen += ` ${turn}`; // 'w' or 'b'

      // 3. Castling Rights
      // castling should be a string like "KQkq" or "-" if none
      fen += ` ${castling || "-"}`;

      // 4. En Passant Target Square
      // e.g., "e3" or "-"
      fen += ` ${enPassant || "-"}`;

      // 5. Halfmove Clock
      fen += ` ${halfMove}`;

      // 6. Fullmove Number
      fen += ` ${fullMove}`;

      return fen;
    };

    const initialState = generateFEN(board, "w", "K-", '-', 2, 10);
    console.log(initialState);

    function parseFEN(fen) {
      const parts = fen.split(" ");
      const boardPart = parts[0]; // The piece placement section

      const board = [];
      const rows = boardPart.split("/");

      for (let row of rows) {
        const boardRow = [];
        for (let char of row) {
          if (isNaN(char)) {
            // It's a piece: Uppercase = White, Lowercase = Black
            const color = (char === char.toUpperCase()) ? 'w' : 'b';
            const type = char.toUpperCase();

            const pieceObj = {
              color : color === "w" ? "white" : "black",
              type : typeMapper(type)
            }
            
            boardRow.push(pieceObj); // Results in 'wP', 'bK', etc.
          } else {
            // It's a number: add that many nulls
            const numEmpty = parseInt(char);
            for (let i = 0; i < numEmpty; i++) {
              boardRow.push(null);
            }
          }
        }
        board.push(boardRow);
      }

      // Extracting Metadata (Optional - store these in your game state)
      const gameState = {
        board: board,
        turn: parts[1],
        castling: parts[2],
        enPassant: parts[3],
        halfMove: parseInt(parts[4]),
        fullMove: parseInt(parts[5])
      };

      return gameState;
    }

    const gameState = parseFEN(initialState);

    console.log(gameState?.board);

  }, [])

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