import React, { useEffect, useState } from "react";
import {
  FiTruck,
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiPackage,
} from "react-icons/fi";
import { BsCheckCircleFill, BsHourglassSplit } from "react-icons/bs";
import { ImWondering, ImWondering2 } from "react-icons/im";
import { Cross } from "lucide-react";
import { Link } from "react-router-dom";
import { FaRocketchat } from "react-icons/fa";

const BookingGets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState([]);
  const fetchUserId = async () => {
    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/auth/user/profile`,
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
      const res = await fetch("https://shiplink.onrender.com/api/v1/bookings/shipper", {
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
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Your Shipment Applications
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Manage and track all your shipment applications in one place
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
            All Applications
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
            onClick={() => setFilter("rejected")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              filter === "rejected"
                ? "bg-red-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <ImWondering2 /> Rejected
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
            <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No applications found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === "all"
                ? "You haven't applied to any shipments yet."
                : `No ${filter} applications found.`}
            </p>
          </div>
        )}

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              {/* Shipment Image */}
              {appointment.shipment?.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={appointment.shipment?.image}
                    alt="Shipment"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm flex items-center gap-1">
                    <FiTruck className="text-indigo-500" />
                    {appointment.shipment.shipmentType}
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {appointment.shipment?.title}
                  </h2>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : appointment.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {appointment.status === "pending" ? (
                      <BsHourglassSplit className="mr-1" />
                    ) : appointment.status === "accepted" ? (
                      <BsCheckCircleFill className="mr-1" />
                    ) : (
                      <ImWondering className="mr-1" />
                    )}
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                {/* Shipment Details */}
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Pickup</p>
                      <p className="text-xs">
                        {appointment.shipment?.pickupLocation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Drop-off</p>
                      <p className="text-xs">
                        {appointment.shipment?.dropoffLocation}
                      </p>
                    </div>
                  </div>

                 {  appointment.status === "accepted" && (<><div className="flex justify-center items-center text-center">
                    {appointment?.user?.location ? (
                      <div className="group relative">
                        <a
                          href={`https://www.google.com/maps?q=${appointment?.user?.location?.coordinates[0]},${appointment?.user?.location?.coordinates[1]}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:shadow-md "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                          </svg>
                          View on Map
                        </a>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-lg bg-red-200 px-4 py-3 text-sm font-medium text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                          />
                        </svg>
                        Location unavailable
                      </div>
                    )}
                  </div>
</>)}



                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <FiPackage className="mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm">
                        {appointment.shipment?.weight} kg
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-semibold">
                        ${appointment.shipment?.fixedPrice || "Bidding"}
                      </span>
                    </div>
                  </div>
                

                  {appointment.shipment?.pickupDate && (
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-indigo-500 flex-shrink-0" />
                      <span className="text-sm">
                        {formatDate(appointment.shipment?.pickupDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100"></div>

                {/* Shipper Info */}
                <div className="flex items-center">
                  <img
                    src={appointment.user.profile}
                    alt={appointment.user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {appointment.user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.user.email}
                    </p>
                  </div>
                  <button className="ml-auto text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    <Link
                      to={`/personal/chats/${userId}/${appointment.user._id}`}
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 h-10"
                    >
                      <span className="text-sm">Chat with Owner</span>
                      <FaRocketchat size={20} className="text-white" />
                    </Link>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingGets;
