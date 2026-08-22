import React from 'react';
import { Check, Shield, Star, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { Package } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PackageCardProps {
  pkg: Package;
  onSelect?: (pkg: Package) => void;
  onViewDetails?: (pkg: Package) => void;
  isEnrolled?: boolean;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onSelect,
  onViewDetails,
  isEnrolled,
}) => {
  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
        pkg.isPopular
          ? 'bg-gradient-to-b from-navy-850 via-navy-900 to-navy-950 border-2 border-defence-500/60 shadow-2xl shadow-defence-950/50 scale-[1.02]'
          : 'bg-navy-900/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 shadow-xl'
      }`}
    >
      {/* Popular Badge */}
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-defence-600 to-defence-500 text-white text-[11px] font-extrabold uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-defence-400/40">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          Recommended Cadet Choice
        </div>
      )}

      <div>
        {/* Exam Tag & Name */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-navy-800 text-defence-400 border border-defence-600/30">
            {pkg.exam === 'All' ? 'CDS & AFCAT Combo' : `${pkg.exam} Examination`}
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {pkg.accessDurationMonths} Months Access
          </span>
        </div>

        <h3 className="font-display font-black text-xl text-white tracking-wide mb-2">
          {pkg.name}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-2.5 my-5 pb-5 border-b border-slate-800/80">
          <span className="text-4xl font-black text-white font-sans">
            {pkg.price === 0 ? 'FREE' : formatCurrency(pkg.price)}
          </span>
          {pkg.originalPrice && pkg.originalPrice > pkg.price && (
            <span className="text-sm font-semibold text-slate-500 line-through">
              {formatCurrency(pkg.originalPrice)}
            </span>
          )}
          <span className="text-xs text-slate-400 ml-auto font-medium">
            {pkg.numberOfTests} Mock Tests
          </span>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">What is included:</p>
          <ul className="space-y-2.5">
            {pkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 leading-normal">
                <div className="w-4 h-4 rounded-full bg-defence-500/20 border border-defence-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-defence-400 stroke-[3]" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800/60">
        <button
          onClick={() => onSelect && onSelect(pkg)}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg ${
            isEnrolled
              ? 'bg-navy-800 text-slate-300 border border-slate-700 cursor-default'
              : pkg.isPopular
              ? 'bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white shadow-defence-900/60 hover:scale-[1.01]'
              : 'bg-navy-800 hover:bg-navy-700 text-white border border-slate-700 hover:border-defence-500/40'
          }`}
        >
          {isEnrolled ? (
            'Currently Active Package'
          ) : pkg.price === 0 ? (
            <>
              <Zap className="w-4 h-4 text-gold-400" />
              Start Free Mock Test
            </>
          ) : (
            <>
              <span>Get Instant Access</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(pkg)}
            className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-defence-400 transition-colors"
          >
            View Complete Test Breakdown
          </button>
        )}
      </div>
    </div>
  );
};
