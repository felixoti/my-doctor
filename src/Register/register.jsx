import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { postData } from "../../apiclient";

function Signup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    country: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    // Fetch countries from REST API
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data.map((country) => country.name.common).sort(); // Extract and sort country names
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");

    if (name === "password") {
      setPasswordValid(validatePassword(value));
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in form) {
      if (!form[key]) {
        setError("All fields are required!");
        return;
      }
    }

    if (!passwordValid) {
      setError("Password must be at least 8 characters and include a number, uppercase letter, and special character.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await postData("/register", form);
      console.log("Response:", response);
      alert("Signup successful! Redirecting...");
    } catch (error) {
      console.error("Error sending data:", error);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Country (Dropdown with API Data) */}
          <div>
            <label className="block text-gray-700">Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="" disabled>Select your country</option>
              {countries.length > 0 ? (
                countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁"}
              </button>
            </div>
            {!passwordValid && (
              <p className="text-xs text-red-500 mt-1">
                Must be at least 8 characters and include a number, uppercase letter, and special character.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
