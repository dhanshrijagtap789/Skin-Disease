import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, PieChart, 
  History, User, LogOut, 
  Menu, PlusCircle, ShoppingBag, Calendar
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import UploadPage from './pages/UploadPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import RoutinePage from './pages/RoutinePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import AdminScanHistory from './pages/AdminScanHistory';

const Sidebar = ({ currentPage, onNavigate, user, onLogout }: any) => {
  const menuItems = user?.role === 'admin' ? [
    { id: 'admin-dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'admin-users', label: 'User Records', icon: Users },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'upload', label: 'New Scan', icon: PlusCircle },
    { id: 'history', label: 'History', icon: History },
    { id: 'routine', label: 'Routine', icon: Calendar },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">
          <ShieldCheck size={24} />
        </div>
        <span className="logo-text">Cure<span style={{ color: '#4CAF72' }}>Skin</span></span>
      </div>

      <nav className="nav-list">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini">
          <div className="user-mini-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
          <div className="user-mini-info">
            <p className="font-bold" style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#999', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>
        <div className="nav-item logout-item" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

function App() {
  const { user, token, logout, loading } = useAuth();
  
  // Persistence logic for current page and active result
  const [currentPage, setCurrentPage] = useState(() => {
     return localStorage.getItem('currentPage') || 'landing';
  });
  
  const [currentResult, setCurrentResult] = useState<any>(() => {
     const saved = localStorage.getItem('currentResult');
     return saved ? JSON.parse(saved) : null;
  });

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [navigationStack, setNavigationStack] = useState<string[]>([]);

  // Effect to persist selection whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    if (currentResult) {
       localStorage.setItem('currentResult', JSON.stringify(currentResult));
    } else {
       localStorage.removeItem('currentResult');
    }
  }, [currentPage, currentResult]);

  // Auth redirect logic: If user is logged in but on landing/login, move to dashboard
  useEffect(() => {
    if (!loading && user) {
       if (currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup') {
          setCurrentPage(user.role === 'admin' ? 'admin-dashboard' : 'dashboard');
       }
    } else if (!loading && !user) {
       // If no user but on a protected page, back to landing
       const protectedPages = ['dashboard', 'admin-dashboard', 'upload', 'result', 'history', 'routine', 'products', 'profile'];
       const publicPages = ['landing', 'login', 'signup', 'about'];
       if (protectedPages.includes(currentPage)) {
          setCurrentPage('landing');
       }
    }
  }, [user, loading]);

  const handleNavigate = (page: string, data?: any) => {
    if (data !== undefined) {
      if (page === 'result') setCurrentResult(data);
    }
    if (page !== currentPage) {
      setNavigationStack(prev => [...prev, currentPage]);
      setCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (navigationStack.length > 0) {
      const prevPage = navigationStack[navigationStack.length - 1];
      setNavigationStack(prev => prev.slice(0, -1));
      setCurrentPage(prevPage);
    } else {
      setCurrentPage('dashboard');
    }
    window.scrollTo(0, 0);
  };

  const handleScanComplete = (result: any) => {
    setCurrentResult(result);
    setCurrentPage('result');
  };

  if (loading) return <div className="card text-center" style={{ margin: '100px auto', width: '200px' }}>Loading...</div>;

  // Render logic based on auth status
  if (currentPage === 'landing') {
    return (
      <LandingPage 
        onStart={() => setCurrentPage('signup')} 
        onLogin={() => setCurrentPage('login')}
        onAbout={() => setCurrentPage('about')}
      />
    );
  }

  if (currentPage === 'about') {
    return (
      <AboutPage
        onBack={() => setCurrentPage('landing')}
        onLogin={() => setCurrentPage('login')}
        onStart={() => setCurrentPage('signup')}
      />
    );
  }

  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <AuthPage 
        onBack={() => setCurrentPage('landing')} 
        onSuccess={() => setCurrentPage(user?.role === 'admin' ? 'admin-dashboard' : 'dashboard')}
        defaultIsLogin={currentPage === 'login'} 
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <Dashboard onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-users':
        return (
          <AdminUsers 
            onNavigate={(page, data) => {
              if (page === 'admin-scan-history' && data) {
                setSelectedUserId(data);
              }
              handleNavigate(page);
            }} 
          />
        );
      case 'admin-scan-history':
        return (
          <AdminScanHistory 
            userId={selectedUserId || ''} 
            onBack={() => handleNavigate('admin-users')} 
            onViewScan={(scan) => {
              setCurrentResult(scan);
              handleNavigate('result');
            }}
          />
        );
      case 'upload':
        return <UploadPage onScanComplete={handleScanComplete} onBack={handleBack} onNavigate={handleNavigate} />;
      case 'result':
        return (
          <ResultPage 
            result={currentResult} 
            onBack={() => {
              if (user?.role === 'admin') {
                handleNavigate('admin-scan-history', selectedUserId);
              } else {
                handleBack();
              }
            }} 
            onNavigate={handleNavigate} 
          />
        );
      case 'history':
        return <HistoryPage onBack={handleBack} onNavigate={handleNavigate} />;
      case 'routine':
        return <RoutinePage result={currentResult} onBack={handleBack} onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onBack={handleBack} onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onBack={handleBack} onNavigate={handleNavigate} />;
      default:
        return user?.role === 'admin' ? <AdminDashboard /> : <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user}
        onLogout={() => {
          logout();
          setCurrentPage('landing');
        }}
      />
      
      <main className="main-content">
        <div className="container">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
