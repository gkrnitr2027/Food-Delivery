
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { serverUrl } from "../App.jsx";
import { IoMdArrowBack } from "react-icons/io";
import { ClipLoader } from "react-spinners";
import { FaUtensils } from "react-icons/fa";
import { setMyShopData } from "../redux/ownerSlice.js";

function CreateEditShop() {
  const navigate = useNavigate();

  const { myShopData } = useSelector((state) => state.owner);
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user
  );

  const [name, setName] = useState(myShopData ? myShopData.name : "");
  const [address, setAddress] = useState(
    myShopData ? myShopData.address : currentAddress
  );
  const [city, setCity] = useState(
    myShopData ? myShopData.city : currentCity
  );
  const [state, setState] = useState(
    myShopData ? myShopData.state : currentState
  );

  const [frontendImage, setFrontendImage] = useState(
    myShopData ? myShopData.image : null
  );
  const [backendImage, setBackendImage] = useState(null);
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
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data))

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
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Shop Image
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                placeholder="State"
                className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              placeholder="Address"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
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

export default CreateEditShop;
