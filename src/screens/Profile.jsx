import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User, LogOut, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || { email: 'guest@example.com', user_metadata: { name: 'Guest User' } });
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="page-container" style={{ paddingBottom: '80px', background: '#ffccb3' }}>
      <div className="flex items-center mb-4" style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/dashboard')} className="neo-button" style={{ padding: '10px', borderRadius: '50%' }}>
          <ArrowLeft size={24} color="var(--text-primary)" />
        </button>
        <h1 style={{ marginLeft: '16px', fontSize: '24px' }}>My Profile</h1>
      </div>
      <div className="neo-card flex-col items-center" style={{ marginTop: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <User size={40} />
        </div>
        <h2 style={{ fontSize: '22px' }}>{user?.user_metadata?.name || user?.user_metadata?.full_name || 'Guest User'}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>{user?.email}</p>
        <button className="neo-button w-full" style={{ padding: '15px' }} onClick={handleLogout}>
          <LogOut size={20} style={{ marginRight: '10px' }} />
          Logout
        </button>
      </div>
    </div>
  );
}
