export type ExamCategory = 'CDS' | 'AFCAT';

export type CDSSubject = 'English' | 'General Knowledge' | 'Elementary Mathematics';
export type AFCATSubject = 'General Awareness' | 'Verbal Ability in English' | 'Numerical Ability' | 'Reasoning' | 'Military Aptitude';
export type SubjectType = CDSSubject | AFCATSubject | 'Full Mock Test';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type QuestionStatus = 
  | 'NOT_VISITED' 
  | 'VISITED' 
  | 'ANSWERED' 
  | 'MARKED_FOR_REVIEW' 
  | 'ANSWERED_AND_MARKED';

export interface OptionItem {
  id: 'A' | 'B' | 'C' | 'D';
  text?: string;
  image?: string;
}

export interface Question {
  id: string;
  exam: ExamCategory;
  subject: SubjectType;
  topic: string;
  difficulty: Difficulty;
  text?: string;
  image?: string;
  options: [OptionItem, OptionItem, OptionItem, OptionItem];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  marks: number;
  negativeMarks: number;
  explanation: string;
  createdAt?: string;
}

export interface MockTest {
  id: string;
  name: string;
  exam: ExamCategory;
  subject: SubjectType;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarking: number;
  questionsCount: number;
  questionIds: string[];
  status: 'Draft' | 'Scheduled' | 'Live' | 'Completed' | 'Disabled';
  startDate?: string;
  endDate?: string;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  createdAt: string;
}

export interface Cadet {
  id: string;
  cadetId: string; // e.g. NCC20260001
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  college: string;
  department: string;
  year: string;
  university: string;
  registerNumber: string;
  profilePhoto?: string;
  nccUnit?: string;
  password?: string;
  status: 'Active' | 'Inactive' | 'Disabled';
  registrationDate: string;
  package: string;
  packageName: string;
  packageId: string;
  packageExpiresAt: string;
  testsAvailable: number;
  testsCompleted: number;
  averageScore: number;
  highestScore: number;
  bestScore: number;
  rank: number;
  targetExam: 'CDS' | 'AFCAT' | 'Both';
  accessibleTestIds: string[];
}

export interface ActiveSession {
  sessionId: string;
  cadetId: string;
  cadetName: string;
  email: string;
  college: string;
  loginTime: string;
  lastActiveTime: string;
  currentPage: string;
  currentExam?: string;
  currentTest?: string;
  currentQuestion?: string; // e.g. 'Question 42/100'
  totalQuestions?: number;
  answered?: number;
  unanswered?: number;
  markedForReview?: number;
  timeRemaining?: string; // e.g. '62:45'
  score?: number;
  status: 'Online' | 'Writing Test' | 'Idle' | 'Completed' | 'Offline' | 'Logged Out';
  device: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  timeFormatted: string;
  cadetName: string;
  cadetId: string;
  action: string;
  type: 'start' | 'submit' | 'login' | 'idle' | 'complete' | 'register';
}

export interface DatasetValidationRow {
  rowNumber: number;
  data: Partial<Cadet>;
  isValid: boolean;
  errors: string[];
}

export interface DatasetImportResult {
  fileName: string;
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  rows: DatasetValidationRow[];
}

export interface TestSubmission {
  id: string;
  cadetId: string;
  cadetName: string;
  testId: string;
  testName: string;
  exam: ExamCategory;
  subject: SubjectType;
  answers: Record<string, 'A' | 'B' | 'C' | 'D' | null>;
  questionStates: Record<string, QuestionStatus>;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  markedForReviewCount: number;
  score: number;
  maxScore: number;
  percentage: number;
  accuracy: number;
  timeTakenSeconds: number;
  passed: boolean;
  submittedAt: string;
  rank?: number;
}

export interface Package {
  id: string;
  name: string;
  exam: 'CDS' | 'AFCAT' | 'All';
  price: number;
  originalPrice?: number;
  numberOfTests: number;
  accessDurationMonths: number;
  features: string[];
  isPopular?: boolean;
  status: 'Active' | 'Disabled';
}

export interface PlatformNotification {
  id: string;
  recipientRole: 'Cadet' | 'Admin' | 'All';
  cadetId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'test' | 'result' | 'package' | 'alert' | 'system';
}

export interface LeaderboardEntry {
  rank: number;
  cadetId: string;
  cadetName: string;
  exam: ExamCategory;
  testName: string;
  score: number;
  maxScore: number;
  accuracy: number;
  timeTakenMinutes: number;
  date: string;
  avatar?: string;
}