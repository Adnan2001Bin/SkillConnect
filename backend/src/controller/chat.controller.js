import { User } from "../models/auth/user.model.js";
import { Chat } from "../models/chat.model.js";

export const chatController = {
  // Start or get a chat between user and talent
  startChat: async (req, res) => {
    try {
      const { talentId } = req.body;
      const userId = req.user.id;

      // Validate participants
      const user = await User.findById(userId);
      const talent = await User.findById(talentId);

      if (!user || !talent) {
        return res.status(404).json({
          success: false,
          message: "User or talent not found",
        });
      }

      if (talent.role !== "talent") {
        return res.status(400).json({
          success: false,
          message: "Recipient must be a talent",
        });
      }

      // Check if chat already exists
      let chat = await Chat.findOne({
        participants: { $all: [userId, talentId] },
      });

      if (!chat) {
        chat = new Chat({
          participants: [userId, talentId],
          messages: [],
        });
        await chat.save();
      }

      res.status(200).json({
        success: true,
        message: "Chat started successfully",
        chatId: chat._id,
      });
    } catch (error) {
      console.error("Error starting chat:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while starting the chat",
      });
    }
  },

  // Send a message
  sendMessage: async (req, res) => {
    try {
      const { chatId, content } = req.body;
      const senderId = req.user.id;

      if (!content || !chatId) {
        return res.status(400).json({
          success: false,
          message: "Chat ID and message content are required",
        });
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      // Verify sender is a participant
      if (!chat.participants.includes(senderId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You are not a participant in this chat",
        });
      }

      const newMessage = {
        sender: senderId,
        content,
        timestamp: new Date(),
        isRead: false,
      };

      chat.messages.push(newMessage);
      chat.lastMessage = new Date();
      await chat.save();

      res.status(200).json({
        success: true,
        message: "Message sent successfully",
        newMessage,
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while sending the message",
      });
    }
  },

  // Get all chats for a user
  getChats: async (req, res) => {
    try {
      const userId = req.user.id;

      const chats = await Chat.find({
        participants: userId,
      })
        .populate("participants", "name email role profileImage")
        .sort({ lastMessage: -1 });

      res.status(200).json({
        success: true,
        message: "Chats retrieved successfully",
        chats,
      });
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while fetching chats",
      });
    }
  },

  // Get messages in a specific chat
  getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await Chat.findById(chatId).populate(
        "messages.sender",
        "name email profileImage"
      );

      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      if (!chat.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You are not a participant in this chat",
        });
      }

      // Mark messages as read
      chat.messages.forEach((message) => {
        if (message.sender.toString() !== userId && !message.isRead) {
          message.isRead = true;
        }
      });
      await chat.save();

      res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        messages: chat.messages,
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while fetching messages",
      });
    }
  },

  // Delete a chat
  deleteChat: async (req, res) => {
    try {
      const { chatId } = req.params;
      const userId = req.user.id;

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      if (!chat.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You are not a participant in this chat",
        });
      }

      await Chat.deleteOne({ _id: chatId });

      res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while deleting the chat",
      });
    }
  },

  // Delete a message
  deleteMessage: async (req, res) => {
    try {
      const { chatId, messageId } = req.params;
      const userId = req.user.id;

      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }

      if (!chat.participants.includes(userId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You are not a participant in this chat",
        });
      }

      const message = chat.messages.id(messageId);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      if (message.sender.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only delete your own messages",
        });
      }

      chat.messages.pull({ _id: messageId });
      await chat.save();

      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({
        success: false,
        message: error.message || "An error occurred while deleting the message",
      });
    }
  },
};