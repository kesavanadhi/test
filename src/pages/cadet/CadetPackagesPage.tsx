import React from 'react';
import { PackageCard } from '../../components/packages/PackageCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Package } from '../../types';

export const CadetPackagesPage: React.FC = () => {
  const { packages, updateCadetPackage } = useData();
  const { cadetUser } = useAuth();
  const { showToast } = useToast();

  const handleSelectPackage = (pkg: Package) => {
    if (cadetUser) {
      updateCadetPackage(cadetUser.id, pkg.id, pkg.name);
      showToast('success', 'Package Updated', `Your account is now subscribed to ${pkg.name}.`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          My Test Packages & Enrolment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore practice packages, extend validity, or switch your target examination stream.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            isEnrolled={cadetUser?.packageId === pkg.id}
            onSelect={handleSelectPackage}
          />
        ))}
      </div>
    </div>
  );
};
