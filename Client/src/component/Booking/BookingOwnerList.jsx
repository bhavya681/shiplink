import React, { useEffect, useState } from "react";
import {
  FiTruck,
  FiMapPin,
  FiDollarSign,
  FiPackage,
  FiCalendar,
} from "react-icons/fi";
import { BsCheckCircleFill, BsHourglassSplit } from "react-icons/bs";
import toast from "react-hot-toast";
import { ImWondering } from "react-icons/im";
import { CrossIcon, Trash2, X, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";

const BookingOwnerList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState([]);
  const fetchUserId = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/auth/user/profile`,
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
        setUserId(data.profileDetails._id);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserId();
  }, []);
  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/bookings/user`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "Application/Json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      // Optimistically update UI
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === id ? { ...booking, status: newStatus } : booking
        )
      );

      // API Request
      const res = await fetch(`http://localhost:8000/api/v1/bookings/${id}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Status updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating status");
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const deleteAppointement = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/bookings/${id}`, {
        method: "DELETE",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "applicaion/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Successfully Deleted Appointment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <BsHourglassSplit className="mr-1" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <BsCheckCircleFill className="mr-1" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <ImWondering className="mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-19 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your Shipment Bookings
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage all shipment bookings from carriers in one place
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "pending"
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <BsHourglassSplit /> Pending
          </button>
          <button
            onClick={() => setFilter("accepted")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "accepted"
                ? "bg-green-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <BsCheckCircleFill /> Accepted
          </button>
          <button
            onClick={() => setFilter("rejected")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "rejected"
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <XCircle /> Rejected
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <FiTruck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No bookings found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "You don't have any shipment bookings yet."
                : `No ${filter} bookings found.`}
            </p>
          </div>
        )}

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {" "}
              {/* Shipment Image */}
              {booking.shipment.image && (
                <div
                  className="relative h-88 overflow-hidden rounded-lg 
               bg-gradient-to-br from-indigo-500/10 via-blue-400/5 to-purple-500/10
               border border-indigo-200/30
               backdrop-blur-sm
               transition-all duration-500
               hover:shadow-lg hover:border-indigo-300/50"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#fff_0%,transparent_60%)] opacity-20" />
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_50%,transparent_52%)] bg-[length:300%_300%] animate-shine" />

                  <img
                    src={booking.shipment.image}
                    alt="Shipment"
                    className="relative z-10 w-full rounded-lg h-full object-contain 
                        transition-transform duration-500 hover:scale-105"
                  />

                  <div
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 
                            rounded-full text-xs font-semibold text-gray-800 shadow-sm 
                            flex items-center gap-1"
                  >
                    <FiTruck className="text-indigo-500" />
                    {booking.shipment.shipmentType}
                  </div>
                </div>
              )}
              <button
                className="p-2 mt-8 mx-2 ml-10 rounded-md flex items-center justify-center gap-2 
             bg-red-100 text-red-600 hover:bg-red-600 hover:text-white
             transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => deleteAppointement(booking._id)}
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-medium">Delete</span>
              </button>
              <div className="p-6">
                {/* Status Badge and Title */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {booking.shipment.title}
                  </h2>
                  {getStatusBadge(booking.status)}
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup Location</p>
                      <p className="text-xs">
                        {booking.shipment.pickupLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Drop-off Location</p>
                      <p className="text-xs">
                        {booking.shipment.dropoffLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FiPackage className="mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm">
                        {booking.shipment.weight} kg
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-semibold">
                        ${booking.shipment.fixedPrice || "Bidding"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-2 text-indigo-500 flex-shrink-0" />
                    <span className="text-sm">
                      Created: {formatDate(booking.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100"></div>

                {/* Shipper Info */}
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <img
                      src={booking.shipper.profile}
                      alt={booking.shipper.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {booking.shipper.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.shipper.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.shipper.phone}
                      </p>
                    </div>
                  </div>

                  <div class="group relative max-w-fit transition-all duration-200 hover:scale-[1.02]">
    <div class="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur transition-all duration-500 group-hover:opacity-30"></div>
    <a 
        href={booking.shipper.paymentLink}
        class="relative flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 font-sans text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
        <span class="drop-shadow-sm">Secure Payment Portal</span>
    </a>
    <p class="mt-2 text-center text-xs font-medium text-gray-500 opacity-0 transition-all duration-200 group-hover:opacity-100">
        Instant payment processing • 256-bit SSL encryption
    </p>
</div>

                  <Link
                    to={`/personal/chats/${userId}/${booking.shipper._id}`}
                    className="flex items-center justify-center  space-x-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 h-10"
                  >
                    <span className="text-sm">Chat with Owner</span>
                    <FaRocketchat size={20} className="text-white" />
                  </Link>
                </div>

                {/* Booking Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  {booking.status === "pending" && (
                    <>
                      <button
                        onClick={() => changeStatus(booking._id, "accepted")}
                        className="cursor-pointer px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Accept Booking
                      </button>
                      <button
                        onClick={() => changeStatus(booking._id, "rejected")}
                        className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Reject Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingOwnerList;
