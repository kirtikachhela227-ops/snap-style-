import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Bookmark, LogOut, Shirt } from 'lucide-react';
import { storage } from '../services/storage';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = storage.getCurrentUser();

  const handleLogout = () => {
    storage.logout();
    navigate('/auth');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/create', label: 'Create Outfit', icon: PlusCircle },
    { path: '/saved', label: 'Saved Outfits', icon: Bookmark },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 md:relative md:border-t-0 md:border-r md:h-screen md:w-64 md:flex-col md:py-8 md:px-6 z-50">
      <div className="hidden md:flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Shirt size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 leading-none">StyleSnap</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Outfit Planner</p>
        </div>
      </div>

      <div className="flex justify-around md:flex-col md:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-2xl transition-all md:flex-row md:gap-3 md:px-4 md:py-3.5 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50 font-bold'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 md:text-sm md:mt-0">{item.label}</span>
            </Link>
          );
        })}
        
        <button
          onClick={handleLogout}
          className="flex flex-col items-center p-2 rounded-2xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all md:flex-row md:gap-3 md:px-4 md:py-3.5 md:mt-auto"
        >
          <LogOut size={20} />
          <span className="text-[10px] mt-1 md:text-sm md:mt-0">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
