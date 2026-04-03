
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App.jsx";
import { IoMdArrowBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { FaUtensils } from "react-icons/fa";

function AddItem() {
  const navigate = useNavigate();

  const { myShopData } = useSelector((state) => state.owner);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory]=useState("")
  const [foodType, setFoodType]=useState("veg")
   const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];
  const [loading,setLoading]=useState(false);
  const dispatch=useDispatch()

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("shop", myShopData._id);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/add-item`,
        formData,
        { withCredentials: true }
      );
      //dispatch(myShopData(result.data))
      console.log(result.data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white p-6">
      <div
        className="absolute left-[20px] top-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-lg rounded-2xl border border-orange-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-orange-100 p-4">
            <FaUtensils className="h-16 w-16 text-[#ff4d2d]" />
          </div>

          <div className="text-3xl font-extrabold text-gray-900">
            Add Food Items
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Food Name"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleImage}
            />

            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  alt=""
                  className="h-48 w-full rounded-lg border object-cover"
                />
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
             <option value="">Select Category</option>   
             {categories.map((cate, index)=>(
                <option value={cate} key={index}>{cate}</option>
             ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Food Type
            </label>
            <select
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >            
                <option value="veg">veg</option>
                <option value="non veg">non veg</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-orange-600 hover:shadow-lg"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddItem;
