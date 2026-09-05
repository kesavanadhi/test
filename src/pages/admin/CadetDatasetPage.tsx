import React, { useState, useRef, useMemo } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  FileDown,
  X,
  Eye,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Building2,
  Award,
  Users,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import {
  parseCadetDatasetFile,
  downloadSampleCSV,
  downloadSampleExcel,
  exportCadetsToCSV,
  exportCadetsToExcel,
  exportCadetsToJSON,
  ImportMode,
} from '../../utils/datasetParser';
import { DatasetImportResult, DatasetValidationRow, Cadet } from '../../types';
import { formatDate } from '../../utils/formatters';

export const CadetDatasetPage: React.FC = () => {
  const { cadets, importCadetDataset } = useData();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Active View Mode: 'directory' (Enrolled Cadets & Details) vs 'upload' (Import Dataset)
  const [activeTab, setActiveTab] = useState<'directory' | 'upload'>('directory');

  // Directory View State
  const [directorySearch, setDirectorySearch] = useState('');
  const [examFilter, setExamFilter] = useState<'All' | 'CDS' | 'AFCAT' | 'Both'>('All');
  const [statusFilterCadet, setStatusFilterCadet] = useState<'All' | 'Active' | 'Disabled'>('All');
  const [dirCurrentPage, setDirCurrentPage] = useState(1);
  const dirRowsPerPage = 12;

  // Selected Cadet for Full Dossier Modal
  const [selectedCadet, setSelectedCadet] = useState<Cadet | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Upload & Staging State
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datasetResult, setDatasetResult] = useState<DatasetImportResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('add_and_update');
  const [stagingSearch, setStagingSearch] = useState('');
  const [stagingStatusFilter, setStagingStatusFilter] = useState<'All' | 'Valid' | 'Invalid'>('All');
  const [stagingPage, setStagingPage] = useState(1);
  const stagingRowsPerPage = 15;

  // Filtered Enrolled Cadets
  const filteredCadets = useMemo(() => {
    return cadets.filter((c) => {
      if (examFilter !== 'All' && c.targetExam !== examFilter) return false;
      if (statusFilterCadet !== 'All' && c.status !== statusFilterCadet) return false;
      if (directorySearch.trim()) {
        const q = directorySearch.toLowerCase();
        return (
          (c.name || '').toLowerCase().includes(q) ||
          (c.cadetId || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.phone || '').toLowerCase().includes(q) ||
          (c.college || '').toLowerCase().includes(q) ||
          (c.department || '').toLowerCase().includes(q) ||
          (c.registerNumber || '').toLowerCase().includes(q) ||
          (c.nccUnit || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cadets, examFilter, statusFilterCadet, directorySearch]);

  const dirTotalPages = Math.ceil(filteredCadets.length / dirRowsPerPage) || 1;
  const displayedCadets = filteredCadets.slice(
    (dirCurrentPage - 1) * dirRowsPerPage,
    dirCurrentPage * dirRowsPerPage
  );

  // Stats calculation
  const totalCDS = cadets.filter((c) => c.targetExam === 'CDS' || c.targetExam === 'Both').length;
  const totalAFCAT = cadets.filter((c) => c.targetExam === 'AFCAT' || c.targetExam === 'Both').length;
  const totalColleges = new Set(cadets.map((c) => c.college).filter(Boolean)).size;

  // File Upload Handlers
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await parseCadetDatasetFile(file, cadets);
      setDatasetResult(result);
      setStagingPage(1);
      setActiveTab('upload');
      showToast(
        result.invalidRecords > 0 ? 'warning' : 'success',
        'Dataset Parsed Successfully',
        `Detected ${result.totalRecords} records (${result.validRecords} valid, ${result.invalidRecords} invalid).`
      );
    } catch (err: any) {
      showToast('error', 'Upload Failed', err.message || 'Could not parse dataset file.');
    } finally {
      setLoading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Import Action
  const handleImport = () => {
    if (!datasetResult || datasetResult.validRecords === 0) {
      showToast('error', 'No Valid Records', 'Please upload or correct dataset records before importing.');
      return;
    }

    const { countAdded, countUpdated } = importCadetDataset(datasetResult.rows, importMode);
    showToast(
      'success',
      'Dataset Import Successful!',
      `${countAdded} new cadets added, ${countUpdated} existing cadets updated.`
    );
    setDatasetResult(null);
    setActiveTab('directory');
  };

  // Delete Row from preview
  const handleDeletePreviewRow = (rowNum: number) => {
    if (!datasetResult) return;
    const updatedRows = datasetResult.rows.filter((r) => r.rowNumber !== rowNum);
    const validCount = updatedRows.filter((r) => r.isValid).length;
    const invalidCount = updatedRows.filter((r) => !r.isValid).length;

    setDatasetResult({
      ...datasetResult,
      totalRecords: updatedRows.length,
      validRecords: validCount,
      invalidRecords: invalidCount,
      rows: updatedRows,
    });
    showToast('info', 'Row Removed', `Row ${rowNum} deleted from staging preview.`);
  };

  // Filter preview rows
  const filteredStagingRows = datasetResult
    ? datasetResult.rows.filter((r) => {
        if (stagingStatusFilter === 'Valid' && !r.isValid) return false;
        if (stagingStatusFilter === 'Invalid' && r.isValid) return false;
        if (stagingSearch.trim()) {
          const q = stagingSearch.toLowerCase();
          return (
            (r.data.name || '').toLowerCase().includes(q) ||
            (r.data.cadetId || '').toLowerCase().includes(q) ||
            (r.data.email || '').toLowerCase().includes(q) ||
            (r.data.college || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
    : [];

  const stagingTotalPages = Math.ceil(filteredStagingRows.length / stagingRowsPerPage) || 1;
  const displayedStagingRows = filteredStagingRows.slice(
    (stagingPage - 1) * stagingRowsPerPage,
    stagingPage * stagingRowsPerPage
  );

  // Copy Cadet ID helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('info', 'Copied', `${text} copied to clipboard.`);
  };

  // Download single cadet profile slip
  const handleDownloadSingleCadet = (cadet: Cadet) => {
    const content = `=====================================================
WARRIOR DEFENCE MOCK TEST PLATFORM - CADET DOSSIER
=====================================================
Cadet ID: ${cadet.cadetId}
Full Name: ${cadet.name}
Email: ${cadet.email}
Mobile Number: ${cadet.phone}
Gender: ${cadet.gender || 'Not specified'}
Date of Birth: ${cadet.dateOfBirth || 'Not specified'}
-----------------------------------------------------
ACADEMIC DETAILS:
College / Institution: ${cadet.college}
Department / Stream: ${cadet.department}
Academic Year: Year ${cadet.year}
University: ${cadet.university}
College Register No: ${cadet.registerNumber}
-----------------------------------------------------
DEFENCE & EXAMINATION:
NCC Unit / Battalion: ${cadet.nccUnit || '1 (TN) CTC NCC'}
Target Exam: ${cadet.targetExam || 'Both'}
Tests Completed: ${cadet.testsCompleted || 0}
Average Score: ${cadet.averageScore || 0}%
Highest Score: ${cadet.highestScore || cadet.bestScore || 0}%
National Rank: #${cadet.rank || '-'}
Account Status: ${cadet.status}
Registered At: ${cadet.registrationDate}
=====================================================`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cadet_${cadet.cadetId}_dossier.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('success', 'Cadet Dossier Downloaded', `Dossier saved for ${cadet.cadetId}.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-950 text-gold-400 border border-amber-500/30">
              Bulk Cadet Administration
            </span>
            <span className="text-xs text-slate-400">
              Total Enrolled: <strong className="text-white">{cadets.length} Cadets</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Cadet Dataset Management Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Inspect all details filled by registered candidates & download complete datasets (Excel, CSV, JSON).
          </p>
        </div>

        {/* Master Download Options Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-navy-950 p-1 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => exportCadetsToExcel(filteredCadets, 'cadet_master_dataset.xlsx')}
              className="px-3.5 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
              title="Download All Cadet Details in Excel format (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Download Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => exportCadetsToCSV(filteredCadets, 'cadet_master_dataset.csv')}
              className="px-3.5 py-2 rounded-xl hover:bg-navy-900 text-defence-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Download All Cadet Details in CSV format (.csv)"
            >
              <FileDown className="w-4 h-4 text-defence-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => exportCadetsToJSON(filteredCadets, 'cadet_master_dataset.json')}
              className="px-3.5 py-2 rounded-xl hover:bg-navy-900 text-gold-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Download All Cadet Details in JSON format (.json)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>

          <button
            onClick={downloadSampleExcel}
            className="px-3 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-400 hover:text-white border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Download blank sample Excel template for bulk uploads"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Sample Template</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
            <Users className="w-4 h-4 text-defence-400" />
          </div>
          <p className="text-2xl font-black text-white mt-1">{cadets.length}</p>
          <span className="text-[10px] text-slate-500">Official Candidate Profiles</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CDS Aspirants</span>
            <Award className="w-4 h-4 text-gold-400" />
          </div>
          <p className="text-2xl font-black text-gold-400 mt-1">{totalCDS}</p>
          <span className="text-[10px] text-slate-500">IMA / INA / AFA / OTA</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AFCAT Aspirants</span>
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 mt-1">{totalAFCAT}</p>
          <span className="text-[10px] text-slate-500">Flying & Ground Duty</span>
        </div>

        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Institutions</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalColleges}</p>
          <span className="text-[10px] text-slate-500">Colleges & Universities</span>
        </div>
      </div>

      {/* Main Mode Navigation Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'directory'
              ? 'bg-defence-700 text-white shadow-lg shadow-defence-950/60 border border-defence-500/40'
              : 'bg-navy-900 text-slate-400 hover:text-white hover:bg-navy-850'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>📋 Enrolled Cadets Directory & Filled Details ({cadets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-navy-950 font-black shadow-lg shadow-amber-950/60 border border-amber-400/40'
              : 'bg-navy-900 text-slate-400 hover:text-white hover:bg-navy-850'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>📥 Upload / Import Dataset File</span>
          {datasetResult && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-navy-950 text-gold-400 text-[10px] font-mono">
              {datasetResult.validRecords} Staged
            </span>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ENROLLED CADETS DIRECTORY & FILLED DETAILS (Requirement) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-4 animate-fade-in">
          {/* Search & Filter Bar */}
          <div className="p-5 rounded-3xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Name, Cadet ID, Email, Phone, College, Register No..."
                value={directorySearch}
                onChange={(e) => {
                  setDirectorySearch(e.target.value);
                  setDirCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
              />
              {directorySearch && (
                <button
                  onClick={() => setDirectorySearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Exam Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Exam:</span>
                <select
                  value={examFilter}
                  onChange={(e) => {
                    setExamFilter(e.target.value as any);
                    setDirCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs font-semibold focus:border-defence-500"
                >
                  <option value="All">All Exams</option>
                  <option value="CDS">CDS Only</option>
                  <option value="AFCAT">AFCAT Only</option>
                  <option value="Both">Both (Dual)</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold">Status:</span>
                <select
                  value={statusFilterCadet}
                  onChange={(e) => {
                    setStatusFilterCadet(e.target.value as any);
                    setDirCurrentPage(1);
                  }}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs font-semibold focus:border-defence-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>

              {/* Quick Export Button */}
              <button
                onClick={() => exportCadetsToExcel(filteredCadets, 'enrolled_cadet_details.xlsx')}
                className="px-4 py-2 rounded-xl bg-defence-700 hover:bg-defence-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow"
                title="Export currently filtered cadets to Excel"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export List ({filteredCadets.length})</span>
              </button>
            </div>
          </div>

          {/* Enrolled Cadets Details Table */}
          <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-400" />
                <span>Candidate Profiles & Submitted Registration Data</span>
              </h3>
              <span className="text-xs text-slate-400">
                Showing {displayedCadets.length} of {filteredCadets.length} Cadets
              </span>
            </div>

            {filteredCadets.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">No Cadets Match Your Filter</p>
                <p className="text-xs text-slate-500">Try adjusting your search query or clear the filter.</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs">
                  <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-3">Cadet ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Contact (Email & Mobile)</th>
                      <th className="py-3.5 px-3">Personal (Gender & DOB)</th>
                      <th className="py-3.5 px-4">College, Dept & Year</th>
                      <th className="py-3.5 px-3">Register No</th>
                      <th className="py-3.5 px-3">NCC Unit</th>
                      <th className="py-3.5 px-3">Target Exam</th>
                      <th className="py-3.5 px-3">Tests & Score</th>
                      <th className="py-3.5 px-3">Registered On</th>
                      <th className="py-3.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {displayedCadets.map((c) => (
                      <tr key={c.id} className="hover:bg-navy-850/60 transition-colors">
                        {/* Cadet ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-white whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(c.cadetId)}
                            className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 group"
                            title="Click to copy Cadet ID"
                          >
                            <span>{c.cadetId}</span>
                            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-100 whitespace-nowrap">
                          <p className="truncate max-w-[150px]">{c.name}</p>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            Rank #{c.rank || '-'}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <p className="flex items-center gap-1 truncate max-w-[180px]">
                            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{c.email}</span>
                          </p>
                          <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 font-mono">
                            <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                            <span>{c.phone || '-'}</span>
                          </p>
                        </td>

                        {/* Gender & DOB */}
                        <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                          <p className="font-semibold text-slate-300">{c.gender || 'Male'}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>{c.dateOfBirth || 'N/A'}</span>
                          </p>
                        </td>

                        {/* College, Dept & Year */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <p className="font-semibold text-slate-200 truncate max-w-[200px]" title={c.college}>
                            {c.college}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                            {c.department} • Year {c.year}
                          </p>
                        </td>

                        {/* Register No */}
                        <td className="py-3.5 px-3 font-mono text-slate-300 whitespace-nowrap">
                          {c.registerNumber || '-'}
                        </td>

                        {/* NCC Unit */}
                        <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-navy-950 border border-slate-800 text-slate-300">
                            {c.nccUnit || '1 (TN) CTC NCC'}
                          </span>
                        </td>

                        {/* Target Exam */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              c.targetExam === 'CDS'
                                ? 'bg-amber-950/80 text-gold-400 border-amber-500/40'
                                : c.targetExam === 'AFCAT'
                                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                                : 'bg-defence-950 text-defence-300 border-defence-500/40'
                            }`}
                          >
                            {c.targetExam || 'Both'}
                          </span>
                        </td>

                        {/* Tests & Avg Score */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <p className="font-bold text-white">{c.testsCompleted || 0} tests</p>
                          <p className="text-[10px] text-defence-400">{c.averageScore || 0}% avg</p>
                        </td>

                        {/* Registered On */}
                        <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap text-[11px]">
                          {formatDate(c.registrationDate)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedCadet(c);
                                setIsDossierOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-gold-400 hover:text-gold-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
                              title="View Full Cadet Dossier"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={() => handleDownloadSingleCadet(c)}
                              className="p-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-white border border-slate-700 transition-all"
                              title="Download Individual Cadet Profile Dossier (.txt)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {dirTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Page {dirCurrentPage} of {dirTotalPages} ({filteredCadets.length} total cadets)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDirCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={dirCurrentPage === 1}
                    className="px-3.5 py-1.5 rounded-xl bg-navy-950 border border-slate-800 disabled:opacity-40 text-white font-semibold"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setDirCurrentPage((p) => Math.min(dirTotalPages, p + 1))}
                    disabled={dirCurrentPage === dirTotalPages}
                    className="px-3.5 py-1.5 rounded-xl bg-navy-950 border border-slate-800 disabled:opacity-40 text-white font-semibold"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: UPLOAD & IMPORT DATASET (Spreadsheets) */}
      {/* ========================================================================= */}
      {activeTab === 'upload' && (
        <div className="space-y-6 animate-fade-in">
          {/* Drag and Drop Uploader Box */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-defence-400 bg-defence-950/40 scale-[1.01]'
                : 'border-slate-700 bg-navy-900/80 hover:bg-navy-900 hover:border-slate-600'
            } shadow-2xl relative overflow-hidden`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, .xlsx, .xls, .json"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />

            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-navy-950 border border-defence-500/40 mx-auto flex items-center justify-center text-defence-400 shadow-xl">
                <UploadCloud className="w-8 h-8 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white font-display">
                  Drag & Drop Cadet Dataset File Here
                </h3>
                <p className="text-xs text-slate-400">
                  or <span className="text-defence-400 font-bold underline">Choose File</span> from your computer
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] text-slate-400">
                <span className="px-2.5 py-1 rounded-md bg-navy-950 border border-slate-800 font-mono font-bold text-defence-300">CSV</span>
                <span className="px-2.5 py-1 rounded-md bg-navy-950 border border-slate-800 font-mono font-bold text-emerald-300">XLSX</span>
                <span className="px-2.5 py-1 rounded-md bg-navy-950 border border-slate-800 font-mono font-bold text-gold-300">XLS</span>
                <span className="px-2.5 py-1 rounded-md bg-navy-950 border border-slate-800 font-mono font-bold text-cyan-300">JSON</span>
              </div>
            </div>
          </div>

          {/* Dataset Summary & Diagnostics */}
          {datasetResult && (
            <div className="space-y-6 animate-slide-up">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">File Name</span>
                  <p className="text-sm font-black text-white mt-1 truncate">{datasetResult.fileName}</p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Records Detected</span>
                  <p className="text-2xl font-black text-white mt-1">{datasetResult.totalRecords}</p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-defence-400">Valid Records</span>
                  <p className="text-2xl font-black text-defence-400 mt-1">{datasetResult.validRecords}</p>
                </div>
                <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Invalid Records</span>
                  <p className="text-2xl font-black text-red-400 mt-1">{datasetResult.invalidRecords}</p>
                </div>
              </div>

              {/* Invalid Records Detailed Banner */}
              {datasetResult.invalidRecords > 0 && (
                <div className="p-5 rounded-2xl bg-red-950/80 border border-red-500/50 space-y-2 text-xs text-red-200 shadow-xl">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{datasetResult.invalidRecords} Invalid Records Flagged</span>
                  </div>
                  <p className="text-slate-300">
                    The following rows contain formatting errors and will be skipped unless corrected:
                  </p>
                  <div className="max-h-32 overflow-y-auto space-y-1.5 pt-1 custom-scrollbar">
                    {datasetResult.rows
                      .filter((r) => !r.isValid)
                      .map((r) => (
                        <div key={r.rowNumber} className="p-2 rounded-lg bg-black/40 border border-red-500/30 text-[11px]">
                          <strong>Row {r.rowNumber}:</strong> {r.errors.join(' • ')}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Import Controls Bar */}
              <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Duplicate Handling Strategy</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Choose how existing Cadet IDs in the database should be handled:
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={importMode}
                    onChange={(e) => setImportMode(e.target.value as ImportMode)}
                    className="px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white text-xs font-bold focus:border-defence-500"
                  >
                    <option value="add_and_update">Add New + Update Existing</option>
                    <option value="add_new_only">Add New Only (Skip Existing)</option>
                    <option value="update_existing">Update Existing Only</option>
                  </select>

                  <button
                    onClick={handleImport}
                    disabled={datasetResult.validRecords === 0}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Import {datasetResult.validRecords} Cadets</span>
                  </button>

                  <button
                    onClick={() => setDatasetResult(null)}
                    className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold uppercase"
                  >
                    Discard Staging
                  </button>
                </div>
              </div>

              {/* Dataset Interactive Staging Table */}
              <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl space-y-4 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Staged Dataset Records Preview ({datasetResult.totalRecords} Total)
                  </h3>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-slate-800 text-xs">
                      {(['All', 'Valid', 'Invalid'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setStagingStatusFilter(tab);
                            setStagingPage(1);
                          }}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase transition-all ${
                            stagingStatusFilter === tab
                              ? 'bg-defence-700 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <div className="relative max-w-xs w-full">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search preview..."
                        value={stagingSearch}
                        onChange={(e) => setStagingSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-3">Row</th>
                        <th className="py-3 px-4">Cadet ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">College / Dept</th>
                        <th className="py-3 px-3">Reg No</th>
                        <th className="py-3 px-3">Target Exam</th>
                        <th className="py-3 px-3">Validation</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {displayedStagingRows.map((r) => (
                        <tr
                          key={r.rowNumber}
                          className={`hover:bg-navy-850/60 transition-colors ${
                            !r.isValid ? 'bg-red-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-mono text-slate-500">#{r.rowNumber}</td>
                          <td className="py-3 px-4 font-mono font-bold text-white">{r.data.cadetId}</td>
                          <td className="py-3 px-4 font-semibold text-slate-200">{r.data.name}</td>
                          <td className="py-3 px-4 text-slate-400">{r.data.email}</td>
                          <td className="py-3 px-4 text-slate-300">
                            <p className="truncate max-w-xs">{r.data.college}</p>
                            <p className="text-[10px] text-slate-500">
                              {r.data.department} • Year {r.data.year}
                            </p>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400">{r.data.registerNumber}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-950 text-defence-400 border border-defence-600/30">
                              {r.data.targetExam || 'Both'}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            {r.isValid ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-defence-950 text-defence-300 border border-defence-500/30">
                                Valid
                              </span>
                            ) : (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30"
                                title={r.errors.join(', ')}
                              >
                                {r.errors[0]}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => handleDeletePreviewRow(r.rowNumber)}
                              className="p-1 rounded bg-navy-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all"
                              title="Remove row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Staging Pagination */}
                {stagingTotalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">
                      Page {stagingPage} of {stagingTotalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setStagingPage((p) => Math.max(1, p - 1))}
                        disabled={stagingPage === 1}
                        className="px-3 py-1 rounded bg-navy-950 border border-slate-800 disabled:opacity-40 text-white"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setStagingPage((p) => Math.min(stagingTotalPages, p + 1))}
                        disabled={stagingPage === stagingTotalPages}
                        className="px-3 py-1 rounded bg-navy-950 border border-slate-800 disabled:opacity-40 text-white"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL CADET DOSSIER MODAL (Show all details the cadet filled) */}
      {/* ========================================================================= */}
      {isDossierOpen && selectedCadet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-navy-900 border border-slate-700 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-navy-950 to-navy-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-defence-950 border border-defence-500/40 flex items-center justify-center text-defence-400 font-bold text-lg shadow-inner">
                  {selectedCadet.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-white font-display">{selectedCadet.name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-defence-950 text-defence-300 border border-defence-500/30">
                      {selectedCadet.status}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gold-400 font-bold mt-0.5">
                    Cadet ID: {selectedCadet.cadetId}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDossierOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar text-xs">
              {/* Section 1: Personal Information */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gold-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>1. Personal & Contact Details</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Full Legal Name</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedCadet.name}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Email Address</span>
                    <p className="text-sm font-bold text-white mt-0.5 truncate">{selectedCadet.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mobile Number</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">{selectedCadet.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Gender & Date of Birth</span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {selectedCadet.gender || 'Male'} • {selectedCadet.dateOfBirth || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: College & Academic Background */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-defence-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>2. College & Academic Information</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">College / Institution</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedCadet.college}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Department / Branch</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedCadet.department}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Academic Year</span>
                    <p className="text-sm font-bold text-white mt-0.5">Year {selectedCadet.year}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">College Register / Roll Number</span>
                    <p className="text-sm font-bold text-white font-mono mt-0.5">{selectedCadet.registerNumber || 'N/A'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Affiliated University</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedCadet.university || 'State Technical University'}</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Defence Examination & Activity Profile */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>3. NCC Unit & Examination Aspirations</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">NCC Unit / Battalion</span>
                    <p className="text-sm font-bold text-white mt-0.5">{selectedCadet.nccUnit || '1 (TN) CTC NCC'}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Target Defence Examination</span>
                    <p className="text-sm font-bold text-gold-400 mt-0.5">
                      {selectedCadet.targetExam === 'Both' ? 'UPSC CDS & IAF AFCAT' : selectedCadet.targetExam}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Tests Completed</span>
                    <p className="text-lg font-black text-white mt-0.5">{selectedCadet.testsCompleted || 0}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Average Score</span>
                    <p className="text-lg font-black text-defence-400 mt-0.5">{selectedCadet.averageScore || 0}%</p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Highest Score</span>
                    <p className="text-lg font-black text-gold-400 mt-0.5">
                      {selectedCadet.highestScore || selectedCadet.bestScore || 0}%
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">National Rank</span>
                    <p className="text-lg font-black text-cyan-400 mt-0.5">#{selectedCadet.rank || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Registration Meta */}
              <div className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                <span>Registered on: <strong>{formatDate(selectedCadet.registrationDate)}</strong></span>
                <span>Account Status: <strong className="text-emerald-400">{selectedCadet.status}</strong></span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-navy-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleDownloadSingleCadet(selectedCadet)}
                className="px-4 py-2.5 rounded-xl bg-defence-700 hover:bg-defence-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Cadet Dossier (.txt)</span>
              </button>

              <button
                onClick={() => setIsDossierOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};