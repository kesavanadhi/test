import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Trophy,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check,
  X,
  FileCheck2,
  Sparkles,
} from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { useData } from '../../context/DataContext';
import { formatTimeSeconds } from '../../utils/formatters';
import { CorrectWrongDonutChart } from '../../components/analytics';

export const ResultPage: React.FC = () => {
  const { latestResult } = useExam();
  const { submissions } = useData();
  const navigate = useNavigate();

  // If latestResult from memory isn't present, take the most recent submission from data
  const resultData = latestResult || (submissions.length > 0 ? {
    submission: submissions[0],
    breakdown: {
      correctCount: submissions[0].correctCount,
      wrongCount: submissions[0].wrongCount,
      unansweredCount: submissions[0].unansweredCount,
      markedForReviewCount: submissions[0].markedForReviewCount,
      totalQuestions: Object.keys(submissions[0].answers).length,
      score: submissions[0].score,
      maxScore: submissions[0].maxScore,
      percentage: submissions[0].percentage,
      accuracy: submissions[0].accuracy,
      passed: submissions[0].passed,
      marksGained: submissions[0].correctCount * 1,
      marksLost: submissions[0].wrongCount * 0.33,
      subjectWise: {},
    }
  } : null);

  if (!resultData) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Result Available</h2>
        <p className="text-xs text-slate-400">Please attempt a mock test first.</p>
        <Link to="/cadet/mock-tests" className="px-6 py-2.5 rounded-xl bg-defence-700 text-white text-xs font-bold uppercase inline-block">
          Explore Tests
        </Link>
      </div>
    );
  }

  const { submission, breakdown } = resultData;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Result Hero Header */}
      <div className={`relative rounded-3xl p-6 sm:p-10 border shadow-2xl overflow-hidden ${
        submission.passed
          ? 'bg-gradient-to-r from-defence-950 via-navy-900 to-navy-950 border-defence-500/40'
          : 'bg-gradient-to-r from-red-950/60 via-navy-900 to-navy-950 border-red-500/40'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-navy-950 text-defence-400 border border-defence-600/30">
                {submission.exam}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                submission.passed
                  ? 'bg-defence-500 text-white shadow-lg'
                  : 'bg-red-600 text-white'
              }`}>
                {submission.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                {submission.passed ? 'QUALIFIED / PASSED' : 'NOT QUALIFIED'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white font-display">
              {submission.testName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Candidate: <strong className="text-white">{submission.cadetName}</strong> ({submission.cadetId})
            </p>
          </div>

          {/* Big Scorecard Display */}
          <div className="flex items-center gap-4 bg-navy-950/90 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-2xl">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Final Score</p>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {submission.score} <span className="text-lg text-slate-500 font-normal">/ {submission.maxScore}</span>
              </p>
            </div>
            <div className="w-px h-12 bg-slate-800" />
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Percentage</p>
              <p className={`text-3xl sm:text-4xl font-black ${submission.passed ? 'text-defence-400' : 'text-red-400'}`}>
                {submission.percentage}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Calculation Breakdown (Requirement #51) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-navy-900/90 border border-slate-800 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-gold-400" />
          <span>Detailed Score Calculation Scheme</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Correct Answers</span>
            <span className="text-lg font-bold text-defence-400">
              {submission.correctCount} × +{submission.exam === 'AFCAT' ? 3 : 1} = +{breakdown.marksGained || (submission.correctCount * 1)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Incorrect Answers</span>
            <span className="text-lg font-bold text-red-400">
              {submission.wrongCount} × -{submission.exam === 'AFCAT' ? 1 : 0.33} = -{breakdown.marksLost ? breakdown.marksLost.toFixed(2) : (submission.wrongCount * 0.33).toFixed(2)}
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">Unanswered</span>
            <span className="text-lg font-bold text-slate-400">
              {submission.unansweredCount} × 0 = 0.00
            </span>
          </div>
          <div className="p-3.5 rounded-xl bg-navy-950 border border-defence-500/40">
            <span className="text-defence-400 block text-[11px] font-bold">Net Final Score</span>
            <span className="text-lg font-black text-white">
              {submission.score} Marks
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid & Accuracy Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4 Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-defence-950/80 border border-defence-500/40 flex items-center justify-center text-defence-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Correct Answers</p>
              <p className="text-2xl font-black text-defence-400 mt-1">{submission.correctCount}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Wrong Answers</p>
              <p className="text-2xl font-black text-red-400 mt-1">{submission.wrongCount}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-slate-700 flex items-center justify-center text-gold-400 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Accuracy Rate</p>
              <p className="text-2xl font-black text-gold-400 mt-1">{submission.accuracy}%</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-navy-950 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Time Taken</p>
              <p className="text-2xl font-black text-white mt-1">{formatTimeSeconds(submission.timeTakenSeconds)}</p>
            </div>
          </div>
        </div>

        {/* Accuracy Donut */}
        <div className="rounded-2xl bg-navy-900/80 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
            Performance Breakdown
          </h3>
          <CorrectWrongDonutChart
            correct={submission.correctCount}
            wrong={submission.wrongCount}
            unanswered={submission.unansweredCount}
          />
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          to="/cadet/review"
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 border border-defence-400/40 flex items-center gap-2 transition-all hover:scale-105"
        >
          <BookOpen className="w-4 h-4" />
          <span>Review Step-by-Step Answers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/cadet/mock-tests"
          className="px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Attempt Another Test</span>
        </Link>

        <Link
          to="/cadet/dashboard"
          className="px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all"
        >
          Cadet Dashboard
        </Link>
      </div>
    </div>
  );
};
