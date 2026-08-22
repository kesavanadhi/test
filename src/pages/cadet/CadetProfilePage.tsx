import React from 'react';
import { User, Mail, Phone, Shield, Award, Calendar, Package, FileCheck2, Trophy, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatters';

export const CadetProfilePage: React.FC = () => {
  const { cadetUser } = useAuth();

  if (!cadetUser) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      {/* Profile Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-defence-900 via-navy-900 to-navy-950 border border-defence-500/40 p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-3xl bg-navy-950 border-2 border-defence-400 p-1 flex items-center justify-center text-4xl font-black text-defence-400 shadow-2xl">
          {cadetUser.name.charAt(0)}
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
              Cadet ID: {cadetUser.cadetId}
            </span>
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-navy-800 text-gold-400 border border-amber-500/30">
              Target: {cadetUser.targetExam}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            {cadetUser.name}
          </h1>

          <p className="text-xs text-slate-300">
            Registered: {formatDate(cadetUser.registrationDate)} • Package: <strong>{cadetUser.packageName}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">National Rank</span>
          <span className="text-3xl font-black text-gold-400">#{cadetUser.rank}</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-defence-400" />
            <span>Cadet Personal Information</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Full Name</span>
              <span className="font-semibold text-white">{cadetUser.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Cadet Roll Number</span>
              <span className="font-semibold text-white font-mono">{cadetUser.cadetId}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Email Address</span>
              <span className="font-semibold text-white">{cadetUser.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Contact Number</span>
              <span className="font-semibold text-white">{cadetUser.phone}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Account Status</span>
              <span className="font-semibold text-defence-400">{cadetUser.status}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-3 border-b border-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-gold-400" />
            <span>Subscription & Exam Access</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Active Package</span>
              <span className="font-semibold text-gold-400">{cadetUser.packageName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Access Validity</span>
              <span className="font-semibold text-white">Valid until Dec 2026</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Tests Completed</span>
              <span className="font-semibold text-defence-400">{cadetUser.testsCompleted} Mocks</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Average Percentage</span>
              <span className="font-semibold text-white">{cadetUser.averageScore}%</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-400">Best Score</span>
              <span className="font-semibold text-defence-400">{cadetUser.bestScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
