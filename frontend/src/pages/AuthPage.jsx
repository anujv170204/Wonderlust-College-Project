import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => { setIsLogin(location.pathname !== '/register'); setError(null); }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const account = isLogin ? await login(email, password, role) : await register(name, email, password, role);
      navigate(location.state?.from?.pathname || (account.role === 'admin' ? '/admin' : account.role === 'host' ? '/host/dashboard' : '/bookings'), { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome back to WonderLust' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin 
              ? 'Enter your credentials to manage your bookings and properties' 
              : 'Sign up to start booking verified stays and listing properties'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isLogin && <div className="grid grid-cols-3 gap-2">{['user','host','admin'].map(r => <button key={r} onClick={() => {setRole(r);setError(null);}} className={'rounded-xl border py-3 capitalize font-semibold text-sm '+(role===r?'bg-indigo-600 text-white':'bg-white text-slate-600')}>{r} Login</button>)}</div>}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-indigo-500">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="Anuj Vishwakarma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      role === 'user'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Guest / Traveler
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('host')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      role === 'host'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Property Host
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email</label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-indigo-500">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <input type="email" required
                placeholder="you@example.com" autoComplete="email" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm focus:outline-none bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
              Password
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-indigo-500">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs sm:text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setRole('user');
                  setError(null);
                }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError(null);
                }}
                className="font-bold text-indigo-600 hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
