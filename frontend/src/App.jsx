import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import Footer from './components/Footer'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './socketManager'

export const serverUrl = import.meta.env.VITE_API_URL || "http://localhost:8000"

const HIDE_FOOTER_ON = ['/signin', '/signup', '/forgot-password']

function AppContent() {
  const { userData } = useSelector(state => state.user)
  const location = useLocation()
  const showFooter = !HIDE_FOOTER_ON.includes(location.pathname)

  return (
    <>
      <Routes>
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={"/"} />} />
        <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />} />
        <Route path='/' element={userData ? <Home /> : <Navigate to={"/signin"} />} />
        <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={"/signin"} />} />
        <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to={"/signin"} />} />
        <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={"/signin"} />} />
        <Route path='/cart' element={userData ? <CartPage /> : <Navigate to={"/signin"} />} />
        <Route path='/checkout' element={userData ? <CheckOut /> : <Navigate to={"/signin"} />} />
        <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to={"/signin"} />} />
        <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to={"/signin"} />} />
        <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to={"/signin"} />} />
        <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to={"/signin"} />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  )
}

function App() {
  const { userData } = useSelector(state => state.user)

  useGetCurrentUser()
  useUpdateLocation()
  useGetCity()
  useGetMyshop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  useEffect(() => {
    if (!userData) return  // ✅ only connect socket when logged in

    const socketInstance = io(serverUrl, { withCredentials: true })
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      socketInstance.emit('identity', { userId: userData._id })
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [userData?._id])

  return <AppContent />
}

export default App
