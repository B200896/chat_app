
import { getIO } from "../socket/socket.js";
import Message from '../models/Messages.js'
export const sendMessage = async (req, res) => {
  try {
    const { message, sender } = req.body;
    const newMessage = await Message.create({ message, sender });
    const io = getIO();
    console.log("io",io)
    console.log("Socket instance:", io ? "Working" : "Not Working");
    io.emit("new_message", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error",error)
    res.status(500).json({ error: error.message });
  }
};
