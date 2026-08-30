import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Clock,
  Target,
  ArrowRight,
  Zap,
  Users,
  Trophy,
  Sparkles,
  HelpCircle,
  ChevronRight,
  UserPlus,
  LogIn,
} from 'lucide-react';

export const LandingPage: React.FC = () => {


  return (
    <div className="space-y-24 py-6">
      {/* 1. HERO SECTION (Requirement #5) */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] bg-gradient-to-tr from-defence-600 to-amber-500 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-8 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-900/90 border border-defence-500/40 text-defence-300 text-xs font-bold tracking-wider uppercase shadow-xl animate-fade-in">
            <Shield className="w-4 h-4 text-gold-400" />
            <span>National Defence Academy & Officer Selection Hub</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight font-display leading-[1.1]">
            Prepare. Practice. <span className="text-transparent bg-clip-text bg-gradient-to-r from-defence-400 via-emerald-300 to-gold-400">Perform.</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Master CDS & AFCAT with realistic mock tests, detailed performance analysis and exam-focused practice.
          </p>

          {/* Primary Action Buttons (Requirement #5) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/cadet/register"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-defence-600 via-defence-500 to-emerald-600 hover:from-defence-500 hover:to-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-defence-950/80 hover:scale-105 transition-all flex items-center gap-2 border border-defence-400/50"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadet Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/cadet/login"
              className="px-7 py-4 rounded-2xl bg-navy-900/90 hover:bg-navy-850 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 hover:border-slate-500 shadow-xl transition-all flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-defence-400" />
              <span>Cadet Login</span>
            </Link>

            <Link
              to="/cadet/mock-tests"
              className="px-7 py-4 rounded-2xl bg-navy-950/80 hover:bg-navy-900 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider border border-slate-800 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span>Explore Mock Tests</span>
            </Link>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-center gap-4">
            <span>Official Admin Access:</span>
            <Link to="/admin/login" className="text-gold-400 hover:underline font-bold flex items-center gap-1">
              <span>Officer Admin Login</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CDS PREPARATION (Requirement #16) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-defence-400">UPSC Standard</span>
          <h2 className="text-3xl font-black text-white font-display">Combined Defence Services (CDS)</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Comprehensive testing framework modeled strictly according to UPSC CDS examination syllabi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-navy-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-defence-500/40 flex items-center justify-center text-defence-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">English</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spotting errors, sentence rearrangement (PQRS), reading comprehension, synonyms, antonyms, and idioms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-navy-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">General Knowledge</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Indian Polity, Constitution, Modern History, Physical Geography, General Science (Physics, Chemistry, Biology) & Defence Current Affairs.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-navy-900/80 border border-slate-800 space-y-3 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Elementary Mathematics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Arithmetic, Algebra, Trigonometry, Geometry, Mensuration, and Statistics with precise negative marking simulation.
            </p>
          </div>
        </div>
      </section>

      {/* 3. AFCAT PREPARATION (Requirement #17) */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">IAF CBT Standard</span>
          <h2 className="text-3xl font-black text-white font-display">Air Force Common Admission Test (AFCAT)</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            High-speed computer-based simulation for Flying, Technical, and Ground Duty branch aspirants.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { title: 'General Awareness', desc: 'History, Sports, Geography, Civics, Defence, Science' },
            { title: 'Verbal Ability', desc: 'Comprehension, Error Detection, Sentence Completion, Vocabulary' },
            { title: 'Numerical Ability', desc: 'Decimals, Fractions, Profit & Loss, Ratio, Time & Work, Speed' },
            { title: 'Reasoning', desc: 'Verbal & Non-Verbal reasoning, Analogy, Classification' },
            { title: 'Military Aptitude', desc: 'Spatial ability, figure completion, rotatory diagrams' },
          ].map((sub, i) => (
            <div key={i} className="p-5 rounded-2xl bg-navy-900/70 border border-slate-800 space-y-2 shadow-lg">
              <span className="text-[10px] font-extrabold uppercase text-gold-400 block">Section 0{i + 1}</span>
              <h4 className="font-bold text-sm text-white">{sub.title}</h4>
              <p className="text-[11px] text-slate-400">{sub.desc}</p>
            </div>
          ))}
        </div>
      </section>


      {/* 5. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about the platform and examination format.</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the Cadet ID generation work during registration?',
              a: 'Upon completing the Cadet Registration form with your personal, college, and password details, the system automatically issues a unique institutional Cadet ID (e.g. NCC20260021) which you use for all mock tests and rank tracking.',
            },
            {
              q: 'Is the examination timer synchronized with UPSC/IAF patterns?',
              a: 'Yes. Each mock test runs an exact countdown timer with automatic test lock and evaluation when the clock hits 00:00.',
            },
            {
              q: 'How is negative marking calculated?',
              a: 'For CDS exams, each correct question awards +1 mark and incorrect answers deduct 0.33 marks. For AFCAT exams, correct answers award +3 marks and incorrect answers deduct 1 mark.',
            },
          ].map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-defence-400 shrink-0" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};