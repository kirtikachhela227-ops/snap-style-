import React, { useState } from 'react';
import { useAuth } from '../services/AuthContext';
import { Shirt, Mail, Chrome } from 'lucide-react';

const Auth: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a quick delay
    setTimeout(() => {
      login(email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 md:p-12 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-8 shadow-inner">
          <Shirt size={44} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">StyleSnap</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">
          Your personal smart outfit planner. <br />
          Sign in to start styling.
        </p>

        <form onSubmit={handleAuth} className="space-y-4 mb-10">
          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-bold text-gray-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? 'Signing in...' : 'Continue with Email'}
          </button>
        </form>

        <div className="relative mb-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs font-black uppercase tracking-widest text-gray-400">
            <span className="bg-white px-4">Or continue with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => login('google-user@demo.com')}
          className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all group"
        >
          <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-gray-700">Google Login</span>
        </button>
      </div>
    </div>
  );
};

export default Auth;
