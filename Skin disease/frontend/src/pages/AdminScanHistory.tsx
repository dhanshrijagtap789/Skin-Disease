import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, Calendar, ShieldCheck, 
  ChevronRight, Activity, Search
} from 'lucide-react';

export default function AdminScanHistory({ userId, onBack, onViewScan }: { userId: string, onBack: () => void, onViewScan: (scan: any) => void }) {
  const [scans, setScans] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const [scansRes, usersRes] = await Promise.all([
          fetch('/api/admin/scans', { headers }),
          fetch('/api/admin/users', { headers })
        ]);
        const allScans = await scansRes.json();
        const allUsers = await usersRes.json();
        
        const userScans = allScans.filter((s: any) => s.userId?._id === userId || s.userId === userId);
        const userData = allUsers.find((u: any) => u._id === userId || u.id === userId);
        
        setScans(userScans);
        setUser(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="card" style={{ padding: '40px', width: '300px', borderRadius: '32px', textAlign: 'center', background: '#fff' }}>
            <Activity className="animate-spin text-primary" size={32} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontWeight: '800', color: '#1E3A5F' }}>Fetching History...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '40px' }}>
        <button onClick={onBack} className="back-link" style={{ marginBottom: '12px' }}>
          <ArrowLeft size={18} /> User Records
        </button>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', color: '#1E3A5F' }}>
          {user?.name}'s <span className="text-gradient">Scan History</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500' }}>
          Timeline of all clinical diagnostic reports for this user.
        </p>
      </div>

      {scans.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
          {scans.map((scan, i) => (
            <div 
              key={i} 
              className="card" 
              onClick={() => onViewScan(scan)}
              style={{ 
                padding: '16px', 
                borderRadius: '24px', 
                cursor: 'pointer', 
                transition: 'all 0.3s',
                border: '1px solid #f1f5f9',
                background: '#fff',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(30, 58, 95, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f1f5f9';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
                <img src={scan.image} alt="Diagnosis" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ padding: '0 8px 8px' }}>
                <div className="flex justify-between items-start mb-2">
                  <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1E3A5F' }}>{scan.result?.disease}</h3>
                  <div className="stats-icon-wrapper bg-blue-light" style={{ width: '32px', height: '32px' }}><ChevronRight size={18} /></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', fontWeight: '600' }}>
                  <Calendar size={14} /> {new Date(scan.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '100px', borderRadius: '32px' }}>
          <Activity size={48} style={{ opacity: 0.1, margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '24px', color: '#1E3A5F', fontWeight: '800' }}>No Scans Found</h3>
          <p style={{ color: '#64748b' }}>This user has not performed any diagnostic scans yet.</p>
        </div>
      )}
    </div>
  );
}
