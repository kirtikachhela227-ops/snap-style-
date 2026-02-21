
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Outfit } from './types';
import { INITIAL_OUTFITS } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import OutfitVault from './pages/OutfitVault';
import AIFeedback from './pages/AIFeedback';
import Moodboard from './pages/Moodboard';
import Analytics from './pages/Analytics';

const App: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>(INITIAL_OUTFITS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveOutfit = (newOutfit: Outfit) => {
    setOutfits(prev => [newOutfit, ...prev]);
  };

  const handleUpdateOutfit = (id: string, updates: Partial<Outfit>) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-background-main font-display selection:bg-primary/10 selection:text-primary">
        <Sidebar />
        <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
          <Header 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Routes>
              <Route path="/dashboard" element={<Dashboard outfits={outfits} />} />
              <Route path="/vault" element={<OutfitVault outfits={outfits} searchQuery={searchQuery} onUpdateOutfit={handleUpdateOutfit} />} />
              <Route path="/analysis" element={<AIFeedback onSaveOutfit={handleSaveOutfit} />} />
              <Route path="/moodboard" element={<Moodboard />} />
              <Route path="/analytics" element={<Analytics outfits={outfits} />} />
              <Route path="/planner" element={<div className="p-10 text-center text-neutral-muted">Weekly Planner coming soon...</div>} />
              <Route path="/" element={<Navigate to="/vault" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
