import React, { useEffect, useState } from 'react';
import {
  Search, Filter, MoreVertical,
  History, Mail, ShieldAlert,
  ChevronRight, Trash2, Edit3,
  Activity
} from 'lucide-react';

export default function AdminUsers({ onNavigate }: { onNavigate: (page: string, data?: any) => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [scans, setScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const [usersRes, scansRes] = await Promise.all([
          fetch('/api/admin/users', { headers }),
          fetch('/api/admin/scans', { headers })
        ]);
        const usersData = await usersRes.json();
        const scansData = await scansRes.json();
        setUsers(usersData || []);
        setScans(scansData || []);
      } catch (err) {
        console.error("Admin data synchronization failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const viewScanHistory = (user: any) => {
    onNavigate('admin-scan-history', user._id || user.id);
  };

  return (
    <div className="admin-container" style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px', color: '#1E3A5F' }}>
          User <span className="text-gradient">Records</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500' }}>
          Detailed oversight of patient activity and diagnostic history.
        </p>
      </div>

      <div className="card" style={{ padding: '32px', borderRadius: '32px', background: '#fff', border: '1px solid rgba(30,58,95,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E3A5F' }}>Member Directory</h3>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '12px 12px 12px 48px', borderRadius: '16px', border: '1px solid #e2e8f0', width: '280px', outline: 'none', color: '#1E3A5F' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Full Name</th>
                <th style={{ textAlign: 'left', padding: '16px 20px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Email</th>
                <th style={{ textAlign: 'center', padding: '16px 20px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Scan History</th>
                <th style={{ textAlign: 'right', padding: '16px 20px', color: '#64748b', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ padding: '100px', textAlign: 'center' }}>
                    <Activity className="animate-spin text-primary" size={32} style={{ margin: '0 auto' }} />
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id || user.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '16px 20px' }}>
                      <div className="flex items-center gap-4">
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', fontSize: '16px', fontWeight: '900', background: 'rgba(30,58,95,0.05)', color: '#1E3A5F', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '800', color: '#1E3A5F', fontSize: '15px' }}>{user.name}</p>
                          <p style={{ fontSize: '12px', color: '#64748b' }}>Since {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px' }}>{user.email}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => viewScanHistory(user)}
                        disabled={scans.filter(s => s.userId?._id === user._id || s.userId === user._id).length === 0}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          background: '#fff',
                          color: '#1E3A5F',
                          fontSize: '13px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s',
                          opacity: scans.filter(s => s.userId?._id === user._id || s.userId === user._id).length === 0 ? 0.4 : 1
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#1E3A5F'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <History size={16} /> What they scan
                      </button>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer' }}><MoreVertical size={20} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
