import React, { useState } from 'react';
import {
  FileCheck2,
  PlusCircle,
  Clock,
  Award,
  CheckCircle2,
  Trash2,
  Edit,
  Sparkles,
  Eye,
  X,
  Shuffle,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { MockTest, ExamCategory, SubjectType } from '../../types';

export const TestManagementPage: React.FC = () => {
  const { tests, questions, createTest, updateTest, deleteTest } = useData();
  const { showToast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [testName, setTestName] = useState('');
  const [exam, setExam] = useState<ExamCategory>('CDS');
  const [subject, setSubject] = useState<SubjectType>('Full Mock Test');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [negativeMarking, setNegativeMarking] = useState(0.33);
  const [status, setStatus] = useState<MockTest['status']>('Live');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);

  const availableQuestions = questions.filter((q) => q.exam === exam);

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) {
      showToast('error', 'Test Name Required', 'Please enter a valid title for this mock test.');
      return;
    }

    const newTest: MockTest = {
      id: `TEST-${exam}-${Date.now().toString(36).substr(2, 5)}`.toUpperCase(),
      name: testName.trim(),
      exam,
      subject,
      description: description || `Comprehensive timed mock test for ${exam} aspirants.`,
      durationMinutes: Number(durationMinutes) || 120,
      totalMarks: Number(totalMarks) || 100,
      passingMarks: Number(passingMarks) || 40,
      negativeMarking: Number(negativeMarking) || 0.33,
      questionsCount: selectedQuestionIds.length > 0 ? selectedQuestionIds.length : Math.min(10, availableQuestions.length),
      questionIds: selectedQuestionIds.length > 0 ? selectedQuestionIds : availableQuestions.slice(0, 10).map((q) => q.id),
      status,
      randomizeQuestions,
      createdAt: new Date().toISOString(),
    };

    createTest(newTest);
    showToast('success', 'Mock Test Published', `${newTest.name} is now available in Cadet portal.`);
    setIsCreating(false);
    setTestName('');
    setDescription('');
    setSelectedQuestionIds([]);
  };

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Mock Test Management & Creation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure examination papers, duration timers, negative marking, and question mappings.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 flex items-center gap-2 transition-all hover:scale-105 border border-defence-400/40 self-start sm:self-auto"
        >
          {isCreating ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          <span>{isCreating ? 'Cancel Creation' : 'Create New Mock Test'}</span>
        </button>
      </div>

      {/* Test Creation Form (Requirement #42, #43) */}
      {isCreating && (
        <form onSubmit={handleCreateTest} className="p-6 sm:p-8 rounded-3xl bg-navy-900 border border-slate-800 space-y-6 shadow-2xl animate-slide-up">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Configure New Mock Test</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-semibold text-slate-300">Test Title / Name</label>
              <input
                type="text"
                required
                placeholder="e.g. CDS Full Length Mock Test - 03"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Exam Stream</label>
              <select
                value={exam}
                onChange={(e) => setExam(e.target.value as ExamCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              >
                <option value="CDS">CDS</option>
                <option value="AFCAT">AFCAT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Subject / Category</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectType)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Test Duration (Minutes)</label>
              <input
                type="number"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Total Marks</label>
              <input
                type="number"
                required
                value={totalMarks}
                onChange={(e) => setTotalMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Passing Marks</label>
              <input
                type="number"
                required
                value={passingMarks}
                onChange={(e) => setPassingMarks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Negative Marking</label>
              <input
                type="number"
                step="0.01"
                required
                value={negativeMarking}
                onChange={(e) => setNegativeMarking(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-red-400 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Test Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MockTest['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
              >
                <option value="Live">Live (Active for Cadets)</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Draft">Draft</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Exam guidelines, target academy, subject breakdown..."
              className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
            />
          </div>

          {/* Question Selector from Bank */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Select Questions from Bank ({selectedQuestionIds.length} Selected)
              </label>
              <button
                type="button"
                onClick={() => setSelectedQuestionIds(availableQuestions.map((q) => q.id))}
                className="text-[11px] text-defence-400 hover:underline"
              >
                Select All {availableQuestions.length}
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-800 p-2 rounded-2xl bg-navy-950 custom-scrollbar">
              {availableQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => toggleQuestionSelection(q.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs ${
                      isSelected
                        ? 'bg-defence-900/60 border border-defence-500/50 text-white'
                        : 'bg-navy-900/60 text-slate-400 hover:bg-navy-850'
                    }`}
                  >
                    <span className="truncate max-w-lg">{q.text || '[Image Question]'}</span>
                    <span className="font-mono text-[10px] text-slate-500">{q.id}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-defence-600 hover:bg-defence-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg"
            >
              Publish Test
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-3 rounded-xl bg-navy-950 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold uppercase"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tests Table */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Test Name</th>
                <th className="py-4 px-4">Exam</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-4">Questions</th>
                <th className="py-4 px-4">Duration</th>
                <th className="py-4 px-4">Total Marks</th>
                <th className="py-4 px-4">Pass Marks</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{t.name}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-extrabold bg-navy-950 text-defence-400 border border-defence-600/30">
                      {t.exam}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300">{t.subject}</td>
                  <td className="py-4 px-4 font-bold text-white">{t.questionsCount}</td>
                  <td className="py-4 px-4 text-slate-300">{t.durationMinutes} mins</td>
                  <td className="py-4 px-4 font-bold text-white">{t.totalMarks}</td>
                  <td className="py-4 px-4 font-semibold text-defence-400">{t.passingMarks}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Live'
                        ? 'bg-defence-950 text-defence-300 border border-defence-500/30'
                        : t.status === 'Scheduled'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => {
                        const newStatus = t.status === 'Live' ? 'Disabled' : 'Live';
                        updateTest({ ...t, status: newStatus });
                        showToast('info', 'Status Updated', `${t.name} is now ${newStatus}`);
                      }}
                      className="px-2.5 py-1 rounded bg-navy-800 hover:bg-navy-700 text-slate-300 font-semibold text-[11px]"
                    >
                      {t.status === 'Live' ? 'Disable' : 'Go Live'}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this mock test?')) {
                          deleteTest(t.id);
                          showToast('info', 'Test Deleted', `${t.name} removed.`);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all inline-block"
                      title="Delete Test"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
