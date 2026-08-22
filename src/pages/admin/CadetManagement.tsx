import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Shield,
  Award,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  PlusCircle,
  X,
  UserCheck,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  Layers,
  FileSpreadsheet,
  LogOut,
  Eye,
  Trash2,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Cadet } from '../../types';
import { formatDate } from '../../utils/formatters';

export const CadetManagement: React.FC = () => {
  const { cadets, updateCadetStatus, updateCadetAccess, deleteCadet, tests } = useData();
  const { logoutActiveSession } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [packageFilter, setPackageFilter] = useState<string>('All');
  const [selectedCadet, setSelectedCadet] = useState<Cadet | null>(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const filteredCadets = cadets.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (packageFilter !== 'All' && c.packageId !== packageFilter && c.packageName !== packageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.cadetId.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.college || '').toLowerCase().includes(q) ||
        (c.department || '').toLowerCase().includes(q) ||
        (c.registerNumber || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const toggleStatus = (cadet: Cadet) => {
    const nextStatus = cadet.status === 'Active' ? 'Disabled' : 'Active';
    updateCadetStatus(cadet.id, nextStatus);
    showToast(
      nextStatus === 'Active' ? 'success' : 'warning',
      `Cadet Status Updated`,
      `${cadet.name} is now ${nextStatus}.`
    );
  };

  const handleOpenAccessModal = (cadet: Cadet) => {
    setSelectedCadet(cadet);
    setIsAccessModalOpen(true);
  };

  const handleOpenDetailDrawer = (cadet: Cadet) => {
    setSelectedCadet(cadet);
    setIsDetailDrawerOpen(true);
  };

  const toggleTestAccess = (testId: string) => {
    if (!selectedCadet) return;
    const current = selectedCadet.accessibleTestIds || [];
    const exists = current.includes(testId);
    const updated = exists ? current.filter((id) => id !== testId) : [...current, testId];

    updateCadetAccess(selectedCadet.id, updated);
    setSelectedCadet({ ...selectedCadet, accessibleTestIds: updated });
  };

  const handleDeleteCadet = (cadet: Cadet) => {
    if (window.confirm(`Are you sure you want to permanently delete cadet ${cadet.name} (${cadet.cadetId})?`)) {
      deleteCadet(cadet.id);
      showToast('info', 'Cadet Deleted', `${cadet.name} removed from system.`);
      setIsDetailDrawerOpen(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
              Aspirant Directory
            </span>
            <span className="text-xs text-slate-400">Total Registered: <strong className="text-white">{cadets.length}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Cadet Enrolment & Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <Link
            to="/admin/dataset"
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-200 border border-slate-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Upload Bulk Dataset</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Cadet ID, name, email, college, dept, reg no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-defence-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-defence-500"
          >
            <option value="All">All Packages</option>
            <option value="Free Mock Test">Free Mock Test</option>
            <option value="CDS Practice Pack">CDS Practice Pack</option>
            <option value="AFCAT Practice Pack">AFCAT Practice Pack</option>
            <option value="Complete Defence Pack">Complete Defence Pack</option>
          </select>
        </div>
      </div>

      {/* Cadets Master Table (Requirement #31) */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Cadet ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email / Phone</th>
                <th className="py-4 px-6">College / Department</th>
                <th className="py-4 px-4">Reg No</th>
                <th className="py-4 px-4">Package</th>
                <th className="py-4 px-4">Mocks Done</th>
                <th className="py-4 px-4">Avg Score</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCadets.map((c) => (
                <tr key={c.id} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-defence-400">
                    <button
                      onClick={() => handleOpenDetailDrawer(c)}
                      className="hover:underline flex items-center gap-1 text-left"
                    >
                      {c.cadetId}
                    </button>
                  </td>
                  <td className="py-4 px-6 font-bold text-white">
                    <button onClick={() => handleOpenDetailDrawer(c)} className="hover:text-defence-300">
                      {c.name}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-400">
                    <p className="text-slate-300">{c.email}</p>
                    <p className="text-[10px] text-slate-500">{c.phone}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-300 max-w-xs">
                    <p className="font-semibold text-white truncate">{c.college || '—'}</p>
                    <p className="text-[10px] text-slate-400">{c.department ? `${c.department} • Year ${c.year || '3'}` : '—'}</p>
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{c.registerNumber || '—'}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-navy-950 text-gold-400 border border-amber-500/30 truncate max-w-[130px] inline-block">
                      {c.packageName}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-white">{c.testsCompleted}</td>
                  <td className="py-4 px-4 font-bold text-defence-400">{c.averageScore}%</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Active'
                        ? 'bg-defence-950 text-defence-300 border border-defence-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenDetailDrawer(c)}
                      className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-[11px] transition-all"
                      title="View Full Profile & Performance"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleOpenAccessModal(c)}
                      className="px-2.5 py-1 rounded bg-defence-950 hover:bg-defence-900 text-defence-300 border border-defence-500/30 font-semibold text-[11px] transition-all"
                      title="Manage Mock Test Access"
                    >
                      Access
                    </button>
                    <button
                      onClick={() => toggleStatus(c)}
                      className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-all ${
                        c.status === 'Active'
                          ? 'bg-red-950/60 hover:bg-red-900 text-red-300'
                          : 'bg-defence-950 hover:bg-defence-800 text-defence-300'
                      }`}
                    >
                      {c.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CADET DETAIL DRAWER / PANEL (Requirement #44) */}
      {isDetailDrawerOpen && selectedCadet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-fade-in">
          <div className="w-full max-w-xl bg-navy-900 border-l border-slate-800 p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar animate-slide-left shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
                  {selectedCadet.cadetId}
                </span>
                <h2 className="text-xl font-black text-white font-display mt-1">{selectedCadet.name}</h2>
              </div>
              <button onClick={() => setIsDetailDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Personal Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-navy-950 border border-slate-800 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-defence-400" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div><span className="text-slate-500 block">Email:</span> {selectedCadet.email}</div>
                <div><span className="text-slate-500 block">Phone:</span> {selectedCadet.phone}</div>
                <div><span className="text-slate-500 block">Date of Birth:</span> {selectedCadet.dateOfBirth || '—'}</div>
                <div><span className="text-slate-500 block">Gender:</span> {selectedCadet.gender || '—'}</div>
                <div><span className="text-slate-500 block">NCC Unit:</span> {selectedCadet.nccUnit || '—'}</div>
                <div><span className="text-slate-500 block">Reg Date:</span> {formatDate(selectedCadet.registrationDate)}</div>
              </div>
            </div>

            {/* 2. Academic Details */}
            <div className="space-y-3 p-4 rounded-2xl bg-navy-950 border border-slate-800 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-gold-400" />
                <span>Academic & Institution Profile</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div className="col-span-2"><span className="text-slate-500 block">College / Institution:</span> {selectedCadet.college || '—'}</div>
                <div><span className="text-slate-500 block">Department:</span> {selectedCadet.department || '—'}</div>
                <div><span className="text-slate-500 block">Year:</span> Year {selectedCadet.year || '3'}</div>
                <div><span className="text-slate-500 block">University:</span> {selectedCadet.university || '—'}</div>
                <div><span className="text-slate-500 block">Register Number:</span> <span className="font-mono font-bold text-white">{selectedCadet.registerNumber || '—'}</span></div>
              </div>
            </div>

            {/* 3. Package & Account Status */}
            <div className="space-y-3 p-4 rounded-2xl bg-navy-950 border border-slate-800 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-[11px] text-slate-300 border-b border-slate-800 pb-2 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-defence-400" />
                <span>Enrolled Package & Permissions</span>
              </h3>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div><span className="text-slate-500 block">Active Package:</span> <strong className="text-gold-400">{selectedCadet.packageName}</strong></div>
                <div><span className="text-slate-500 block">Account Status:</span> <strong className="text-defence-400">{selectedCadet.status}</strong></div>
                <div><span className="text-slate-500 block">Tests Available:</span> {selectedCadet.testsAvailable}</div>
                <div><span className="text-slate-500 block">Tests Completed:</span> {selectedCadet.testsCompleted}</div>
              </div>
            </div>

            {/* 4. Performance Snapshot */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-white">{selectedCadet.averageScore}%</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">Average Score</p>
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-defence-400">{selectedCadet.bestScore || selectedCadet.highestScore}%</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">Best Score</p>
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800">
                <span className="text-lg font-black text-gold-400">#{selectedCadet.rank}</span>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">National Rank</p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  logoutActiveSession(selectedCadet.cadetId);
                  showToast('info', 'Session Terminated', `Active session for ${selectedCadet.name} logged out.`);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Active Cadet Session</span>
              </button>

              <button
                onClick={() => handleDeleteCadet(selectedCadet)}
                className="w-full py-2.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-500/40 text-xs font-bold flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Cadet Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Modal */}
      {isAccessModalOpen && selectedCadet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white font-display">
                  Mock Test Access Permissions
                </h3>
                <p className="text-xs text-slate-400">Cadet: {selectedCadet.name} ({selectedCadet.cadetId})</p>
              </div>
              <button onClick={() => setIsAccessModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-300">Toggle individual mock test unlocks:</p>
              <div className="space-y-2">
                {tests.map((t) => {
                  const hasAccess = (selectedCadet.accessibleTestIds || []).includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTestAccess(t.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        hasAccess
                          ? 'bg-defence-950/70 border-defence-500/60 text-white'
                          : 'bg-navy-950 border-slate-800 text-slate-400 hover:bg-navy-850'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-xs text-white">{t.name}</p>
                        <p className="text-[10px] text-slate-400">{t.exam} • {t.durationMinutes} mins</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        hasAccess ? 'bg-defence-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {hasAccess ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setIsAccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-defence-700 hover:bg-defence-600 text-white font-bold text-xs uppercase"
            >
              Done & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};