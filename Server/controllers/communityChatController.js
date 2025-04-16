import CommunityMessage from "../model/CommunityMessage.js";

// ✅ Fetch all messages for a specific community
export const getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const messages = await CommunityMessage.find({ communityId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};

// ✅ Send a message in a community
export const sendCommunityMessage = async (req, res) => {
  try {
    const { communityId, senderId, senderName, message } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ message: "Sender ID and message are required" });
    }

    const newMessage = new CommunityMessage({ communityId, senderId, senderName, message });
    await newMessage.save();

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    res.status(500).json({ message: "Error sending message" });
  }
};