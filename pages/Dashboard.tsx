import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { Outfit } from '../types';
import { Plus, Heart, Shirt, DollarSign, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = storage.getOutfits();
    setOutfits(data);
    setLoading(false);
  }, []);

  const stats = [
    { label: 'Total Outfits', value: outfits.length, icon: Shirt, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Favorites', value: outfits.filter(o => o.is_favorite).length, icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Avg. Cost/Wear', value: `$${(outfits.reduce((acc, o) => acc + (o.price / o.times_worn), 0) / (outfits.length || 1)).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back!</h1>
          <p className="text-gray-500 font-medium">Your smart wardrobe is ready for today.</p>
        </div>
        <Link
          to="/create"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2 w-fit"
        >
          <Plus size={20} />
          <span>New Outfit</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <stat.icon size={32} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-gray-900 leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent Outfits</h2>
            <Link to="/history" className="text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              <span>View All</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          
          {outfits.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-400 font-medium">No outfits saved yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {outfits.slice(0, 3).map((outfit) => (
                <div key={outfit.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl hover:bg-indigo-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Shirt size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 leading-none mb-1">{outfit.name}</h4>
                      <p className="text-xs font-bold text-gray-400">{outfit.occasion}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-indigo-600">${(outfit.price / outfit.times_worn).toFixed(2)}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cost/Wear</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-xl shadow-indigo-200 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight mb-4">Plan Your Week</h2>
            <p className="text-indigo-100 font-medium mb-8 leading-relaxed">
              Schedule your outfits for upcoming weddings, parties, or college events to stay organized.
            </p>
            <Link
              to="/events"
              className="bg-white text-indigo-600 font-black px-8 py-4 rounded-2xl inline-flex items-center gap-2 hover:bg-indigo-50 transition-colors"
            >
              <Calendar size={20} />
              <span>Go to Planner</span>
            </Link>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 transform rotate-12">
            <Calendar size={240} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
