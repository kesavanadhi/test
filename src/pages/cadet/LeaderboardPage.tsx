import React, { useState } from 'react';
import { Trophy, Award, Shield, Target, Medal, Star, Flame } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ExamCategory, LeaderboardEntry } from '../../types';


export const LeaderboardPage: React.FC = () => {
  const { submissions } = useData();
  const { cadetUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'Overall' | 'CDS' | 'AFCAT'>('Overall');

  // Dynamically derive leaderboard from real submissions
  const dynamicLeaderboard: LeaderboardEntry[] = [...submissions]
    .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
    .map((s, idx) => ({
      rank: idx + 1,
      cadetId: s.cadetId,
      cadetName: s.cadetName,
      exam: s.exam,
      testName: s.testName,
      score: s.score,
      maxScore: s.maxScore,
      accuracy: s.accuracy,
      timeTakenMinutes: Math.round(s.timeTakenSeconds / 60) || 1,
      date: s.submittedAt ? s.submittedAt.split('T')[0] : '',
    }));

  const filteredEntries = dynamicLeaderboard.filter((entry) => {
    if (activeTab === 'Overall') return true;
    return entry.exam === activeTab;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gold-400" />
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              National Cadet Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            All-India rankings and score standings among active defence exam aspirants.
          </p>
        </div>

        {/* Exam Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-navy-900 rounded-2xl border border-slate-800 self-start">
          {(['Overall', 'CDS', 'AFCAT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-defence-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'Overall' ? 'Overall Board' : `${tab} Rankings`}
            </button>
          ))}
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="p-12 rounded-3xl bg-navy-900/80 border border-slate-800 text-center space-y-3 shadow-xl">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Leaderboard Submissions Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All-India cadet rankings will populate as candidates complete mock tests and record scorecards.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {filteredEntries.slice(0, 3).map((entry, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              return (
                <div
                  key={`${entry.cadetId}-${idx}`}
                  className={`rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border shadow-2xl transition-all ${
                    isGold
                      ? 'bg-gradient-to-b from-amber-950/40 via-navy-900 to-navy-950 border-amber-500/50 scale-105'
                      : isSilver
                      ? 'bg-gradient-to-b from-slate-800/40 via-navy-900 to-navy-950 border-slate-600'
                      : 'bg-gradient-to-b from-amber-900/20 via-navy-900 to-navy-950 border-amber-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center border shadow-lg ${
                      isGold
                        ? 'bg-gold-500 text-navy-950 border-amber-300'
                        : isSilver
                        ? 'bg-slate-300 text-navy-950 border-slate-100'
                        : 'bg-amber-700 text-white border-amber-500'
                    }`}>
                      #{idx + 1}
                    </span>

                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-navy-950 text-defence-400 border border-defence-600/30">
                      {entry.exam}
                    </span>
                  </div>

                  <div className="my-5 text-center space-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-navy-800 border border-slate-700 mx-auto flex items-center justify-center font-bold text-lg text-white shadow-inner mb-2">
                      {entry.cadetName.charAt(0)}
                    </div>
                    <h3 className="font-bold text-base text-white truncate">{entry.cadetName}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{entry.testName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-navy-950/80 border border-slate-800 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Score</span>
                      <span className="text-base font-black text-white">{entry.score} / {entry.maxScore}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold uppercase">Accuracy</span>
                      <span className="text-base font-black text-defence-400">{entry.accuracy}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Rankings Table */}
          <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Rank</th>
                    <th className="py-4 px-6">Cadet Aspirant</th>
                    <th className="py-4 px-4">Exam</th>
                    <th className="py-4 px-6">Test Attempted</th>
                    <th className="py-4 px-4">Score</th>
                    <th className="py-4 px-4">Accuracy</th>
                    <th className="py-4 px-4 text-right">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEntries.map((entry, idx) => {
                    const isCurrentCadet = cadetUser?.cadetId === entry.cadetId;
                    return (
                      <tr
                        key={`${entry.cadetId}-${idx}`}
                        className={`transition-colors ${
                          isCurrentCadet
                            ? 'bg-defence-950/60 border-l-4 border-l-defence-500 font-semibold'
                            : 'hover:bg-navy-850/60'
                        }`}
                      >
                        <td className="py-4 px-6 font-bold">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs ${
                            idx === 0
                              ? 'bg-gold-500 text-navy-950 font-black'
                              : idx === 1
                              ? 'bg-slate-300 text-navy-950 font-black'
                              : idx === 2
                              ? 'bg-amber-700 text-white font-black'
                              : 'text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-defence-400">
                            {entry.cadetName.charAt(0)}
                          </div>
                          <div>
                            <span>{entry.cadetName}</span>
                            {isCurrentCadet && (
                              <span className="ml-2 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-defence-800 text-defence-300">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-defence-900 text-defence-400 border border-defence-600/30">
                            {entry.exam}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 max-w-xs truncate">{entry.testName}</td>
                        <td className="py-4 px-4 font-bold text-white">{entry.score} / {entry.maxScore}</td>
                        <td className="py-4 px-4 font-bold text-defence-400">{entry.accuracy}%</td>
                        <td className="py-4 px-4 text-right text-slate-400">{entry.timeTakenMinutes} mins</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

