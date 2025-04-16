import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BidList from "./BidList";
import BidForm from "./BidForm";
import BidManagement from "./BidManagement";
import { motion, AnimatePresence } from "framer-motion";

const BidWars = () => {
  const [selectedBid, setSelectedBid] = useState(null);
  const [shipmentDetails, setShipmentDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const shipmentId = id;
  const [userRole, setUserRole] = useState("");
  const [status, setStatus] = useState("");
  const [winnerStuff, setWinnerStuff] = useState([]);
  const [shipperDetails, setShipperDetails] = useState({});
  const [currentBids, setCurrentBids] = useState([]);

  const getBidsForShipment = async (shipmentId) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/bids/${shipmentId}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "Application/Json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setCurrentBids(data.bids);
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    getBidsForShipment(shipmentId);
  }, [shipmentId,shipmentDetails,selectedBid]);

  // Fetch shipper details function
  const fetchShipperDetails = async (shipperId) => {
    if (!shipperId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/auth/user/${shipperId}`,
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
        setShipperDetails((prev) => ({
          ...prev,
          [shipperId]: data.profile, // Store details per shipper ID
        }));
      }
    } catch (error) {
      console.error("Error fetching shipper details:", error);
    }
  };

  // Fetch details when winners update
  useEffect(() => {
    const uniqueShippers = [...new Set(winnerStuff.map((w) => w.shipper))];
    uniqueShippers.forEach((shipperId) => {
      if (!shipperDetails[shipperId]) {
        fetchShipperDetails(shipperId);
      }
    });
  }, [winnerStuff,shipmentId,shipmentDetails,selectedBid]);

  const fetchUserRole = async () => {
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
      setUserRole(data.profileDetails.role);
      setUserId(data.profileDetails._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  const fetchShipmentDetails = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `http://localhost:8000/api/v1/shipment/listing/shipment/${id}`,
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
        setShipmentDetails(data.shipment);
        setTitle(data.shipment.title);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipmentDetails();
  }, [id]);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/bids/get/bids`, {
        headers: {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("auth-token"),
            "Content-Type": "application/json",
          },
        },
      });
      const data = await res.json();
      if (data.success) {
        setStatus(data.bids);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchBids = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/bids/get/bids`, {
        method: "GET",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.success) {
        // Filter bids to only include those for the current shipment
        const currentShipmentBids = data.bids.filter(
          (bid) => bid.shipment === shipmentId
        );
        setWinnerStuff(currentShipmentBids);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBids();
  }, [shipmentId,shipmentId,shipmentDetails,selectedBid]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading shipment details...
          </p>
        </div>
      </div>
    );
  }

  // Filter winners to only show accepted bids for the current shipment
  const acceptedBids = winnerStuff.filter(
    (bid) => bid.status === "accepted" && bid.shipment === shipmentId
  );

  return (
    <div className="min-h-screen bg-gradient-to-br  pt-32 from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 inline-block">
            Bidding War
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Compete with other shippers in real-time to win this shipment. Place
            your best bid now!
          </p>
          <div className="mt-4 flex justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              {title} Bid
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bid List and Shipment Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bid List Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Current Bids
                </h2>
              </div>
              <div className="p-6">
                <BidList shipmentId={shipmentId} onBidSelect={setSelectedBid} />
              </div>
            </motion.div>

            <div className="space-y-6">
              {userRole === "Shipper" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50"
                >
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Bid Results
                    </h2>
                  </div>

                  <div className="p-6">
                    <AnimatePresence>
                      {acceptedBids.map((winner, index) => {
                        const shipper = shipperDetails[winner.shipper];
                        const isCurrentUser = userId === winner.shipper;

                        return (
                          <motion.div
                            key={winner._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`mb-6 last:mb-0 p-5 rounded-lg ${
                              isCurrentUser
                                ? "bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100"
                                : "bg-gray-50"
                            }`}
                          >
                            {shipper ? (
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={
                                      shipper.profile ||
                                      "https://via.placeholder.com/150"
                                    }
                                    alt={shipper.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                  />
                                  {isCurrentUser && (
                                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md">
                                      <svg
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                  <h3 className="text-lg font-bold text-gray-800">
                                    {isCurrentUser ? (
                                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                        You won this bid!
                                      </span>
                                    ) : (
                                      <>Winner is: {shipper.name}</>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {isCurrentUser
                                      ? "Congratulations on your winning bid!"
                                      : `Winning bid: $${winner.amount}`}
                                  </p>

                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                      <svg
                                        className="w-4 h-4 mr-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                      </svg>
                                      {shipper.email}
                                    </div>
                                    {shipper.phone && (
                                      <div className="flex items-center text-gray-600">
                                        <svg
                                          className="w-4 h-4 mr-2 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                          />
                                        </svg>
                                        {shipper.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {isCurrentUser && (
                                  <Link
                                    to={`/booking/bid/${shipmentId}`}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center whitespace-nowrap"
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                    Proceed to Shipment
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <div className="animate-pulse flex space-x-4">
                                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {acceptedBids.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">
                          Bidding Still in Progress
                        </h3>
                        <p className="text-gray-500 mt-1">
                          No winners have been selected yet
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            <div>
              {userRole === "User" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/50"
                >
                  <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 text-indigo-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Bid Results
                    </h2>
                  </div>

                  <div className="p-6">
                    <AnimatePresence>
                      {acceptedBids.map((winner, index) => {
                        const shipper = shipperDetails[winner.shipper];
                        const isCurrentUser = userId === winner.shipper;

                        return (
                          <motion.div
                            key={winner._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`mb-6 last:mb-0 p-5 rounded-lg ${
                              isCurrentUser
                                ? "bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-100"
                                : "bg-gray-50"
                            }`}
                          >
                            {shipper ? (
                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={
                                      shipper.profile ||
                                      "https://via.placeholder.com/150"
                                    }
                                    alt={shipper.name}
                                    className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                                  />
                                </div>

                                <div className="flex-1 text-center sm:text-left">
                                  <p className="text-sm text-gray-600 mt-1">
                                    {isCurrentUser
                                      ? "Congratulations on your winning bid!"
                                      : `Winning bid: $${winner.amount}`}
                                  </p>

                                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                      <svg
                                        className="w-4 h-4 mr-2 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                      </svg>
                                      {shipper.email}
                                    </div>
                                    {shipper.phone && (
                                      <div className="flex items-center text-gray-600">
                                        <svg
                                          className="w-4 h-4 mr-2 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                          />
                                        </svg>
                                        {shipper.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center py-4">
                                <div className="animate-pulse flex space-x-4">
                                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {acceptedBids.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-8 h-8 text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700">
                          Bidding Still in Progress
                        </h3>
                        <p className="text-gray-500 mt-1">
                          No winners have been selected yet
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Shipment Details Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Shipment Details
                </h2>
              </div>
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {shipmentDetails?.image && (
                    <div className="w-full md:w-1/3">
                      <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                        <img
                          src={shipmentDetails.image}
                          alt="Shipment"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                  )}
                  <div className="w-full md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem
                        label="Pickup Location"
                        value={shipmentDetails?.pickupLocation}
                        icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <DetailItem
                        label="Dropoff Location"
                        value={shipmentDetails?.dropoffLocation}
                        icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <DetailItem
                        label="Weight"
                        value={shipmentDetails.weight}
                        icon="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                      />
                      <DetailItem
                        label="Type"
                        value={shipmentDetails.shipmentType}
                        icon="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                      />
                      <DetailItem
                        label="Pickup Date"
                        value={formatDate(shipmentDetails.createdAt)}
                        icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                      <DetailItem
                        label="Delivery Date"
                        value={formatDate(shipmentDetails.expiresAt)}
                        icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Bid Form and Management */}
          <div className="space-y-8">
            {/* Bid Form Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                ${
                  userRole === "Shipper"
                    ? "bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                    : ""
                } `}
            >
              {userRole === "Shipper" && (
                <>
                  <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Place Your Bid
                    </h2>
                  </div>
                  <div className="p-6">
                    <BidForm
                      shipmentId={shipmentId}
                      onBidPlaced={() => window.location.reload()}
                    />
                  </div>
                </>
              )}
            </motion.div>

            {/* Bid Management Card */}
            {userRole === "User" && selectedBid && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
              >
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Manage Your Bid
                  </h2>
                </div>
                <div className="p-6">
                  <BidManagement
                    selectedBidId={selectedBid}
                    onActionCompleted={() => window.location.reload()}
                  />
                </div>
              </motion.div>
            )}

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Bidding Insights
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Time Remaining:</span>
                  <span className="font-medium">2 days 4 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Total Bids:</span>
                  <span className="font-medium">{currentBids.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Average Bid:</span>
                  <span className="font-medium">
                    {currentBids.length > 0
                      ? `$${Math.round(
                          currentBids.reduce(
                            (sum, bid) => sum + bid.amount,
                            0
                          ) / currentBids.length
                        )}`
                      : "$0"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable DetailItem component
const DetailItem = ({ label, value, icon }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 h-5 w-5 text-blue-500 mr-3 mt-0.5">
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d={icon}
        />
      </svg>
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">
        {value || "Not specified"}
      </p>
    </div>
  </div>
);

export default BidWars;
