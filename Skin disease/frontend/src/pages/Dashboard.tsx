import React, { useEffect, useState } from 'react';
import { ShieldCheck, Activity, Star, Package, ArrowRight, Clock, PlusCircle } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [scans, setScans] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    lastDisease: 'None',
    recommendedProduct: 'Gentle Cleanser',
    dailyTip: 'Wear SPF 50+ daily'
  });

  const trendData = React.useMemo(() => {
    if (!scans || scans.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    const today = new Date();
    
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      grouped[dateStr] = 0;
    }

    scans.forEach(scan => {
      const dateObj = new Date(scan.date);
      if (dateObj.getTime() > today.getTime() - 15 * 24 * 60 * 60 * 1000) {
        const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        if (grouped[dateStr] !== undefined) {
          grouped[dateStr] += 1;
        }
      }
    });

    return Object.keys(grouped).map(k => ({ date: k, scans: grouped[k] }));
  }, [scans]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/scans', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setScans(data);
        if (data.length > 0) {
          setStats(prev => ({
            ...prev,
            totalScans: data.length,
            lastDisease: data[data.length - 1].result?.disease || data[data.length - 1].disease
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Top Header - Welcome & CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', marginBottom: '6px' }}>
            Welcome back, {user?.name || 'Dhanshri'}
          </h1>
          <p style={{ fontSize: '18px', color: '#718096', fontWeight: 500, margin: 0 }}>
            Here is your skin health overview.
          </p>
        </div>
        <button 
          onClick={() => onNavigate('upload')}
          style={{ 
            background: 'linear-gradient(135deg, #1E3A5F, #0D3060)', color: '#fff',
            border: 'none', padding: '16px 32px', borderRadius: '18px',
            fontSize: '16px', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: '0 8px 24px rgba(13,48,96,0.15)', transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <PlusCircle size={20} />
          New Skin Scan
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: "Total Scans", value: stats.totalScans, icon: Activity, bg: '#EFF9FF', color: '#38bdf8' },
          { label: "Recent Detection", value: stats.lastDisease, icon: ShieldCheck, bg: '#F5F3FF', color: '#8b5cf6' },
          { label: "Top Product", value: stats.recommendedProduct, icon: Package, bg: '#F0FDF4', color: '#22c55e' },
          { label: "Daily Ritual", value: stats.dailyTip, icon: Star, bg: '#FFFBEB', color: '#f59e0b' },
        ].map((card, i) => (
          <div key={i} style={{ 
            background: '#FFFFFF', padding: '24px', borderRadius: '24px',
            border: '1px solid rgba(30,58,95,0.06)', boxShadow: '0 2px 14px rgba(30,58,95,0.03)',
            display: 'flex', alignItems: 'center', gap: '20px'
          }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <card.icon size={26} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '13px', color: '#718096', fontWeight: 700, margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.label}
              </p>
              <p style={{ fontSize: '18px', fontWeight: 900, color: '#1E3A5F', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Large Wide Graph */}
      <div style={{ 
        background: '#FFFFFF', borderRadius: '32px', padding: '32px', 
        border: '1px solid rgba(30,58,95,0.08)', boxShadow: '0 10px 40px rgba(30,58,95,0.04)',
        marginBottom: '40px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E3A5F', margin: '0 0 6px 0' }}>Scan Frequency Over 14 Days</h2>
            <p style={{ fontSize: '15px', color: '#718096', margin: 0 }}>Consistency is key to tracking your skin health progress.</p>
          </div>
        </div>
        
        <div style={{ height: '400px', width: '100%' }}>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(30,58,95,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 13, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 13, fontWeight: 600}} />
                <Tooltip 
                  cursor={{ fill: 'rgba(30,58,95,0.04)' }}
                  contentStyle={{ background: '#1E3A5F', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 800 }}
                  labelStyle={{ color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="scans" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {trendData.map((entry, index) => {
                    const COLORS = [
                      '#38bdf8', '#8b5cf6', '#f43f5e', '#fbbf24', '#22c55e', 
                      '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#a855f7', 
                      '#60a5fa', '#34d399', '#fb7185', '#3b82f6', '#4ade80'
                    ];
                    return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#718096', fontSize: '16px', fontWeight: 500 }}>
              No scan data available for this period.
            </div>
          )}
        </div>
      </div>

      {/* Simplified Recent Scans List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#1E3A5F', margin: 0 }}>Recent Records</h2>
          <button onClick={() => onNavigate('history')} style={{ background: 'none', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}>
            View Full History <ArrowRight size={16} />
          </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {scans.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#FFFFFF', borderRadius: '24px', border: '1px dashed rgba(30,58,95,0.15)', color: '#718096' }}>
              Start your first scan to see history here.
            </div>
          ) : (
            scans.slice(-3).reverse().map((scan, i) => (
              <div key={i} style={{ 
                background: '#FFFFFF', borderRadius: '20px', padding: '20px 28px',
                border: '1px solid rgba(30,58,95,0.06)', boxShadow: '0 2px 12px rgba(30,58,95,0.02)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EFF9FF', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A5F', margin: '0 0 4px 0' }}>{scan.result?.disease || scan.disease}</h4>
                    <p style={{ fontSize: '14px', color: '#718096', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} /> {new Date(scan.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ 
                    padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 800,
                    background: scan.result?.severity === 'High' ? '#FFF1F3' : '#F0FDF4',
                    color: scan.result?.severity === 'High' ? '#f43f5e' : '#22c55e'
                  }}>
                    {scan.result?.severity || 'Normal'}
                  </span>
                  <button onClick={() => onNavigate('history')} style={{
                    padding: '10px 20px', borderRadius: '12px', background: '#F8FAFC',
                    color: '#1E3A5F', border: '1px solid rgba(30,58,95,0.1)', cursor: 'pointer',
                    fontWeight: 700, transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                  onMouseLeave={e => e.currentTarget.style.background = '#F8FAFC'}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
