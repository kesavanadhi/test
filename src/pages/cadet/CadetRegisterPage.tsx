import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  GraduationCap,
  Award,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Building,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const CadetRegisterPage: React.FC = () => {
  const { registerCadet } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('3');
  const [university, setUniversity] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');

  const [nccUnit, setNccUnit] = useState('1 (TN) CTC NCC');
  const [targetExam, setTargetExam] = useState<'CDS' | 'AFCAT' | 'Both'>('Both');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCadetId, setSuccessCadetId] = useState<string | null>(null);
  const [registeredCadetName, setRegisteredCadetName] = useState<string>('');

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-700' };
    if (pass.length < 6) return { label: 'Weak (min 6 chars)', width: '30%', color: 'bg-red-500' };
    if (pass.length >= 8 && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
      return { label: 'Strong Security', width: '100%', color: 'bg-emerald-500' };
    }
    return { label: 'Medium Strength', width: '65%', color: 'bg-amber-500' };
  };

  const passStrength = getPasswordStrength(password);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic Validations
    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Mobile number is required.');
      return;
    }
    if (!college.trim()) {
      setErrorMessage('College / Institution name is required.');
      return;
    }
    if (!department.trim()) {
      setErrorMessage('Department is required.');
      return;
    }
    if (!registerNumber.trim()) {
      setErrorMessage('College Register Number is required.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      const res = registerCadet({
        name,
        email,
        phone,
        dateOfBirth: dateOfBirth || '2003-01-01',
        gender,
        college,
        department,
        year,
        university: university || 'State Technical University',
        registerNumber,
        nccUnit,
        password,
        targetExam,
      });

      setSuccessCadetId(res.cadetId);
      setRegisteredCadetName(res.cadet.name);
      showToast('success', 'Registration Successful!', `Assigned Cadet ID: ${res.cadetId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in">
      <div className="max-w-3xl w-full space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 border-2 border-defence-500/40 p-2 mx-auto flex items-center justify-center shadow-xl">
            <img src="/assets/warrior-logo.webp" alt="WARRIOR Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight">
            Cadet Enrolment & Registration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Create your official aspirant account. The platform will automatically assign your unique Cadet ID for CDS & AFCAT mock exams.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-3 animate-shake shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleRegister} className="p-6 sm:p-10 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-8 shadow-2xl">
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <User className="w-4 h-4 text-defence-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                1. Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arun Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="arun@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mobile Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Date of Birth</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white focus:outline-none focus:border-defence-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white focus:outline-none focus:border-defence-500 font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <GraduationCap className="w-4 h-4 text-gold-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                2. Academic & College Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-semibold text-slate-300">College / Institution *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meenakshi Sundararajan Engineering College"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Department / Branch *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ECE / Mechanical / CSE"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Year of Study</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white focus:outline-none focus:border-defence-500 font-semibold"
                >
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year / Final</option>
                  <option value="Graduate">Graduated</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Affiliated University</label>
                <input
                  type="text"
                  placeholder="e.g. Anna University / Delhi University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">College Register Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 311521106012"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 font-mono font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Cadet / NCC Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Award className="w-4 h-4 text-defence-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                3. Cadet / NCC Unit & Target Exam
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">NCC Unit / Battalion (if applicable)</label>
                <input
                  type="text"
                  placeholder="e.g. 1 (TN) CTC NCC / 1 (TN) Air Sqn NCC"
                  value={nccUnit}
                  onChange={(e) => setNccUnit(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Target Examination Stream *</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white focus:outline-none focus:border-defence-500 font-bold"
                >
                  <option value="Both">Both CDS & AFCAT</option>
                  <option value="CDS">CDS (UPSC Combined Defence Services)</option>
                  <option value="AFCAT">AFCAT (Air Force Common Admission Test)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Login Password */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Lock className="w-4 h-4 text-gold-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                4. Create Secure Account Password
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Password (min 6 characters) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden">
                      <div className={`h-full ${passStrength.color} transition-all duration-300`} style={{ width: passStrength.width }} />
                    </div>
                    <p className="text-[10px] text-slate-400">Strength: <strong className="text-slate-200">{passStrength.label}</strong></p>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Confirm Password *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-defence-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-defence-950/60 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 border border-defence-400/40"
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete Registration & Generate Cadet ID</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Already have a Cadet ID?{' '}
              <Link to="/cadet/login" className="text-defence-400 font-bold hover:underline">
                Cadet Login Here
              </Link>
            </p>
          </div>
        </form>
      </div>

      {/* REGISTRATION SUCCESSFUL MODAL (Requirement #7) */}
      {successCadetId && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-navy-900 border-2 border-defence-500/50 rounded-3xl p-8 space-y-6 shadow-2xl text-center animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-defence-950 border-2 border-defence-400 mx-auto flex items-center justify-center text-defence-400 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-md text-[10px] font-extrabold uppercase bg-defence-950 text-defence-400 border border-defence-500/30">
                REGISTRATION SUCCESSFUL
              </span>
              <h2 className="text-2xl font-black text-white font-display">
                Welcome, {registeredCadetName}!
              </h2>
              <p className="text-xs text-slate-300">
                Your account has been created successfully. Please memorize or save your generated Cadet ID below:
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950 border border-defence-500/40 space-y-1 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Official Cadet ID</span>
              <p className="text-3xl font-black text-defence-400 tracking-widest font-mono select-all">
                {successCadetId}
              </p>
            </div>

            <button
              onClick={() => navigate('/cadet/login')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-defence-600 to-defence-500 hover:from-defence-500 hover:to-defence-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              Continue to Cadet Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};