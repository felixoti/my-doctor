import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.email || !form.password) {
      showNotification("All fields are required!", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/login", form, {
        headers: { "Content-Type": "application/json" }
      });

      console.log("Login Successful:", response.data);
      
      // Store authentication
      localStorage.setItem("isAuthenticated", "true");

      // Show success notification
      showNotification("Login successful!", "success");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/chatbot"); 
      }, 2000);

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        showNotification(error.response.data.error || "Invalid Credentials. Please try again.", "error");
      } else {
        showNotification("Server error. Please try again later.", "error");
      }
    }
  };

  const showNotification = (msg, type) => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage(""); // Auto-hide notification
    }, 1500); // Message disappears in 1.5 seconds
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Notification Popup */}
      {message && (
        <div className={`absolute top-4 px-4 py-2 rounded-lg text-white text-center ${messageType === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {message}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input with Eye Icon */}
          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {/* Open Eye Icon (Visible Password) */}
                {passwordVisible ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Closed Eye Icon (Hidden Password) */
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.49 10.49 0 0112 19c-7 0-11-7-11-7a18.9 18.9 0 014.22-5.59" />
                    <path d="M21 21l-3-3m-2.6-2.6a4 4 0 00-5.66 0" />
                    <path d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <p className="text-center text-gray-600 mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
