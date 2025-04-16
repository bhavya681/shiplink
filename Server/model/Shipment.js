import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    weight: { type: Number, required: true }, // Weight in KG
    image: { type: String, required: true },
    shipmentType: { type: String, enum: ["bidding", "fixed"], required: true },
    fixedPrice: { type: Number, default: null },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bid" }],
    appliedCarriers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    selectedCarrier: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["open", "bidding", "booked", "in-transit", "delivered", "cancelled", "expired"],
      default: "open",
    },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

// Static method to update expired shipments
ShipmentSchema.statics.updateExpiredShipments = async function () {
  const now = new Date();
  const result = await this.updateMany(
    { expiresAt: { $lte: now }, status: { $ne: "expired" } },
    { $set: { status: "expired" } }
  );
  return result;
};

export const Shipment = mongoose.model("Shipment", ShipmentSchema);
export default Shipment;
