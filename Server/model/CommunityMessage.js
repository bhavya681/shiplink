import mongoose from "mongoose";

const communityMessageSchema = new mongoose.Schema(
  {
    communityId: { type: String, required: true }, // Community name or ID
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const community= mongoose.model("CommunityMessage", communityMessageSchema);
export default community;