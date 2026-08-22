import React from 'react';
import { Bookmark, CheckCircle2, HelpCircle, Eye } from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { QuestionStatus } from '../../types';

export const QuestionPalette: React.FC = () => {
  const { examQuestions, currentIndex, questionStates, answers, jumpToQuestion } = useExam();

  // Counts for summary
  let answeredCount = 0;
  let markedCount = 0;
  let answeredAndMarkedCount = 0;
  let notVisitedCount = 0;
  let visitedUnansweredCount = 0;

  examQuestions.forEach((q) => {
    const state = questionStates[q.id];
    if (state === 'ANSWERED') answeredCount++;
    else if (state === 'MARKED_FOR_REVIEW') markedCount++;
    else if (state === 'ANSWERED_AND_MARKED') answeredAndMarkedCount++;
    else if (state === 'VISITED') visitedUnansweredCount++;
    else notVisitedCount++;
  });

  const getButtonClass = (index: number, state: QuestionStatus) => {
    const isActive = index === currentIndex;
    let base = 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center relative ';

    if (isActive) {
      base += 'ring-2 ring-gold-400 ring-offset-2 ring-offset-navy-900 scale-105 z-10 ';
    }

    switch (state) {
      case 'ANSWERED':
        return base + 'bg-defence-600 hover:bg-defence-500 text-white shadow-md border border-defence-400/40';
      case 'ANSWERED_AND_MARKED':
        return base + 'bg-purple-700 hover:bg-purple-600 text-white shadow-md border border-purple-400/50';
      case 'MARKED_FOR_REVIEW':
        return base + 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 border border-purple-600/40';
      case 'VISITED':
        return base + 'bg-amber-900/80 hover:bg-amber-800 text-amber-200 border border-amber-600/40';
      case 'NOT_VISITED':
      default:
        return base + 'bg-navy-950 hover:bg-slate-800 text-slate-400 border border-slate-800';
    }
  };

  return (
    <div className="bg-navy-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col h-full shadow-2xl">
      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800">
        Question Palette
      </h3>

      {/* Status Legend */}
      <div className="grid grid-cols-2 gap-2 my-3.5 text-[11px] text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-defence-600 border border-defence-400/40 shrink-0" />
          <span>Answered ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-amber-900/80 border border-amber-600/40 shrink-0" />
          <span>Not Answered ({visitedUnansweredCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-purple-900/80 border border-purple-600/40 shrink-0" />
          <span>Marked ({markedCount})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-md bg-purple-700 border border-purple-400/50 shrink-0" />
          <span>Ans & Marked ({answeredAndMarkedCount})</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <span className="w-3.5 h-3.5 rounded-md bg-navy-950 border border-slate-800 shrink-0" />
          <span>Not Visited ({notVisitedCount})</span>
        </div>
      </div>

      <div className="border-t border-slate-800/80 my-2" />

      {/* Question Numbers Grid */}
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {examQuestions.map((q, idx) => {
            const state = questionStates[q.id] || 'NOT_VISITED';
            return (
              <button
                key={q.id}
                onClick={() => jumpToQuestion(idx)}
                className={getButtonClass(idx, state)}
                title={`Question ${idx + 1}: ${state}`}
              >
                <span>{idx + 1}</span>
                {state === 'ANSWERED_AND_MARKED' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-defence-400 border border-navy-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
