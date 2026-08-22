import React, { useState } from 'react';
import { PackageCard } from '../../components/packages/PackageCard';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { PlusCircle, Package as PackageIcon, Check, Edit, X } from 'lucide-react';
import { Package } from '../../types';

export const PackageManagement: React.FC = () => {
  const { packages } = useData();
  const { showToast } = useToast();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Practice Package Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure mock test bundles, test limits, validity periods, and marketing feature checklists.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {packages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            pkg={pkg}
            onSelect={() => showToast('info', 'Package Selected', `${pkg.name} details loaded for edit.`)}
          />
        ))}
      </div>
    </div>
  );
};
