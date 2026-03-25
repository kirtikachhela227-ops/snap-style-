import React, { useState } from 'react';
import { storage } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import { Shirt, DollarSign, Tag, Palette, Save, Sun, Moon, Clock } from 'lucide-react';
import Layout from '../components/Layout';

const CreateOutfit: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const user = storage.getCurrentUser();
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'College' as any,
    time: 'Day' as any,
    top: '',
    bottom: '',
    footwear: '',
    color: '',
    price: 0
  });

  const occasions = ['College', 'Party', 'Casual', 'Wedding'];
  const times = ['Day', 'Night'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    
    try {
      storage.saveOutfit(user.id, formData);
      navigate('/saved');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create New Outfit</h1>
        <p className="text-gray-500 font-medium">Add your personal style to your digital wardrobe.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                <Tag size={14} />
                <span>Outfit Name</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                placeholder="e.g. Blue Wedding Suit"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <Shirt size={14} />
                  <span>Occasion</span>
                </label>
                <select
                  value={formData.occasion}
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none"
                >
                  {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <Clock size={14} />
                  <span>Time of Day</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({ ...formData, time: t as any })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all border ${
                        formData.time === t
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                          : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {t === 'Day' ? <Sun size={18} /> : <Moon size={18} />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Top Wear</label>
                <input
                  type="text"
                  required
                  value={formData.top}
                  onChange={(e) => setFormData({ ...formData, top: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  placeholder="e.g. White Shirt"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Bottom Wear</label>
                <input
                  type="text"
                  required
                  value={formData.bottom}
                  onChange={(e) => setFormData({ ...formData, bottom: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  placeholder="e.g. Blue Trousers"
                />
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Footwear</label>
                <input
                  type="text"
                  required
                  value={formData.footwear}
                  onChange={(e) => setFormData({ ...formData, footwear: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  placeholder="e.g. Brown Brogues"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <div className="space-y-4 mb-8">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                <DollarSign size={14} />
                <span>Price (₹)</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 text-2xl"
                placeholder="0"
              />
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                <Palette size={14} />
                <span>Color Combination</span>
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                placeholder="e.g. Navy & Beige"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-6 rounded-[2.5rem] shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
          >
            <Save size={24} className="group-hover:scale-110 transition-transform" />
            <span className="text-xl">Save Outfit</span>
          </button>
        </div>
      </form>
    </Layout>
  );
};

export default CreateOutfit;
