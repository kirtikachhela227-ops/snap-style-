import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { Shirt, Mail, Lock, User as UserIcon, ArrowRight, AlertTriangle } from 'lucide-react';

const Auth: React.FC = () => {
  const { user, skipLogin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Safety Redirect: If user is detected, force them to dashboard
  useEffect(() => {
    if (user) {
      console.log('User detected in Auth page, forcing redirect to dashboard...');
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(`Attempting ${isLogin ? 'Sign In' : 'Sign Up'} for:`, email);
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
      console.log('Authentication successful!');
    } catch (err: any) {
      console.error('Email Auth error details:', err.code, err.message);
      let message = err.message;
      if (err.code === 'auth/user-not-found') {
        message = 'No account found with this email. Did you mean to Sign Up?';
      }
      if (err.code === 'auth/wrong-password') {
        message = 'Incorrect password. Please try again or reset your password.';
      }
      if (err.code === 'auth/invalid-credential') {
        message = 'Login failed. This usually means the email or password is incorrect. If you previously used Google to sign in, you may need to "Sign Up" first to create a password for this email, or use "Forgot Password" to set one.';
      }
      if (err.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please Sign In instead.';
        setIsLogin(true);
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
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-inner">
          <Shirt size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">StyleSnap</h1>
        <p className="text-gray-500 text-sm font-medium mb-8">
          {isLogin ? 'Welcome back! Sign in to continue.' : 'Create an account to start styling.'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-red-100 flex flex-col gap-3 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
            <div className="flex gap-2">
              {isLogin && !error.includes('already registered') && (
                <button 
                  onClick={() => { setIsLogin(false); setError(null); }}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all w-fit"
                >
                  Switch to Sign Up
                </button>
              )}
              {isLogin && (
                <button 
                  onClick={handleForgotPassword}
                  className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all w-fit"
                >
                  Reset Password
                </button>
              )}
            </div>
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

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>

          <div className="pt-4 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={skipLogin}
              className="text-xs font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-2 mx-auto"
            >
              Skip for now (Guest Mode)
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
