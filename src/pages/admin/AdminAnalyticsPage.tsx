import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Shield, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { ScoreProgressionChart, SubjectPerformanceChart, CorrectWrongDonutChart } from '../../components/analytics';

export const AdminAnalyticsPage: React.FC = () => {
  const { cadets, tests, submissions, questions } = useData();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          Platform Performance & Test Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Aggregate analytics across cadet attempts, question difficulty indexes, and pass percentage distributions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tests Attempted</p>
          <p className="text-3xl font-black text-white mt-1">{submissions.length}</p>
        </div>
        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Platform Score</p>
          <p className="text-3xl font-black text-gold-400 mt-1">79.2%</p>
        </div>
        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pass Ratio</p>
          <p className="text-3xl font-black text-defence-400 mt-1">86.4%</p>
        </div>
        <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Question Bank</p>
          <p className="text-3xl font-black text-white mt-1">{questions.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Test Participation & Score Distributions</h3>
          <ScoreProgressionChart data={[]} />
        </div>

        <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform Question Accuracy</h3>
          <CorrectWrongDonutChart correct={320} wrong={45} unanswered={15} />
        </div>
      </div>

      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Subject-Wise Performance Aggregate</h3>
        <SubjectPerformanceChart />
      </div>
    </div>
  );
};
