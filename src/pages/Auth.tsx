import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { Shirt, Chrome } from 'lucide-react';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setError(err.message || 'An error occurred during Google authentication');
    } finally {
      setLoading(false);
    }
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

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-4 py-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm"
          >
            <Chrome size={24} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-black text-gray-700 text-lg">
              {loading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>
          
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Secure login powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
