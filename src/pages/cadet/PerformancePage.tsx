import React from 'react';
import { BarChart3, TrendingUp, Award, Target, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ScoreProgressionChart, SubjectPerformanceChart, CorrectWrongDonutChart } from '../../components/analytics';
import { formatDate } from '../../utils/formatters';

export const PerformancePage: React.FC = () => {
  const { cadetUser } = useAuth();
  const { submissions } = useData();

  if (!cadetUser) return null;

  const cadetSubmissions = submissions.filter(
    (s) => s.cadetId === cadetUser.cadetId || s.cadetName === cadetUser.name
  );

  const scores = cadetSubmissions.map((s) => s.percentage);
  const highestScore = scores.length > 0 ? Math.max(...scores) : (cadetUser.bestScore || 0);
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  const overallAccuracy = cadetSubmissions.length > 0
    ? Math.round((cadetSubmissions.reduce((a, b) => a + b.accuracy, 0) / cadetSubmissions.length) * 10) / 10
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

  // Subject performance dynamically computed from submissions
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deep diagnostic insights into your accuracy, subject strengths, speed, and exam readiness.
        </p>
      </div>

      {/* 6 Key Performance Indicators (Requirement #20) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Average Score</p>
          <p className="text-2xl font-black text-gold-400 mt-1">{cadetUser.averageScore || 0}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Highest Score</p>
          <p className="text-2xl font-black text-defence-400 mt-1">{highestScore}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lowest Score</p>
          <p className="text-2xl font-black text-red-400 mt-1">{lowestScore}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Overall Accuracy</p>
          <p className="text-2xl font-black text-white mt-1">{overallAccuracy}%</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
          <p className="text-2xl font-black text-defence-400 mt-1">{cadetSubmissions.length > 0 ? '100%' : '0%'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Current Rank</p>
          <p className="text-2xl font-black text-white mt-1">#{cadetUser.rank || 1}</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Score Progression Over Time</h3>
          <ScoreProgressionChart data={chartData} />
        </div>

        <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Correct vs Wrong Ratio</h3>
          <CorrectWrongDonutChart correct={totalCorrect} wrong={totalWrong} unanswered={totalUnanswered} />
        </div>
      </div>

      {/* Subject Performance & CDS vs AFCAT Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Subject-Wise Strength Analysis</h3>
          <SubjectPerformanceChart data={subjectPerformanceData} />
        </div>

        <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-5 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">CDS vs AFCAT Readiness Index</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">CDS (UPSC Standard)</span>
                <span className="text-defence-400 font-bold">{overallAccuracy > 0 ? `${overallAccuracy}% Ready` : 'Not Started'}</span>
              </div>
              <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-defence-500 rounded-full" style={{ width: `${overallAccuracy}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">AFCAT (IAF CBT Standard)</span>
                <span className="text-gold-400 font-bold">{overallAccuracy > 0 ? `${overallAccuracy}% Ready` : 'Not Started'}</span>
              </div>
              <div className="w-full h-2.5 bg-navy-950 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gold-500 rounded-full" style={{ width: `${overallAccuracy}%` }} />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed mt-4">
              💡 <strong>Officer Recommendation:</strong> {cadetSubmissions.length > 0 ? 'Regular mock exam practice will improve sectional timing and accuracy.' : 'Complete your first full-length mock test to generate custom strength analysis and recommendations.'}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
