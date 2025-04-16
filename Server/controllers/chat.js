import Chat from "../model/Chat.js";

// ✅ Send Message (User-to-User or Chatroom)
export const sendMessage = async (req, res) => {
  try {
      const { chatroomId, message, isAnonymous } = req.body;
      const sender = req.userId;

      if (!chatroomId || !message) {
          return res.status(400).json({ message: "Chatroom ID and message are required" });
      }
      
      const newMessage = await Chat.create({ chatroomId, sender, message, isAnonymous });
      const populatedMessage = await newMessage.populate("sender", "name profile");

      res.status(201).json({ message: "Message sent successfully", chat: populatedMessage });
  } catch (error) {
      res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

// ✅ Get Private Chat Messages (User-to-User)
export const getChatMessages = async (req, res) => {
  try {
      const { userId1, userId2 } = req.params;
      const chatroomId = [userId1, userId2].sort().join("_");

      const messages = await Chat.find({ chatroomId })
          .populate("sender", "name profile") // Include sender details
          .sort({ createdAt: 1 }); // Oldest first

      res.status(200).json(messages);
  } catch (error) {
      res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
};


// ✅ Get Chatroom Messages (Public Chatroom)
export const getChatroomMessages = async (req, res) => {
  try {
    const { chatroomId } = req.params;

    const messages = await Chat.find({ chatroomId }).populate("sender", "name profile");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chatroom messages", error: error.message });
  }
};
