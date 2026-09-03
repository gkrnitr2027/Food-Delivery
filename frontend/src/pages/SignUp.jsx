import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaUserAlt, FaStore, FaMotorcycle } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Vingo Pill Logo ───────────────────────────────────────────────────────────

const VingoLogo = ({ size = "md" }) => {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.3 : 1;
  const w = 160 * scale;
  const h = 44 * scale;
  return (
    <svg width={w} height={h} viewBox="0 0 160 44" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="156" height="40" rx="20" fill="#7F77DD" />
      <circle cx="22" cy="22" r="16" fill="#534AB7" />
      <text
        x="22" y="28"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="700"
        fill="white"
      >V</text>
      <text
        x="48" y="28"
        fontFamily="system-ui, sans-serif"
        fontSize="20"
        fontWeight="800"
        fill="white"
        letterSpacing="-0.5"
      >Vingo</text>
      <path
        d="M114 16 Q121 22 114 28"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="123" cy="22" r="2" fill="white" opacity="0.6" />
      <circle cx="130" cy="22" r="2" fill="white" opacity="0.4" />
      <circle cx="137" cy="22" r="2" fill="white" opacity="0.2" />
    </svg>
  );
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};

// ─── SignUp ────────────────────────────────────────────────────────────────────

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    if (!fullName || !email || !mobile || !password) return setErr("All fields are required");
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!mobile) return setErr("Please enter mobile number first");
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
          mobile,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      navigate("/");
    } catch (error) {
      setErr("Google sign-in failed");
    }
  };

  // ✅ FIX: role ids must exactly match the backend's Mongoose enum:
  // enum: ["user", "owner", "deliveryBoy"]
  // "DeliveryBoy" (capital D) was being sent before, which failed schema validation.
  const roles = [
    { id: "user",        label: "Customer",  icon: <FaUserAlt /> },
    { id: "owner",       label: "Owner",     icon: <FaStore /> },
    { id: "deliveryBoy", label: "Delivery",  icon: <FaMotorcycle /> },
  ];

  const fields = [
    { icon: FaUser,     type: "text",  val: fullName, set: setFullName, placeholder: "Full name" },
    { icon: FaEnvelope, type: "email", val: email,    set: setEmail,    placeholder: "Email address" },
    { icon: FaPhone,    type: "tel",   val: mobile,   set: setMobile,   placeholder: "Mobile number" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6, damping: 18 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 border border-gray-100"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* ── Logo + heading ── */}
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-8 gap-3">
            <VingoLogo size="md" />
            <p className="text-gray-500 text-sm font-medium text-center leading-relaxed">
              Create your account to get started with<br />delicious food deliveries
            </p>
          </motion.div>

          {/* ── Input fields ── */}
          <div className="space-y-4">
            {fields.map((item, idx) => (
              <motion.div key={idx} variants={itemVariants} className="relative">
                <item.icon className="absolute left-4 top-4 text-gray-400" />
                <input
                  type={item.type}
                  className="w-full border border-gray-200 rounded-2xl px-12 py-3.5 outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all text-sm"
                  placeholder={item.placeholder}
                  onChange={(e) => item.set(e.target.value)}
                  value={item.val}
                />
              </motion.div>
            ))}

            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <FaLock className="absolute left-4 top-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-200 rounded-2xl px-12 py-3.5 outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all text-sm"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
              </button>
            </motion.div>

            {/* Role selector */}
            <motion.div variants={itemVariants}>
              <p className="text-xs text-gray-400 font-semibold mb-2 ml-1 uppercase tracking-wide">I am a</p>
              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1.5 rounded-2xl">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    className={`flex flex-col items-center justify-center py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                      role === r.id
                        ? "bg-[#7F77DD] text-white shadow-lg shadow-purple-200"
                        : "text-gray-500 hover:text-gray-800 hover:bg-white"
                    }`}
                    onClick={() => setRole(r.id)}
                  >
                    <span className="mb-1 text-base">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Error ── */}
          <AnimatePresence>
            {err && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-xs mt-4 text-center font-medium"
              >
                {err}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ── Sign Up button ── */}
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 bg-[#7F77DD] text-white font-bold py-3.5 rounded-2xl hover:bg-[#534AB7] transition-all shadow-lg shadow-purple-200 flex justify-center items-center gap-2"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Create Account"}
          </motion.button>

          {/* ── Divider ── */}
          <motion.div variants={itemVariants} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-3 uppercase font-bold tracking-wide">Or</span>
            </div>
          </motion.div>

          {/* ── Google ── */}
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-2xl py-3.5 hover:bg-gray-50 transition-all"
            onClick={handleGoogleAuth}
          >
            <FcGoogle size={20} />
            <span className="font-semibold text-gray-700 text-sm">Sign up with Google</span>
          </motion.button>

          {/* ── Sign in link ── */}
          <motion.p variants={itemVariants} className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <span
              className="text-[#7F77DD] font-bold cursor-pointer hover:underline"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </span>
          </motion.p>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default SignUp;
