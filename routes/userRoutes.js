import express from "express";
import { login, signup } from "../controllers/userController.js";
import { sendMessage } from "../controllers/messagesController.js";
const router=express.Router()
router.post('/signup',signup)
router.post('/login',login)
router.post('/sendMessage',sendMessage)
export default router