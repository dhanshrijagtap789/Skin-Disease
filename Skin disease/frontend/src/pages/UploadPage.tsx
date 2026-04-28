import React, { useState, useRef } from 'react';
import { Upload, Camera, Image as ImageIcon, X, Loader2, ShieldCheck, ArrowLeft, ArrowRight, Cpu, Clock, CircleAlert, ChevronRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { analyzeSkinImage } from '../services/gemini';

export default function UploadPage({ onScanComplete, onBack, onNavigate }: { onScanComplete: (result: any) => void, onBack: () => void, onNavigate: (p: string) => void }) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [personalization, setPersonalization] = useState({
    skinType: 'Normal',
    concern: 'Acne',
    allergies: ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzeSkinImage(image, personalization);
      const res = await fetch('/api/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          image,
          result,
          ...personalization
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Scan failed');

      addToast('Scan completed successfully!', 'success');
      onScanComplete(data);
    } catch (err: any) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '48px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px' }}>
              {step === 1 ? 'New Skin ' : 'Finalize '}
              <span className="text-gradient">{step === 1 ? 'Analysis' : 'Profile'}</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-gray)', fontWeight: '500' }}>
              {step === 1 ? 'Upload a clear photo for AI-driven detection.' : 'Customize findings with your personal skin details.'}
            </p>
          </div>
          <div className="badge" style={{ margin: 0, padding: '10px 20px' }}>
            <span className="dot"></span>
            Step {step} / 2
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
        {step === 1 ? (
          <div style={{ padding: '48px' }}>
            {!image ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="upload-box"
                style={{
                  border: '2px dashed var(--border-neon)',
                  background: 'rgba(192, 38, 211, 0.03)',
                  height: '340px',
                  borderRadius: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.4s ease'
                }}
              >
                <div className="upload-icon-wrapper" style={{ width: '100px', height: '100px', marginBottom: '24px', background: 'rgba(192, 38, 211, 0.1)', boxShadow: '0 0 30px rgba(192, 38, 211, 0.2)' }}>
                  <Upload size={40} />
                </div>
                <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>Drop skin photo here</h3>
                <p style={{ color: 'var(--text-gray)', fontSize: '16px' }}>or click to explore your storage</p>
              </div>
            ) : (
              <div className="preview-container" style={{ width: '100%', height: '340px', borderRadius: '32px', overflow: 'hidden', position: 'relative', background: '#0a0a0a' }}>
                <img src={image} alt="Preview" className="preview-image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}></div>
                <button
                  onClick={() => setImage(null)}
                  className="button-icon"
                  style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,68,102,0.2)', color: '#ff4466', borderColor: 'rgba(255,68,102,0.3)', width: '48px', height: '48px' }}
                >
                  <X size={24} />
                </button>
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="tag" style={{ background: 'rgba(16,185,129,0.2)', color: '#4ade80', backdropFilter: 'blur(10px)', border: '1px solid rgba(16,185,129,0.3)', padding: '6px 16px' }}>Photo Captured Successfully</div>
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              style={{ display: 'none' }}
            />

            <div className="flex gap-3" style={{ marginTop: '40px', width: '100%' }}>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="button button-secondary flex-1"
                style={{ padding: '18px', borderRadius: '18px', fontSize: '16px' }}
              >
                <ImageIcon size={22} style={{ marginRight: '10px' }} />
                {image ? 'Change Photo' : 'Select Local File'}
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!image}
                className="button button-primary flex-1"
                style={{ padding: '18px', borderRadius: '18px', fontSize: '16px', fontWeight: '900' }}
              >
                Continue Assessment <ArrowRight size={22} style={{ marginLeft: '10px' }} />
              </button>
            </div>

            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { label: "AI Powered", desc: "Gemini Pro Vision Engine", icon: Cpu },
                { label: "Secure Data", desc: "Private and encrypted", icon: ShieldCheck },
                { label: "Instant Results", desc: "Analyzed in seconds", icon: Clock }
              ].map((tip, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="stats-icon-wrapper bg-blue-light" style={{ width: '48px', height: '48px', flexShrink: 0 }}><tip.icon size={20} /></div>
                  <div>
                    <p style={{ fontWeight: '800', fontSize: '14px', marginBottom: '2px' }}>{tip.label}</p>
                    <p style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr' }}>
            <div style={{ padding: '48px', background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', background: '#0a0a0a' }}>
                <img src={image!} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                {loading && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(192, 38, 211, 0.2)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                    <div className="confidence-ring" style={{ width: '60px', height: '60px', marginBottom: '16px' }}>
                      <Loader2 size={30} className="animate-spin" />
                    </div>
                    <p style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>ANALYZING NEURAL DATA</p>
                  </div>
                )}
              </div>
              <div className="card" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ color: 'var(--text-gray)', fontSize: '13px', lineHeight: '1.6' }}>
                  <CircleAlert size={14} style={{ marginRight: '6px', display: 'inline', verticalAlign: 'middle', color: 'var(--primary)' }} />
                  Tips: Selecting the correct skin type helps the AI provide more accurate product recommendations.
                </p>
              </div>
            </div>

            <div style={{ padding: '48px' }}>
              <div className="grid-2" style={{ gap: '32px' }}>
                <div className="form-group">
                  <label style={{ color: '#1E3A5F', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Skin Type</label>
                  <select
                    value={personalization.skinType}
                    onChange={(e) => setPersonalization({ ...personalization, skinType: e.target.value })}
                    className="input-field"
                    style={{ background: '#FFFFFF', color: '#1E3A5F', height: '56px', borderRadius: '16px', border: '1px solid rgba(30,58,95,0.15)', fontWeight: '600' }}
                  >
                    <option>Normal</option>
                    <option>Oily</option>
                    <option>Dry</option>
                    <option>Combination</option>
                    <option>Sensitive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ color: '#1E3A5F', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '800', marginBottom: '8px', display: 'block' }}>Primary Goal</label>
                  <select
                    value={personalization.concern}
                    onChange={(e) => setPersonalization({ ...personalization, concern: e.target.value })}
                    className="input-field"
                    style={{ background: '#FFFFFF', color: '#1E3A5F', height: '56px', borderRadius: '16px', border: '1px solid rgba(30,58,95,0.15)', fontWeight: '600' }}
                  >
                    <option>General Analysis</option>
                    <option>Acne Control</option>
                    <option>Anti-Aging</option>
                    <option>Reduce Redness</option>
                    <option>Texture Repair</option>
                    <option>Brightening</option>
                  </select>
                </div>
              </div>


              <div style={{ marginTop: 'Auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '40px' }}>
                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="button button-primary"
                  style={{ padding: '18px', borderRadius: '18px', fontSize: '18px', fontWeight: '900', boxShadow: '0 10px 40px rgba(192, 38, 211, 0.4)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" style={{ marginRight: '12px' }} />
                      ANALYZING SKIN DATA...
                    </>
                  ) : (
                    <>
                      START SCANNING
                      <ChevronRight size={22} style={{ marginLeft: '10px' }} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="button button-text"
                  style={{ padding: '12px', fontSize: '15px' }}
                >
                  Back to Photo Upload
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
