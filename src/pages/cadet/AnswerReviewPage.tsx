import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Filter,
  Check,
  X,
  BookOpen,
  Award,
} from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const AnswerReviewPage: React.FC = () => {
  const { latestResult, examQuestions } = useExam();
  const { submissions, questions: allQuestions } = useData();
  const { cadetUser } = useAuth();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Correct' | 'Incorrect' | 'Unanswered'>('All');

  const cadetSubmissions = submissions.filter(
    (s) => s.cadetId === cadetUser?.cadetId || s.cadetName === cadetUser?.name
  );

  const submission = latestResult?.submission || cadetSubmissions[0];


  // Resolve questions for this submission
  const reviewQuestions = examQuestions.length > 0
    ? examQuestions
    : Object.keys(submission?.answers || {}).map((qId) => allQuestions.find((q) => q.id === qId)).filter(Boolean) as typeof allQuestions;

  if (!submission || reviewQuestions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No Test Review Available</h2>
        <p className="text-xs text-slate-400">Please complete a mock test to review answers.</p>
        <Link to="/cadet/mock-tests" className="px-6 py-2.5 rounded-xl bg-defence-700 text-white text-xs font-bold uppercase inline-block">
          Explore Mock Tests
        </Link>
      </div>
    );
  }

  const filteredList = reviewQuestions.filter((q) => {
    const cadetAns = submission.answers[q.id];
    const isCorrect = cadetAns === q.correctAnswer;
    const isUnanswered = !cadetAns;

    if (filterStatus === 'Correct') return isCorrect;
    if (filterStatus === 'Incorrect') return !isUnanswered && !isCorrect;
    if (filterStatus === 'Unanswered') return isUnanswered;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/cadet/results" className="text-xs font-semibold text-defence-400 hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Scorecard
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Answer Review & Solutions
          </h1>
          <p className="text-xs text-slate-400">
            {submission.testName} • Score: <strong className="text-defence-400">{submission.score} / {submission.maxScore}</strong>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-navy-900 p-1.5 rounded-2xl border border-slate-800 self-start">
          {(['All', 'Correct', 'Incorrect', 'Unanswered'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === tab
                  ? 'bg-defence-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Review Questions List */}
      <div className="space-y-6">
        {filteredList.map((q, idx) => {
          const cadetAns = submission.answers[q.id];
          const isCorrect = cadetAns === q.correctAnswer;
          const isUnanswered = !cadetAns;

          return (
            <div
              key={q.id}
              className={`rounded-3xl bg-navy-900 border p-6 sm:p-7 space-y-5 shadow-xl transition-all ${
                isCorrect
                  ? 'border-defence-500/40'
                  : isUnanswered
                  ? 'border-slate-800'
                  : 'border-red-500/40'
              }`}
            >
              {/* Question Top Details */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-navy-950 text-white font-extrabold text-[11px] border border-slate-800">
                    Question {idx + 1}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Subject: <strong className="text-slate-200">{q.subject}</strong>
                  </span>
                  <span className="text-slate-400 font-medium hidden sm:inline">
                    Topic: <strong className="text-slate-200">{q.topic}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <span className="px-2.5 py-1 rounded-md bg-defence-950 text-defence-400 border border-defence-500/40 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Correct (+{q.marks})
                    </span>
                  ) : isUnanswered ? (
                    <span className="px-2.5 py-1 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-semibold">
                      Unanswered (0.00)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-400 border border-red-500/40 font-bold flex items-center gap-1">
                      <X className="w-3 h-3" /> Incorrect (-{q.negativeMarks})
                    </span>
                  )}
                </div>
              </div>

              {/* Question Text & Media */}
              <div className="space-y-3">
                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
                  {q.text}
                </p>
                {q.image && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-navy-950 max-w-lg">
                    <img src={q.image} alt="Question figure" className="max-h-64 object-contain p-2" />
                  </div>
                )}
              </div>

              {/* 4 Options Grid */}
              <div className="space-y-2.5 pt-2">
                {q.options.map((opt) => {
                  const isCadetPick = cadetAns === opt.id;
                  const isCorrectOption = q.correctAnswer === opt.id;

                  let optClass = 'bg-navy-950/60 border-slate-800/80 text-slate-300';
                  if (isCorrectOption) {
                    optClass = 'bg-defence-950/80 border-defence-500/80 text-defence-100 font-semibold shadow';
                  } else if (isCadetPick && !isCorrect) {
                    optClass = 'bg-red-950/80 border-red-500/80 text-red-200 font-semibold';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`flex items-start gap-3.5 p-3.5 rounded-2xl border text-xs sm:text-sm transition-all ${optClass}`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCorrectOption
                            ? 'bg-defence-500 text-white'
                            : isCadetPick && !isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-navy-900 border border-slate-700 text-slate-400'
                        }`}
                      >
                        {opt.id}
                      </span>
                      <div className="flex-1 space-y-1">
                        <span>{opt.text}</span>
                        {opt.image && (
                          <div className="mt-2 rounded-lg border border-slate-700 bg-navy-900 max-w-sm">
                            <img src={opt.image} alt={`Option ${opt.id}`} className="max-h-36 object-contain p-1" />
                          </div>
                        )}
                      </div>

                      {/* Pick Indicators */}
                      {isCadetPick && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCorrect ? 'bg-defence-800 text-defence-200' : 'bg-red-900 text-red-200'
                        }`}>
                          Your Answer
                        </span>
                      )}
                      {isCorrectOption && !isCadetPick && (
                        <span className="px-2 py-0.5 rounded bg-defence-900 text-defence-400 text-[10px] font-extrabold uppercase tracking-wider border border-defence-600/40">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Step-by-Step Explanation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-navy-950 border border-slate-800 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-defence-400">
                  <BookOpen className="w-4 h-4" />
                  <span>Official Defence Academy Explanation</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {q.explanation || 'Detailed solution and reference formula available in official manual.'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
