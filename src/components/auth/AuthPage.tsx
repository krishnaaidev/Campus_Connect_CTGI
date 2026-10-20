import React, { useState } from 'react';
import { UserRole, Gender } from '../../types';
import { AuthService } from '../../services/auth';
import { BOYS_HOSTEL_BLOCKS, GIRLS_HOSTEL_BLOCKS } from '../../config/institution';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Building, 
  AlertCircle,
  LogIn,
  UserPlus,
  KeyRound,
  Sparkles,
  Phone
} from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  // Sign In Form State
  const [signInId, setSignInId] = useState('');
  const [password, setPassword] = useState('');

  // Register Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [gender, setGender] = useState<Gender>('MALE');
  const [role, setRole] = useState<UserRole>('STUDENT_HOSTELLER');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [phone, setPhone] = useState('');
  const [hostelBlock, setHostelBlock] = useState(BOYS_HOSTEL_BLOCKS[0]);
  const [roomNumber, setRoomNumber] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (newGender === 'MALE') {
      setHostelBlock(BOYS_HOSTEL_BLOCKS[0]);
    } else {
      setHostelBlock(GIRLS_HOSTEL_BLOCKS[0]);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await AuthService.loginWithEmail(signInId, password);
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid institutional credentials.');
    }
  };

  const handleAdminQuickLogin = async () => {
    setError(null);
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const isHosteller = role === 'STUDENT_HOSTELLER';
      await AuthService.registerWithEmail({
        name,
        email,
        password: regPassword,
        role,
        gender,
        department,
        studentType: isHosteller ? 'HOSTELLER' : 'DAY_SCHOLAR',
        hostelBlock: isHosteller ? hostelBlock : undefined,
        roomNumber: isHosteller ? roomNumber : undefined,
        phone: phone || '+91 98765 00000',
        guardianName,
        guardianPhone
      });
      setLoading(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Registration failed.');
    }
  };

  const availableHostels = gender === 'MALE' ? BOYS_HOSTEL_BLOCKS : GIRLS_HOSTEL_BLOCKS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-950 to-brand-950 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
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
          Official Institutional Management & Student Gateway
        </p>
      </div>

      {/* Main Auth Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
          
          {/* Top Tab Toggle: Sign In vs Registration */}
          <div className="p-4 sm:p-5 pb-0">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setError(null); }}
                className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signin'
                    ? 'bg-white text-slate-900 shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-brand-600" />
                <span>Portal Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setError(null); }}
                className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'register'
                    ? 'bg-white text-slate-900 shadow-md font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4 text-purple-600" />
                <span>Student Registration</span>
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {activeTab === 'signin' ? (
              <div className="space-y-5">
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

                {/* System Admin Quick-Login Card */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-brand-600" />
                        <span className="font-bold text-slate-900 text-xs">System Administrator Account</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Primary administrative login with full system management privileges.
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
              </div>
            ) : (
              /* TAB 2: STUDENT REGISTRATION (WITH GENDER / HOSTEL SEGREGATION) */
              <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                
                {/* Gender Selection: Boys ka Boys, Girls ka Girls */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <label className="block text-slate-700 font-bold mb-1.5 uppercase text-[10px] tracking-wider">
                    Gender (Hostel Wing Segregation) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleGenderChange('MALE')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                        gender === 'MALE' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>♂ Male (Boys Wing)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleGenderChange('FEMALE')}
                      className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                        gender === 'FEMALE' ? 'bg-purple-600 border-purple-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>♀ Female (Girls Wing)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Sharma / Gurpreet Kaur"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">College Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@ctgroup.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Student Type</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      <option value="STUDENT_HOSTELLER">Hostel Resident</option>
                      <option value="STUDENT_DAYSCHOLAR">Day Scholar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                    >
                      <option value="Computer Science & Engineering">CSE</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                      <option value="Civil Engineering">Civil</option>
                      <option value="Pharmacy & Health Sciences">Pharmacy</option>
                      <option value="Management & Commerce">Management</option>
                    </select>
                  </div>
                </div>

                {/* Hosteller Fields: Strict separation of Boys & Girls blocks */}
                {role === 'STUDENT_HOSTELLER' && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-slate-800 text-xs">
                      <Building className="w-4 h-4 text-brand-600" />
                      <span>{gender === 'MALE' ? 'Boys Hostel Wing (Tagore/Gandhi)' : 'Girls Hostel Wing (Sarojini/Kalpana)'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[11px] font-semibold mb-1">Hostel Block</label>
                        <select
                          value={hostelBlock}
                          onChange={(e) => setHostelBlock(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                        >
                          {availableHostels.map((block) => (
                            <option key={block} value={block}>{block}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[11px] font-semibold mb-1">Room Number</label>
                        <input
                          type="text"
                          placeholder="e.g. B-204"
                          value={roomNumber}
                          onChange={(e) => setRoomNumber(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-slate-600 text-[11px] font-semibold mb-1">Guardian Name</label>
                        <input
                          type="text"
                          placeholder="Father / Guardian"
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-[11px] font-semibold mb-1">Guardian Phone</label>
                        <input
                          type="tel"
                          placeholder="+91 98111 22334"
                          value={guardianPhone}
                          onChange={(e) => setGuardianPhone(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Registering Account...' : 'Complete Registration & Enter Portal'}</span>
                </button>
              </form>
            )}

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
