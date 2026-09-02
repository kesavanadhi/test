import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Clock,
  Award,
  Search,
  Filter,
  ArrowRight,
  Zap,
  Lock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  ShieldAlert,
  Link2,
  Share2,
  Package,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MockTest, ExamCategory } from '../../types';

export const MockTestList: React.FC = () => {
  const { tests, submissions, cadets } = useData();
  const { cadetUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedExam, setSelectedExam] = useState<'All' | ExamCategory>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Always resolve latest cadet data from central state
  const currentCadet = cadets.find(
    (c) => c.cadetId.toLowerCase() === cadetUser?.cadetId.toLowerCase() || c.id === cadetUser?.id
  ) || cadetUser;

  const completedTestIds = new Set(
    submissions
      .filter((s) => s.cadetId === currentCadet?.cadetId || s.cadetName === currentCadet?.name)
      .map((s) => s.testId)
  );

  const checkIsTestLocked = (test: MockTest): boolean => {
    // 1. Locked by admin status (Draft or Disabled)
    if (test.status === 'Draft' || test.status === 'Disabled') {
      return true;
    }
    // 2. Locked by Admin Access Control for this specific cadet
    if (currentCadet?.accessibleTestIds && currentCadet.accessibleTestIds.length > 0) {
      if (!currentCadet.accessibleTestIds.includes(test.id)) {
        return true;
      }
    }
    return false;
  };

  const filteredTests = tests.filter((test) => {
    if (selectedExam !== 'All' && test.exam !== selectedExam) return false;

    const isCompleted = completedTestIds.has(test.id);
    const isLocked = checkIsTestLocked(test);
    const isUpcoming = test.status === 'Scheduled';

    // Status filter
    if (selectedStatus === 'Completed' && !isCompleted) return false;
    if (selectedStatus === 'Available' && (isCompleted || isLocked || isUpcoming)) return false;
    if (selectedStatus === 'Locked' && !isLocked) return false;
    if (selectedStatus === 'Upcoming' && !isUpcoming) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        test.name.toLowerCase().includes(q) ||
        test.subject.toLowerCase().includes(q) ||
        test.exam.toLowerCase().includes(q)
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
            Mock Examination Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Attempt timed CDS & AFCAT tests matching official UPSC & IAF computer-based test formats.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Total Tests: <strong className="text-defence-400">{tests.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Completed: <strong className="text-gold-400">{completedTestIds.size}</strong>
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        {/* Exam Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-slate-800 self-start">
          {(['All', 'CDS', 'AFCAT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedExam(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedExam === tab
                  ? 'bg-defence-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Exams' : tab}
            </button>
          ))}
        </div>

        {/* Status & Search */}
        <div className="flex flex-wrap items-center gap-3 flex-1 md:justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tests by name or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-defence-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="text-center py-16 bg-navy-900/60 rounded-3xl border border-slate-800 space-y-3">
          <FileCheck2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Mock Tests Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your exam category or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isCompleted = completedTestIds.has(test.id);
            const isLocked = checkIsTestLocked(test);
            const isUpcoming = test.status === 'Scheduled';

            return (
              <div
                key={test.id}
                className={`rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all group ${
                  isLocked
                    ? 'bg-navy-950/70 border-slate-850 opacity-80'
                    : 'bg-navy-900/90 border-slate-800 hover:border-defence-500/40 hover:shadow-2xl'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Exam badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-defence-900 text-defence-400 border border-defence-600/30">
                      {test.exam}
                    </span>

                    {isCompleted ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : isUpcoming ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                        Upcoming
                      </span>
                    ) : isLocked ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-400 text-[10px] font-bold border border-red-500/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked by Admin
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-defence-950 text-defence-400 text-[10px] font-bold border border-defence-500/30">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Title & Subject */}
                  <div>
                    <h3 className={`font-bold text-lg transition-colors tracking-wide leading-snug ${isLocked ? 'text-slate-300' : 'text-white group-hover:text-defence-300'}`}>
                      {test.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Subject: {test.subject}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {test.description}
                  </p>

                  {/* Test Metadata */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-navy-950/80 border border-slate-800/80 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-defence-400" />
                      <span>{test.durationMinutes} Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-gold-400" />
                      <span>{test.totalMarks} Marks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileCheck2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.questionsCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-bold text-xs">-</span>
                      <span>-{test.negativeMarking} Negative</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 mt-4 border-t border-slate-800/80 space-y-2">
                  {isCompleted ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          to="/cadet/results"
                          className="py-2.5 px-3 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-bold text-xs uppercase tracking-wider text-center transition-all"
                        >
                          View Result
                        </Link>
                        <Link
                          to="/cadet/review"
                          className="py-2.5 px-3 rounded-xl bg-defence-800 hover:bg-defence-700 text-defence-100 font-bold text-xs uppercase tracking-wider text-center transition-all"
                        >
                          Review
                        </Link>
                      </div>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/cadet/instructions/${test.id}`;
                          navigator.clipboard.writeText(url);
                          showToast('success', 'Test Link Copied', `Direct link for ${test.name} copied to clipboard!`);
                        }}
                        className="w-full py-2 rounded-xl bg-navy-950 hover:bg-navy-850 text-slate-400 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition-all"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>Copy Shareable Test Link</span>
                      </button>
                    </div>
                  ) : isLocked ? (
                    <div className="p-3 rounded-xl bg-navy-950 border border-red-500/30 text-center space-y-2">
                      <div className="text-[11px] font-bold text-red-300 flex items-center justify-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-red-400" />
                        <span>Paper Locked</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Access is restricted for your current package tier or account.
                      </p>
                      <Link
                        to="/cadet/packages"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-defence-400 hover:underline pt-1"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Explore / Upgrade Packages</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to={`/cadet/instructions/${test.id}`}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg shadow-defence-950/60 transition-all hover:scale-[1.01]"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Start Test</span>
                      </Link>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/cadet/instructions/${test.id}`;
                          navigator.clipboard.writeText(url);
                          showToast('success', 'Test Link Copied', `Direct test link copied to clipboard!`);
                        }}
                        className="w-full py-1.5 rounded-xl text-slate-400 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-navy-850 transition-all"
                      >
                        <Link2 className="w-3 h-3 text-gold-400" />
                        <span>Copy Direct Link</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};