import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Shirt, Chrome, Mail, Lock, User as UserIcon, ArrowRight, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';

const Auth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Detect if we are in an iframe
    setIsIframe(window.self !== window.top);
  }, []);

  // Safety Redirect: If user is detected, force them to dashboard
  useEffect(() => {
    if (user) {
      console.log('User detected in Auth page, forcing redirect to dashboard...');
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Domain not authorized! Please add your Vercel URL to "Authorized domains" in the Firebase Console.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Login popup was closed. Please try again.');
      } else if (err.message?.includes('Cross-Origin-Opener-Policy') || isIframe) {
        setError('Security policy blocked the login. This happens in the preview window. Please use the "Open in New Tab" button below.');
        setShowHelp(true);
      } else {
        setError(err.message || 'An error occurred during Google authentication');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Update the display name in Firebase Auth so AuthContext can pick it up
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
    } catch (err: any) {
      console.error('Email Auth error:', err);
      let message = err.message;
      if (err.code === 'auth/user-not-found') message = 'No account found. Please check your email or Sign Up.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
      if (err.code === 'auth/invalid-credential') {
        message = 'Login failed. If you usually use Google, please use the "Google Account" button below. (Note: Password login won\'t work if you signed up with Google)';
      }
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please switch to "Sign In" or use Google.';
        setIsLogin(true); // Auto-switch to login mode
      }
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
      
      // If we see COOP or generic errors in an iframe, suggest new tab
      if (isIframe || err.message?.includes('cross-origin')) {
        setShowHelp(true);
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-8 md:p-10 text-center relative overflow-hidden">
        {/* Help Toggle */}
        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="absolute top-6 right-6 text-gray-400 hover:text-indigo-600 transition-colors"
          title="Troubleshooting Help"
        >
          <HelpCircle size={20} />
        </button>

        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
          <Shirt size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">StyleSnap</h1>
        <p className="text-gray-500 text-sm font-medium mb-8">
          {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start styling.'}
        </p>

        {isIframe && !showHelp && !error && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-700 font-medium flex items-center gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            <span>Running in preview mode. If login fails, click the "?" icon.</span>
          </div>
        )}

        {showHelp && (
          <div className="bg-indigo-50 text-indigo-700 p-5 rounded-3xl mb-8 text-left text-xs leading-relaxed border-2 border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 font-black uppercase tracking-wider text-indigo-600">
              <AlertTriangle size={16} />
              Login Issues?
            </div>
            <p className="mb-4 font-medium">If Google login is getting stuck or showing errors, click the button below to open the app in a new tab. This fixes most security blocks.</p>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white text-center py-3 rounded-xl font-black hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <ExternalLink size={16} />
              FIX LOGIN: OPEN IN NEW TAB
            </a>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-red-100 flex items-start gap-2 text-left">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetSent && (
          <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-6 text-xs font-bold border border-green-100">
            Password reset email sent! Check your inbox.
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all text-sm font-medium"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or continue with</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group shadow-sm"
          >
            <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-gray-700 text-sm">
              Google Account
            </span>
          </button>
          
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
