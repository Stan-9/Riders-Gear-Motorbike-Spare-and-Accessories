import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Lock, Mail, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgot(false);
      setResetEmail('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reset email. Check the address and try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-morning flex items-center justify-center p-4">
      <div className="bg-white border border-jade/5 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-jade/5 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-jade/5 rounded-full blur-3xl -ml-16 -mb-16" />

        <div className="relative z-10">
          {showForgot ? (
            /* Forgot Password View */
            <div>
              <button
                onClick={() => setShowForgot(false)}
                className="flex items-center gap-2 text-pebble hover:text-jade-dark text-sm mb-6 transition font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>

              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-jade to-jade-dark rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-jade/20">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-black text-jade-dark mb-2">Reset Password</h1>
                <p className="text-pebble text-sm font-bold opacity-70">
                  Enter your admin email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-pebble mb-2 opacity-60">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-jade opacity-40" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-jade/5 rounded-2xl bg-morning text-jade-dark font-bold placeholder-jade/30 focus:outline-none focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                      placeholder="admin@ridersgear.co.ke"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-jade hover:bg-jade-dark text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-jade/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {resetLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Login View */
            <div>
              <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-jade to-jade-dark rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-jade/20">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-jade-dark mb-2 tracking-tight">Admin Portal</h1>
                <p className="text-pebble font-bold opacity-70">Sign in to manage your premium store</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-pebble mb-2 opacity-60">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-jade opacity-40" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-jade/5 rounded-2xl bg-morning text-jade-dark font-bold placeholder-jade/30 focus:outline-none focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                      placeholder="admin@ridersgear.co.ke"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-black uppercase tracking-widest text-pebble opacity-60">Password</label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-jade opacity-40" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 border border-jade/5 rounded-2xl bg-morning text-jade-dark font-bold placeholder-jade/30 focus:outline-none focus:ring-2 focus:ring-jade/20 focus:border-jade transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-jade hover:bg-jade-dark text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-jade/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowForgot(true)}
                  className="text-pebble hover:text-jade text-sm transition font-bold"
                >
                  Forgot your password?
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
