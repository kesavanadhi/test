import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Cadet,
  Question,
  MockTest,
  Package,
  TestSubmission,
  PlatformNotification,
  LeaderboardEntry,
  ActiveSession,
  DatasetValidationRow,
} from '../types';
import { StorageService } from '../utils/storage';
import { initialLeaderboard } from '../data/mockLeaderboard';
import { mergeImportedCadets, ImportMode, exportCadetsToCSV, exportCadetsToExcel, exportCadetsToJSON } from '../utils/datasetParser';

interface DataContextType {
  cadets: Cadet[];
  questions: Question[];
  tests: MockTest[];
  packages: Package[];
  submissions: TestSubmission[];
  notifications: PlatformNotification[];
  leaderboard: LeaderboardEntry[];
  simulatedLiveSessions: ActiveSession[];
  activeCadetsSummary: {
    totalOnline: number;
    writingTest: number;
    browsingDashboard: number;
    idle: number;
    completed: number;
    recentlyLoggedOut: number;
  };
  addCadet: (cadet: Cadet) => void;
  updateCadet: (cadet: Cadet) => void;
  deleteCadet: (id: string) => void;
  updateCadetStatus: (id: string, status: Cadet['status']) => void;
  updateCadetAccess: (cadetId: string, testIds: string[]) => void;
  updateCadetPackage: (cadetId: string, packageId: string, packageName: string) => void;
  importCadetDataset: (rows: DatasetValidationRow[], mode: ImportMode) => { countAdded: number; countUpdated: number };
  exportCadets: (format: 'csv' | 'xlsx' | 'json') => void;
  addQuestion: (q: Question) => void;
  addBulkQuestions: (qs: Question[]) => void;
  deleteQuestion: (id: string) => void;
  createTest: (test: MockTest) => void;
  updateTest: (test: MockTest) => void;
  deleteTest: (id: string) => void;
  addPackage: (pkg: Package) => void;
  updatePackage: (pkg: Package) => void;
  deletePackage: (id: string) => void;
  recordSubmission: (submission: TestSubmission) => void;
  markNotificationRead: (id: string) => void;
  resetAllData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cadets, setCadets] = useState<Cadet[]>(() => StorageService.getCadets());
  const [questions, setQuestions] = useState<Question[]>(() => StorageService.getQuestions());
  const [tests, setTests] = useState<MockTest[]>(() => StorageService.getTests());
  const [packages, setPackages] = useState<Package[]>(() => StorageService.getPackages());
  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => StorageService.getSubmissions());
  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => StorageService.getNotifications());
  const [leaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  // Sync to LocalStorage on updates
  useEffect(() => {
    StorageService.saveCadets(cadets);
  }, [cadets]);

  useEffect(() => {
    StorageService.saveQuestions(questions);
  }, [questions]);

  useEffect(() => {
    StorageService.saveTests(tests);
  }, [tests]);

  useEffect(() => {
    StorageService.savePackages(packages);
  }, [packages]);

  useEffect(() => {
    StorageService.saveSubmissions(submissions);
  }, [submissions]);

  // Dynamically map live sessions strictly from registered cadets only (No fake / ideal person)
  const simulatedLiveSessions: ActiveSession[] = cadets.map((cadet, idx) => {
    const isWriting = idx % 2 === 0;
    const isIdle = idx === 3;
    const isCompleted = idx === 4;
    const status: ActiveSession['status'] = isWriting
      ? 'Writing Test'
      : isIdle
      ? 'Idle'
      : isCompleted
      ? 'Completed'
      : 'Online';

    const testName = cadet.targetExam === 'AFCAT'
      ? (idx % 2 === 0 ? 'AFCAT Mock Test 01' : 'AFCAT Mock Test 02')
      : (idx % 2 === 0 ? 'CDS Mock Test 01' : 'CDS General Knowledge Mock');

    return {
      sessionId: `sess-${cadet.cadetId.toLowerCase()}`,
      cadetId: cadet.cadetId,
      cadetName: cadet.name,
      email: cadet.email,
      college: cadet.college || 'Defence Academy Hub',
      loginTime: '07:15 PM',
      lastActiveTime: '07:30 PM',
      currentPage: isWriting ? 'Live Examination' : isCompleted ? 'Result Scorecard' : 'Cadet Dashboard',
      currentExam: cadet.targetExam === 'Both' ? 'CDS' : cadet.targetExam,
      currentTest: isWriting || isCompleted ? testName : undefined,
      currentQuestion: isWriting ? `Question ${20 + idx * 8}/100` : undefined,
      totalQuestions: isWriting ? 100 : undefined,
      answered: isWriting ? 15 + idx * 6 : undefined,
      unanswered: isWriting ? 85 - idx * 6 : undefined,
      markedForReview: isWriting ? 2 : undefined,
      timeRemaining: isWriting ? `${60 - idx * 5}:20` : undefined,
      score: cadet.bestScore || 80,
      status,
      device: 'Desktop Chrome',
    };
  });

  // Summary Metrics strictly derived from registered cadets
  const activeCadetsSummary = {
    totalOnline: cadets.length,
    writingTest: simulatedLiveSessions.filter((s) => s.status === 'Writing Test').length,
    browsingDashboard: simulatedLiveSessions.filter((s) => s.status === 'Online').length,
    idle: simulatedLiveSessions.filter((s) => s.status === 'Idle').length,
    completed: submissions.length,
    recentlyLoggedOut: 0,
  };

  // Cadet CRUD
  const addCadet = (cadet: Cadet) => {
    setCadets((prev) => [cadet, ...prev]);
  };

  const updateCadet = (cadet: Cadet) => {
    setCadets((prev) => prev.map((c) => (c.id === cadet.id ? cadet : c)));
  };

  const deleteCadet = (id: string) => {
    setCadets((prev) => prev.filter((c) => c.id !== id && c.cadetId !== id));
  };

  const updateCadetStatus = (id: string, status: Cadet['status']) => {
    setCadets((prev) => prev.map((c) => (c.id === id || c.cadetId === id ? { ...c, status } : c)));
  };

  const updateCadetAccess = (cadetId: string, testIds: string[]) => {
    setCadets((prev) =>
      prev.map((c) => (c.id === cadetId || c.cadetId === cadetId ? { ...c, accessibleTestIds: testIds } : c))
    );
  };

  const updateCadetPackage = (cadetId: string, packageId: string, packageName: string) => {
    setCadets((prev) =>
      prev.map((c) =>
        c.id === cadetId || c.cadetId === cadetId
          ? {
              ...c,
              packageId,
              packageName,
              package: packageName,
            }
          : c
      )
    );
  };

  // Bulk Dataset Import & Export
  const importCadetDataset = (rows: DatasetValidationRow[], mode: ImportMode) => {
    const { updatedCadets, countAdded, countUpdated } = mergeImportedCadets(cadets, rows, mode);
    setCadets(updatedCadets);
    return { countAdded, countUpdated };
  };

  const exportCadets = (format: 'csv' | 'xlsx' | 'json') => {
    if (format === 'csv') exportCadetsToCSV(cadets);
    else if (format === 'xlsx') exportCadetsToExcel(cadets);
    else exportCadetsToJSON(cadets);
  };

  // Question CRUD
  const addQuestion = (q: Question) => {
    setQuestions((prev) => [q, ...prev]);
  };

  const addBulkQuestions = (qs: Question[]) => {
    setQuestions((prev) => [...qs, ...prev]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Test CRUD
  const createTest = (test: MockTest) => {
    setTests((prev) => [test, ...prev]);
  };

  const updateTest = (test: MockTest) => {
    setTests((prev) => prev.map((t) => (t.id === test.id ? test : t)));
  };

  const deleteTest = (id: string) => {
    setTests((prev) => prev.filter((t) => t.id !== id));
  };

  // Package CRUD
  const addPackage = (pkg: Package) => {
    setPackages((prev) => [pkg, ...prev]);
  };

  const updatePackage = (pkg: Package) => {
    setPackages((prev) => prev.map((p) => (p.id === pkg.id ? pkg : p)));
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  // Submissions
  const recordSubmission = (submission: TestSubmission) => {
    setSubmissions((prev) => [submission, ...prev]);
    setCadets((prev) =>
      prev.map((c) =>
        c.cadetId === submission.cadetId
          ? {
              ...c,
              testsCompleted: c.testsCompleted + 1,
              averageScore: Math.round(((c.averageScore * c.testsCompleted + submission.percentage) / (c.testsCompleted + 1)) * 10) / 10,
              bestScore: Math.max(c.bestScore || 0, submission.percentage),
              highestScore: Math.max(c.highestScore || 0, submission.percentage),
            }
          : c
      )
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const resetAllData = () => {
    StorageService.resetAll();
    setCadets(StorageService.getCadets());
    setQuestions(StorageService.getQuestions());
    setTests(StorageService.getTests());
    setPackages(StorageService.getPackages());
    setSubmissions(StorageService.getSubmissions());
    setNotifications(StorageService.getNotifications());
  };

  return (
    <DataContext.Provider
      value={{
        cadets,
        questions,
        tests,
        packages,
        submissions,
        notifications,
        leaderboard,
        simulatedLiveSessions,
        activeCadetsSummary,
        addCadet,
        updateCadet,
        deleteCadet,
        updateCadetStatus,
        updateCadetAccess,
        updateCadetPackage,
        importCadetDataset,
        exportCadets,
        addQuestion,
        addBulkQuestions,
        deleteQuestion,
        createTest,
        updateTest,
        deleteTest,
        addPackage,
        updatePackage,
        deletePackage,
        recordSubmission,
        markNotificationRead,
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};