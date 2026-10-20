import React, { useState, useEffect } from 'react';
import { User, GatePassRequest, FeeRecord, Notice, HostelComplaint, SubjectAttendance, TimetableEntry } from '../../types';
import { StorageService, SEED_ATTENDANCE, SEED_TIMETABLE } from '../../services/storage';
import { ApprovalService } from '../../services/approvals';
import { DigitalIDCard } from '../common/DigitalIDCard';
import { PassQRModal } from '../common/PassQRModal';
import { isBeforeDayScholarDeadline } from '../../config/institution';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  FileText, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  Send, 
  CreditCard, 
  Building, 
  Bus, 
  PlusCircle, 
  Calculator, 
  ChevronRight,
  ShieldCheck,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowUpRight
} from 'lucide-react';

interface StudentPortalProps {
  student: User;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ student }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'passes' | 'attendance' | 'timetable' | 'fees' | 'hostel'>('overview');
  const [showIdModal, setShowIdModal] = useState(false);
  const [selectedPassForQR, setSelectedPassForQR] = useState<GatePassRequest | null>(null);
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [feeRecord, setFeeRecord] = useState<FeeRecord | undefined>(undefined);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [complaints, setComplaints] = useState<HostelComplaint[]>([]);

  // Apply Gate Pass Form State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [requestType, setRequestType] = useState<any>(student.studentType === 'HOSTELLER' ? 'GATE_PASS_OUTING' : 'DAY_SCHOLAR_PASS');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [expectedReturnTime, setExpectedReturnTime] = useState('');
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  // Attendance Calculator State
  const [targetPercentage, setTargetPercentage] = useState<number>(75);
  const [calcSubjectCode, setCalcSubjectCode] = useState<string>(SEED_ATTENDANCE[1].subjectCode); // default ML

  // Hostel Complaint Form State
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [cmpCategory, setCmpCategory] = useState<any>('WIFI');
  const [cmpDesc, setCmpDesc] = useState('');

  const isHosteller = student.studentType === 'HOSTELLER';
  const isBefore2PM = isBeforeDayScholarDeadline();

  useEffect(() => {
    loadData();
  }, [student]);

  const loadData = () => {
    setPasses(StorageService.getGatePasses().filter(p => p.studentId === student.id));
    setFeeRecord(StorageService.getStudentFee(student.id));
    setNotices(StorageService.getNotices());
    setComplaints(StorageService.getComplaints().filter(c => c.studentId === student.id));
  };

  const handleApplyPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || !purpose.trim()) return;

    try {
      const newPass = ApprovalService.submitRequest({
        studentId: student.id,
        requestType,
        purpose,
        destination,
        departureTime: departureTime ? new Date(departureTime).toISOString() : new Date().toISOString(),
        expectedReturnTime: expectedReturnTime ? new Date(expectedReturnTime).toISOString() : new Date(Date.now() + 14400000).toISOString()
      });

      setShowApplyModal(false);
      setDestination('');
      setPurpose('');
      loadData();
      setSubmitSuccessMsg(`Pass request [${newPass.passNumber}] submitted successfully for official authorization.`);
      setTimeout(() => setSubmitSuccessMsg(null), 5000);
    } catch (err: any) {
      alert(`Error submitting request: ${err.message}`);
    }
  };

  const handleCancelPass = (passId: string) => {
    if (!confirm('Are you sure you want to cancel this pending pass application?')) return;
    try {
      ApprovalService.cancelRequest(passId, student.id);
      loadData();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleNewComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmpDesc.trim()) return;

    const newCmp: HostelComplaint = {
      id: `cmp-${Date.now()}`,
      complaintRef: `CMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      studentId: student.id,
      studentName: student.name,
      roomInfo: `${student.hostelBlock || 'Hostel'} ${student.roomNumber || ''}`,
      category: cmpCategory,
      description: cmpDesc,
      priority: 'MEDIUM',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    };

    StorageService.submitComplaint(newCmp);
    setShowComplaintModal(false);
    setCmpDesc('');
    loadData();
  };

  // Calculate attendance target
  const selectedSub = SEED_ATTENDANCE.find(s => s.subjectCode === calcSubjectCode) || SEED_ATTENDANCE[0];
  const currentTotal = selectedSub.classesConducted;
  const currentAttended = selectedSub.classesAttended;
  
  // Formula: (attended + X) / (total + X) = target / 100
  // 100*(attended + X) = target*(total + X)
  // 100*attended + 100*X = target*total + target*X
  // X * (100 - target) = target*total - 100*attended
  // X = (target*total - 100*attended) / (100 - target)
  const calculateClassesNeeded = () => {
    const num = (targetPercentage * currentTotal - 100 * currentAttended);
    const den = (100 - targetPercentage);
    if (den <= 0) return 0;
    const needed = Math.ceil(num / den);
    return Math.max(0, needed);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Student Welcome & Profile Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-brand-900 to-brand-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{student.name}</h1>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isHosteller ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {isHosteller ? 'Hosteller Resident' : 'Day Scholar'}
                </span>
              </div>
              <p className="text-xs text-brand-200 font-mono mt-1 font-semibold">{student.institutionUserId}</p>
              <p className="text-xs text-slate-300 mt-0.5">
                {student.department} • Semester {student.semester || 6} (Section {student.section || 'A'})
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowIdModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur border border-white/20 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <QrCode className="w-4 h-4 text-brand-300" />
              <span>Digital Student ID</span>
            </button>

            <button
              onClick={() => setShowApplyModal(true)}
              className="flex-1 md:flex-none px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/30 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isHosteller ? 'Apply Gate Pass / Leave' : 'Apply Outing Pass'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submitSuccessMsg && (
        <div className="p-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold shadow-md flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{submitSuccessMsg}</span>
        </div>
      )}

      {/* Day Scholar 2:00 PM Policy Warning Banner (For Day Scholars) */}
      {!isHosteller && (
        <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 shadow-2xs ${
          isBefore2PM ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <Clock className={`w-5 h-5 shrink-0 mt-0.5 ${isBefore2PM ? 'text-blue-600' : 'text-amber-600'}`} />
          <div className="flex-1">
            <span className="font-bold">Day Scholar Gate Pass Submission Policy (CTGI Working Hours):</span>
            <p className="mt-0.5 leading-relaxed">
              Standard day-scholar outing requests must be submitted before <strong>2:00 PM IST</strong> on working days. 
              {isBefore2PM ? (
                <span className="text-emerald-700 font-semibold block mt-1">✓ Current time is before 2:00 PM. Applications follow standard routing.</span>
              ) : (
                <span className="text-rose-700 font-semibold block mt-1">⚠️ Current time is past 2:00 PM. Submissions will be flagged as Late Requests and require authorized supervisor clearance.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dashboard Overview
        </button>
        <button
          onClick={() => setActiveTab('passes')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'passes' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Gate Passes & Leave</span>
          {passes.length > 0 && (
            <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {passes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'attendance' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Attendance & Goal Calculator
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'timetable' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Timetable & Exams
        </button>
        <button
          onClick={() => setActiveTab('fees')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'fees' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Fee Ledger & Receipts
        </button>
        {isHosteller && (
          <button
            onClick={() => setActiveTab('hostel')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'hostel' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Hostel & Complaints</span>
            {complaints.length > 0 && (
              <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {complaints.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Attendance Card */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Overall Attendance
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-slate-900">85.2%</span>
                <span className="text-xs font-semibold text-emerald-600">✓ Safe (75% Req)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85.2%' }}></div>
              </div>
            </div>

            {/* Academic CGPA */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Current SGPA / CGPA
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-brand-700">8.42</span>
                <span className="text-xs font-semibold text-slate-500">/ 10.0</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">Verified Even Semester 2025</p>
            </div>

            {/* Outstanding Fee */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Fee Dues
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className={`text-2xl sm:text-3xl font-black ${
                  (feeRecord?.outstandingBalance || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  ₹{(feeRecord?.outstandingBalance || 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">
                {(feeRecord?.outstandingBalance || 0) > 0 ? 'Due by March 31, 2026' : 'All Clear • Verified'}
              </p>
            </div>

            {/* Active Pass State */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Active Pass Status
              </span>
              <div className="mt-1">
                {passes.length > 0 ? (
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                    passes[0].status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    passes[0].status === 'EXIT_RECORDED' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {passes[0].status.replace(/_/g, ' ')}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">No active passes</span>
                )}
              </div>
              {passes[0]?.status === 'APPROVED' && (
                <button
                  onClick={() => setSelectedPassForQR(passes[0])}
                  className="mt-2 text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" /> Show QR Token
                </button>
              )}
            </div>

          </div>

          {/* Today's Timetable Widget & Notices Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Today's Schedule */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Today's Academic Timetable</h3>
                </div>
                <span className="text-[11px] font-semibold text-brand-600">Monday Schedule</span>
              </div>

              <div className="mt-3 divide-y divide-slate-100">
                {SEED_TIMETABLE.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-xl bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                        {item.room}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{item.subjectName}</div>
                        <div className="text-[11px] text-slate-500">{item.facultyName} • {item.subjectCode}</div>
                      </div>
                    </div>
                    <span className="font-mono text-slate-600 font-medium text-[11px]">
                      {item.timeSlot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Notices */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Campus Circulars</h3>
                </div>
              </div>

              <div className="mt-3 space-y-3">
                {notices.slice(0, 3).map((notice) => (
                  <div key={notice.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-[10px] font-bold text-brand-700">
                      <span>{notice.category}</span>
                      <span className="text-slate-400 font-normal">
                        {new Date(notice.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 mt-1 leading-snug">{notice.title}</div>
                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-2 leading-relaxed">{notice.content}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: GATE PASSES & LEAVE */}
      {activeTab === 'passes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Digital Gate Pass & Leave Applications</h2>
              <p className="text-xs text-slate-500">
                {isHosteller ? 'Dual authority approval required (Academic + Hostel Warden)' : 'Submitted with departmental verification'}
              </p>
            </div>

            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Application</span>
            </button>
          </div>

          {/* Pass History Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {passes.length === 0 ? (
              <div className="col-span-2 bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No gate passes submitted yet. Click "New Application" to apply for an outing.
              </div>
            ) : (
              passes.map((pass) => (
                <div key={pass.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Pass Number</span>
                      <div className="text-base font-black font-mono text-slate-900">{pass.passNumber}</div>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      pass.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                      pass.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      pass.status === 'EXIT_RECORDED' ? 'bg-blue-100 text-blue-800' :
                      pass.status === 'RETURN_RECORDED' ? 'bg-slate-100 text-slate-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {pass.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 text-slate-700">
                    <div><span className="text-slate-400">Purpose: </span><strong>{pass.purpose}</strong></div>
                    <div><span className="text-slate-400">Destination: </span>{pass.destination}</div>
                    <div>
                      <span className="text-slate-400">Valid Outing: </span>
                      {new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' — '}
                      {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {/* Multi-Step Approval Status Timeline */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                    <div className="font-semibold text-slate-500 mb-1.5 uppercase text-[10px]">Official Clearances</div>
                    <div className="space-y-1.5">
                      {pass.approvalSteps.map((step, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="text-slate-600">{step.role.replace(/_/g, ' ')}:</span>
                          <span className={`font-bold flex items-center gap-1 ${
                            step.status === 'APPROVED' ? 'text-emerald-600' :
                            step.status === 'REJECTED' ? 'text-rose-600' : 'text-amber-600'
                          }`}>
                            {step.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                            {step.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                            {step.status === 'PENDING' && <Clock className="w-3 h-3" />}
                            {step.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between">
                    {pass.status === 'APPROVED' && (
                      <button
                        onClick={() => setSelectedPassForQR(pass)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" /> View Scannable Pass
                      </button>
                    )}

                    {(pass.status.startsWith('PENDING') || pass.status === 'DRAFT') && (
                      <button
                        onClick={() => handleCancelPass(pass.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                      >
                        Cancel Request
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE & CALCULATOR */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <h2 className="text-base font-bold text-slate-900 mb-4">Subject-Wise Verified Attendance</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3">Subject</th>
                    <th className="pb-3">Faculty</th>
                    <th className="pb-3 text-center">Conducted</th>
                    <th className="pb-3 text-center">Attended</th>
                    <th className="pb-3 text-center">Percentage</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SEED_ATTENDANCE.map((sub) => (
                    <tr key={sub.subjectCode} className="hover:bg-slate-50/80">
                      <td className="py-3 font-bold text-slate-900">
                        {sub.subjectName} <span className="font-mono text-slate-400 font-normal">({sub.subjectCode})</span>
                      </td>
                      <td className="py-3 text-slate-600">{sub.facultyName}</td>
                      <td className="py-3 text-center font-mono">{sub.classesConducted}</td>
                      <td className="py-3 text-center font-mono font-bold">{sub.classesAttended}</td>
                      <td className="py-3 text-center font-mono font-extrabold text-sm">
                        <span className={sub.attendancePercentage < 75 ? 'text-rose-600' : 'text-emerald-600'}>
                          {sub.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {sub.attendancePercentage < 75 ? (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                            Shortage Warning
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            Eligible
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Attendance Goal Calculator */}
          <div className="bg-gradient-to-br from-brand-900 to-navy-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-brand-300" />
              <h3 className="font-black text-lg">Target Attendance Goal Calculator</h3>
            </div>
            <p className="text-xs text-brand-200">
              Calculate the exact number of future consecutive lectures you must attend to achieve college examination eligibility (75% minimum).
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-brand-300 uppercase mb-1">Select Subject</label>
                <select
                  value={calcSubjectCode}
                  onChange={(e) => setCalcSubjectCode(e.target.value)}
                  className="w-full bg-navy-800 text-white border border-brand-700 rounded-xl p-2.5 text-xs font-semibold focus:outline-none"
                >
                  {SEED_ATTENDANCE.map((s) => (
                    <option key={s.subjectCode} value={s.subjectCode}>
                      {s.subjectName} ({s.attendancePercentage}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-brand-300 uppercase mb-1">Target Percentage</label>
                <div className="flex gap-2">
                  {[75, 80, 85].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setTargetPercentage(pct)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        targetPercentage === pct 
                          ? 'bg-brand-500 border-brand-400 text-white shadow-md' 
                          : 'bg-navy-800/80 border-navy-700 text-brand-200 hover:bg-navy-800'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-center flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-brand-300">Classes Needed</span>
                <span className="text-3xl font-black text-emerald-400 mt-0.5">
                  {calculateClassesNeeded()} Lectures
                </span>
                <span className="text-[10px] text-brand-200 mt-1">
                  Attend {calculateClassesNeeded()} more classes without missing
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMETABLE & EXAMS */}
      {activeTab === 'timetable' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">Weekly Class Timetable</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {SEED_TIMETABLE.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold text-brand-700">
                  <span>{item.day}</span>
                  <span className="bg-white px-2 py-0.5 rounded shadow-2xs text-slate-700 font-mono">{item.room}</span>
                </div>
                <div className="font-bold text-slate-900">{item.subjectName}</div>
                <div className="text-[11px] text-slate-500">{item.facultyName}</div>
                <div className="font-mono text-slate-600 text-[11px] pt-1 border-t border-slate-200/60 mt-1">
                  {item.timeSlot}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: FEES */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Institutional Fee Status</span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">Academic Session 2025–2026</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Outstanding Balance:</span>
                <span className="text-2xl font-black text-amber-600 font-mono">
                  ₹{(feeRecord?.outstandingBalance || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tuition Fee</span>
                <strong className="text-slate-800 text-sm">₹{(feeRecord?.tuitionFee || 0).toLocaleString()}</strong>
              </div>
              {isHosteller && (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Hostel Accommodation</span>
                    <strong className="text-slate-800 text-sm">₹{(feeRecord?.hostelFee || 0).toLocaleString()}</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mess Dues</span>
                    <strong className="text-slate-800 text-sm">₹{(feeRecord?.messFee || 0).toLocaleString()}</strong>
                  </div>
                </>
              )}
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Examination Fee</span>
                <strong className="text-slate-800 text-sm">₹{(feeRecord?.examFee || 0).toLocaleString()}</strong>
              </div>
            </div>

            {/* Transaction Ledger */}
            <div className="mt-6">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Verified Transaction History & Receipts</h3>
              <div className="divide-y divide-slate-100">
                {feeRecord?.transactions.map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{tx.category} Payment — ₹{tx.amount.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Ref: {tx.transactionRef} • Mode: {tx.paymentMode} • {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {tx.status}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{tx.receiptNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: HOSTEL (Hosteller Only) */}
      {activeTab === 'hostel' && isHosteller && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">Assigned Hostel Room Allocation</h3>
              </div>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="text-xs bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Submit Complaint
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-purple-700">Block & Room</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{student.hostelBlock} ({student.roomNumber})</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Chief Warden</span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{student.wardenName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400">Evening Curfew</span>
                <div className="font-bold text-rose-700 text-sm mt-0.5">Strictly 7:30 PM IST</div>
              </div>
            </div>

            {/* Complaints List */}
            <div className="mt-6">
              <h4 className="font-bold text-slate-900 text-xs uppercase text-slate-400 tracking-wider mb-2">
                Room Maintenance & Complaints
              </h4>
              <div className="space-y-2">
                {complaints.length === 0 ? (
                  <p className="text-slate-400 text-xs">No active maintenance requests.</p>
                ) : (
                  complaints.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.category} Issue</span>
                          <span className="font-mono text-[10px] text-slate-400">({c.complaintRef})</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{c.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital ID Modal */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setShowIdModal(false)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-lg"
            >
              ✕
            </button>
            <DigitalIDCard user={student} />
          </div>
        </div>
      )}

      {/* Scannable Pass QR Code Modal */}
      {selectedPassForQR && (
        <PassQRModal pass={selectedPassForQR} onClose={() => setSelectedPassForQR(null)} />
      )}

      {/* Apply Pass Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Apply for {isHosteller ? 'Gate Pass / Leave' : 'Day Scholar Outing'}
              </h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyPass} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pass Category</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  {isHosteller ? (
                    <>
                      <option value="GATE_PASS_OUTING">Hostel Outing Pass (Same Day Return)</option>
                      <option value="EXTENDED_LEAVE">Extended Home Leave (Multi-Day)</option>
                    </>
                  ) : (
                    <option value="DAY_SCHOLAR_PASS">Day Scholar Outing Pass</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Destination Address / City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Town Market, Jalandhar"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purpose of Outing *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State specific purpose (e.g. Project research, urgent bank visit, medical checkup)..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Departure Time</label>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expected Return</label>
                  <input
                    type="datetime-local"
                    value={expectedReturnTime}
                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hostel Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Hostel Facility Complaint</h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleNewComplaint} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={cmpCategory}
                  onChange={(e) => setCmpCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="WIFI">Wi-Fi & Internet</option>
                  <option value="WATER">Water Supply & Geyser</option>
                  <option value="ELECTRICITY">Electricity & Lighting</option>
                  <option value="CLEANING">Room / Bathroom Cleaning</option>
                  <option value="MESS_FOOD">Mess Food Quality</option>
                  <option value="CARPENTRY">Carpentry & Furniture</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the issue in detail..."
                  value={cmpDesc}
                  onChange={(e) => setCmpDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowComplaintModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md">Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
