import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Sparkles,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { loginAdmin, quickDemoLoginAdmin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      loginAdmin(adminId, password);
      showToast('success', 'Admin Authenticated', 'Welcome to Officer Command Portal.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid Admin ID or Password.');
    }
  };

  const handleDemoLogin = () => {
    try {
      quickDemoLoginAdmin();
      showToast('success', 'Master Admin Demo Login', 'Authenticated as NCC Officer Admin.');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 p-2 mx-auto flex items-center justify-center shadow-xl">
            <img src="/assets/warrior-logo.webp" alt="WARRIOR Logo" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-950 text-gold-400 border border-amber-500/30">
              Restricted Officer Access
            </span>
            <h1 className="text-3xl font-black text-white font-display tracking-tight mt-2">
              Admin Command Login
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Authorised NCC Officer & Examination Controller Portal
          </p>
        </div>

        {/* Error Alert Box (Requirement #28) */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-shake shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Officer Admin ID</label>
              <input
                type="text"
                required
                placeholder="Enter Admin ID (e.g. NCC)"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Security Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter Officer Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 pr-10 font-mono"
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
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-950/60 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 border border-amber-400/40"
          >
            <span>Authenticate Admin Session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login Box */}
        <div className="p-5 rounded-2xl bg-navy-900/60 border border-slate-800 space-y-3 shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <KeyRound className="w-4 h-4 text-gold-400" />
            <span>Evaluation Credentials</span>
          </div>
          <p className="text-xs text-slate-400">
            ID: <code className="text-gold-400 font-bold bg-navy-950 px-1.5 py-0.5 rounded">NCC</code> • Password: <code className="text-gold-400 font-bold bg-navy-950 px-1.5 py-0.5 rounded">Ncc@2023</code>
          </p>
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-navy-850 border border-amber-500/40 text-gold-400 text-xs font-bold uppercase tracking-wider transition-all"
          >
            1-Click Demo Admin Login
          </button>
        </div>

        <div className="text-center">
          <Link to="/cadet/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Switch to Cadet Portal Login
          </Link>
        </div>
      </div>
    </div>
  );
};