import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  Award,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useExam } from '../../context/ExamContext';
import { useToast } from '../../context/ToastContext';

export const TestInstructions: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { tests, questions } = useData();
  const { startExam } = useExam();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [agreed, setAgreed] = useState(false);

  const test = tests.find((t) => t.id === testId) || tests[0];

  // Resolve questions for this test
  const testQuestions = test.questionIds
    .map((qId) => questions.find((q) => q.id === qId))
    .filter(Boolean) as typeof questions;

  const handleStart = () => {
    if (!agreed) {
      showToast('warning', 'Agreement Required', 'Please confirm that you have read all exam instructions before starting.');
      return;
    }

    // Launch exam
    startExam(test, testQuestions.length > 0 ? testQuestions : questions.slice(0, test.questionsCount || 10));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Test Title Header */}
      <div className="rounded-3xl bg-navy-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-defence-900 text-defence-400 border border-defence-600/30">
              {test.exam}
            </span>
            <span className="text-xs text-slate-400 font-semibold">
              Subject: {test.subject}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300">
            Passing Marks: <strong className="text-defence-400">{test.passingMarks} / {test.totalMarks}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          {test.name}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {test.description}
        </p>

        {/* Key Examination Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-center">
            <Clock className="w-5 h-5 text-defence-400 mx-auto mb-1" />
            <p className="text-base font-black text-white">{test.durationMinutes} Mins</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Test Duration</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-center">
            <FileCheck2 className="w-5 h-5 text-gold-400 mx-auto mb-1" />
            <p className="text-base font-black text-white">{test.questionsCount || testQuestions.length}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Total Questions</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-center">
            <Award className="w-5 h-5 text-defence-400 mx-auto mb-1" />
            <p className="text-base font-black text-white">{test.totalMarks}</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Total Marks</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-navy-950 border border-slate-800 text-center">
            <span className="text-red-400 font-black text-lg block mb-0.5">-{test.negativeMarking}</span>
            <p className="text-base font-black text-red-400">Negative</p>
            <p className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">Per Wrong Answer</p>
          </div>
        </div>
      </div>

      {/* Official Guidelines & Instructions */}
      <div className="rounded-3xl bg-navy-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-gold-400" />
          <span>General Examination Instructions</span>
        </h2>

        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <p>
              <strong>Timer starts immediately:</strong> The countdown timer in the top bar begins ticking down the moment you click <em>Start Test</em>.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <p>
              <strong>Do not refresh or leave the examination tab:</strong> All selected responses are recorded in real-time, but leaving the page will continue the timer.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <p>
              <strong>Answers are saved during the test:</strong> You may navigate between questions using the Question Palette or the Previous / Next controls.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <p>
              <strong>Automatic Submission:</strong> The test automatically submits, calculates your score, and generates your scorecard when time expires (00:00).
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              5
            </span>
            <p>
              <strong>Marking Scheme:</strong> Correct Answer = <strong>+{test.exam === 'AFCAT' ? 3 : 1} Mark(s)</strong>. Wrong Answer = <strong>-{test.negativeMarking} Mark(s)</strong>. Unanswered questions receive <strong>0 marks</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-navy-950/70 border border-slate-800/80">
            <span className="w-5 h-5 rounded-full bg-defence-800 text-defence-300 font-bold flex items-center justify-center shrink-0 mt-0.5">
              6
            </span>
            <p>
              <strong>One-Time Submission:</strong> Submitted tests cannot be restarted unless permitted by the administrator.
            </p>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <div className="pt-4 border-t border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl bg-navy-950 border border-defence-500/30 hover:border-defence-500/60 transition-all">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded bg-navy-900 border-slate-700 text-defence-600 focus:ring-defence-500 w-5 h-5"
            />
            <span className="text-xs text-slate-200 font-medium leading-relaxed select-none">
              I have read and understood all the instructions above. I declare that I will adhere to the rules of this mock examination and will not use unauthorized materials.
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            to="/cadet/mock-tests"
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 border border-slate-700 text-xs font-semibold uppercase tracking-wider text-center transition-all"
          >
            Cancel & Back
          </Link>

          <button
            onClick={handleStart}
            disabled={!agreed}
            className={`w-full sm:w-auto py-3.5 px-8 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl transition-all ${
              agreed
                ? 'bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white shadow-defence-950/60 hover:scale-105 border border-defence-400/50 cursor-pointer'
                : 'bg-navy-950 text-slate-500 border border-slate-800 cursor-not-allowed'
            }`}
          >
            <Zap className="w-4 h-4 text-gold-400" />
            <span>Start Test Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
