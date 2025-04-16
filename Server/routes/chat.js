import express from "express";
import fetchUser from "../middleware/fetchUser.js";
import {
  sendMessage,
  getChatMessages,
  getChatroomMessages,
} from "../controllers/chat.js";

const router = express.Router();

// Send a message (Private or Chatroom)
router.post("/", fetchUser, sendMessage);

// Get messages for a private chat between two users
router.get("/private/:userId1/:userId2", fetchUser, getChatMessages);

// Get messages for a chatroom
router.get("/chatroom", fetchUser, getChatroomMessages);

export default router;
