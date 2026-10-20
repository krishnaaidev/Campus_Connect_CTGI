import React, { useState } from 'react';
import { UserRole } from '../../types';
import { AuthService } from '../../services/auth';
import { GraduationCap, Lock, Mail, User, Phone, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT_HOSTELLER');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await AuthService.registerWithEmail({
          name,
          email,
          password,
          role,
          department,
          studentType: role === 'STUDENT_HOSTELLER' ? 'HOSTELLER' : role === 'STUDENT_DAYSCHOLAR' ? 'DAY_SCHOLAR' : undefined,
          phone: phone || '+91 98765 00000'
        });
      } else {
        await AuthService.loginWithEmail(email, password);
      }
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-900 text-white p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-2 text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black">CampusConnect CTGI</h2>
          <p className="text-xs text-brand-200 mt-0.5">Firebase Authentication & Identity</p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${!isRegister ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all ${isRegister ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurpreet Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Select Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="STUDENT_HOSTELLER">Student (Hosteller)</option>
                    <option value="STUDENT_DAYSCHOLAR">Student (Day Scholar)</option>
                    <option value="GATEKEEPER">Gatekeeper</option>
                    <option value="SECURITY_GUARD">Security Guard</option>
                    <option value="HOSTEL_WARDEN">Hostel Warden</option>
                    <option value="CLASS_INCHARGE">Class Incharge</option>
                    <option value="HOD">Head of Department</option>
                    <option value="FEE_STAFF">Fee Collection Staff</option>
                    <option value="ADMINISTRATOR">Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-slate-700 font-semibold mb-1">College Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@ctgroup.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] mt-2 text-sm flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating with Firebase...' : isRegister ? 'Complete Registration' : 'Sign In to CampusConnect'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
