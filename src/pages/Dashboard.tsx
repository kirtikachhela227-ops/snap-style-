import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { useAuth } from '../services/AuthContext';
import { Outfit } from '../types';
import { Plus, Shirt, DollarSign, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = storage.getSuggestions();
    setSuggestions(data);
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Hello, {user?.name}!</h1>
          <p className="text-gray-500 font-medium">Here are some fresh outfit suggestions for you today.</p>
          {user?.id === 'guest_user' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-bold flex items-center gap-2 w-fit">
              <Sun size={14} className="shrink-0" />
              <span>Guest Mode: Your data will be saved locally for this session.</span>
              <Link to="/auth" className="underline ml-2 hover:text-amber-800">Sign in to save permanently</Link>
            </div>
          )}
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2 w-fit group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          <span>New Outfit</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {suggestions.map((outfit) => (
          <div key={outfit.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group flex flex-col">
            {outfit.imageUrl && (
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={outfit.imageUrl || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800'} 
                  alt={outfit.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
                      {outfit.occasion}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 ${
                      outfit.time === 'Day' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {outfit.time === 'Day' ? <Sun size={10} /> : <Moon size={10} />}
                      {outfit.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{outfit.name}</h3>
                </div>
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                  <Shirt size={24} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl border border-transparent group-hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Top</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{outfit.top}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-transparent group-hover:border-indigo-100 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Bottom</p>
                  <p className="text-sm font-bold text-gray-700 truncate">{outfit.bottom}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Price</p>
                    <p className="text-lg font-black text-gray-900 leading-none">₹{outfit.price.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Footwear</p>
                  <p className="text-sm font-bold text-gray-700 leading-none">{outfit.footwear}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
