import React, { useState, useEffect } from 'react';
import { User, SecurityIncident } from '../../types';
import { StorageService } from '../../services/storage';
import { QRService, VerificationResult } from '../../services/qr';
import { 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface SecurityGuardViewProps {
  guard: User;
}

export const SecurityGuardView: React.FC<SecurityGuardViewProps> = ({ guard }) => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [passVerification, setPassVerification] = useState<VerificationResult | null>(null);

  // Form State
  const [category, setCategory] = useState<any>('OVERDUE_CURFEW');
  const [location, setLocation] = useState<string>('Gate #1 (Main Entrance)');
  const [description, setDescription] = useState<string>('');
  const [involvedStudentRoll, setInvolvedStudentRoll] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  useEffect(() => {
    setIncidents(StorageService.getIncidents());
  }, []);

  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const res = QRService.verifyPass(searchQuery.trim());
    setPassVerification(res);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    let studentName = undefined;
    let studentId = undefined;

    if (involvedStudentRoll.trim()) {
      const student = StorageService.getUsers().find(
        u => u.institutionUserId.toLowerCase() === involvedStudentRoll.trim().toLowerCase()
      );
      if (student) {
        studentName = student.name;
        studentId = student.id;
      }
    }

    const newIncident: SecurityIncident = {
      id: `inc-${Date.now()}`,
      incidentRef: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      reporterId: guard.id,
      reporterName: guard.name,
      reporterRole: guard.role,
      category,
      location,
      description,
      timestamp: new Date().toISOString(),
      status: 'REPORTED',
      involvedStudentId: studentId,
      involvedStudentName: studentName
    };

    StorageService.recordIncident(newIncident);
    setIncidents(StorageService.getIncidents());
    setShowReportModal(false);
    setDescription('');
    setInvolvedStudentRoll('');
    setSubmittedMessage(`Incident [${newIncident.incidentRef}] logged into institutional security dispatch.`);
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Campus Security Patrol & Incident Desk</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Security Duty Console</h1>
          <p className="text-xs text-slate-400 mt-0.5">Officer: <strong className="text-white">{guard.name}</strong> • Badge #{guard.institutionUserId}</p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Security Incident</span>
        </button>
      </div>

      {submittedMessage && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Security Quick Pass Verification */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Search className="w-4 h-4 text-brand-600" />
          <span>Field Pass Spot Check</span>
        </h2>
        
        <form onSubmit={handleVerifyPass} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Student Roll No (CTGI/2023/...) or Pass #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Check Pass
          </button>
        </form>

        {passVerification && (
          <div className={`mt-3 p-3.5 rounded-xl border text-xs ${
            passVerification.status === 'ALLOW' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span>{passVerification.status === 'ALLOW' ? 'PASS VALID' : 'PASS INVALID / RESTRICTED'}</span>
              <button onClick={() => setPassVerification(null)} className="text-[10px] text-slate-500 hover:underline">Dismiss</button>
            </div>
            <p className="mt-1 font-medium">{passVerification.reason}</p>
            {passVerification.pass && (
              <div className="mt-2 pt-2 border-t border-black/10 text-[11px] space-y-0.5">
                <div>Student: <strong>{passVerification.studentName}</strong> ({passVerification.studentNumber})</div>
                <div>Status: <span className="font-mono font-bold uppercase">{passVerification.pass.status}</span></div>
                <div>Allowed Window: {passVerification.validWindow}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Campus Emergency Quick Directory */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <PhoneCall className="w-4 h-4 text-amber-600" />
          <span>Campus Emergency Hotline Directory</span>
        </div>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 text-[11px]">
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
            <span className="text-slate-400 block">Campus Security Control:</span>
            <strong className="text-slate-900">+91 98144 00001 (Ext 100)</strong>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
            <span className="text-slate-400 block">Hostel Medical Dispensary:</span>
            <strong className="text-slate-900">+91 98144 00002 (Ext 102)</strong>
          </div>
          <div className="bg-white/80 p-2 rounded-lg border border-amber-200/60">
            <span className="text-slate-400 block">Chief Warden Direct:</span>
            <strong className="text-slate-900">+91 98123 45678 (Ext 105)</strong>
          </div>
        </div>
      </div>

      {/* Incidents Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="font-bold text-slate-900 text-sm">Security Logged Incidents</h2>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
            {incidents.length} Records
          </span>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {incidents.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No incidents logged yet.
            </div>
          ) : (
            incidents.map((inc) => (
              <div key={inc.id} className="py-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{inc.incidentRef}</span>
                    <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      {inc.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(inc.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed font-medium">{inc.description}</p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {inc.location}
                  </span>
                  <span>Reported by: <strong>{inc.reporterName}</strong></span>
                  {inc.involvedStudentName && (
                    <span className="text-brand-600 font-medium">
                      Involved: {inc.involvedStudentName}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Log Incident Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Log Security Observation / Incident</span>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleReportIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Incident Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="OVERDUE_CURFEW">Overdue Curfew Entry</option>
                  <option value="SUSPICIOUS_PASS">Suspicious or Tampered Pass</option>
                  <option value="UNAUTHORIZED_ENTRY">Unauthorized Campus Entry Attempt</option>
                  <option value="DISCIPLINARY">Hostel / Campus Disciplinary Matter</option>
                  <option value="MEDICAL_EMERGENCY">Medical Emergency at Gate</option>
                  <option value="OTHER">Other Security Note</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campus Location / Post</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="Gate #1 (Main Entrance)">Gate #1 (Main Entrance)</option>
                  <option value="Gate #2 (Boys Hostel Entrance)">Gate #2 (Boys Hostel Entrance)</option>
                  <option value="Gate #3 (Girls Hostel Perimeter)">Gate #3 (Girls Hostel Perimeter)</option>
                  <option value="Campus Parking Area">Campus Parking Area</option>
                  <option value="Auditorium Lawn">Auditorium Lawn</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Involved Student Roll # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. CTGI/2023/CSE/101"
                  value={involvedStudentRoll}
                  onChange={(e) => setInvolvedStudentRoll(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Observations *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record factual observations, vehicle numbers, student statements..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
