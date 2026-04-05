
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App.jsx";
import { IoMdArrowBack } from "react-icons/io";
import { FaUtensils } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { setMyShopData } from "../redux/ownerSlice.js";

function EditItem() {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result =await axios.post(
        `${serverUrl}/api/items/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data))
      setLoading(false)
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/items/get-by-id/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchItem();
  }, [itemId]);

  useEffect(() => {
    if (!currentItem) return;

    setName(currentItem.name);
    setPrice(currentItem.price);
    setCategory(currentItem.category);
    setFoodType(currentItem.foodType);
    setFrontendImage(currentItem.image);
  }, [currentItem]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-white p-6">
      <div
        className="absolute left-[20px] top-[20px] z-[10] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-lg rounded-2xl border border-orange-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center">
          <div className="mb-4 rounded-full bg-orange-100 p-4">
            <FaUtensils className="h-16 w-16 text-[#ff4d2d]" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Edit Food
          </h1>
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
                  alt="Food"
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
              onChange={(e) => setPrice(e.target.value)}
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
              {categories.map((cate, index) => (
                <option key={index} value={cate}>
                  {cate}
                </option>
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
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#ff4d2d] px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600 hover:shadow-lg disabled:opacity-70"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditItem;
