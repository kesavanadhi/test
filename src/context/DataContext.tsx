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

import { useAuth } from './AuthContext';

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
  const { activeSessions } = useAuth();
  const [cadets, setCadets] = useState<Cadet[]>(() => StorageService.getCadets());
  const [questions, setQuestions] = useState<Question[]>(() => StorageService.getQuestions());
  const [tests, setTests] = useState<MockTest[]>(() => StorageService.getTests());
  const [packages, setPackages] = useState<Package[]>(() => StorageService.getPackages());
  const [submissions, setSubmissions] = useState<TestSubmission[]>(() => StorageService.getSubmissions());
  const [notifications, setNotifications] = useState<PlatformNotification[]>(() => StorageService.getNotifications());
  const [leaderboard] = useState<LeaderboardEntry[]>(initialLeaderboard);

  // Keep cadets state reactive to registration and dataset updates without clobbering
  useEffect(() => {
    const handleCadetsUpdate = () => {
      setCadets(StorageService.getCadets());
    };
    window.addEventListener('storage', handleCadetsUpdate);
    window.addEventListener('warrior_cadets_updated', handleCadetsUpdate);
    return () => {
      window.removeEventListener('storage', handleCadetsUpdate);
      window.removeEventListener('warrior_cadets_updated', handleCadetsUpdate);
    };
  }, []);

  // Real active sessions from auth context
  const realActiveSessions = activeSessions.filter((s) => s.status !== 'Logged Out');

  // Summary Metrics strictly derived from real active sessions and real submissions
  const activeCadetsSummary = {
    totalOnline: realActiveSessions.length,
    writingTest: realActiveSessions.filter((s) => s.status === 'Writing Test').length,
    browsingDashboard: realActiveSessions.filter((s) => s.status === 'Online').length,
    idle: realActiveSessions.filter((s) => s.status === 'Idle').length,
    completed: submissions.length,
    recentlyLoggedOut: activeSessions.filter((s) => s.status === 'Logged Out').length,
  };

  // Cadet CRUD with immediate persistence
  const addCadet = (cadet: Cadet) => {
    setCadets((prev) => {
      const updated = [cadet, ...prev];
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const updateCadet = (cadet: Cadet) => {
    setCadets((prev) => {
      const updated = prev.map((c) => (c.id === cadet.id || c.cadetId === cadet.cadetId ? cadet : c));
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const deleteCadet = (id: string) => {
    setCadets((prev) => {
      const updated = prev.filter((c) => c.id !== id && c.cadetId !== id);
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const updateCadetStatus = (id: string, status: Cadet['status']) => {
    setCadets((prev) => {
      const updated = prev.map((c) => (c.id === id || c.cadetId === id ? { ...c, status } : c));
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const updateCadetAccess = (cadetId: string, testIds: string[]) => {
    setCadets((prev) => {
      const updated = prev.map((c) =>
        c.id === cadetId || c.cadetId === cadetId ? { ...c, accessibleTestIds: testIds } : c
      );
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const updateCadetPackage = (cadetId: string, packageId: string, packageName: string) => {
    setCadets((prev) => {
      const updated = prev.map((c) =>
        c.id === cadetId || c.cadetId === cadetId
          ? {
              ...c,
              packageId,
              packageName,
              package: packageName,
            }
          : c
      );
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  // Bulk Dataset Import & Export
  const importCadetDataset = (rows: DatasetValidationRow[], mode: ImportMode) => {
    const { updatedCadets, countAdded, countUpdated } = mergeImportedCadets(cadets, rows, mode);
    setCadets(updatedCadets);
    StorageService.saveCadets(updatedCadets);
    window.dispatchEvent(new Event('warrior_cadets_updated'));
    return { countAdded, countUpdated };
  };

  const exportCadets = (format: 'csv' | 'xlsx' | 'json') => {
    if (format === 'csv') exportCadetsToCSV(cadets);
    else if (format === 'xlsx') exportCadetsToExcel(cadets);
    else exportCadetsToJSON(cadets);
  };

  // Question CRUD
  const addQuestion = (q: Question) => {
    setQuestions((prev) => {
      const updated = [q, ...prev];
      StorageService.saveQuestions(updated);
      return updated;
    });
  };

  const addBulkQuestions = (qs: Question[]) => {
    setQuestions((prev) => {
      const updated = [...qs, ...prev];
      StorageService.saveQuestions(updated);
      return updated;
    });
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id);
      StorageService.saveQuestions(updated);
      return updated;
    });
  };

  // Test CRUD
  const createTest = (test: MockTest) => {
    setTests((prev) => {
      const updated = [test, ...prev];
      StorageService.saveTests(updated);
      return updated;
    });
  };

  const updateTest = (test: MockTest) => {
    setTests((prev) => {
      const updated = prev.map((t) => (t.id === test.id ? test : t));
      StorageService.saveTests(updated);
      return updated;
    });
  };

  const deleteTest = (id: string) => {
    setTests((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      StorageService.saveTests(updated);
      return updated;
    });
  };

  // Package CRUD
  const addPackage = (pkg: Package) => {
    setPackages((prev) => {
      const updated = [pkg, ...prev];
      StorageService.savePackages(updated);
      return updated;
    });
  };

  const updatePackage = (pkg: Package) => {
    setPackages((prev) => {
      const updated = prev.map((p) => (p.id === pkg.id ? pkg : p));
      StorageService.savePackages(updated);
      return updated;
    });
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      StorageService.savePackages(updated);
      return updated;
    });
  };

  // Submissions
  const recordSubmission = (submission: TestSubmission) => {
    setSubmissions((prev) => {
      const updatedSub = [submission, ...prev];
      StorageService.saveSubmissions(updatedSub);
      return updatedSub;
    });

    setCadets((prev) => {
      const updated = prev.map((c) =>
        c.cadetId === submission.cadetId
          ? {
              ...c,
              testsCompleted: c.testsCompleted + 1,
              averageScore: Math.round(((c.averageScore * c.testsCompleted + submission.percentage) / (c.testsCompleted + 1)) * 10) / 10,
              bestScore: Math.max(c.bestScore || 0, submission.percentage),
              highestScore: Math.max(c.highestScore || 0, submission.percentage),
            }
          : c
      );
      StorageService.saveCadets(updated);
      window.dispatchEvent(new Event('warrior_cadets_updated'));
      return updated;
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      StorageService.saveNotifications(updated);
      return updated;
    });
  };

  const resetAllData = () => {
    StorageService.resetAll();
    setCadets(StorageService.getCadets());
    setQuestions(StorageService.getQuestions());
    setTests(StorageService.getTests());
    setPackages(StorageService.getPackages());
    setSubmissions(StorageService.getSubmissions());
    setNotifications(StorageService.getNotifications());
    window.dispatchEvent(new Event('warrior_cadets_updated'));
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
        simulatedLiveSessions: realActiveSessions,
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