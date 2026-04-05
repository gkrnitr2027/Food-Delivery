import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Home from './pages/Home.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import CreateEditShop from './pages/CreateEditShop.jsx';
import useGetCurrentUser from './hooks/useGetCurrentUser.jsx';
import { useSelector } from 'react-redux';
import useGetCity from './hooks/useGetCity.jsx';
import useGetMyShop from './hooks/useGetMyShop.jsx';
import AddItem from './pages/AddItem.jsx';
import EditItem from './pages/EditItem.jsx';
import useGetShopByCity from './hooks/useGetShopByCity.jsx';

export const serverUrl = "http://localhost:8000";

const App = () => {
  useGetCurrentUser()
  useGetMyShop()
  useGetCity()
  useGetShopByCity()
  const {userData} = useSelector(state=>state.user)
  return (
    <Routes>
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
      <Route path="/forgot-password" element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home/>:<Navigate to={"/signup"} />} />
      <Route path="/create-edit-shop" element={userData?<CreateEditShop/>:<Navigate to={"/signin"} />} />
      <Route path="/add-item" element={userData?<AddItem/>:<Navigate to={"/signin"} />} />
      <Route path="/edit-item/:itemId" element={userData?<EditItem/>:<Navigate to={"/"} />} />
    </Routes>
    
  );
};

export default App;