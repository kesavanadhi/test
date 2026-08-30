import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  Award,
  TrendingUp,
  Clock,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ScoreProgressionChart, SubjectPerformanceChart, CorrectWrongDonutChart } from '../../components/analytics';
import { formatDate } from '../../utils/formatters';

export const CadetDashboard: React.FC = () => {
  const { cadetUser } = useAuth();
  const { tests, submissions } = useData();
  const navigate = useNavigate();

  if (!cadetUser) return null;

  const cadetSubmissions = submissions.filter(
    (s) => s.cadetId === cadetUser.cadetId || s.cadetName === cadetUser.name
  );

  const availableTests = tests.filter((t) => t.status === 'Live');
  const testsCompletedCount = cadetSubmissions.length;
  const testsRemaining = Math.max(0, availableTests.length - testsCompletedCount);

  const avgScore = testsCompletedCount > 0
    ? Math.round((cadetSubmissions.reduce((a, b) => a + b.percentage, 0) / testsCompletedCount) * 10) / 10
    : 0;

  const highestScore = testsCompletedCount > 0
    ? Math.max(...cadetSubmissions.map((s) => s.percentage))
    : 0;

  // Overall totals for donut chart
  let totalCorrect = 0;
  let totalWrong = 0;
  let totalUnanswered = 0;

  cadetSubmissions.forEach((s) => {
    totalCorrect += s.correctCount;
    totalWrong += s.wrongCount;
    totalUnanswered += s.unansweredCount;
  });

  // Subject performance dynamically computed from cadet submissions
  const subjectMap = new Map<string, { total: number; correct: number }>();
  cadetSubmissions.forEach((s) => {
    const subj = s.subject || s.exam || 'General';
    const curr = subjectMap.get(subj) || { total: 0, correct: 0 };
    curr.total += (s.correctCount + s.wrongCount + s.unansweredCount);
    curr.correct += s.correctCount;
    subjectMap.set(subj, curr);
  });

  const subjectPerformanceData = Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    total: data.total,
  }));

  const chartData = cadetSubmissions.map((s, idx) => ({
    testName: `Test ${idx + 1}`,
    score: s.score,
    percentage: s.percentage,
    date: formatDate(s.submittedAt),
  })).reverse();


  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-defence-900 via-navy-900 to-navy-950 border border-defence-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-950/80 border border-defence-500/40 text-[11px] font-bold text-defence-400 uppercase tracking-wider">
              <span>Cadet ID: {cadetUser.cadetId}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              Welcome back, Cadet {cadetUser.name}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              You are on track for your target examination (<strong className="text-gold-400">{cadetUser.targetExam}</strong>). Keep up regular timed mock test practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/cadet/mock-tests"
              className="px-6 py-3.5 rounded-xl bg-defence-600 hover:bg-defence-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 border border-defence-400/40 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Zap className="w-4 h-4 text-gold-400" />
              <span>Start Mock Test</span>
            </Link>
            <Link
              to="/cadet/leaderboard"
              className="px-5 py-3.5 rounded-xl bg-navy-950/80 hover:bg-navy-900 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
            >
              <Trophy className="w-4 h-4 text-gold-400" />
              <span>National Rank #{cadetUser.rank}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tests Available</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1.5">{availableTests.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tests Completed</p>
          <p className="text-2xl sm:text-3xl font-black text-defence-400 mt-1.5">{testsCompletedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
          <p className="text-2xl sm:text-3xl font-black text-gold-400 mt-1.5">{avgScore}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Best Score</p>
          <p className="text-2xl sm:text-3xl font-black text-defence-400 mt-1.5">{highestScore}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tests Remaining</p>
          <p className="text-2xl sm:text-3xl font-black text-slate-300 mt-1.5">{testsRemaining}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Rank</p>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1.5">#{cadetUser.rank || 1}</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score Progression */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-900/80 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Score Progression</h3>
              <p className="text-xs text-slate-400">Your test performance percentage trajectory</p>
            </div>
            <span className="text-xs text-defence-400 font-semibold">Latest: {avgScore}%</span>
          </div>

          <ScoreProgressionChart data={chartData} />
        </div>

        {/* Correct vs Wrong vs Unanswered */}
        <div className="rounded-2xl bg-navy-900/80 border border-slate-800 p-5 sm:p-6 space-y-3 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Accuracy Breakdown</h3>
            <p className="text-xs text-slate-400">Total attempted questions distribution</p>
          </div>
          <CorrectWrongDonutChart
            correct={totalCorrect}
            wrong={totalWrong}
            unanswered={totalUnanswered}
          />
        </div>
      </div>

      {/* Subject Performance */}
      <div className="rounded-2xl bg-navy-900/80 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Subject-Wise Performance</h3>
            <p className="text-xs text-slate-400">Accuracy rate across CDS & AFCAT exam subjects</p>
          </div>
          <Link to="/cadet/performance" className="text-xs text-defence-400 hover:underline">
            Detailed Analytics
          </Link>
        </div>
        <SubjectPerformanceChart data={subjectPerformanceData} />
      </div>


      {/* Recently Completed Tests */}
      <div className="rounded-2xl bg-navy-900/80 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recently Attempted Tests</h3>
          <Link to="/cadet/history" className="text-xs text-defence-400 hover:underline">
            View All History ({cadetSubmissions.length})
          </Link>
        </div>

        {cadetSubmissions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No tests attempted yet. Start your first mock test today!
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Test Name</th>
                  <th className="py-3 px-4">Exam</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cadetSubmissions.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-navy-850/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{sub.testName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-defence-900 text-defence-400 border border-defence-600/30">
                        {sub.exam}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(sub.submittedAt)}</td>
                    <td className="py-3 px-4 font-bold text-white">{sub.score} / {sub.maxScore}</td>
                    <td className="py-3 px-4 font-bold text-defence-400">{sub.percentage}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${sub.passed ? 'bg-defence-900/80 text-defence-300 border border-defence-500/30' : 'bg-red-950 text-red-300 border border-red-500/30'}`}>
                        {sub.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to="/cadet/results"
                        className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-[11px]"
                      >
                        Result
                      </Link>
                      <Link
                        to="/cadet/review"
                        className="px-2.5 py-1 rounded bg-defence-800 hover:bg-defence-700 text-defence-100 font-semibold text-[11px]"
                      >
                        Review
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
