import React from 'react';
import { Sliders, RotateCcw, Shield, CheckCircle2, AlertTriangle, Key, Bell, Database } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AdminSettingsPage: React.FC = () => {
  const { resetAllData } = useData();
  const { showToast } = useToast();

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all mock platform data (cadets, questions, tests, submissions) back to fresh demo factory defaults?')) {
      resetAllData();
      showToast('success', 'Factory Reset Complete', 'All datasets restored to initial demo state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          System Administration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Platform configurations, mock server preferences, and database synchronization controls.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-6 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
          <Key className="w-4 h-4 text-gold-400" />
          <span>Officer Credentials & Security</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Master Admin ID</span>
            <span className="font-mono font-bold text-white">NCC</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800/60">
            <span className="text-slate-400">Demo Password Status</span>
            <span className="text-defence-400 font-semibold">Configured (Ncc@2023)</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Platform Environment</span>
            <span className="text-gold-400 font-semibold">Frontend Standalone Mock Mode</span>
          </div>
        </div>
      </div>

      {/* Factory Reset Data */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-950/30 border border-red-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-500/50 flex items-center justify-center text-red-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Reset Demo Database</h3>
            <p className="text-xs text-slate-400">Reinitialize default questions, 20 cadets, tests, and scorecards in LocalStorage.</p>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="py-3 px-6 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          Reset All Data to Demo Defaults
        </button>
      </div>
    </div>
  );
};
