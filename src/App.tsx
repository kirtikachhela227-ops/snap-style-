import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { storage } from './services/storage';
import Dashboard from './pages/Dashboard';
import CreateOutfit from './pages/CreateOutfit';
import SavedOutfits from './pages/SavedOutfits';
import Auth from './pages/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/auth" element={!user ? <Auth onLogin={setUser} /> : <Navigate to="/" />} />
        
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/create" element={user ? <CreateOutfit /> : <Navigate to="/auth" />} />
        <Route path="/saved" element={user ? <SavedOutfits /> : <Navigate to="/auth" />} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
