import express from "express";
import { 
    applyForShipment, 
    getShipperBookings, 
    getUserBookings, 
    updateBookingStatus,deleteBooking
} from "../controllers/booking.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

// Apply for a shipment (Shipper)
router.post("/apply", fetchUser, applyForShipment);

// Get all bookings of a shipper
router.get("/shipper", fetchUser, getShipperBookings);

// Get all booking requests for a shipment owner
router.get("/user", fetchUser, getUserBookings);

// Accept or reject a booking request (Shipment Owner)
router.put("/:id", fetchUser, updateBookingStatus);

router.delete("/:id",fetchUser,deleteBooking);

export default router;
