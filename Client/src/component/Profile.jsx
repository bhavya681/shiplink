import React, { useEffect, useState } from "react";
import { FiMail, FiMapPin, FiPhone, FiEdit } from "react-icons/fi";
import { ImConnection } from "react-icons/im";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("auth-token"),
          },
        });

        const data = await res.json();
        if (data.success) {
          setUser(data.profileDetails);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // ✅ Runs only once when the component mounts

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[7rem] bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative">
          <img
            src="https://media.istockphoto.com/id/1159181150/photo/time-change-above-panorama-of-mountain-landscape.jpg?s=612x612&w=0&k=20&c=wUXPg6iyGUvCcWnQGqB6kOKns37Pu9MfEj4_PRcE7QE="
            alt="Cover"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
        </div>

        {/* Profile Image */}
        <div className="relative flex justify-center -mt-14">
          <img
            src={user.profile || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg hover:scale-110 transition"
          />
        </div>

        {/* Profile Details */}
        <div className="text-center px-6 py-6">
          <h2 className="text-3xl font-bold text-gray-900">{user.name || "John Doe"}</h2>
          <p className="text-gray-500 text-lg flex justify-center items-center">
            <ImConnection className="text-green-500 mr-2" />
            {user.role || "Software Engineer"}
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">1.2k</div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">450</div>
              <div className="text-gray-500">Following</div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-center space-x-4 text-gray-700">
              <FiMail className="text-lg text-blue-500" />
              <span>{user.email || "user@example.com"}</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-gray-700">
              <FiMapPin className="text-lg text-purple-500" />
              <span>{user.address || "No Address Provided"}</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-gray-700">
              <FiPhone className="text-lg text-green-500" />
              <span>{user.phone || "No Phone Number"}</span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-gray-600 leading-relaxed">
              {user?.bio || "Passionate developer focused on building amazing user experiences."}
            </p>
          </div>

          {/* Buttons Section */}
          <div className="flex justify-center mt-6 space-x-4">
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition transform hover:scale-105 flex items-center">
              <FiEdit className="mr-2" />
              <Link to={`/profile/edit/${user._id}`}>Edit Profile</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


// import React, { useEffect, useState } from "react";
// import { FiMail, FiMapPin, FiPhone, FiEdit, FiUser, FiCalendar } from "react-icons/fi";
// import { ImConnection } from "react-icons/im";
// import { Link, useLocation } from "react-router-dom";
// import { motion } from "framer-motion";

// const Profile = () => {
//   const [user, setUser] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const location = useLocation();
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:8000/api/v1/auth/user/profile", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "auth-token": localStorage.getItem("auth-token"),
//           },
//         });

//         const data = await res.json();
//         if (data.success) {
//           setUser(data.profileDetails);
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [location.pathname]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
//         ></motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-28 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="max-w-5xl mx-auto"
//       >
//         {/* Profile Card */}
//         <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
//           {/* Cover Photo */}
//           <div className="relative h-48 sm:h-56">
//             <img
//               src="https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
//               alt="Cover"
//               className="w-full h-full object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/60"></div>
//           </div>

//           {/* Profile Header */}
//           <div className="relative px-6 sm:px-8">
//             {/* Profile Picture */}
//             <div className="flex justify-center -mt-16">
//               <motion.div
//                 whileHover={{ scale: 1.05 }}
//                 className="relative group"
//               >
//                 <img
//                   src={user.profile || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80"}
//                   alt="Profile"
//                   className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl"
//                 />
//                 <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                   <FiUser className="text-white text-2xl" />
//                 </div>
//               </motion.div>
//             </div>

//             {/* User Info */}
//             <div className="text-center mt-4">
//               <h1 className="text-3xl font-bold text-gray-900">{user.name || "John Doe"}</h1>
//               <div className="flex items-center justify-center mt-2">
//                 <ImConnection className="text-green-500 mr-2" />
//                 <span className="text-lg text-gray-600">{user.role || "Software Engineer"}</span>
//               </div>

//               {/* Stats */}
//               <div className="flex justify-center space-x-8 mt-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">1.2k</div>
//                   <div className="text-gray-500 text-sm uppercase tracking-wider">Followers</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">450</div>
//                   <div className="text-gray-500 text-sm uppercase tracking-wider">Following</div>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-gray-900">24</div>
//                   <div className="text-gray-500 text-sm uppercase tracking-wider">Projects</div>
//                 </div>
//               </div>
//             </div>

//             {/* Contact Info */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//               <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
//                 <div className="p-3 bg-blue-100 rounded-full mr-4">
//                   <FiMail className="text-blue-600 text-xl" />
//                 </div>
//                 <div>
//                   <h3 className="text-sm text-gray-500">Email</h3>
//                   <p className="text-gray-900 font-medium">{user.email || "user@example.com"}</p>
//                 </div>
//               </div>

//               <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
//                 <div className="p-3 bg-purple-100 rounded-full mr-4">
//                   <FiMapPin className="text-purple-600 text-xl" />
//                 </div>
//                 <div>
//                   <h3 className="text-sm text-gray-500">Location</h3>
//                   <p className="text-gray-900 font-medium">{user.address || "No Address Provided"}</p>
//                 </div>
//               </div>

//               <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
//                 <div className="p-3 bg-green-100 rounded-full mr-4">
//                   <FiPhone className="text-green-600 text-xl" />
//                 </div>
//                 <div>
//                   <h3 className="text-sm text-gray-500">Phone</h3>
//                   <p className="text-gray-900 font-medium">{user.phone || "No Phone Number"}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Bio Section */}
//             <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
//               <p className="text-gray-700 leading-relaxed">
//                 {user.bio || "Passionate developer with a focus on creating exceptional user experiences. Specializing in modern web technologies and design systems. Committed to writing clean, efficient code and solving complex problems."}
//               </p>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex justify-center mt-10 pb-8 space-x-4">
//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
//               >
//                 <FiEdit className="mr-2" />
//                 <Link to={`/profile/edit/${user._id}`}>Edit Profile</Link>
//               </motion.button>
        
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default Profile;