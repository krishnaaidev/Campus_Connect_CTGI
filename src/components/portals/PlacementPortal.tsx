import React, { useState } from 'react';
import { User } from '../../types';
import { Briefcase, Building2, Users, Calendar, PlusCircle, CheckCircle2, Search } from 'lucide-react';

interface PlacementPortalProps {
  officer: User;
}

interface JobDrive {
  id: string;
  companyName: string;
  roleTitle: string;
  ctc: string; // e.g. "8.5 LPA"
  eligibility: string;
  deadline: string;
  driveDate: string;
  applicantsCount: number;
  status: 'ACTIVE' | 'CLOSED' | 'SHORTLISTING';
}

const SEED_DRIVES: JobDrive[] = [
  {
    id: 'drv-01',
    companyName: 'Infosys Limited',
    roleTitle: 'Systems Engineer & Specialist Programmer',
    ctc: '6.5 — 9.5 LPA',
    eligibility: 'B.Tech CSE/ECE, >= 65% aggregate, No active backlogs',
    deadline: '2026-03-08',
    driveDate: '2026-03-12',
    applicantsCount: 142,
    status: 'ACTIVE'
  },
  {
    id: 'drv-02',
    companyName: 'Wipro Technologies',
    roleTitle: 'Project Engineer (Turbo Hiring)',
    ctc: '7.0 LPA',
    eligibility: 'B.Tech All branches, >= 60% aggregate',
    deadline: '2026-03-15',
    driveDate: '2026-03-20',
    applicantsCount: 98,
    status: 'ACTIVE'
  },
  {
    id: 'drv-03',
    companyName: 'Tata Consultancy Services (TCS)',
    roleTitle: 'Digital & Ninja Innovator',
    ctc: '7.5 LPA',
    eligibility: 'B.Tech CSE/IT, >= 70% in 10th/12th/Grad',
    deadline: '2026-02-28',
    driveDate: '2026-03-05',
    applicantsCount: 215,
    status: 'SHORTLISTING'
  }
];

export const PlacementPortal: React.FC<PlacementPortalProps> = ({ officer }) => {
  const [drives, setDrives] = useState<JobDrive[]>(SEED_DRIVES);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('');
  const [eligibility, setEligibility] = useState('');

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    const newDrive: JobDrive = {
      id: `drv-${Date.now()}`,
      companyName: company,
      roleTitle: role,
      ctc: ctc || 'Competitive',
      eligibility: eligibility || 'B.Tech Final Year',
      deadline: '2026-03-25',
      driveDate: '2026-04-02',
      applicantsCount: 0,
      status: 'ACTIVE'
    };

    setDrives([newDrive, ...drives]);
    setShowDriveModal(false);
    setCompany('');
    setRole('');
    setCtc('');
    setEligibility('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
            <Briefcase className="w-4 h-4" />
            <span>Corporate Relations & Training & Placement Cell (TPO)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Campus Placement Drives</h1>
          <p className="text-xs text-slate-400 mt-0.5">Head TPO: <strong className="text-white">{officer.name}</strong> • Recruitment Portal</p>
        </div>

        <button
          onClick={() => setShowDriveModal(true)}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish New Drive</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {drives.map((d) => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-slate-900 text-base">{d.companyName}</span>
                <span className="block text-brand-700 font-semibold mt-0.5">{d.roleTitle}</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                d.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {d.status}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl space-y-1 text-slate-700">
              <div>Package (CTC): <strong className="text-emerald-700">{d.ctc}</strong></div>
              <div>Eligibility: <span className="text-slate-600">{d.eligibility}</span></div>
              <div>Drive Date: <span className="font-semibold">{d.driveDate}</span></div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Users className="w-3.5 h-3.5" /> {d.applicantsCount} Applicants
              </span>
              <span className="font-semibold text-brand-600 cursor-pointer hover:underline">
                View Shortlist →
              </span>
            </div>
          </div>
        ))}
      </div>

      {showDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Publish Campus Recruitment Drive</h3>
              <button onClick={() => setShowDriveModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Support Associate"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">CTC Package Offered</label>
                <input
                  type="text"
                  placeholder="e.g. 8.5 LPA"
                  value={ctc}
                  onChange={(e) => setCtc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech CSE/IT, >= 65%"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowDriveModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Publish Announcement</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
