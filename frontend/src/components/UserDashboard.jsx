import React from 'react'
import  Nav  from "../components/Nav.jsx"
import { categories } from '../category.js'
import CategoryCard from './CategoryCard.jsx'
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import FoodCart from './FoodCart.jsx';

const UserDashboard = () => {
  const {currentCity, shopInMyCity, itemsInMyCity}=useSelector(state=>state.user)
  const cateScrollRef=useRef()
  const shopScrollRef=useRef()
  const [showLeftCateButton, setShowLeftCateButton]=useState(false)
  const [showRightCateButton, setShowRightCateButton]=useState(false)
  const [showLeftShopButton, setShowLeftShopButton]=useState(false)
  const [showRightShopButton, setShowRightShopButton]=useState(false)

  const updateButton=(ref,setLeftButton, setRightButton)=>{
    const element=ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)
    }
  }
  const scrollHandler=(ref, direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior:"smooth"
      })
    }
  }
 useEffect(() => {
  const cateEl = cateScrollRef.current;
  const shopEl = shopScrollRef.current;

  if (!cateEl || !shopEl) return;

  const handleCateScroll = () => {
    updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);
  };

  const handleShopScroll = () => {
    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
  };

  // initial state
  handleCateScroll();
  handleShopScroll();

  cateEl.addEventListener("scroll", handleCateScroll);
  shopEl.addEventListener("scroll", handleShopScroll);

  return () => {
    if (cateEl) cateEl.removeEventListener("scroll", handleCateScroll);
    if (shopEl) shopEl.removeEventListener("scroll", handleShopScroll);
  };
}, []);

  return (
     <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>Menu Categories</h1>
      <div className='w-full relative'>
        {showLeftCateButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef, "left")}>
          <FaArrowAltCircleLeft />
        </button>}
      <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={cateScrollRef}>
      {categories.map((cate,index)=>(
        <CategoryCard name={cate.category} image={cate.image} key={index}/>
      ))}
      </div>
      {showRightCateButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef, "right")}>
        <FaArrowAltCircleRight />
        </button>}
      </div>
      
     </div>

     <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
      <h1 className='text-gray-800 text-2xl sm:text-3xl'>Best Shop in {currentCity}</h1>
      <div className='w-full relative'>
        {showLeftShopButton && <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef, "left")}>
          <FaArrowAltCircleLeft />
        </button>}
      <div className='w-full flex overflow-x-auto gap-4 pb-2' ref={shopScrollRef}>
      {shopInMyCity?.map((shop,index)=>(
        <CategoryCard name={shop.name} image={shop.image} key={index}/>
      ))}
      </div>
      {showRightShopButton && <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(shopScrollRef, "right")}>
        <FaArrowAltCircleRight />
        </button>}
      </div>
     </div>

      <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]'>
        <h1 className='text-gray-800 text-2xl sm:text-3xl'>Suggested food items</h1>
      <div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
      {itemsInMyCity?.map((item, index)=>(
        <FoodCart key={index} data={item}/>
      ))}
      </div>
      </div>

    </div>
  )
  
}

export default UserDashboard
