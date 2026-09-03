import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import { FaUtensils, FaPen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import OwnerItemCard from './OwnerItemCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/dashboard-stats`, { withCredentials: true });
        setChartData(res.data.stats || []);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    if (myShopData) fetchStats();
    else setLoading(false);
  }, [myShopData]);

  // ✅ No shop yet — show create shop prompt
  if (!myShopData) {
    return (
      <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center justify-center gap-4'>
        <Nav />
        <FaUtensils className='text-[#ff4d2d] w-16 h-16 mt-10' />
        <h2 className='text-2xl font-bold text-gray-800'>No Shop Found</h2>
        <p className='text-gray-500 text-center px-4'>You haven't created a shop yet. Get started by creating one!</p>
        <button
          onClick={() => navigate("/create-edit-shop")}
          className='bg-[#ff4d2d] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#e64528] transition'
        >
          Create Your Shop
        </button>
      </div>
    )
  }

  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center pb-10'>
      <Nav />
      <div className='w-full flex flex-col items-center gap-6 px-4 max-w-3xl'>
        <h1 className='text-3xl text-gray-900 mt-8 flex items-center gap-3'>
          <FaUtensils className='text-[#ff4d2d] w-14 h-14' /> Welcome to {myShopData.name}
        </h1>

        {/* Profile Card */}
        <div className='bg-white shadow-lg rounded-xl overflow-hidden border w-full relative'>
          <div className='absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full cursor-pointer' onClick={() => navigate("/create-edit-shop")}>
            <FaPen size={20} />
          </div>
          <img src={myShopData.image} alt={myShopData.name} className='w-full h-64 object-cover' />
          <div className='p-6'>
            <h1 className='text-2xl font-bold'>{myShopData.name}</h1>
            <p className='text-gray-500'>{myShopData.city}, {myShopData.state}</p>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="w-full bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
          {loading ? (
            <p className="text-gray-400 text-center py-10">Loading...</p>
          ) : chartData.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No data available yet.</p>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="earnings" name="Earnings (₹)" fill="#ff4d2d" />
                  <Bar dataKey="orders" name="Orders" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Food Items Grid */}
        <div className='w-full'>
          <h2 className='text-xl font-bold mb-4'>Menu Items</h2>
          <div className='grid grid-cols-2 gap-4'>
            {myShopData.items?.map((item, index) => (
              <OwnerItemCard data={item} key={index} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default OwnerDashboard;