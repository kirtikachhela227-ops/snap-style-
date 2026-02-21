
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { StylingFeedback, Outfit, OutfitStatus } from '../types';
import { analyzeOutfit } from '../services/gemini';

interface AIFeedbackProps {
  onSaveOutfit: (outfit: Outfit) => void;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ onSaveOutfit }) => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState('College');
  const [mood, setMood] = useState('BOLD');
  const [weather, setWeather] = useState('Sunny (24°C)');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<StylingFeedback | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    setFeedback(null);
    try {
      const base64Data = preview.split(',')[1];
      const result = await analyzeOutfit(base64Data, occasion, mood, weather);
      setFeedback(result);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveWithStatus = (status: OutfitStatus) => {
    if (!feedback || !preview) return;
    
    onSaveOutfit({
      id: Math.random().toString(36).substr(2, 9),
      name: `${mood} ${occasion} Ensemble`,
      imageUrl: preview,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      rating: parseFloat(((feedback.visualBalance + feedback.weatherPracticality) / 2).toFixed(1)),
      occasion,
      weather,
      mood,
      status: status
    });
    
    alert(`Successfully categorized as "${status.replace('_', ' ').toUpperCase()}" and added to vault.`);
    navigate('/vault');
  };

  const isMatchNegative = feedback?.matchStatus?.toUpperCase().includes('NO');

  return (
    <div className="page-container p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Side: Input Form */}
        <section className="w-full lg:w-[420px] shrink-0 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-card">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-5">1. Visual Source</h2>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative group border-2 border-dashed border-border-subtle rounded-2xl p-8 text-center transition-all hover:border-primary/40 hover:bg-primary-light/50 cursor-pointer overflow-hidden"
            >
              <input 
                ref={fileInputRef}
                className="hidden" 
                type="file" 
                onChange={handleFileChange}
                accept="image/*"
              />
              <div className="flex flex-col items-center gap-3">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 w-full object-contain rounded-xl shadow-sm" />
                ) : (
                  <>
                    <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-icons-round text-3xl">add_photo_alternate</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-bold text-neutral-text">Capture or Upload</p>
                      <p className="text-xs text-neutral-muted mt-1">High-res JPG or PNG preferred</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border-subtle shadow-card space-y-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">2. Contextual Data</h2>
            <div className="space-y-4">
              <label className="block text-sm font-bold text-neutral-text">Occasion</label>
              <div className="grid grid-cols-2 gap-2">
                {['College', 'Office', 'Party', 'Date'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setOccasion(loc)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      occasion === loc 
                        ? 'border-primary bg-primary text-white shadow-soft' 
                        : 'border-border-subtle bg-background-alt text-neutral-muted hover:border-primary/30'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-neutral-text">Style Mood</label>
                <div className="flex flex-wrap gap-2">
                  {['BOLD', 'MINIMAL', 'CHILL'].map(m => (
                    <button
                      key={m}
                      onClick={() => setMood(m)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${
                        mood === m ? 'border-primary bg-primary-light text-primary' : 'border-border-subtle text-neutral-muted hover:bg-background-alt'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-neutral-text">Weather</label>
                <select 
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full bg-background-alt border border-border-subtle rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs py-2.5 px-3 outline-none"
                >
                  <option>Sunny (24°C)</option>
                  <option>Rainy (18°C)</option>
                  <option>Cold (5°C)</option>
                  <option>Overcast</option>
                </select>
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !preview}
              className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-soft shadow-primary/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${
                isAnalyzing || !preview ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="material-icons-round text-xl">{isAnalyzing ? 'loop' : 'auto_awesome'}</span>
              <span>{isAnalyzing ? 'Analyzing Look...' : 'Get Instant Critique'}</span>
            </button>
          </div>
        </section>

        {/* Right Side: AI Feedback Results */}
        <section className="flex-1 w-full min-h-[600px]">
          {feedback ? (
            <div className="bg-white rounded-3xl border border-border-subtle shadow-soft overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="p-8 lg:p-10 border-b border-border-subtle bg-background-alt/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-text mb-1 tracking-tight">Style Intelligence Report</h2>
                  <p className="text-neutral-muted text-sm font-medium">Processed by Gemini 3 Core Engine</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2.5 pr-6 rounded-2xl border border-border-subtle shadow-sm">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isMatchNegative ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    <span className="material-icons-round">{isMatchNegative ? 'warning' : 'verified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-muted block leading-none mb-1">Recommendation</span>
                    <span className={`font-bold tracking-tight uppercase leading-none ${isMatchNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {feedback.matchStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-12">
                <div className="grid md:grid-cols-2 gap-10 items-start">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-subtle relative group shadow-card">
                    <img className="w-full h-full object-cover" src={preview!} alt="Analysis" />
                    <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
                      {feedback.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-xl text-[10px] font-bold text-primary uppercase border border-primary/10 shadow-sm">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-primary font-bold text-[11px] uppercase tracking-[0.25em] mb-4">The Verdict</h3>
                      <p className="text-xl leading-relaxed text-neutral-text font-medium italic">"{feedback.reasoning}"</p>
                    </div>
                    
                    <div className="space-y-6 py-6 border-y border-border-subtle">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase text-neutral-muted tracking-wider">
                          <span>Visual Balance</span>
                          <span className="text-primary">{feedback.visualBalance}/10</span>
                        </div>
                        <div className="w-full h-2 bg-primary-light rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" style={{ width: `${feedback.visualBalance * 10}%` }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[11px] font-bold uppercase text-neutral-muted tracking-wider">
                          <span>Weather Practicality</span>
                          <span className="text-primary">{feedback.weatherPracticality}/10</span>
                        </div>
                        <div className="w-full h-2 bg-primary-light rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40 rounded-full transition-all duration-1000 ease-out" style={{ width: `${feedback.weatherPracticality * 10}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-background-alt rounded-2xl p-6 border border-border-subtle">
                      <h3 className="flex items-center gap-2 text-neutral-text font-bold text-xs uppercase tracking-wider mb-5">
                        <span className="material-icons-round text-primary text-lg">lightbulb</span> Strategic Refinements
                      </h3>
                      <ul className="space-y-4">
                        {feedback.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">0{idx + 1}</span>
                            <p className="text-sm text-neutral-muted leading-relaxed font-medium">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-background-alt flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border-subtle">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <img className="w-9 h-9 rounded-full border-2 border-white shadow-sm" src="https://picsum.photos/100/100?random=11" alt="S1" />
                    <img className="w-9 h-9 rounded-full border-2 border-white shadow-sm" src="https://picsum.photos/100/100?random=12" alt="S2" />
                  </div>
                  <p className="text-[11px] text-neutral-muted font-bold uppercase tracking-tight">Verified by Style AI Engine</p>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => { setFeedback(null); setPreview(null); }}
                    className="flex-1 sm:flex-none p-3 rounded-xl border border-border-subtle bg-white text-neutral-muted hover:text-rose-500 hover:border-rose-500 transition-all"
                    title="Discard analysis"
                  >
                    <span className="material-icons-round text-xl">delete_outline</span>
                  </button>
                  
                  {isMatchNegative ? (
                    <>
                      <button 
                        onClick={() => saveWithStatus('needs_improvement')}
                        className="flex-1 sm:flex-none px-6 py-3 bg-white border border-border-subtle text-neutral-text rounded-xl font-bold text-sm hover:border-primary hover:text-primary transition-all shadow-sm uppercase tracking-widest whitespace-nowrap"
                      >
                        Needs Improvement
                      </button>
                      <button 
                        onClick={() => saveWithStatus('saved')}
                        className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-soft shadow-primary/20 uppercase tracking-widest whitespace-nowrap"
                      >
                        Save for Later
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => saveWithStatus('worked_well')}
                      className="flex-1 sm:flex-none px-10 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-soft shadow-primary/20 uppercase tracking-widest"
                    >
                      Archive Look
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border-subtle shadow-card h-full min-h-[600px] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-primary-light rounded-[2.5rem] flex items-center justify-center text-primary mb-8 animate-pulse">
                <span className="material-icons-round text-5xl">auto_fix_high</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-text mb-3 tracking-tight">Ready for Style Synthesis?</h2>
              <p className="max-w-md text-sm text-neutral-muted leading-relaxed font-medium">
                Upload your ensemble and set the desired atmosphere. Our AI will dissect your choices based on global fashion metrics.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AIFeedback;
