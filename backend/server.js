import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";

import connectDb from "./db/connectDb.js";
import authRoutes from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import User from "./models/user.model.js";
    
const app = express();
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 5000;

app.use(express.json())>
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoute);
    
const gameRooms = {}; // Store game rooms and players
let onlineUsers = {}; // Store users { socketId: username }

io.on("connection", (socket) => {

  // changes : Online Status

  // When a user comes online
   socket.on("user_online", async(id) => {
    onlineUsers[socket.id] = id.toString();

    console.log(onlineUsers);

    // Fetch user's friends
    const user = await User.findById(id).populate("friends");
    const friends = user.friends.map(friend => friend._id.toString());

    // Filter online users who are in the user's friends list
    const onlineFriends = Object.values(onlineUsers).filter(id => friends.includes(id));

    io.to(socket.id).emit("update_users", onlineFriends); // Send only friends
  });

  // end

  console.log("New player connected:", socket.id);
  
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
      io.to(room).emit("startGame", { message: "Game started!" });
    }
  });

  // Handle move events
  socket.on("movePiece", ({ room, move }) => {
    socket.to(room).emit("updateBoard", move);
  });

  // Handle disconnection
  socket.on("disconnect", () => {

    // changes : Online Status
    delete onlineUsers[socket.id];
    io.emit("update_users", Object.values(onlineUsers)); // Notify others

    // end

    for (const room in gameRooms) {
      gameRooms[room] = gameRooms[room].filter((id) => id !== socket.id);
      if (gameRooms[room].length === 0) delete gameRooms[room];
    }
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(PORT,()=>{
        console.log(`App is running at http://localhost:${PORT}`);
        connectDb();
});
