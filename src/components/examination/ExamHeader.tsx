import React from 'react';
import { Clock, Shield, AlertTriangle, Send, User, ChevronRight } from 'lucide-react';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import { formatTimeSeconds } from '../../utils/formatters';

interface ExamHeaderProps {
  onSubmitClick: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({ onSubmitClick }) => {
  const { activeTest, examQuestions, currentIndex, timeRemainingSeconds } = useExam();
  const { cadetUser } = useAuth();

  if (!activeTest) return null;

  const isWarningTime = timeRemainingSeconds <= 300 && timeRemainingSeconds > 60; // 5 mins
  const isUrgentTime = timeRemainingSeconds <= 60; // 1 min

  const progressPercentage = Math.round(((currentIndex + 1) / examQuestions.length) * 100);

  return (
    <div className="bg-navy-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Test details & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-950 border border-defence-500/40 p-1 flex items-center justify-center shrink-0">
            <img
              src="/assets/warrior-logo.webp"
              alt="WARRIOR Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-defence-900 text-defence-400 border border-defence-600/30">
                {activeTest.exam}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {activeTest.name}
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Subject: {activeTest.subject} • Total Marks: {activeTest.totalMarks}
            </p>
          </div>
        </div>

        {/* Center: Countdown Timer */}
        <div className="flex items-center justify-center">
          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-mono text-base sm:text-lg font-bold tracking-wider shadow-inner transition-all ${
              isUrgentTime
                ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
                : isWarningTime
                ? 'bg-amber-950/70 border-amber-500 text-amber-300'
                : 'bg-navy-950 border-slate-700 text-slate-100'
            }`}
          >
            <Clock className={`w-5 h-5 ${isUrgentTime ? 'text-red-400' : isWarningTime ? 'text-amber-400' : 'text-defence-400'}`} />
            <span>{formatTimeSeconds(timeRemainingSeconds)}</span>
            <span className="text-[10px] font-sans font-semibold uppercase text-slate-400">
              Remaining
            </span>
          </div>
        </div>

        {/* Right: Progress & Submit Button */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">
              Question {currentIndex + 1} of {examQuestions.length}
            </span>
            <div className="w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-defence-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={onSubmitClick}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-950/50 border border-red-400/40 transition-all hover:scale-[1.02]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
