import React, { useEffect, useState } from 'react'
import { IoMdArrowBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearchLocation } from "react-icons/fa";
import { BiCurrentLocation } from "react-icons/bi";
import { GiScooter } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import 'leaflet/dist/leaflet.css';
import { setAddress, setLocation } from '../redux/mapSlice';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App.jsx";


const RecenterMap = ({location}) => {
    const map=useMap()
    useEffect(() => {
        if (location?.lat && location?.lon) {
            map.setView([location.lat, location.lon], 16, { animate: true })
        }
    }, [location, map])
    return null
}

const CheckOut = () => {
    const navigate = useNavigate()
    const { location, address } = useSelector(state => state.map)
    const { cartItems, totalAmount } = useSelector(state => state.user)
    const [paymentMethod, setPaymentMethod]=useState("cod")
    const [ addressInput, setAddressInput ]=useState("")
    const dispatch=useDispatch()
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    const deliveryFee=totalAmount>500?0:40
    const AmountWithDeliveryFee=totalAmount+deliveryFee

    const onDragEnd=(e)=>{
    const marker=e.target
    const {lat,lng}=marker.getLatLng()
    dispatch(setLocation({lat,lon:lng}))
    getAddressByLatLng(lat,lng)
    }

const getCurrentLocation=()=>{
    navigator.geolocation.getCurrentPosition(async (position)=>{
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({lat:latitude, lon:longitude}))
            getAddressByLatLng(latitude,longitude)
        })
}

const getAddressByLatLng=async (lat,lng)=>{
    try {
         const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`)
         dispatch(setAddress(result?.data?.results[0].address_line2))
    } catch (error) {
        console.log(error)
    }
}

const getLatLngByAddress=async()=>{
    try {
       const result=await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`) 
       const {lat,lon}=result.data.features[0].properties
       dispatch(setLocation({lat,lon}))
    } catch (error) {
        console.log(error)
    }
}

const handlePlaceOrder=async ()=>{
    try {
        const result=await axios.post(`${serverUrl}/api/order/place-order`,{
            paymentMethod,
            deliveryAddress:{
                text:addressInput,
                latitude:location.lat,
                longitude:location.lon,
            },
            totalAmount:AmountWithDeliveryFee,
            cartItems,
        }, {withCredentials:true})
        console.log(result.data)
        navigate("/order-placed")
    } catch (error) {
        console.log(error.response?.data || error.message)
    }
}

useEffect(()=>{
    setAddressInput(address)
}, [address])

    return (
        <div className='min-h-screen bg-[#fff9f6] flex items-center justify-center p-6'>
            <div className="absolute top-[20px] left-[20px] z-[10]"
                onClick={() => navigate("/")}
            >
                <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
            </div>
            <div className='w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Checkout</h1>
                <section>
                    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'><FaLocationDot size={12} className='text-[#ff4d2d]' />Delivery Location</h2>
                    <div className='flex gap-2 mb-3'>
                        <input type="text" className='flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]' placeholder='Enter your Delivery Address.' value={addressInput} onChange={(e)=>setAddressInput(e.target.value)}/>
                        <button className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getLatLngByAddress}><FaSearchLocation size={16} /></button>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center' onClick={getCurrentLocation}><BiCurrentLocation size={16} /></button>
                    </div>
                    <div className='rounded-xl border overflow-hidden'>
                        <div className='h-64 w-full flex items-center justify-center'>
                            <MapContainer className={"w-full h-full"} center={[location?.lat, location?.lon]}
                                zoom={16}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <RecenterMap location={location}/>
                                <Marker position={[location?.lat, location?.lon]} draggable eventHandlers={{dragend:onDragEnd}}/>
                            </MapContainer>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Methods</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                        <div className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`} onClick={()=>setPaymentMethod("cod")}>
                        <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'><GiScooter className='text-green-600 text-xl'/></span>
                            <div>
                                <p className='font-medium text-gray-800'>Cash On Delivery</p>
                            </div>
                        </div>
                        <div className={`cursor-pointer flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#ff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`} onClick={()=>setPaymentMethod("online")}>
                        <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 '><RiSecurePaymentLine /></span>
                        <div>
                            <p className='font-medium text-gray-800'>Pay via UPI/ Credit/ Debit card</p>
                        </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Order Summary</h2>
                    <div className='rounded-xl border bg-gray-50 p-4 space-y-2'>
                        {cartItems.map((item,index)=>(
                            <div key={index} className='flex justify-between text-sm text-gray-700'>
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price*item.quantity}</span>
                            </div>
                        ))}
                        <hr className='border-gray-400 my-2'/>
                        <div className='flex justify-between font-medium text-gray-800'>
                            <span>Subtotal</span>
                            <span>{totalAmount}</span>
                        </div>
                        <div className='flex justify-between font-medium text-gray-800'>
                            <span>Delivery Fee</span>
                            <span>{deliveryFee==0?"Free":deliveryFee}</span>
                        </div>
                        <div className='flex justify-between text-lg font-bold text-[#ff4d2d] pt-2'>
                            <span>Total</span>
                            <span>{AmountWithDeliveryFee}</span>
                        </div>
                    </div>
                </section>
                <button className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold' onClick={handlePlaceOrder} >{paymentMethod=="cod"?"Place Order":"Pay Now"}</button>
            </div>
        </div>
    )
}

export default CheckOut
