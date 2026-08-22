import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, Eye } from 'lucide-react';
import { Question } from '../../types';

interface QuestionPreviewCardProps {
  question: Partial<Question>;
  questionNumber?: number;
}

export const QuestionPreviewCard: React.FC<QuestionPreviewCardProps> = ({
  question,
  questionNumber = 1,
}) => {
  const options = question.options || [
    { id: 'A', text: 'Option A' },
    { id: 'B', text: 'Option B' },
    { id: 'C', text: 'Option C' },
    { id: 'D', text: 'Option D' },
  ];

  return (
    <div className="bg-navy-950/90 rounded-2xl border border-slate-800 p-5 sm:p-6 space-y-4 shadow-xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-defence-800 text-defence-100 font-bold uppercase tracking-wider text-[11px]">
            Question {questionNumber.toString().padStart(2, '0')}
          </span>
          <span className="text-slate-400">
            {question.exam || 'CDS'} • {question.subject || 'General Knowledge'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-defence-400 font-semibold">+{question.marks ?? 1}</span>
          <span className="text-red-400 font-semibold">-{question.negativeMarks ?? 0.33}</span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="space-y-3">
        {question.text ? (
          <p className="text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
            {question.text}
          </p>
        ) : (
          <p className="text-slate-500 italic text-sm">[Question text will appear here...]</p>
        )}

        {question.image && (
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-navy-900 max-w-md">
            <img src={question.image} alt="Question figure" className="max-h-48 object-contain p-2" />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5 pt-2">
        {options.map((opt) => {
          const isCorrect = question.correctAnswer === opt.id;
          return (
            <div
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs sm:text-sm transition-all ${
                isCorrect
                  ? 'bg-defence-950/70 border-defence-500/70 text-defence-100 font-semibold'
                  : 'bg-navy-900/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                  isCorrect
                    ? 'bg-defence-500 text-white shadow'
                    : 'bg-navy-800 text-slate-400 border border-slate-700'
                }`}
              >
                {opt.id}
              </span>
              <div className="flex-1">
                <span>{opt.text || `[Option ${opt.id}]`}</span>
                {opt.image && (
                  <div className="mt-2 rounded-lg border border-slate-700 bg-navy-950 max-w-xs">
                    <img src={opt.image} alt={`Option ${opt.id}`} className="max-h-32 object-contain p-1" />
                  </div>
                )}
              </div>
              {isCorrect && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-defence-400 px-2 py-0.5 rounded bg-defence-900/80 border border-defence-600/40">
                  Correct
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Explanation Box */}
      {question.explanation && (
        <div className="mt-4 p-4 rounded-xl bg-navy-900 border border-slate-800 text-xs space-y-1">
          <p className="font-bold uppercase tracking-wider text-defence-400 text-[10px]">
            Official Answer Explanation:
          </p>
          <p className="text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
