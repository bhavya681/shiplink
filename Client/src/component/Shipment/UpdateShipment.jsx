import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {  useNavigate, useParams } from "react-router-dom";

const UpdateShipment = () => {
  const params = useParams();
  const [form, setForm] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    weight: "",
    shipmentType: "fixed",
    fixedPrice: "",
    title: "",
    image: "",
    status: "",
    expiresAt: "",
  });

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/shipment/listing/${params.id}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({ ...prev, ...data.shipments }));
     
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const status = [
    "open",
    "bidding",
    "booked",
    "in-transit",
    "delivered",
    "cancelled",
    "expired",
  ];
  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      return toast.error("Please fill in all required fields.");
    }
    if (form.shipmentType === "fixed" && !form.fixedPrice) {
      return toast.error("Fixed price is required for direct bookings.");
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/shipment/listing/edit/${params.id}`,
        {
          method: "PUT",
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
        setForm({
          pickupLocation: "",
          dropoffLocation: "",
          weight: "",
          shipmentType: "fixed",
          fixedPrice: "",
          title: "",
          image: "",
          status: "",
          expiresAt: "",
        });
        navigate("/"); // Redirect after success
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-100 to-gray-200 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📦 Update Shipment
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
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

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              name="status"
              className="w-full border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status} // Set current form value
              onChange={handleChange} // Ensure handleChange updates form
            >
              {status.map((s, index) => (
                <option key={index} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Expiration Date:
            </label>
            <input
              type="text"
              name="expiresAt"
              placeholder="Enter pickup location"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={form.expiresAt}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Pickup Location
            </label>
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

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Dropoff Location
            </label>
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

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Weight (kg)
            </label>
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

          <div className="space-y-2">
            <label className="block text-gray-700 font-semibold">
              Shipment Type
            </label>
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

          {form.shipmentType === "fixed" && (
            <div className="space-y-2">
              <label className="block text-gray-700 font-semibold">
                Fixed Price ($)
              </label>
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
            <label className="block text-gray-700 font-semibold">
              Shipment Image URL
            </label>
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

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
          >
            📤 Update Shipment
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateShipment;
