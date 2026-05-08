import React, { useEffect } from 'react';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';

import { serverUrl } from '../App.jsx';
import { setMyOrders } from '../redux/userSlice.js';


function useGetMyOrders() {
  const dispatch = useDispatch();
  const {userData} = useSelector((state)=>state.user);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        dispatch(setMyOrders(result.data));
        console.log(result.data)
      } catch (error) {
        console.log(error.message)
      }
    };
    fetchOrders();
  }, [userData]);
}

export default useGetMyOrders;