import React, { useEffect, useRef, useState } from 'react'
import scooter from "../assets/scooter.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'

// ─── Scooter icon ─────────────────────────────────────────────────────────────
const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
})

// ─── Dark pin icon for customer (like Swiggy) ─────────────────────────────────
const customerPinIcon = new L.DivIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      <div style="
        background:#1e1b4b;
        color:white;
        padding:4px 8px;
        border-radius:6px;
        font-size:10px;
        font-weight:700;
        white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        letter-spacing:0.5px;
      ">📍 YOUR LOCATION</div>
      <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:8px solid #1e1b4b;"></div>
      <div style="
        width:40px;height:40px;
        background:#1e1b4b;
        border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 3px 10px rgba(0,0,0,0.4);
        border:3px solid white;
        font-size:18px;
      ">🏠</div>
    </div>
  `,
  iconSize: [120, 80],
  iconAnchor: [60, 80],
})

// ─── ETA popup on scooter ─────────────────────────────────────────────────────
const makeScooterIcon = (eta, isSameLocation) => new L.DivIcon({
  className: '',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;">
      ${(eta && !isSameLocation) ? `
        <div style="
          background:#7F77DD;
          color:white;
          padding:4px 10px;
          border-radius:7px;
          font-size:11px;
          font-weight:800;
          white-space:nowrap;
          box-shadow:0 3px 10px rgba(0,0,0,0.3);
          letter-spacing:0.3px;
          border:1.5px solid white;
        ">🕐 ETA : ${eta.toUpperCase()}</div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #7F77DD;"></div>
      ` : ''}
      <img src="${scooter}" style="width:44px;height:44px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.35))" />
    </div>
  `,
  iconSize: [120, (eta && !isSameLocation) ? 85 : 44],
  iconAnchor: [60, (eta && !isSameLocation) ? 85 : 44],
})

// ─── Smooth moving marker ─────────────────────────────────────────────────────
function MovingMarker({ position, icon }) {
  const markerRef = useRef(null)
  useEffect(() => {
    if (markerRef.current) markerRef.current.setLatLng(position)
  }, [position])
  return <Marker ref={markerRef} position={position} icon={icon} />
}

// ─── Auto fit on first load only ──────────────────────────────────────────────
function FitBounds({ positions }) {
  const map = useMap()
  const done = useRef(false)
  useEffect(() => {
    if (!done.current && positions.length === 2) {
      map.fitBounds(L.latLngBounds(positions), { padding: [70, 70] })
      done.current = true
    }
  }, [positions])
  return null
}

// ─── Pan map to follow scooter ────────────────────────────────────────────────
function TrackRider({ position }) {
  const map = useMap()
  useEffect(() => {
    map.panTo(position, { animate: true, duration: 1.2 })
  }, [position])
  return null
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function DeliveryBoyTracking({ data }) {
  const [routePath, setRoutePath] = useState([])
  const [eta, setEta] = useState(null)
  const [distance, setDistance] = useState(null)
  const prevRef = useRef(null)

  const dbLat = data.deliveryBoyLocation.lat
  const dbLon = data.deliveryBoyLocation.lon
  const custLat = data.customerLocation.lat
  const custLon = data.customerLocation.lon

  const deliveryPos = [dbLat, dbLon]
  const customerPos = [custLat, custLon]

  useEffect(() => {
    if (!dbLat || !dbLon || !custLat || !custLon) return
    const prev = prevRef.current
    if (prev && Math.abs(prev[0] - dbLat) < 0.0003 && Math.abs(prev[1] - dbLon) < 0.0003) return  // only re-fetch every ~30m
    prevRef.current = [dbLat, dbLon]

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${dbLon},${dbLat};${custLon},${custLat}?overview=full&geometries=geojson`
        const res = await fetch(url)
        const json = await res.json()
        if (json.routes?.length > 0) {
          const route = json.routes[0]
          setRoutePath(route.geometry.coordinates.map(([ln, lt]) => [lt, ln]))
          const mins = Math.round(route.duration / 60)
          setEta(mins < 1 ? '< 1 MIN' : `${mins} MIN${mins !== 1 ? 'S' : ''}`)
          setDistance((route.distance / 1000).toFixed(1))
        }
      } catch {
        setRoutePath([deliveryPos, customerPos])
      }
    }
    fetchRoute()
  }, [dbLat, dbLon, custLat, custLon])

  // Detect if delivery boy and customer are at same/very close location
  const isSameLocation = Math.abs(dbLat - custLat) < 0.0005 && Math.abs(dbLon - custLon) < 0.0005
  const scooterIcon = makeScooterIcon(eta, isSameLocation)

  return (
    <div className='w-full rounded-2xl overflow-hidden shadow-xl' style={{ height: 400, position: 'relative' }}>
      <MapContainer
        center={deliveryPos}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        {/* Clean map tiles */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <FitBounds positions={[deliveryPos, customerPos]} />
        <TrackRider position={deliveryPos} />

        {/* Scooter with ETA popup */}
        <MovingMarker position={deliveryPos} icon={scooterIcon} />

        {/* Customer pin with "DELIVERING ORDER NEARBY" */}
        <Marker position={customerPos} icon={customerPinIcon} />

        {/* Route shadow */}
        <Polyline
          positions={routePath.length > 0 ? routePath : [deliveryPos, customerPos]}
          color="#1e1b4b"
          weight={9}
          opacity={0.15}
        />
        {/* Route main */}
        <Polyline
          positions={routePath.length > 0 ? routePath : [deliveryPos, customerPos]}
          color="#3B4FE0"
          weight={5}
          opacity={1}
          lineCap="round"
          lineJoin="round"
        />
        {/* Route highlight */}
        <Polyline
          positions={routePath.length > 0 ? routePath : [deliveryPos, customerPos]}
          color="#6B7FFF"
          weight={2}
          opacity={0.6}
          lineCap="round"
          lineJoin="round"
        />
      </MapContainer>

      {/* ETA bar at bottom over map */}
      {eta && (
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(30,27,75,0.95), rgba(30,27,75,0))',
          padding: '20px 16px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          pointerEvents: 'none',
          zIndex: 1000,
        }}>
          <div>
            <p style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>ESTIMATED ARRIVAL</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{eta}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#a5b4fc', fontSize: 11, fontWeight: 600, letterSpacing: 1, marginBottom: 2 }}>DISTANCE</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 800 }}>{distance} km</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryBoyTracking