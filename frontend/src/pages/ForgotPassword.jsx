import React from 'react'
import { useState } from 'react'
import { useFormState } from 'react-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { Navigate, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
const navigate=useNavigate()

const [step,setStep] = useState(1)
const [email, setEmail] = useState("")
const [otp, setOtp] = useState("")
const [newPassword, setNewPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-md p-8'>
        <div className='flex items-center gap-4 mb-4'>
            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d] cursor-pointer' onClick={()=> navigate("/signin")}/>
            <h1 className='text-2xl font-bold text-center text-[#ff4d2d]'>Forgot Password</h1>
        </div>
        {step==1 && 
        <div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
        >
          Send OTP
        </button>
      </div>}

      {step==2 && 
        <div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            OTP
          </label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
        >
          Verify 
        </button>
      </div>}

      {step==3 && 
        <div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            New Password
          </label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">
            Confirm Password
          </label>
          <input
            type="email"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer"
        >
          Reset Password 
        </button>
      </div>}

    </div>
    </div>
  )
}

export default ForgotPassword
