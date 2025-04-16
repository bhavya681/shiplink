// import mongoose from "mongoose";

// const BidSchema = new mongoose.Schema(
//     {
//       shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true }, // Related shipment
//       carrier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Carrier who placed the bid
//       bidAmount: { type: Number, required: true }, // Amount carrier bids
//       status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }, // Status of bid
//       createdAt: { type: Date, default: Date.now }
//     },
//     { timestamps: true }
//   );
   
//   export const Bid=mongoose.model("Bid",BidSchema);
//   export default Bid;
  

import mongoose from "mongoose";

const BidSchema = new mongoose.Schema(
  {
    shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
    shipper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Bid = mongoose.model("Bid", BidSchema);
export default Bid;
