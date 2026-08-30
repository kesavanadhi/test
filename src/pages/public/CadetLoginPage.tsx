import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Sparkles,
  KeyRound,
  CheckCircle2,
  HelpCircle,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CadetLoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginCadet } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your Cadet ID or registered Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    try {
      loginCadet(identifier, password);
      showToast('success', 'Cadet Authentication Successful', 'Welcome to your Cadet Examination Portal.');
      navigate('/cadet/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid Cadet ID or Password.');
    }
  };


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 border-2 border-defence-500/40 p-2 mx-auto flex items-center justify-center shadow-xl">
            <img src="/assets/warrior-logo.webp" alt="WARRIOR Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white font-display tracking-tight">
            Cadet Examination Portal
          </h1>
          <p className="text-xs text-slate-400">
            Sign in using your assigned Cadet ID or registered Email.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-shake shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              {errorMessage.includes('register') && (
                <div className="mt-1">
                  <Link to="/cadet/register" className="text-defence-300 font-bold underline">
                    Click here to Register Now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-6 shadow-2xl">
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Cadet Username / Registered Email</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. your_username or email@domain.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 font-semibold"
                />
              </div>
            </div>


            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('info', 'Password Reset', 'Please contact your NCC Officer Administrator to reset your password.')}
                  className="text-[11px] text-defence-400 hover:underline"
                >
                  Forgot Password?
                </button>

              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-navy-950 border-slate-700 text-defence-600 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 border border-defence-400/40"
          >
            <span>Login to Cadet Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* New Cadet Registration CTA */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              New Aspirant?{' '}
              <Link to="/cadet/register" className="text-defence-400 font-bold hover:underline inline-flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5" /> Register Now
              </Link>
            </p>
          </div>
        </form>

        <div className="text-center">
          <Link to="/admin/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Officer Administrative Portal Login →
          </Link>
        </div>

      </div>
    </div>
  );
};