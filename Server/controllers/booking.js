import Booking from "../model/Booking.js";
import Shipment from "../model/Shipment.js";
import User from "../model/User.js";

/**
 * @desc Apply for a shipment (Shipper)
 * @route POST /api/bookings/apply
 * @access Private (Shipper Only)
 */
export const applyForShipment = async (req, res) => {
  try {
    const { shipmentId } = req.body;
    const shipperId = req.userId;

    // Validate shipment
    const shipment = await Shipment.findById(shipmentId).populate("user");
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    // Ensure the shipper is not the owner of the shipment
    if (shipment.user.id.toString() === shipperId) {
      return res
        .status(403)
        .json({ message: "You cannot apply for your own shipment" });
    }

    // Check if the shipper has already applied
    const existingBooking = await Booking.findOne({
      shipment: shipmentId,
      shipper: shipperId,
    });
    if (existingBooking)
      return res
        .status(400)
        .json({ message: "You have already applied for this shipment" });

    // Create new booking request
    const booking = new Booking({
      shipment: shipmentId,
      shipper: shipperId,
      user: shipment.user,
      status: "pending",
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc Get all bookings made by the shipper
 * @route GET /api/bookings/shipper
 * @access Private (Shipper)
 */
export const getShipperBookings = async (req, res) => {
  try {
    const shipperId = req.userId;
    const bookings = await Booking.find({ shipper: shipperId }).populate(
      "user shipment"
    );
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc Get all booking requests for a shipment owner
 * @route GET /api/bookings/user
 * @access Private (User)
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({
      user: userId,
    }).populate("shipment shipper", "-password");
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc Accept or Reject a booking request
 * @route PUT /api/bookings/:id
 * @access Private (Shipment Owner)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.userId;
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Ensure only shipment owner can accept/reject
    if (booking.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this booking" });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
        return res.status(404).json({ success: false, message: "Booking not found" });
      }
  
      return res
        .status(200) // Use 200 for successful deletion
        .json({ success: true, message: "Successfully Deleted Booking" });
  } catch (error) {
    return res.json({ success: false, message: "Internal Server Error" });
  }
};
