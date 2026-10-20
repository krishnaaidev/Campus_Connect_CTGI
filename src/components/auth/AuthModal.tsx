import React, { useState } from 'react';
import { UserRole, Gender } from '../../types';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { BOYS_HOSTEL_BLOCKS, GIRLS_HOSTEL_BLOCKS } from '../../config/institution';
import { GraduationCap, Lock, Mail, User as UserIcon, Phone, ShieldCheck, ChevronDown, CheckCircle2, AlertCircle, Building, Users } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showRoleDrawer, setShowRoleDrawer] = useState(false);

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

  if (!isOpen) return null;

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
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Invalid credentials.');
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
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Registration failed.');
    }
  };

  const handleQuickLogin = (userId: string) => {
    AuthService.switchUserById(userId);
    onSuccess();
    onClose();
  };

  const availableHostels = gender === 'MALE' ? BOYS_HOSTEL_BLOCKS : GIRLS_HOSTEL_BLOCKS;
  const users = StorageService.getUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-brand-900 to-brand-800 text-white p-6 text-center relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white text-xs font-bold p-1 rounded-full bg-white/10 hover:bg-white/20"
          >
            ✕
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-2 text-white shadow-md">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black tracking-tight">CampusConnect Portal</h2>
          <p className="text-xs text-brand-200 mt-0.5">CT Group of Institutions (CTGI)</p>
        </div>

        {/* Tab Selector */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${!isRegister ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${isRegister ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600'}`}
            >
              New Student Registration
            </button>
          </div>

          {/* SIGN IN FORM */}
          {!isRegister ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email or Roll Number</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. CTGI/2023/CSE/101 or name@ctgroup.in"
                    value={signInId}
                    onChange={(e) => setSignInId(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              >
                {loading ? 'Signing In...' : 'Sign In to CampusConnect'}
              </button>
            </form>
          ) : (
            /* NEW REGISTRATION FORM WITH BOYS/GIRLS HOSTEL SEPARATION */
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
                    <span>Male (Boys Hostel)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderChange('FEMALE')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 border transition-all ${
                      gender === 'FEMALE' ? 'bg-purple-600 border-purple-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <span>Female (Girls Hostel)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gurpreet Kaur / Aman Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">College Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@ctgroup.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Type</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
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
                    <span>{gender === 'MALE' ? 'Boys Hostel Allocation' : 'Girls Hostel Allocation'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 text-[11px] font-semibold mb-1">Hostel Block</label>
                      <select
                        value={hostelBlock}
                        onChange={(e) => setHostelBlock(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
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
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold"
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
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] font-semibold mb-1">Guardian Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 98111 22334"
                        value={guardianPhone}
                        onChange={(e) => setGuardianPhone(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-sm"
              >
                {loading ? 'Registering Account...' : 'Complete Student Registration'}
              </button>
            </form>
          )}

          {/* Quick Institutional Account Switcher (For Evaluation & Administrative Access) */}
          <div className="pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowRoleDrawer(!showRoleDrawer)}
              className="w-full flex items-center justify-between text-slate-500 hover:text-slate-800 text-[11px] font-semibold py-1.5"
            >
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>Quick Institutional Directory Logins (Click to Sign In as)</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRoleDrawer ? 'rotate-180' : ''}`} />
            </button>

            {showRoleDrawer && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto text-xs p-1 bg-slate-50 rounded-xl border border-slate-200">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.id)}
                    className="p-2 text-left bg-white hover:bg-brand-50 rounded-lg border border-slate-100 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 leading-tight">{u.name}</div>
                      <div className="text-[10px] text-slate-500">{u.role.replace(/_/g, ' ')} {u.gender === 'FEMALE' ? '• Female' : '• Male'}</div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">
                      Sign In
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
