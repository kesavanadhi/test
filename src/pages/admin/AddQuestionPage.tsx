import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Eye,
  FileSpreadsheet,
  Check,
  X,
  Layers,
  Equal,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { QuestionPreviewCard } from '../../components/questionBank/QuestionPreviewCard';
import { ImageUploader } from '../../components/questionBank/ImageUploader';
import { parseSingleSlashQuestion, parseBulkSlashQuestions, draftToQuestion } from '../../utils/questionParser';
import { ExamCategory, SubjectType, Difficulty, Question, OptionItem } from '../../types';

export const AddQuestionPage: React.FC = () => {
  const { questions, addQuestion, addBulkQuestions } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Mode: Single Slash Parser vs Bulk Multi-Line Paste vs Manual Form
  const [activeTab, setActiveTab] = useState<'slash' | 'bulk' | 'manual'>('slash');

  // Form State
  const [exam, setExam] = useState<ExamCategory>('CDS');
  const [subject, setSubject] = useState<SubjectType>('General Knowledge');
  const [topic, setTopic] = useState('Indian Polity');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [marks, setMarks] = useState<number>(1);
  const [negativeMarks, setNegativeMarks] = useState<number>(0.33);
  const [correctAnswer, setCorrectAnswer] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [explanation, setExplanation] = useState('');

  // Individual Bulk Question answers & explanations state (Per-question answer selector)
  const [bulkCustomAnswers, setBulkCustomAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [bulkCustomExplanations, setBulkCustomExplanations] = useState<Record<string, string>>({});

  const setAnswerForQuestion = (draftId: string, ans: 'A' | 'B' | 'C' | 'D') => {
    setBulkCustomAnswers((prev) => ({ ...prev, [draftId]: ans }));
  };

  const setExplanationForQuestion = (draftId: string, text: string) => {
    setBulkCustomExplanations((prev) => ({ ...prev, [draftId]: text }));
  };

  // Slash Single Input
  const [slashInput, setSlashInput] = useState(
    'Which Article of the Indian Constitution deals with Fundamental Rights? / Article 12–35 / Article 36–51 / Article 52–78 / Article 79–122'
  );

  // Bulk Input
  const [bulkInput, setBulkInput] = useState(
`What is the capital of India? / Chennai / Mumbai / New Delhi / Kolkata
Which force protects India's airspace? / Indian Army / Indian Navy / Indian Air Force / Coast Guard
Who is the Supreme Commander of Indian Armed Forces? / Prime Minister / President of India / Defence Minister / Chief of Defence Staff
The Siachen Glacier is situated in which mountain range? / Pir Panjal / Karakoram / Zanskar / Ladakh`
  );

  // Manual & Media State
  const [manualQuestionText, setManualQuestionText] = useState('');
  const [questionImage, setQuestionImage] = useState<string | undefined>(undefined);
  const [optionAText, setOptionAText] = useState('');
  const [optionAImage, setOptionAImage] = useState<string | undefined>(undefined);
  const [optionBText, setOptionBText] = useState('');
  const [optionBImage, setOptionBImage] = useState<string | undefined>(undefined);
  const [optionCText, setOptionCText] = useState('');
  const [optionCImage, setOptionCImage] = useState<string | undefined>(undefined);
  const [optionDText, setOptionDText] = useState('');
  const [optionDImage, setOptionDImage] = useState<string | undefined>(undefined);

  // Dynamic Subjects depending on Exam
  const subjectsForExam: SubjectType[] = exam === 'CDS'
    ? ['English', 'General Knowledge', 'Elementary Mathematics']
    : ['General Awareness', 'Verbal Ability in English', 'Numerical Ability', 'Reasoning', 'Military Aptitude'];

  // Keep marks in sync with exam standard
  const handleExamChange = (newExam: ExamCategory) => {
    setExam(newExam);
    if (newExam === 'CDS') {
      setSubject('General Knowledge');
      setMarks(1);
      setNegativeMarks(0.33);
    } else {
      setSubject('General Awareness');
      setMarks(3);
      setNegativeMarks(1);
    }
  };

  // Parsed Single Draft
  const parsedSingle = useMemo(() => {
    return parseSingleSlashQuestion(slashInput, 1, {
      exam,
      subject,
      topic,
      difficulty,
      marks,
      negativeMarks,
    });
  }, [slashInput, exam, subject, topic, difficulty, marks, negativeMarks]);

  // Parsed Bulk Result
  const parsedBulk = useMemo(() => {
    return parseBulkSlashQuestions(bulkInput, {
      exam,
      subject,
      topic,
      difficulty,
      marks,
      negativeMarks,
    });
  }, [bulkInput, exam, subject, topic, difficulty, marks, negativeMarks]);

  // Active Draft for Live Preview Pane
  const livePreviewQuestion: Partial<Question> = useMemo(() => {
    if (activeTab === 'slash') {
      return {
        exam,
        subject,
        topic,
        difficulty,
        text: parsedSingle.questionText,
        image: questionImage,
        options: [
          { id: 'A', text: parsedSingle.optionA, image: optionAImage },
          { id: 'B', text: parsedSingle.optionB, image: optionBImage },
          { id: 'C', text: parsedSingle.optionC, image: optionCImage },
          { id: 'D', text: parsedSingle.optionD, image: optionDImage },
        ],
        correctAnswer,
        marks,
        negativeMarks,
        explanation,
      };
    } else if (activeTab === 'bulk') {
      const firstValid = parsedBulk.validQuestions[0];
      if (firstValid) {
        return {
          exam,
          subject,
          topic,
          difficulty,
          text: firstValid.questionText,
          options: [
            { id: 'A', text: firstValid.optionA },
            { id: 'B', text: firstValid.optionB },
            { id: 'C', text: firstValid.optionC },
            { id: 'D', text: firstValid.optionD },
          ],
          correctAnswer,
          marks,
          negativeMarks,
          explanation,
        };
      }
      return {
        exam,
        subject,
        topic,
        difficulty,
        text: 'Paste valid questions in slash format to preview',
        options: [
          { id: 'A', text: 'Option A' },
          { id: 'B', text: 'Option B' },
          { id: 'C', text: 'Option C' },
          { id: 'D', text: 'Option D' },
        ],
        correctAnswer: 'A',
        marks,
        negativeMarks,
        explanation,
      };
    } else {
      return {
        exam,
        subject,
        topic,
        difficulty,
        text: manualQuestionText,
        image: questionImage,
        options: [
          { id: 'A', text: optionAText, image: optionAImage },
          { id: 'B', text: optionBText, image: optionBImage },
          { id: 'C', text: optionCText, image: optionCImage },
          { id: 'D', text: optionDText, image: optionDImage },
        ],
        correctAnswer,
        marks,
        negativeMarks,
        explanation,
      };
    }
  }, [
    activeTab,
    parsedSingle,
    parsedBulk,
    exam,
    subject,
    topic,
    difficulty,
    questionImage,
    optionAImage,
    optionBImage,
    optionCImage,
    optionDImage,
    correctAnswer,
    marks,
    negativeMarks,
    explanation,
    manualQuestionText,
    optionAText,
    optionBText,
    optionCText,
    optionDText,
  ]);

  // Save Single Question
  const handleSaveSingle = (andAddAnother = false) => {
    if (activeTab === 'slash') {
      if (!parsedSingle.isValid) {
        showToast('error', 'Invalid Question Format', parsedSingle.errorMessage || 'Please ensure 5 parts separated by /');
        return;
      }

      const newQ: Question = {
        id: `Q-${exam}-${Date.now().toString(36).substr(2, 5)}`.toUpperCase(),
        exam,
        subject,
        topic,
        difficulty,
        text: parsedSingle.questionText,
        image: questionImage,
        options: [
          { id: 'A', text: parsedSingle.optionA, image: optionAImage },
          { id: 'B', text: parsedSingle.optionB, image: optionBImage },
          { id: 'C', text: parsedSingle.optionC, image: optionCImage },
          { id: 'D', text: parsedSingle.optionD, image: optionDImage },
        ],
        correctAnswer,
        marks: Number(marks) || 1,
        negativeMarks: Number(negativeMarks) || 0.33,
        explanation: explanation || 'Standard syllabus solution.',
        createdAt: new Date().toISOString(),
      };

      addQuestion(newQ);
      showToast('success', 'Question Added to Bank', `Question Bank Count: ${questions.length + 1}`);

      if (andAddAnother) {
        setSlashInput('');
        setQuestionImage(undefined);
        setOptionAImage(undefined);
        setOptionBImage(undefined);
        setOptionCImage(undefined);
        setOptionDImage(undefined);
        setExplanation('');
      } else {
        navigate('/admin/question-bank');
      }
    } else if (activeTab === 'manual') {
      if (!manualQuestionText.trim() && !questionImage) {
        showToast('error', 'Question Required', 'Please enter question text or upload a question image.');
        return;
      }

      const newQ: Question = {
        id: `Q-${exam}-${Date.now().toString(36).substr(2, 5)}`.toUpperCase(),
        exam,
        subject,
        topic,
        difficulty,
        text: manualQuestionText,
        image: questionImage,
        options: [
          { id: 'A', text: optionAText, image: optionAImage },
          { id: 'B', text: optionBText, image: optionBImage },
          { id: 'C', text: optionCText, image: optionCImage },
          { id: 'D', text: optionDText, image: optionDImage },
        ],
        correctAnswer,
        marks: Number(marks) || 1,
        negativeMarks: Number(negativeMarks) || 0.33,
        explanation: explanation || 'Standard syllabus solution.',
        createdAt: new Date().toISOString(),
      };

      addQuestion(newQ);
      showToast('success', 'Question Added to Bank', `Question Bank Count: ${questions.length + 1}`);

      if (andAddAnother) {
        setManualQuestionText('');
        setOptionAText('');
        setOptionBText('');
        setOptionCText('');
        setOptionDText('');
        setQuestionImage(undefined);
        setOptionAImage(undefined);
        setOptionBImage(undefined);
        setOptionCImage(undefined);
        setOptionDImage(undefined);
        setExplanation('');
      } else {
        navigate('/admin/question-bank');
      }
    }
  };

  // Save All Bulk Questions with per-question correct answers
  const handleSaveBulk = () => {
    if (parsedBulk.validQuestions.length === 0) {
      showToast('error', 'No Valid Questions', 'Please provide valid questions in Question / A / B / C / D format.');
      return;
    }

    const createdQuestions: Question[] = parsedBulk.validQuestions.map((draft, idx) => {
      const selectedAnswer = bulkCustomAnswers[draft.id] || draft.correctAnswer || 'A';
      const selectedExplanation = bulkCustomExplanations[draft.id] || explanation || 'Standard syllabus solution.';

      return {
        id: `Q-${exam}-BULK-${Date.now().toString(36)}-${idx + 1}`.toUpperCase(),
        exam,
        subject,
        topic,
        difficulty,
        text: draft.questionText,
        options: [
          { id: 'A', text: draft.optionA },
          { id: 'B', text: draft.optionB },
          { id: 'C', text: draft.optionC },
          { id: 'D', text: draft.optionD },
        ],
        correctAnswer: selectedAnswer,
        marks: Number(marks) || 1,
        negativeMarks: Number(negativeMarks) || 0.33,
        explanation: selectedExplanation,
        createdAt: new Date().toISOString(),
      };
    });

    addBulkQuestions(createdQuestions);
    showToast(
      'success',
      `Saved ${createdQuestions.length} Questions!`,
      `Question Bank updated with individual answers for each question.`
    );
    navigate('/admin/question-bank');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
              Rapid Question Creator
            </span>
            <span className="text-xs text-slate-400">Total in Bank: <strong className="text-white">{questions.length}</strong></span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-1">
            Add Questions to Question Bank
          </h1>
        </div>

        <Link
          to="/admin/question-bank"
          className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-slate-300 border border-slate-700 text-xs font-semibold self-start sm:self-auto"
        >
          View Question Bank ({questions.length})
        </Link>
      </div>

      {/* Main Mode Tabs (Requirement #27, #33) */}
      <div className="flex items-center gap-2 p-1.5 bg-navy-900 rounded-2xl border border-slate-800 self-start">
        <button
          onClick={() => setActiveTab('slash')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'slash'
              ? 'bg-defence-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Slash Fast-Paste (`/`)</span>
        </button>

        <button
          onClick={() => setActiveTab('bulk')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'bulk'
              ? 'bg-defence-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Bulk Multi-Question Paste</span>
        </button>

        <button
          onClick={() => setActiveTab('manual')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
            activeTab === 'manual'
              ? 'bg-defence-700 text-white shadow-lg'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Diagram & Media Form</span>
        </button>
      </div>

      {/* 2-Column Layout: Form Inputs on Left, Live Cadet Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Parser Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata Section (Requirement #35, #36) */}
          <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
              1. Question Classification & Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Exam Category</label>
                <select
                  value={exam}
                  onChange={(e) => handleExamChange(e.target.value as ExamCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white focus:border-defence-500 font-bold"
                >
                  <option value="CDS">CDS (UPSC Pattern)</option>
                  <option value="AFCAT">AFCAT (IAF CBT Pattern)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectType)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white focus:border-defence-500 font-semibold"
                >
                  {subjectsForExam.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Topic / Module</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Indian Polity, Spatial Aptitude..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white focus:border-defence-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white focus:border-defence-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mode 1: SLASH FAST-PASTE (Requirement #27, #28) */}
          {activeTab === 'slash' && (
            <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Paste Question & Options (Slash Format)
                </h3>
                <span className="text-[10px] font-mono bg-navy-950 px-2 py-0.5 rounded text-defence-400 border border-slate-800">
                  Q / A / B / C / D
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Use <code className="text-defence-400 font-bold bg-navy-950 px-1 py-0.5 rounded"> / </code> (with spaces) or <code className="text-defence-400 font-bold bg-navy-950 px-1 py-0.5 rounded">|</code> to separate the question, 4 options, and optional answer key.
                <span className="text-defence-300 font-semibold block mt-1">
                  💡 Units with slashes (<code className="font-mono text-gold-400">m/s</code>, <code className="font-mono text-gold-400">km/h</code>, <code className="font-mono text-gold-400">m/s²</code>) and fractions (<code className="font-mono text-gold-400">1/2</code>) are automatically preserved!
                </span>
              </p>

              <textarea
                rows={4}
                value={slashInput}
                onChange={(e) => setSlashInput(e.target.value)}
                placeholder="What is the speed of light approximately? / 3 × 10^6 m/s / 3 × 10^7 m/s / 3 × 10^8 m/s / 3 × 10^9 m/s / C"
                className="w-full p-4 rounded-2xl bg-navy-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-defence-500 font-mono leading-relaxed"
              />

              {/* Real-time Parser Validation feedback */}
              {parsedSingle.isValid ? (
                <div className="p-3 rounded-xl bg-defence-950/70 border border-defence-500/40 text-defence-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-defence-400 shrink-0" />
                  <span>Valid Question Syntax (Question + 4 Options Detected · Key: {parsedSingle.correctAnswer})</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{parsedSingle.errorMessage}</span>
                </div>
              )}

              {/* Optional Question Image Uploader */}
              <div className="pt-2">
                <ImageUploader
                  label="Attach Question Image / Diagram (Optional)"
                  value={questionImage}
                  onChange={setQuestionImage}
                />
              </div>
            </div>
          )}

          {/* Mode 2: BULK MULTI-LINE PASTE (Requirement #33, #34) */}
          {activeTab === 'bulk' && (
            <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  2. Bulk Multi-Line Question Input
                </h3>
                <span className="text-xs font-bold text-defence-400">
                  Questions Detected: {parsedBulk.validQuestions.length}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <p>
                  Paste multiple lines. Format: <code className="text-defence-400 font-bold">Question / Option A / Option B / Option C / Option D / [Optional Key]</code>
                </p>
                <p className="text-defence-300">
                  💡 Units with slashes (<code className="font-mono text-gold-400">m/s</code>, <code className="font-mono text-gold-400">km/h</code>), fractions (<code className="font-mono text-gold-400">1/2</code>), and pipe delimiters (<code className="font-mono text-gold-400">|</code>) are automatically supported!
                </p>
              </div>

              <textarea
                rows={7}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="What is the speed of light approximately? / 3 × 10^6 m/s / 3 × 10^7 m/s / 3 × 10^8 m/s / 3 × 10^9 m/s / C&#10;What is capital of India? / Chennai / Mumbai / New Delhi / Kolkata / C&#10;2 + 2 = ? / 3 / 4 / 5 / 6 / B"
                className="w-full p-4 rounded-2xl bg-navy-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-defence-500 font-mono leading-relaxed custom-scrollbar"
              />

              {/* OPTION EQUALITY BREAKDOWN INSPECTOR (Requirement: Option Count Verification) */}
              <div className="p-5 rounded-2xl bg-navy-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Equal className="w-4 h-4 text-gold-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Options Equality Breakdown per Question
                    </span>
                  </div>

                  {parsedBulk.optionsBreakdown.allEqual4Options ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-500/40 flex items-center gap-1">
                      <Check className="w-3 h-3" /> All Questions Have Equal 4 Options
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Unequal Option Counts Detected
                    </span>
                  )}
                </div>

                {/* Counter statistics for option counts */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-navy-900 border border-defence-500/30">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Questions with 4 Options (Standard)</span>
                    <span className="text-xl font-black text-defence-400 mt-1 block">
                      {parsedBulk.optionsBreakdown.total4Options} Questions
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Questions with Unequal Options</span>
                    <span className={`text-xl font-black mt-1 block ${
                      parsedBulk.optionsBreakdown.totalOtherOptions > 0 ? 'text-red-400' : 'text-slate-500'
                    }`}>
                      {parsedBulk.optionsBreakdown.totalOtherOptions} Questions
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-navy-900 border border-slate-800 col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Valid & Ready to Save</span>
                    <span className="text-xl font-black text-white mt-1 block">
                      {parsedBulk.validQuestions.length} / {parsedBulk.totalLines}
                    </span>
                  </div>
                </div>

                {/* Option Count Distribution Pills */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400">Distribution of Options Detected:</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(parsedBulk.optionsBreakdown.distribution).map(([optCount, total]) => (
                      <span
                        key={optCount}
                        className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border ${
                          Number(optCount) === 4
                            ? 'bg-defence-950 text-defence-300 border-defence-500/40'
                            : 'bg-red-950/60 text-red-300 border-red-500/40'
                        }`}
                      >
                        {total} question(s) have {optCount} option(s) {Number(optCount) === 4 ? '✓ (Equal 4)' : '✗ (Unequal)'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line-by-Line Breakdown of Unequal Questions */}
              {parsedBulk.invalidQuestions.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Unequal Option Format Lines:
                  </span>
                  {parsedBulk.invalidQuestions.map((inv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-xs text-red-200 flex items-start justify-between gap-3">
                      <div>
                        <strong>Line {inv.lineNumber}:</strong> {inv.error}
                        <p className="font-mono text-[10px] text-slate-400 mt-1 truncate max-w-md">{inv.rawLine}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-black/40 text-red-300 font-mono text-[10px] font-bold shrink-0">
                        {inv.optionsCount} Options
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode 3: DIAGRAM & MEDIA FORM (Requirement #29-#32) */}
          {activeTab === 'manual' && (
            <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
                2. Text + Diagram / Figure Inputs
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Question Text</label>
                <textarea
                  rows={2}
                  value={manualQuestionText}
                  onChange={(e) => setManualQuestionText(e.target.value)}
                  placeholder="Identify the fighter aircraft or topographical contour shown..."
                  className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-xs text-white"
                />
              </div>

              <ImageUploader
                label="Question Image / Map / Radar Plot"
                value={questionImage}
                onChange={setQuestionImage}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2 p-3.5 rounded-2xl bg-navy-950 border border-slate-800">
                  <label className="text-xs font-bold text-white">Option A</label>
                  <input
                    type="text"
                    value={optionAText}
                    onChange={(e) => setOptionAText(e.target.value)}
                    placeholder="Option A Text"
                    className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white"
                  />
                  <ImageUploader label="Option A Image" value={optionAImage} onChange={setOptionAImage} />
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-navy-950 border border-slate-800">
                  <label className="text-xs font-bold text-white">Option B</label>
                  <input
                    type="text"
                    value={optionBText}
                    onChange={(e) => setOptionBText(e.target.value)}
                    placeholder="Option B Text"
                    className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white"
                  />
                  <ImageUploader label="Option B Image" value={optionBImage} onChange={setOptionBImage} />
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-navy-950 border border-slate-800">
                  <label className="text-xs font-bold text-white">Option C</label>
                  <input
                    type="text"
                    value={optionCText}
                    onChange={(e) => setOptionCText(e.target.value)}
                    placeholder="Option C Text"
                    className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white"
                  />
                  <ImageUploader label="Option C Image" value={optionCImage} onChange={setOptionCImage} />
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-navy-950 border border-slate-800">
                  <label className="text-xs font-bold text-white">Option D</label>
                  <input
                    type="text"
                    value={optionDText}
                    onChange={(e) => setOptionDText(e.target.value)}
                    placeholder="Option D Text"
                    className="w-full p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-white"
                  />
                  <ImageUploader label="Option D Image" value={optionDImage} onChange={setOptionDImage} />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Correct Answer, Marks & Solution (Per-Question in Bulk Mode) */}
          {activeTab === 'bulk' ? (
            <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Select Correct Answer for EACH Question ({parsedBulk.validQuestions.length} Questions)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click the correct option (A, B, C, or D) individually for each question:
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-navy-950 border border-slate-800 text-[10px] font-bold text-gold-400">
                  Individual Selection Mode
                </span>
              </div>

              {parsedBulk.validQuestions.length === 0 ? (
                <div className="p-6 rounded-2xl bg-navy-950 border border-slate-800 text-center text-xs text-slate-500">
                  Paste questions in slash format above to configure correct answers for each question.
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
                  {parsedBulk.validQuestions.map((draft, idx) => {
                    const currentSelected = bulkCustomAnswers[draft.id] || draft.correctAnswer || 'A';
                    return (
                      <div
                        key={draft.id}
                        className="p-4 rounded-2xl bg-navy-950 border border-slate-800 space-y-3 transition-all hover:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-600/30">
                            Question {idx + 1}
                          </span>
                          <span className="text-[11px] font-bold text-slate-300">
                            Correct Answer: <strong className="text-gold-400 font-mono">Option {currentSelected}</strong>
                          </span>
                        </div>

                        <p className="text-xs font-bold text-white leading-snug">
                          {draft.questionText}
                        </p>

                        {/* Options List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className={`p-2 rounded-xl border ${currentSelected === 'A' ? 'bg-defence-950/80 border-defence-500 text-white font-semibold' : 'bg-navy-900 border-slate-800/80 text-slate-400'}`}>
                            <strong className="text-defence-400">A:</strong> {draft.optionA}
                          </div>
                          <div className={`p-2 rounded-xl border ${currentSelected === 'B' ? 'bg-defence-950/80 border-defence-500 text-white font-semibold' : 'bg-navy-900 border-slate-800/80 text-slate-400'}`}>
                            <strong className="text-defence-400">B:</strong> {draft.optionB}
                          </div>
                          <div className={`p-2 rounded-xl border ${currentSelected === 'C' ? 'bg-defence-950/80 border-defence-500 text-white font-semibold' : 'bg-navy-900 border-slate-800/80 text-slate-400'}`}>
                            <strong className="text-defence-400">C:</strong> {draft.optionC}
                          </div>
                          <div className={`p-2 rounded-xl border ${currentSelected === 'D' ? 'bg-defence-950/80 border-defence-500 text-white font-semibold' : 'bg-navy-900 border-slate-800/80 text-slate-400'}`}>
                            <strong className="text-defence-400">D:</strong> {draft.optionD}
                          </div>
                        </div>

                        {/* Interactive Selector Buttons for this Question */}
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-400 mr-1">Set Answer:</span>
                          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setAnswerForQuestion(draft.id, opt)}
                              className={`flex-1 py-2 rounded-xl font-black text-xs transition-all border ${
                                currentSelected === opt
                                  ? 'bg-gradient-to-r from-defence-600 to-defence-500 border-defence-400 text-white shadow-lg scale-105'
                                  : 'bg-navy-900 border-slate-800 text-slate-400 hover:text-white hover:bg-navy-850'
                              }`}
                            >
                              Option {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Marks Settings */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Marks (Per Question)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Negative Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-red-400 font-bold"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 pb-2 border-b border-slate-800">
                3. Correct Answer, Marks & Solution
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300">Select Correct Option</label>
                <div className="grid grid-cols-4 gap-3">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setCorrectAnswer(opt)}
                      className={`py-3 rounded-2xl font-black text-sm transition-all border ${
                        correctAnswer === opt
                          ? 'bg-defence-600 border-defence-400 text-white shadow-lg scale-105'
                          : 'bg-navy-950 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Option {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Marks for Correct Answer</label>
                  <input
                    type="number"
                    step="0.1"
                    value={marks}
                    onChange={(e) => setMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-white font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Negative Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-slate-700 text-red-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">Detailed Answer Explanation</label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Provide official reference and step-by-step logic for the cadet review page..."
                  className="w-full p-3.5 rounded-2xl bg-navy-950 border border-slate-700 text-xs text-white placeholder-slate-500 custom-scrollbar leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Action Buttons (Requirement #39) */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {activeTab === 'bulk' ? (
              <button
                onClick={handleSaveBulk}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Save className="w-4 h-4" />
                <span>Save All {parsedBulk.validQuestions.length} Bulk Questions</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleSaveSingle(false)}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Question</span>
                </button>

                <button
                  onClick={() => handleSaveSingle(true)}
                  className="py-3.5 px-5 rounded-2xl bg-navy-900 hover:bg-navy-850 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <PlusCircle className="w-4 h-4 text-defence-400" />
                  <span>Save & Add Another</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setSlashInput('');
                setBulkInput('');
                setManualQuestionText('');
                setQuestionImage(undefined);
                setOptionAImage(undefined);
                setOptionBImage(undefined);
                setOptionCImage(undefined);
                setOptionDImage(undefined);
                setExplanation('');
              }}
              className="py-3.5 px-4 rounded-2xl bg-navy-950 hover:bg-navy-900 text-slate-400 hover:text-white border border-slate-800 text-xs font-semibold uppercase"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Right Column: Live Cadet-View Preview (5 cols) (Requirement #37) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-defence-400" />
                <span>Live Cadet Examination Preview</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-navy-950 border border-slate-800 text-[10px] text-slate-400">
                Interactive Simulator
              </span>
            </div>

            <QuestionPreviewCard question={livePreviewQuestion} questionNumber={1} />
          </div>
        </div>
      </div>
    </div>
  );
};
