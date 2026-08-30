import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Award,
  Shield,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  Filter,
  Flame,
  Target,
  Clock,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { ScoreProgressionChart, SubjectPerformanceChart, CorrectWrongDonutChart } from '../../components/analytics';
import * as XLSX from 'xlsx';

export const AdminAnalyticsPage: React.FC = () => {
  const { cadets, tests, submissions, questions } = useData();
  const { showToast } = useToast();
  const [selectedExam, setSelectedExam] = useState<'All' | 'CDS' | 'AFCAT'>('All');

  // Filter submissions by exam
  const filteredSubmissions = submissions.filter((s) => {
    if (selectedExam === 'All') return true;
    return s.exam === selectedExam;
  });

  const totalAttempts = filteredSubmissions.length;
  const passedAttempts = filteredSubmissions.filter((s) => s.passed).length;
  const passRatio = totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 1000) / 10 : 0;
  const avgScore = totalAttempts > 0
    ? Math.round((filteredSubmissions.reduce((acc, s) => acc + s.percentage, 0) / totalAttempts) * 10) / 10
    : 0;

  const totalCorrect = filteredSubmissions.reduce((acc, s) => acc + s.correctCount, 0);
  const totalWrong = filteredSubmissions.reduce((acc, s) => acc + s.wrongCount, 0);
  const totalUnanswered = filteredSubmissions.reduce((acc, s) => acc + s.unansweredCount, 0);

  // Subject-wise performance dynamically calculated from submissions
  const subjectMap = new Map<string, { total: number; correct: number }>();
  filteredSubmissions.forEach((s) => {
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

  // Chart data from actual submissions
  const scoreProgressionData = filteredSubmissions.slice(0, 10).map((s, idx) => ({
    testName: `Sub #${idx + 1}`,
    score: s.score,
    percentage: s.percentage,
    date: new Date(s.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
  })).reverse();


  // Export Analytics to Excel
  const handleExportReport = () => {
    try {
      const summarySheetData = [
        { Metric: 'Total Tests Attempted', Value: totalAttempts },
        { Metric: 'Average Platform Score (%)', Value: avgScore },
        { Metric: 'Overall Pass Rate (%)', Value: passRatio },
        { Metric: 'Total Registered Cadets', Value: cadets.length },
        { Metric: 'Active Question Bank Size', Value: questions.length },
        { Metric: 'Total Mock Tests Configured', Value: tests.length },
      ];

      const submissionsSheetData = filteredSubmissions.map((s) => ({
        SubmissionID: s.id,
        CadetID: s.cadetId,
        CadetName: s.cadetName,
        Exam: s.exam,
        TestName: s.testName,
        Score: s.score,
        MaxScore: s.maxScore,
        Percentage: `${s.percentage}%`,
        Accuracy: `${s.accuracy}%`,
        Status: s.passed ? 'PASSED' : 'FAILED',
        TimeTakenSeconds: s.timeTakenSeconds,
        SubmittedAt: s.submittedAt,
      }));

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.json_to_sheet(summarySheetData);
      const wsSubmissions = XLSX.utils.json_to_sheet(submissionsSheetData);

      XLSX.utils.book_append_sheet(wb, wsSummary, 'Analytics Summary');
      XLSX.utils.book_append_sheet(wb, wsSubmissions, 'Submissions Detail');

      XLSX.writeFile(wb, `WARRIOR_Platform_Analytics_${selectedExam}_${new Date().toISOString().slice(0, 10)}.xlsx`);
      showToast('success', 'Report Exported', 'Analytics spreadsheet downloaded successfully.');
    } catch (err) {
      showToast('error', 'Export Failed', 'Unable to generate analytics Excel file.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-gold-400" />
            <span>Platform Performance & Test Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregate diagnostics across cadet test attempts, score distributions, and accuracy benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-navy-900 border border-slate-800">
            {(['All', 'CDS', 'AFCAT'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setSelectedExam(ex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedExam === ex
                    ? 'bg-defence-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4 text-defence-400" />
            <span>Export XLSX</span>
          </button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Attempts</p>
          <p className="text-3xl font-black text-white mt-1">{totalAttempts}</p>
          <p className="text-[10px] text-slate-500 mt-1">Live & Recorded Submissions</p>
        </div>

        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Score</p>
          <p className="text-3xl font-black text-gold-400 mt-1">{avgScore}%</p>
          <p className="text-[10px] text-slate-500 mt-1">Across all {selectedExam} attempts</p>
        </div>

        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Ratio</p>
          <p className="text-3xl font-black text-defence-400 mt-1">{passRatio}%</p>
          <p className="text-[10px] text-slate-500 mt-1">{passedAttempts} qualified candidates</p>
        </div>

        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Question Pool</p>
          <p className="text-3xl font-black text-white mt-1">{questions.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">High-yield Defence MCQs</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Score Progression Trend</span>
            <span className="text-xs font-normal text-slate-400">Latest 10 Test Submissions</span>
          </h3>
          <ScoreProgressionChart data={scoreProgressionData} />
        </div>

        <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Overall Accuracy Distribution
          </h3>
          <CorrectWrongDonutChart correct={totalCorrect} wrong={totalWrong} unanswered={totalUnanswered} />
        </div>
      </div>

      {/* Subject Wise Performance Aggregate */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Subject-Wise Performance & Accuracy Benchmarks
        </h3>
        <SubjectPerformanceChart data={subjectPerformanceData} />
      </div>

      {/* Top Cadet Scorers Leaderboard Snapshot */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-gold-400" />
          <span>Top Cadet Performers (Nationwide Top Ranks)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Rank</th>
                <th className="pb-3">Cadet Name</th>
                <th className="pb-3">Cadet ID</th>
                <th className="pb-3">Target Exam</th>
                <th className="pb-3 text-center">Tests Taken</th>
                <th className="pb-3 text-right">Avg Score</th>
                <th className="pb-3 text-right">Best Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {cadets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No cadet performers registered yet.
                  </td>
                </tr>
              ) : (
                [...cadets]
                  .sort((a, b) => b.bestScore - a.bestScore)
                  .slice(0, 5)
                  .map((cadet, idx) => (
                    <tr key={cadet.id} className="hover:bg-navy-850/40">
                      <td className="py-3 font-bold text-gold-400">#{idx + 1}</td>
                      <td className="py-3 font-semibold text-white">{cadet.name}</td>
                      <td className="py-3 font-mono text-slate-400">{cadet.cadetId}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded bg-navy-950 text-defence-400 border border-defence-600/30 text-[10px] font-bold uppercase">
                          {cadet.targetExam}
                        </span>
                      </td>
                      <td className="py-3 text-center font-bold">{cadet.testsCompleted}</td>
                      <td className="py-3 text-right font-mono text-slate-200">{cadet.averageScore}%</td>
                      <td className="py-3 text-right font-mono font-bold text-defence-400">{cadet.bestScore}%</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
