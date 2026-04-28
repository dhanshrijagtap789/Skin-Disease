import React, { useMemo, useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, AlertCircle, 
  CheckCircle2, Info, ShoppingBag, 
  ArrowRight, Share2, Printer, 
  ChevronRight, Calendar, Bookmark,
  Thermometer, Activity, Zap, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ResultPage({ result, onBack, onNavigate }: { result: any, onBack: () => void, onNavigate: (p: string) => void }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);

  // Filter products based on scan result
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0 || !result) return [];
    
    const condition = result.result?.disease?.toLowerCase() || '';
    const isDry = condition.includes('dry') || condition.includes('eczema') || condition.includes('psoriasis');
    
    let routineProducts = products.filter(p => p.category !== 'Pharmacy Tube');
    const pharmacyTubes = products.filter(p => p.category === 'Pharmacy Tube');

    // Filter to best match
    if (isDry) {
       routineProducts = routineProducts.filter(p => p.suitableFor?.includes('Dry Skin') || p.suitableFor?.includes('Sensitive Skin'));
    } else if (condition.includes('acne') || condition.includes('oily')) {
       routineProducts = routineProducts.filter(p => p.suitableFor?.includes('Oily Skin') || p.suitableFor?.includes('Acne'));
    } else {
       routineProducts = routineProducts.filter(p => p.suitableFor?.includes('Normal') || p.suitableFor?.includes('All Skin Types'));
    }

    const getOrder = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes('wash') || n.includes('cleanser')) return 1;
      if (n.includes('toner') || n.includes('serum')) return 2;
      if (n.includes('moisturizer') || n.includes('cream')) return 3;
      if (n.includes('sunscreen')) return 4;
      return 5;
    };

    const selectedRoutine: any[] = [];
    const stepCounts = new Map();
    
    for (const p of routineProducts) {
       const step = getOrder(p.name);
       const count = stepCounts.get(step) || 0;
       if (count < 1) {
          selectedRoutine.push(p);
          stepCounts.set(step, count + 1);
       }
    }

    selectedRoutine.sort((a, b) => getOrder(a.name) - getOrder(b.name));
    
    // Pick 1 corresponding tube
    let selectedTube = pharmacyTubes.filter(p => p.suitableFor?.some((s: string) => condition.includes(s.toLowerCase())));

    const isBody = result.result?.is_body === true;
    if (isBody) {
      return [...selectedTube.slice(0, 1)];
    }

    return [...selectedRoutine.slice(0, 4), ...selectedTube.slice(0, 1)];
  }, [products, result]);

  if (!result || !result.result) {
    return (
      <div className="card text-center" style={{ margin: '100px auto', maxWidth: '500px', padding: '60px' }}>
        <div className="stats-icon-wrapper bg-orange-light" style={{ margin: '0 auto 24px', width: '80px', height: '80px' }}>
          <AlertCircle size={40} />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>No Data Found</h2>
        <p style={{ color: 'var(--text-gray)', marginBottom: '32px' }}>We couldn't retrieve the analysis data. Please try scanning again.</p>
        <button onClick={onBack} className="button button-primary">Back to Analysis</button>
      </div>
    );
  }

  const analysis = result.result;

  return (
    <div className="result-container" style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={onBack} className="back-link" style={{ marginBottom: '12px' }}>
             <ArrowLeft size={18} /> Analysis Report
          </button>
          <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px' }}>
            Analysis <span className="text-gradient">Report</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="button-icon" title="Print Result" onClick={() => window.print()}><Printer size={20} /></button>
          <button className="button-icon" title="Share Result"><Share2 size={20} /></button>
          <button className="button button-primary" onClick={() => onNavigate('dashboard')}>
            Done
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* Left Sidebar: Image & Quick Stats */}
        <div className="flex flex-column gap-3">
          <div className="image-card" style={{ padding: '8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', background: 'rgba(0,0,0,0.2)' }}>
            <img 
               src={result.image || "/images/placeholder.png"} 
               alt="Scanned Skin" 
               className="result-image" 
               style={{ width: '100%', height: 'auto', borderRadius: '24px', objectFit: 'contain', aspectRatio: '1/1', background: 'rgba(0,0,0,0.5)' }} 
            />
          </div>



          <div className="card" style={{ padding: '24px', border: '1px solid var(--primary)', background: 'rgba(200, 146, 58, 0.05)' }}>
            <div className="tag tag-primary" style={{ marginBottom: '12px' }}>Health Tag</div>
            <p style={{ fontWeight: '700', marginBottom: '8px' }}>Consult a Professional</p>
            <p style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: '1.6' }}>
              This AI analysis is meant for informational purposes. For clinical diagnosis, please consult a dermatologist.
            </p>
          </div>
        </div>

        {/* Right Content: Details */}
        <div className="flex flex-column gap-4">
          <div className="card" style={{ padding: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex justify-between items-start" style={{ marginBottom: '24px' }}>
               <div>
                  <div className={`tag ${analysis.severity === 'High' ? 'tag-danger' : analysis.severity === 'Medium' ? 'tag-warning' : 'tag-success'}`} style={{ marginBottom: '12px', textTransform: 'uppercase', fontWeight: '800', fontSize: '11px', background: analysis.severity === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: analysis.severity === 'High' ? '#f87171' : '#4ade80', border: '1px solid currentColor' }}>
                    {analysis.severity} Priority
                  </div>
                  <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#1E3A5F', letterSpacing: '-1px' }}>{analysis.disease}</h2>
               </div>
               <div className="stats-icon-wrapper bg-blue-light" style={{ width: '64px', height: '64px' }}>
                  <ShieldCheck size={32} />
               </div>
            </div>

            <div className="routine-step" style={{ background: 'rgba(30, 58, 95, 0.04)', padding: '24px', border: '1px solid rgba(30, 58, 95, 0.1)', borderRadius: '24px' }}>
               <div className="routine-step-icon" style={{ background: 'rgba(30, 58, 95, 0.1)', color: '#1E3A5F' }}>
                  <Info size={18} />
               </div>
               <div>
                  <p style={{ fontWeight: '800', color: '#1E3A5F', marginBottom: '4px', fontSize: '16px' }}>Clinical Insight</p>
                  <p style={{ lineHeight: '1.7', color: '#334155', fontSize: '15px', fontWeight: '500' }}>{analysis.details}</p>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
               <div style={{ padding: '24px', background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.15)', borderRadius: '24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', marginBottom: '16px', fontSize: '15px', textTransform: 'uppercase', fontWeight: '900' }}>
                    <Activity size={18} /> Recommendations
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.recommendations.map((rec: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                        <span style={{ color: '#22c55e' }}>⚡</span> {rec}
                      </li>
                    ))}
                  </ul>
               </div>
               <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '16px', fontSize: '15px', textTransform: 'uppercase', fontWeight: '900' }}>
                    <Thermometer size={18} /> Precautions
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysis.precautions.map((pre: string, i: number) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#334155', fontWeight: '600' }}>
                        <span style={{ color: '#ef4444' }}>✕</span> {pre}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
          </div>

          {/* Routine Section */}
          <div className="card" style={{ padding: '40px' }}>
             <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '28px', fontWeight: '900' }}>Skincare <span className="text-primary">Ritual</span></h3>
                <div className="badge" style={{ margin: 0, padding: '8px 16px', fontSize: '12px' }}>
                   AI Personalization Active
                </div>
             </div>
             
             <div className="routine-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div className="stats-icon-wrapper bg-blue-light" style={{ width: '40px', height: '40px' }}><Calendar size={18} /></div>
                      <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px' }}>Morning Protocol</span>
                   </div>
                   <div className="flex flex-column gap-3">
                      {analysis.recommended_routine.morning.map((step: string, i: number) => (
                        <div key={i} className="task-item" style={{ padding: '16px', borderRadius: '18px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                           <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(200, 146, 58, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900' }}>{i+1}</div>
                           <span style={{ fontSize: '14px', fontWeight: '700' }}>{step}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div style={{ padding: '28px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div className="stats-icon-wrapper bg-purple-light" style={{ width: '40px', height: '40px' }}><Zap size={18} /></div>
                      <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '13px' }}>Evening Protocol</span>
                   </div>
                   <div className="flex flex-column gap-3">
                      {analysis.recommended_routine.night.map((step: string, i: number) => (
                        <div key={i} className="task-item" style={{ padding: '16px', borderRadius: '18px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                           <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(200, 146, 58, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900' }}>{i+1}</div>
                           <span style={{ fontSize: '14px', fontWeight: '700' }}>{step}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div style={{ padding: '40px', background: 'rgba(200, 146, 58, 0.03)', borderRadius: '32px', border: '1px solid rgba(200, 146, 58, 0.15)', display: 'flex', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div className="stats-icon-wrapper bg-pink-light" style={{ width: '64px', height: '64px' }}>
                   <ShoppingBag size={28} />
                </div>
                <div>
                   <h4 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>Specialized Rx Care</h4>
                   <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>Dermatology-grade formulas selected for {analysis.disease}</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Recommended Products Display */}
      {filteredProducts.length > 0 && (
         <div style={{ marginTop: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
               <div>
                  <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px' }}>Essential <span className="text-primary">Supplies</span></h2>
                  <p style={{ color: 'var(--text-gray)', fontWeight: '500' }}>Products specifically safe for your detected skin condition.</p>
               </div>
               <button onClick={() => onNavigate('products')} className="btn-link" style={{ fontSize: '16px' }}>
                  Explore All Products <ArrowRight size={18} />
               </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
               {filteredProducts.map((p) => (
                  <div key={p.id} className="card product-card" style={{ padding: '20px' }}>
                     <div className="product-image-wrapper" style={{ borderRadius: '20px', marginBottom: '16px' }}>
                        <img src={p.image} referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="tag-success" style={{ position: 'absolute', bottom: '12px', left: '12px', padding: '4px 10px', fontSize: '10px', background: 'var(--primary)', color: 'white', fontWeight: 'bold' }}>{p.category}</div>
                     </div>
                     <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.4', minHeight: '42px' }}>{p.name}</h4>
                     <div className="flex justify-between items-center">
                        <span style={{ fontWeight: '900', fontSize: '18px' }}>₹{p.price}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
}
