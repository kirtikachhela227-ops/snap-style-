import React, { useState } from 'react';
import { storage } from '../services/storage';
import { useNavigate } from 'react-router-dom';
import { Shirt, DollarSign, Tag, Palette, Save, X, Info } from 'lucide-react';
import Layout from '../components/Layout';

const CreateOutfit: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    occasion: 'College',
    top: '',
    bottom: '',
    footwear: '',
    color: 'Black',
    price: 0
  });

  const occasions = ['College', 'Party', 'Wedding', 'Casual'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Purple', 'Beige', 'Grey'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      storage.saveOutfit(formData);
      navigate('/history');
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
        <p className="text-gray-500 font-medium">Add details to track your style and spending.</p>
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
                  onChange={(e) => setFormData({ ...formData, occasion: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none"
                >
                  {occasions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <Palette size={14} />
                  <span>Primary Color</span>
                </label>
                <select
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none"
                >
                  {colors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Top</label>
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
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Bottom</label>
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
                <span>Price (USD)</span>
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 text-2xl"
                placeholder="0.00"
              />
            </div>

            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
                <Info size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-900 mb-1">Cost Per Wear</p>
                <p className="text-[10px] font-medium text-indigo-400 leading-relaxed">
                  We'll track how often you wear this to calculate your true cost per wear.
                </p>
              </div>
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
