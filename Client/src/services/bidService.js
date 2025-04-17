const API_URL = "https://shiplink.onrender.com/api/v1/bids";

// ✅ Fetch all bids for a shipment
export const getBidsForShipment = async (shipmentId) => {
  try {
    const res = await fetch(`${API_URL}/${shipmentId}`, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "Application/Json",
      },
    });
  const data=await res.json();
  if(data.success){
  return data;
  }
  } catch (error) {
    console.error(error);
    return [];
  }
};

// ✅ Place a bid
export const placeBid = async (shipmentId, amount) => {
  try {
    const res = await fetch(`${API_URL}/${shipmentId}`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
   const data=await res.json();
   if(data.success){
    return data;
   }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Accept a bid
export const acceptBid = async (bidId) => {
  try {
    const res = await fetch(`${API_URL}/${bidId}/accept`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });
  const data=await res.json();
  if(data.success){
    return data;
  }
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Reject a bid
export const rejectBid = async (bidId) => {
  try {
    const res = await fetch(`${API_URL}/${bidId}/reject`, {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
    });
   const data=await res.json();
   if(data.success){
    return data;
   }
  } catch (error) {
    console.error(error);
    return null;
  }
};
