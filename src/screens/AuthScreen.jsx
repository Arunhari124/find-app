import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, User, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'otp'
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMode('otp');
  };

  const handleOTP = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
      alert('Error logging in with Google: ' + error.message);
    }
  };

  return (
    <div className="page-container flex-col items-center justify-center">
      <div className="neo-card w-full" style={{ padding: '30px', marginTop: '40px' }}>
        
        <h2 className="text-center mb-4" style={{ fontSize: '28px', color: 'var(--primary)' }}>
          {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Verify OTP'}
        </h2>
        
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex-col gap-4 mt-4">
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="email" placeholder="Email Address" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="password" placeholder="Password" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>

            <button type="submit" className="neo-button primary w-full mt-4">Login</button>
            
            {/* Google Login Mock */}
            <div style={{ position: 'relative', textAlign: 'center', margin: '10px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e0' }} />
              <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--bg-color)', padding: '0 10px', fontSize: '12px', color: 'var(--text-secondary)' }}>OR</span>
            </div>
            
            <button type="button" className="neo-button w-full" style={{ background: '#ffffff', color: '#333', border: '1px solid #e2e8f0' }} onClick={handleGoogleLogin}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" height="20" alt="Google" style={{ marginRight: '10px' }} />
              Login with Google
            </button>

            <p className="text-center mt-4 cursor-pointer" style={{ color: 'var(--text-secondary)', fontSize: '14px' }} onClick={() => setMode('register')}>
              Don't have an account? Register
            </p>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="flex-col gap-4 mt-4">
            <div style={{ position: 'relative' }}>
              <User size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="text" placeholder="Full Name" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>

            <div style={{ position: 'relative' }}>
              <Phone size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="tel" placeholder="WhatsApp Number" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>

            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="email" placeholder="Email Address" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>
            
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ position: 'absolute', left: '15px', top: '15px', color: 'var(--text-secondary)' }} />
              <input type="password" placeholder="Password" className="neo-input" style={{ paddingLeft: '45px' }} required />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '-5px' }}>
              Note: Only one account is allowed per mobile device for security.
            </p>

            <button type="submit" className="neo-button primary w-full mt-4">Send OTP</button>

            {/* Google Login Mock */}
            <div style={{ position: 'relative', textAlign: 'center', margin: '10px 0' }}>
              <hr style={{ border: 'none', borderTop: '1px solid #cbd5e0' }} />
              <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--bg-color)', padding: '0 10px', fontSize: '12px', color: 'var(--text-secondary)' }}>OR</span>
            </div>
            
            <button type="button" className="neo-button w-full" style={{ background: '#ffffff', color: '#333', border: '1px solid #e2e8f0' }} onClick={handleGoogleLogin}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" height="20" alt="Google" style={{ marginRight: '10px' }} />
              Sign up with Google
            </button>

            <p className="text-center mt-4 cursor-pointer" style={{ color: 'var(--text-secondary)', fontSize: '14px' }} onClick={() => setMode('login')}>
              Already have an account? Login
            </p>
          </form>
        )}

        {mode === 'otp' && (
          <form onSubmit={handleOTP} className="flex-col gap-4 mt-4">
            <p className="text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
              Enter the 4-digit code sent to your email.
            </p>
            
            <div className="flex justify-center gap-4">
              {[1,2,3,4].map(i => (
                <input key={i} type="text" maxLength="1" className="neo-input text-center" style={{ width: '60px', height: '60px', fontSize: '24px' }} required />
              ))}
            </div>

            <button type="submit" className="neo-button primary w-full mt-4">
              <ShieldCheck size={20} /> Verify & Login
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
