import { Question, QuestionStatus, TestSubmission, ExamCategory, SubjectType } from '../types';

export interface ScoreBreakdown {
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  markedForReviewCount: number;
  totalQuestions: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  passed: boolean;
  marksGained: number;
  marksLost: number;
  subjectWise: Record<string, { correct: number; wrong: number; unanswered: number; score: number }>;
}

export function calculateTestScore(
  questions: Question[],
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>,
  questionStates: Record<string, QuestionStatus>,
  passingMarks: number
): ScoreBreakdown {
  let correctCount = 0;
  let wrongCount = 0;
  let unansweredCount = 0;
  let markedForReviewCount = 0;
  let score = 0;
  let maxScore = 0;
  let marksGained = 0;
  let marksLost = 0;

  const subjectWise: Record<string, { correct: number; wrong: number; unanswered: number; score: number }> = {};

  questions.forEach((q) => {
    const qMarks = q.marks ?? 1;
    const qNeg = q.negativeMarks ?? 0.33;
    maxScore += qMarks;

    const cadetAnswer = answers[q.id];
    const qState = questionStates[q.id];

    if (qState === 'MARKED_FOR_REVIEW' || qState === 'ANSWERED_AND_MARKED') {
      markedForReviewCount++;
    }

    if (!subjectWise[q.subject]) {
      subjectWise[q.subject] = { correct: 0, wrong: 0, unanswered: 0, score: 0 };
    }

    if (!cadetAnswer) {
      unansweredCount++;
      // 0 marks for unanswered
      subjectWise[q.subject].unanswered++;
    } else if (cadetAnswer === q.correctAnswer) {
      correctCount++;
      marksGained += qMarks;
      score += qMarks;
      subjectWise[q.subject].correct++;
      subjectWise[q.subject].score += qMarks;
    } else {
      wrongCount++;
      marksLost += qNeg;
      score -= qNeg;
      subjectWise[q.subject].wrong++;
      subjectWise[q.subject].score -= qNeg;
    }
  });

  const roundedScore = Math.round(score * 100) / 100;
  const roundedGained = Math.round(marksGained * 100) / 100;
  const roundedLost = Math.round(marksLost * 100) / 100;

  const attemptedCount = correctCount + wrongCount;
  const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 1000) / 10 : 0;
  const percentage = maxScore > 0 ? Math.max(0, Math.round((score / maxScore) * 1000) / 10) : 0;
  const passed = roundedScore >= passingMarks;

  return {
    correctCount,
    wrongCount,
    unansweredCount,
    markedForReviewCount,
    totalQuestions: questions.length,
    score: roundedScore,
    maxScore,
    percentage,
    accuracy,
    passed,
    marksGained: roundedGained,
    marksLost: roundedLost,
    subjectWise,
  };
}
