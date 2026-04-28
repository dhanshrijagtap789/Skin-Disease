import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, Filter, 
  Calendar, ShieldCheck, Trash2, 
  ChevronRight, ExternalLink, Activity,
  Clock, FilterX
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function HistoryPage({ onBack, onNavigate }: { onBack: () => void, onNavigate: (p: string, data?: any) => void }) {
  const [scans, setScans] = useState<any[]>([]);
  const [filter, setFilter] = useState('All');
  const { addToast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/scans', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setScans(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredScans = useMemo(() => {
    return scans.filter(s => {
      return filter === 'All' || s.result?.severity === filter;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [scans, filter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove this analysis from your history?')) return;
    try {
      const res = await fetch(`/api/scans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        addToast('Analysis removed from history', 'info');
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="history-container" style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '48px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '24px' }}>
          <ArrowLeft size={18} /> Return to Dashboard
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px' }}>
              Your Skin <span className="text-gradient">Timeline</span>
            </h1>
            <p style={{ fontSize: '18px', color: 'var(--text-gray)', fontWeight: '500' }}>
              Tracking {scans.length} analysis records since you joined.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-4 items-center justify-end" style={{ marginBottom: '40px' }}>
        <div style={{ width: '180px' }}>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
            style={{ borderRadius: '18px', height: '56px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
          >
            <option value="All">All Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {filteredScans.length === 0 ? (
        <div className="card text-center" style={{ padding: '100px', border: '2px dashed rgba(255,255,255,0.05)', background: 'transparent' }}>
          <div className="stats-icon-wrapper bg-blue-light" style={{ width: '80px', height: '80px', margin: '0 auto 24px' }}>
            <FilterX size={40} />
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>No records found</h3>
          <p style={{ color: 'var(--text-gray)' }}>Try adjusting your filters or start a new scan.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {filteredScans.map((scan) => (
            <div key={scan._id} className="card history-card-item" style={{ overflow: 'hidden', padding: 0, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)', transition: 'all 0.3s' }}>
              <div 
                className="image-preview-header" 
                style={{ 
                  height: '240px', 
                  width: '100%', 
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={() => onNavigate('result', scan)}
              >
                <img src={scan.image} alt="Scan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
                <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                   <div className="tag" style={{ background: scan.result?.severity === 'High' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)', color: scan.result?.severity === 'High' ? '#f87171' : '#4ade80', backdropFilter: 'blur(10px)', border: '1px solid currentColor', fontSize: '10px', textTransform: 'uppercase', fontWeight: '800' }}>
                      {scan.result?.severity || 'Normal'}
                   </div>
                </div>
                <div style={{ position: 'absolute', bottom: '16px', left: '16px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px', fontWeight: '700' }}>
                      <Calendar size={14} className="text-primary" />
                      {new Date(scan.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                   </div>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>{scan.result?.disease || scan.disease}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: '1.6', height: '44px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '24px' }}>
                  {scan.result?.details || 'Diagnostic information captured by AI analysis engine during your selection process.'}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                   <button 
                    onClick={() => onNavigate('result', scan)}
                    className="button-text"
                    style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', padding: 0 }}
                   >
                     View Report <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                   </button>
                   <button 
                    onClick={() => handleDelete(scan._id)}
                    className="button-icon"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: 'none', width: '36px', height: '36px' }}
                    title="Remove Record"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
