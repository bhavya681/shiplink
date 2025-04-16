import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaTruck,
  FaMoneyBillWave,
  FaClock,
  FaSearch,
  FaFilter,
  FaRocketchat,
} from "react-icons/fa";
import { FiShield, FiPackage, FiCalendar } from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import moment from "moment-timezone";

const GetAllShipment = () => {
  const [shipments, setShipments] = useState([]);
  const [filteredShipments, setFilteredShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showClosest, setShowClosest] = useState(false);
  const shipmentsPerPage = 6;
  const location = useLocation();
  const [userId, setUserId] = useState([]);
  const [userAddress, setUserAddress] = useState({});
  const [shipperAddress, setShipperAddres] = useState({});

  // Function to calculate distance between two coordinates in kilometers (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

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
        setUserAddress(data.profileDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchShipments = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/v1/shipment/listing/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setShipments(data.shipments);
        setFilteredShipments(data.shipments);
        setShipperAddres(data.shipments);
      }
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [location.pathname]);

  // Function to filter shipments by proximity
  const filterByProximity = () => {
    if (!userAddress?.location?.coordinates || !showClosest) {
      return shipments;
    }

    const userLat = userAddress.location.coordinates[1];
    const userLon = userAddress.location.coordinates[0];

    return shipments
      .map((shipment) => {
        if (!shipment?.user?.location?.coordinates) {
          return { ...shipment, distance: Infinity };
        }
        
        const shipmentLat = shipment.user.location.coordinates[1];
        const shipmentLon = shipment.user.location.coordinates[0];
        const distance = calculateDistance(
          userLat,
          userLon,
          shipmentLat,
          shipmentLon
        );
        
        return { ...shipment, distance };
      })
      .sort((a, b) => a.distance - b.distance);
  };

  // Apply filters and search
  useEffect(() => {
    let results = showClosest ? filterByProximity() : [...shipments];

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (shipment) =>
          shipment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.pickupLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.dropoffLocation
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter((shipment) => shipment.status === statusFilter);
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (sortOption) {
        case "price_asc":
          return a.fixedPrice - b.fixedPrice;
        case "price_desc":
          return b.fixedPrice - a.fixedPrice;
        case "expiry":
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "distance":
          return (a.distance || Infinity) - (b.distance || Infinity);
        default:
          return 0;
      }
    });

    setFilteredShipments(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [shipments, searchTerm, statusFilter, sortOption, showClosest, userAddress]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      open: {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        text: "Open",
      },
      bidding: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        text: "Bidding",
      },
      expired: {
        color: "bg-red-500 text-gray-100 border-gray-200",
        text: "Expired",
      },
      in_progress: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        text: "In Progress",
      },
      delivered: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Delivered",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Pending",
      },
      default: {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Closed",
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

  // Get current shipments for pagination
  const indexOfLastShipment = currentPage * shipmentsPerPage;
  const indexOfFirstShipment = indexOfLastShipment - shipmentsPerPage;
  const currentShipments = filteredShipments.slice(
    indexOfFirstShipment,
    indexOfLastShipment
  );
  const totalPages = Math.ceil(filteredShipments.length / shipmentsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Available Shipments
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Find and manage your logistics needs efficiently
          </p>
        </div>

        <div className="mb-8 p-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <FaSearch />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 sm:text-sm"
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <FaFilter />
              </div>
              <select
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="bidding">Bidding</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="closed">Closed</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Sort Option */}
            <div className="relative">
              <select
                className="block w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 sm:text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="expiry">Expiry: Soonest</option>
                {showClosest && <option value="distance">Distance: Nearest</option>}
              </select>
            </div>

            {/* Closest Shipments Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowClosest(!showClosest)}
                className={`w-full py-3 px-4 border rounded-xl text-sm font-medium transition duration-300 ${
                  showClosest
                    ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {showClosest ? "Show All Shipments" : "Show Closest Shipments"}
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{filteredShipments.length}</span>{" "}
            results
          </p>
          {filteredShipments.length > shipmentsPerPage && (
            <p className="text-sm text-gray-600">
              Page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          )}
        </div>

        {/* Shipment Grid */}
        {currentShipments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No shipments found
            </h3>
            <p className="mt-2 text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentShipments.map((shipment) => {
              const formattedExpiresAt = moment(shipment.expiresAt)
                .tz("Asia/Kolkata")
                .format("MMM D, YYYY [at] h:mm A");
              return (
                <div
                  key={shipment._id}
                  className={`relative rounded-lg shadow-sm transition-all duration-200 overflow-hidden border border-gray-200 hover:shadow-md bg-white
                  ${
                    shipment.status === "expired"
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-indigo-200 cursor-pointer"
                  }
                `}
                >
                  {/* Shipment Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={
                        shipment?.image ||
                        "https://images.unsplash.com/photo-1604264849637-7a6c0a346a72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                      }
                      alt="Shipment"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-lg font-bold text-white line-clamp-1">
                        {shipment.title}
                      </h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-200">
                          <FiCalendar className="inline mr-1" />
                          {formatDate(shipment.createdAt)}
                        </span>
                        {getStatusBadge(shipment.status)}
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details */}
                  <div className="p-5">
                    {/* Price and Expiry */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <FaMoneyBillWave className="text-green-500 mr-2" />
                        <span className="text-lg font-bold text-gray-900">
                          ${shipment.fixedPrice || "Bidding"}
                        </span>
                      </div>

                      <div className={`flex items-center text-sm mb-4`}>
                        <FaClock
                          className={`mr-2 ${
                            shipment.status === "expired"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-xs font-semibold tracking-wide ${
                              shipment.status === "expired"
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            Expires At
                          </p>
                          <p
                            className={`text-sm font-semibold tracking-wide ${
                              shipment.status === "expired"
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {formattedExpiresAt}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Distance indicator if showing closest shipments */}
                    {showClosest && shipment.distance !== undefined && (
                      <div className="mb-3 flex items-center text-sm bg-blue-50 p-2 rounded-lg">
                        <FaMapMarkerAlt className="text-blue-500 mr-2" />
                        <span className="text-blue-700 font-medium">
                          {shipment.distance === Infinity
                            ? "Location unknown"
                            : `${shipment.distance.toFixed(1)} km away`}
                        </span>
                      </div>
                    )}

                    {/* Pickup and Dropoff */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Pickup Location
                          </p>
                          <p className="text-gray-800 line-clamp-1">
                            {shipment.pickupLocation}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">
                            Dropoff Location
                          </p>
                          <p className="text-gray-800 line-clamp-1">
                            {shipment.dropoffLocation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center">
                        <FiPackage className="text-gray-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Weight</p>
                          <p className="text-sm font-medium">
                            {shipment.weight} kg
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <FiShield className="text-gray-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="text-sm font-medium">
                            {shipment.shipmentType || "Standard"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center">
                        <img
                          src={
                            shipment?.user?.profile ||
                            "https://ui-avatars.com/api/?name=" +
                              (shipment?.user?.name || "U") +
                              "&background=random"
                          }
                          alt="User Profile"
                          className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            {shipment?.user?.name || "Unknown User"}
                            {shipment?.user?.verified && (
                              <RiVerifiedBadgeFill className="ml-1 text-blue-500 text-sm" />
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {shipment?.user?.company || "Individual Shipper"}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/personal/chats/${userId}/${shipment.user._id}`}
                        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-2 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 h-10"
                      >
                        <span className="text-sm">Chat with Owner</span>
                        <FaRocketchat size={20} className="text-white" />
                      </Link>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="px-5 pb-5">
                    {shipment.status === "open" ? (
                      <Link
                        to={`/booking/${shipment._id}`}
                        className="block w-full"
                      >
                        <button className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition flex items-center justify-center gap-2">
                          <FaTruck className="text-sm" /> Request Shipment
                        </button>
                      </Link>
                    ) : shipment.status === "bidding" ? (
                      <Link
                        to={`/bid/${shipment._id}`}
                        className="block w-full"
                      >
                        <button className="w-full py-2.5 px-4 bg-green-600 cursor-pointer hover:bg-green-700 text-white font-medium rounded-md transition flex items-center justify-center gap-2">
                          Participate in Bidding
                        </button>
                      </Link>
                    ) : shipment.status === "expired" ? (
                      <button className="w-full py-2.5 px-4 bg-gray-400 text-white font-medium rounded-md cursor-not-allowed flex items-center justify-center gap-2">
                        Shipment Closed
                      </button>
                    ) : (
                      <button className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition flex items-center justify-center gap-2 cursor-pointer">
                        <Link to={`/bid/${shipment._id}`}>Participate Bid</Link>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredShipments.length > shipmentsPerPage && (
          <div className="mt-8 flex justify-center">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default GetAllShipment;