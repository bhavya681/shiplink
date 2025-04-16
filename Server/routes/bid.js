import express from "express";
import { placeBid, getBidsForShipment, acceptBid, rejectBid, getBids } from "../controllers/bid.js";
import fetchUser from "../middleware/fetchUser.js";

const router = express.Router();

router.post("/:shipmentId", fetchUser, placeBid);
router.get("/:shipmentId", fetchUser, getBidsForShipment);
router.put("/:bidId/accept", fetchUser, acceptBid);
router.put("/:bidId/reject", fetchUser, rejectBid);
router.get("/get/bids", getBids);

export default router;
