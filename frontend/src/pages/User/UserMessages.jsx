import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router";
import Loader from "@/components/Loader/Loader";
import {
  FaPaperPlane,
  FaTimes,
  FaCheck,
  FaCheckDouble,
  FaTrash,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const chatItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  hover: {
    scale: 1.02,
    backgroundColor: "#e5e7eb",
    transition: { duration: 0.2 },
  },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const UserMessages = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for chatId in URL to auto-select a chat
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get("chatId");
    if (chatId && chats.length > 0) {
      const chat = chats.find((c) => c._id === chatId);
      if (chat) setSelectedChat(chat);
    }
  }, [location.search, chats]);

  // Fetch all chats on component mount
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoadingChats(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/list`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setChats(data.chats);
      } catch (error) {
        toast.error(error.message || "Failed to fetch chats", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoadingChats(false);
      }
    };

    if (user) fetchChats();
  }, [user]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      setIsLoadingMessages(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${
            selectedChat._id
          }/messages`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);
        setMessages(data.messages);
      } catch (error) {
        toast.error(error.message || "Failed to fetch messages", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setIsSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId: selectedChat._id,
            content: newMessage,
          }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const newMessageWithSender = {
        ...data.newMessage,
        sender: {
          _id: user._id,
          name: user.name,
          role: user.role,
        },
      };

      setMessages((prev) => [...prev, newMessageWithSender]);
      setNewMessage("");

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, lastMessage: new Date() }
            : chat
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to send message", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSending(false);
    }
  };

  // Custom confirmation toast for delete actions
  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2 p-2">
          <p className="text-sm">{message}</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: "bg-white shadow-lg rounded-lg",
      }
    );
  };

  // Handle deleting a chat
  const handleDeleteChat = () => {
    if (!selectedChat) return;

    confirmToast("Are you sure you want to delete this chat?", async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${selectedChat._id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        setChats((prev) =>
          prev.filter((chat) => chat._id !== selectedChat._id)
        );
        setSelectedChat(null);
        setMessages([]);
        toast.success("Chat deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(error.message || "Failed to delete chat", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

  // Handle deleting a message
  const handleDeleteMessage = (messageId) => {
    confirmToast("Are you sure you want to delete this message?", async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/${
            selectedChat._id
          }/message/${messageId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!data.success) throw new Error(data.message);

        setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
        toast.success("Message deleted successfully", {
          position: "top-right",
          autoClose: 3000,
        });
      } catch (error) {
        toast.error(error.message || "Failed to delete message", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    });
  };

  // Handle chat selection
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
  };

  // Get the talent's name from participants
  const getOtherParticipant = (chat) => {
    const talentParticipant = chat.participants.find(
      (participant) => participant.role === "talent"
    );
    return talentParticipant ? talentParticipant.name : "Unknown Talent";
  };

  if (authLoading || isLoadingChats) {
    return <Loader text="Loading messages..." />;
  }

  if (!user || user.role !== "user") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-red-500 text-center text-sm sm:text-base">
          Unauthorized: You must be a user to view this page.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8 flex flex-col lg:flex-row gap-6 h-[80vh]">
          {/* Chat List */}
          <div className="w-full lg:w-1/3 bg-gray-100 rounded-lg p-4 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Chats
            </h2>
            {chats.length === 0 ? (
              <p className="text-gray-500 text-sm">No chats yet.</p>
            ) : (
              chats.map((chat) => (
                <motion.div
                  key={chat._id}
                  variants={chatItemVariants}
                  whileHover="hover"
                  onClick={() => handleSelectChat(chat)}
                  className={`p-3 mb-2 rounded-lg cursor-pointer ${
                    selectedChat?._id === chat._id
                      ? "bg-teal text-white"
                      : "bg-white"
                  }`}
                  style={{
                    backgroundColor:
                      selectedChat?._id === chat._id ? "#4da59b" : "#fff",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-white text-sm">
                        {getOtherParticipant(chat).slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {getOtherParticipant(chat)}
                      </p>
                      <p className="text-xs truncate">
                        {chat.messages.length > 0
                          ? chat.messages[chat.messages.length - 1].content
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Chat Messages */}
          <div className="w-full lg:w-2/3 bg-gray-100 rounded-lg p-4 flex flex-col">
            {selectedChat ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Chat with {getOtherParticipant(selectedChat)}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeleteChat}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Chat"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => setSelectedChat(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg">
                  {isLoadingMessages ? (
                    <Loader text="Loading messages..." />
                  ) : messages.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      No messages yet.
                    </p>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={index}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        className={`mb-4 flex relative group ${
                          message.sender._id === user._id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-2xl shadow-sm ${
                            message.sender._id === user._id
                              ? "bg-green-500 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <p className="text-xs opacity-75">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                            {message.sender._id === user._id && (
                              <span className="text-xs opacity-75">
                                {message.isRead ? (
                                  <FaCheckDouble className="text-blue-300" />
                                ) : (
                                  <FaCheck className="text-gray-300" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        {message.sender._id === user._id && (
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Delete Message"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        )}
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    {isSending ? "Sending..." : "Send"}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                  Select a chat to start messaging.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <ToastContainer />
    </>
  );
};

export default UserMessages;
