import React, { useState, useEffect } from 'react';
import {
  Sliders,
  RotateCcw,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Key,
  Bell,
  Database,
  Save,
  Volume2,
  Eye,
  Lock,
  UserCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

interface PlatformSettings {
  allowPublicRegistration: boolean;
  strictAntiCheat: boolean;
  soundEffects: boolean;
  defaultNegativeMarking: '0.33' | '0.25' | '1.0';
  maintenanceMode: boolean;
  platformNotice: string;
}

const SETTINGS_STORAGE_KEY = 'warrior_platform_settings_v2';

export const AdminSettingsPage: React.FC = () => {
  const { resetAllData } = useData();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return {
      allowPublicRegistration: true,
      strictAntiCheat: true,
      soundEffects: true,
      defaultNegativeMarking: '0.33',
      maintenanceMode: false,
      platformNotice: 'CDS & AFCAT 2026 Mock Test Series is now LIVE. Ensure stable network connectivity before starting your test.',
    };
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    showToast('success', 'Settings Saved', 'Platform configurations have been updated.');
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all mock platform data (cadets, questions, tests, submissions) back to fresh demo factory defaults?'
      )
    ) {
      resetAllData();
      showToast('success', 'Factory Reset Complete', 'All datasets restored to initial demo state.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3">
          <Sliders className="w-8 h-8 text-gold-400" />
          <span>System Administration & Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure examination rules, anti-cheating tolerances, registration policies, and database state.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Examination Security & Anti-Cheat */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Shield className="w-4 h-4 text-defence-400" />
            <span>Examination Rules & Anti-Cheat Configuration</span>
          </h3>

          <div className="space-y-4 text-xs">
            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-navy-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block">Strict Fullscreen & Anti-Cheat Enforcement</span>
                <p className="text-slate-400">
                  Enforces full-screen lockdown during live mock tests. Warns candidate when tab switching or devtools are detected.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.strictAntiCheat}
                onChange={(e) => setSettings({ ...settings, strictAntiCheat: e.target.checked })}
                className="mt-1 rounded bg-navy-900 border-slate-700 text-defence-600 focus:ring-defence-500 w-5 h-5 cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-navy-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block">Allow Public Cadet Self-Registration</span>
                <p className="text-slate-400">
                  When enabled, candidates can register online via the registration portal. When disabled, only Admin can add/import cadets.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowPublicRegistration}
                onChange={(e) => setSettings({ ...settings, allowPublicRegistration: e.target.checked })}
                className="mt-1 rounded bg-navy-900 border-slate-700 text-defence-600 focus:ring-defence-500 w-5 h-5 cursor-pointer"
              />
            </label>

            <label className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-navy-950/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block">Exam Audio & Timer Alerts</span>
                <p className="text-slate-400">
                  Play subtle audio chimes on question palette selection, 5-minute countdown alert, and submission confirmation.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEffects}
                onChange={(e) => setSettings({ ...settings, soundEffects: e.target.checked })}
                className="mt-1 rounded bg-navy-900 border-slate-700 text-defence-600 focus:ring-defence-500 w-5 h-5 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Platform Banner Notice */}
        <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-gold-400" />
            <span>Platform Broadcast Notice Banner</span>
          </h3>

          <div className="space-y-2 text-xs">
            <label className="block text-slate-400">
              Notice displayed to cadets on the dashboard and live exam instructions:
            </label>
            <textarea
              rows={3}
              value={settings.platformNotice}
              onChange={(e) => setSettings({ ...settings, platformNotice: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-600 focus:border-defence-500 focus:outline-none"
              placeholder="Enter announcement text..."
            />
          </div>
        </div>


        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 sm:p-8 rounded-3xl bg-red-950/20 border border-red-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Reset Demo Database (Factory Defaults)</h3>
            <p className="text-xs text-slate-400">
              Restores default questions, 20 sample cadets, test definitions, and initial mock scorecards.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="py-3 px-6 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          Reset All Data to Demo Defaults
        </button>
      </div>
    </div>
  );
};
