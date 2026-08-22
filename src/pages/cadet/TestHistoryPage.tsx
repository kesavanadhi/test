import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Award,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTimeSeconds } from '../../utils/formatters';

export const TestHistoryPage: React.FC = () => {
  const { submissions } = useData();
  const { cadetUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState<'All' | 'CDS' | 'AFCAT'>('All');

  const cadetSubmissions = submissions.filter(
    (s) => s.cadetId === cadetUser?.cadetId || s.cadetName === cadetUser?.name
  );

  const filteredHistory = cadetSubmissions.filter((s) => {
    if (examFilter !== 'All' && s.exam !== examFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.testName.toLowerCase().includes(q) ||
        s.subject.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Examination History & Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete archive of your attempted CDS & AFCAT mock tests and scorecards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Total Attempts: <strong className="text-defence-400">{cadetSubmissions.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-slate-800">
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
            placeholder="Search by test name or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs space-y-2">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <p>No examination records match your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Test Name</th>
                  <th className="py-4 px-4">Exam</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Score</th>
                  <th className="py-4 px-4">Percentage</th>
                  <th className="py-4 px-4">Time Taken</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map((sub) => (
                  <tr key={sub.id} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-white max-w-xs truncate">
                      {sub.testName}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-defence-900 text-defence-400 border border-defence-600/30">
                        {sub.exam}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400">{formatDate(sub.submittedAt)}</td>
                    <td className="py-4 px-4 font-bold text-white">
                      {sub.score} / {sub.maxScore}
                    </td>
                    <td className="py-4 px-4 font-bold text-defence-400">{sub.percentage}%</td>
                    <td className="py-4 px-4 text-slate-300 font-mono">
                      {formatTimeSeconds(sub.timeTakenSeconds)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.passed
                          ? 'bg-defence-950 text-defence-300 border border-defence-500/30'
                          : 'bg-red-950 text-red-300 border border-red-500/30'
                      }`}>
                        {sub.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        to="/cadet/results"
                        className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-xs transition-all inline-block"
                      >
                        Result
                      </Link>
                      <Link
                        to="/cadet/review"
                        className="px-3 py-1.5 rounded-lg bg-defence-800 hover:bg-defence-700 text-defence-100 font-semibold text-xs transition-all inline-block"
                      >
                        Review Answers
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
