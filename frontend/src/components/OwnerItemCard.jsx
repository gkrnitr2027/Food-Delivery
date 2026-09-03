import axios from 'axios';
import React from 'react'
import { FaPen, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';

function OwnerItemCard({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`, { withCredentials: true })
      dispatch(setMyShopData(result.data))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex flex-col bg-white rounded-2xl shadow-md overflow-hidden w-full border border-gray-100 hover:shadow-lg transition-shadow duration-200'>
      
      {/* Image */}
      <div className='relative w-full h-36'>
        <img src={data.image} alt={data.name} className='w-full h-full object-cover' />
        {/* Veg / Non-veg badge */}
        <div className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${data.foodType === 'veg' ? 'bg-green-500' : 'bg-red-500'}`}>
          {data.foodType === 'veg' ? '🌿 Veg' : '🍖 Non-Veg'}
        </div>
      </div>

      {/* Info */}
      <div className='p-3 flex flex-col gap-1'>
        <h2 className='text-sm font-bold text-gray-800 truncate'>{data.name}</h2>
        <p className='text-xs text-gray-400'>{data.category}</p>

        <div className='flex items-center justify-between mt-2'>
          <span className='text-base font-extrabold text-[#ff4d2d]'>₹{data.price}</span>
          <div className='flex gap-1'>
            <button
              onClick={() => navigate(`/edit-item/${data._id}`)}
              className='p-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ff4d2d] transition-colors'
            >
              <FaPen size={12} />
            </button>
            <button
              onClick={handleDelete}
              className='p-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition-colors'
            >
              <FaTrashAlt size={12} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default OwnerItemCard