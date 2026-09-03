import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from "react-icons/io"
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import DeliveryChat from '../components/DeliveryChat'
import { useSelector } from 'react-redux'

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState(null)
    const navigate = useNavigate()
    const { socket } = useSelector(state => state.user)
    const [liveLocations, setLiveLocations] = useState({})

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/order/get-order-by-id/${orderId}`,
                { withCredentials: true }
            )
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!socket) return
        const handler = ({ deliveryBoyId, latitude, longitude }) => {
            setLiveLocations(prev => ({
                ...prev,
                [deliveryBoyId]: { lat: latitude, lon: longitude }
            }))
        }
        socket.on('updateDeliveryLocation', handler)
        return () => socket.off('updateDeliveryLocation', handler)
    }, [socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])

    const assignedShopOrder = currentOrder?.shopOrders?.find(
        s => s.assignedDeliveryBoy && s.status !== 'delivered'
    )
    const showChat = !!assignedShopOrder

    return (
        <>  {/* ✅ Fragment — DeliveryChat sits outside page flow */}

            <div className='max-w-4xl mx-auto p-4 flex flex-col gap-6'>

                {/* Back */}
                <div
                    className='relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer'
                    onClick={() => navigate("/")}
                >
                    <IoIosArrowRoundBack size={35} className='text-[#7F77DD]' />
                    <h1 className='text-2xl font-bold'>Track Order</h1>
                </div>

                {/* Loading */}
                {!currentOrder && (
                    <div className='flex items-center justify-center py-20 text-gray-400 font-medium'>
                        Loading order details...
                    </div>
                )}

                {/* Order cards */}
                {currentOrder?.shopOrders?.map((shopOrder, index) => (
                    <div
                        className='bg-white p-4 rounded-2xl shadow-md border border-purple-100 space-y-4'
                        key={shopOrder._id || index}
                    >
                        <div>
                            <p className='text-lg font-bold mb-2 text-[#7F77DD]'>
                                {shopOrder.shop?.name}
                            </p>
                            <p className='font-semibold text-sm'>
                                <span className='text-gray-500'>Items: </span>
                                {shopOrder.shopOrderItems?.map(i => i.name).join(", ")}
                            </p>
                            <p className='text-sm'>
                                <span className='font-semibold'>Subtotal: </span>
                                ₹{shopOrder.subtotal}
                            </p>
                            <p className='mt-4 text-sm'>
                                <span className='font-semibold'>Delivery address: </span>
                                {currentOrder.deliveryAddress?.text}
                            </p>
                        </div>

                        {shopOrder.status !== "delivered" ? (
                            <>
                                {shopOrder.assignedDeliveryBoy ? (
                                    <div className='text-sm text-gray-700 bg-purple-50 rounded-xl p-3 space-y-1'>
                                        <p className='font-semibold'>
                                            <span className='text-gray-500'>Delivery Boy: </span>
                                            {shopOrder.assignedDeliveryBoy.fullName}
                                        </p>
                                        <p className='font-semibold'>
                                            <span className='text-gray-500'>Contact: </span>
                                            {shopOrder.assignedDeliveryBoy.mobile}
                                        </p>
                                    </div>
                                ) : (
                                    <p className='text-sm text-gray-400 font-medium italic'>
                                        Delivery boy not assigned yet...
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <span className='text-green-500 text-xl'>✓</span>
                                <p className='text-green-600 font-semibold text-lg'>Delivered</p>
                            </div>
                        )}

                        {shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered" && (
                            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                                <DeliveryBoyTracking
                                    data={{
                                        deliveryBoyLocation:
                                            liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                                lat: shopOrder.assignedDeliveryBoy.location?.coordinates[1],
                                                lon: shopOrder.assignedDeliveryBoy.location?.coordinates[0],
                                            },
                                        customerLocation: {
                                            lat: currentOrder.deliveryAddress?.latitude,
                                            lon: currentOrder.deliveryAddress?.longitude,
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>
                ))}

            </div>

            {/* ✅ DeliveryChat is OUTSIDE the main div — renders as fixed overlay */}
            {showChat && (
                <DeliveryChat
                    orderId={orderId}
                    deliveryBoyId={assignedShopOrder.assignedDeliveryBoy._id}
                    deliveryBoyName={assignedShopOrder.assignedDeliveryBoy.fullName}
                    deliveryBoyMobile={assignedShopOrder.assignedDeliveryBoy.mobile}
                />
            )}

        </>
    )
}

export default TrackOrderPage