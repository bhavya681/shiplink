import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import io from "socket.io-client";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { Smile, SmileIcon } from "lucide-react";
import { BiSmile } from "react-icons/bi";
import { FaRegSmileWink } from "react-icons/fa";

const SOCKET_URL = "https://shiplink.onrender.com";
const API_URL = "https://shiplink.onrender.com/api/v1/community";

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef();
  const [user, setUser] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmojiStuff = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowEmoji(true);
  };

  const token = localStorage.getItem("auth-token");
  const communityId = "general";

  useEffect(() => {
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://shiplink.onrender.com/api/v1/auth/user/profile",
          {
            headers: { "auth-token": token },
          }
        );
        const data = await res.json();
        if (data.success) {
          setUser({
            ...data.profileDetails,
            anonymousId: `Anonymous_${data.profileDetails._id.slice(-4)}`,
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("joinCommunity", { communityId });

    socketRef.current.on("receiveCommunityMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      // scrollToBottom();
    });

    fetchMessages();

    return () => socketRef.current.disconnect();
  }, [token, newMessage]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/${communityId}`, {
        headers: { "auth-token": token },
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages);
        // scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleTyping = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    setIsTyping(true);
    setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageData = {
      communityId,
      senderId: user._id,
      senderName: user.anonymousId,
      message: newMessage.trim(),
      timestamp: new Date(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();
      if (response.ok) {
        socketRef.current.emit("sendCommunityMessage", data.newMessage);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-20">
        <div className="flex flex-col h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {communityId.charAt(0).toUpperCase() + communityId.slice(1)}{" "}
                  Community
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {user ? `Your identity: ${user.anonymousId}` : "Loading..."}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Chat</span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <div className="p-6 space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${
                      msg.senderId === user?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex ${
                        msg.senderId === user?._id
                          ? "flex-row-reverse"
                          : "flex-row"
                      } items-end max-w-[85%] gap-3`}
                    >
                      <img
                        src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${msg.senderId}`}
                        alt="Anonymous"
                        className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all"
                      />
                      <div
                        className={`flex flex-col ${
                          msg.senderId === user?._id
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <motion.div
                          className={`p-3 rounded-xl shadow-sm ${
                            msg.senderId === user?._id
                              ? "bg-blue-100 rounded-br-none"
                              : "bg-gray-100 rounded-bl-none"
                          }`}
                          whileHover={{ scale: 1.02 }}
                        >
                          <p className="text-xs font-medium text-gray-600 mb-1">
                            {msg.senderName}
                          </p>
                          <p className="text-gray-800 leading-relaxed">
                            {msg.message}
                          </p>
                        </motion.div>
                        <span className="text-xs text-gray-400 mt-1 px-1">
                          {moment(msg.createdAt).format("LT")}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-gray-50">
            {showEmoji && (
              <>
                <AnimatePresence>
                  {showEmoji && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-26 right-70 z-10"
                    >
                      <EmojiPicker
                        onEmojiClick={handleEmojiStuff}
                        width={300}
                        height={350}
                        previewConfig={{ showPreview: false }}
                        theme="light"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>{" "}
              </>
            )}
            <form onSubmit={sendMessage} className="p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                  className="flex-1 bg-white text-gray-800 placeholder-gray-400 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Send an anonymous message..."
                />
                <FaRegSmileWink
                  onClick={() => {
                    setShowEmoji(!showEmoji);
                  }}
                  size={40}
                  className="flex text-yellow-300 cursor-pointer justify-center items-ecenter text-center"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3.5 py-0 rounded-lg transition-all flex items-center  hover:scale-105 active:scale-95 shadow-sm"
                >
                  <FiSend size={21} />
                </button>
              </div>
              {isTyping && (
                <p className="text-sm text-gray-500 mt-2 animate-pulse">
                  Someone is typing...
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityChat;
