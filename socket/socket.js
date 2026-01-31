import { Server } from "socket.io";

let io; // 🔥 GLOBAL IO INSTANCE
const userSockets = new Map(); // Store userId -> socketId mapping

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  console.log("✅ Socket Initialized");

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // Listen for user identification event
    socket.on("register_user", (userId) => {
      console.log(userId,"userId");
      const id=Object.values(userId);
      console.log(id,"id")
      userSockets.set(id[0], socket.id);
      console.log(`📝 User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Remove user from mapping when they disconnect
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`🗑️ User ${userId} removed from mapping`);
          break;
        }
      }
      console.log("🔴 Client disconnected:", socket.id);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

// Helper function to get socketId by userId
export const getUserSocket = (userId) => {
  console.log(userSockets,"userSockets")
  return userSockets.get(userId);
};