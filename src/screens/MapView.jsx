import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-pin',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const lostIcon = createCustomIcon('#ff4d4d');
const foundIcon = createCustomIcon('#80ff80');
const userIcon = createCustomIcon('#4A90E2');

// Component to dynamically update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center]);
  return null;
}

export default function MapView() {
  const navigate = useNavigate();
  const [selectedPin, setSelectedPin] = useState(null);
  const [center, setCenter] = useState([19.0760, 72.8777]); // Default Start
  const [userLocation, setUserLocation] = useState(null);
  const [mapPins, setMapPins] = useState([]);

  useEffect(() => {
    // Attempt to get user GPS
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCenter([lat, lng]);
          setUserLocation([lat, lng]);
          
          const storedItems = JSON.parse(localStorage.getItem('find_items') || '[]');
          if (storedItems.length > 0) {
            setMapPins(storedItems.filter(item => item.lat && item.lng));
          } else {
            // Generate some mock nearby pins based on current location so the map isn't empty if localstorage is empty
            setMapPins([
              { id: 1, type: 'Lost', lat: lat + 0.002, lng: lng + 0.002, name: 'Black Nike Backpack', desc: 'Lost near the cafe' },
              { id: 2, type: 'Found', lat: lat - 0.003, lng: lng + 0.001, name: 'iPhone 13 Pro', desc: 'Found in library' },
              { id: 3, type: 'Lost', lat: lat + 0.001, lng: lng - 0.004, name: 'Leather Wallet', desc: 'Dropped near transit' }
            ]);
          }
        },
        () => {
          console.warn("Location denied, pulling pins relative to default center");
          const storedItems = JSON.parse(localStorage.getItem('find_items') || '[]');
          if (storedItems.length > 0) {
            setMapPins(storedItems.filter(item => item.lat && item.lng));
          }
        }
      );
    }
  }, []);

  return (
    <div className="page-container" style={{ padding: 0, position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      
      {/* Header Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1000, padding: '24px 20px', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
        <button className="neo-button" onClick={() => navigate('/dashboard')} style={{ padding: '10px', borderRadius: '50%', pointerEvents: 'auto', backgroundColor: 'rgba(255,255,255,0.9)' }}>
          <ArrowLeft size={24} color="#333" />
        </button>
        <div style={{ marginLeft: '15px', backgroundColor: 'rgba(255,255,255,0.9)', pointerEvents: 'auto' }} className="neo-card">
          <h1 style={{ fontSize: '18px', margin: 0, padding: '5px 10px', color: '#333' }}>Nearby Items</h1>
        </div>
      </div>

      <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapUpdater center={center} />
        
        {/* Render User Location */}
        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Render Item Pins */}
        {mapPins.map(pin => (
          <Marker 
            key={pin.id} 
            position={[pin.lat, pin.lng]} 
            icon={pin.type === 'Lost' ? lostIcon : foundIcon}
            eventHandlers={{
              click: () => setSelectedPin(pin),
            }}
          />
        ))}
      </MapContainer>

      {/* Selected Pin Details Card Overlay */}
      {selectedPin && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '20px',
          right: '20px',
          zIndex: 1000,
          backgroundColor: '#fff'
        }} className="neo-card">
          <div className="flex justify-between items-center mb-2">
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#333' }}>{selectedPin.name || selectedPin.title}</h3>
            <span style={{ 
              color: selectedPin.type === 'Lost' ? '#ff4d4d' : '#80ff80',
              fontWeight: 'bold',
              fontSize: '12px',
              padding: '4px 8px',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px'
            }}>{selectedPin.type.toUpperCase()}</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '15px' }}>
            {selectedPin.desc}
          </p>
          <div className="flex gap-4">
            <button className="neo-button w-full" style={{ padding: '10px', backgroundColor: 'var(--primary)', color: '#fff' }} onClick={() => navigate('/feed')}>
              View on Feed
            </button>
            <button className="neo-button w-full" style={{ padding: '10px', color: '#333' }} onClick={() => setSelectedPin(null)}>
              <Navigation size={18} style={{ marginRight: '5px' }} /> Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
