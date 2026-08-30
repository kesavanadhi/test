import React, { useState } from 'react';
import { PackageCard } from '../../components/packages/PackageCard';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  PlusCircle,
  Package as PackageIcon,
  Check,
  Edit,
  Trash2,
  X,
  Sparkles,
  Shield,
  Layers,
  Search,
  Filter,
} from 'lucide-react';
import { Package } from '../../types';

export const PackageManagement: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage } = useData();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState<'All' | 'CDS' | 'AFCAT'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Package | null>(null);

  // Form State
  const [formState, setFormState] = useState<Omit<Package, 'id'>>({
    name: '',
    exam: 'All',
    price: 0,
    originalPrice: 0,
    numberOfTests: 10,
    accessDurationMonths: 3,
    features: ['10 Full-Length Mock Tests', 'Detailed Step-by-Step Solutions', 'All-India Rank Leaderboard'],
    isPopular: false,
    status: 'Active',
  });
  const [newFeature, setNewFeature] = useState('');

  const openCreateModal = () => {
    setEditingPkg(null);
    setFormState({
      name: '',
      exam: 'All',
      price: 499,
      originalPrice: 999,
      numberOfTests: 15,
      accessDurationMonths: 6,
      features: [
        '15 Full-Length Mock Tests (CDS & AFCAT)',
        'Detailed Step-by-Step Solutions & Video Explanations',
        'All-India Rank Leaderboard & Sectional Analytics',
        'Unlimited Retakes for Revision',
      ],
      isPopular: false,
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingPkg(pkg);
    setFormState({
      name: pkg.name,
      exam: pkg.exam,
      price: pkg.price,
      originalPrice: pkg.originalPrice || 0,
      numberOfTests: pkg.numberOfTests,
      accessDurationMonths: pkg.accessDurationMonths,
      features: [...pkg.features],
      isPopular: pkg.isPopular || false,
      status: pkg.status,
    });
    setIsModalOpen(true);
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormState((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      showToast('error', 'Validation Error', 'Package name cannot be empty.');
      return;
    }
    if (formState.features.length === 0) {
      showToast('error', 'Validation Error', 'Please add at least one feature.');
      return;
    }

    if (editingPkg) {
      updatePackage({
        ...editingPkg,
        ...formState,
      });
      showToast('success', 'Package Updated', `${formState.name} has been updated successfully.`);
    } else {
      const newId = `pkg-${Date.now()}`;
      addPackage({
        id: newId,
        ...formState,
      });
      showToast('success', 'Package Created', `${formState.name} has been added to the catalog.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (pkg: Package) => {
    if (window.confirm(`Are you sure you want to delete package "${pkg.name}"?`)) {
      deletePackage(pkg.id);
      showToast('info', 'Package Deleted', `${pkg.name} removed.`);
    }
  };

  const toggleStatus = (pkg: Package) => {
    const nextStatus = pkg.status === 'Active' ? 'Disabled' : 'Active';
    updatePackage({ ...pkg, status: nextStatus });
    showToast('info', 'Status Updated', `${pkg.name} is now ${nextStatus}.`);
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.features.some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesExam = filterExam === 'All' || pkg.exam === filterExam || pkg.exam === 'All';
    return matchesSearch && matchesExam;
  });

  return (
    <div className="space-y-8 animate-fade-in py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3">
            <PackageIcon className="w-8 h-8 text-gold-400" />
            <span>Practice Package Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, configure, and maintain subscription test tiers, pricing, validity, and feature lists.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-3 px-5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/50 flex items-center gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Package</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900/80 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search packages or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Exam:
          </span>
          {(['All', 'CDS', 'AFCAT'] as const).map((ex) => (
            <button
              key={ex}
              onClick={() => setFilterExam(ex)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterExam === ex
                  ? 'bg-defence-700 text-white shadow-md'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} className="relative group flex flex-col justify-between">
            <PackageCard pkg={pkg} />

            {/* Admin Management Bar */}
            <div className="mt-3 p-3 rounded-2xl bg-navy-900 border border-slate-800 flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => toggleStatus(pkg)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  pkg.status === 'Active'
                    ? 'bg-defence-950 text-defence-400 border border-defence-600/40 hover:bg-defence-900'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                }`}
              >
                {pkg.status}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="p-1.5 rounded-lg bg-navy-950 hover:bg-navy-800 text-slate-300 hover:text-gold-400 border border-slate-800 transition-colors"
                  title="Edit Package"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg)}
                  className="p-1.5 rounded-lg bg-navy-950 hover:bg-red-950/80 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-navy-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span>{editingPkg ? 'Edit Package Details' : 'Create New Test Package'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Package Name *</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. AFCAT Officer Flight Sprint"
                  className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-600 focus:border-defence-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Examination Stream</label>
                  <select
                    value={formState.exam}
                    onChange={(e) => setFormState({ ...formState, exam: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:border-defence-500 focus:outline-none"
                  >
                    <option value="All">All (CDS & AFCAT Combo)</option>
                    <option value="CDS">CDS Examination</option>
                    <option value="AFCAT">AFCAT Examination</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Validity (Months)</label>
                  <input
                    type="number"
                    min="1"
                    max="36"
                    value={formState.accessDurationMonths}
                    onChange={(e) => setFormState({ ...formState, accessDurationMonths: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:border-defence-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (₹ - 0 for Free)</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:border-defence-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Original / Strikethrough Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formState.originalPrice}
                    onChange={(e) => setFormState({ ...formState, originalPrice: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:border-defence-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Total Mock Tests Included</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formState.numberOfTests}
                    onChange={(e) => setFormState({ ...formState, numberOfTests: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-800 text-white focus:border-defence-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Badges and Highlights */}
              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isPopular}
                    onChange={(e) => setFormState({ ...formState, isPopular: e.target.checked })}
                    className="rounded bg-navy-950 border-slate-700 text-defence-600 focus:ring-defence-500 w-4 h-4"
                  />
                  <span className="text-slate-300 font-medium">Mark as "Popular / Recommended"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.status === 'Active'}
                    onChange={(e) => setFormState({ ...formState, status: e.target.checked ? 'Active' : 'Disabled' })}
                    className="rounded bg-navy-950 border-slate-700 text-defence-600 focus:ring-defence-500 w-4 h-4"
                  />
                  <span className="text-slate-300 font-medium">Publish Active in Cadet Catalog</span>
                </label>
              </div>

              {/* Feature Bullets Editor */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-semibold">Features Checklist *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. Free SSB Interview Guidance PDF"
                    className="flex-1 px-4 py-2 rounded-xl bg-navy-950 border border-slate-800 text-white placeholder-slate-600 focus:border-defence-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-defence-400 font-bold border border-slate-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {formState.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-navy-950/80 border border-slate-800/80 text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-defence-400" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-400 font-semibold border border-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  {editingPkg ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
