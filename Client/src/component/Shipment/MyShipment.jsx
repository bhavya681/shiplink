import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import toast from "react-hot-toast";
import {
  FaBox,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaEdit,
  FaTrash,
  FaClock,
  FaPlus,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiPackage, FiRefreshCw } from "react-icons/fi";

const MyShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const shipmentsPerPage = 6;

  // Fetch user shipments
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://shiplink.onrender.com/api/v1/shipment/listing/all/mine",
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
        setShipments(data.shipments);
      } else {
        console.log("Failed to fetch shipments.");
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
      toast.error("Error loading shipments.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Delete shipment function
  const deleteShipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?"))
      return;

    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/shipment/listing/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Shipment deleted successfully");
        fetchShipments();
      } else {
        toast.error(data.message || "Failed to delete shipment.");
      }
    } catch (error) {
      console.error("Error deleting shipment:", error);
      toast.error("Error deleting shipment.");
    }
  };

  // Filter and sort shipments
  const filteredShipments = shipments
    .filter((shipment) => {
      const matchesSearch =
        shipment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.pickupLocation
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        shipment.dropoffLocation
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || shipment.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "price_high":
          return (b.fixedPrice || 0) - (a.fixedPrice || 0);
        case "price_low":
          return (a.fixedPrice || 0) - (b.fixedPrice || 0);
        case "expiry_soon":
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        default:
          return 0;
      }
    });

  // Pagination logic
  const indexOfLastShipment = currentPage * shipmentsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(
    indexOfFirstShipment,
    indexOfLastShipment
  );
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Open",
      },
      "in-transit": {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "In Transit",
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Delivered",
      },
      expired: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        text: "Expired",
      },
      default: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        text: status,
      },
    };

    const config = statusConfig[status] || statusConfig.default;
    return (
      <span
        className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
            <p className="mt-2 text-gray-600">
              Manage all your shipments in one place
            </p>
          </div>
          <Link
            to="/add/shipment"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <FaPlus className="mr-2" /> Create New Shipment
          </Link>
        </div>

        {/* Enhanced Filter Box */}
        <div className=" p-5 rounded-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-all duration-200"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sort Option */}
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none transition-all duration-200"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="expiry_soon">Expiry: Soonest</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchShipments}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <FiRefreshCw
                className={`mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{filteredShipments.length}</span>{" "}
            shipments
          </p>
          {filteredShipments.length > shipmentsPerPage && (
            <p className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          )}
        </div>

        {/* Shipment Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : currentShipments.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 cursor-pointer">
              {currentShipments.map((shipment) => {
                const formattedExpiresAt = moment(shipment.expiresAt)
                  .tz("Asia/Kolkata")
                  .format("MMM D, YYYY [at] h:mm A");

                return (
                  <div
                    key={shipment._id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    {/* Shipment Image */}
                    {shipment.image && (
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={shipment.image}
                          alt="Shipment"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          {getStatusBadge(shipment.status)}
                        </div>
                      </div>
                    )}

                    {/* Shipment Details */}
                    <div className="p-5">
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {shipment.title}
                      </h3>

                      {/* Locations */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Pickup Location
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-1">
                              {shipment.pickupLocation}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-500">
                              Dropoff Location
                            </p>
                            <p className="text-sm text-gray-800 line-clamp-1">
                              {shipment.dropoffLocation}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center">
                          <FiPackage className="text-gray-500 mr-2 text-sm" />
                          <div>
                            <p className="text-xs text-gray-500">Weight</p>
                            <p className="text-sm font-medium">
                              {shipment.weight} kg
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaMoneyBillWave className="text-green-500 mr-2 text-sm" />
                          <div>
                            <p className="text-xs text-gray-500">Shipment Type</p>
                            <p className="text-sm font-medium">
                              {shipment.shipmentType === "fixed"
                                ? `₹${shipment.fixedPrice}`
                                : "Bidding"}
                            </p>
                          </div>
                        </div>
                      </div>
                     
                      {/* Expiry Time */}
                      <div className="flex items-center text-sm mb-4">
                        <FaClock className="text-red-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Expires At</p>
                          <p className="text-sm font-medium">
                            {formattedExpiresAt}
                          </p>
                        </div>
                      </div>
                      <div className="my-2 cursor-pointer">
                        {shipment.shipmentType === "bidding" || shipment.status === "bidding" ? (
                          <>
                            <Link
                              to={`/bid/${shipment._id}`}
                              className="block w-full"
                            >
                              <button className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition flex items-center justify-center gap-2">
                              Manage Bidding
                              </button>
                            </Link>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* Action Buttons */}
                      <div className="flex justify-between border-t pt-4">
                        <Link
                          to={`/edit/shipment/${shipment._id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                        >
                          <FaEdit className="mr-1.5" /> Edit
                        </Link>
                        <button
                          onClick={() => deleteShipment(shipment._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        >
                          <FaTrash className="mr-1.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Pagination */}
            {filteredShipments.length > shipmentsPerPage && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstShipment + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastShipment, filteredShipments.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {filteredShipments.length}
                  </span>{" "}
                  results
                </div>
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      paginate(currentPage > 1 ? currentPage - 1 : 1)
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show first page, last page, and pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                          currentPage === pageNum
                            ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  )}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-lg ${
                        currentPage === totalPages
                          ? "z-10 bg-indigo-600 border-indigo-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {totalPages}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <FaBox className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">
              No shipments found
            </h3>
            <p className="mt-2 text-gray-600">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't created any shipments yet"}
            </p>
            <div className="mt-6">
              <Link
                to="/add/shipment"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <FaPlus className="mr-2" /> Create Your First Shipment
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyShipment;
