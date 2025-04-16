import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import Footer from "./component/Footer";
import Navbar from "./component/Navbar";
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import Profile from "./component/Profile";
import Service from "./component/stuff/Service";
import About from "./component/stuff/About";
import Contact from "./component/stuff/Contact";
import EditProfile from "./component/EditProfile";
import ForgotPassword from "./component/ForgotPassword";
import AddShipment from "./component/Shipment/AddShipment";
import UpdateShipment from "./component/Shipment/UpdateShipment";
import GetMyShipment from "./component/Shipment/GetMyShipment";
import GetAllShipment from "./component/Shipment/GetAllShipment";
import MyShipment from "./component/Shipment/MyShipment";
import BidWars from "./component/Bid/BidWars";
import Booking from "./component/Booking/Booking";
import BookingGets from "./component/Booking/BookingGets";
import BookingOwnerList from "./component/Booking/BookingOwnerList";
import BookingBidWinner from "./component/Bid/BookingBidWinner";
import Chatroom from "./component/Chats/ChatRoom";
import PrivateChat from "./component/Chats/PrivateChat";
import GetAllUsers from "./component/Chats/GetAllUsers";
import GetAllShippers from "./component/Chats/GetAllShippers";
import SpecialPrivateChat from "./component/Chats/SpecialPrivateChat";

function App() {
  const isAuthenticated = localStorage.getItem("auth-token");
  const role = localStorage.getItem("role");
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit/:id" element={<EditProfile />} />
              <Route path="/bid/:id" element={<BidWars />} />
              {role === "User" ? (
                <>
                  <Route path="/add/shipment" element={<AddShipment />} />
                  <Route
                    path="/edit/shipment/:id"
                    element={<UpdateShipment />}
                  />
                  <Route path="/get/shipment/:id" element={<GetMyShipment />} />
                  <Route path="/get/my/shipments" element={<MyShipment />} />
                  <Route
                    path="/bookingsHistory"
                    element={<BookingOwnerList />}
                  />
                  <Route path="/bidWars" element={<BidWars />} />
                  <Route
                    path="/personal/chats/:user1/:user2"
                    element={<PrivateChat />}
                  />  
                   <Route
                    path="/personal/chats"
                    element={<SpecialPrivateChat />}
                  /> 
                  <Route path="/chatRoom" element={<Chatroom />} />
                  <Route path="/shippers" element={<GetAllShippers />} />
                </>
              ) : (
                <>
                   <Route
                    path="/personal/chats"
                    element={<SpecialPrivateChat />}
                  /> 
                   <Route path="/users" element={<GetAllUsers />} />
                  <Route path="/get/shipments" element={<GetAllShipment />} />
                  <Route path="/booking/:id" element={<Booking />} />
                  <Route
                    path="/booking/bid/:id"
                    element={<BookingBidWinner />}
                  />
                  <Route path="/bookings" element={<BookingGets />} />
                  <Route
                    path="/personal/chats/:user1/:user2"
                    element={<PrivateChat />}
                  />
                  <Route path="/chatRoom" element={<Chatroom />} />
                </>
              )}
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/services" element={<Service />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </>
          )}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/services" element={<Service />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
