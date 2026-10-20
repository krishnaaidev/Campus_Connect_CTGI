import React from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { BarChart3, TrendingUp, Users, CreditCard, ShieldCheck, CheckCircle2, Building, Clock } from 'lucide-react';

interface DirectorPortalProps {
  director: User;
}

export const DirectorPortal: React.FC<DirectorPortalProps> = ({ director }) => {
  const users = StorageService.getUsers();
  const passes = StorageService.getGatePasses();
  const fees = StorageService.getFees();

  const studentCount = users.filter(u => u.role.startsWith('STUDENT')).length;
  const hostellerCount = users.filter(u => u.studentType === 'HOSTELLER').length;
  const dayScholarCount = studentCount - hostellerCount;

  const totalAssessed = fees.reduce((acc, f) => acc + f.totalAssessed, 0);
  const totalCollected = fees.reduce((acc, f) => acc + f.amountPaid, 0);
  const collectionRate = totalAssessed > 0 ? Math.round((totalCollected / totalAssessed) * 100) : 0;

  const activePasses = passes.filter(p => p.status === 'APPROVED' || p.status === 'EXIT_RECORDED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
              <TrendingUp className="w-4 h-4" />
              <span>Campus Directorate • Executive Overview</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">{director.name}</h1>
            <p className="text-xs text-slate-300 mt-0.5">Role: <strong className="text-white">{director.role.replace(/_/g, ' ')}</strong> • Institutional Governance</p>
          </div>
          <span className="text-xs bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20 font-bold">
            Academic Year 2025–2026
          </span>
        </div>
      </div>

      {/* High Level Campus KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Student Body</span>
          <div className="text-3xl font-black text-slate-900 mt-1">{studentCount} Enrolled</div>
          <p className="text-xs text-slate-500 mt-1">
            {hostellerCount} Hostellers • {dayScholarCount} Day Scholars
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Institutional Attendance</span>
          <div className="text-3xl font-black text-emerald-600 mt-1">84.8%</div>
          <p className="text-xs text-slate-500 mt-1">Across 12 Departments</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Fee Realization</span>
          <div className="text-3xl font-black text-brand-700 mt-1">{collectionRate}%</div>
          <p className="text-xs text-slate-500 mt-1">₹{totalCollected.toLocaleString()} Collected</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Active Gate Movements</span>
          <div className="text-3xl font-black text-purple-700 mt-1">{activePasses} Active</div>
          <p className="text-xs text-slate-500 mt-1">Verified Gate Permissions</p>
        </div>
      </div>

      {/* Departmental Performance Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Institutional Departments & Accreditation Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Computer Science & Engineering</span>
            <div className="flex justify-between text-slate-600">
              <span>Class Attendance:</span>
              <strong className="text-emerald-700">86.2%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Placement Rate:</span>
              <strong className="text-brand-700">88.5%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Faculty Strength:</span>
              <strong className="text-slate-900">28 Faculty Members</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Electronics & Communication</span>
            <div className="flex justify-between text-slate-600">
              <span>Class Attendance:</span>
              <strong className="text-emerald-700">82.1%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Placement Rate:</span>
              <strong className="text-brand-700">79.0%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Faculty Strength:</span>
              <strong className="text-slate-900">18 Faculty Members</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 block text-sm">Mechanical & Civil Engineering</span>
            <div className="flex justify-between text-slate-600">
              <span>Class Attendance:</span>
              <strong className="text-emerald-700">81.4%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Placement Rate:</span>
              <strong className="text-brand-700">74.2%</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Faculty Strength:</span>
              <strong className="text-slate-900">22 Faculty Members</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
