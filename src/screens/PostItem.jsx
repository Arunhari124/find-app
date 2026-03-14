import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, UploadCloud, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function PostItem() {
  const navigate = useNavigate();
  const [type, setType] = useState('Lost');
  const [category, setCategory] = useState('');
  const [aiStatus, setAiStatus] = useState(null); // 'checking', 'verified', 'flagged'
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const categories = ['Wallet', 'Phone/Electronics', 'Documents', 'Bag/Laptop', 'Keys', 'Watches', 'Gold/Jewelry', 'Other'];

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });
          // Mock reverse geocoding for UI display purposes
          setTimeout(() => {
            setLocationName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
            setIsLocating(false);
          }, 1000);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationName('Location Access Denied');
          setIsLocating(false);
        }
      );
    } else {
      setLocationName('Geolocation not supported');
      setIsLocating(false);
    }
  };

  const simulateAiCheck = () => {
    setAiStatus('checking');
    setTimeout(() => {
      // Simulate that 1 in 4 images might be flagged as fake
      const isFake = Math.random() > 0.75;
      if (isFake) setAiStatus('flagged');
      else setAiStatus('verified');
    }, 2000);
  };

  return (
    <div className="page-container" style={{ 
      paddingBottom: '80px',
      backgroundColor: type === 'Lost' ? '#ff4d4d' : '#80ff80',
      transition: 'background-color 0.6s ease-in-out',
      minHeight: '100vh',
      boxShadow: type === 'Lost' ? 'inset 0 0 50px rgba(153, 0, 0, 0.4)' : 'inset 0 0 50px rgba(0, 102, 0, 0.2)'
    }}>
      
      <div className="flex items-center mb-4" style={{ marginTop: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <ArrowLeft size={24} color={type === 'Lost' ? '#fff' : '#333'} />
        </button>
        <h1 style={{ marginLeft: '16px', fontSize: '24px', color: type === 'Lost' ? '#fff' : '#333', fontWeight: 'bold' }}>Report Item</h1>
      </div>

      <div className="neo-card flex-col gap-4" style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.8)'
      }}>
        
        {/* Toggle Lost / Found */}
        <div className="flex gap-4" style={{ marginBottom: '16px' }}>
          <button 
            className={`neo-button w-full ${type === 'Lost' ? 'lost' : ''}`}
            style={{ 
              boxShadow: type === 'Lost' ? 'var(--neumorph-inner)' : 'var(--neumorph-outer)',
              border: type === 'Lost' ? '2px solid var(--lost-color)' : 'none'
            }}
            onClick={() => setType('Lost')}
          >
            I Lost This
          </button>
          <button 
            className={`neo-button w-full ${type === 'Found' ? 'found' : ''}`}
            style={{ 
              boxShadow: type === 'Found' ? 'var(--neumorph-inner)' : 'var(--neumorph-outer)',
              border: type === 'Found' ? '2px solid var(--found-color)' : 'none'
            }}
            onClick={() => setType('Found')}
          >
            I Found This
          </button>
        </div>

        {/* Basic Details */}
        <input type="text" placeholder="Your Name" className="neo-input" />
        <input type="tel" placeholder="Your WhatsApp Number (For Contact)" className="neo-input" />
        
        <div className="flex gap-4">
          <input type="text" placeholder="Class/Dept" className="neo-input" />
          <input type="text" placeholder="Roll Number" className="neo-input" />
        </div>

        <input type="text" placeholder="Item Name (e.g. Black Nike Backpack)" className="neo-input" />

        <select 
          className="neo-input" 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ appearance: 'none' }}
        >
          <option value="" disabled>Select Item Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Dynamic Category Specs */}
        {(category === 'Phone/Electronics' || category === 'Watches') && (
          <div className="flex-col gap-2" style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Additional Specs Needed:</p>
            <input type="text" placeholder="Brand / Make" className="neo-input" />
            <input type="text" placeholder="Model Number or Identifying Marks" className="neo-input" />
          </div>
        )}

        {category === 'Gold/Jewelry' && (
          <div className="flex-col gap-2" style={{ padding: '10px 0' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Jewelry Details:</p>
            <input type="text" placeholder="Approximate Weight or Carat" className="neo-input" />
            <input type="text" placeholder="Distinctive features / engravings" className="neo-input" />
          </div>
        )}

        {/* Time and Location */}
        <div className="flex gap-4">
          <input type="date" className="neo-input" />
          <input type="time" className="neo-input" />
        </div>

        <div style={{ position: 'relative' }}>
          <div 
            onClick={handleGetLocation}
            style={{ 
              position: 'absolute', right: '10px', top: '10px', 
              backgroundColor: 'var(--primary)', padding: '5px', 
              borderRadius: '50%', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
            }}
          >
            <MapPin size={20} color="white" />
          </div>
          <input 
            type="text" 
            placeholder={isLocating ? "Getting location..." : "Location (GPS or Search)"} 
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="neo-input" 
            style={{ paddingRight: '50px' }}
          />
        </div>

        <textarea placeholder="Detailed Description..." className="neo-input" style={{ height: '100px', resize: 'none' }} />
        
        {type === 'Lost' && (
          <input type="text" placeholder="Optional Reward (e.g. Rs 500)" className="neo-input" />
        )}

        {/* Image Upload & AI Check */}
        <div style={{ padding: '10px 0' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Upload Image (Optional but recommended):</p>
          <div 
            className="flex-col justify-center items-center cursor-pointer" 
            style={{ 
              height: '150px', 
              borderRadius: 'var(--border-radius-md)', 
              boxShadow: 'var(--neumorph-inner)',
              border: '2px dashed var(--text-secondary)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {aiStatus === null && (
              <>
                <Camera size={32} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Tap to take a Photo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
                  onChange={simulateAiCheck} 
                />
              </>
            )}
            {aiStatus === 'checking' && (
              <>
                <UploadCloud size={32} className="animate-pulse" color="var(--primary)" style={{ marginBottom: '8px' }} />
                <span style={{ color: 'var(--primary)' }}>Analyzing image with AI...</span>
              </>
            )}
            {aiStatus === 'verified' && (
              <>
                <CheckCircle size={32} color="var(--found-color)" style={{ marginBottom: '8px' }} />
                <span style={{ color: 'var(--found-color)' }}>AI Verification Passed (Legitimate)</span>
              </>
            )}
            {aiStatus === 'flagged' && (
              <>
                <AlertTriangle size={32} color="var(--lost-color)" style={{ marginBottom: '8px' }} />
                <span style={{ color: 'var(--lost-color)' }}>AI Warning: Image may be cloned/fake</span>
              </>
            )}
          </div>
        </div>

        <button 
          className="neo-button primary w-full mt-4" 
          onClick={() => {
            const newItem = {
              id: Date.now(),
              type,
              category,
              name: document.querySelector('input[placeholder="Item Name (e.g. Black Nike Backpack)"]').value || 'Unnamed Item',
              userName: document.querySelector('input[placeholder="Your Name"]').value || 'Anonymous User', 
              verified: true,
              desc: document.querySelector('textarea').value || 'No description provided.',
              status: type,
              phone: document.querySelector('input[type="tel"]').value || '0000000000',
              locationName,
              lat: coords ? coords.lat : (19.0760 + (Math.random() - 0.5) * 0.01), // Default near center if no GPS
              lng: coords ? coords.lng : (72.8777 + (Math.random() - 0.5) * 0.01),
              matchAlert: false,
              comments: []
            };
            const existingItems = JSON.parse(localStorage.getItem('find_items') || '[]');
            localStorage.setItem('find_items', JSON.stringify([newItem, ...existingItems]));
            navigate('/feed');
          }}
          style={{ padding: '20px' }}
        >
          Submit {type} Report
        </button>

      </div>
    </div>
  );
}
