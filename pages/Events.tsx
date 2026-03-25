import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { Outfit, Event } from '../types';
import { Calendar, Plus, Save, X, CalendarDays, Tag, Shirt } from 'lucide-react';
import Layout from '../components/Layout';

const Events: React.FC = () => {
  const [events, setEvents] = useState<(Event & { outfit?: Outfit })[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    outfit_id: ''
  });

  useEffect(() => {
    const outfitsData = storage.getOutfits();
    const eventsData = storage.getEvents();
    setOutfits(outfitsData);
    setEvents(eventsData);
    setLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      storage.saveEvent(formData);
      const updatedEvents = storage.getEvents();
      setEvents(updatedEvents);
      setShowForm(false);
      setFormData({ name: '', date: '', outfit_id: '' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = (id: string) => {
    storage.deleteEvent(id);
    setEvents(events.filter(e => e.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Planner</h1>
          <p className="text-gray-500 font-medium">Schedule your outfits for upcoming events.</p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          <span>New Event</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Schedule Event</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <Tag size={14} />
                  <span>Event Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                  placeholder="e.g. Sarah's Wedding"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <CalendarDays size={14} />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1 flex items-center gap-2">
                  <Shirt size={14} />
                  <span>Assign Outfit</span>
                </label>
                <select
                  required
                  value={formData.outfit_id}
                  onChange={(e) => setFormData({ ...formData, outfit_id: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700 appearance-none"
                >
                  <option value="">Select an outfit</option>
                  {outfits.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Save size={20} />
                <span>Save Event</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-white p-20 rounded-[3rem] text-center border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
            <Calendar size={40} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No upcoming events</h3>
          <p className="text-gray-500 font-medium">Plan your first event and assign an outfit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{event.name}</h3>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="p-3 rounded-2xl bg-gray-50 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">Assigned Outfit</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <Shirt size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-indigo-900 leading-none mb-1">{event.outfit?.name || 'Unknown Outfit'}</h4>
                      <p className="text-xs font-bold text-indigo-400 leading-none">{event.outfit?.occasion}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Upcoming</p>
                  </div>
                  <p className="text-xs font-bold text-gray-500 italic">
                    {Math.ceil((new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Events;
