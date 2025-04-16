// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";
// import { Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const isAuthenticated = localStorage.getItem("auth-token");
//   const checkRole = localStorage.getItem("role");

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch(
//           "http://localhost:8000/api/v1/auth/user/profile",
//           {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "auth-token": localStorage.getItem("auth-token"),
//             },
//           }
//         );
//         const data = await res.json();
//         if (data.success) {
//           setUser(data.profileDetails);
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };
//     if (isAuthenticated) fetchProfile();
//   }, [isAuthenticated]);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("auth-token");
//     navigate("/");
//   };

//   return (
//     <header
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? "py-3 bg-white/80 backdrop-blur-md shadow-md"
//           : "py-5 bg-transparent"
//       }`}
//     >
//       <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
//             <span className="text-white font-bold text-lg">S</span>
//           </div>
//           <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
//             ShipLink
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav className="hidden md:flex items-center gap-8">
//           {isAuthenticated ? (
//             <>
//               {checkRole === "User" ? (
//                 <>
//                   <Link to="/add/shipment" className="nav-link">
//                     List Shipment
//                   </Link>
//                   {/* <Link to="/edit/shipment/:id" className="nav-link">
//                     Edit Shipment
//                   </Link> */}
//                   <Link to="/get/my/shipments" className="nav-link">
//                     My Listed Shipments
//                   </Link>
//                   <Link to="/bookingsHistory" className="nav-link">
//                     Appointment Request
//                   </Link>
//                 </>
//               ) : (
//                 <>
//                   <Link to="/get/shipments" className="nav-link">
//                     Avialable Shipments
//                   </Link>
//                   <Link to="/bookings" className="nav-link">
//                     Bookings
//                   </Link>
//                 </>
//               )}

//               {/* Profile Dropdown */}
//               <div className="relative">
//                 <button
//                   className="flex items-center gap-2 cursor-pointer"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                 >
//                   {user?.profile ? (
//                     <img
//                       src={user.profile}
//                       alt={user.name || "User Profile"}
//                       className="w-10 h-10 rounded-full border-2 border-gray-300 shadow-md hover:border-blue-500 transition"
//                     />
//                   ) : (
//                     <FaUserCircle className="w-10 h-10 text-gray-500 hover:text-blue-500 transition" />
//                   )}
//                 </button>

//                 {/* Dropdown Menu */}
//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-lg border border-gray-200  animate-fade-in">
//                     <Link
//                       to="/profile"
//                       className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
//                     >
//                       <img
//                         src={user.profile}
//                         alt={user.name || "User Profile"}
//                         className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-md hover:border-blue-500 transition"
//                       />
//                       View Profile
//                     </Link>

//                     <button
//                       onClick={handleLogout}
//                       className="flex items-center cursor-pointer gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-red-500"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M17 16l4-4m0 0l-4-4m4 4H7"
//                         />
//                       </svg>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </>
//           ) : (
//             <>
//               <a href="#how-it-works" className="nav-link">
//                 How It Works
//               </a>
//               <a href="#features" className="nav-link">
//                 Features
//               </a>
//               <a href="#testimonials" className="nav-link">
//                 Testimonials
//               </a>
//               <div className="flex items-center gap-4">
//                 <Link to="/login" className="nav-link">
//                   Log in
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Sign up
//                 </Link>
//               </div>
//             </>
//           )}
//         </nav>

//         {/* Mobile Menu Toggle */}
//         <button
//           className="md:hidden text-gray-700"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg animate-fade-in">
//           <div className="container mx-auto px-4 py-5 flex flex-col gap-4">
//             {isAuthenticated ? (
//               <>
//                 <div className="flex items-center gap-4 border-b pb-3">
//                   <Link to="/profile" className="flex items-center gap-3">
//                     {user?.profile ? (
//                       <img
//                         src={user.profile}
//                         alt={user.name || "User Profile"}
//                         className="w-12 h-12 rounded-full border-2 border-gray-300 shadow-md"
//                       />
//                     ) : (
//                       <FaUserCircle className="w-12 h-12 text-gray-500" />
//                     )}
//                     <div>
//                       <p className="text-base font-semibold text-gray-800">
//                         {user.name || "User Name"}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {user.email || "user@example.com"}
//                       </p>
//                     </div>
//                   </Link>
//                 </div>

//                 <button
//                   className="w-full text-sm font-medium text-red-500 py-2 bg-gray-100 rounded-md hover:bg-red-100 transition"
//                   onClick={handleLogout}
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <nav className="flex flex-col gap-2 text-center">
//                   <a href="#how-it-works" className="nav-link">
//                     How It Works
//                   </a>
//                   <a href="#features" className="nav-link">
//                     Features
//                   </a>
//                   <a href="#testimonials" className="nav-link">
//                     Testimonials
//                   </a>
//                 </nav>

//                 <div className="flex flex-col gap-3 pt-3 border-t border-gray-200">
//                   <Link to="/login" className="nav-link">
//                     Log in
//                   </Link>
//                   <Link
//                     to="/signup"
//                     className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-md"
//                   >
//                     Sign up
//                   </Link>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShippingFast, FaUserCircle } from "react-icons/fa";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Group,
  Users2,
} from "lucide-react";
import { MdOutlineGroups2 } from "react-icons/md";
import { RiUserAddFill } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("auth-token");
  const checkRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/v1/auth/user/profile",
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
          setUser(data.profileDetails);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".dropdown-container")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "py-2 bg-white/10 backdrop-blur-lg "
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent">
              ShipLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                {checkRole === "User" ? (
                  <>
                    <Link
                      to="/add/shipment"
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      List Shipment
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      to="/get/my/shipments"
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      My Shipments
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      to="/bookingsHistory"
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      Appointments
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      to={`/chatRoom`}
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <MdOutlineGroups2 size={25} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                      to={`/shippers`}
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <FaShippingFast size={25} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/get/shipments"
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      Available Shipments
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      to="/bookings"
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      Bookings
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link
                      to={`/chatRoom`}
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <MdOutlineGroups2 size={25} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>

                    <Link
                      to={`/users`}
                      className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                    >
                      <Users2 size={21} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}

                {/* Profile Dropdown */}
                <div className="relative dropdown-container">
                  <button
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {user?.profile ? (
                      <div className="relative">
                        <img
                          src={user.profile}
                          alt={user.name || "User Profile"}
                          className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 shadow-sm hover:border-blue-400 transition-all duration-300"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                          <ChevronDown
                            className={`w-3 h-3 text-white transition-transform duration-200 ${
                              dropdownOpen ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <FaUserCircle className="w-9 h-9 text-gray-400 hover:text-blue-500 transition-colors" />
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-white">
                          <ChevronDown
                            className={`w-3 h-3 text-white transition-transform duration-200 ${
                              dropdownOpen ? "transform rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-gray-100 ring-opacity-5 focus:outline-none animate-fade-in-up">
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || "User Name"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-red-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <a
                  href="#how-it-works"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                >
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#features"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a
                  href="#testimonials"
                  className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                >
                  Testimonials
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <div className="flex items-center space-x-4 ml-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:shadow-md"
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-16 bg-white shadow-lg  mt-1 shadow-gray-200 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 flex items-center space-x-3 border-b border-gray-100">
                  {user?.profile ? (
                    <img
                      src={user.profile}
                      alt={user.name || "User Profile"}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <FaUserCircle className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || "User Name"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {checkRole === "User" ? (
                  <>
                    <Link
                      to="/add/shipment"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      List Shipment
                    </Link>
                    <Link
                      to="/get/my/shipments"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Shipments
                    </Link>
                    <Link
                      to="/chatRoom"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MdOutlineGroups2 size={25} />
                    </Link>
                    <Link
                      to="/bookingsHistory"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Appointments
                    </Link>

                    <Link
                      to={`/shippers`}
                      className=" px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex gap-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Shippers<FaShippingFast size={21} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/get/shipments"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Available Shipments
                    </Link>
                    <Link
                      to="/chatRoom"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <MdOutlineGroups2 size={25} />
                    </Link>
                    <Link
                      to="/bookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <Link
                      to={`/users`}
                      className=" px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex gap-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                     Users <Users2 size={19} />
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Profile
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2 text-red-500" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <a
                  href="#how-it-works"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
                <div className="pt-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-2 mt-2 text-center text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
