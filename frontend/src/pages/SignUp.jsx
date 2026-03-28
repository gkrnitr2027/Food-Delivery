import axios from "axios";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSignUp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );

      console.log("Signup success:", result.data);

      navigate("/signin");
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 w-full"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: primaryColor }}
        >
          Vingo
        </h1>
        <p className="text-gray-600 mb-8">
          Create your account to get started!
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your full name"
            style={{ border: `1px solid ${borderColor}` }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your email"
            style={{ border: `1px solid ${borderColor}` }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            placeholder="Enter your mobile number"
            style={{ border: `1px solid ${borderColor}` }}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              placeholder="Enter your password"
              style={{ border: `1px solid ${borderColor}` }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "Delivery"].map((r) => (
              <button
                key={r}
                type="button"
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="button"
          onClick={handleSignUp}
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
        >
          Sign Up
        </button>

        {/* Google Button */}
        <button
          type="button"
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-400 hover:bg-gray-100 cursor-pointer"
        >
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        {/* Redirect */}
        <p
          className="text-center mt-5 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-[#ff4d2d]">Sign In</span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;