import React, { useState } from 'react';
import {
  Activity,
  Shield,
  Clock,
  Users,
  Search,
  Filter,
  LogOut,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  X,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ActiveSession, Cadet } from '../../types';

export const LiveActivityPage: React.FC = () => {
  const { simulatedLiveSessions, activeCadetsSummary, cadets } = useData();
  const { activeSessions: realActiveSessions, activityLogs, logoutActiveSession } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedTestFilter, setSelectedTestFilter] = useState<string | null>(null);
  const [inspectSession, setInspectSession] = useState<ActiveSession | null>(null);

  // Combine real sessions with simulated sessions for high-volume realistic dashboard
  const combinedSessions: ActiveSession[] = [
    ...realActiveSessions,
    ...simulatedLiveSessions.filter((s) => !realActiveSessions.some((r) => r.cadetId === s.cadetId)),
  ];

  // Test distribution counters dynamically calculated from registered cadets sessions
  const testDistribution = [
    {
      name: 'AFCAT Mock Test 01',
      exam: 'AFCAT',
      cadetsCount: combinedSessions.filter((s) => s.currentTest === 'AFCAT Mock Test 01').length,
    },
    {
      name: 'AFCAT Mock Test 02',
      exam: 'AFCAT',
      cadetsCount: combinedSessions.filter((s) => s.currentTest === 'AFCAT Mock Test 02').length,
    },
    {
      name: 'CDS Mock Test 01',
      exam: 'CDS',
      cadetsCount: combinedSessions.filter((s) => s.currentTest === 'CDS Mock Test 01').length,
    },
    {
      name: 'CDS General Knowledge Mock',
      exam: 'CDS',
      cadetsCount: combinedSessions.filter((s) => s.currentTest === 'CDS General Knowledge Mock').length,
    },
  ];

  const filteredSessions = combinedSessions.filter((s) => {
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    if (selectedTestFilter && s.currentTest !== selectedTestFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.cadetName.toLowerCase().includes(q) ||
        s.cadetId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.currentTest || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRemoteLogout = (cadetId: string, name: string) => {
    logoutActiveSession(cadetId);
    showToast('info', 'Session Terminated', `Active session for ${name} (${cadetId}) was logged out.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Live Cadet Activity Monitor
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry across ongoing mock exams, active sessions, and candidate test progression.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5 shadow">
            <Activity className="w-4 h-4 animate-pulse" /> Live Telemetry Engine Active
          </span>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards (Requirement #41) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cadets</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{activeCadetsSummary.totalOnline}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Online Now</p>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{activeCadetsSummary.totalOnline}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Writing Test</p>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1">{activeCadetsSummary.writingTest}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Idle Cadets</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-300 mt-1">{activeCadetsSummary.idle}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-defence-400">Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-defence-400 mt-1">{activeCadetsSummary.completed}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Offline</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-500 mt-1">{activeCadetsSummary.recentlyLoggedOut}</p>
        </div>
      </div>

      {/* Live Test Monitoring Distribution Breakdown (Requirement #45) */}
      <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-gold-400" />
            <span>Live Concurrent Mock Test Attempt Distribution</span>
          </h3>
          {selectedTestFilter && (
            <button
              onClick={() => setSelectedTestFilter(null)}
              className="text-[11px] text-defence-400 hover:underline"
            >
              Clear Filter ({selectedTestFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {testDistribution.map((t) => (
            <div
              key={t.name}
              onClick={() => setSelectedTestFilter(selectedTestFilter === t.name ? null : t.name)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                selectedTestFilter === t.name
                  ? 'bg-defence-950/80 border-defence-500 text-white shadow-lg'
                  : 'bg-navy-950/80 border-slate-800/80 text-slate-300 hover:bg-navy-850'
              }`}
            >
              <div>
                <p className="font-bold text-xs text-white truncate max-w-[170px]">{t.name}</p>
                <span className="text-[10px] font-extrabold uppercase text-defence-400">{t.exam}</span>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-navy-900 border border-slate-700 text-xs font-black text-amber-400">
                {t.cadetsCount} Cadets
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Active Cadets Table (8 cols) + Live Activity Feed (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Cadets Table (Requirement #42) */}
        <div className="lg:col-span-8 rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Cadet Sessions ({filteredSessions.length})
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-300 focus:border-defence-500"
              >
                <option value="All">All Statuses</option>
                <option value="Writing Test">Writing Test</option>
                <option value="Online">Online</option>
                <option value="Idle">Idle</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search live sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Cadet ID</th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-3">Exam</th>
                  <th className="py-3.5 px-4">Current Test / Module</th>
                  <th className="py-3.5 px-3">Question</th>
                  <th className="py-3.5 px-3">Time Left</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredSessions.map((s) => (
                  <tr key={s.sessionId} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-3 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        s.status === 'Writing Test'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          : s.status === 'Online'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : s.status === 'Completed'
                          ? 'bg-defence-950 text-defence-300 border border-defence-500/30'
                          : s.status === 'Idle'
                          ? 'bg-slate-900 text-slate-400 border border-slate-700'
                          : 'bg-red-950/40 text-red-400 border border-red-500/30'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">
                      <button onClick={() => setInspectSession(s)} className="hover:text-defence-300 underline">
                        {s.cadetId}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-white truncate max-w-[130px]">{s.cadetName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950 text-defence-400 border border-defence-600/30">
                        {s.currentExam || 'CDS'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-[150px]">{s.currentTest || s.currentPage}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{s.currentQuestion || '—'}</td>
                    <td className="py-3 px-3 font-mono text-amber-400 font-bold">{s.timeRemaining || '—'}</td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => setInspectSession(s)}
                        className="p-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-all inline-block"
                        title="Inspect Live Session Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoteLogout(s.cadetId, s.cadetName)}
                        className="p-1 rounded bg-navy-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all inline-block"
                        title="Terminate Active Session"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Feed (4 cols) (Requirement #46) */}
        <div className="lg:col-span-4 rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-defence-400" />
                <span>Live Activity Stream</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Auto-update</span>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
              {activityLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No recent activity logged.
                </div>
              ) : (
                activityLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-navy-950/80 border border-slate-800/80 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-mono text-defence-400">{log.timeFormatted}</span>
                      <span className="text-slate-500 font-mono">{log.cadetId}</span>
                    </div>
                    <p className="text-slate-200">
                      <strong className="text-white">{log.cadetName}</strong> {log.action}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* INSPECT ACTIVE SESSION DETAIL MODAL (Requirement #44) */}
      {inspectSession && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
                  {inspectSession.cadetId}
                </span>
                <h3 className="font-bold text-base text-white mt-1">{inspectSession.cadetName}</h3>
              </div>
              <button onClick={() => setInspectSession(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-navy-950 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Current Status:</span> <strong className="text-amber-400">{inspectSession.status}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Exam Stream:</span> <strong className="text-white">{inspectSession.currentExam || 'CDS / AFCAT'}</strong></div>
                <div className="flex justify-between"><span className="text-slate-400">Active Test:</span> <span className="text-slate-200">{inspectSession.currentTest || inspectSession.currentPage}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Current Question:</span> <span className="font-mono text-defence-400 font-bold">{inspectSession.currentQuestion || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Time Remaining:</span> <span className="font-mono text-amber-400 font-bold">{inspectSession.timeRemaining || '—'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Login Time:</span> <span className="text-slate-300">{inspectSession.loginTime}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Device / Browser:</span> <span className="text-slate-300">{inspectSession.device}</span></div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  handleRemoteLogout(inspectSession.cadetId, inspectSession.cadetName);
                  setInspectSession(null);
                }}
                className="flex-1 py-3 rounded-xl bg-red-900 hover:bg-red-800 text-white font-bold text-xs uppercase"
              >
                Logout Active Session
              </button>
              <button
                onClick={() => setInspectSession(null)}
                className="px-4 py-3 rounded-xl bg-navy-950 text-slate-300 border border-slate-700 text-xs font-semibold uppercase"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};