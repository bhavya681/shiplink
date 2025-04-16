// @desc Create a new shipment listing
// @route POST /listing/post

import Shipment from "../model/Shipment.js";
// Shipment controller (assuming you're using something like Express)
export const listShipment = async (req, res) => {
  try {
    const user = req.userId;
    const {
      pickupLocation,
      title,
      dropoffLocation,
      weight,
      shipmentType,
      fixedPrice,
      image,
      expiresAt,status
    } = req.body;

    // Validate shipmentType
    if (!shipmentType || !["bidding", "fixed"].includes(shipmentType)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid shipment type." });
    }

    // Validate fixed price for "fixed" type
    if (shipmentType === "fixed" && (!fixedPrice || fixedPrice <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Fixed price must be greater than 0 for direct bookings.",
      });
    }

    // Determine expiration time
    let expirationDuration = shipmentType === "bidding" ? 48 : 24; // Default expiration in hours
    if (typeof expiresAt === "number" && expiresAt > 0) {
      expirationDuration = expiresAt * 24; // Convert days to hours
    }
    const expirationDate = new Date(
      Date.now() + expirationDuration * 60 * 60 * 1000
    );

    // Create shipment
    const shipment = new Shipment({
      pickupLocation,
      dropoffLocation,
      weight,
      title,
      shipmentType,
      image,
      fixedPrice: shipmentType === "fixed" ? fixedPrice : null,
      user,
      expiresAt: expirationDate,
      status,
    });

    await shipment.save();

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    // Ensure only the owner can delete the shipment
    if (shipment.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized action" });
    }

    await Shipment.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Shipment deleted successfully" });
  } catch (error) {
    console.error("Delete Shipment Error:", error); // Improved Logging
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc Fetch all shipments (for shippers)
// @route GET /listing/all
// @access Public
export const fetchAll = async (req, res) => {
  try {
    const shipments = await Shipment.find()
      .populate("user", "name email profile location")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, shipments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc Fetch a specific user's shipments
// @route GET /listing/:id
// @access Private (User)
export const fetchMine = async (req, res) => {
  const id = req.userId;
  try {
    const shipments = await Shipment.findById(req.params.id);

    res.status(200).json({ success: true, shipments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const getShipmentById = async (req,res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findById(id);
    // if (!shipment) {
    //  return res.status(404).json({ success: false, message: "Shipment Not Found" });
    // }
   return res
      .status(200)
      .json({ success: true, message: "Successfully Fetched", shipment ,id});
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// @desc Edit a shipment listing
// @route PUT /listing/edit/:id
// @access Private (Owner Only)

export const editShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Fetch existing shipment
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    //   // Prevent updates if shipment is already expired
    //   if (shipment.status === "expired") {
    //     return res.status(400).json({ success: false, message: "Cannot update an expired shipment." });
    //   }

    // Prevent modifying restricted fields
    const { user, createdAt, ...allowedUpdates } = updates;

    // If shipmentType changes, update expiration time
    if (
      updates.shipmentType &&
      updates.shipmentType !== shipment.shipmentType
    ) {
      const expirationDuration = updates.shipmentType === "bidding" ? 48 : 24;
      allowedUpdates.expiresAt = new Date(
        Date.now() + expirationDuration * 60 * 60 * 1000
      );
    }

    // Validate fixed price if changing to "fixed" type
    if (updates.shipmentType === "fixed" && !updates.fixedPrice) {
      return res.status(400).json({
        success: false,
        message: "Fixed price is required for direct bookings.",
      });
    }

    const updatedShipment = await Shipment.findByIdAndUpdate(
      id,
      allowedUpdates,
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "Shipment updated successfully",
      shipment: updatedShipment,
    });
  } catch (error) {
    console.error("Error updating shipment:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export const fetchMyShipments = async (req, res) => {
  try {
    // Get the logged-in user's ID
    const userId = req.userId;

    // Find all shipments where the `user` field matches the logged-in user's ID
    const shipments = await Shipment.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!shipments.length) {
      return res
        .status(404)
        .json({ success: false, message: "No shipments found for this user." });
    }

    res.status(200).json({ success: true, shipments });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
