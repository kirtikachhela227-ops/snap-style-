
import React from 'react';
import { Outfit } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface AnalyticsProps {
  outfits: Outfit[];
}

const Analytics: React.FC<AnalyticsProps> = ({ outfits }) => {
  const workedWellCount = outfits.filter(o => o.status === 'worked_well').length;
  const needsImpCount = outfits.filter(o => o.status === 'needs_improvement').length;
  const savedCount = outfits.filter(o => o.status === 'saved').length;
  
  const avgRating = outfits.length 
    ? (outfits.reduce((acc, o) => acc + o.rating, 0) / outfits.length).toFixed(1)
    : '0';

  const data = [
    { name: 'WK 01', current: 65, previous: 58 },
    { name: 'WK 02', current: 72, previous: 62 },
    { name: 'WK 03', current: 68, previous: 70 },
    { name: 'WK 04', current: 85, previous: 65 },
    { name: 'WK 05', current: 92, previous: 68 },
  ];

  const categoryStats = [
    { name: 'Worked Well', value: workedWellCount, color: 'emerald' },
    { name: 'Needs Improvement', value: needsImpCount, color: 'rose' },
    { name: 'Saved Later', value: savedCount, color: 'amber' },
  ];

  return (
    <div className="page-container p-6 lg:p-10 space-y-10 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vault Items', value: outfits.length.toString(), icon: 'inventory_2', trend: '+10%', color: 'emerald' },
          { label: 'Avg. Rating', value: `${avgRating}/10`, icon: 'star', trend: '+2.1%', color: 'emerald' },
          { label: 'Needs Improvement', value: needsImpCount.toString(), icon: 'build', trend: '-5.0%', color: 'rose' },
          { label: 'Saved for Occasions', value: savedCount.toString(), icon: 'bookmark', trend: '+1.5%', color: 'amber' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-7 rounded-[1.5rem] border border-border-subtle shadow-card flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-primary-light rounded-2xl flex items-center justify-center text-primary">
                <span className="material-icons-round text-2xl">{kpi.icon}</span>
              </div>
              <div className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 ${kpi.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : kpi.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                <span className="material-icons text-[12px]">{kpi.trend.includes('+') ? 'trending_up' : 'trending_down'}</span>
                {kpi.trend}
              </div>
            </div>
            <div>
              <p className="text-neutral-muted text-[11px] font-bold uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-bold text-neutral-text mt-1">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2rem] border border-border-subtle shadow-card">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-bold text-xl text-neutral-text tracking-tight">Style Evolution</h3>
              <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-widest mt-1">Consistency Trend over 5 weeks</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b2cf5" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b2cf5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666666', fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e0eb', borderRadius: '16px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Area type="monotone" dataKey="current" stroke="#8b2cf5" strokeWidth={4} fillOpacity={1} fill="url(#colorPrimary)" />
                <Area type="monotone" dataKey="previous" stroke="#8b2cf533" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2rem] border border-border-subtle shadow-card">
          <h3 className="font-bold text-xl text-neutral-text tracking-tight mb-2">Category Distribution</h3>
          <p className="text-[11px] font-bold text-neutral-muted uppercase tracking-widest mb-8">Breakdown of Vault History</p>
          <div className="space-y-7">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-neutral-text uppercase">{item.name}</span>
                  <span className="text-primary font-bold text-sm">{item.value} Items</span>
                </div>
                <div className="h-2 w-full bg-background-alt rounded-full overflow-hidden border border-border-subtle">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.color === 'emerald' ? 'bg-emerald-500' : item.color === 'rose' ? 'bg-rose-500' : 'bg-amber-500'}`} 
                    style={{ width: outfits.length ? `${(item.value / outfits.length) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
