import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  UserCheck,
  Lock,
  Menu,
  X,
  BookOpen,
  Trophy,
  Package,
  ArrowRight,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cadetUser, isAdminAuthenticated, logoutCadet, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand with Warrior Shield */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-navy-900 border-2 border-defence-500/40 p-1.5 flex items-center justify-center transition-all group-hover:border-defence-400 shadow-xl">
              <img
                src="/assets/warrior-logo.webp"
                alt="WARRIOR Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black tracking-widest text-xl text-white">
                WARRIOR
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-defence-400">
                CDS & AFCAT Mock Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/cadet/mock-tests" className="hover:text-white transition-colors">
              Mock Tests
            </Link>
            <Link to="/cadet/packages" className="hover:text-white transition-colors">
              Packages
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {cadetUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/cadet/dashboard"
                  className="px-4 py-2.5 rounded-xl bg-defence-700 hover:bg-defence-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
                >
                  <span>Cadet Portal ({cadetUser.cadetId})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : isAdminAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="px-4 py-2.5 rounded-xl bg-navy-900 border border-amber-500/40 text-gold-400 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2"
              >
                <span>Admin Command</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/cadet/register"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 border border-defence-400/40"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Cadet Registration</span>
                </Link>

                <Link
                  to="/cadet/login"
                  className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-defence-400" />
                  <span>Cadet Login</span>
                </Link>

                <Link
                  to="/admin/login"
                  className="px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-gold-400 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-navy-950 px-4 py-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Home
            </Link>
            <Link to="/cadet/mock-tests" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Explore Mock Tests
            </Link>
            <Link to="/cadet/packages" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Practice Packages
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              to="/cadet/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-defence-700 text-white font-bold text-xs uppercase text-center block"
            >
              Cadet Registration
            </Link>
            <Link
              to="/cadet/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-navy-900 border border-slate-700 text-white font-bold text-xs uppercase text-center block"
            >
              Cadet Login
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl text-gold-400 text-xs font-semibold text-center block"
            >
              Officer Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};