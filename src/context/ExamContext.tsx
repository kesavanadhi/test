import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { MockTest, Question, QuestionStatus, TestSubmission } from '../types';
import { calculateTestScore, ScoreBreakdown } from '../utils/scoreCalculator';
import { useAuth } from './AuthContext';
import { useData } from './DataContext';
import { useToast } from './ToastContext';

interface ExamContextType {
  activeTest: MockTest | null;
  examQuestions: Question[];
  currentIndex: number;
  currentQuestion: Question | null;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  questionStates: Record<string, QuestionStatus>;
  timeRemainingSeconds: number;
  isExamActive: boolean;
  isTimeUp: boolean;
  isSubmitting: boolean;
  latestResult: { submission: TestSubmission; breakdown: ScoreBreakdown } | null;
  startExam: (test: MockTest, questions: Question[]) => void;
  selectOption: (optionId: 'A' | 'B' | 'C' | 'D') => void;
  clearResponse: () => void;
  markForReviewAndNext: () => void;
  saveAndNext: () => void;
  goToPrevious: () => void;
  jumpToQuestion: (index: number) => void;
  submitExam: (isAutoSubmit?: boolean) => void;
  exitExam: () => void;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

export const ExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cadetUser, updateCurrentCadetSession } = useAuth();
  const { recordSubmission } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTest, setActiveTest] = useState<MockTest | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionStatus>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(0);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [latestResult, setLatestResult] = useState<{ submission: TestSubmission; breakdown: ScoreBreakdown } | null>(null);

  const timerRef = useRef<any>(null);

  const currentQuestion = examQuestions[currentIndex] || null;

  // Start examination
  const startExam = useCallback((test: MockTest, questions: Question[]) => {
    setActiveTest(test);
    setExamQuestions(questions);
    setCurrentIndex(0);

    const initialAnswers: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {};
    const initialStates: Record<string, QuestionStatus> = {};

    questions.forEach((q, idx) => {
      initialAnswers[q.id] = null;
      initialStates[q.id] = idx === 0 ? 'VISITED' : 'NOT_VISITED';
    });

    setAnswers(initialAnswers);
    setQuestionStates(initialStates);
    setTimeRemainingSeconds(test.durationMinutes * 60);
    setIsExamActive(true);
    setIsTimeUp(false);
    setIsSubmitting(false);
    setLatestResult(null);

    // Live telemetry update for Admin Live Activity
    updateCurrentCadetSession({
      status: 'Writing Test',
      currentTest: test.name,
      currentExam: test.exam,
      currentPage: 'Live Exam',
      timeRemaining: `${test.durationMinutes}:00`,
    });

    navigate('/cadet/live-exam');
  }, [navigate, updateCurrentCadetSession]);

  // Submit Exam handler
  const submitExam = useCallback(
    (isAutoSubmit = false) => {
      if (!activeTest || examQuestions.length === 0 || isSubmitting) return;

      setIsSubmitting(true);
      if (timerRef.current) clearInterval(timerRef.current);

      const totalDurationSecs = activeTest.durationMinutes * 60;
      const timeTakenSecs = Math.max(1, totalDurationSecs - timeRemainingSeconds);

      const breakdown = calculateTestScore(
        examQuestions,
        answers,
        questionStates,
        activeTest.passingMarks
      );

      const submission: TestSubmission = {
        id: `SUB-${Date.now().toString(36).toUpperCase()}`,
        cadetId: cadetUser?.cadetId || 'CADET-GUEST',
        cadetName: cadetUser?.name || 'Cadet',
        testId: activeTest.id,
        testName: activeTest.name,
        exam: activeTest.exam,
        subject: activeTest.subject,
        answers,
        questionStates,
        correctCount: breakdown.correctCount,
        wrongCount: breakdown.wrongCount,
        unansweredCount: breakdown.unansweredCount,
        markedForReviewCount: breakdown.markedForReviewCount,
        score: breakdown.score,
        maxScore: breakdown.maxScore,
        percentage: breakdown.percentage,
        accuracy: breakdown.accuracy,
        timeTakenSeconds: timeTakenSecs,
        passed: breakdown.passed,
        submittedAt: new Date().toISOString(),
        rank: Math.floor(Math.random() * 5) + 1,
      };

      recordSubmission(submission);
      setLatestResult({ submission, breakdown });
      setIsExamActive(false);
      setIsSubmitting(false);

      // Live telemetry update
      updateCurrentCadetSession({
        status: 'Online',
        currentPage: 'Scorecard & Results',
        currentTest: undefined,
        timeRemaining: undefined,
      });

      if (isAutoSubmit) {
        setIsTimeUp(true);
        showToast('warning', "Time's Up!", 'Your test was automatically submitted as time expired.');
      } else {
        showToast('success', 'Test Submitted Successfully!', `You scored ${breakdown.score} / ${breakdown.maxScore} (${breakdown.percentage}%)`);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      navigate('/cadet/results');
    },
    [activeTest, examQuestions, isSubmitting, timeRemainingSeconds, answers, questionStates, cadetUser, recordSubmission, updateCurrentCadetSession, showToast, navigate]
  );


  // Timer countdown effect
  useEffect(() => {
    if (!isExamActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamActive, submitExam]);

  // Select Option
  const selectOption = useCallback(
    (optionId: 'A' | 'B' | 'C' | 'D') => {
      if (!currentQuestion) return;
      const qId = currentQuestion.id;

      setAnswers((prev) => ({ ...prev, [qId]: optionId }));
      setQuestionStates((prev) => {
        const currentState = prev[qId];
        const newState: QuestionStatus =
          currentState === 'MARKED_FOR_REVIEW' || currentState === 'ANSWERED_AND_MARKED'
            ? 'ANSWERED_AND_MARKED'
            : 'ANSWERED';
        return { ...prev, [qId]: newState };
      });
    },
    [currentQuestion]
  );

  // Clear Response
  const clearResponse = useCallback(() => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;

    setAnswers((prev) => ({ ...prev, [qId]: null }));
    setQuestionStates((prev) => ({
      ...prev,
      [qId]: prev[qId] === 'ANSWERED_AND_MARKED' ? 'MARKED_FOR_REVIEW' : 'VISITED',
    }));
  }, [currentQuestion]);

  // Mark for review & Next
  const markForReviewAndNext = useCallback(() => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const hasAnswer = Boolean(answers[qId]);

    setQuestionStates((prev) => ({
      ...prev,
      [qId]: hasAnswer ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW',
    }));

    if (currentIndex < examQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQ = examQuestions[nextIndex];
      setCurrentIndex(nextIndex);
      setQuestionStates((prev) => ({
        ...prev,
        [nextQ.id]: prev[nextQ.id] === 'NOT_VISITED' ? 'VISITED' : prev[nextQ.id],
      }));
    }
  }, [currentQuestion, answers, currentIndex, examQuestions]);

  // Save & Next
  const saveAndNext = useCallback(() => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const hasAnswer = Boolean(answers[qId]);

    setQuestionStates((prev) => {
      if (prev[qId] === 'NOT_VISITED') {
        return { ...prev, [qId]: hasAnswer ? 'ANSWERED' : 'VISITED' };
      }
      return prev;
    });

    if (currentIndex < examQuestions.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextQ = examQuestions[nextIndex];
      setCurrentIndex(nextIndex);
      setQuestionStates((prev) => ({
        ...prev,
        [nextQ.id]: prev[nextQ.id] === 'NOT_VISITED' ? 'VISITED' : prev[nextQ.id],
      }));
    }
  }, [currentQuestion, answers, currentIndex, examQuestions]);

  // Previous
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Jump directly to a question number
  const jumpToQuestion = useCallback(
    (index: number) => {
      if (index < 0 || index >= examQuestions.length) return;
      const targetQ = examQuestions[index];
      setCurrentIndex(index);
      setQuestionStates((prev) => ({
        ...prev,
        [targetQ.id]: prev[targetQ.id] === 'NOT_VISITED' ? 'VISITED' : prev[targetQ.id],
      }));
    },
    [examQuestions]
  );

  // Exit Exam prematurely
  const exitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsExamActive(false);
    setActiveTest(null);
    navigate('/cadet/mock-tests');
  }, [navigate]);

  return (
    <ExamContext.Provider
      value={{
        activeTest,
        examQuestions,
        currentIndex,
        currentQuestion,
        answers,
        questionStates,
        timeRemainingSeconds,
        isExamActive,
        isTimeUp,
        isSubmitting,
        latestResult,
        startExam,
        selectOption,
        clearResponse,
        markForReviewAndNext,
        saveAndNext,
        goToPrevious,
        jumpToQuestion,
        submitExam,
        exitExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
