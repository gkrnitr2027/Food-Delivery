import React, { useEffect } from 'react'
import { serverUrl } from '../App.jsx'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity, setShopsInMyCity, setUserData } from '../redux/userSlice.js'

const useGetItemsByCity = () => {
  
    const dispatch=useDispatch()
    const {currentCity}=useSelector(state=>state.user)
    useEffect(()=> {
        const fetchItems=async ()=> {
            try {
                const result=await axios.get(`${serverUrl}/api/items/get-by-city/${currentCity}`, {withCredentials:true})
                dispatch(setItemsInMyCity(result.data))
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchItems()
    },[currentCity])
}

export default useGetItemsByCity
