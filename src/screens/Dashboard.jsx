import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Search, PlusCircle, Compass } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [locationName, setLocationName] = useState("Fetching Location...");
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    // Load recent items
    const storedItems = JSON.parse(localStorage.getItem('find_items') || '[]');
    setRecentItems(storedItems.slice(0, 5)); // Show up to 5 most recent

    // Fetch actual User
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserName(data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email.split('@')[0]);
      }
    });

    // Fetch actual GPS Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            // Free reverse geocoding
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            const place = data.address?.city || data.address?.town || data.address?.village || data.address?.county || "Unknown Area";
            setLocationName(`${place}, ${data.address?.country || ''}`);
          } catch (e) {
            setLocationName(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`);
          }
        },
        () => {
          setLocationName('Location Access Denied');
        }
      );
    } else {
      setLocationName('Geolocation unavailable');
    }
  }, []);

  return (
    <div className="page-container" style={{ 
      background: 'var(--bg-gradient)',
      color: '#fff',
      minHeight: '100vh',
    }}>
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6" style={{ marginTop: '20px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: '800', letterSpacing: '-0.5px' }}>
            Hello, {userName}
          </h1>
          <div className="flex items-center" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px' }}>
            <MapPin size={14} style={{ marginRight: '6px', color: 'var(--primary)' }} />
            <span style={{ fontWeight: '500' }}>{locationName}</span>
          </div>
        </div>
        
        <div onClick={() => navigate('/profile')} style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          boxShadow: 'var(--neumorph-outer)',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <User size={24} color="var(--primary)" />
        </div>
      </div>

      {/* Main Action Cards */}
      <div className="flex-col gap-4 mt-2">
        
        {/* Post Item Card */}
        <div className="neo-card" style={{ 
          padding: '30px', 
          background: 'rgba(59, 130, 246, 0.05)', 
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background circle */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)' }}></div>
          
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
            <PlusCircle size={24} color="var(--primary)" />
          </div>
          
          <h2 style={{ fontSize: '22px', marginBottom: '8px', color: '#fff', fontWeight: '700' }}>Report an Item</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5', maxWidth: '80%' }}>
            Lost something valuable, or found an item that belongs to someone else?
          </p>
          
          <button 
            className="neo-button w-full" 
            onClick={() => navigate('/post')}
            style={{ 
              background: 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)', 
              color: '#fff', 
              fontWeight: '600',
              border: 'none',
              padding: '16px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            Create a New Post
          </button>
        </div>

        {/* Found Items Card */}
        <div className="neo-card flex-col items-start justify-center cursor-pointer" 
             style={{ 
               padding: '24px 30px', 
               background: 'rgba(255, 255, 255, 0.03)', 
               border: '1px solid rgba(255, 255, 255, 0.08)',
               marginTop: '10px',
               display: 'flex',
               flexDirection: 'row',
               alignItems: 'center',
               justifyContent: 'space-between'
             }}
             onClick={() => navigate('/feed')}>
          <div>
            <h2 style={{ fontSize: '18px', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>Discover Feed</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Swipe through items nearby
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Search size={20} color="#fff" />
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Nearby Items */}
      {recentItems.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <div className="flex justify-between items-center mb-4">
            <h2 style={{ fontSize: '18px', color: '#fff' }}>Recently Posted Nearby</h2>
            <button onClick={() => navigate('/feed')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '14px' }}>View All</button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: '16px', 
            paddingBottom: '16px',
            scrollSnapType: 'x mandatory',
            msOverflowStyle: 'none',  /* IE and Edge */
            scrollbarWidth: 'none'  /* Firefox */
          }}>
            {/* Hide scrollbar for Chrome, Safari and Opera */}
            <style>{`.page-container ::-webkit-scrollbar { display: none; }`}</style>
            
            {recentItems.map(item => (
              <div key={item.id} className="neo-card" onClick={() => navigate('/feed')} style={{ 
                minWidth: '240px', 
                padding: '20px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div className="flex justify-between items-center mb-3">
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '6px 10px', 
                    borderRadius: '12px',
                    backgroundColor: item.type === 'Lost' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: item.type === 'Lost' ? '#ef4444' : '#10b981'
                  }}>
                    {item.type.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '500' }}>{item.category}</span>
                </div>
                <h3 style={{ fontSize: '16px', color: '#fff', margin: '8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600' }}>{item.name || item.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} /> {item.userName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation Element */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', marginBottom: '20px', paddingTop: '20px' }}>
        <button className="neo-button flex items-center justify-center gap-2" onClick={() => navigate('/map')} 
          style={{ 
            borderRadius: '100px', 
            padding: '16px 32px', 
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
            color: 'var(--text-primary)'
          }}>
          <Compass size={20} color="var(--primary)" />
          <span>Open Live Map View</span>
        </button>
      </div>

    </div>
  );
}
