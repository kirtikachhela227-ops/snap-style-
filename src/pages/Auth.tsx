import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { Shirt, Chrome, Mail, Lock, User as UserIcon, ArrowRight, HelpCircle, AlertTriangle } from 'lucide-react';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
      if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') message = 'Incorrect password.';
      if (err.code === 'auth/invalid-credential') {
        message = 'Invalid email or password. If you usually use Google, please click "Google Account" below.';
      }
      if (err.code === 'auth/email-already-in-use') {
        message = 'An account already exists. Try "Sign In" instead of "Sign Up".';
      }
      if (err.code === 'auth/weak-password') message = 'Password should be at least 6 characters.';
      if (err.code === 'auth/invalid-email') message = 'Please enter a valid email address.';
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

        {showHelp && (
          <div className="bg-indigo-50 text-indigo-700 p-4 rounded-2xl mb-6 text-left text-xs leading-relaxed border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-wider">
              <AlertTriangle size={14} />
              Troubleshooting
            </div>
            <ul className="space-y-2 list-disc pl-4 mb-4">
              <li><strong>Google Login stuck?</strong> Ensure your domain is added to "Authorized domains" in Firebase Console.</li>
              <li><strong>Popup blocked?</strong> Check your browser's address bar for a popup blocker icon.</li>
              <li><strong>COOP Errors?</strong> These are common in iframes. Try opening the app in a new tab.</li>
              <li><strong>Still failing?</strong> Use the manual Email/Password option below.</li>
            </ul>
            <a 
              href={window.location.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-indigo-600 text-white text-center py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Open in New Tab
            </a>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-xs font-bold border border-red-100">
            {error}
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
