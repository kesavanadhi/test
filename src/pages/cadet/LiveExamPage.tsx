import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useExam } from '../../context/ExamContext';
import { ExamHeader } from '../../components/examination/ExamHeader';
import { QuestionCard } from '../../components/examination/QuestionCard';
import { QuestionPalette } from '../../components/examination/QuestionPalette';
import { SubmitConfirmModal } from '../../components/examination/SubmitConfirmModal';
import { Menu, X } from 'lucide-react';

export const LiveExamPage: React.FC = () => {
  const { isExamActive, activeTest, currentQuestion, currentIndex, submitExam } = useExam();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // If no test is running, redirect to Mock Tests list
  if (!isExamActive || !activeTest || !currentQuestion) {
    return <Navigate to="/cadet/mock-tests" replace />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col overflow-hidden text-slate-100 selection:bg-defence-600 selection:text-white">
      {/* Top Examination Header */}
      <ExamHeader onSubmitClick={() => setIsSubmitModalOpen(true)} />

      {/* Mobile Palette Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-navy-900 border-b border-slate-800 text-xs">
        <span className="font-semibold text-slate-300">
          Question {currentIndex + 1}
        </span>
        <button
          onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-navy-950 border border-slate-700 text-defence-400 font-bold"
        >
          {mobilePaletteOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
          <span>{mobilePaletteOpen ? 'Close Grid' : 'Question Grid'}</span>
        </button>
      </div>

      {/* Main Examination Workspace */}
      <div className="flex-1 flex overflow-hidden p-3 sm:p-5 gap-5 max-w-7xl mx-auto w-full">
        {/* Main Question Card Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
          />
        </div>

        {/* Desktop Question Palette */}
        <div className="hidden lg:block w-80 shrink-0 h-full">
          <QuestionPalette />
        </div>
      </div>

      {/* Mobile Off-Canvas Palette Drawer */}
      {mobilePaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 h-full bg-navy-900 border-l border-slate-800 p-4 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-white">Palette</span>
              <button
                onClick={() => setMobilePaletteOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pt-2" onClick={() => setMobilePaletteOpen(false)}>
              <QuestionPalette />
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <SubmitConfirmModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {
          setIsSubmitModalOpen(false);
          submitExam(false);
        }}
      />
    </div>
  );
};
