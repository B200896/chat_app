import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import userRouter from '../chat_app/routes/userRoutes.js'
import  http from "http";
import { initSocket } from "./socket/socket.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
initSocket(server)
server.listen(5000,()=>{
  console.log("Server running on PORT")
})
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

connectDb();
app.get("/", (req, res) => {
  res.send("Chat App Backend Running 🚀");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/users", userRouter);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
