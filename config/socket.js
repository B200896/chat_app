// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import Message from "./models/Message.js";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ----------------- MongoDB ----------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

/* ----------------- Socket.IO ----------------- */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // send old messages when user joins
  socket.on("join_chat", async () => {
    const messages = await Message.find().sort({ createdAt: 1 });
    socket.emit("chat_history", messages);
  });

  // new message
  socket.on("send_message", async (data) => {
    const newMessage = await Message.create({
      username: data.username,
      message: data.message,
      socketId: socket.id,
    });

    // broadcast to all users
    io.emit("receive_message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ----------------- Server ----------------- */
server.listen(5000, () =>
  console.log("Server running on port 5000")
);