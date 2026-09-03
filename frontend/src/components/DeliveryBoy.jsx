import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import DeliveryChat from './DeliveryChat'
import { ClipLoader } from 'react-spinners'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getSocket } from '../socketManager'

const VingoLogo = memo(({ size = "md" }) => {
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.3 : 1
  return (
    <svg width={160 * scale} height={44 * scale} viewBox="0 0 160 44" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="156" height="40" rx="20" fill="#7F77DD" />
      <circle cx="22" cy="22" r="16" fill="#534AB7" />
      <text x="22" y="28" textAnchor="middle" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="white">V</text>
      <text x="48" y="28" fontFamily="system-ui, sans-serif" fontSize="20" fontWeight="800" fill="white" letterSpacing="-0.5">Vingo</text>
      <path d="M114 16 Q121 22 114 28" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <circle cx="123" cy="22" r="2" fill="white" opacity="0.6" />
      <circle cx="130" cy="22" r="2" fill="white" opacity="0.4" />
      <circle cx="137" cy="22" r="2" fill="white" opacity="0.2" />
    </svg>
  )
})

// ✅ Chart memoized — never re-renders on GPS/location updates
const DeliveryChart = memo(({ todayDeliveries, totalEarning, ratePerDelivery }) => (
  <div className='bg-white rounded-2xl shadow-md p-5 w-[90%] border border-orange-100'>
    <div className='flex items-center justify-between mb-4'>
      <h1 className='text-lg font-bold text-[#ff4d2d]'>Today Deliveries</h1>
      <VingoLogo size="sm" />
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={todayDeliveries}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
        <YAxis allowDecimals={false} />
        <Tooltip formatter={(v) => [v, "orders"]} labelFormatter={l => `${l}:00`} />
        <Bar dataKey="count" fill='#ff4d2d' radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
    <div className='max-w-sm mx-auto mt-6 p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow text-center border border-purple-100'>
      <div className='flex justify-center mb-3'><VingoLogo size="sm" /></div>
      <p className='text-sm text-gray-500 font-medium mb-1'>Today's Earning</p>
      <span className='text-3xl font-bold text-green-600'>₹{totalEarning}</span>
      <p className='text-xs text-gray-400 mt-1'>
        {todayDeliveries.reduce((s, d) => s + d.count, 0)} deliveries × ₹{ratePerDelivery}
      </p>
    </div>
  </div>
))

function DeliveryBoy() {
  const { userData } = useSelector(state => state.user)
  const [currentOrder, setCurrentOrder] = useState(null)
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [availableAssignments, setAvailableAssignments] = useState(null)
  const [otp, setOtp] = useState("")
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [otpSuccess, setOtpSuccess] = useState(false)

  const ratePerDelivery = 50
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  // ✅ GPS — only update if moved > 30m, use cached position up to 8s
  const lastEmitRef = useRef(null)
  const locationRef = useRef(null) // store location without causing re-render

  useEffect(() => {
    const socket = getSocket()
    // ✅ FIX: role must match the schema enum exactly ("deliveryBoy", lowercase d).
    // Previously compared against "DeliveryBoy", so this effect always bailed out
    // and GPS tracking / location emits never ran for delivery boys.
    if (!socket || userData?.role !== "deliveryBoy") return
    let watchId
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        ({ coords: { latitude, longitude } }) => {
          const prev = lastEmitRef.current
          const moved = !prev ||
            Math.abs(prev.lat - latitude) > 0.0003 ||
            Math.abs(prev.lon - longitude) > 0.0003

          if (moved) {
            lastEmitRef.current = { lat: latitude, lon: longitude }
            locationRef.current = { lat: latitude, lon: longitude }
            setDeliveryBoyLocation({ lat: latitude, lon: longitude })
            socket.emit('updateLocation', { latitude, longitude, userId: userData._id })
          }
        },
        (err) => console.log('GPS:', err),
        { enableHighAccuracy: true, maximumAge: 8000, timeout: 15000 }
      )
    }
    return () => { if (watchId) navigator.geolocation.clearWatch(watchId) }
  }, [userData?._id])

  // ✅ Socket new assignment
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return
    const handler = (data) => setAvailableAssignments(prev => [...(prev || []), data])
    socket.on('newAssignment', handler)
    return () => socket.off('newAssignment', handler)
  }, [])

  // ✅ API calls with useCallback
  const getCurrentOrder = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      setCurrentOrder(result.data || null)
    } catch (e) { console.log(e) }
  }, [])

  const getAssignments = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      setAvailableAssignments(result.data)
    } catch (e) { console.log(e) }
  }, [])

  const handleTodayDeliveries = useCallback(async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`, { withCredentials: true })
      setTodayDeliveries(result.data)
    } catch (e) { console.log(e) }
  }, [])

  useEffect(() => {
    if (!userData?._id) return
    getAssignments()
    getCurrentOrder()
    handleTodayDeliveries()
  }, [userData?._id])

  const acceptOrder = useCallback(async (assignmentId) => {
    try {
      await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`, { withCredentials: true })
      await getCurrentOrder()
      // Remove accepted order from list
      setAvailableAssignments(prev => prev?.filter(a => a.assignmentId !== assignmentId))
    } catch (e) { console.log(e) }
  }, [getCurrentOrder])

  const sendOtp = async () => {
    setLoading(true)
    try {
      await axios.post(`${serverUrl}/api/order/send-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id
      }, { withCredentials: true })
      setShowOtpBox(true)
    } catch (e) { console.log(e) }
    finally { setLoading(false) }
  }

  // ✅ NO location.reload() — just reset state cleanly
  const verifyOtp = async () => {
    setOtpLoading(true)
    setMessage("")
    try {
      const result = await axios.post(`${serverUrl}/api/order/verify-delivery-otp`, {
        orderId: currentOrder._id,
        shopOrderId: currentOrder.shopOrder._id,
        otp
      }, { withCredentials: true })
      setMessage(result.data.message)
      setOtpSuccess(true)

      // ✅ Reset state without page reload — smooth & fast
      setTimeout(() => {
        setCurrentOrder(null)
        setShowOtpBox(false)
        setOtp("")
        setOtpSuccess(false)
        setMessage("")
        // Refresh data in background
        getAssignments()
        handleTodayDeliveries()
      }, 2000)

    } catch (e) {
      setMessage(e?.response?.data?.message || "Invalid OTP, try again")
      setOtpSuccess(false)
    } finally {
      setOtpLoading(false)
    }
  }

  const showChat = !!currentOrder

  return (
    <>
      <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
        <Nav />
        <div className='w-full max-w-[800px] flex flex-col gap-5 items-center pb-10'>

          {/* Welcome */}
          <div className='bg-white rounded-2xl shadow-md p-5 flex flex-col justify-center items-center w-[90%] border border-orange-100 gap-3'>
            <VingoLogo size="md" />
            <div className='text-center'>
              <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData?.fullName} 🛵</h1>
              <p className='text-gray-400 text-xs mt-1'>
                📍 {deliveryBoyLocation
                  ? `${deliveryBoyLocation.lat?.toFixed(4)}, ${deliveryBoyLocation.lon?.toFixed(4)}`
                  : 'Fetching location...'}
              </p>
            </div>
          </div>

          {/* Chart — never re-renders on location changes */}
          <DeliveryChart
            todayDeliveries={todayDeliveries}
            totalEarning={totalEarning}
            ratePerDelivery={ratePerDelivery}
          />

          {/* Available orders */}
          {!currentOrder && (
            <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
              <div className='flex items-center justify-between mb-4'>
                <h1 className='text-lg font-bold'>Available Orders</h1>
                <VingoLogo size="sm" />
              </div>
              <div className='space-y-4'>
                {availableAssignments?.length > 0 ? (
                  availableAssignments.map((a, i) => (
                    <div className='border rounded-lg p-4 flex justify-between items-center' key={a.assignmentId || i}>
                      <div>
                        <p className='text-sm font-semibold'>{a?.shopName}</p>
                        <p className='text-sm text-gray-500'><span className='font-semibold'>Address: </span>{a?.deliveryAddress?.text}</p>
                        <p className='text-xs text-gray-400'>{a.items?.length} items | ₹{a.subtotal}</p>
                      </div>
                      <button
                        className='bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-orange-600 font-semibold'
                        onClick={() => acceptOrder(a.assignmentId)}
                      >Accept</button>
                    </div>
                  ))
                ) : (
                  <p className='text-gray-400 text-sm text-center py-6'>No available orders right now</p>
                )}
              </div>
            </div>
          )}

          {/* Current order */}
          {currentOrder && (
            <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
              <div className='flex items-center justify-between mb-3'>
                <h2 className='text-lg font-bold'>📦 Current Order</h2>
                <VingoLogo size="sm" />
              </div>
              <div className='border rounded-lg p-4 mb-3'>
                <p className='font-semibold text-sm'>{currentOrder?.shopOrder?.shop?.name}</p>
                <p className='text-sm text-gray-500'>{currentOrder?.deliveryAddress?.text}</p>
                <p className='text-xs text-gray-400'>
                  {currentOrder?.shopOrder?.shopOrderItems?.length} items | ₹{currentOrder?.shopOrder?.subtotal}
                </p>
              </div>

              {/* ✅ Map wrapped in memo-friendly stable props */}
              <DeliveryBoyTracking data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData?.location?.coordinates?.[1],
                  lon: userData?.location?.coordinates?.[0]
                },
                customerLocation: {
                  lat: currentOrder?.deliveryAddress?.latitude,
                  lon: currentOrder?.deliveryAddress?.longitude
                }
              }} />

              {!showOtpBox ? (
                <button
                  className='mt-4 w-full bg-green-500 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2'
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? <ClipLoader size={20} color='white' /> : '✓ Mark As Delivered'}
                </button>
              ) : (
                <div className='mt-4 p-4 border rounded-xl bg-gray-50'>
                  {/* ✅ OTP success state */}
                  {otpSuccess ? (
                    <div className='text-center py-4'>
                      <p className='text-4xl mb-2'>🎉</p>
                      <p className='text-green-600 font-bold text-lg'>Order Delivered!</p>
                      <p className='text-gray-400 text-sm mt-1'>Great job! Loading next orders...</p>
                    </div>
                  ) : (
                    <>
                      <p className='text-sm font-semibold mb-2'>
                        Enter OTP sent to{' '}
                        <span className='text-orange-500'>{currentOrder?.user?.fullName}</span>
                      </p>
                      <input
                        type="number"
                        className='w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg tracking-widest text-center font-bold'
                        placeholder='_ _ _ _ _ _'
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        maxLength={6}
                      />
                      {message && (
                        <p className='text-center text-red-500 text-sm mb-3'>{message}</p>
                      )}
                      <button
                        className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                        onClick={verifyOtp}
                        disabled={otpLoading || !otp}
                      >
                        {otpLoading ? <ClipLoader size={18} color='white' /> : 'Submit OTP'}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {showChat && (
        <DeliveryChat
          orderId={currentOrder._id}
          deliveryBoyId={userData._id}
          deliveryBoyName={currentOrder?.user?.fullName || 'Customer'}
          deliveryBoyMobile={currentOrder?.user?.mobile}
        />
      )}
    </>
  )
}

export default DeliveryBoy
