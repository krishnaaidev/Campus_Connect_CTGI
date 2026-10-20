import React, { useState } from 'react';
import { AuthService } from '../../services/auth';
import { CT_CAMPUSES } from '../../config/institution';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ShieldCheck, 
  LogIn, 
  Sparkles, 
  AlertCircle,
  Building2,
  Users,
  CheckCircle2,
  Clock3
} from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [signInId, setSignInId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<'SHAHPUR' | 'MAQSUDAN' | 'LUDHIANA'>('SHAHPUR');
  const [campusNotice, setCampusNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedCampus !== 'SHAHPUR') {
      setError(`Notice: ${selectedCampus === 'MAQSUDAN' ? 'Maqsudan Campus' : 'Ludhiana Campus'} integration is currently IN PROGRESS. Please select Shahpur Campus to sign in.`);
      return;
    }

    setLoading(true);

    try {
      await AuthService.loginWithEmail(signInId, password);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid institutional credentials. Please contact your department incharge.');
    }
  };

  const handleAdminQuickLogin = async () => {
    setError(null);
    setSelectedCampus('SHAHPUR');
    setLoading(true);
    try {
      await AuthService.loginWithEmail('admin@ctgroup.in', 'admin123');
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Admin login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-brand-950 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-500/20 mb-3 ring-4 ring-white/10">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Campus<span className="text-brand-400">Connect</span>
        </h1>
        <p className="text-xs text-brand-200 font-semibold mt-1 uppercase tracking-wider">
          CT Group of Institutions (CTGI)
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Unified Multi-Campus Digital Gateway
        </p>
      </div>

      {/* 3 Campuses Status & Selection Bar */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80 shadow-xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-400" />
              CT Group Campuses (3 Campuses Architecture)
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              Shahpur Live
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Shahpur Campus (Active) */}
            <button
              type="button"
              onClick={() => {
                setSelectedCampus('SHAHPUR');
                setCampusNotice(null);
                setError(null);
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                selectedCampus === 'SHAHPUR'
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 ring-2 ring-brand-400'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] truncate">Shahpur</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[9.5px] font-bold mt-1 text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Available Now</span>
              </div>
            </button>

            {/* Maqsudan Campus (In Progress) */}
            <button
              type="button"
              onClick={() => {
                setSelectedCampus('MAQSUDAN');
                setCampusNotice('Maqsudan Campus digital onboarding is currently IN PROGRESS. The system is live exclusively for Shahpur Campus right now.');
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                selectedCampus === 'MAQSUDAN'
                  ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] truncate">Maqsudan</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div className="text-[9.5px] font-bold mt-1 text-amber-300 flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                <span>In Progress</span>
              </div>
            </button>

            {/* Ludhiana Campus (In Progress) */}
            <button
              type="button"
              onClick={() => {
                setSelectedCampus('LUDHIANA');
                setCampusNotice('Ludhiana Campus (CT University) multi-campus integration is currently IN PROGRESS. The system is live exclusively for Shahpur Campus right now.');
              }}
              className={`p-2.5 rounded-xl text-left transition-all ${
                selectedCampus === 'LUDHIANA'
                  ? 'bg-purple-600 text-white shadow-md ring-2 ring-purple-400'
                  : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[11px] truncate">Ludhiana</span>
                <span className="w-2 h-2 rounded-full bg-purple-400" />
              </div>
              <div className="text-[9.5px] font-bold mt-1 text-purple-300 flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                <span>In Progress</span>
              </div>
            </button>
          </div>

          {campusNotice && (
            <div className="p-2.5 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-[11px] flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div className="flex-1 leading-snug">
                <span>{campusNotice}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCampus('SHAHPUR');
                    setCampusNotice(null);
                    setError(null);
                  }}
                  className="block font-bold text-amber-300 hover:text-white underline mt-1"
                >
                  ✓ Switch to Shahpur Campus (Available Now)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Institutional Sign In
                </h2>
                <span className="text-[10.5px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Shahpur Campus
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your department-issued credentials to access your portal.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Institutional ID or Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. admin or CTGI/2026/STD/101"
                    value={signInId}
                    onChange={(e) => setSignInId(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-600/30 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to CampusConnect</span>
                  </>
                )}
              </button>
            </form>

            {/* System Administrator Quick Access Card */}
            <div className="pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                    <span className="font-bold text-slate-900 text-xs">System Administrator</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                    Master Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Default root account for institutional administration, policy controls, and authority setup.
                </p>
                <button
                  type="button"
                  onClick={handleAdminQuickLogin}
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>1-Click Sign In as System Administrator</span>
                </button>
              </div>
            </div>

            {/* Department Hierarchy Notice */}
            <div className="p-3 bg-brand-50/60 rounded-2xl border border-brand-100 text-[11px] text-slate-600 leading-relaxed space-y-1">
              <div className="font-bold text-brand-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-700" />
                <span>Department-Managed Access Policy</span>
              </div>
              <p>
                Account creation is governed by institutional hierarchy:
              </p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-700 text-[10.5px]">
                <li><strong>Students:</strong> Registered by respective <strong>Class Incharge</strong></li>
                <li><strong>Class Incharges:</strong> Registered by <strong>HOD</strong></li>
                <li><strong>HODs:</strong> Registered by <strong>HOI</strong></li>
                <li><strong>HOI & All Other Categories:</strong> Registered by <strong>System Administrator</strong></li>
              </ul>
            </div>

          </div>

          {/* Footer Badge */}
          <div className="py-3 px-6 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authorized CTGI Institutional Access • SSL Encrypted</span>
          </div>

        </div>
      </div>

    </div>
  );
};
