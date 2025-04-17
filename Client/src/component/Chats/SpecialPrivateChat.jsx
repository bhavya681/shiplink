import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
  FiSend,
  FiImage,
  FiPaperclip,
  FiSmile,
  FiMoreVertical,
  FiVideo,
  FiMic,
  FiChevronDown,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";
import {
  BsCheck2All,
  BsCheck2,
  BsThreeDotsVertical,
  BsReply,
} from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import { RiChatNewLine } from "react-icons/ri";
import { BiMicrophone } from "react-icons/bi";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

const socket = io("https://shiplink.onrender.com", {
  transports: ["websocket", "polling"],
});

const SpecialPrivateChat = ({user1,user2}) => {
//   const { user1, user2 } = useParams();
  const chatroomId = [user1, user2].sort().join("_");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeaderShadow, setShowHeaderShadow] = useState(false);

  const handleEmojiPicker = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setShowPicker(true);
  };

  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/auth/user/profile`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data?.profileDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReceiverDetails();
    fetchCurrentUser();
    fetchMessages();
    socket.emit("joinRoom", chatroomId);

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("typing", () => {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [user1, user2, chatroomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchReceiverDetails = async () => {
    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/auth/user/${user2}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setReceiverDetails(data?.profile);
      }
    } catch (error) {
      console.error("Error fetching receiver details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/chats/private/${user1}/${user2}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleTyping = () => {
    socket.emit("typing", chatroomId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatroomId,
      sender: user1,
      message: newMessage,
      isAnonymous: false,
    };

    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        sender: { _id: user1 },
        createdAt: new Date().toISOString(),
      },
    ]);
    socket.emit("sendMessage", messageData);

    try {
      await fetch(`https://shiplink.onrender.com/api/v1/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: JSON.stringify(messageData),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setNewMessage("");
    setShowPicker(false);
    // scrollToBottom();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0f2f5]">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-14 w-14 border-t-2 border-b-2 border-[#00a884] mb-4"
          ></motion.div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600"
          >
            Loading conversation...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[1000vh] bg-gray-50 shadow-md  overflow-scroll">
      {/* Premium Chat Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`bg-gray-50 p-4 py-2 flex items-center justify-between shadow  shadow-gray-200 rounded-md z-10 transition-all duration-300 ${
          showHeaderShadow ? "shadow-sm" : ""
        }`}
      >
        <div className="hidden sm:flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
          >
            <FiArrowLeft
              className="h-5 w-5"
              onClick={() => {
                navigate(-1);
              }}
            />
          </motion.button>
          <div className="relative">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <img
                src={receiverDetails?.profile}
                alt={receiverDetails?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></motion.span>
            </motion.div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {receiverDetails?.name}
            </h2>
            <p className="text-xs text-gray-600">
              {isTyping ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center"
                >
                  <span className="animate-pulse">typing</span>
                  <span className="ml-1 flex space-x-1">
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full"
                    ></motion.span>
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                      className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full"
                    ></motion.span>
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                      className="inline-block w-1.5 h-1.5 bg-gray-500 rounded-full"
                    ></motion.span>
                  </span>
                </motion.span>
              ) : (
                "online"
              )}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Chat messages area with enhanced styling */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] bg-opacity-90 bg-[url('https://transparenttextures.com/patterns/cubes.png')]"
        // onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto space-y-3">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-full py-16"
            >
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md border border-gray-200">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RiChatNewLine className="h-16 w-16 text-[#00a884] mx-auto mb-4 opacity-90" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start your conversation with {receiverDetails?.name}
                </p>
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="inline-flex items-center text-[#00a884] font-medium"
                >
                  <span>Type a message</span>
                  <FiChevronDown className="ml-1" />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            messages.map((msg, index) => {
              const showDate =
                index === 0 ||
                new Date(msg.createdAt).toDateString() !==
                  new Date(messages[index - 1].createdAt).toDateString();

              return (
                <React.Fragment key={index}>
                  {showDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-center my-4"
                    >
                      <span className="bg-white text-xs text-gray-600 px-3 py-1 rounded-full shadow-sm border border-gray-200">
                        {formatDate(msg.createdAt)}
                      </span>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`flex ${
                      msg.sender._id === user1 ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex max-w-xs lg:max-w-md">
                      {msg.sender._id !== user1 && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0 mr-2 self-end"
                        >
                          <img
                            src={receiverDetails?.profile}
                            alt={receiverDetails?.name}
                            className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
                          />
                        </motion.div>
                      )}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`relative px-3 py-2 rounded-lg ${
                          msg.sender._id === user1
                            ? "bg-gradient-to-r from-[#7dc9f8] to-[#508dd9] text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}
                        style={{
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        }}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                            msg.sender._id === user1
                              ? "text-white/80"
                              : "text-gray-400"
                          }`}
                        >
                          <span className="text-[0.6875rem]">
                            {formatTime(msg.createdAt)}
                          </span>
                          {msg.sender._id === user1 && (
                            <span className="ml-1">
                              {msg.read ? (
                                <BsCheck2All className="text-white" />
                              ) : (
                                <BsCheck2 className="text-white/80" />
                              )}
                            </span>
                          )}
                        </div>
                       
                      </motion.div>
                      {msg.sender._id === user1 && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0 ml-2 self-end"
                        >
                          <img
                            src={currentUser?.profile}
                            alt={currentUser?.name}
                            className="w-8 h-8 rounded-full object-cover shadow-sm border border-gray-200"
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToBottom}
            className="fixed right-6 bottom-24 bg-white p-3 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors z-20"
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.15)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronDown className="text-gray-600" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Premium Message Input Area */}
      <div className="bg-gradient-to-r from-[#e7eefa] to-[#d9e3f8] p-4 py-2 border-t border-gray-200">
        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence>
            {showAttachmentMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 left-0 bg-white rounded-xl shadow-xl p-3 w-64 z-10 border border-gray-200"
                style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}
              >
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: FiImage, color: "#25D366", label: "Photo" },
                    { icon: FiVideo, color: "#25D366", label: "Video" },
                    { icon: FiPaperclip, color: "#25D366", label: "Document" },
                    { icon: BiMicrophone, color: "#25D366", label: "Audio" },
                    { icon: BsReply, color: "#25D366", label: "Reply" },
                  ].map((item, i) => (
                    <motion.button
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      key={i}
                      className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-50 transition-all"
                    >
                      <div
                        className={`p-2 rounded-full mb-1`}
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon
                          className={`h-5 w-5`}
                          style={{ color: item.color }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPicker && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-16 right-0 z-10"
              >
                <EmojiPicker
                  onEmojiClick={handleEmojiPicker}
                  width={300}
                  height={350}
                  previewConfig={{ showPreview: false }}
                  theme="light"
                  searchDisabled={false}
                  skinTonesDisabled={true}
                  lazyLoadEmojis={true}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
            >
              <FiPaperclip className="h-5 w-5 rotate-45" />
            </motion.button>

            <div className="flex-1 relative mx-2">
              <input
                ref={inputRef}
                type="text"
                className="w-full py-1 px-3 focus:outline-none text-gray-800 placeholder-gray-500 bg-transparent"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                onFocus={() => {
                  setShowPicker(false);
                  setShowAttachmentMenu(false);
                }}
              />
            </div>

            <div className="flex items-center space-x-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowPicker(!showPicker);
                  setShowAttachmentMenu(false);
                }}
              >
                <FiSmile />
              </motion.button>

              {newMessage.trim() ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-2 rounded-full text-white transition-all"
                  style={{ backgroundColor: "#00a884" }}
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <BiMicrophone className="h-5 w-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialPrivateChat;
