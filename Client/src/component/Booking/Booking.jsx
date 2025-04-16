import React from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const Booking = () => {
  const { id } = useParams();
  const navigate=useNavigate();

  const requestShipment = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:8000/api/v1/bookings/apply`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shipmentId: id }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Successfully Requested Shipment");
        navigate("/bookings")
      } else {
        toast.error(data.message || "Error requesting shipment");
      }
    } catch (error) {
      console.error("Request Shipment Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          🚀 Apply for Shipment
        </h2>
        <p className="text-gray-600 text-sm text-center mb-6">
          Securely request this shipment with a single click.
        </p>
        <form onSubmit={requestShipment} className="flex flex-col space-y-4">
          <button
            type="submit"
            className="w-full py-3 text-white font-medium text-lg rounded-xl transition-all bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 transform hover:scale-105 shadow-lg"
          >
            Request Shipment 📦
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
