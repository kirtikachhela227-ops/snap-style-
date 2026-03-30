import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { useAuth } from '../services/AuthContext';
import { Outfit } from '../types';
import { Shirt, DollarSign, Search, Sun, Moon, Trash2, Filter } from 'lucide-react';
import Layout from '../components/Layout';

const SavedOutfits: React.FC = () => {
  const { user } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOccasion, setFilterOccasion] = useState('All');

  const occasions = ['All', 'College', 'Party', 'Casual', 'Wedding'];

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setLoading(true);
        const data = await storage.getSavedOutfits(user.id);
        setOutfits(data);
        setFilteredOutfits(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    let result = outfits;
    if (filterOccasion !== 'All') {
      result = result.filter(o => o.occasion === filterOccasion);
    }
    setFilteredOutfits(result);
  }, [filterOccasion, outfits]);

  const handleDelete = async (id: string) => {
    try {
      await storage.deleteOutfit(id);
      const updated = outfits.filter(o => o.id !== id);
      setOutfits(updated);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Saved Outfits</h1>
          <p className="text-gray-500 font-medium">Your personal collection of styled looks.</p>
        </div>

        <div className="flex flex-wrap gap-4 bg-white p-3 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-gray-100">
            <Filter size={16} className="text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">Filter by Occasion</span>
          </div>
          <div className="flex gap-2">
            {occasions.map(o => (
              <button
                key={o}
                type="button"
                onClick={() => setFilterOccasion(o)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterOccasion === o
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredOutfits.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No outfits found</h3>
          <p className="text-gray-500 font-medium">Try adjusting your filters or create a new outfit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOutfits.map((outfit) => (
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
                  <button
                    type="button"
                    onClick={() => handleDelete(outfit.id)}
                    className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Top</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{outfit.top}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Color</p>
                    <p className="text-sm font-bold text-gray-700 leading-none">{outfit.color}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default SavedOutfits;
