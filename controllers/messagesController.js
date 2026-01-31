
import { getIO, getUserSocket } from "../socket/socket.js";
import Message from '../models/Messages.js'
export const sendMessage = async (req, res) => {
  try {
    const { message, sender, receiver } = req.body;
    console.log(req.body);
    
    if (!receiver) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }
    
    const newMessage = await Message.create({ message, sender, receiver });
    const io = getIO();
    
    // Get receiver's socket ID
    console.log(receiver,"receiver")
    const receiverSocketId = getUserSocket(receiver);
    console.log("receiverSocketId",receiverSocketId);
    if (receiverSocketId) {

      io.to(receiverSocketId).emit("new_message", newMessage);
      console.log(`📨 Message sent to user ${receiver} (socket: ${receiverSocketId})`);
    } else {
      console.log(`⚠️ User ${receiver} is not connected`);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};