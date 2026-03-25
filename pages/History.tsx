import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { Outfit } from '../types';
import { Heart, Shirt, DollarSign, Search } from 'lucide-react';
import Layout from '../components/Layout';

const History: React.FC = () => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOccasion, setFilterOccasion] = useState('All');
  const [filterColor, setFilterColor] = useState('All');

  const colors = ['All', 'Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Beige', 'Grey'];
  const occasions = ['All', 'College', 'Party', 'Wedding', 'Casual'];

  useEffect(() => {
    const data = storage.getOutfits();
    setOutfits(data);
    setFilteredOutfits(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let result = outfits;
    if (filterOccasion !== 'All') {
      result = result.filter(o => o.occasion === filterOccasion);
    }
    if (filterColor !== 'All') {
      result = result.filter(o => o.color === filterColor);
    }
    setFilteredOutfits(result);
  }, [filterOccasion, filterColor, outfits]);

  const toggleFavorite = (id: string, currentStatus: boolean) => {
    storage.updateOutfit(id, { is_favorite: !currentStatus });
    setOutfits(outfits.map(o => o.id === id ? { ...o, is_favorite: !currentStatus } : o));
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Outfit History</h1>
          <p className="text-gray-500 font-medium">Browse and filter your smart wardrobe.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Occasion</label>
            <select
              value={filterOccasion}
              onChange={(e) => setFilterOccasion(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {occasions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Color</label>
            <select
              value={filterColor}
              onChange={(e) => setFilterColor(e.target.value)}
              className="bg-white border border-gray-100 rounded-xl py-2 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {colors.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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
            <div key={outfit.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block">
                      {outfit.occasion}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{outfit.name}</h3>
                  </div>
                  <button
                    onClick={() => toggleFavorite(outfit.id, outfit.is_favorite)}
                    className={`p-3 rounded-2xl transition-all ${
                      outfit.is_favorite ? 'bg-pink-50 text-pink-600' : 'bg-gray-50 text-gray-300 hover:text-pink-400'
                    }`}
                  >
                    <Heart size={20} fill={outfit.is_favorite ? 'currentColor' : 'none'} />
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
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">Cost/Wear</p>
                      <p className="text-lg font-black text-gray-900 leading-none">${(outfit.price / outfit.times_worn).toFixed(2)}</p>
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

export default History;
