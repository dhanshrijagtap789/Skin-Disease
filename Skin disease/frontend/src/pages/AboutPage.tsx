import React, { useEffect, useState } from 'react';
import {
  ShieldCheck, ArrowLeft, Star, ShoppingBag,
  Brain, Heart, Users, Target, Zap,
  CheckCircle2, Microscope, Award, Droplets,
  Sun, Leaf, AlertCircle, Layers
} from 'lucide-react';

interface Props {
  onBack: () => void;
  onLogin: () => void;
  onStart: () => void;
}

const SKIN_TYPES = [
  { key: 'Oily Skin',      label: 'Oily Skin',      icon: Droplets,   color: '#38bdf8', bg: 'rgba(56,189,248,0.12)'  },
  { key: 'Dry Skin',       label: 'Dry Skin',        icon: Leaf,       color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
  { key: 'Sensitive Skin', label: 'Sensitive Skin',  icon: AlertCircle,color: '#f43f5e', bg: 'rgba(244,63,94,0.12)'   },
  { key: 'Acne',           label: 'Acne-Prone',      icon: Target,     color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  { key: 'Pigmentation',   label: 'Pigmentation',    icon: Sun,        color: '#fbbf24', bg: 'rgba(251,191,36,0.12)'  },
  { key: 'Fungal',         label: 'Fungal / Infection', icon: Microscope, color: '#4ade80', bg: 'rgba(74,222,128,0.12)' },
  { key: 'All',            label: 'All Skin Types',  icon: Layers,     color: '#e2e8f0', bg: 'rgba(226,232,240,0.12)' },
];

export default function AboutPage({ onBack, onLogin, onStart }: Props) {
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [activeSkin, setActiveSkin] = useState('Oily Skin');

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoadingProducts(false); })
      .catch(() => setLoadingProducts(false));
    window.scrollTo(0, 0);
  }, []);

  // Filter products by selected skin type key
  const filteredProducts = products.filter(p => {
    if (activeSkin === 'All') return true;
    return (p.suitableFor || []).some((s: string) =>
      s.toLowerCase().includes(activeSkin.toLowerCase()) ||
      activeSkin.toLowerCase().includes(s.toLowerCase().split(' ')[0])
    );
  });

  const activeSkinObj = SKIN_TYPES.find(s => s.key === activeSkin)!;

  const milestones = [
    { icon: Target,      value: '95%',   label: 'Detection Accuracy',    sub: 'Powered by Google Gemini AI' },
    { icon: ShoppingBag, value: '15+',   label: 'Curated Products',       sub: 'Dermatology-grade skincare' },
    { icon: Microscope,  value: '10+',   label: 'Skin Conditions',        sub: 'Diagnosed with precision' },
    { icon: Zap,         value: '24/7',  label: 'Instant Analysis',       sub: 'Results in seconds' },
  ];

  const howItWorks = [
    { step: '01', title: 'Upload Your Photo', desc: 'Take a clear photo of the affected skin area. Our system accepts all common image formats from any device.', icon: '📸' },
    { step: '02', title: 'AI Analysis',        desc: 'Our AI engine deeply analyses the image to identify the skin condition, severity level, and underlying causes.', icon: '🧠' },
    { step: '03', title: 'Get Your Results',   desc: 'Receive a full diagnosis with a personalised skincare routine, product recommendations, and treatment guidance.', icon: '📋' },
    { step: '04', title: 'Track Progress',     desc: 'Log every scan and monitor your skin improvement over time through your personal skin health history.', icon: '📈' },
  ];

  const conditions = [
    'Acne Vulgaris', 'Fungal Infection', 'Urticaria (Rashes)', 'Dark Spots & Pigmentation',
    'Dry Skin & Eczema', 'Oily Skin & Open Pores', 'Rosacea', 'Melasma',
    'Sunburn', 'Ringworm', 'Blackheads & Whiteheads', 'Skin Allergy',
  ];

  return (
    <div style={{ background: '#EBF3FB', minHeight: '100vh' }}>

      {/* ── Navbar ── */}
      <header style={{
        background: 'linear-gradient(90deg, #020B18 0%, #0A1628 40%, #0E2044 70%, #0D3060 100%)',
        borderBottom: '2px solid rgba(56,189,248,0.3)',
        position: 'sticky', top: 0, zIndex: 999,
        backdropFilter: 'blur(14px)',
        boxShadow: '0 4px 24px rgba(2,11,24,0.7)'
      }}>
        <nav className="container nav">
          <div className="flex items-center gap-1">
            <div className="logo-icon"><ShieldCheck size={28} /></div>
            <span className="logo-text">Cure<span style={{ color: '#4CAF72' }}>Skin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onBack} style={{
              background: 'none', border: '1px solid rgba(56,189,248,0.3)', color: 'rgba(255,255,255,0.8)',
              fontWeight: 700, cursor: 'pointer', padding: '10px 18px', borderRadius: '10px',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <ArrowLeft size={16} /> Home
            </button>
            <button onClick={onLogin} className="button-text">Login</button>
            <button onClick={onStart} className="button button-primary">Get Started</button>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #020B18 0%, #0A1628 45%, #0D3060 100%)',
        padding: '90px 0 80px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'rgba(56,189,248,0.05)', borderRadius: '50%', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', background: 'rgba(29,78,216,0.07)', borderRadius: '50%', filter: 'blur(80px)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '7px 18px',
                borderRadius: '99px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)',
                color: '#7dd3fc', fontWeight: 700, fontSize: '13px', marginBottom: '28px'
              }}>
                <span style={{ width: '6px', height: '6px', background: '#38bdf8', borderRadius: '50%', display: 'inline-block' }} />
                About CureSkin
              </div>
              <h1 style={{ fontSize: '54px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.1, marginBottom: '24px' }}>
                Your Personal{' '}
                <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  AI Skin Doctor
                </span>
              </h1>
              <p style={{ fontSize: '19px', color: 'rgba(191,219,254,0.8)', lineHeight: 1.75, marginBottom: '40px', maxWidth: '500px' }}>
                CureSkin is an intelligent skin disease detection platform that analyses your skin from a photo, identifies the condition, and gives you a personalised skincare routine — all in seconds.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={onStart} className="button button-primary" style={{ padding: '14px 36px', fontSize: '16px' }}>
                  Try It Free
                </button>
                <button onClick={onLogin} style={{
                  padding: '14px 36px', fontSize: '16px', fontWeight: 700,
                  border: '1px solid rgba(56,189,248,0.35)', background: 'rgba(56,189,248,0.08)',
                  color: '#7dd3fc', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  Login
                </button>
              </div>
            </div>

            {/* Quick-fact card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '32px', padding: '40px',
              border: '1px solid rgba(56,189,248,0.18)', backdropFilter: 'blur(20px)'
            }}>
              <h3 style={{ color: '#bfdbfe', fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '28px' }}>What CureSkin Does</h3>
              {[
                { icon: '🔍', text: 'Detects 10+ skin conditions from a single photo' },
                { icon: '💡', text: 'Provides AI-generated morning & night skin routines' },
                { icon: '🛒', text: 'Recommends pharmacy-grade skincare products' },
                { icon: '📊', text: 'Tracks your skin health history over time' },
                { icon: '⚡', text: 'Delivers results in under 10 seconds' },
                { icon: '🔒', text: 'Secure personal account with JWT authentication' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < 5 ? '1px solid rgba(56,189,248,0.08)' : 'none' }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <span style={{ color: 'rgba(191,219,254,0.85)', fontSize: '15px', fontWeight: 500 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section style={{ background: 'linear-gradient(90deg, #0A1628, #0D3060, #0A1628)', padding: '44px 0', borderTop: '1px solid rgba(56,189,248,0.2)', borderBottom: '1px solid rgba(56,189,248,0.2)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {milestones.map((m, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', borderRight: i < 3 ? '1px solid rgba(56,189,248,0.15)' : 'none' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#38bdf8' }}>
                  <m.icon size={22} />
                </div>
                <div style={{ fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{m.value}</div>
                <div style={{ fontSize: '14px', color: '#bfdbfe', fontWeight: 700, margin: '4px 0 2px' }}>{m.label}</div>
                <div style={{ fontSize: '12px', color: 'rgba(148,193,240,0.55)' }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission / Story ── */}
      <section style={{ padding: '100px 0', background: '#EBF3FB' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '8px', background: 'rgba(30,58,95,0.09)', color: '#1E3A5F', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>Our Story</span>
            <h2 style={{ fontSize: '44px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '18px' }}>
              Why We Built CureSkin
            </h2>
            <p style={{ fontSize: '18px', color: '#718096', maxWidth: '680px', margin: '0 auto', lineHeight: 1.8 }}>
              Millions of people in India visit dermatologists for conditions that could have been caught earlier. We built CureSkin to put expert-level skin analysis into everyone's hands — for free, instantly, from any phone.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '32px', padding: '48px', border: '1px solid rgba(30,58,95,0.08)', boxShadow: '0 4px 24px rgba(30,58,95,0.06)' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E3A5F', marginBottom: '20px' }}>The Problem We Solve</h3>
              {[
                'Dermatologist visits are expensive and time-consuming',
                'Most people ignore early signs of skin disease',
                'Generic skincare products don\'t match individual conditions',
                'No easy way to track skin health changes over time',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                    <span style={{ color: '#ef4444', fontSize: '12px', fontWeight: 900 }}>✕</span>
                  </div>
                  <span style={{ color: '#4A5568', fontSize: '15px', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #020B18, #0D3060)', borderRadius: '32px', padding: '48px', border: '2px solid rgba(56,189,248,0.2)', boxShadow: '0 20px 60px rgba(2,11,24,0.2)' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', marginBottom: '20px' }}>How CureSkin Helps</h3>
              {[
                'Free, instant skin diagnosis from any smartphone',
                'Early detection prevents conditions from worsening',
                'Condition-specific product recommendations',
                'Full scan history to visualise skin improvement',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <CheckCircle2 size={20} style={{ color: '#4ade80', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ color: 'rgba(191,219,254,0.85)', fontSize: '15px', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: '100px 0', background: '#F8FAFC', borderTop: '1px solid rgba(30,58,95,0.07)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '8px', background: 'rgba(30,58,95,0.09)', color: '#1E3A5F', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>Simple Steps</span>
            <h2 style={{ fontSize: '44px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '-1.5px', lineHeight: 1.15 }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
            {howItWorks.map((step, i) => (
              <div key={i} style={{
                background: '#FFFFFF', borderRadius: '28px', padding: '36px 28px',
                border: '1px solid rgba(30,58,95,0.08)', boxShadow: '0 4px 20px rgba(30,58,95,0.06)',
                position: 'relative', overflow: 'hidden', textAlign: 'center'
              }}>
                <div style={{ position: 'absolute', top: '16px', right: '18px', fontSize: '13px', fontWeight: 900, color: 'rgba(30,58,95,0.15)', letterSpacing: '-0.5px' }}>{step.step}</div>
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{step.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1E3A5F', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#718096', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Conditions ── */}
      <section style={{ padding: '80px 0', background: '#EBF3FB' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '8px', background: 'rgba(30,58,95,0.09)', color: '#1E3A5F', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>We Detect</span>
            <h2 style={{ fontSize: '44px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '-1.5px' }}>Skin Conditions We Identify</h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {conditions.map((c, i) => (
              <div key={i} style={{
                padding: '12px 22px', borderRadius: '12px', background: '#FFFFFF',
                border: '1px solid rgba(30,58,95,0.1)', boxShadow: '0 2px 10px rgba(30,58,95,0.05)',
                color: '#1E3A5F', fontWeight: 700, fontSize: '14px'
              }}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products by Skin Type ── */}
      <section style={{ padding: '100px 0', background: '#F8FAFC', borderTop: '1px solid rgba(30,58,95,0.07)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '8px', background: 'rgba(30,58,95,0.09)', color: '#1E3A5F', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '18px' }}>Our Products</span>
            <h2 style={{ fontSize: '44px', fontWeight: 900, color: '#1E3A5F', letterSpacing: '-1.5px', lineHeight: 1.15, marginBottom: '14px' }}>
              Products by Skin Type
            </h2>
            <p style={{ fontSize: '17px', color: '#718096', maxWidth: '540px', margin: '0 auto 44px', lineHeight: 1.7 }}>
              Every product is carefully selected for specific skin conditions. Choose your skin type below to see the best recommendations for you.
            </p>
          </div>

          {/* Skin type tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '48px' }}>
            {SKIN_TYPES.map(st => (
              <button key={st.key} onClick={() => setActiveSkin(st.key)} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 22px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, fontSize: '14px', transition: 'all 0.2s',
                background: activeSkin === st.key ? st.bg : '#FFFFFF',
                border: activeSkin === st.key ? `1.5px solid ${st.color}` : '1.5px solid rgba(30,58,95,0.1)',
                color: activeSkin === st.key ? st.color : '#718096',
                boxShadow: activeSkin === st.key ? `0 4px 18px ${st.bg}` : '0 2px 8px rgba(30,58,95,0.04)',
                transform: activeSkin === st.key ? 'translateY(-2px)' : 'none'
              }}>
                <st.icon size={16} />
                {st.label}
              </button>
            ))}
          </div>

          {/* Active skin type banner */}
          {activeSkin !== 'All' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px', padding: '20px 28px',
              borderRadius: '18px', marginBottom: '36px',
              background: activeSkinObj.bg, border: `1px solid ${activeSkinObj.color}40`
            }}>
              <activeSkinObj.icon size={22} style={{ color: activeSkinObj.color, flexShrink: 0 }} />
              <div>
                <span style={{ fontWeight: 800, color: activeSkinObj.color, fontSize: '16px' }}>
                  Products for {activeSkinObj.label}
                </span>
                <span style={{ color: '#718096', fontSize: '14px', marginLeft: '12px' }}>
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>
          )}

          {loadingProducts ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ height: '340px', borderRadius: '24px', background: '#E2EBF5', animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '24px' }}>
              {filteredProducts.map((product: any) => (
                <div key={product._id || product.id}
                  style={{
                    background: '#FFFFFF', borderRadius: '26px', padding: '18px',
                    border: '1px solid rgba(30,58,95,0.08)', boxShadow: '0 4px 18px rgba(30,58,95,0.06)',
                    display: 'flex', flexDirection: 'column', transition: 'transform 0.3s, box-shadow 0.3s'
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 18px 36px rgba(30,58,95,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 18px rgba(30,58,95,0.06)'; }}
                >
                  {/* Image */}
                  <div style={{ borderRadius: '18px', overflow: 'hidden', marginBottom: '14px', aspectRatio: '1/1', background: '#F0F5FA', border: '1px solid rgba(30,58,95,0.06)', position: 'relative' }}>
                    <img src={product.image} alt={product.name} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                      position: 'absolute', bottom: '8px', left: '8px', padding: '4px 10px',
                      borderRadius: '8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                      background: 'rgba(30,58,95,0.75)', color: '#7dd3fc', backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(56,189,248,0.3)'
                    }}>
                      {product.category}
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#1E3A5F', marginBottom: '8px', lineHeight: 1.45 }}>{product.name}</h3>
                      {/* Suitable for tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
                        {(product.suitableFor || []).slice(0, 3).map((tag: string, ti: number) => (
                          <span key={ti} style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(30,58,95,0.07)', color: '#4A8FA8', fontWeight: 700 }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#fbbf24', fontWeight: 800, marginBottom: '12px' }}>
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating || '4.8'}</span>
                        <span style={{ color: '#718096', fontWeight: 500, marginLeft: '4px' }}>({product.reviews || 120}+ reviews)</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(30,58,95,0.07)' }}>
                      <span style={{ fontSize: '20px', fontWeight: 900, color: '#1E3A5F' }}>₹{product.price || 499}</span>
                      <button onClick={onStart} title="Add to cart – login first"
                        style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'rgba(13,48,96,0.08)', color: '#1E3A5F', border: '1px solid rgba(30,58,95,0.15)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1E3A5F'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(13,48,96,0.08)'; (e.currentTarget as HTMLElement).style.color = '#1E3A5F'; }}
                      >
                        <ShoppingBag size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#718096' }}>
              <ShoppingBag size={48} style={{ margin: '0 auto 16px', opacity: 0.25, display: 'block' }} />
              <p style={{ fontWeight: 600 }}>No products found for this skin type.</p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button onClick={onStart} className="button button-primary" style={{ padding: '16px 44px', fontSize: '16px' }}>
              Sign Up to See All Products
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '100px 0', background: 'linear-gradient(135deg, #020B18 0%, #0A1628 40%, #0D3060 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '250px', background: 'rgba(56,189,248,0.05)', filter: 'blur(90px)', borderRadius: '50%' }} />
        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '50px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', marginBottom: '20px' }}>Ready to Know Your Skin?</h2>
          <p style={{ fontSize: '19px', color: 'rgba(191,219,254,0.75)', maxWidth: '520px', margin: '0 auto 44px', lineHeight: 1.7 }}>
            Sign up for free and get your first skin analysis in under 30 seconds. No appointments, no waiting.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button onClick={onStart} className="button button-primary" style={{ padding: '16px 44px', fontSize: '17px', fontWeight: 800 }}>Get Started — It's Free</button>
            <button onClick={onBack} style={{ padding: '16px 36px', fontSize: '17px', fontWeight: 700, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderRadius: '12px', cursor: 'pointer' }}>
              Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000', padding: '28px 0', borderTop: '1px solid rgba(56,189,248,0.12)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(148,193,240,0.55)', fontSize: '13px' }}>
          © 2026 CureSkin · AI-supported tool, not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
}
