// import React, { useEffect, useState } from "react";
// import { FaTrophy, FaUser, FaClock, FaCheck } from "react-icons/fa";
// import { motion } from "framer-motion";

// const BidList = ({ shipmentId, onBidSelect }) => {
//   const [bids, setBids] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBid, setSelectedBid] = useState(null);

//   const getBidsForShipment = async (shipmentId) => {
//     try {
//       const res = await fetch(
//         `http://localhost:8000/api/v1/bids/${shipmentId}`,
//         {
//           method: "GET",
//           headers: {
//             "auth-token": localStorage.getItem("auth-token"),
//             "Content-Type": "Application/Json",
//           },
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         return data;
//       }
//     } catch (error) {
//       console.error(error);
//       return [];
//     }
//   };

//   useEffect(() => {
//     getBidsForShipment(shipmentId)
//       .then((data) => {
//         setBids(data.bids);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [shipmentId]);

//   const handleBidSelect = (bidId) => {
//     setSelectedBid(bidId);
//     onBidSelect(bidId);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Bids Received</h2>
//         <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//           {bids.length} Bids
//         </span>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       ) : bids.length === 0 ? (
//         <div className="text-center py-8">
//           <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//             <FaTrophy className="text-gray-400 text-xl" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-700">No bids yet</h3>
//           <p className="text-gray-500 mt-1">Be the first to place a bid!</p>
//         </div>
//       ) : (
//         <ul className="space-y-3">
//           {bids.map((bid, index) => (
//             <motion.li
//               key={bid._id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3, delay: index * 0.05 }}
//               className={`relative p-4 rounded-lg border transition-all duration-200 ${selectedBid === bid._id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}`}
//               onClick={() => handleBidSelect(bid._id)}
//             >
//               {selectedBid === bid._id && (
//                 <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>
//               )}
//               <div className="flex justify-between items-center">
//                 <div className="flex items-center space-x-3">
//                   <div className="relative">
//                     <img
//                       src={bid.shipper.profile || "https://ui-avatars.com/api/?name=" + bid.shipper.name}
//                       alt="Profile"
//                       className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
//                     />
//                     {index === 0 && (
//                       <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5">
//                         <FaTrophy className="text-white text-xs" />
//                       </div>
//                     )}
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-800">{bid.shipper.name}</p>
//                     <p className="text-xs text-gray-500 flex items-center">
//                       <FaClock className="mr-1" /> {new Date(bid.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-lg font-bold text-green-600">${bid.amount}</p>
//                   {selectedBid === bid._id && (
//                     <p className="text-xs text-indigo-600 flex items-center justify-end">
//                       <FaCheck className="mr-1" /> Selected
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </motion.li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BidList;

import React, { useEffect, useState } from "react";
import { FaTrophy, FaUser, FaClock, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const BidList = ({ shipmentId, onBidSelect }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [lowestBid, setLowestBid] = useState(null);
const [userRole, setUserRole] = useState("");

  const fetchUserRole = async () => {
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
      setUserRole(data.profileDetails.role);
      //profileDetails
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserRole();
  }, []);
  const getBidsForShipment = async (shipmentId) => {
    try {
      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/bids/${shipmentId}`,
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
        return data.bids;
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    getBidsForShipment(shipmentId)
      .then((bidsData) => {
        setBids(bidsData);
        if (bidsData.length > 0) {
          const minBid = bidsData.reduce((min, bid) =>
            bid.amount < min.amount ? bid : min
          );
          setLowestBid(minBid);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [shipmentId]);

  const handleBidSelect = (bidId) => {
    setSelectedBid(bidId);
    onBidSelect(bidId);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bids Received</h2>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {bids.length} Bids
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FaTrophy className="text-gray-400 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">No bids yet</h3>
          <p className="text-gray-500 mt-1">Be the first to place a bid!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {bids.map((bid) => (
            <motion.li
              key={bid._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative p-4 rounded-lg border transition-all duration-200 ${
                selectedBid === bid._id
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
              onClick={() => handleBidSelect(bid._id)}
            >
              {selectedBid === bid._id && (
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>
              )}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={
                        bid.shipper.profile ||
                        `https://ui-avatars.com/api/?name=${bid.shipper.name}`
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    {lowestBid && lowestBid._id === bid._id && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-0.5">
                        <FaTrophy className="text-white text-xs" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {bid.shipper.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaClock className="mr-1" />{" "}
                      {new Date(bid.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">
                    ${bid.amount}
                  </p>
                  {userRole==="User" && selectedBid === bid._id && (
                    <p className="text-xs text-indigo-600 flex items-center justify-end">
                      <FaCheck className="mr-1" /> Selected
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BidList;
