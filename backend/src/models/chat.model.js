import mongoose from "mongoose";



const chatSchema = new mongoose.Schema(
    {
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      messages: [
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          content: {
            type: String,
            required: true,
            trim: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
          isRead: {
            type: Boolean,
            default: false,
          },
        },
      ],
      lastMessage: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );
  
 export const Chat = mongoose.model("Chat", chatSchema);