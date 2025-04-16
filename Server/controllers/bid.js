import Bid from "../model/Bid.js";
import Shipment from "../model/Shipment.js";

// Place a bid (Shipper)
export const placeBid = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const { amount } = req.body;
    const shipperId = req.userId;

    const shipment = await Shipment.findById(shipmentId);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    if (shipment.shipmentType !== "bidding") {
      return res
        .status(400)
        .json({ message: "This shipment does not accept bidding" });
    }

    const bid = await Bid.create({
      shipment: shipmentId,
      shipper: shipperId,
      amount,
    });
    shipment.bids.push(bid._id);
    await shipment.save();

    res
      .status(201)
      .json({ success: true, message: "Bid placed successfully", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bids for a shipment (User)
export const getBidsForShipment = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const bids = await Bid.find({ shipment: shipmentId }).populate(
      "shipper",
      "name profile"
    );
    res
      .status(200)
      .json({ bids, success: true, message: "Successfully Fetched" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Accept a bid (User)
export const acceptBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId).populate("shipment");
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    bid.status = "accepted";
    await bid.save();

    const shipment = await Shipment.findById(bid.shipment._id);
    shipment.selectedCarrier = bid.shipper;
    shipment.status = "booked";
    await shipment.save();

    res.status(200).json({ success: true, message: "Bid accepted", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a bid (User)
export const rejectBid = async (req, res) => {
  try {
    const { bidId } = req.params;
    const bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    bid.status = "rejected";
    await bid.save();

    res.status(200).json({ success: true, message: "Bid rejected", bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBids = async (req, res) => {
  try {
    const allBids = await Bid.find(); // Fetch all bids

    if (!allBids || allBids.length === 0) {
      return res.status(404).json({ success: false, message: "No Bids Found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Successfully Fetched", bids: allBids });
  } catch (error) {
    res
      .status(500)
      .json({ error: true, message: "Internal Server Error", success: false });
  }
};
