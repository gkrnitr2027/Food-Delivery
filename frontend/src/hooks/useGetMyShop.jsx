import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';

import { serverUrl } from '../App.jsx';
import { setMyShopData } from '../redux/ownerSlice.js';


function useGetMyShop() {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
        });
        dispatch(setMyShopData(result.data));
      } catch (error) {
        console.log('error in fetching current user', error);
      }
    };
    fetchShop();
  }, [userData]);
}

export default useGetMyShop;