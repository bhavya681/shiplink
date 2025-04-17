import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BookingBidWinner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const autoRequestShipment = async () => {
      try {
        const res = await fetch(`https://shiplink.onrender.com/api/v1/bookings/apply`, {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shipmentId: id }),
        });

        const data = await res.json();
        if (data.success) {
          toast.success("🚀 Shipment Requested Successfully!");
          navigate("/bookings");
        } else {
          toast.error(data.message || "Error requesting shipment");
        }
      } catch (error) {
        console.error("Request Shipment Error:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    autoRequestShipment();
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-6 border border-gray-300"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          🚀 Processing Request...
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Please wait while we request the shipment for you.
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-dotted rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/bookings")}
            className="w-full py-3 text-white font-medium text-lg rounded-xl transition-all bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transform hover:scale-105 shadow-lg"
          >
            Go to Bookings 📦
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default BookingBidWinner;
