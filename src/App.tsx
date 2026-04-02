import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import { Shirt } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import CreateOutfit from './pages/CreateOutfit';
import SavedOutfits from './pages/SavedOutfits';
import Auth from './pages/Auth';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [showBypass, setShowBypass] = React.useState(false);

  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setShowBypass(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-600 text-white p-6 text-center">
        <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse">
          <Shirt size={44} />
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">StyleSnap</h1>
        <p className="text-indigo-100 font-medium animate-pulse mb-8">Styling your experience...</p>
        
        {showBypass && (
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all animate-in"
          >
            Taking too long? Refresh
          </button>
        )}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/create" element={user ? <CreateOutfit /> : <Navigate to="/auth" />} />
        <Route path="/saved" element={user ? <SavedOutfits /> : <Navigate to="/auth" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
