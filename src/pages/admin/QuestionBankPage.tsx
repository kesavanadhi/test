import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  Trash2,
  Eye,
  Edit,
  CheckCircle2,
  FileCheck2,
  Layers,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { QuestionPreviewCard } from '../../components/questionBank/QuestionPreviewCard';
import { Question } from '../../types';

export const QuestionBankPage: React.FC = () => {
  const { questions, deleteQuestion } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState<'All' | 'CDS' | 'AFCAT'>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [previewingQuestion, setPreviewingQuestion] = useState<Question | null>(null);

  // Question Counters (Requirement #26 & #38)
  const totalCount = questions.length;
  const cdsCount = questions.filter((q) => q.exam === 'CDS').length;
  const afcatCount = questions.filter((q) => q.exam === 'AFCAT').length;
  const easyCount = questions.filter((q) => q.difficulty === 'Easy').length;
  const mediumCount = questions.filter((q) => q.difficulty === 'Medium').length;
  const hardCount = questions.filter((q) => q.difficulty === 'Hard').length;

  const filteredQuestions = questions.filter((q) => {
    if (examFilter !== 'All' && q.exam !== examFilter) return false;
    if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        (q.text || '').toLowerCase().includes(query) ||
        q.subject.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question from the Question Bank?')) {
      deleteQuestion(id);
      showToast('info', 'Question Deleted', 'Question removed from bank and active tests.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Question Bank Master Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centrally manage, filter, preview, and categorize CDS and AFCAT examination questions.
          </p>
        </div>

        <Link
          to="/admin/add-questions"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 flex items-center gap-2 transition-all hover:scale-105 border border-defence-400/40 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Questions (Slash / Bulk)</span>
        </Link>
      </div>

      {/* Question Counters Bar (Requirement #26 & #38) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Questions</span>
          <p className="text-2xl sm:text-3xl font-black text-white mt-1">{totalCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-defence-400">CDS Questions</span>
          <p className="text-2xl sm:text-3xl font-black text-defence-400 mt-1">{cdsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">AFCAT Questions</span>
          <p className="text-2xl sm:text-3xl font-black text-gold-400 mt-1">{afcatCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Easy Level</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{easyCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Medium Level</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{mediumCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Hard Level</span>
          <p className="text-2xl font-black text-red-400 mt-1">{hardCount}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-1.5 p-1 bg-navy-950 rounded-xl border border-slate-800 self-start">
          {(['All', 'CDS', 'AFCAT'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setExamFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                examFilter === tab
                  ? 'bg-defence-700 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'All' ? 'All Exams' : tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 flex-1 md:justify-end">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search question text, topic, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
            />
          </div>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-defence-500"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Questions Table (Requirement #41) */}
      <div className="rounded-3xl bg-navy-900/90 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-4 px-4">ID</th>
                <th className="py-4 px-3">Exam</th>
                <th className="py-4 px-4">Subject</th>
                <th className="py-4 px-6">Question Text / Media</th>
                <th className="py-4 px-3 text-center">Correct Ans</th>
                <th className="py-4 px-3 text-center">Marks</th>
                <th className="py-4 px-3 text-center">Negative</th>
                <th className="py-4 px-3 text-center">Difficulty</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-navy-850/60 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-slate-400 text-[11px]">{q.id}</td>
                  <td className="py-4 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-navy-950 text-defence-400 border border-defence-600/30">
                      {q.exam}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-300">{q.subject}</td>
                  <td className="py-4 px-6 font-medium text-white max-w-sm truncate">
                    {q.text || (q.image ? '[Image-Based Question]' : 'Untitled')}
                  </td>
                  <td className="py-4 px-3 text-center font-bold text-defence-400">{q.correctAnswer}</td>
                  <td className="py-4 px-3 text-center font-semibold text-slate-200">+{q.marks}</td>
                  <td className="py-4 px-3 text-center font-semibold text-red-400">-{q.negativeMarks}</td>
                  <td className="py-4 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      q.difficulty === 'Easy'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                        : q.difficulty === 'Medium'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        : 'bg-red-950 text-red-400 border border-red-500/30'
                    }`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setPreviewingQuestion(q)}
                      className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-all"
                      title="Preview Question"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-950 text-slate-400 hover:text-red-400 transition-all"
                      title="Delete Question"
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

      {/* Preview Modal */}
      {previewingQuestion && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">Question Bank Live Preview</h3>
              <button onClick={() => setPreviewingQuestion(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <QuestionPreviewCard question={previewingQuestion} />
            <button
              onClick={() => setPreviewingQuestion(null)}
              className="w-full py-3 rounded-xl bg-navy-950 text-slate-300 border border-slate-700 font-bold text-xs uppercase"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
