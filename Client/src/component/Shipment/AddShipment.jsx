import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddShipment = () => {
  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    weight: "",
    shipmentType: "fixed",
    fixedPrice: "",
    title: "",
    image: "",
    status: "open", // Default status to "open"
    expiresAt: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const statusOptions = [
    "open",
    "bidding",
    "booked",
    "in-transit",
    "delivered",
    "cancelled",
    "expired",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (
      !form.title ||
      !form.pickupLocation ||
      !form.dropoffLocation ||
      !form.weight ||
      !form.image ||
      !form.status ||
      !form.expiresAt
    ) {
      setIsSubmitting(false);
      return toast.error("Please fill in all required fields.");
    }

    if (form.shipmentType === "fixed" && !form.fixedPrice) {
      setIsSubmitting(false);
      return toast.error("Fixed price is required for direct bookings.");
    }

    // Ensure valid status before submitting
    const validStatuses = ["open", "bidding", "booked", "in-transit", "delivered", "cancelled", "expired"];
    if (!validStatuses.includes(form.status)) {
      setIsSubmitting(false);
      return toast.error("Invalid status selected.");
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/shipment/listing/post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Shipment created successfully!");
        navigate('/get/my/shipments');
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📦 Add New Shipment
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pickup Location Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Pickup Location</label>
            <input
              type="text"
              name="pickupLocation"
              placeholder="Enter pickup location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.pickupLocation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dropoff Location Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Dropoff Location</label>
            <input
              type="text"
              name="dropoffLocation"
              placeholder="Enter dropoff location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.dropoffLocation}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              name="status"
              className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={handleChange}
            >
              {statusOptions.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Expiration Date Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Expiration Date:</label>
            <input
              type="number"
              name="expiresAt"
              placeholder="Enter Expiration Date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.expiresAt}
              onChange={handleChange}
              required
            />
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="Enter weight"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.weight}
              onChange={handleChange}
              required
            />
          </div>

          {/* Shipment Type Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Shipment Type</label>
            <select
              name="shipmentType"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.shipmentType}
              onChange={handleChange}
            >
              <option value="fixed">Fixed Price</option>
              <option value="bidding">Bidding</option>
            </select>
          </div>

          {/* Fixed Price Input (only for "fixed" shipmentType) */}
          {form.shipmentType === "fixed" && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold">Fixed Price ($)</label>
              <input
                type="number"
                name="fixedPrice"
                placeholder="Enter fixed price"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.fixedPrice}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Image URL Input */}
          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Shipment Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="Enter image URL"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.image}
              onChange={handleChange}
              required
            />
          </div>

          {/* Preview Image */}
          {form.image && (
            <div className="flex justify-center">
              <img
                src={form.image}
                alt="Shipment Preview"
                className="w-40 h-40 object-cover rounded-lg shadow-lg mt-4"
              />
            </div>
          )}

          {/* Submission Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "📤 Add Shipment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
