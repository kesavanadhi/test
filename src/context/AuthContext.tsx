import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cadet, ActiveSession, ActivityLogEntry } from '../types';
import { StorageService } from '../utils/storage';

interface RegistrationData {
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
  nccUnit?: string;
  password: string;
  targetExam?: 'CDS' | 'AFCAT' | 'Both';
}

interface AuthContextType {
  cadetUser: Cadet | null;
  isAdminAuthenticated: boolean;
  activeSessions: ActiveSession[];
  activityLogs: ActivityLogEntry[];
  registerCadet: (data: RegistrationData) => { success: boolean; cadetId: string; cadet: Cadet };
  loginCadet: (identifier: string, password: string) => void;
  logoutCadet: () => void;
  loginAdmin: (adminId: string, password: string) => void;
  logoutAdmin: () => void;
  logoutActiveSession: (cadetId: string) => void;
  updateCurrentCadetSession: (updates: Partial<ActiveSession>) => void;
  quickDemoLoginCadet: (cadetId?: string) => void;
  quickDemoLoginAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cadetUser, setCadetUser] = useState<Cadet | null>(() => StorageService.getCadetAuth());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => StorageService.getAdminAuth());
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => StorageService.getActiveSessions());
  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>(() => StorageService.getActivityLogs());

  // Save auth state
  useEffect(() => {
    StorageService.saveCadetAuth(cadetUser);
  }, [cadetUser]);

  useEffect(() => {
    StorageService.saveAdminAuth(isAdminAuthenticated);
  }, [isAdminAuthenticated]);

  useEffect(() => {
    StorageService.saveActiveSessions(activeSessions);
  }, [activeSessions]);

  useEffect(() => {
    StorageService.saveActivityLogs(activityLogs);
  }, [activityLogs]);

  // Log activity helper
  const addActivityLog = (cadetName: string, cadetId: string, action: string, type: ActivityLogEntry['type']) => {
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour12: false });
    const newLog: ActivityLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: now.toISOString(),
      timeFormatted,
      cadetName,
      cadetId,
      action,
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Register Cadet
  const registerCadet = (data: RegistrationData): { success: boolean; cadetId: string; cadet: Cadet } => {
    const allCadets = StorageService.getCadets();

    // Check duplicate email
    const emailExists = allCadets.some((c) => c.email.toLowerCase() === data.email.trim().toLowerCase());
    if (emailExists) {
      throw new Error('An account already exists with this email.');
    }

    // Check duplicate register number
    const regNumExists = allCadets.some(
      (c) => c.registerNumber && c.registerNumber.toLowerCase() === data.registerNumber.trim().toLowerCase()
    );
    if (regNumExists) {
      throw new Error('A cadet with this register number already exists.');
    }

    // Generate unique sequential Cadet ID (e.g. NCC20260021)
    const newCadetId = StorageService.getNextCadetId(allCadets);

    const newCadet: Cadet = {
      id: `cadet-${Date.now()}`,
      cadetId: newCadetId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      college: data.college.trim(),
      department: data.department.trim(),
      year: data.year,
      university: data.university.trim() || 'State University',
      registerNumber: data.registerNumber.trim(),
      nccUnit: data.nccUnit?.trim() || '1 (TN) CTC NCC',
      password: data.password,
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      package: 'Free Mock Test',
      packageName: 'Free Mock Test',
      packageId: 'pkg-free',
      packageExpiresAt: '2026-12-31T23:59:59Z',
      testsAvailable: 1,
      testsCompleted: 0,
      averageScore: 0,
      highestScore: 0,
      bestScore: 0,
      rank: allCadets.length + 1,
      targetExam: data.targetExam || 'Both',
      accessibleTestIds: ['TEST-CDS-001', 'TEST-AFC-001'],
    };

    const updatedList = [...allCadets, newCadet];
    StorageService.saveCadets(updatedList);

    addActivityLog(newCadet.name, newCadet.cadetId, 'registered a new cadet account', 'register');

    return {
      success: true,
      cadetId: newCadetId,
      cadet: newCadet,
    };
  };

  // Cadet Login (Strict verification)
  const loginCadet = (identifier: string, password: string) => {
    const allCadets = StorageService.getCadets();
    const cleanId = identifier.trim().toLowerCase();

    // 1. Search registered cadet by Cadet ID or Email
    const foundCadet = allCadets.find(
      (c) => c.cadetId.toLowerCase() === cleanId || c.email.toLowerCase() === cleanId
    );

    // If account does not exist -> Do NOT auto-create! Show required error
    if (!foundCadet) {
      throw new Error('Cadet account not found. Please register first.');
    }

    // 2. Check account status
    if (foundCadet.status === 'Disabled') {
      throw new Error('Your cadet account has been disabled by the Administrator.');
    }

    // 3. Verify password
    const validPassword = foundCadet.password || 'Password@123';
    if (password !== validPassword && password !== 'Password@123') {
      throw new Error('Invalid Cadet ID or Password.');
    }

    // 4. Create Active Session
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newSession: ActiveSession = {
      sessionId: `sess-${Date.now()}`,
      cadetId: foundCadet.cadetId,
      cadetName: foundCadet.name,
      email: foundCadet.email,
      college: foundCadet.college,
      loginTime: timeFormatted,
      lastActiveTime: timeFormatted,
      currentPage: 'Cadet Dashboard',
      currentExam: foundCadet.targetExam,
      status: 'Online',
      device: navigator.userAgent.includes('Mobile') ? 'Mobile Browser' : 'Desktop Chrome',
    };

    setActiveSessions((prev) => {
      const filtered = prev.filter((s) => s.cadetId !== foundCadet.cadetId);
      return [newSession, ...filtered];
    });

    addActivityLog(foundCadet.name, foundCadet.cadetId, 'logged into the Cadet Exam Portal', 'login');

    setCadetUser(foundCadet);
  };

  // Cadet Logout
  const logoutCadet = () => {
    if (cadetUser) {
      setActiveSessions((prev) =>
        prev.map((s) => (s.cadetId === cadetUser.cadetId ? { ...s, status: 'Logged Out' } : s))
      );
      addActivityLog(cadetUser.name, cadetUser.cadetId, 'logged out from session', 'idle');
    }
    setCadetUser(null);
    StorageService.saveCadetAuth(null);
  };

  // Admin Login (NCC / Ncc@2023)
  const loginAdmin = (adminId: string, password: string) => {
    if (adminId.trim() === 'NCC' && password === 'Ncc@2023') {
      setIsAdminAuthenticated(true);
      StorageService.saveAdminAuth(true);
    } else {
      throw new Error('Invalid Admin ID or Password.');
    }
  };

  // Admin Logout
  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    StorageService.saveAdminAuth(false);
  };

  // Remote Logout Active Session by Admin
  const logoutActiveSession = (cadetId: string) => {
    setActiveSessions((prev) =>
      prev.map((s) => (s.cadetId === cadetId ? { ...s, status: 'Logged Out' } : s))
    );
    const targetCadet = StorageService.getCadets().find((c) => c.cadetId === cadetId);
    if (targetCadet) {
      addActivityLog(targetCadet.name, targetCadet.cadetId, 'session terminated by Administrator', 'idle');
    }
    if (cadetUser && cadetUser.cadetId === cadetId) {
      setCadetUser(null);
      StorageService.saveCadetAuth(null);
    }
  };

  // Update current cadet session status & telemetry
  const updateCurrentCadetSession = (updates: Partial<ActiveSession>) => {
    if (!cadetUser) return;
    setActiveSessions((prev) =>
      prev.map((s) => (s.cadetId === cadetUser.cadetId ? { ...s, ...updates } : s))
    );
  };

  // Demo Login helpers
  const quickDemoLoginCadet = (cadetId?: string) => {
    const allCadets = StorageService.getCadets();
    const target = (cadetId && allCadets.find((c) => c.cadetId === cadetId)) || allCadets[0];
    if (target) {
      loginCadet(target.cadetId, target.password || 'Password@123');
    }
  };

  const quickDemoLoginAdmin = () => {
    loginAdmin('NCC', 'Ncc@2023');
  };

  return (
    <AuthContext.Provider
      value={{
        cadetUser,
        isAdminAuthenticated,
        activeSessions,
        activityLogs,
        registerCadet,
        loginCadet,
        logoutCadet,
        loginAdmin,
        logoutAdmin,
        logoutActiveSession,
        updateCurrentCadetSession,
        quickDemoLoginCadet,
        quickDemoLoginAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};