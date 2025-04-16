import React, { useState } from "react";
import { FaHandHoldingUsd, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";

const BidForm = ({ shipmentId, onBidPlaced }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeBid = async (shipmentId, amount) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/bids/${shipmentId}`, {
        method: "POST",
        headers: {
          "auth-token": localStorage.getItem("auth-token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        return data;
      } else {
        throw new Error(data.message || "Failed to place bid");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) {
      setError("Please enter a valid amount");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await placeBid(shipmentId, amount);
      if (success) {
        onBidPlaced();
        setAmount("");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleBidSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
          <FaHandHoldingUsd className="text-indigo-600 text-xl" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Place Your Bid</h2>
      </div>
      
      <div className="mb-4">
        <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Bid Amount ($)
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <input
            type="number"
            id="bidAmount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 py-3 border-gray-300 rounded-lg"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <span className="h-full py-2 pl-2 pr-3 border-transparent bg-transparent text-gray-500 sm:text-sm">
              USD
            </span>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <FaPaperPlane className="mr-2" /> Place Bid
          </>
        )}
      </button>
      
      <div className="mt-4 text-xs text-gray-500">
        By placing a bid, you agree to our terms and conditions.
      </div>
    </motion.form>
  );
};

export default BidForm;