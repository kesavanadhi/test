import React, { useState } from 'react';
import { PackageCard } from '../../components/packages/PackageCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Shield,
  CheckCircle2,
  Lock,
  Clock,
  Zap,
  Tag,
  ArrowRight,
  Filter,
  Check,
  X,
  CreditCard,
} from 'lucide-react';
import { Package } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const CadetPackagesPage: React.FC = () => {
  const { packages, updateCadetPackage } = useData();
  const { cadetUser } = useAuth();
  const { showToast } = useToast();

  const [filterExam, setFilterExam] = useState<'All' | 'CDS' | 'AFCAT'>('All');
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Active package of cadet
  const activePackage = packages.find((p) => p.id === cadetUser?.packageId) || packages[0];

  const handleOpenEnrollModal = (pkg: Package) => {
    setSelectedPkg(pkg);
    setCouponCode('');
    setDiscountPercent(0);
  };

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'WARRIOR100' || code === 'OFFICER2026' || code === 'NCC2026') {
      setDiscountPercent(100);
      showToast('success', '100% Scholarship Applied', 'Full fee waived for registered Cadet.');
    } else if (code === 'HERO50') {
      setDiscountPercent(50);
      showToast('success', '50% Discount Applied', 'Coupon applied successfully.');
    } else {
      showToast('error', 'Invalid Coupon', 'Try code WARRIOR100 or NCC2026 for demo waiver.');
    }
  };

  const handleConfirmEnrollment = () => {
    if (!selectedPkg || !cadetUser) return;
    setIsProcessing(true);

    setTimeout(() => {
      updateCadetPackage(cadetUser.id, selectedPkg.id, selectedPkg.name);
      setIsProcessing(false);
      setSelectedPkg(null);
      showToast('success', 'Package Activated!', `Congratulations! You now have full access to ${selectedPkg.name}.`);
    }, 800);
  };

  const filteredPackages = packages.filter((pkg) => {
    if (pkg.status === 'Disabled') return false;
    if (filterExam === 'All') return true;
    return pkg.exam === filterExam || pkg.exam === 'All';
  });

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3">
            <Shield className="w-8 h-8 text-defence-400" />
            <span>Test Packages & Subscriptions</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose the right test package tailored for UPSC CDS & IAF AFCAT officer entry exams.
          </p>
        </div>

        {/* Exam Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-navy-900 border border-slate-800">
          {(['All', 'CDS', 'AFCAT'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setFilterExam(ex)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                filterExam === ex
                  ? 'bg-gradient-to-r from-defence-600 to-defence-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ex === 'All' ? 'All Packages' : `${ex} Only`}
            </button>
          ))}
        </div>
      </div>

      {/* Active Subscription Banner */}
      {cadetUser && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-defence-950/60 border border-defence-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-defence-900 text-defence-400 border border-defence-500/40 text-[10px] font-extrabold uppercase">
                Active Enrolment
              </span>
              <span className="text-xs text-slate-400">
                Cadet ID: <strong className="text-white">{cadetUser.cadetId}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              {cadetUser.packageName || activePackage?.name || 'Free Foundation Tier'}
            </h2>
            <p className="text-xs text-slate-300">
              Valid until: <strong className="text-defence-300">{cadetUser.packageExpiresAt || '31 Dec 2026'}</strong> · {cadetUser.testsAvailable || 10} Mock Tests Quota Available
            </p>
          </div>

          <div className="flex items-center gap-4 bg-navy-950/80 p-4 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-slate-400">Tests Done</p>
              <p className="text-2xl font-black text-defence-400">{cadetUser.testsCompleted || 0}</p>
            </div>
            <div className="w-px h-10 bg-slate-800" />
            <div className="text-center">
              <p className="text-[10px] font-bold uppercase text-slate-400">Available</p>
              <p className="text-2xl font-black text-white">{cadetUser.testsAvailable || 10}</p>
            </div>
          </div>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isEnrolled={cadetUser?.packageId === pkg.id}
            onSelect={handleOpenEnrollModal}
          />
        ))}
      </div>

      {/* Feature Comparison Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-slate-800 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white font-display">
            Plan Feature Comparison Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare inclusions across Free Demo, CDS, AFCAT, and Officer Pro Master packages.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 text-slate-300">Feature</th>
                <th className="pb-3 text-center">Free Trial</th>
                <th className="pb-3 text-center">CDS Regular</th>
                <th className="pb-3 text-center">AFCAT Regular</th>
                <th className="pb-3 text-center text-defence-400">Officer Pro Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 font-semibold text-white">Full-Length UPSC / AFCAT Pattern Tests</td>
                <td className="py-3 text-center">1 Test</td>
                <td className="py-3 text-center">10 Tests</td>
                <td className="py-3 text-center">10 Tests</td>
                <td className="py-3 text-center font-bold text-defence-400">25 Tests</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Real-Time Negative Marking & Countdown</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">Step-by-Step Answer Explanations</td>
                <td className="py-3 text-center text-slate-600">✕</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">All-India Cadet Rank & Percentile</td>
                <td className="py-3 text-center text-slate-600">✕</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓</td>
              </tr>
              <tr>
                <td className="py-3 font-semibold text-white">SSB Interview / OIR Test Module Access</td>
                <td className="py-3 text-center text-slate-600">✕</td>
                <td className="py-3 text-center text-slate-600">✕</td>
                <td className="py-3 text-center text-slate-600">✕</td>
                <td className="py-3 text-center text-defence-400 font-bold">✓ Included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment & Checkout Modal */}
      {selectedPkg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-navy-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span>Package Enrollment</span>
              </h2>
              <button
                onClick={() => setSelectedPkg(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">{selectedPkg.name}</h3>
                  <p className="text-xs text-slate-400">{selectedPkg.numberOfTests} Mock Tests · {selectedPkg.accessDurationMonths} Months</p>
                </div>
                <span className="text-2xl font-black text-defence-400">
                  {selectedPkg.price === 0 ? 'FREE' : formatCurrency(selectedPkg.price)}
                </span>
              </div>
            </div>

            {/* Coupon Code Input */}
            {selectedPkg.price > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Cadet Scholarship / Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. WARRIOR100 or NCC2026"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white uppercase placeholder:normal-case placeholder-slate-600 focus:border-defence-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-defence-400 font-bold text-xs border border-slate-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  💡 Tip: Use demo voucher <strong className="text-gold-400">WARRIOR100</strong> for 100% instant fee waiver.
                </p>
              </div>
            )}

            {/* Price Summary */}
            <div className="p-4 rounded-2xl bg-navy-950/60 border border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Base Package Price</span>
                <span>{formatCurrency(selectedPkg.price)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-defence-400 font-semibold">
                  <span>Scholarship Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency((selectedPkg.price * discountPercent) / 100)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                <span>Total Payable</span>
                <span className="text-defence-400 font-black">
                  {formatCurrency(selectedPkg.price - (selectedPkg.price * discountPercent) / 100)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPkg(null)}
                className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-400 font-semibold text-xs border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleConfirmEnrollment}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <span>Activating Plan...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-gold-400" />
                    <span>Confirm & Activate Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
