import mongoose from 'mongoose';

const chessGameSchema = new mongoose.Schema({
  // 1. PARTICIPANTS
  players: {
    white: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    black: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },

  // 2. LIVE GAME STATE
  // Store the latest FEN here for quick access when the game resumes
  currentFen: { 
    type: String, 
    default: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" 
  },
  status: { 
    type: String, 
    enum: ['active', 'checkmate', 'draw', 'resignation', 'timeout'], 
    default: 'active' 
  },

  // 3. MOVE HISTORY (The "Navigation" Engine)
  // Each entry represents one turn.
  history: [{
    moveNumber: Number,
    notation: String,       // e.g., "Nxf3+"
    from: String,           // e.g., "g1"
    to: String,             // e.g., "f3"
    fenBefore: String,      // FEN before move
    fenAfter: String,       // FEN after move (used for Back/Forward)
    
    // ANALYTICS FIELDS PER MOVE
    meta: {
      piece: String,        // "Knight", "Pawn", etc.
      isCapture: { type: Boolean, default: false },
      CapturedPiece: String, // e.g., "Pawn"
      isCheck: { type: Boolean, default: false },
      timeTaken: Number     // Seconds spent on this move
    },
    timestamp: { type: Date, default: Date.now }
  }],

  // 4. FINAL ANALYTICS (Populated only when status changes from 'active')
  analytics: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    totalMoves: Number,
    openingName: String,     // e.g., "Sicilian Defense"
    durationSeconds: Number,
    endType: String          // e.g., "Checkmate", "Draw by Stalemate"
  },
  ranked: {
    type: Boolean,
    required : true,
  }
}, { timestamps: true });

// INDEXING: Makes searching for a user's game history very fast
chessGameSchema.index({ "players.white": 1, "players.black": 1 });

const ChessGame = mongoose.model('ChessGame', chessGameSchema);
export default ChessGame;