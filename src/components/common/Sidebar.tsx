import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  History,
  Award,
  BarChart3,
  Trophy,
  User,
  LogOut,

  Users,
  HelpCircle,
  PlusCircle,
  ShieldCheck,
  Activity,
  Sliders,
  FolderLock,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface SidebarProps {
  role: 'cadet' | 'admin';
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  role,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { cadetUser, logoutCadet, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (role === 'cadet') {
      logoutCadet();
      navigate('/cadet/login');
    } else {
      logoutAdmin();
      navigate('/admin/login');
    }
  };

  const cadetNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/cadet/dashboard', icon: LayoutDashboard },
    { name: 'Mock Tests', path: '/cadet/mock-tests', icon: FileCheck2 },
    { name: 'Test History', path: '/cadet/history', icon: History },
    { name: 'Results & Review', path: '/cadet/results', icon: Award },
    { name: 'Performance', path: '/cadet/performance', icon: BarChart3 },
    { name: 'Leaderboard', path: '/cadet/leaderboard', icon: Trophy },
    { name: 'Cadet Profile', path: '/cadet/profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Active Cadets', path: '/admin/activity', icon: Activity, badge: 'LIVE' },
    { name: 'Cadet Management', path: '/admin/cadets', icon: Users },
    { name: 'Cadet Dataset', path: '/admin/dataset', icon: FileSpreadsheet, badge: 'CSV/XLS' },
    { name: 'Mock Tests', path: '/admin/tests', icon: FileCheck2 },
    { name: 'Question Bank', path: '/admin/question-bank', icon: HelpCircle },
    { name: 'Add Questions', path: '/admin/add-questions', icon: PlusCircle, highlight: true },
    { name: 'Access Control', path: '/admin/access-control', icon: FolderLock },
    { name: 'All Results', path: '/admin/results', icon: Award },
    { name: 'Platform Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'System Settings', path: '/admin/settings', icon: Sliders },
  ];

  const items = role === 'cadet' ? cadetNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col bg-navy-900 border-r border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-defence-500/40 p-1 flex items-center justify-center shrink-0">
              <img
                src="/assets/warrior-logo.webp"
                alt="WARRIOR Logo"
                className="w-full h-full object-contain"
              />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-display font-black tracking-widest text-lg text-white truncate">
                  WARRIOR
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider text-defence-400 truncate">
                  {role === 'cadet' ? 'Cadet Exam Portal' : 'Admin Control Panel'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? role === 'cadet'
                        ? 'bg-defence-700/80 text-white shadow-lg shadow-defence-900/50 border border-defence-500/40'
                        : 'bg-navy-800 text-gold-400 border border-amber-500/30 shadow-lg'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800/60'
                  }`
                }
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${item.highlight ? 'text-defence-400 animate-pulse' : ''}`} />
                {!collapsed && <span className="truncate flex-1">{item.name}</span>}
                {!collapsed && item.badge && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border ${
                    item.badge === 'LIVE' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Cadet / Admin profile quick info & Logout */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          {!collapsed && (
            <div className="p-2.5 rounded-xl bg-navy-950/70 border border-slate-800/80 mb-2 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-defence-400 shrink-0">
                {role === 'cadet' ? cadetUser?.name.charAt(0) || 'C' : 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {role === 'cadet' ? cadetUser?.name : 'Officer Administrator'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {role === 'cadet' ? cadetUser?.cadetId : 'Master Officer'}
                </p>
              </div>
            </div>
          )}


          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all ${
              role === 'cadet'
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-950/30'
                : 'text-slate-400 hover:text-gold-400 hover:bg-amber-950/30'
            }`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};