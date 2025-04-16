import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [inputFocus, setInputFocus] = useState({ email: false, password: false });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Login Successful");
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("auth-token", data.token);
        
        // Navigate to home and refresh the page for a fresh start
        navigate("/");
        setTimeout(() => window.location.reload(), 100);
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 my-4 bg-white rounded-lg shadow-lg text-center font-poppins">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          className={`w-full p-3 mb-4 border ${inputFocus.email ? "border-blue-500" : "border-gray-300"} rounded-lg text-lg focus:outline-none transition-all`}
          value={form.email}
          onChange={handleChange}
          onFocus={() => setInputFocus({ ...inputFocus, email: true })}
          onBlur={() => setInputFocus({ ...inputFocus, email: false })}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          className={`w-full p-3 mb-4 border ${inputFocus.password ? "border-blue-500" : "border-gray-300"} rounded-lg text-lg focus:outline-none transition-all`}
          value={form.password}
          onChange={handleChange}
          onFocus={() => setInputFocus({ ...inputFocus, password: true })}
          onBlur={() => setInputFocus({ ...inputFocus, password: false })}
          required
        />
        <p className="text-sm text-gray-600 mb-4">
          Forgot Password?{" "}
          <a href="/forgot-password" className="text-blue-500 font-bold hover:text-blue-700 transition-colors">
            Reset Password
          </a>
        </p>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 text-lg font-bold rounded-lg hover:bg-blue-700 transition-all"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-500 font-bold hover:text-blue-700 transition-colors">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default Login;
