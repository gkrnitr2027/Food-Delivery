import React from 'react'
import { FaStar } from 'react-icons/fa'
import { MdAccessTime } from 'react-icons/md'

function ShopCard({ name, image, onClick }) {
  return (
    <div
      className='w-[200px] shrink-0 cursor-pointer group'
      onClick={onClick}
    >
      <div className='w-full h-[130px] rounded-2xl overflow-hidden relative'>
        <img
          src={image || "/placeholder.png"}
          alt={name}
          className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
          onError={(e) => { e.target.src = "/placeholder.png" }}
        />
        <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent' />
        <div className='absolute bottom-2 left-2 bg-white text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow'>
          FREE DELIVERY
        </div>
      </div>
      <div className='mt-2 px-1'>
        <h2 className='font-bold text-gray-900 text-sm truncate'>{name}</h2>
        <div className='flex items-center gap-1 mt-0.5'>
          <FaStar className='text-yellow-400 text-xs' />
          <span className='text-xs font-semibold text-gray-700'>4.2</span>
          <span className='text-gray-300 text-xs'>•</span>
          <MdAccessTime className='text-gray-400 text-xs' />
          <span className='text-xs text-gray-500'>20-30 mins</span>
        </div>
      </div>
    </div>
  )
}

export default ShopCard
