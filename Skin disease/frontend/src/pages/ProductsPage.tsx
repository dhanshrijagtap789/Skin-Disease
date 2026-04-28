import React, { useEffect, useState, useMemo } from 'react';
import {
  Star, Heart, ArrowLeft, Search,
  Sparkles, Droplets, Leaf, Sun,
  AlertCircle, Target, Microscope, FlaskConical
} from 'lucide-react';

const SKIN_TYPE_CONFIG = [
  { key: 'Oily Skin',       label: 'Oily Skin',         icon: Droplets,    accent: '#38bdf8', bg: '#EFF9FF', border: 'rgba(56,189,248,0.25)' },
  { key: 'Dry Skin',        label: 'Dry Skin',           icon: Leaf,        accent: '#f97316', bg: '#FFF7F0', border: 'rgba(249,115,22,0.25)'  },
  { key: 'Sensitive Skin',  label: 'Sensitive Skin',     icon: AlertCircle, accent: '#f43f5e', bg: '#FFF1F3', border: 'rgba(244,63,94,0.25)'   },
  { key: 'Acne',            label: 'Acne-Prone Skin',    icon: Target,      accent: '#a78bfa', bg: '#F5F3FF', border: 'rgba(167,139,250,0.25)' },
  { key: 'Pigmentation',    label: 'Pigmentation',       icon: Sun,         accent: '#fbbf24', bg: '#FFFBEB', border: 'rgba(251,191,36,0.25)'  },
  { key: 'Fungal',          label: 'Fungal / Infection', icon: Microscope,  accent: '#4ade80', bg: '#F0FDF4', border: 'rgba(74,222,128,0.25)'  },
];

export default function ProductsPage({ onBack, onNavigate }: { onBack: () => void, onNavigate: (p: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  const handleSearch = () => setAppliedSearch(searchTerm.trim());
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSearch(); };
  const clearSearch = () => { setSearchTerm(''); setAppliedSearch(''); };

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // When search is active — flat filtered list
  const searchResults = useMemo(() => {
    if (!appliedSearch) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      (p.suitableFor || []).some((s: string) => s.toLowerCase().includes(appliedSearch.toLowerCase())) ||
      (p.category || '').toLowerCase().includes(appliedSearch.toLowerCase())
    );
  }, [products, appliedSearch]);

  // When no search — grouped by skin type
  const nonTubes = useMemo(() => products.filter(p => p.category !== 'Pharmacy Tube'), [products]);
  const pharmacyTubes = useMemo(() => products.filter(p => p.category === 'Pharmacy Tube'), [products]);

  const grouped = useMemo(() => {
    return SKIN_TYPE_CONFIG.map(st => ({
      ...st,
      items: nonTubes.filter(p =>
        (p.suitableFor || []).some((s: string) =>
          s.toLowerCase().includes(st.key.toLowerCase().split(' ')[0]) ||
          st.key.toLowerCase().includes(s.toLowerCase().split(' ')[0])
        )
      )
    })).filter(g => g.items.length > 0);
  }, [nonTubes]);

  const renderCard = (product: any) => (
    <div
      key={product._id || product.id}
      style={{
        background: '#FFFFFF', borderRadius: '22px', padding: '16px',
        border: '1px solid rgba(30,58,95,0.09)', boxShadow: '0 2px 14px rgba(30,58,95,0.05)',
        display: 'flex', flexDirection: 'column', transition: 'transform 0.25s, box-shadow 0.25s'
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 30px rgba(30,58,95,0.12)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 14px rgba(30,58,95,0.05)'; }}
    >
      {/* Image */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '1/1', background: '#F0F5FA', position: 'relative', marginBottom: '0' }}>
        <img src={product.image} alt={product.name} referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <button style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(30,58,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#1E3A5F' }}>
            <Heart size={14} />
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', padding: '3px 9px', borderRadius: '8px', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(30,58,95,0.75)', color: '#7dd3fc', backdropFilter: 'blur(8px)' }}>
          {product.category}
        </div>
      </div>

      {/* Name below image */}
      <h3 style={{ margin: '12px 0 5px', fontSize: '13px', fontWeight: 800, color: '#1E3A5F', lineHeight: 1.4 }}>{product.name}</h3>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#fbbf24', fontWeight: 800, marginBottom: '10px' }}>
        <Star size={11} fill="currentColor" />
        <span>{product.rating || '4.8'}</span>
        <span style={{ color: '#718096', fontWeight: 500 }}> (120+)</span>
      </div>

      {/* Price */}
      <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid rgba(30,58,95,0.07)' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#1E3A5F' }}>₹{product.price || 499}</span>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div style={{ height: '280px', borderRadius: '22px', background: '#EBF3FB', animation: 'pulse 1.5s ease-in-out infinite' }} />
  );

  return (
    <div style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '20px' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '6px', color: '#1E3A5F' }}>
              Skin Care <span className="text-gradient">Products</span>
            </h1>
            <p style={{ fontSize: '17px', color: '#718096', fontWeight: 500 }}>
              Curated by skin type — dermatology-grade solutions for every concern.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0', alignItems: 'center', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(30,58,95,0.15)', boxShadow: '0 2px 10px rgba(30,58,95,0.05)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', flex: 1 }}>
              <Search size={16} style={{ color: '#718096', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ border: 'none', outline: 'none', fontSize: '14px', color: '#1E3A5F', background: 'transparent', width: '200px', fontWeight: 500 }}
              />
              {appliedSearch && (
                <button onClick={() => { setSearchTerm(''); setAppliedSearch(''); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096', fontSize: '16px', lineHeight: 1, padding: '0 4px' }}
                  title="Clear search"
                >✕</button>
              )}
            </div>
            <button
              onClick={handleSearch}
              style={{
                padding: '12px 22px', background: '#1E3A5F', color: '#fff',
                border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: '14px',
                transition: 'background 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0D3060')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1E3A5F')}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <>
          {[1, 2].map(si => (
            <div key={si} style={{ marginBottom: '52px' }}>
              <div style={{ height: '32px', width: '200px', background: '#EBF3FB', borderRadius: '10px', marginBottom: '24px', animation: 'pulse 1.5s ease-in-out infinite' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          {appliedSearch ? (
            searchResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px', color: '#718096', background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(30,58,95,0.08)' }}>
                <Search size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
                <p style={{ fontWeight: 600 }}>No products found for "{appliedSearch}"</p>
              </div>
            ) : (
              <div style={{ marginBottom: '56px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E3A5F', marginBottom: '24px' }}>Search Results</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '18px' }}>
                  {searchResults.map(renderCard)}
                </div>
              </div>
            )
          ) : (
            /* Skin-type grouped sections (when NO search) */
            <>
              {grouped.length === 0 && pharmacyTubes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: '#718096', background: '#FFFFFF', borderRadius: '24px', border: '1px solid rgba(30,58,95,0.08)' }}>
                  <Search size={40} style={{ margin: '0 auto 16px', display: 'block', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600 }}>No products available</p>
                </div>
              ) : (
                <>
                  {grouped.map(group => (
                    <div key={group.key} style={{ marginBottom: '56px' }}>
                      {/* Section header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', padding: '16px 24px', borderRadius: '18px', background: group.bg, border: `1px solid ${group.border}` }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `${group.accent}20`, border: `1px solid ${group.accent}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <group.icon size={22} style={{ color: group.accent }} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E3A5F', margin: 0 }}>{group.label}</h2>
                          <p style={{ fontSize: '13px', color: '#718096', margin: 0 }}>{group.items.length} products curated for this skin type</p>
                        </div>
                      </div>

                      {/* Products grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '18px' }}>
                        {group.items.map(renderCard)}
                      </div>
                    </div>
                  ))}

                  {/* Pharmacy Tubes Section */}
                  {pharmacyTubes.length > 0 && (
                    <div style={{ marginBottom: '56px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', padding: '16px 24px', borderRadius: '18px', background: 'linear-gradient(135deg, #020B18, #0D3060)', border: '1px solid rgba(56,189,248,0.2)' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FlaskConical size={22} style={{ color: '#38bdf8' }} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>Pharmacy Tubes</h2>
                          <p style={{ fontSize: '13px', color: 'rgba(191,219,254,0.7)', margin: 0 }}>Prescription-grade treatments — use as directed by AI analysis</p>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '32px' }}>
                        {pharmacyTubes.map(product => (
                          <div key={product._id || product.id}>
                            <h4 style={{ 
                              fontSize: '15px', fontWeight: 900, color: '#1E3A5F', 
                              marginBottom: '12px', paddingBottom: '8px', 
                              borderBottom: '2px solid rgba(30,58,95,0.1)' 
                            }}>
                              For: {product.suitableFor?.join(' / ') || product.category}
                            </h4>
                            {renderCard({ ...product, style: { height: '100%' } })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
