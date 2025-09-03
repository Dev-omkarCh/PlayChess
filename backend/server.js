import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDb from "./db/connectDb.js";
import authRoutes from "./routes/auth.routes.js";
import userRoute from "./routes/user.routes.js";
import messageRoute from "./routes/message.routes.js";
import path from "path";

// app from socket
import { app, server } from "./socket/socket.js";


dotenv.config();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({
  origin : '*',
}));

app.use(express.json())>
app.use(urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoute);
app.use("/api/game/messages", messageRoute);

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
  });
} 


server.listen(PORT,()=>{
  console.log(`App is running at http://localhost:${PORT}`);
  connectDb();
});
