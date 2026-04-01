import express from "express"

import {
  signUp,
  signIn,
  signOut,
  sendOtp,
  verifyOtp,
  resetPassword,
  googleAuth
} from "../controllers/auth.controller.js"

const authRouter = express.Router()

// ================= AUTH =================

// Register
authRouter.post("/signup", signUp)

// Login
authRouter.post("/signin", signIn)

// Logout
authRouter.get("/signout", signOut)


// ================= OTP / PASSWORD RESET =================

// Send OTP to email
authRouter.post("/send-otp", sendOtp)

// Verify OTP
authRouter.post("/verify-otp", verifyOtp)

// Reset Password
authRouter.post("/reset-password", resetPassword)
authRouter.post("/google-auth", googleAuth)


export default authRouter