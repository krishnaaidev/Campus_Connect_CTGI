import React, { useState } from 'react';
import { User } from '../../types';
import { StorageService } from '../../services/storage';
import { HeartHandshake, ShieldAlert, CheckCircle2, Clock, MessageSquare, AlertTriangle } from 'lucide-react';

interface WelfarePortalProps {
  dsw: User;
}

interface GrievanceCase {
  id: string;
  ref: string;
  studentName: string;
  category: string;
  subject: string;
  description: string;
  date: string;
  priority: 'HIGH' | 'URGENT' | 'MEDIUM';
  status: 'UNDER_REVIEW' | 'ACTION_TAKEN' | 'CLOSED';
}

const SEED_GRIEVANCES: GrievanceCase[] = [
  {
    id: 'grv-01',
    ref: 'DSW-2026-019',
    studentName: 'Suman Sharma',
    category: 'Hostel Living Conditions',
    subject: 'Late evening study hall Wi-Fi disruption',
    description: 'Wi-Fi connectivity drops frequently after 9 PM affecting online coursework submission.',
    date: '2026-03-01T15:00:00Z',
    priority: 'MEDIUM',
    status: 'UNDER_REVIEW'
  },
  {
    id: 'grv-02',
    ref: 'DSW-2026-012',
    studentName: 'Rahul Verma',
    category: 'Academic Assistance',
    subject: 'Special medical leave accommodation for examinations',
    description: 'Student submitted medical hospitalization certificates requesting internal assessment re-test.',
    date: '2026-02-27T11:30:00Z',
    priority: 'HIGH',
    status: 'ACTION_TAKEN'
  }
];

export const WelfarePortal: React.FC<WelfarePortalProps> = ({ dsw }) => {
  const [cases, setCases] = useState<GrievanceCase[]>(SEED_GRIEVANCES);

  const handleUpdateStatus = (id: string, status: 'ACTION_TAKEN' | 'CLOSED') => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="bg-rose-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-rose-300">
            <HeartHandshake className="w-4 h-4" />
            <span>Office of Dean Student Welfare (DSW)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Student Welfare & Grievance Redressal</h1>
          <p className="text-xs text-rose-200 mt-0.5">Dean: <strong className="text-white">{dsw.name}</strong> • Confidential Case Desk</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-600" />
            <h2 className="font-bold text-slate-900 text-sm">Active Welfare & Grievance Cases</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{cases.length} Open Inquiries</span>
        </div>

        <div className="space-y-3">
          {cases.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-slate-900">{c.ref}</span>
                  <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px]">
                    {c.category}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  c.status === 'CLOSED' ? 'bg-slate-100 text-slate-600' :
                  c.status === 'ACTION_TAKEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="font-bold text-slate-900 text-sm">{c.subject}</div>
              <p className="text-slate-600 leading-relaxed">{c.description}</p>
              <div className="text-[11px] text-slate-400">Student: <strong>{c.studentName}</strong> • Logged on {new Date(c.date).toLocaleDateString()}</div>

              <div className="pt-2 flex gap-2">
                {c.status !== 'ACTION_TAKEN' && c.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleUpdateStatus(c.id, 'ACTION_TAKEN')}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                  >
                    Mark Action Taken
                  </button>
                )}
                {c.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleUpdateStatus(c.id, 'CLOSED')}
                    className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                  >
                    Close Case
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
