import cron from "node-cron";
import { Shipment } from "../model/Shipment.js";

// Run every 15 minutes to check for expired shipments
export const startShipmentExpiryChecker = () => {
  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log("Checking for expired shipments...");
      const result = await Shipment.updateExpiredShipments();
      if (result.modifiedCount > 0) {
        console.log(`✅ ${result.modifiedCount} shipments marked as expired.`);
      }
    } catch (error) {
      console.error("❌ Error in shipment expiry checker:", error);
    }
  });
};
