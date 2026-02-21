
import React, { useState } from 'react';
import { Outfit, OutfitStatus } from '../types';
import OutfitCard from '../components/OutfitCard';

interface OutfitVaultProps {
  outfits: Outfit[];
  searchQuery: string;
  onUpdateOutfit: (id: string, updates: Partial<Outfit>) => void;
}

const OutfitVault: React.FC<OutfitVaultProps> = ({ outfits, searchQuery, onUpdateOutfit }) => {
  const [filter, setFilter] = useState<OutfitStatus>('worked_well');

  const filteredOutfits = outfits.filter(o => 
    (searchQuery === '' || o.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
    o.status === filter
  );

  const categories = [
    { id: 'worked_well', label: 'Worked Well' },
    { id: 'needs_improvement', label: 'Needs Improvement' },
    { id: 'saved', label: 'Saved for Later' }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-8 lg:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-1.5 p-1.5 bg-background-alt rounded-2xl border border-border-subtle overflow-x-auto max-w-full no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as OutfitStatus)}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap uppercase tracking-widest ${
                filter === cat.id 
                  ? 'bg-primary text-white shadow-soft' 
                  : 'text-neutral-muted hover:text-primary hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs font-bold text-neutral-muted hover:border-primary/40 transition-all shadow-card">
            <span className="material-icons-round text-lg text-primary">tune</span>
            <span>Seasonality</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border-subtle rounded-xl text-xs font-bold text-neutral-muted hover:border-primary/40 transition-all shadow-card">
            <span className="material-icons-round text-lg text-primary">sort</span>
            <span>Latest</span>
          </button>
        </div>
      </div>

      <div className="p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 overflow-y-auto custom-scrollbar flex-1">
        {filteredOutfits.map((outfit) => (
          <OutfitCard 
            key={outfit.id} 
            outfit={outfit} 
            onLike={() => onUpdateOutfit(outfit.id, { liked: !outfit.liked })}
            onUpdateStatus={(newStatus) => onUpdateOutfit(outfit.id, { status: newStatus })}
          />
        ))}
        {filteredOutfits.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-background-alt rounded-[2rem] flex items-center justify-center text-neutral-muted mb-6">
              <span className="material-icons-round text-4xl">inventory_2</span>
            </div>
            <h3 className="text-xl font-bold text-neutral-text">No archived items found in this category</h3>
            <p className="text-sm text-neutral-muted max-w-xs mt-2 font-medium">Try adjusting your filters or start a new AI critique session.</p>
          </div>
        )}
      </div>

      <footer className="p-8 border-t border-border-subtle flex items-center justify-between bg-background-alt/50 backdrop-blur">
        <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-[0.2em]">
          Record Count: <span className="text-primary">{filteredOutfits.length}</span> / {outfits.length}
        </p>
        <div className="flex gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle bg-white hover:bg-primary-light hover:text-primary transition-all shadow-sm">
            <span className="material-icons-round">chevron_left</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-soft">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-subtle bg-white hover:bg-primary-light hover:text-primary transition-all shadow-sm">
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default OutfitVault;
