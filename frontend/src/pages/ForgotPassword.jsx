import React, { useState } from "react"
import axios from "axios"
import { IoIosArrowRoundBack } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import { serverUrl } from "../App"
import ClipLoader from "react-spinners/ClipLoader"

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState("")

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!email) return setErr("Please enter email")

    try {
      setLoading(true)
      setErr("")
      const res = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      )

      console.log(res.data)
      setStep(2)
    } catch (error) {
      console.log(error)
      const msg = error?.response?.data?.message
      setErr(msg === "User not found" ? "User with this email does not exist" : msg || "Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    if (!otp) return setErr("Enter OTP")

    try {
      setLoading(true)
      setErr("")
      const res = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      )

      console.log(res.data)
      setStep(3)
    } catch (error) {
      console.log(error)
      const msg = error?.response?.data?.message || "Invalid OTP"
      setErr(msg)
    } finally {
      setLoading(false)
    }
  }

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setErr("Fill all fields")
    if (newPassword !== confirmPassword) return setErr("Passwords do not match")

    try {
      setLoading(true)
      setErr("")
      const res = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      )

      console.log(res.data)
      navigate("/signin")
    } catch (error) {
      console.log(error)
      const msg = error?.response?.data?.message || "Reset failed"
      setErr(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Enter your email"
                value={email} required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg hover:bg-[#e64323] flex items-center justify-center gap-2"
            >
              {loading && <ClipLoader size={20} color="#fff" />}
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {err && <p className="text-red-500 text-center mt-2 font-medium">{err}</p>}
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">OTP</label>
              <input
                type="text"
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Enter OTP"
                value={otp} required
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg hover:bg-[#e64323] flex items-center justify-center gap-2"
            >
              {loading && <ClipLoader size={20} color="#fff" />}
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {err && <p className="text-red-500 text-center mt-2 font-medium">{err}</p>}
          </div>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === 3 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">New Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Enter new password"
                value={newPassword} required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full border border-gray-200 rounded-lg px-3 py-2"
                placeholder="Confirm password"
                value={confirmPassword} required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-[#ff4d2d] text-white py-2 rounded-lg hover:bg-[#e64323] flex items-center justify-center gap-2"
            >
              {loading && <ClipLoader size={20} color="#fff" />}
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            {err && <p className="text-red-500 text-center mt-2 font-medium">{err}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword