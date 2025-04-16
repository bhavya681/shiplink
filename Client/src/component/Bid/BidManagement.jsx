// import React, { useState } from "react";
// import { FaCheckCircle, FaTimesCircle, FaShippingFast } from "react-icons/fa";
// import { motion } from "framer-motion";

// const BidManagement = ({ selectedBidId, onActionCompleted }) => {
//   const [loading, setLoading] = useState(false);
//   const [action, setAction] = useState(null);

//   const manageBid = async (actionType) => {
//     try {
//       setLoading(true);
//       setAction(actionType);
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       onActionCompleted();
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//       setAction(null);
//     }
//   };

//   return (
//     <motion.div 
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-white rounded-xl shadow-lg p-6"
//     >
//       <div className="flex items-center mb-4">
//         <div className="bg-purple-100 p-2 rounded-lg mr-3">
//           <FaShippingFast className="text-purple-600 text-xl" />
//         </div>
//         <h2 className="text-xl font-bold text-gray-800">Bid Management</h2>
//       </div>
      
//       {selectedBidId ? (
//         <div>
//           <p className="text-gray-600 mb-4">You have selected a bid. Choose an action:</p>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <button
//               onClick={() => manageBid("accept")}
//               disabled={loading}
//               className={`flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading && action === "accept" ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
//             >
//               {loading && action === "accept" ? (
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <FaCheckCircle className="mr-2" />
//               )}
//               {loading && action === "accept" ? "Accepting..." : "Accept Bid"}
//             </button>
            
//             <button
//               onClick={() => manageBid("reject")}
//               disabled={loading}
//               className={`flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading && action === "reject" ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200`}
//             >
//               {loading && action === "reject" ? (
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 <FaTimesCircle className="mr-2" />
//               )}
//               {loading && action === "reject" ? "Rejecting..." : "Reject Bid"}
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-4">
//           <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
//             <FaShippingFast className="text-gray-400 text-xl" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-700">No bid selected</h3>
//           <p className="text-gray-500 mt-1">Select a bid from the list to manage</p>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default BidManagement;

import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaShippingFast } from "react-icons/fa";
import { motion } from "framer-motion";

const BidManagement = ({ selectedBidId, onActionCompleted }) => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(null);

  const handleBidAction = async (actionType) => {
    if (!selectedBidId) return;

    try {
      setLoading(true);
      setAction(actionType);

      const res = await fetch(`http://localhost:8000/api/v1/bids/${selectedBidId}/${actionType}`, {
        method: "PUT",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data.success) {
      
        onActionCompleted(); // Refresh data in parent component
      } else {
        console.error(`Failed to ${actionType} bid:`, data.message);
      }
    } catch (error) {
      console.error(`Error ${actionType} bid:`, error);
    } finally {
      setLoading(false);
      setAction(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
          <FaShippingFast className="text-purple-600 text-xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Bid Management</h2>
      </div>

      {selectedBidId ? (
        <div>
          <p className="text-gray-600 mb-4">You have selected a bid. Choose an action:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleBidAction("accept")}
              disabled={loading}
              className={`flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading && action === "accept" ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
            >
              {loading && action === "accept" ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaCheckCircle className="mr-2" />
              )}
              {loading && action === "accept" ? "Accepting..." : "Accept Bid"}
            </button>
            
            <button
              onClick={() => handleBidAction("reject")}
              disabled={loading}
              className={`flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                loading && action === "reject" ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200`}
            >
              {loading && action === "reject" ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FaTimesCircle className="mr-2" />
              )}
              {loading && action === "reject" ? "Rejecting..." : "Reject Bid"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
            <FaShippingFast className="text-gray-400 text-xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">No bid selected</h3>
          <p className="text-gray-500 mt-1">Select a bid from the list to manage</p>
        </div>
      )}
    </motion.div>
  );
};

export default BidManagement;
