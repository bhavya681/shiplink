// import mongoose from "mongoose";

// const BookingSchema = new mongoose.Schema(
//     {
//       shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
//       carrier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//       shipper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//       status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" }, 
//       createdAt: { type: Date, default: Date.now }
//     },
//     { timestamps: true }
//   );

//  export const Booking = mongoose.model("Booking", BookingSchema);
//  export default Booking;
 

  

import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
    {
        shipment: { type: mongoose.Schema.Types.ObjectId, ref: "Shipment", required: true },
        shipper: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Shipment Owner
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
