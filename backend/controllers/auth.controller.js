import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"

// ================= SIGN UP =================
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    if (!mobile || mobile.toString().length !== 10) {
      return res.status(400).json({ message: "Mobile number must be 10 digits" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword
    })

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Sign up error: ${error.message}` })
  }
}


// ================= SIGN IN =================
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" })
    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Sign in error: ${error.message}` })
  }
}


// ================= SIGN OUT =================
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Sign out error: ${error.message}` })
  }
}


// ================= SEND OTP =================
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User does not exist" })
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    user.resetOtp = otp
    user.otpExpires = Date.now() + 5 * 60 * 1000 // 5 min
    user.isOtpVerified = false
    user.otpAttempts = 0

    await user.save()

    await sendOtpMail(email, otp)

    return res.status(200).json({ message: "OTP sent successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Send OTP error: ${error.message}` })
  }
}


// ================= VERIFY OTP =================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ message: "User not found" })
    }

    // Limit attempts
    user.otpAttempts = (user.otpAttempts || 0) + 1
    if (user.otpAttempts > 5) {
      return res.status(429).json({ message: "Too many attempts. Try again later." })
    }

    if (
      user.resetOtp !== otp ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" })
    }

    user.isOtpVerified = true
    user.resetOtp = undefined
    user.otpExpires = undefined
    user.otpAttempts = 0

    await user.save()

    return res.status(200).json({ message: "OTP verified successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Verify OTP error: ${error.message}` })
  }
}


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body

    const user = await User.findOne({ email })

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "OTP verification required" })
    }

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashedPassword
    user.isOtpVerified = false

    await user.save()

    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    return res.status(500).json({ message: `Reset password error: ${error.message}` })
  }
}

export const googleAuth=async (req, res)=> {
  try {
    const {fullName, email, mobile, role}=req.body
    const user=await User.findOne({email})
    if (!user){
      user=await User.create({
        fullName, email, mobile, role
      })
    }
    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ message: `Google Auth error error: ${error.message}` })
  }
}