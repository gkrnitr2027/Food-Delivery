import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCity, setUserData} from '../redux/userSlice.js'

const useGetCity = () => {
    const dispatch=useDispatch()
    const {userData, }=useSelector(state=>state.user)
    const apiKey = import.meta.env.VITE_GEOAPIKEY
    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(async (position)=>{
            console.log(position)
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const result=await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            dispatch(setCity(result?.data.results[0].city))
        })
    },[setUserData])
}

export default useGetCity
