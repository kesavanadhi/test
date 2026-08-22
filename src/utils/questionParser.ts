import { Question, OptionItem, ExamCategory, SubjectType, Difficulty } from '../types';

export interface ParsedQuestionDraft {
  id: string;
  questionText: string;
  optionsCount: number;
  options: string[];
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  negativeMarks: number;
  explanation: string;
  exam: ExamCategory;
  subject: SubjectType;
  topic: string;
  difficulty: Difficulty;
  isValid: boolean;
  errorMessage?: string;
  rawLine: string;
  lineNumber: number;
}

export interface ParseResult {
  totalLines: number;
  validQuestions: ParsedQuestionDraft[];
  invalidQuestions: { lineNumber: number; rawLine: string; optionsCount: number; error: string }[];
  optionsBreakdown: {
    total4Options: number;
    totalOtherOptions: number;
    distribution: Record<number, number>; // e.g. { 4: 15, 3: 2, 5: 1 }
    allEqual4Options: boolean;
  };
}

/**
 * Parses a single line in "Question / Option A / Option B / Option C / Option D" format.
 */
export function parseSingleSlashQuestion(
  line: string,
  lineNumber = 1,
  defaults: {
    exam?: ExamCategory;
    subject?: SubjectType;
    topic?: string;
    difficulty?: Difficulty;
    marks?: number;
    negativeMarks?: number;
  } = {}
): ParsedQuestionDraft {
  const trimmed = line.trim();
  if (!trimmed) {
    return {
      id: `draft-${Date.now()}-${lineNumber}`,
      questionText: '',
      optionsCount: 0,
      options: [],
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: defaults.marks ?? 1,
      negativeMarks: defaults.negativeMarks ?? 0.33,
      explanation: '',
      exam: defaults.exam || 'CDS',
      subject: defaults.subject || 'General Knowledge',
      topic: defaults.topic || 'General',
      difficulty: defaults.difficulty || 'Medium',
      isValid: false,
      errorMessage: 'Line is empty.',
      rawLine: line,
      lineNumber,
    };
  }

  // Split by slash
  const parts = trimmed.split('/').map((p) => p.trim());
  const questionText = parts[0] || '';
  const parsedOptions = parts.slice(1);
  const optionsCount = parsedOptions.length;

  if (parts.length < 5) {
    return {
      id: `draft-${Date.now()}-${lineNumber}`,
      questionText,
      optionsCount,
      options: parsedOptions,
      optionA: parsedOptions[0] || '',
      optionB: parsedOptions[1] || '',
      optionC: parsedOptions[2] || '',
      optionD: parsedOptions[3] || '',
      correctAnswer: 'A',
      marks: defaults.marks ?? 1,
      negativeMarks: defaults.negativeMarks ?? 0.33,
      explanation: '',
      exam: defaults.exam || 'CDS',
      subject: defaults.subject || 'General Knowledge',
      topic: defaults.topic || 'General',
      difficulty: defaults.difficulty || 'Medium',
      isValid: false,
      errorMessage: `Unequal Option Count: Found ${optionsCount} option(s). Standard requires exactly 4 options (A, B, C, D) separated by '/'.`,
      rawLine: line,
      lineNumber,
    };
  }

  let detectedAnswer: 'A' | 'B' | 'C' | 'D' = 'A';

  if (parts.length === 6) {
    const lastPart = parts[5].toUpperCase().replace(/^(ANS:|ANSWER:|\s*)/i, '').trim();
    if (lastPart === 'A' || lastPart === 'B' || lastPart === 'C' || lastPart === 'D') {
      detectedAnswer = lastPart;
    }
  }

  if (parts.length > 6) {
    return {
      id: `draft-${Date.now()}-${lineNumber}`,
      questionText,
      optionsCount,
      options: parsedOptions,
      optionA: parsedOptions[0] || '',
      optionB: parsedOptions[1] || '',
      optionC: parsedOptions[2] || '',
      optionD: parsedOptions[3] || '',
      correctAnswer: 'A',
      marks: defaults.marks ?? 1,
      negativeMarks: defaults.negativeMarks ?? 0.33,
      explanation: '',
      exam: defaults.exam || 'CDS',
      subject: defaults.subject || 'General Knowledge',
      topic: defaults.topic || 'General',
      difficulty: defaults.difficulty || 'Medium',
      isValid: false,
      errorMessage: `Too Many Parts: Found ${parts.length} parts. Standard format is: Question / Option A / Option B / Option C / Option D (and optional Answer Key A/B/C/D).`,
      rawLine: line,
      lineNumber,
    };
  }

  return {
    id: `draft-${Date.now()}-${lineNumber}-${Math.random().toString(36).substr(2, 5)}`,
    questionText,
    optionsCount: 4,
    options: [parsedOptions[0], parsedOptions[1], parsedOptions[2], parsedOptions[3]],
    optionA: parsedOptions[0],
    optionB: parsedOptions[1],
    optionC: parsedOptions[2],
    optionD: parsedOptions[3],
    correctAnswer: detectedAnswer,
    marks: defaults.marks ?? 1,
    negativeMarks: defaults.negativeMarks ?? 0.33,
    explanation: '',
    exam: defaults.exam || 'CDS',
    subject: defaults.subject || 'General Knowledge',
    topic: defaults.topic || 'General',
    difficulty: defaults.difficulty || 'Medium',
    isValid: true,
    rawLine: line,
    lineNumber,
  };
}

/**
 * Bulk parse multiple questions separated by new lines
 */
export function parseBulkSlashQuestions(
  rawText: string,
  defaults: {
    exam?: ExamCategory;
    subject?: SubjectType;
    topic?: string;
    difficulty?: Difficulty;
    marks?: number;
    negativeMarks?: number;
  } = {}
): ParseResult {
  const lines = rawText.split('\n');
  const validQuestions: ParsedQuestionDraft[] = [];
  const invalidQuestions: { lineNumber: number; rawLine: string; optionsCount: number; error: string }[] = [];
  const distribution: Record<number, number> = {};

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmed = line.trim();
    if (!trimmed) return; // ignore blank lines

    const parts = trimmed.split('/').map((p) => p.trim());
    const optCount = Math.max(0, parts.length - 1);
    distribution[optCount] = (distribution[optCount] || 0) + 1;

    const parsed = parseSingleSlashQuestion(trimmed, lineNum, defaults);
    if (parsed.isValid) {
      validQuestions.push(parsed);
    } else {
      invalidQuestions.push({
        lineNumber: lineNum,
        rawLine: line,
        optionsCount: optCount,
        error: parsed.errorMessage || 'Invalid question format.',
      });
    }
  });

  const total4Options = distribution[4] || 0;
  const totalOtherOptions = Object.entries(distribution)
    .filter(([count]) => Number(count) !== 4)
    .reduce((acc, [, val]) => acc + val, 0);

  return {
    totalLines: lines.filter((l) => l.trim().length > 0).length,
    validQuestions,
    invalidQuestions,
    optionsBreakdown: {
      total4Options,
      totalOtherOptions,
      distribution,
      allEqual4Options: totalOtherOptions === 0 && total4Options > 0,
    },
  };
}

/**
 * Convert draft to complete Question
 */
export function draftToQuestion(draft: ParsedQuestionDraft): Question {
  const options: [OptionItem, OptionItem, OptionItem, OptionItem] = [
    { id: 'A', text: draft.optionA },
    { id: 'B', text: draft.optionB },
    { id: 'C', text: draft.optionC },
    { id: 'D', text: draft.optionD },
  ];

  return {
    id: `Q-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
    exam: draft.exam,
    subject: draft.subject,
    topic: draft.topic,
    difficulty: draft.difficulty,
    text: draft.questionText,
    options,
    correctAnswer: draft.correctAnswer,
    marks: Number(draft.marks) || 1,
    negativeMarks: Number(draft.negativeMarks) || 0.33,
    explanation: draft.explanation || 'No explanation provided.',
    createdAt: new Date().toISOString(),
  };
}