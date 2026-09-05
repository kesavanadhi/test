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
 * Intelligently cleans an option text by removing leading letter prefixes like "A)", "(A)", "A.", "1.", etc.
 */
export function cleanOptionText(text: string): string {
  return text.replace(/^(\([a-dA-D1-4]\)|[a-dA-D1-4][\.\):])\s*/i, '').trim();
}

/**
 * Intelligently splits a raw question line into parts:
 * - Handles spaced slashes ' / ' as primary delimiters while preserving units without spaces (m/s, km/h, etc.)
 * - Handles pipe '|' delimiters
 * - Protects physical units (m/s, m/s^2, km/h, ft/s, etc.), mathematical fractions (1/2, 3/4), dates, and abbreviations
 * - Recombines unit denominators if naive splitting ever breaks them (e.g. "3 × 10^6 m" + "s" -> "3 × 10^6 m/s")
 * - Cleans trailing slashes
 */
export function smartSplitQuestionLine(rawLine: string): string[] {
  let line = rawLine.trim();
  if (!line) return [];

  // Strip trailing slashes or delimiters at line end
  line = line.replace(/\s*\/+\s*$/, '').replace(/\s*\|+\s*$/, '').trim();

  // 1. Pipe '|' delimiter check
  if (line.includes('|')) {
    const pipeParts = line.split('|').map((p) => p.trim()).filter((p) => p.length > 0);
    if (pipeParts.length >= 5) {
      return pipeParts;
    }
  }

  // 2. Spaced slash ' / ' delimiter check
  // Physics units (m/s, km/h, 1/2) have NO spaces around the slash,
  // whereas question/option delimiters are typed with spaces (' / ')
  if (/\s+\/\s+/.test(line)) {
    const spacedParts = line.split(/\s+\/\s+/).map((p) => p.trim()).filter((p) => p.length > 0);
    if (spacedParts.length >= 5) {
      return spacedParts;
    }
  }

  // 3. Protect internal slashes that are NOT delimiters
  const PLACEHOLDER = '___UNIT_SLASH___';
  let protectedLine = line;

  // Protect common measurement units: m/s, m/s^2, km/h, km/hr, km/s, cm/s, ft/s, miles/hr, mph, kg/m^3, g/cm^3, N/m, J/s, rad/s, rev/min, etc.
  protectedLine = protectedLine.replace(
    /\b(m|km|cm|mm|ft|mi|miles|kg|g|N|J|W|V|A|rad|rev)\s*\/\s*(s\^?2?|sec|second|seconds|h|hr|hrs|hour|hours|min|mins|minute|m\^?3?|cm\^?3?|l|day|year)\b/gi,
    `$1${PLACEHOLDER}$2`
  );

  // Protect fractions: e.g. 1/2, 3/4, 5/8, 22/7
  protectedLine = protectedLine.replace(/\b(\d+)\s*\/\s*(\d+)\b/g, `$1${PLACEHOLDER}$2`);

  // Protect dates: e.g. 15/08/1947, 01/01/2026
  protectedLine = protectedLine.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{2,4})\b/g, `$1${PLACEHOLDER}$2${PLACEHOLDER}$3`);

  // Protect common shorthand: w/o, c/o, a/c
  protectedLine = protectedLine.replace(/\b(w|c|a)\/(o|c)\b/gi, `$1${PLACEHOLDER}$2`);

  // Split by slash and restore protected units
  const rawParts = protectedLine
    .split('/')
    .map((p) => p.replace(new RegExp(PLACEHOLDER, 'g'), '/').trim())
    .filter((p) => p.length > 0);

  // 4. Heuristic Recombination in case any unit like "m" and "s" were split
  const recombined: string[] = [];
  for (let i = 0; i < rawParts.length; i++) {
    const current = rawParts[i];
    const next = rawParts[i + 1];

    if (
      next &&
      /^(s\^?2?|sec|second|seconds|h|hr|hrs|hour|hours|min|mins|minute|m|m\^?3?|cm\^?3?|l)$/i.test(next) &&
      /(^|\s|\d)(m|km|cm|mm|ft|mi|kg|g|N|J|W|V|A|rad|rev)$/i.test(current)
    ) {
      recombined.push(`${current}/${next}`);
      i++; // Skip the denominator
    } else {
      recombined.push(current);
    }
  }

  return recombined;
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

  // Smart split protecting units like m/s, km/h, fractions 1/2, etc.
  const parts = smartSplitQuestionLine(trimmed);
  const questionText = parts[0] || '';

  if (parts.length < 5) {
    const foundOptions = Math.max(0, parts.length - 1);
    const optionsArray = parts.slice(1).map(cleanOptionText);
    return {
      id: `draft-${Date.now()}-${lineNumber}`,
      questionText,
      optionsCount: foundOptions,
      options: optionsArray,
      optionA: optionsArray[0] || '',
      optionB: optionsArray[1] || '',
      optionC: optionsArray[2] || '',
      optionD: optionsArray[3] || '',
      correctAnswer: 'A',
      marks: defaults.marks ?? 1,
      negativeMarks: defaults.negativeMarks ?? 0.33,
      explanation: '',
      exam: defaults.exam || 'CDS',
      subject: defaults.subject || 'General Knowledge',
      topic: defaults.topic || 'General',
      difficulty: defaults.difficulty || 'Medium',
      isValid: false,
      errorMessage: `Found ${foundOptions} option(s). Standard format requires a question followed by 4 options (Option A, B, C, D) separated by ' / '.`,
      rawLine: line,
      lineNumber,
    };
  }

  // Extract the 4 options
  const optA = cleanOptionText(parts[1]);
  const optB = cleanOptionText(parts[2]);
  const optC = cleanOptionText(parts[3]);
  const optD = cleanOptionText(parts[4]);

  let detectedAnswer: 'A' | 'B' | 'C' | 'D' = 'A';
  let explanation = '';

  if (parts.length === 6) {
    const candidate = parts[5].toUpperCase().replace(/^(ANS:|ANSWER:|\s*)/i, '').trim();
    if (candidate === 'A' || candidate === 'B' || candidate === 'C' || candidate === 'D') {
      detectedAnswer = candidate;
    } else {
      explanation = parts[5];
    }
  } else if (parts.length >= 7) {
    const candidate = parts[5].toUpperCase().replace(/^(ANS:|ANSWER:|\s*)/i, '').trim();
    if (candidate === 'A' || candidate === 'B' || candidate === 'C' || candidate === 'D') {
      detectedAnswer = candidate;
      explanation = parts.slice(6).join(' / ');
    } else {
      explanation = parts.slice(5).join(' / ');
    }
  }

  return {
    id: `draft-${Date.now()}-${lineNumber}-${Math.random().toString(36).substr(2, 5)}`,
    questionText,
    optionsCount: 4,
    options: [optA, optB, optC, optD],
    optionA: optA,
    optionB: optB,
    optionC: optC,
    optionD: optD,
    correctAnswer: detectedAnswer,
    marks: defaults.marks ?? 1,
    negativeMarks: defaults.negativeMarks ?? 0.33,
    explanation,
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

    const parsed = parseSingleSlashQuestion(trimmed, lineNum, defaults);
    const optCount = parsed.optionsCount;
    distribution[optCount] = (distribution[optCount] || 0) + 1;

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