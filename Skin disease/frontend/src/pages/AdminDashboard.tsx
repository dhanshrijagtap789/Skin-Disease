import React, { useEffect, useState, useMemo } from 'react';
import { 
  Users, Activity, ShieldCheck, 
  Package, LayoutGrid, TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        const [statsRes, usersRes] = await Promise.all([
          fetch('/api/admin/stats', { headers }),
          fetch('/api/admin/users', { headers })
        ]);
        const statsData = await statsRes.json();
        const usersData = await usersRes.json();
        setStats(statsData);
        setUsers(usersData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const trendData = useMemo(() => {
    if (!users || users.length === 0) return [];
    
    const grouped: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      grouped[dateStr] = 0;
    }

    // Populate data
    users.forEach(u => {
      const dateObj = new Date(u.createdAt);
      const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (grouped[dateStr] !== undefined) {
        grouped[dateStr] += 1;
      }
    });

    return Object.keys(grouped).map(k => ({ date: k, users: grouped[k] }));
  }, [users]);

  const cards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#2563EB', bg: '#EBF5FF' },
    { title: 'Total Scans', value: stats?.totalScans || 0, icon: ShieldCheck, color: '#DB2777', bg: '#FDF2F8' },
    { title: 'Total Products', value: 14, icon: Package, color: '#16A34A', bg: '#F0FDF4' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
         <div className="card" style={{ padding: '40px', width: '300px', borderRadius: '32px', textAlign: 'center', background: '#fff' }}>
            <Activity className="animate-spin text-primary" size={32} style={{ margin: '0 auto 16px' }} />
            <p style={{ fontWeight: '800', color: '#1E3A5F' }}>Synchronizing Portal...</p>
         </div>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{ maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '8px', color: '#1E3A5F' }}>
          Welcome back, <span className="text-primary">{user?.name || 'Admin'}</span>
        </h1>
        <p style={{ fontSize: '18px', color: '#64748b', fontWeight: '500' }}>
          Platform metrics and user registration overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {cards.map((card, i) => (
          <div key={i} className="card" style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', borderRadius: '32px', background: '#FFF' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <card.icon size={30} />
            </div>
            <div>
              <p style={{ marginBottom: '4px', fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>{card.title}</p>
              <p style={{ fontSize: '28px', fontWeight: '900', color: '#1E3A5F' }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="card" style={{ padding: '40px', borderRadius: '32px', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
           <div>
              <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1E3A5F', marginBottom: '4px' }}>User Registration trend</h3>
              <p style={{ color: '#64748b', fontSize: '15px' }}>Growth frequency over the last 14 days.</p>
           </div>
           <div className="tag tag-primary" style={{ padding: '8px 16px' }}>
              <TrendingUp size={16} /> +12% Growth
           </div>
        </div>

        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '12px' }}
              />
              <Bar dataKey="users" radius={[6, 6, 0, 0]}>
                {trendData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === trendData.length - 1 ? '#C8923A' : '#1E3A5F'} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
