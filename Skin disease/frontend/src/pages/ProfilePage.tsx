import React, { useEffect, useState, useRef } from 'react';
import { 
  User as UserIcon, Mail, Camera, ArrowLeft, 
  LogOut, Save, X, Edit2, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ProfilePage({ onBack, onNavigate }: { onBack: () => void, onNavigate: (p: string) => void }) {
  const { logout, login, user: authUser } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setProfile(data);
        setNameInput(data.name);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (updates: { name?: string, avatar?: string }) => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      
      setProfile(data);
      // Synchronize with global AuthContext
      login(localStorage.getItem('token')!, data); 
      setIsEditing(false);
      return data;
    } catch (err: any) {
      addToast(err.message, "error");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const onSaveName = async () => {
    if (!nameInput.trim()) {
      addToast("Name cannot be empty", "error");
      return;
    }
    await handleUpdateProfile({ name: nameInput });
    addToast("Name updated successfully!", "success");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast("Image size must be less than 2MB", "error");
      return;
    }

    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await handleUpdateProfile({ avatar: base64String });
        addToast("Profile photo updated!", "success");
      } catch (err) {
        // Error already handled in handleUpdateProfile
      } finally {
        setUploadingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="card" style={{ padding: '40px', width: '300px', borderRadius: '32px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', animation: 'pulse 1.5s infinite' }}>
            <div className="stats-icon-wrapper bg-blue-light" style={{ margin: '0 auto 16px' }}><UserIcon /></div>
            <p style={{ fontWeight: '800', color: 'var(--text-gray)' }}>Loading Profile...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="profile-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px', color: '#1E3A5F' }}>
          Your <span className="text-gradient">Account</span>
        </h1>
      </div>

      <div className="flex items-center justify-center">
        <div className="card" style={{ 
          maxWidth: '500px', 
          width: '100%', 
          padding: '60px 40px', 
          borderRadius: '40px', 
          textAlign: 'center',
          background: '#ffffff',
          boxShadow: '0 20px 60px rgba(30,58,95,0.1)',
          border: '1px solid rgba(30,58,95,0.08)'
        }}>
          {/* Avatar Section */}
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 40px' }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #1E3A5F, #0D3060)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(13,48,96,0.2)',
              border: '6px solid #f8fafc',
              overflow: 'hidden'
            }}>
              {uploadingPhoto ? (
                <Loader2 size={50} className="animate-spin text-white" />
              ) : profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserIcon size={70} color="#fff" />
              )}
            </div>
            <button 
              onClick={handlePhotoClick}
              disabled={uploadingPhoto}
              className="camera-btn" 
              style={{ 
                position: 'absolute', 
                bottom: '8px', 
                right: '8px', 
                background: '#4CAF72', 
                color: '#fff', 
                border: '4px solid #1a1a1a', 
                width: '46px', 
                height: '46px', 
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              title="Change Photo"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
          </div>

          {/* Name Editing Section */}
          <div style={{ marginBottom: '40px' }}>
            {isEditing ? (
              <div className="flex flex-column items-center gap-3">
                 <input 
                   type="text" 
                   value={nameInput}
                   onChange={(e) => setNameInput(e.target.value)}
                   style={{
                     width: '100%',
                     padding: '12px 20px',
                     fontSize: '24px',
                     fontWeight: '800',
                     textAlign: 'center',
                     borderRadius: '16px',
                     border: '2px solid #4CAF72',
                     outline: 'none',
                     color: '#1E3A5F',
                     background: '#f1f5f9'
                   }}
                   autoFocus
                   onKeyDown={(e) => e.key === 'Enter' && onSaveName()}
                 />
                 <div className="flex gap-2">
                    <button 
                      onClick={onSaveName}
                      disabled={saving}
                      className="button button-primary"
                      style={{ padding: '10px 24px', borderRadius: '12px' }}
                    >
                       <Save size={18} style={{ marginRight: '8px' }} /> {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={() => { setIsEditing(false); setNameInput(profile.name); }}
                      className="button button-secondary"
                      style={{ padding: '10px 24px', borderRadius: '12px', color: '#1E3A5F' }}
                    >
                       <X size={18} style={{ marginRight: '8px' }} /> Cancel
                    </button>
                 </div>
              </div>
            ) : (
              <div className="flex flex-column items-center">
                 <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setIsEditing(true)}>
                    <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#1E3A5F', margin: 0 }}>{profile?.name}</h2>
                    <Edit2 size={20} className="text-gray" style={{ opacity: 0.5 }} />
                 </div>
                 <p style={{ color: '#64748b', fontSize: '16px', fontWeight: '500', marginTop: '4px' }}>{profile?.email}</p>
              </div>
            )}
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', width: '100%', marginBottom: '40px' }}></div>

          {/* Sign Out Section */}
          <button 
            onClick={logout} 
            className="button button-text" 
            style={{ 
              width: '100%', 
              padding: '20px', 
              borderRadius: '20px',
              color: '#f87171', 
              background: 'rgba(239,68,68,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: '800',
              fontSize: '16px',
              transition: 'all 0.2s',
              border: '1px solid rgba(239,68,68,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
          >
             <LogOut size={22} />
             SIGN OUT
          </button>
        </div>
      </div>
    </div>
  );
}
