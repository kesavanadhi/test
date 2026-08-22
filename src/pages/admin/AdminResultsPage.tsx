import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatTimeSeconds } from '../../utils/formatters';
import { TestSubmission } from '../../types';

export const AdminResultsPage: React.FC = () => {
  const { submissions } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState<'All' | 'CDS' | 'AFCAT'>('All');
  const [inspectSubmission, setInspectSubmission] = useState<TestSubmission | null>(null);

  const filteredSubmissions = submissions.filter((s) => {
    if (examFilter !== 'All' && s.exam !== examFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.cadetName.toLowerCase().includes(q) ||
        s.cadetId.toLowerCase().includes(q) ||
        s.testName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    showToast('success', 'CSV Report Exported', 'Simulated download: warrior_cadet_results.csv');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Examination Results & Evaluation Roster
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review test submissions, scores, accuracy percentages, and answer sheets across all cadets.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all self-start sm:self-auto shadow"
        >
          <Download className="w-4 h-4 text-defence-400" />
          <span>Export Results (CSV)</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-slate-800 self-start">
          {(['All', 'CDS', 'AFCAT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setExamFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                examFilter === tab
                  ? 'bg-defence-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search cadet name, ID, or test title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
          />
        </div>
      </div>

      {/* Results Table (Requirement #46) */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Cadet Candidate</th>
                <th className="py-4 px-3">Exam</th>
                <th className="py-4 px-6">Test Name</th>
                <th className="py-4 px-4">Score</th>
                <th className="py-4 px-4">Percentage</th>
                <th className="py-4 px-4">Correct/Wrong</th>
                <th className="py-4 px-4">Time Taken</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-4 px-6">
                    <p className="font-bold text-white">{sub.cadetName}</p>
                    <p className="text-[10px] font-mono text-slate-400">{sub.cadetId}</p>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-navy-950 text-defence-400 border border-defence-600/30">
                      {sub.exam}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-slate-200 max-w-xs truncate">{sub.testName}</td>
                  <td className="py-4 px-4 font-black text-white">{sub.score} / {sub.maxScore}</td>
                  <td className="py-4 px-4 font-bold text-defence-400">{sub.percentage}%</td>
                  <td className="py-4 px-4 text-slate-300">
                    <span className="text-defence-400">{sub.correctCount}C</span> / <span className="text-red-400">{sub.wrongCount}W</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{formatTimeSeconds(sub.timeTakenSeconds)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.passed ? 'bg-defence-950 text-defence-300 border border-defence-500/30' : 'bg-red-950 text-red-300 border border-red-500/30'
                    }`}>
                      {sub.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setInspectSubmission(sub)}
                      className="px-3 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-[11px]"
                    >
                      Inspect Sheet
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {inspectSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white font-display">Cadet Answer Sheet Evaluation</h3>
                <p className="text-xs text-slate-400">{inspectSubmission.cadetName} • {inspectSubmission.testName}</p>
              </div>
              <button onClick={() => setInspectSubmission(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-xl font-black text-defence-400">{inspectSubmission.score}</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">Score</p>
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-xl font-black text-white">{inspectSubmission.percentage}%</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">Percentage</p>
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-xl font-black text-gold-400">{inspectSubmission.accuracy}%</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">Accuracy</p>
              </div>
            </div>

            <div className="p-4 bg-navy-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Correct:</span>
                <span className="font-bold text-defence-400">{inspectSubmission.correctCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Incorrect:</span>
                <span className="font-bold text-red-400">{inspectSubmission.wrongCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Unanswered:</span>
                <span className="font-bold text-slate-300">{inspectSubmission.unansweredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time Taken:</span>
                <span className="font-bold text-white">{formatTimeSeconds(inspectSubmission.timeTakenSeconds)}</span>
              </div>
            </div>

            <button
              onClick={() => setInspectSubmission(null)}
              className="w-full py-3 rounded-xl bg-defence-700 text-white font-bold text-xs uppercase"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
