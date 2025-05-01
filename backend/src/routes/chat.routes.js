import express from "express"
import {verifyToken} from '../config/middleware.js'
import { chatController } from "../controller/chat.controller.js";

const chatRouter = express.Router();

chatRouter.post("/start", verifyToken, chatController.startChat);
chatRouter.post("/message", verifyToken, chatController.sendMessage);
chatRouter.get("/list", verifyToken, chatController.getChats);
chatRouter.get("/:chatId/messages", verifyToken, chatController.getMessages);
chatRouter.delete("/:chatId", verifyToken, chatController.deleteChat); // New route for deleting a chat
chatRouter.delete("/:chatId/message/:messageId", verifyToken, chatController.deleteMessage); // New route for deleting a message

export default chatRouter;