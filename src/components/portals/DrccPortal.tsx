import React, { useState } from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { FileCheck, Search, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface DrccPortalProps {
  staff: User;
}

export const DrccPortal: React.FC<DrccPortalProps> = ({ staff }) => {
  const [students] = useState(StorageService.getUsers().filter(u => u.role.startsWith('STUDENT')));
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationStatuses, setVerificationStatuses] = useState<Record<string, string>>({
    'user-std-hosteller': 'VERIFIED',
    'user-std-dayscholar': 'PENDING_DOCUMENTS'
  });

  const handleUpdateStatus = (studentId: string, status: string) => {
    setVerificationStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.institutionUserId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-cyan-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-cyan-400">
            <FileCheck className="w-4 h-4" />
            <span>DRCC Student Welfare & Verification Cell</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Student Assistance & Verification</h1>
          <p className="text-xs text-cyan-300 mt-0.5">Staff Officer: <strong className="text-white">{staff.name}</strong> • Verification Queue</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">{filtered.length} Student Profiles</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filtered.map(student => {
            const status = verificationStatuses[student.id] || 'PENDING_DOCUMENTS';
            return (
              <div key={student.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{student.name}</div>
                    <div className="text-[11px] font-mono text-brand-700">{student.institutionUserId} • {student.department}</div>
                    <div className="text-[10px] text-slate-400">Phone: {student.phone} • Guardian: {student.guardianName || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {status.replace(/_/g, ' ')}
                  </span>

                  {status !== 'VERIFIED' ? (
                    <button
                      onClick={() => handleUpdateStatus(student.id, 'VERIFIED')}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold shadow-sm transition-colors"
                    >
                      Approve Verification
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(student.id, 'PENDING_DOCUMENTS')}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-semibold"
                    >
                      Flag Documents
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
