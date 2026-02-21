
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/vault', icon: 'dry_cleaning', label: 'Outfit Vault' },
    { path: '/analysis', icon: 'auto_awesome', label: 'AI Feedback' },
    { path: '/moodboard', icon: 'palette', label: 'Moodboards' },
    { path: '/analytics', icon: 'insights', label: 'Style Analytics' },
    { path: '/planner', icon: 'calendar_today', label: 'Planner' },
  ];

  return (
    <aside className="w-64 border-r border-border-subtle bg-white flex flex-col fixed h-full z-40 hidden md:flex">
      <div className="p-8 flex items-center gap-3">
        <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <span className="material-icons-round text-xl">auto_awesome</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-neutral-text uppercase">SNAP STYLE</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? 'bg-primary text-white shadow-soft shadow-primary/30' 
                : 'hover:bg-primary-light text-neutral-muted hover:text-primary'}
            `}
          >
            <span className="material-icons-round text-[22px]">{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
          </NavLink>
        ))}
        
        <div className="pt-10 pb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-neutral-muted/60">
          Preferences
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-primary-light text-neutral-muted hover:text-primary">
          <span className="material-icons-round text-[22px]">settings</span>
          <span className="font-semibold text-sm">Settings</span>
        </button>
      </nav>

      <div className="p-5 m-4 rounded-2xl bg-primary-light border border-primary/10">
        <p className="text-sm font-bold text-primary mb-1">Upgrade to Pro</p>
        <p className="text-[11px] text-neutral-muted mb-4 leading-relaxed">Unlimited AI feedback and exclusive styling sessions.</p>
        <button className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm">Upgrade Now</button>
        
        <a 
          href="https://github.com/kirtikachhela227-ops/SNAP-STYLE" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-primary/60 hover:text-primary transition-colors uppercase tracking-widest"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          View Source
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
