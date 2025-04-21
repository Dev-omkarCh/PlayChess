import { Server } from "socket.io";
import express from 'express';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors : {
        origin : [ "http://localhost:3000"],
        methods : ["GET", "POST"],
        credentials: true
    }
});

const userSocketMap = {};
const userIdMap = {};
const gameRooms = {}; // Store game rooms and players
let matchmakingQueue = [];

export const isInRoom = (roomId) =>{
  return gameRooms[roomId] != null
}


export const getReceiverSocketId = (receiverId) =>{
    return userSocketMap[receiverId];
};

io.on("connection", (socket) => {

  const userId = socket.handshake.query?.userId;

  console.log("New player connected:", socket.id);

  if(userId){
    userSocketMap[userId] = socket.id;
    io.emit("online_users",Object.keys(userSocketMap));
  }
  
  
  // Handle joining a game room
  socket.on("joinGame", (room) => {
    socket.join(room);

    if (!gameRooms[room]) gameRooms[room] = [];
    gameRooms[room].push(socket.id);

    console.log(`Player joined room: ${room}`);

    // Assign colors to players
    if (gameRooms[room].length === 1) {
      io.to(socket.id).emit("assignColor", "white");
    } else if (gameRooms[room].length === 2) {
      io.to(socket.id).emit("assignColor", "black");
      console.log("In room",room);
      io.to(room).emit("startGame", { message: "Game started!" });
    }
  });

  // Add player to the queue
  socket.on("joinQueue", () => {
    if (!matchmakingQueue.includes(socket.id)) {
      matchmakingQueue.push(socket.id);
      
      //
      userIdMap[socket.id] = userId;

      console.log(`Player ${socket.id} added to matchmaking queue.`);
      checkForMatch();
    }
  });

  socket.on("joinGameAgain",(roomId)=>{
    console.log("roomId : "+roomId);
    if(!roomId ) return console.log("In joinGameAgain > socket.js error");
     socket.join(roomId);
  })

  socket.on("reload", (room) => {
    console.log(room);
   io.emit("reloaded", room)
  });

  // Handle move events
  socket.on("movePiece", ({ room, move }) => {
    socket.to(room).emit("updateBoard", move);
  });

  socket.on("resign", (room) => {
    console.log("yes", room);
    if(gameRooms[room]){
      socket.broadcast.to(room).emit("resigned", room);
    }
  })
  
  socket.on("drawRequest", (room) => {
    if(gameRooms[room]){
      socket.broadcast.to(room).emit("newDrawRequest");
    }
  });

  socket.on("drawAccepted", (room) => {
    if(gameRooms[room]){
      socket.broadcast.to(room).emit("drawResult", room);
    }
  })

  socket.on("gameOver",(room)=>{
    if(room){
      socket.leave(room);
      if(gameRooms[room]){
        delete gameRooms[room];
      }
    }
    console.log("gameRooms",gameRooms)
  })

  socket.on("isCheckmated",(room)=>{
    if(room){
      socket.to(room).emit("checkmate",room);
    }
  })


  socket.on("friend-request",({ receiverId, notification})=>{
    const socketId = userSocketMap[receiverId];
    socket.to(socketId).emit("hasfriendRequest",notification);
  })

  socket.on("accept-friend-request", ({ requestId, notification, sender })=>{
    const socketId = userSocketMap[requestId];
    socket.to(socketId).emit("hasAcceptRequest",{ notification: [notification], sender });
  });

  socket.on("checkmate",(data)=>{
    socket.to(room).emit("updateBoard", data)
  })

  socket.on("game-request",({ id, notification})=>{
    const newNotification = [notification]
    const socketId = userSocketMap[id];
    socket.to(socketId).emit("hasGameRequest",newNotification);
  });

  socket.on("accept-game-request",({ id, notification, userId})=>{
    const newNotification = [notification]
    const socketId = userSocketMap[id];
    socket.to(socketId).emit("hasAccepted",{ newNotification, userId });
  })

  // Handle disconnection
  socket.on("disconnect", () => {

    delete userSocketMap[userId];
    delete userIdMap[socket.id];
    io.emit("online_users", Object.keys(userSocketMap)); // Notify others
    
    for (const room in gameRooms) {
      if(gameRooms[room]){
        gameRooms[room] = gameRooms[room].filter((id) => id !== socket.id);
        if (gameRooms[room].length === 0) delete gameRooms[room];
      }
      
    }
    console.log("Player disconnected:", socket.id);
    console.log("disconnection",userSocketMap)
  });
});

// Create room and notify players
function checkForMatch() {
  if (matchmakingQueue.length >= 2) {
      const [player1, player2] = matchmakingQueue.splice(0, 2);
      const roomId = `room_${player1}_${player2}`;

      console.log(`Match Found: ${player1} vs ${player2} in ${roomId}`);

      const socket1 = io.sockets.sockets.get(player1);
      const socket2 = io.sockets.sockets.get(player2);

      if (socket1 && socket2) {
        socket1.join(roomId);
        socket2.join(roomId);

        gameRooms[roomId] = [socket1,socket2];

        io.to(player1).emit("matchFound", { roomId, color: "white", opponentId: userIdMap[player2] });
        io.to(player2).emit("matchFound", { roomId, color: "black", opponentId: userIdMap[player1] });

        io.to(roomId).emit("startRandomGame", { roomId });
      } 
      else {
        console.log("One or both players disconnected before match start.");
      }
  }
}

export { app, io, server };