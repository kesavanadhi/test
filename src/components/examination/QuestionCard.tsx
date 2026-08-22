import React from 'react';
import { RotateCcw, Bookmark, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Question } from '../../types';
import { useExam } from '../../context/ExamContext';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber }) => {
  const {
    answers,
    questionStates,
    selectOption,
    clearResponse,
    markForReviewAndNext,
    saveAndNext,
    goToPrevious,
    currentIndex,
    examQuestions,
  } = useExam();

  const selectedOption = answers[question.id] || null;
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === examQuestions.length - 1;

  return (
    <div className="flex flex-col h-full bg-navy-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl p-4 sm:p-7">
      {/* Top Question Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-defence-800 text-defence-100 font-extrabold text-xs tracking-wider uppercase border border-defence-500/40 shadow">
            Question {questionNumber.toString().padStart(2, '0')}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Subject: <strong className="text-slate-200">{question.subject}</strong>
          </span>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Topic: <strong className="text-slate-200">{question.topic}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-navy-950 text-defence-400 border border-slate-800 font-semibold">
            Marks: +{question.marks}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-navy-950 text-red-400 border border-slate-800 font-semibold">
            Negative: -{question.negativeMarks}
          </span>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar pr-1">
        {/* Question Text */}
        {question.text && (
          <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed font-sans">
            {question.text}
          </div>
        )}

        {/* Question Image (if any) */}
        {question.image && (
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-navy-950 max-w-xl">
            <img
              src={question.image}
              alt="Question Diagram"
              className="w-full h-auto max-h-80 object-contain p-2"
            />
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => selectOption(opt.id)}
                className={`flex items-start gap-3.5 p-4 rounded-xl cursor-pointer border transition-all duration-150 ${
                  isSelected
                    ? 'bg-defence-900/60 border-defence-500 shadow-lg shadow-defence-950/50 text-white'
                    : 'bg-navy-950/60 border-slate-800/90 text-slate-300 hover:bg-navy-800/60 hover:border-slate-700'
                }`}
              >
                {/* Radio Circle */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border transition-all ${
                    isSelected
                      ? 'bg-defence-500 border-defence-400 text-white shadow'
                      : 'bg-navy-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {opt.id}
                </div>

                {/* Option Text & Optional Image */}
                <div className="flex-1 space-y-2">
                  {opt.text && (
                    <span className="text-sm sm:text-base font-normal leading-relaxed">
                      {opt.text}
                    </span>
                  )}
                  {opt.image && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 bg-navy-900 max-w-md">
                      <img src={opt.image} alt={`Option ${opt.id}`} className="max-h-48 object-contain p-2" />
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Examination Bottom Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={isFirstQuestion}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all ${
              isFirstQuestion
                ? 'opacity-40 cursor-not-allowed border-slate-800 text-slate-500'
                : 'bg-navy-950 border-slate-700 hover:bg-navy-800 text-slate-300 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Clear Response */}
          {selectedOption && (
            <button
              onClick={clearResponse}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Response</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mark for Review */}
          <button
            onClick={markForReviewAndNext}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/50 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
            <span>Mark for Review & Next</span>
          </button>

          {/* Save & Next */}
          <button
            onClick={saveAndNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-defence-600 hover:bg-defence-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-defence-950/50 border border-defence-400/40 transition-all hover:scale-[1.02]"
          >
            <span>{isLastQuestion ? 'Save Response' : 'Save & Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
