import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-defence-700 to-defence-500 flex items-center justify-center text-white shadow-lg shadow-defence-950/60 border border-defence-400/40">
                <Shield className="w-6 h-6 text-gold-300" />
              </div>
              <div>
                <span className="text-lg font-black tracking-wider text-white font-display block">
                  WARRIOR
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400 block -mt-1">
                  Defence Mock Test Platform
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier examination preparation portal for Union Public Service Commission (UPSC CDS) and Indian Air Force (IAF AFCAT) aspirants. Realistic CBT interface, rich question banks, and instant detailed performance scorecards.
            </p>
            <div className="flex items-center gap-2 text-xs text-defence-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-defence-500" />
              <span>Standard UPSC & IAF Marking Schemes Supported</span>
            </div>
          </div>

          {/* Col 2: Exam Streams */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Exam Streams</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#cds" className="hover:text-defence-400 transition-colors">CDS IMA / INA / AFA</Link></li>
              <li><Link to="/#cds" className="hover:text-defence-400 transition-colors">CDS OTA (Non-Tech)</Link></li>
              <li><Link to="/#afcat" className="hover:text-defence-400 transition-colors">AFCAT Flying Branch</Link></li>
              <li><Link to="/#afcat" className="hover:text-defence-400 transition-colors">AFCAT Ground Duty (Tech & Non-Tech)</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/cadet/login" className="hover:text-defence-400 transition-colors">Cadet Portal Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-defence-400 transition-colors">Officer / Admin Login</Link></li>
              <li><Link to="/cadet/mock-tests" className="hover:text-defence-400 transition-colors">All Mock Tests</Link></li>
              <li><Link to="/cadet/packages" className="hover:text-defence-400 transition-colors">Test Packages & Pricing</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="mt-12 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WARRIOR Defence Mock Test Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Frontend Examination Engine</span>
            <span>UPSC CDS & IAF AFCAT Simulation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
