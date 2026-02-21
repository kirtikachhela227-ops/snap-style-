
import React from 'react';
import { Outfit, OutfitStatus } from '../types';

interface OutfitCardProps {
  outfit: Outfit;
  onLike: () => void;
  onUpdateStatus: (status: OutfitStatus) => void;
}

const OutfitCard: React.FC<OutfitCardProps> = ({ outfit, onLike, onUpdateStatus }) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-border-subtle hover:border-primary/30 transition-all duration-300 hover:shadow-soft">
      <div className="aspect-[3/4] relative overflow-hidden bg-background-alt">
        <img 
          alt={outfit.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={outfit.imageUrl}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateStatus('needs_improvement')}
              className="flex-1 bg-white text-neutral-text py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              Improve
            </button>
            <button 
              onClick={() => onUpdateStatus('saved')}
              className="flex-1 bg-white/20 backdrop-blur-md text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white hover:text-neutral-text transition-all shadow-sm"
            >
              Save Later
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onLike(); }}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${outfit.liked ? 'bg-rose-500 text-white' : 'bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-rose-500'}`}
            >
              <span className="material-icons-round text-[20px]">{outfit.liked ? 'favorite' : 'favorite_border'}</span>
            </button>
          </div>
        </div>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur shadow-sm text-primary text-[10px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider border border-primary/10">
          {outfit.rating} Rating
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-neutral-text truncate group-hover:text-primary transition-colors">{outfit.name}</h3>
            <p className="text-[10px] font-medium text-neutral-muted uppercase tracking-tighter">{outfit.date}</p>
          </div>
          <button className="p-1 rounded-lg hover:bg-primary-light text-neutral-muted transition-colors">
            <span className="material-icons-round text-[18px]">more_horiz</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-1 bg-primary-light text-primary text-[10px] font-bold rounded-lg border border-primary/10">{outfit.occasion}</span>
          <span className="px-2 py-1 bg-background-alt text-neutral-muted text-[10px] font-bold rounded-lg border border-border-subtle">{outfit.mood}</span>
        </div>
      </div>
    </div>
  );
};

export default OutfitCard;
