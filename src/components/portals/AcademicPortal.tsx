import React, { useState, useEffect } from 'react';
import { User, GatePassRequest, Notice } from '../../types';
import { StorageService, SEED_ATTENDANCE } from '../../services/storage';
import { ApprovalService } from '../../services/approvals';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  PlusCircle,
  Users,
  Search
} from 'lucide-react';

interface AcademicPortalProps {
  faculty: User;
}

export const AcademicPortal: React.FC<AcademicPortalProps> = ({ faculty }) => {
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Notice state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<any>('ACADEMIC');
  const [noticeContent, setNoticeContent] = useState('');

  useEffect(() => {
    loadData();
  }, [faculty]);

  const loadData = () => {
    const all = StorageService.getGatePasses();
    setPasses(all);
    setNotices(StorageService.getNotices());
  };

  // Find requests awaiting this academic authority
  const pendingAcademicQueue = passes.filter(p => 
    p.status.startsWith('PENDING') &&
    p.approvalSteps.some(s => 
      (s.role === faculty.role || s.role === 'CLASS_INCHARGE' || s.role === 'HOD' || s.role === 'HOI') &&
      s.status === 'PENDING'
    )
  );

  const handleApprove = (pass: GatePassRequest) => {
    try {
      ApprovalService.approveStep(
        pass.id,
        faculty.role as any,
        faculty.id,
        faculty.name,
        `Approved by ${faculty.role.replace(/_/g, ' ')}`
      );
      loadData();
      setActionSuccess(`Academic clearance granted for ${pass.studentName} (${pass.passNumber}).`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReject = (pass: GatePassRequest) => {
    const reason = prompt('Enter academic rejection reason:', 'Attendance shortage or ongoing class schedule');
    if (!reason) return;
    try {
      ApprovalService.rejectStep(
        pass.id,
        faculty.role as any,
        faculty.id,
        faculty.name,
        reason
      );
      loadData();
      setActionSuccess(`Pass ${pass.passNumber} rejected.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handlePublishNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const notice: Notice = {
      id: `not-${Date.now()}`,
      title: noticeTitle,
      category: noticeCategory,
      content: noticeContent,
      date: new Date().toISOString(),
      publisher: faculty.name,
      publisherRole: faculty.role,
      important: true,
      targetAudience: ['STUDENT']
    };

    StorageService.publishNotice(notice);
    setShowNoticeModal(false);
    setNoticeTitle('');
    setNoticeContent('');
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-brand-900 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Portal • {faculty.role.replace(/_/g, ' ')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">{faculty.name}</h1>
          <p className="text-xs text-brand-200 mt-0.5">Department: <strong className="text-white">{faculty.department}</strong></p>
        </div>

        <button
          onClick={() => setShowNoticeModal(true)}
          className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Notice</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Pending Academic Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-sm">Academic Clearance Queue</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{pendingAcademicQueue.length} Awaiting Approval</span>
        </div>

        {pendingAcademicQueue.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No academic gate pass clearances pending in your department.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingAcademicQueue.map((pass) => (
              <div key={pass.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{pass.passNumber}</span>
                    <span className="block text-[11px] text-brand-700 font-semibold">{pass.requestType.replace(/_/g, ' ')}</span>
                  </div>
                  {pass.isLateSubmission && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Late Submission
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-slate-700">
                  <div>Student: <strong>{pass.studentName}</strong> ({pass.studentNumber})</div>
                  <div>Department: <strong>{pass.department}</strong> • Semester {pass.semester}</div>
                  <div>Destination: <strong>{pass.destination}</strong></div>
                  <div>Purpose: <span className="italic">{pass.purpose}</span></div>
                  <div>Outing: {new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleReject(pass)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(pass)}
                    className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-sm"
                  >
                    Grant Clearance
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Class Attendance Register Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">Class Attendance Register Overview</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SEED_ATTENDANCE.map((sub) => (
            <div key={sub.subjectCode} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-900">{sub.subjectName}</span>
                <span className="font-mono text-slate-500 font-semibold">{sub.subjectCode}</span>
              </div>
              <div className="text-[11px] text-slate-500">Conducted: {sub.classesConducted} lectures</div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-400">Class Average:</span>
                <strong className={sub.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}>
                  {sub.attendancePercentage}%
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Publish Subject / Department Notice</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Assignment #3 Submission Deadline"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="ACADEMIC">Academic</option>
                  <option value="EXAMINATION">Examination</option>
                  <option value="EVENTS">Events / Workshop</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Content Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type official notice content..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowNoticeModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Publish Circular</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
