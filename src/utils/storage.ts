import { Cadet, Question, MockTest, Package, TestSubmission, PlatformNotification, ActiveSession, ActivityLogEntry } from '../types';
import { initialCadets } from '../data/mockCadets';
import { initialQuestions } from '../data/mockQuestions';
import { initialTests } from '../data/mockTests';
import { initialPackages } from '../data/mockPackages';
import { initialSubmissions } from '../data/mockResults';
import { initialNotifications } from '../data/mockNotifications';

const STORAGE_KEYS = {
  CADETS: 'warrior_cadets_v2',
  ACTIVE_SESSIONS: 'warrior_active_sessions_v2',
  ACTIVITY_LOGS: 'warrior_activity_logs_v2',
  QUESTIONS: 'warrior_questions_v2',
  TESTS: 'warrior_tests_v2',
  PACKAGES: 'warrior_packages_v2',
  SUBMISSIONS: 'warrior_submissions_v2',
  NOTIFICATIONS: 'warrior_notifications_v2',
  CADET_AUTH: 'warrior_cadet_auth_v2',
  ADMIN_AUTH: 'warrior_admin_auth_v2',
};

export const StorageService = {
  // Cadets
  getCadets(): Cadet[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CADETS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CADETS, JSON.stringify(initialCadets));
      return initialCadets;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialCadets;
    }
  },
  saveCadets(cadets: Cadet[]): void {
    localStorage.setItem(STORAGE_KEYS.CADETS, JSON.stringify(cadets));
  },

  // Auto-generate next unique Cadet ID (e.g. NCC20260021)
  getNextCadetId(currentCadets: Cadet[]): string {
    const year = '2026';
    const prefix = `NCC${year}`;
    let maxSequence = 0;

    currentCadets.forEach((c) => {
      if (c.cadetId && c.cadetId.startsWith(prefix)) {
        const seqStr = c.cadetId.replace(prefix, '');
        const seq = parseInt(seqStr, 10);
        if (!isNaN(seq) && seq > maxSequence) {
          maxSequence = seq;
        }
      }
    });

    const nextSeq = maxSequence + 1;
    return `${prefix}${String(nextSeq).padStart(4, '0')}`;
  },

  // Active Sessions
  getActiveSessions(): ActiveSession[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSIONS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  saveActiveSessions(sessions: ActiveSession[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSIONS, JSON.stringify(sessions));
  },

  // Activity Logs
  getActivityLogs(): ActivityLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },
  saveActivityLogs(logs: ActivityLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 50)));
  },

  // Questions
  getQuestions(): Question[] {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(initialQuestions));
      return initialQuestions;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialQuestions;
    }
  },
  saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  // Tests
  getTests(): MockTest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(initialTests));
      return initialTests;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialTests;
    }
  },
  saveTests(tests: MockTest[]): void {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
  },

  // Packages
  getPackages(): Package[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(initialPackages));
      return initialPackages;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialPackages;
    }
  },
  savePackages(packages: Package[]): void {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  },

  // Submissions
  getSubmissions(): TestSubmission[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
      return initialSubmissions;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialSubmissions;
    }
  },
  saveSubmissions(submissions: TestSubmission[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  },

  // Notifications
  getNotifications(): PlatformNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
      return initialNotifications;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return initialNotifications;
    }
  },
  saveNotifications(notifications: PlatformNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  // Auth Sessions
  getCadetAuth(): Cadet | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CADET_AUTH);
    return raw ? JSON.parse(raw) : null;
  },
  saveCadetAuth(cadet: Cadet | null): void {
    if (cadet) {
      localStorage.setItem(STORAGE_KEYS.CADET_AUTH, JSON.stringify(cadet));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CADET_AUTH);
    }
  },
  getAdminAuth(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },
  saveAdminAuth(isAuth: boolean): void {
    if (isAuth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
  },

  // Factory Reset
  resetAll(): void {
    localStorage.clear();
    localStorage.setItem(STORAGE_KEYS.CADETS, JSON.stringify(initialCadets));
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(initialQuestions));
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(initialTests));
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(initialPackages));
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(initialSubmissions));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  },
};