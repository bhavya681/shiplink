// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const EditProfile = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     profile: "",
//     phone: "",
//     address: "",
//     secretData: "",
//     role: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("auth-token");
//         if (!token) {
//           setMessage({ text: "Unauthorized access. Please log in.", type: "error" });
//           return;
//         }

//         const res = await fetch("http://localhost:8000/api/v1/auth/user/profile", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               "auth-token": localStorage.getItem("auth-token"),
//             },
//           });

//         if (!res.ok) {
//           throw new Error("Failed to fetch user data.");
//         }

//         const data = await res.json();
//         setFormData(data.profileDetails);
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setMessage({ text: "Error loading profile. Please try again later.", type: "error" });
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const token = localStorage.getItem("auth-token");
//       if (!token) {
//         setMessage({ text: "Unauthorized access. Please log in.", type: "error" });
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`http://localhost:8000/api/v1/auth/user/edit/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           "auth-token": token,
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (data.success) {
//         toast.success({ text: "Profile updated successfully!", type: "success" });
//         navigate("/profile");
//       } else {
//         toast.error({ text: data.message || "Update failed. Try again.", type: "error" });
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error({ text: "An error occurred while updating.", type: "error" });
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-36 bg-white shadow-lg rounded-xl">
//       <h2 className="text-2xl font-semibold mb-5 text-center">Edit Profile</h2>

//       {message.text && (
//         <p className={`text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
//           {message.text}
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Full Name"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email Address"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//             required
//           />
//         </div>

//         <input
//           type="text"
//           name="profile"
//           value={formData.profile}
//           onChange={handleChange}
//           placeholder="Profile Image URL"
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//           required
//         />

//         <div className="grid grid-cols-2 gap-4">
//           <input
//             type="tel"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             placeholder="Phone Number"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//             required
//           />
//           <input
//             type="text"
//             name="role"
//             value={formData.role}
//             onChange={handleChange}
//             placeholder="Role (e.g., Admin, User)"
//             className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//             required
//           />
//         </div>

//         <textarea
//           name="address"
//           value={formData.address}
//           onChange={handleChange}
//           placeholder="Address"
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//           required
//         />

//         <input
//           type="password"
//           name="secretData"
//           value={formData.secretData}
//           onChange={handleChange}
//           placeholder="Secret Data"
//           className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
//           disabled={loading}
//         >
//           {loading ? "Updating..." : "Update Profile"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEdit2,
  FiArrowLeft,
} from "react-icons/fi";
import { Biohazard } from "lucide-react";

const EditProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile: "",
    phone: "",
    address: "",
    secretData: "",
    bio: "",
    role: "",
    paymentLink: "",
  });

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: "Point",
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (err) => {
          setLocationError("Location access denied or unavailable.");
        }
      );
    } else {
      setLocationError("Geolocation not supported by this browser.");
    }
  }, []);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          toast.error("Unauthorized access. Please log in.");
          navigate("/login");
          return;
        }

        const res = await fetch(
          "https://shiplink.onrender.com/api/v1/auth/user/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await res.json();
        setFormData(data.profileDetails);
        if (data.profileDetails.profile) {
          setPreviewImage(data.profileDetails.profile);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error loading profile. Please try again later.");
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, profile: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Unauthorized access. Please log in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const res = await fetch(
        `https://shiplink.onrender.com/api/v1/auth/user/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({ ...formData, location }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error(data.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-25 bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Profile
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiEdit2 className="mr-3" />
              Edit Profile
            </h2>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-lg">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <FiUser className="w-16 h-16 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profile-upload"
                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  Click the icon to change your profile picture
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      required
                    />
                  </div>
                </div>
                {formData.role === "Shipper" && (
                  <>
                    <div className="space-y-2">
                      <label
                        htmlFor="paymentLink"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Payment Link
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="paymentLink"
                          name="paymentLink"
                          value={formData.paymentLink}
                          onChange={handleChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      required
                    />
                  </div>
                </div>

                {/*Bio Stuff*/}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter Bio
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Biohazard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      required
                    />
                  </div>
                </div>
                {/* Phone Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      required
                    />
                  </div>
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="User">User</option>
                    <option value="Shipper">Shipper</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Address Field */}
                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      required
                    />
                  </div>
                </div>

                {/* Secret Data Field */}
                <div className="md:col-span-2 space-y-2">
                  <label
                    htmlFor="secretData"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="secretData"
                      name="secretData"
                      value={formData.secretData}
                      onChange={handleChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-4 border"
                      placeholder="Enter new password if you want to change"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditProfile;
