import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Phone, Mail, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-navy-900 border border-defence-500/30 p-1 flex items-center justify-center shadow-lg">
                <img
                  src="/assets/warrior-logo.webp"
                  alt="WARRIOR Logo"
                  className="w-full h-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <span className="font-display tracking-widest text-xl font-black text-white">
                  WARRIOR
                </span>
                <p className="text-[10px] tracking-wider uppercase font-semibold text-defence-400">
                  CDS & AFCAT Mock Test Platform
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The premier examination preparation portal for Union Public Service Commission (UPSC CDS) and Indian Air Force (IAF AFCAT) aspirants. Realistic CBT interface, rich question banks, and instant detailed performance scorecards.
            </p>
            <div className="flex items-center gap-2 text-xs text-defence-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-defence-500" />
              <span>Standard UPSC & IAF Marking Schemes Supported</span>
            </div>
          </div>

          {/* Col 2: Exam Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Exam Streams</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/#cds" className="hover:text-defence-400 transition-colors">CDS IMA / INA / AFA</Link></li>
              <li><Link to="/#cds" className="hover:text-defence-400 transition-colors">CDS OTA (Non-Tech)</Link></li>
              <li><Link to="/#afcat" className="hover:text-defence-400 transition-colors">AFCAT Flying Branch</Link></li>
              <li><Link to="/#afcat" className="hover:text-defence-400 transition-colors">AFCAT Ground Duty (Tech & Non-Tech)</Link></li>
              <li><Link to="/#afcat" className="hover:text-defence-400 transition-colors">Military Aptitude Sprint</Link></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/cadet/login" className="hover:text-defence-400 transition-colors">Cadet Portal Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-defence-400 transition-colors">Officer / Admin Login</Link></li>
              <li><Link to="/cadet/mock-tests" className="hover:text-defence-400 transition-colors">All Mock Tests</Link></li>
              <li><Link to="/cadet/leaderboard" className="hover:text-defence-400 transition-colors">National Leaderboard</Link></li>
              <li><Link to="/#packages" className="hover:text-defence-400 transition-colors">Practice Packages</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Cadet Support</h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-defence-400 shrink-0" />
                support@warriordefence.in
              </p>
              <p className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-defence-400 shrink-0" />
                +91 1800 233 4455 (Toll Free)
              </p>
              <p className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-defence-400 shrink-0 mt-0.5" />
                Defence Examination Academy Hub, New Delhi - 110010
              </p>
            </div>
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
