import React, { useState } from 'react';
import {
  Bell,
  Search,
  Menu,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface TopbarProps {
  role: 'cadet' | 'admin';
  setMobileOpen: (v: boolean) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ role, setMobileOpen }) => {
  const { cadetUser, isAdminAuthenticated } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const relevantNotifications = notifications.filter(
    (n) => n.recipientRole === 'All' || n.recipientRole === (role === 'cadet' ? 'Cadet' : 'Admin')
  );

  const unreadCount = relevantNotifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 bg-navy-950/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-900 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            {role === 'cadet' ? 'Cadet Candidate Portal' : 'Central Admin Command Panel'}
          </h2>
          <p className="text-[11px] text-slate-400">
            {role === 'cadet'
              ? `Aspirant: ${cadetUser?.name || 'Cadet'} • ID: ${cadetUser?.cadetId || 'NCC2026'}`
              : 'Master Officer Session (Officer Command Portal)'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-navy-950 animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-navy-900 border border-slate-700 shadow-2xl p-4 space-y-3 z-50 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-white">
                  Notifications ({unreadCount} Unread)
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar">
                {relevantNotifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-500">No notifications available.</p>
                ) : (
                  relevantNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3 rounded-xl cursor-pointer text-xs transition-all ${
                        n.read
                          ? 'bg-navy-950/40 text-slate-400'
                          : 'bg-navy-950 border border-defence-500/30 text-slate-200'
                      }`}
                    >
                      <p className="font-semibold text-white">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cadet / Admin profile badge */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-navy-900 border border-defence-500/40 flex items-center justify-center font-bold text-xs text-defence-400 shadow-inner">
            {role === 'cadet' ? cadetUser?.name.charAt(0) || 'C' : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-white truncate max-w-[130px]">
              {role === 'cadet' ? cadetUser?.name : 'Administrator'}
            </p>
            <span className="text-[10px] font-mono text-defence-400 font-semibold">
              {role === 'cadet' ? cadetUser?.cadetId : 'Officer Admin'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};