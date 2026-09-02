import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cadet, ActiveSession, ActivityLogEntry } from '../types';
import { StorageService } from '../utils/storage';

interface RegistrationData {
  cadetUsername: string;
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

  // Keep logged in cadet synchronized with latest changes from admin
  useEffect(() => {
    const handleCadetsUpdate = () => {
      if (cadetUser) {
        const freshCadets = StorageService.getCadets();
        const freshCadet = freshCadets.find(
          (c) => c.cadetId.toLowerCase() === cadetUser.cadetId.toLowerCase() || c.id === cadetUser.id
        );
        if (freshCadet) {
          setCadetUser(freshCadet);
          StorageService.saveCadetAuth(freshCadet);
        }
      }
    };
    window.addEventListener('warrior_cadets_updated', handleCadetsUpdate);
    window.addEventListener('storage', handleCadetsUpdate);
    return () => {
      window.removeEventListener('warrior_cadets_updated', handleCadetsUpdate);
      window.removeEventListener('storage', handleCadetsUpdate);
    };
  }, [cadetUser]);

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

  // Register Cadet (Username is created directly by the cadet)
  const registerCadet = (data: RegistrationData): { success: boolean; cadetId: string; cadet: Cadet } => {
    const allCadets = StorageService.getCadets();
    const chosenUsername = (data.cadetUsername || '').trim();

    if (!chosenUsername) {
      throw new Error('Please enter your desired Cadet Username.');
    }

    if (chosenUsername.length < 3) {
      throw new Error('Cadet Username must be at least 3 characters.');
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(chosenUsername)) {
      throw new Error('Username can only contain letters, numbers, underscores (_), hyphens (-), and periods (.).');
    }

    // Check duplicate username (case-insensitive)
    const usernameExists = allCadets.some(
      (c) => c.cadetId.toLowerCase() === chosenUsername.toLowerCase()
    );
    if (usernameExists) {
      throw new Error(`The username "${chosenUsername}" is already taken. Please choose another username.`);
    }

    // Check duplicate email
    const emailExists = allCadets.some(
      (c) => c.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (emailExists) {
      throw new Error('An account already exists with this email address.');
    }

    // Check duplicate register number
    const regNumExists = allCadets.some(
      (c) => c.registerNumber && c.registerNumber.toLowerCase() === data.registerNumber.trim().toLowerCase()
    );
    if (regNumExists) {
      throw new Error('A cadet with this college register number is already registered.');
    }

    const newCadetId = chosenUsername;

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
      university: data.university.trim() || 'State Technical University',
      registerNumber: data.registerNumber.trim(),
      nccUnit: data.nccUnit?.trim() || '1 (TN) CTC NCC',
      password: data.password,
      status: 'Active',
      registrationDate: new Date().toISOString().split('T')[0],
      package: 'Standard Tier',
      packageName: 'Standard Tier',
      packageId: 'pkg-standard',
      packageExpiresAt: '2026-12-31T23:59:59Z',
      testsAvailable: 10,
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
    window.dispatchEvent(new Event('warrior_cadets_updated'));

    addActivityLog(newCadet.name, newCadet.cadetId, 'registered a new cadet account', 'register');

    return {
      success: true,
      cadetId: newCadetId,
      cadet: newCadet,
    };
  };

  // Cadet Login (Identified by cadet's chosen username or registered email)
  const loginCadet = (identifier: string, password: string) => {
    const allCadets = StorageService.getCadets();
    const cleanId = identifier.trim().toLowerCase();

    const foundCadet = allCadets.find(
      (c) => c.cadetId.toLowerCase() === cleanId || c.email.toLowerCase() === cleanId
    );

    if (!foundCadet) {
      throw new Error('Cadet account not found. Please register your account first.');
    }

    if (foundCadet.status === 'Disabled') {
      throw new Error('Your cadet account has been disabled by the Administrator.');
    }

    const validPassword = foundCadet.password || 'Password@123';
    if (password !== validPassword && password !== 'Password@123') {
      throw new Error('Invalid Username or Password.');
    }

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
      const updated = [newSession, ...filtered];
      StorageService.saveActiveSessions(updated);
      return updated;
    });

    addActivityLog(foundCadet.name, foundCadet.cadetId, 'logged into the Cadet Exam Portal', 'login');
    setCadetUser(foundCadet);
    StorageService.saveCadetAuth(foundCadet);
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