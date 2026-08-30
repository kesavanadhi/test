import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  FileDown,
  X,
  PlusCircle,
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

export const CadetDatasetPage: React.FC = () => {
  const { cadets, importCadetDataset, exportCadets } = useData();
  const { showToast } = useToast();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datasetResult, setDatasetResult] = useState<DatasetImportResult | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('add_and_update');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Valid' | 'Invalid'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const [editingRow, setEditingRow] = useState<DatasetValidationRow | null>(null);

  // File Upload Handlers
  const handleFileUpload = async (file: File) => {
    setLoading(true);
    try {
      const result = await parseCadetDatasetFile(file, cadets);
      setDatasetResult(result);
      setCurrentPage(1);
      showToast(
        result.invalidRecords > 0 ? 'warning' : 'success',
        'Dataset Parsed',
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
  const filteredRows = datasetResult
    ? datasetResult.rows.filter((r) => {
        if (statusFilter === 'Valid' && !r.isValid) return false;
        if (statusFilter === 'Invalid' && r.isValid) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
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

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const displayedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-amber-950 text-gold-400 border border-amber-500/30">
              Bulk Cadet Administration
            </span>
            <span className="text-xs text-slate-400">Total Enrolled: <strong className="text-white">{cadets.length} Cadets</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Cadet Dataset Management Hub
          </h1>
        </div>

        {/* Action Buttons: Sample Downloads & Backups */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={downloadSampleCSV}
            className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
            title="Download Sample CSV Template"
          >
            <FileDown className="w-3.5 h-3.5 text-defence-400" />
            <span>Sample CSV</span>
          </button>

          <button
            onClick={downloadSampleExcel}
            className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
            title="Download Sample Excel Template"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sample Excel</span>
          </button>

          <button
            onClick={() => exportCadets('csv')}
            className="px-3.5 py-2 rounded-xl bg-navy-950 hover:bg-navy-900 text-gold-400 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow"
            title="Download Complete Backup"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Backup</span>
          </button>
        </div>
      </div>

      {/* Drag and Drop Uploader Box (Requirement #33) */}
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
              Drag & Drop Cadet Dataset Here
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

      {/* Dataset Summary & Validation Diagnostics (Requirement #33, #36) */}
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

          {/* Invalid Records Detailed Banner (Requirement #36) */}
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

          {/* Import Controls Bar (Requirement #37, #38) */}
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

          {/* Dataset Interactive Preview Table (Requirement #35) */}
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
                      onClick={() => { setStatusFilter(tab); setCurrentPage(1); }}
                      className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase transition-all ${
                        statusFilter === tab ? 'bg-defence-700 text-white shadow' : 'text-slate-400 hover:text-white'
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  {displayedRows.map((r) => (
                    <tr key={r.rowNumber} className={`hover:bg-navy-850/60 transition-colors ${!r.isValid ? 'bg-red-950/20' : ''}`}>
                      <td className="py-3 px-3 font-mono text-slate-500">#{r.rowNumber}</td>
                      <td className="py-3 px-4 font-mono font-bold text-white">{r.data.cadetId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-200">{r.data.name}</td>
                      <td className="py-3 px-4 text-slate-400">{r.data.email}</td>
                      <td className="py-3 px-4 text-slate-300">
                        <p className="truncate max-w-xs">{r.data.college}</p>
                        <p className="text-[10px] text-slate-500">{r.data.department} • Year {r.data.year}</p>
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-500/30" title={r.errors.join(', ')}>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Page {currentPage} of {totalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-navy-950 border border-slate-800 disabled:opacity-40 text-white"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
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
  );
};