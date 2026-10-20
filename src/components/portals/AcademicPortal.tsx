import React, { useState, useEffect } from 'react';
import { User, GatePassRequest, Notice, Gender, UserRole } from '../../types';
import { StorageService, SEED_ATTENDANCE } from '../../services/storage';
import { ApprovalService } from '../../services/approvals';
import { BOYS_HOSTEL_BLOCKS, GIRLS_HOSTEL_BLOCKS } from '../../config/institution';
import { 
  GraduationCap, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  FileText, 
  PlusCircle,
  Users,
  Search,
  UserPlus,
  ShieldCheck,
  Building,
  Award,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';

interface AcademicPortalProps {
  faculty: User;
}

export const AcademicPortal: React.FC<AcademicPortalProps> = ({ faculty }) => {
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Notice Modal State
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<any>('ACADEMIC');
  const [noticeContent, setNoticeContent] = useState('');

  // 1. Student Registration Modal State (For Class Incharge)
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [stdName, setStdName] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [stdPhone, setStdPhone] = useState('+91 98765 00000');
  const [stdGender, setStdGender] = useState<Gender>('MALE');
  const [stdType, setStdType] = useState<'HOSTELLER' | 'DAY_SCHOLAR'>('HOSTELLER');
  const [stdHostelBlock, setStdHostelBlock] = useState(BOYS_HOSTEL_BLOCKS[0]);
  const [stdRoom, setStdRoom] = useState('');
  const [stdSemester, setStdSemester] = useState(faculty.semester || 6);
  const [stdSection, setStdSection] = useState(faculty.section || 'A');
  const [stdGuardianName, setStdGuardianName] = useState('');
  const [stdGuardianPhone, setStdGuardianPhone] = useState('+91 98111 22334');

  // 2. Class Incharge Registration Modal State (For HOD)
  const [showInchargeModal, setShowInchargeModal] = useState(false);
  const [incName, setIncName] = useState('');
  const [incEmail, setIncEmail] = useState('');
  const [incPhone, setIncPhone] = useState('+91 98123 00000');
  const [incGender, setIncGender] = useState<Gender>('FEMALE');
  const [incSemester, setIncSemester] = useState(6);
  const [incSection, setIncSection] = useState('A');

  // 3. HOD Registration Modal State (For HOI)
  const [showHodModal, setShowHodModal] = useState(false);
  const [hodName, setHodName] = useState('');
  const [hodEmail, setHodEmail] = useState('');
  const [hodPhone, setHodPhone] = useState('+91 98150 00000');
  const [hodGender, setHodGender] = useState<Gender>('MALE');
  const [hodDept, setHodDept] = useState('Computer Science & Engineering');

  const isClassIncharge = faculty.role === 'CLASS_INCHARGE';
  const isHod = faculty.role === 'HOD';
  const isHoi = faculty.role === 'HOI';

  useEffect(() => {
    loadData();
  }, [faculty]);

  const loadData = () => {
    setPasses(StorageService.getGatePasses());
    setNotices(StorageService.getNotices());
    setUsers(StorageService.getUsers());
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
        `Approved by ${faculty.role.replace(/_/g, ' ')} (${faculty.name})`
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
    setActionSuccess('Notice published successfully to campus portal.');
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // 1. Handler: Class Incharge registers a Student
  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim() || !stdEmail.trim()) return;

    const isHosteller = stdType === 'HOSTELLER';
    const deptCode = (faculty.department || 'CSE').includes('Computer') ? 'CSE' : 'ENG';
    const rollNo = `CTGI/2026/${deptCode}/${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: User = {
      id: `user-${Date.now()}`,
      institutionUserId: rollNo,
      name: stdName,
      email: stdEmail,
      phone: stdPhone,
      role: isHosteller ? 'STUDENT_HOSTELLER' : 'STUDENT_DAYSCHOLAR',
      gender: stdGender,
      department: faculty.department || 'Computer Science & Engineering',
      semester: Number(stdSemester),
      section: stdSection,
      studentType: stdType,
      hostelCategory: isHosteller ? (stdGender === 'FEMALE' ? 'GIRLS_HOSTEL' : 'BOYS_HOSTEL') : undefined,
      hostelBlock: isHosteller ? stdHostelBlock : undefined,
      roomNumber: isHosteller ? stdRoom : undefined,
      wardenName: isHosteller ? (stdGender === 'FEMALE' ? 'Dr. Sunita Sharma' : 'Dr. Rajesh Verma') : undefined,
      classInchargeName: faculty.name,
      guardianName: stdGuardianName,
      guardianPhone: stdGuardianPhone,
      avatarUrl: stdGender === 'FEMALE'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newStudent);
    setShowStudentModal(false);
    setStdName('');
    setStdEmail('');
    setStdRoom('');
    loadData();
    setActionSuccess(`Student [${newStudent.name}] registered with Roll No: ${rollNo}`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // 2. Handler: HOD registers a Class Incharge
  const handleRegisterIncharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incName.trim() || !incEmail.trim()) return;

    const staffId = `CTGI/FAC/INC/${Math.floor(100 + Math.random() * 900)}`;
    const newIncharge: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: incName,
      email: incEmail,
      phone: incPhone,
      role: 'CLASS_INCHARGE',
      gender: incGender,
      department: faculty.department || 'Computer Science & Engineering',
      semester: Number(incSemester),
      section: incSection,
      avatarUrl: incGender === 'FEMALE'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
        : 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newIncharge);
    setShowInchargeModal(false);
    setIncName('');
    setIncEmail('');
    loadData();
    setActionSuccess(`Class Incharge [${newIncharge.name}] registered for Sem ${incSemester} Section ${incSection}`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // 3. Handler: HOI registers an HOD
  const handleRegisterHod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hodName.trim() || !hodEmail.trim()) return;

    const staffId = `CTGI/ADMIN/HOD/${Math.floor(100 + Math.random() * 900)}`;
    const newHod: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: hodName,
      email: hodEmail,
      phone: hodPhone,
      role: 'HOD',
      gender: hodGender,
      department: hodDept,
      avatarUrl: hodGender === 'FEMALE'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
        : 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newHod);
    setShowHodModal(false);
    setHodName('');
    setHodEmail('');
    loadData();
    setActionSuccess(`HOD [${newHod.name}] registered for ${hodDept}`);
    setTimeout(() => setActionSuccess(null), 5000);
  };

  // Filter users based on viewing role:
  // Class Incharge sees students in their department / class
  const classStudents = users.filter(u => u.role.startsWith('STUDENT') && (!faculty.department || u.department === faculty.department));
  
  // HOD sees Class Incharges in their department
  const deptIncharges = users.filter(u => u.role === 'CLASS_INCHARGE' && (!faculty.department || u.department === faculty.department));
  
  // HOI sees all HODs in the institute
  const instituteHods = users.filter(u => u.role === 'HOD');

  const availableHostels = stdGender === 'MALE' ? BOYS_HOSTEL_BLOCKS : GIRLS_HOSTEL_BLOCKS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-950 via-slate-900 to-navy-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Authority • {faculty.role.replace(/_/g, ' ')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">{faculty.name}</h1>
          <p className="text-xs text-brand-200 mt-0.5">
            Department: <strong className="text-white">{faculty.department || 'Institute Administration'}</strong>
            {faculty.semester && <span> • Semester {faculty.semester} (Section {faculty.section || 'A'})</span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Role-Specific Registration Trigger */}
          {isClassIncharge && (
            <button
              onClick={() => setShowStudentModal(true)}
              className="bg-brand-500 hover:bg-brand-400 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Student</span>
            </button>
          )}

          {isHod && (
            <button
              onClick={() => setShowInchargeModal(true)}
              className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Class Incharge</span>
            </button>
          )}

          {isHoi && (
            <button
              onClick={() => setShowHodModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register HOD</span>
            </button>
          )}

          <button
            onClick={() => setShowNoticeModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* DEPARTMENTAL PROVISIONING HIERARCHY SECTIONS */}
      {/* 1. CLASS INCHARGE: STUDENT ROSTER & REGISTRATION */}
      {isClassIncharge && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-sm">Class Student Roster (Registered by Class Incharge)</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{classStudents.length} Students</span>
          </div>

          {classStudents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No students registered yet in your class. Click <strong>"Register Student"</strong> above to register students.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {classStudents.map((std) => (
                <div key={std.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{std.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      std.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {std.gender === 'FEMALE' ? '♀ Female' : '♂ Male'}
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 font-semibold">{std.institutionUserId}</div>
                  <div className="text-[11px] text-slate-600">
                    {std.studentType === 'HOSTELLER' ? (
                      <span className="text-purple-700 font-semibold">
                        Hostel: {std.hostelBlock} ({std.roomNumber || 'Room N/A'})
                      </span>
                    ) : (
                      <span className="text-blue-700 font-semibold">Day Scholar</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200">
                    Sem {std.semester} (Sec {std.section || 'A'}) • {std.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. HOD: CLASS INCHARGE DIRECTORY & REGISTRATION */}
      {isHod && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <h2 className="font-bold text-slate-900 text-sm">Department Class Incharges (Registered by HOD)</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{deptIncharges.length} Appointed</span>
          </div>

          {deptIncharges.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No class incharges appointed yet in {faculty.department}. Click <strong>"Register Class Incharge"</strong> above to add incharge faculty.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {deptIncharges.map((inc) => (
                <div key={inc.id} className="p-3.5 bg-purple-50/40 rounded-xl border border-purple-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{inc.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      Incharge
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 font-semibold">{inc.institutionUserId}</div>
                  <div className="text-[11px] text-purple-900 font-semibold">
                    Semester {inc.semester} • Section {inc.section || 'A'}
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-purple-100">
                    Email: {inc.email} • {inc.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. HOI: HOD DIRECTORY & REGISTRATION */}
      {isHoi && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-600" />
              <h2 className="font-bold text-slate-900 text-sm">Institute Heads of Departments (Registered by HOI)</h2>
            </div>
            <span className="text-xs font-semibold text-slate-500">{instituteHods.length} HODs Appointed</span>
          </div>

          {instituteHods.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No HODs registered yet. Click <strong>"Register HOD"</strong> above to appoint departmental heads.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {instituteHods.map((hod) => (
                <div key={hod.id} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{hod.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      HOD
                    </span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 font-semibold">{hod.institutionUserId}</div>
                  <div className="text-[11px] text-emerald-950 font-bold">{hod.department}</div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-emerald-100">
                    Email: {hod.email} • {hod.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Academic Outing Clearance Queue */}
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
            <BookOpen className="w-4 h-4 text-emerald-600" />
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

      {/* MODAL 1: REGISTER STUDENT (FOR CLASS INCHARGE) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Register New Student in Class</h3>
              <button onClick={() => setShowStudentModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-3 text-xs">
              {/* Gender Wing Segregation */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1 uppercase text-[10px]">
                  Gender (Hostel Wing Segregation) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setStdGender('MALE'); setStdHostelBlock(BOYS_HOSTEL_BLOCKS[0]); }}
                    className={`py-2 px-2.5 rounded-lg font-bold text-xs border ${
                      stdGender === 'MALE' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    ♂ Male (Boys Wing)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStdGender('FEMALE'); setStdHostelBlock(GIRLS_HOSTEL_BLOCKS[0]); }}
                    className={`py-2 px-2.5 rounded-lg font-bold text-xs border ${
                      stdGender === 'FEMALE' ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    ♀ Female (Girls Wing)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@ctgroup.in"
                  value={stdEmail}
                  onChange={(e) => setStdEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={stdPhone}
                    onChange={(e) => setStdPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Type</label>
                  <select
                    value={stdType}
                    onChange={(e) => setStdType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="HOSTELLER">Hostel Resident</option>
                    <option value="DAY_SCHOLAR">Day Scholar</option>
                  </select>
                </div>
              </div>

              {stdType === 'HOSTELLER' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 text-[11px] font-semibold mb-1">Hostel Block</label>
                      <select
                        value={stdHostelBlock}
                        onChange={(e) => setStdHostelBlock(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      >
                        {availableHostels.map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-[11px] font-semibold mb-1">Room Number</label>
                      <input
                        type="text"
                        placeholder="e.g. B-204"
                        value={stdRoom}
                        onChange={(e) => setStdRoom(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    value={stdSemester}
                    onChange={(e) => setStdSemester(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Section</label>
                  <input
                    type="text"
                    value={stdSection}
                    onChange={(e) => setStdSection(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Father / Mother"
                    value={stdGuardianName}
                    onChange={(e) => setStdGuardianName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Phone</label>
                  <input
                    type="tel"
                    value={stdGuardianPhone}
                    onChange={(e) => setStdGuardianPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowStudentModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Complete Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REGISTER CLASS INCHARGE (FOR HOD) */}
      {showInchargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Register Class Incharge (HOD Appointment)</h3>
              <button onClick={() => setShowInchargeModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleRegisterIncharge} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Faculty Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Sunita Mehra"
                  value={incName}
                  onChange={(e) => setIncName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">College Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="faculty@ctgroup.in"
                  value={incEmail}
                  onChange={(e) => setIncEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={incGender}
                    onChange={(e) => setIncGender(e.target.value as Gender)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={incPhone}
                    onChange={(e) => setIncPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Semester</label>
                  <select
                    value={incSemester}
                    onChange={(e) => setIncSemester(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Section</label>
                  <select
                    value={incSection}
                    onChange={(e) => setIncSection(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowInchargeModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md">Register Class Incharge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTER HOD (FOR HOI) */}
      {showHodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Register Head of Department (HOI Appointment)</h3>
              <button onClick={() => setShowHodModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleRegisterHod} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full HOD Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Amit Bansal"
                  value={hodName}
                  onChange={(e) => setHodName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="hod@ctgroup.in"
                  value={hodEmail}
                  onChange={(e) => setHodEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={hodGender}
                    onChange={(e) => setHodGender(e.target.value as Gender)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={hodPhone}
                    onChange={(e) => setHodPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Department</label>
                <select
                  value={hodDept}
                  onChange={(e) => setHodDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Pharmacy & Health Sciences">Pharmacy & Health Sciences</option>
                  <option value="Management & Commerce">Management & Commerce</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowHodModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Register HOD</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PUBLISH NOTICE */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Publish Official Academic Notice</h3>
              <button onClick={() => setShowNoticeModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handlePublishNotice} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Examination 2026"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="ACADEMIC">Academic Instruction</option>
                  <option value="EXAMINATION">Examinations & Tests</option>
                  <option value="EVENTS">Seminars & Workshops</option>
                  <option value="COLLEGE_WIDE">College Wide Circular</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notice Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter notice details for students..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowNoticeModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
