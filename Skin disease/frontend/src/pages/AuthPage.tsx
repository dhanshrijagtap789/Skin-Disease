import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, ArrowLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthPage({ onBack, onSuccess, defaultIsLogin = true }: { onBack: () => void, onSuccess: () => void, defaultIsLogin?: boolean }) {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState({
    name: '',
    email: 'user@cureskin.com',
    password: 'user123',
    skinType: 'Normal'
  });

  React.useEffect(() => {
    if (isLogin) {
      setFormData(prev => ({
        ...prev,
        email: role === 'admin' ? 'admin@cureskin.com' : 'user@cureskin.com',
        password: role === 'admin' ? 'admin123' : 'user123'
      }));
    } else {
      setFormData({ name: '', email: '', password: '', skinType: 'Normal' });
    }
  }, [role, isLogin]);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      
      addToast(isLogin ? 'Login successful!' : 'Account created effectively!', 'success');
      login(data.token, data.user);
      onSuccess();
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        {/* Left Side - Visual */}
        <div className="auth-sidebar">
          <button onClick={onBack} className="back-link" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>

          <div className="auth-hero">
            <div className="logo-icon-small" style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.2)', width: '64px', height: '64px' }}>
              <ShieldCheck size={32} />
            </div>
            <h2 style={{ fontSize: '32px', marginBottom: '16px', color: '#ffffff' }}>
              {isLogin ? 'Welcome Back!' : 'Join CureSkin Today'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '18px' }}>
              {isLogin 
                ? 'Access your personalized skincare dashboard and track your progress.' 
                : 'Start your journey to healthier skin with AI-powered insights.'}
            </p>
          </div>

          <div className="text-xs" style={{ opacity: 0.6 }}>
            Professional Medical AI System v2.4
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-container">
          <div className="tabs">
            <button 
              onClick={() => setIsLogin(true)}
              className={`tab-item ${isLogin ? 'tab-active' : ''}`}
            >
              Login
            </button>
            {role === 'user' && (
              <button 
                onClick={() => setIsLogin(false)}
                className={`tab-item ${!isLogin ? 'tab-active' : ''}`}
              >
                Sign Up
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div className="role-selection">
              <label className={`role-item ${role === 'user' ? 'role-active' : ''}`}>
                <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} />
                <User size={18} />
                <span>User</span>
              </label>
              
              {isLogin && (
                <label className={`role-item ${role === 'admin' ? 'role-active' : ''}`}>
                  <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} />
                  <ShieldCheck size={18} />
                  <span>Admin</span>
                </label>
              )}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <div className="input-container">
                  <User className="input-icon" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="Dhanshri"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-container">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="input-field"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-container" style={{ position: 'relative' }}>
                <Lock className="input-icon" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  className="input-field"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  style={{ paddingRight: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>



            <button 
              type="submit"
              disabled={loading}
              className="button button-primary w-full"
              style={{ padding: '16px', marginTop: '20px' }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
              {!loading && <ChevronRight size={20} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
