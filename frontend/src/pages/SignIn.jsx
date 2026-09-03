import React, { useState, useEffect } from 'react';
import { FaRegEye, FaRegEyeSlash, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

const splashContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
};

const letterContainer = {
  hidden: {},
  visible: { transition: { delayChildren: 0.1, staggerChildren: 0.06 } },
};

const letter = {
  hidden: { y: 40, opacity: 0, rotateX: -90 },
  visible: {
    y: 0, opacity: 1, rotateX: 0,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
};

const taglineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.5, ease: "easeOut" } },
};

const barVariants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 2.4, delay: 0.8, ease: "easeInOut" } },
};

const dotVariants = {
  hidden: { opacity: 0.3, y: 0 },
  visible: (i) => ({
    opacity: [0.3, 1, 0.3],
    y: [0, -6, 0],
    transition: { duration: 1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" },
  }),
};

const FOOD_FLOATS = [
  { emoji: "🍕", x: "-38%", y: "-55%", delay: 0,    dur: 3.5 },
  { emoji: "🍔", x:  "42%", y: "-50%", delay: 0.5,  dur: 4.0 },
  { emoji: "🌮", x: "-45%", y:  "10%", delay: 1.0,  dur: 3.8 },
  { emoji: "🍜", x:  "48%", y:  "15%", delay: 0.3,  dur: 4.2 },
  { emoji: "🥗", x:  "-5%", y: "-65%", delay: 0.8,  dur: 3.2 },
  { emoji: "🍣", x:  "55%", y: "-25%", delay: 1.4,  dur: 3.6 },
];

function SplashScreen() {
  const word = "VINGO";

  return (
    <motion.div
      key="splash"
      variants={splashContainer}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ scale: [1, 1.12, 1], x: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Lottie + floating food tightly around it */}
      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: 280, height: 280 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Food emojis floating close around the animation */}
        {FOOD_FLOATS.map((item, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl select-none pointer-events-none"
            style={{ top: "50%", left: "50%", translateX: item.x, translateY: item.y }}
            animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
            transition={{ duration: item.dur, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.emoji}
          </motion.span>
        ))}

        {/* Lottie */}
        <div className="w-52 h-52 sm:w-56 sm:h-56 relative z-10">
          <DotLottieReact
            src="https://lottie.host/fd99d07c-1fe8-4534-a958-e2895b3c34ff/unn7hfuY12.lottie"
            loop
            autoplay
          />
        </div>
      </motion.div>

      {/* Brand name */}
      <motion.div
        variants={letterContainer}
        initial="hidden"
        animate="visible"
        className="flex overflow-hidden mt-4"
        style={{ perspective: 600 }}
      >
        {word.split("").map((char, i) => (
          <motion.span
            key={i}
            variants={letter}
            className="inline-block bg-clip-text text-transparent text-5xl sm:text-6xl font-black tracking-tighter"
            style={{
              backgroundImage: "linear-gradient(135deg, #1e1b4b 30%, #a855f7 60%, #3b82f6 100%)",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.div>

      {/* Tagline */}
      <motion.p
        variants={taglineVariants}
        initial="hidden"
        animate="visible"
        className="text-purple-500 font-semibold text-sm mt-2 tracking-widest uppercase"
      >
        Delicious food delivery
      </motion.p>

      {/* Progress bar */}
      <div className="w-48 h-1.5 mt-8 rounded-full bg-purple-100 overflow-hidden">
        <motion.div
          variants={barVariants}
          initial="hidden"
          animate="visible"
          className="h-full w-full rounded-full origin-left"
          style={{ background: "linear-gradient(90deg, #a855f7, #3b82f6)" }}
        />
      </div>

      {/* Dots */}
      <div className="flex gap-2.5 mt-5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            custom={i}
            variants={dotVariants}
            initial="hidden"
            animate="visible"
            className="w-2.5 h-2.5 rounded-full bg-purple-500"
          />
        ))}
      </div>
    </motion.div>
  );
}

function SignIn() {
  const [showSplash, setShowSplash] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) return setErr("Please fill in all fields");
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      navigate("/");
    } catch (error) {
      setErr(error?.response?.data?.message || "Invalid credentials");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        { email: result.user.email },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      navigate("/");
    } catch (error) {
      setErr("Google sign-in failed");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <SplashScreen key="splash" />
      ) : (
        <motion.div
          key="signin"
          className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 backdrop-blur-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div initial="hidden" animate="visible" variants={containerVariants}>

              <motion.div className="flex justify-center mb-6" variants={itemVariants}>
                <div className="text-2xl font-black text-gray-900 tracking-tighter">
                  Vingo<span className="text-purple-600">.</span>
                </div>
              </motion.div>

              <motion.div className="mb-8 text-center" variants={itemVariants}>
                <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
                <p className="text-gray-500 mt-2">Sign in to continue to your dashboard</p>
              </motion.div>

              <div className="space-y-4">
                <motion.div className="relative" variants={itemVariants}>
                  <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </motion.div>

                <motion.div className="relative" variants={itemVariants}>
                  <FaLock className="absolute left-4 top-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-12 py-3 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash size={18} /> : <FaRegEye size={18} />}
                  </button>
                </motion.div>

                <motion.div className="flex justify-end" variants={itemVariants}>
                  <span
                    className="text-sm text-purple-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </span>
                </motion.div>
              </div>

              <AnimatePresence>
                {err && (
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-red-500 text-sm mt-4 text-center font-medium"
                  >
                    {err}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                className="w-full mt-6 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all flex justify-center items-center gap-2"
                onClick={handleSignIn}
                disabled={loading}
                variants={itemVariants}
              >
                {loading ? <ClipLoader size={18} color="white" /> : <>Sign In <FaArrowRight size={14} /></>}
              </motion.button>

              <motion.div className="relative my-8" variants={itemVariants}>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs text-gray-400">
                  <span className="bg-white px-2 uppercase font-bold">Or continue with</span>
                </div>
              </motion.div>

              <motion.button
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3.5 hover:bg-gray-50 transition-all"
                onClick={handleGoogleAuth}
                variants={itemVariants}
              >
                <FcGoogle size={20} /> Google
              </motion.button>

              <motion.p className="text-center mt-8 text-sm text-gray-600" variants={itemVariants}>
                New here?{" "}
                <span
                  className="text-purple-600 font-semibold cursor-pointer hover:underline"
                  onClick={() => navigate("/signup")}
                >
                  Create an account
                </span>
              </motion.p>

            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SignIn;