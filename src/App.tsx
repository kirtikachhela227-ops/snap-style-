import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './services/AuthContext';
import Dashboard from './pages/Dashboard';
import CreateOutfit from './pages/CreateOutfit';
import SavedOutfits from './pages/SavedOutfits';
import Auth from './pages/Auth';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

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
