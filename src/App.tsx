import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ExamProvider } from './context/ExamContext';

// Layouts
import { PublicLayout, CadetLayout, AdminLayout } from './layouts';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { CadetLoginPage } from './pages/public/CadetLoginPage';
import { CadetRegisterPage } from './pages/cadet/CadetRegisterPage';
import { AdminLoginPage } from './pages/public/AdminLoginPage';

// Cadet Pages
import { CadetDashboard } from './pages/cadet/CadetDashboard';
import { MockTestList } from './pages/cadet/MockTestList';
import { TestInstructions } from './pages/cadet/TestInstructions';
import { LiveExamPage } from './pages/cadet/LiveExamPage';
import { ResultPage } from './pages/cadet/ResultPage';
import { AnswerReviewPage } from './pages/cadet/AnswerReviewPage';
import { TestHistoryPage } from './pages/cadet/TestHistoryPage';
import { PerformancePage } from './pages/cadet/PerformancePage';
import { LeaderboardPage } from './pages/cadet/LeaderboardPage';
import { CadetProfilePage } from './pages/cadet/CadetProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { LiveActivityPage } from './pages/admin/LiveActivityPage';
import { CadetManagement } from './pages/admin/CadetManagement';
import { CadetDatasetPage } from './pages/admin/CadetDatasetPage';
import { TestManagementPage } from './pages/admin/TestManagementPage';
import { QuestionBankPage } from './pages/admin/QuestionBankPage';
import { AddQuestionPage } from './pages/admin/AddQuestionPage';
import { AccessControlPage } from './pages/admin/AccessControlPage';
import { AdminResultsPage } from './pages/admin/AdminResultsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <ExamProvider>
              <Routes>
                {/* 1. Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/cadet/register" element={<CadetRegisterPage />} />
                  <Route path="/cadet/login" element={<CadetLoginPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                </Route>

                {/* 2. Fullscreen Live Examination Interface */}
                <Route path="/cadet/live-exam" element={<LiveExamPage />} />

                {/* 3. Cadet Portal Routes */}
                <Route path="/cadet" element={<CadetLayout />}>
                  <Route index element={<Navigate to="/cadet/dashboard" replace />} />
                  <Route path="dashboard" element={<CadetDashboard />} />
                  <Route path="mock-tests" element={<MockTestList />} />
                  <Route path="instructions/:testId" element={<TestInstructions />} />
                  <Route path="history" element={<TestHistoryPage />} />
                  <Route path="results" element={<ResultPage />} />
                  <Route path="result" element={<ResultPage />} />
                  <Route path="review" element={<AnswerReviewPage />} />
                  <Route path="performance" element={<PerformancePage />} />
                  <Route path="leaderboard" element={<LeaderboardPage />} />
                  <Route path="profile" element={<CadetProfilePage />} />
                </Route>

                {/* 4. Admin Portal Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="activity" element={<LiveActivityPage />} />
                  <Route path="cadets" element={<CadetManagement />} />
                  <Route path="dataset" element={<CadetDatasetPage />} />
                  <Route path="tests" element={<TestManagementPage />} />
                  <Route path="question-bank" element={<QuestionBankPage />} />
                  <Route path="add-questions" element={<AddQuestionPage />} />
                  <Route path="access-control" element={<AccessControlPage />} />
                  <Route path="results" element={<AdminResultsPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>


                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ExamProvider>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};