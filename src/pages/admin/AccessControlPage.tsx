import React, { useState } from 'react';
import { FolderLock, Users, Shield, CheckCircle2, Lock, Unlock, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const AccessControlPage: React.FC = () => {
  const { cadets, tests, updateCadetAccess } = useData();
  const { showToast } = useToast();
  const [searchCadet, setSearchCadet] = useState('');

  const filteredCadets = cadets.filter(
    (c) =>
      c.name.toLowerCase().includes(searchCadet.toLowerCase()) ||
      c.cadetId.toLowerCase().includes(searchCadet.toLowerCase())
  );

  const toggleAccess = (cadetId: string, testId: string) => {
    const cadet = cadets.find((c) => c.id === cadetId || c.cadetId === cadetId);
    if (!cadet) return;

    const current = cadet.accessibleTestIds || [];
    const exists = current.includes(testId);
    const updated = exists ? current.filter((id) => id !== testId) : [...current, testId];

    updateCadetAccess(cadet.id, updated);
    showToast(
      exists ? 'warning' : 'success',
      exists ? 'Access Locked' : 'Access Unlocked',
      `Test ${exists ? 'locked' : 'unlocked'} for ${cadet.name} (${cadet.cadetId}).`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Cadet Access Control Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centrally manage granular permissions and mock test unlocks per cadet.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search cadet..."
            value={searchCadet}
            onChange={(e) => setSearchCadet(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Cadet Aspirant</th>
                <th className="py-4 px-4">Target Exam</th>
                {tests.map((t) => (
                  <th key={t.id} className="py-4 px-3 text-center truncate max-w-[120px]" title={t.name}>
                    {t.name.substring(0, 14)}...
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCadets.length === 0 ? (
                <tr>
                  <td colSpan={2 + tests.length} className="py-12 text-center text-slate-500 text-xs">
                    No registered cadets found.
                  </td>
                </tr>
              ) : (
                filteredCadets.map((cadet) => (
                  <tr key={cadet.id} className="hover:bg-navy-850/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <p className="font-bold text-white">{cadet.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{cadet.cadetId}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950 text-defence-400 border border-defence-600/30">
                        {cadet.targetExam || 'CDS'}
                      </span>
                    </td>
                    {tests.map((t) => {
                      const hasAccess = (cadet.accessibleTestIds || []).includes(t.id);
                      return (
                        <td key={t.id} className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => toggleAccess(cadet.id, t.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              hasAccess
                                ? 'bg-defence-950 text-defence-400 border-defence-500/40 hover:bg-red-950 hover:text-red-400'
                                : 'bg-red-950/60 text-red-400 border-red-500/40 hover:bg-defence-950 hover:text-defence-400'
                            }`}
                            title={hasAccess ? 'Access Granted (Click to Lock)' : 'Access Locked (Click to Unlock)'}
                          >
                            {hasAccess ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};