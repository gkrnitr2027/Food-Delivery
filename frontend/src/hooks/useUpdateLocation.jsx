import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useSelector } from 'react-redux'

function useUpdateLocation() {
    const { userData } = useSelector(state => state.user)

    useEffect(() => {
        // ✅ Only run if user is logged in
        if (!userData) return

        let watchId

        const updateLocation = async (lat, lon) => {
            try {
                await axios.post(`${serverUrl}/api/user/update-location`, { lat, lon }, { withCredentials: true })
            } catch (error) {
                console.log("Location update error:", error)
            }
        }

        watchId = navigator.geolocation.watchPosition((pos) => {
            updateLocation(pos.coords.latitude, pos.coords.longitude)
        })

        // ✅ Cleanup watcher on unmount
        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [userData])
}

export default useUpdateLocation