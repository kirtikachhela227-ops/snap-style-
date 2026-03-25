import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Calendar } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/create', label: 'Create Outfit', icon: PlusCircle },
    { path: '/history', label: 'History', icon: History },
    { path: '/events', label: 'Events', icon: Calendar },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:relative md:border-t-0 md:border-r md:h-screen md:w-64 md:flex-col md:py-8">
      <div className="hidden md:block mb-10 px-4">
        <h1 className="text-2xl font-bold text-indigo-600">StyleSnap</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-semibold">Smart Planner</p>
      </div>

      <div className="flex justify-around md:flex-col md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-xl transition-all md:flex-row md:gap-3 md:px-4 md:py-3 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 md:text-sm md:mt-0">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
