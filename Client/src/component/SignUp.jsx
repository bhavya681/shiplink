

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const SignUp = () => {
//   const styles = {
//     container: {
//       maxWidth: "400px",
//       margin: "100px auto",
//       padding: "30px",
//       backgroundColor: "#fff",
//       borderRadius: "10px",
//       boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//       textAlign: "center",
//       fontFamily: "'Poppins', sans-serif",
//     },
//     title: {
//       fontSize: "26px",
//       color: "#333",
//       marginBottom: "20px",
//       fontWeight: "bold",
//     },
//     input: {
//       width: "100%",
//       padding: "12px",
//       margin: "10px 0",
//       border: "1px solid #ccc",
//       borderRadius: "6px",
//       fontSize: "16px",
//       outline: "none",
//     },
//     radioContainer: {
//       display: "flex",
//       justifyContent: "center",
//       gap: "20px",
//       marginTop: "10px",
//       marginBottom: "10px",
//     },
//     button: {
//       width: "100%",
//       backgroundColor: "#007bff",
//       color: "#fff",
//       border: "none",
//       padding: "12px",
//       fontSize: "18px",
//       cursor: "pointer",
//       borderRadius: "6px",
//       marginTop: "10px",
//       fontWeight: "bold",
//       transition: "0.3s",
//     },
//     text: {
//       marginTop: "12px",
//       fontSize: "14px",
//     },
//     link: {
//       color: "#007bff",
//       textDecoration: "none",
//       fontWeight: "bold",
//       cursor: "pointer",
//     },
//     error: {
//       color: "red",
//       fontSize: "14px",
//       marginTop: "10px",
//     },
//   };

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     address: "",
//     phone: "",
//     profile: "",
//     role: "User",
//     bio: "",
//     secretData: "",
//     paymentLink:""
//   });

//   const [location, setLocation] = useState(null);
//   const [locationError, setLocationError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   // Get user location
//   useEffect(() => {
//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setLocation({
//             type: "Point",
//             coordinates: [
//               position.coords.longitude,
//               position.coords.latitude,
//             ],
//           });
//         },
//         (err) => {
//           setLocationError("Location access denied or unavailable.");
//         }
//       );
//     } else {
//       setLocationError("Geolocation not supported by this browser.");
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!location) {
//       toast.error("Location data is not available");
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/v1/auth/user/register",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             ...formData,
//             location,
//           }),
//         }
//       );

//       const data = await response.json();
//       setLoading(false);

//       if (data.success) {
//         toast.success("Successfully Signed To Account");
//         localStorage.setItem("auth-token", data.token);
//         navigate("/");
//         setTimeout(() => window.location.reload(), 100);
//       } else {
//         setError(data.message || "Something went wrong.");
//       }
//     } catch (err) {
//       setLoading(false);
//       setError(err.message);
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Create Account</h2>
//       <form onSubmit={handleSubmit}>
//         {Object.keys(formData).map(
//           (field) =>
//             field !== "role" && (
//               <input
//                 key={field}
//                 type={field === "password" ? "password" : "text"}
//                 name={field}
//                 placeholder={`Enter your ${field}`}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 style={styles.input}
//                 required
//               />
//             )
//         )}
//         <div style={styles.radioContainer}>
//           <label>
//             <input
//               type="radio"
//               name="role"
//               value="User"
//               checked={formData.role === "User"}
//               onChange={handleChange}
//             />
//             User
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="role"
//               value="Shipper"
//               checked={formData.role === "Shipper"}
//               onChange={handleChange}
//             />
//             Shipper
//           </label>
//         </div>

//         {locationError && <p style={styles.error}>{locationError}</p>}
//         <button
//           type="submit"
//           style={{ ...styles.button, ...(loading ? { opacity: 0.7 } : {}) }}
//           disabled={loading}
//         >
//           {loading ? "Signing Up..." : "Sign Up"}
//         </button>
//       </form>
//       {error && <p style={styles.error}>{error}</p>}
//       <p style={styles.text}>
//         Already have an account?{" "}
//         <a href="/login" style={styles.link}>
//           Login
//         </a>
//       </p>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const styles = {
    container: {
      maxWidth: "400px",
      margin: "100px auto",
      padding: "30px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
    },
    title: {
      fontSize: "26px",
      color: "#333",
      marginBottom: "20px",
      fontWeight: "bold",
    },
    input: {
      width: "100%",
      padding: "12px",
      margin: "10px 0",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
      outline: "none",
    },
    radioContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "10px",
      marginBottom: "10px",
    },
    button: {
      width: "100%",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "12px",
      fontSize: "18px",
      cursor: "pointer",
      borderRadius: "6px",
      marginTop: "10px",
      fontWeight: "bold",
      transition: "0.3s",
    },
    text: {
      marginTop: "12px",
      fontSize: "14px",
    },
    link: {
      color: "#007bff",
      textDecoration: "none",
      fontWeight: "bold",
      cursor: "pointer",
    },
    error: {
      color: "red",
      fontSize: "14px",
      marginTop: "10px",
    },
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    profile: "",
    role: "User",
    bio: "",
    secretData: "",
    paymentLink: "", // Added paymentLink to form data
  });

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            type: "Point",
            coordinates: [
              position.coords.longitude,
              position.coords.latitude,
            ],
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!location) {
      toast.error("Location data is not available");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://shiplink.onrender.com/api/v1/auth/user/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            location,
          }),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        toast.success("Successfully Signed To Account");
        localStorage.setItem("auth-token", data.token);
        navigate("/");
        setTimeout(() => window.location.reload(), 100);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map(
          (field) =>
            field !== "role" && field !== "paymentLink" && (
              <input
                key={field}
                type={field === "password" ? "password" : "text"}
                name={field}
                placeholder={`Enter your ${field}`}
                value={formData[field]}
                onChange={handleChange}
                style={styles.input}
                required
              />
            )
        )}
        <div style={styles.radioContainer}>
          <label>
            <input
              type="radio"
              name="role"
              value="User"
              checked={formData.role === "User"}
              onChange={handleChange}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Shipper"
              checked={formData.role === "Shipper"}
              onChange={handleChange}
            />
            Shipper
          </label>
        </div>

        {/* Conditional Rendering for Payment Link */}
        {formData.role === "Shipper" && (
          <input
            type="text"
            name="paymentLink"
            placeholder="Enter your payment link"
            value={formData.paymentLink}
            onChange={handleChange}
            style={styles.input}
            required
          />
        )}

        {locationError && <p style={styles.error}>{locationError}</p>}
        <button
          type="submit"
          style={{ ...styles.button, ...(loading ? { opacity: 0.7 } : {}) }}
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.text}>
        Already have an account?{" "}
        <a href="/login" style={styles.link}>
          Login
        </a>
      </p>
    </div>
  );
};

export default SignUp;
