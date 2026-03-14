import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogIn, UserPlus } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="page-container flex-col items-center justify-center" style={{ gap: '60px' }}>
      
      {/* Top Section */}
      <div className="text-center" style={{ marginTop: '40px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          boxShadow: 'var(--neumorph-outer)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: 'var(--primary)'
        }}>
          <Search size={48} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '48px', color: 'var(--text-primary)', letterSpacing: '2px' }}>FIND</h1>
      </div>

      {/* Middle Section */}
      <div className="text-center">
        <h2 style={{ fontSize: '24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Welcome</h2>
        <p style={{ marginTop: '10px', color: 'var(--text-secondary)', padding: '0 20px', lineHeight: 1.5 }}>
          The community-based lost and found network.
        </p>
      </div>

      {/* Bottom Section */}
      <div className="flex-col w-full gap-4" style={{ marginTop: 'auto', marginBottom: '40px' }}>
        <button 
          className="neo-button primary w-full" 
          onClick={() => navigate('/auth?mode=login')}
          style={{ padding: '20px' }}
        >
          <LogIn size={20} />
          Login
        </button>

        <button 
          className="neo-button w-full" 
          onClick={() => navigate('/auth?mode=register')}
          style={{ padding: '20px' }}
        >
          <UserPlus size={20} />
          Register
        </button>
      </div>
    </div>
  );
}
