import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders } from '../redux/userSlice'

function useGetMyOrders() {
  const dispatch   = useDispatch()
  const { userData } = useSelector(state => state.user)

  useEffect(() => {
    if (!userData) return

    const fetchOrders = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        })
        dispatch(setMyOrders(result.data))
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrders()                                    // fetch immediately
    const timer = setInterval(fetchOrders, 5000)     // then every 5 seconds

    return () => clearInterval(timer)                // stop when component unmounts
  }, [userData])
}

export default useGetMyOrders