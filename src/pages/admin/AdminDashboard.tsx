import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  FileCheck2,
  HelpCircle,
  Award,
  TrendingUp,
  Activity,
  PlusCircle,
  FolderLock,
  ArrowRight,
  CheckCircle2,
  Clock,
  Shield,
  FileSpreadsheet,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/formatters';
import { ActiveSession } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    cadets,
    tests,
    questions,
    submissions,
    activeCadetsSummary,
    simulatedLiveSessions,
  } = useData();

  const totalCadets = cadets.length;
  const activeCadets = activeCadetsSummary.totalOnline;
  const testsCreated = tests.length;
  const totalQuestions = questions.length;
  const testsCompleted = submissions.length;

  const avgScore = submissions.length > 0
    ? Math.round((submissions.reduce((a, b) => a + b.percentage, 0) / submissions.length) * 10) / 10
    : 0;

  const passRate = submissions.length > 0
    ? Math.round((submissions.filter((s) => s.passed).length / submissions.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-950 text-gold-400 border border-amber-500/30">
              Officer Master Portal
            </span>
            <span className="text-xs text-slate-400">Command & Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Admin Command Dashboard
          </h1>
        </div>


        <div className="flex flex-wrap items-center gap-3">

          <Link
            to="/admin/dataset"
            className="px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Upload Dataset (CSV/XLS)</span>
          </Link>
          <Link
            to="/admin/add-questions"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 flex items-center gap-2 transition-all hover:scale-105 border border-defence-400/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Questions (Slash)</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Statistics (Requirement #30) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Cadets</p>
          <p className="text-2xl font-black text-white mt-1">{totalCadets}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Cadets</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{activeCadets}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tests Created</p>
          <p className="text-2xl font-black text-white mt-1">{testsCreated}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Bank</p>
          <p className="text-2xl font-black text-gold-400 mt-1">{totalQuestions}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tests Completed</p>
          <p className="text-2xl font-black text-defence-400 mt-1">{testsCompleted}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Score</p>
          <p className="text-2xl font-black text-white mt-1">{avgScore}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pass Rate</p>
          <p className="text-2xl font-black text-defence-400 mt-1">{passRate}%</p>
        </div>
      </div>

      {/* Live Cadet Activity Monitor Snippet (Requirement #41, #42) */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Live Cadet Activity Monitor
              </h2>
              <p className="text-xs text-slate-400">Real-time candidate telemetry across ongoing mock exams</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300">
              Online: <strong className="text-emerald-400">{activeCadetsSummary.totalOnline}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300">
              Writing Test: <strong className="text-amber-400">{activeCadetsSummary.writingTest}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300">
              Browsing: <strong className="text-slate-300">{activeCadetsSummary.browsingDashboard}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-slate-300">
              Logged Out: <strong className="text-slate-500">{activeCadetsSummary.recentlyLoggedOut}</strong>
            </div>
          </div>
        </div>

        {/* Live Table */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Cadet ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-3">Exam</th>
                <th className="py-3.5 px-4">Current Test / View</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Login Time</th>
                <th className="py-3.5 px-4">Time Left</th>
                <th className="py-3.5 px-4 text-right">Live Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {simulatedLiveSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No active cadet sessions currently online.
                  </td>
                </tr>
              ) : (
                simulatedLiveSessions.slice(0, 6).map((act: ActiveSession) => (
                  <tr key={act.sessionId} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-300">{act.cadetId}</td>
                    <td className="py-3 px-4 font-semibold text-white">{act.cadetName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950 text-defence-400 border border-defence-600/30">
                        {act.currentExam || 'AFCAT'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{act.currentTest || act.currentPage}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        act.status === 'Writing Test'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse'
                          : act.status === 'Online'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : act.status === 'Completed'
                          ? 'bg-defence-950 text-defence-300 border border-defence-500/30'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{act.loginTime}</td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {act.timeRemaining || '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {act.score ? `${act.score} pts` : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        <div className="text-right pt-2">
          <Link to="/admin/activity" className="text-xs font-semibold text-defence-400 hover:underline inline-flex items-center gap-1">
            <span>View Full Real-Time Active Cadet Monitor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};