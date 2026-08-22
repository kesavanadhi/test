import React from 'react';
import { AlertCircle, CheckCircle2, Bookmark, HelpCircle, X, Send } from 'lucide-react';
import { useExam } from '../../context/ExamContext';

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SubmitConfirmModal: React.FC<SubmitConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { examQuestions, answers, questionStates, isSubmitting } = useExam();

  if (!isOpen) return null;

  let answeredCount = 0;
  let markedCount = 0;
  let unansweredCount = 0;

  examQuestions.forEach((q) => {
    const ans = answers[q.id];
    const state = questionStates[q.id];
    if (ans) answeredCount++;
    else unansweredCount++;

    if (state === 'MARKED_FOR_REVIEW' || state === 'ANSWERED_AND_MARKED') {
      markedCount++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-navy-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 animate-slide-up space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display">Submit Test?</h3>
              <p className="text-xs text-slate-400">Confirm final submission of your examination</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Examination Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-navy-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-defence-400">{answeredCount}</span>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Answered
            </p>
          </div>
          <div className="bg-navy-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-amber-400">{unansweredCount}</span>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Unanswered
            </p>
          </div>
          <div className="bg-navy-950 p-3.5 rounded-2xl border border-slate-800 text-center">
            <span className="text-2xl font-black text-purple-400">{markedCount}</span>
            <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              Marked
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed bg-navy-950/60 p-3.5 rounded-xl border border-slate-800/80">
          ⚠️ Once submitted, you will not be able to change any answers. Your result, score breakdown, and accuracy analysis will be calculated immediately.
        </p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 bg-navy-950 hover:bg-navy-800 border border-slate-700 transition-all text-center"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border border-red-400/40 shadow-lg shadow-red-950/50 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Calculating...' : 'Submit Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
