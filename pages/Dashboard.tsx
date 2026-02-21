
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Outfit } from '../types';

interface DashboardProps {
  outfits: Outfit[];
}

const Dashboard: React.FC<DashboardProps> = ({ outfits }) => {
  const navigate = useNavigate();

  return (
    <div className="page-container p-6 lg:p-10 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-primary p-10 rounded-[2rem] text-white shadow-soft shadow-primary/20 flex flex-col justify-between min-h-[260px] relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          <div className="relative z-10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-70 mb-3">Overall Style Index</h3>
            <p className="text-6xl font-bold tracking-tighter">88<span className="text-xl font-medium opacity-50 ml-1">/100</span></p>
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl text-[11px] font-bold mb-4">
              <span className="material-icons-round text-xs">trending_up</span>
              +12% vs last month
            </div>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              You're in the elite top <span className="font-bold">5% of curators</span> globally this week!
            </p>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2rem] border border-border-subtle shadow-card flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-muted mb-6">Archive Metrics</h3>
            <div className="space-y-5">
              {[
                { label: 'Vault Items', val: outfits.length, icon: 'inventory_2', path: '/vault' },
                { label: 'Critiques Done', val: 14, icon: 'auto_awesome', path: '/analysis' },
                { label: 'Moodboards', val: 3, icon: 'palette', path: '/moodboard' },
              ].map((stat, i) => (
                <div 
                  key={i} 
                  onClick={() => navigate(stat.path)}
                  className="flex justify-between items-center group cursor-pointer hover:bg-background-alt p-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-icons-round text-primary text-xl opacity-60 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                    <span className="text-sm font-semibold text-neutral-text">{stat.label}</span>
                  </div>
                  <span className="font-bold text-lg text-primary">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => navigate('/analytics')}
            className="text-primary text-sm font-bold flex items-center gap-1.5 hover:gap-3 transition-all active:translate-x-1"
          >
            Full Analytics <span className="material-icons-round text-lg">east</span>
          </button>
        </div>

        <div className="bg-white p-10 rounded-[2rem] border border-border-subtle shadow-card flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-muted mb-4">Upcoming Logic</h3>
            <p className="text-2xl font-bold text-neutral-text mb-1 tracking-tight">Executive Meeting</p>
            <p className="text-xs text-neutral-muted mb-6 flex items-center gap-1.5 font-medium">
              <span className="material-icons-round text-sm text-primary opacity-60">calendar_today</span> Tomorrow, 10:00 AM
            </p>
          </div>
          <button 
            onClick={() => navigate('/analysis')}
            className="w-full py-4 bg-primary-light text-primary font-bold rounded-2xl text-xs uppercase tracking-widest border border-primary/10 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-[0.98]"
          >
            Simulate Outfit
          </button>
        </div>
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-neutral-text">Recently Curated</h3>
          <button 
            onClick={() => navigate('/vault')}
            className="text-primary text-xs font-bold uppercase tracking-widest hover:underline"
          >
            View Entire Vault
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {outfits.slice(0, 6).map(o => (
            <div 
              key={o.id} 
              onClick={() => navigate('/vault')}
              className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-subtle group cursor-pointer relative shadow-card"
            >
              <img src={o.imageUrl} alt={o.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-primary/20">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest">{o.rating} Rating</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
