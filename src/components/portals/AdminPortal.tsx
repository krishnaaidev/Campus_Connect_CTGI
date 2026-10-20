import React, { useState, useEffect } from 'react';
import { User, UserRole, Gender, InstitutionalPolicy, AuditLog } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  CT_DEPARTMENTS, 
  CT_CAMPUSES,
  ACTIVE_CAMPUS_NAME,
  COMMON_TEACHING_SUBJECTS,
  CTIEMT_BTECH_BRANCHES, 
  CTIEMT_FIRST_YEAR_BRANCH, 
  BOYS_HOSTEL_BLOCKS, 
  GIRLS_HOSTEL_BLOCKS,
  getYearFromSemester,
  computeStudentBranch
} from '../../config/institution';
import { 
  Settings, 
  Users, 
  ShieldAlert, 
  History, 
  PlusCircle, 
  CheckCircle2, 
  Save, 
  Search, 
  Lock, 
  UserCheck,
  GraduationCap,
  Building,
  Award,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  Filter,
  AlertCircle,
  Building2,
  Layers,
  Key,
  Phone,
  Mail,
  UserPlus
} from 'lucide-react';

interface AdminPortalProps {
  admin: User;
}

type ModalType = 
  | null 
  | 'STUDENT'              // 1. For Students Only
  | 'WARDEN_SECURITY'     // 2. Hostel Warden and Security
  | 'ACADEMIC'            // 3. Class Incharge, Faculty, HOD, HOI
  | 'ALL_DEPT_STAFF'      // 4. Rest All Department Account
  | 'SECURITY_GUARD';     // 5. Security Guards

export const AdminPortal: React.FC<AdminPortalProps> = ({ admin }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'departments' | 'campuses' | 'policy' | 'audit'>('users');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');
  const [selectedDeptTab, setSelectedDeptTab] = useState<string>('CTIEMT');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [policy, setPolicy] = useState<InstitutionalPolicy>(StorageService.getPolicy());
  const [searchUser, setSearchUser] = useState('');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Active Creation Modal Type (5 distinct options)
  const [modalType, setModalType] = useState<ModalType>(null);

  // --- FORM STATE 1: STUDENTS ONLY ---
  const [stdName, setStdName] = useState('');
  const [stdEmail, setStdEmail] = useState('');
  const [stdPassword, setStdPassword] = useState('student123');
  const [stdPhone, setStdPhone] = useState('+91 98765 00000');
  const [stdGender, setStdGender] = useState<Gender>('MALE');
  const [stdDept, setStdDept] = useState('CTIEMT');
  const [stdSemester, setStdSemester] = useState<number>(1);
  const [stdBranch, setStdBranch] = useState('CSE');
  const [stdSection, setStdSection] = useState('A');
  const [stdType, setStdType] = useState<'HOSTELLER' | 'DAY_SCHOLAR'>('HOSTELLER');
  const [stdHostelBlock, setStdHostelBlock] = useState(BOYS_HOSTEL_BLOCKS[0]);
  const [stdRoom, setStdRoom] = useState('');
  const [stdGuardianName, setStdGuardianName] = useState('');
  const [stdGuardianPhone, setStdGuardianPhone] = useState('+91 98111 22334');

  // --- FORM STATE 2: HOSTEL WARDEN & SECURITY ---
  const [wsRole, setWsRole] = useState<'HOSTEL_WARDEN' | 'GATEKEEPER'>('HOSTEL_WARDEN');
  const [wsName, setWsName] = useState('');
  const [wsEmail, setWsEmail] = useState('');
  const [wsPassword, setWsPassword] = useState('warden123');
  const [wsPhone, setWsPhone] = useState('+91 98123 00000');
  const [wsGender, setWsGender] = useState<Gender>('MALE');
  const [wsWing, setWsWing] = useState<'BOYS_HOSTEL' | 'GIRLS_HOSTEL'>('BOYS_HOSTEL');
  const [wsGate, setWsGate] = useState('Gate #1 (Main Campus Entrance)');
  const [wsShift, setWsShift] = useState('General Shift (09:00 - 17:30)');

  // --- FORM STATE 3: CLASS INCHARGE, FACULTY, HOD, HOI ---
  const [acadRole, setAcadRole] = useState<'CLASS_INCHARGE' | 'FACULTY' | 'HOD' | 'HOI'>('CLASS_INCHARGE');
  const [acadName, setAcadName] = useState('');
  const [acadEmail, setAcadEmail] = useState('');
  const [acadPassword, setAcadPassword] = useState('faculty123');
  const [acadPhone, setAcadPhone] = useState('+91 98150 00000');
  const [acadGender, setAcadGender] = useState<Gender>('FEMALE');
  const [acadDept, setAcadDept] = useState('CTIEMT');
  const [acadBranch, setAcadBranch] = useState('CSE');
  const [acadSemester, setAcadSemester] = useState<number>(6);
  const [acadSection, setAcadSection] = useState('A');
  const [acadSubjects, setAcadSubjects] = useState<string[]>([
    'Data Structures & Algorithms',
    'Database Management Systems'
  ]);
  const [customSubjectText, setCustomSubjectText] = useState('');
  const [acadTakesClass, setAcadTakesClass] = useState(true);

  // --- FORM STATE 4: REST ALL DEPARTMENT ACCOUNTS ---
  const [allDeptRole, setAllDeptRole] = useState<UserRole>('FEE_STAFF');
  const [allDeptName, setAllDeptName] = useState('');
  const [allDeptEmail, setAllDeptEmail] = useState('');
  const [allDeptPassword, setAllDeptPassword] = useState('staff123');
  const [allDeptPhone, setAllDeptPhone] = useState('+91 98721 00000');
  const [allDeptGender, setAllDeptGender] = useState<Gender>('MALE');
  const [allDeptOffice, setAllDeptOffice] = useState('Accounts & Finance');

  // --- FORM STATE 5: SECURITY GUARDS ---
  const [guardName, setGuardName] = useState('');
  const [guardEmail, setGuardEmail] = useState('');
  const [guardPassword, setGuardPassword] = useState('guard123');
  const [guardPhone, setGuardPhone] = useState('+91 99112 00000');
  const [guardGender, setGuardGender] = useState<Gender>('MALE');
  const [guardSector, setGuardSector] = useState('Campus Gate Patrol');
  const [guardShift, setGuardShift] = useState('Shift A (Day 06:00 - 14:00)');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(StorageService.getUsers());
    setAuditLogs(StorageService.getAuditLogs());
    setPolicy(StorageService.getPolicy());
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updatePolicy(policy, admin.name);
    setSuccessBanner('Institutional policies updated and applied across all campus portals.');
    setTimeout(() => setSuccessBanner(null), 4000);
    loadData();
  };

  // --- 1. SUBMIT: STUDENT ONLY ---
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stdName.trim() || !stdEmail.trim()) return;

    const computedBranch = computeStudentBranch(stdDept, stdSemester, stdBranch);
    const academicYear = getYearFromSemester(stdSemester);
    const isHosteller = stdType === 'HOSTELLER';
    const rollNo = `CTGI/2026/${stdDept}/${computedBranch === CTIEMT_FIRST_YEAR_BRANCH ? 'AS' : computedBranch}/${Math.floor(100 + Math.random() * 900)}`;

    const newStudent: User = {
      id: `user-${Date.now()}`,
      institutionUserId: rollNo,
      name: stdName,
      email: stdEmail,
      phone: stdPhone,
      role: isHosteller ? 'STUDENT_HOSTELLER' : 'STUDENT_DAYSCHOLAR',
      gender: stdGender,
      department: stdDept,
      branch: computedBranch,
      year: academicYear,
      semester: Number(stdSemester),
      section: stdSection,
      studentType: stdType,
      hostelCategory: isHosteller ? (stdGender === 'FEMALE' ? 'GIRLS_HOSTEL' : 'BOYS_HOSTEL') : undefined,
      hostelBlock: isHosteller ? stdHostelBlock : undefined,
      roomNumber: isHosteller ? stdRoom : undefined,
      wardenName: isHosteller ? (stdGender === 'FEMALE' ? 'Dr. Sunita Sharma' : 'Dr. Rajesh Verma') : undefined,
      guardianName: stdGuardianName,
      guardianPhone: stdGuardianPhone,
      campus: 'Shahpur Campus',
      password: stdPassword || 'student123',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newStudent);
    setModalType(null);
    setStdName('');
    setStdEmail('');
    setStdRoom('');
    setStdPassword('student123');
    loadData();
    setSuccessBanner(`Student [${newStudent.name}] created in ${stdDept} (Branch: ${computedBranch}, Year: ${academicYear}). Roll No: ${rollNo}`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // --- 2. SUBMIT: HOSTEL WARDEN & SECURITY ---
  const handleCreateWardenSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim() || !wsEmail.trim()) return;

    const isWarden = wsRole === 'HOSTEL_WARDEN';
    const staffId = `CTGI/STAFF/${isWarden ? 'WAR' : 'GATE'}/${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: wsName,
      email: wsEmail,
      phone: wsPhone,
      role: wsRole,
      gender: wsGender,
      department: isWarden ? 'Hostel Administration' : 'Security & Gates',
      hostelCategory: isWarden ? wsWing : undefined,
      hostelBlock: isWarden ? (wsWing === 'BOYS_HOSTEL' ? 'Tagore & Gandhi Blocks' : 'Sarojini & Kalpana Blocks') : undefined,
      gateLocation: !isWarden ? wsGate : undefined,
      shift: !isWarden ? wsShift : undefined,
      campus: 'Shahpur Campus',
      password: wsPassword || 'warden123',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    setModalType(null);
    setWsName('');
    setWsEmail('');
    setWsPassword('warden123');
    loadData();
    setSuccessBanner(`${wsRole.replace(/_/g, ' ')} [${newUser.name}] provisioned successfully. ID: ${staffId}`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // --- 3. SUBMIT: CLASS INCHARGE, FACULTY, HOD, HOI ---
  const handleCreateAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acadName.trim() || !acadEmail.trim()) return;

    const prefix = acadRole === 'HOI' ? 'HOI' : acadRole === 'HOD' ? 'HOD' : acadRole === 'CLASS_INCHARGE' ? 'INC' : 'FAC';
    const staffId = `CTGI/FAC/${prefix}/${Math.floor(100 + Math.random() * 900)}`;
    const assignedSubjects = acadSubjects.length > 0 ? acadSubjects : ['Core Engineering Fundamentals'];

    const newUser: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: acadName,
      email: acadEmail,
      phone: acadPhone,
      role: acadRole,
      gender: acadGender,
      department: acadDept,
      branch: acadDept === 'CTIEMT' ? acadBranch : undefined,
      semester: (acadRole === 'CLASS_INCHARGE' || acadTakesClass) ? Number(acadSemester) : undefined,
      section: (acadRole === 'CLASS_INCHARGE' || acadTakesClass) ? acadSection : undefined,
      isClassIncharge: acadRole === 'CLASS_INCHARGE',
      subjects: assignedSubjects,
      teachingClasses: acadTakesClass ? [`Sem ${acadSemester} - Sec ${acadSection}`] : undefined,
      campus: 'Shahpur Campus',
      password: acadPassword || 'faculty123',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    setModalType(null);
    setAcadName('');
    setAcadEmail('');
    setAcadPassword('faculty123');
    loadData();
    setSuccessBanner(`Academic ${acadRole.replace(/_/g, ' ')} [${newUser.name}] registered (${assignedSubjects.length} subjects taught). ID: ${staffId}`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // --- 4. SUBMIT: REST ALL DEPARTMENT ACCOUNTS ---
  const handleCreateAllDeptStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allDeptName.trim() || !allDeptEmail.trim()) return;

    const staffId = `CTGI/STAFF/${allDeptRole.slice(0, 4)}/${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: allDeptName,
      email: allDeptEmail,
      phone: allDeptPhone,
      role: allDeptRole,
      gender: allDeptGender,
      department: allDeptOffice,
      campus: 'Shahpur Campus',
      password: allDeptPassword || 'staff123',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    setModalType(null);
    setAllDeptName('');
    setAllDeptEmail('');
    setAllDeptPassword('staff123');
    loadData();
    setSuccessBanner(`${allDeptRole.replace(/_/g, ' ')} [${newUser.name}] registered for ${allDeptOffice}. ID: ${staffId}`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  // --- 5. SUBMIT: SECURITY GUARDS ---
  const handleCreateSecurityGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardName.trim() || !guardEmail.trim()) return;

    const staffId = `CTGI/SEC/GRD/${Math.floor(100 + Math.random() * 900)}`;

    const newUser: User = {
      id: `user-${Date.now()}`,
      institutionUserId: staffId,
      name: guardName,
      email: guardEmail,
      phone: guardPhone,
      role: 'SECURITY_GUARD',
      gender: guardGender,
      department: 'Campus Security Patrol',
      gateLocation: guardSector,
      shift: guardShift,
      campus: 'Shahpur Campus',
      password: guardPassword || 'guard123',
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    setModalType(null);
    setGuardName('');
    setGuardEmail('');
    loadData();
    setSuccessBanner(`Security Guard [${newUser.name}] registered for ${guardSector} (${guardShift}). ID: ${staffId}`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.institutionUserId.toLowerCase().includes(searchUser.toLowerCase()) ||
      u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchUser.toLowerCase())) ||
      (u.branch && u.branch.toLowerCase().includes(searchUser.toLowerCase()));

    if (selectedDeptFilter === 'ALL') return matchesSearch;
    return matchesSearch && u.department === selectedDeptFilter;
  });

  const availableHostels = stdGender === 'MALE' ? BOYS_HOSTEL_BLOCKS : GIRLS_HOSTEL_BLOCKS;
  const currentDeptTabInfo = CT_DEPARTMENTS.find(d => d.code === selectedDeptTab) || CT_DEPARTMENTS[0];
  const usersInCurrentDept = users.filter(u => u.department === selectedDeptTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-950 via-navy-950 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
            <Lock className="w-4 h-4" />
            <span>Master Administration Console • CT Group of Institutions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Institutional Admin Panel</h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Logged in as: <strong className="text-white">{admin.name}</strong> • Global Provisioning & 11 Departments
          </p>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* 3 Campuses Institutional Architecture Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-4 border border-blue-800/50 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2 flex-wrap">
              <span className="text-sm">CT Group Multi-Campus System (3 Campuses)</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Shahpur Campus Live
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Maqsudan & Ludhiana In Progress
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Engineered for all 3 campuses. Operations, 11 departments, hostel wings, and user provisioning are currently live for <strong>Shahpur Campus</strong>.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('campuses')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>View 3 Campuses Status</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 ACCOUNT CREATION ACTION CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-brand-600" />
            <h2 className="font-bold text-slate-900 text-sm">Account Creation Hub (5 Specialized Categories)</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Select a category to provision credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Button 1: Students Only */}
          <button
            onClick={() => setModalType('STUDENT')}
            className="p-3.5 bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-900 rounded-xl text-left transition-all active:scale-[0.98] group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-brand-950">1. Students Only</div>
            <p className="text-[10px] text-brand-700 mt-0.5 leading-snug">
              B.Tech CTIEMT (Applied Sciences 1st Yr / CSE / ME / CE) & all 11 depts.
            </p>
          </button>

          {/* Button 2: Hostel Warden & Security */}
          <button
            onClick={() => setModalType('WARDEN_SECURITY')}
            className="p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl text-left transition-all active:scale-[0.98] group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Building className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-purple-950">2. Warden & Security</div>
            <p className="text-[10px] text-purple-700 mt-0.5 leading-snug">
              Hostel Wardens (Boys/Girls wing curfews) & Gatekeeper Camera Scanners.
            </p>
          </button>

          {/* Button 3: Class Incharge, Faculty, HOD, HOI */}
          <button
            onClick={() => setModalType('ACADEMIC')}
            className="p-3.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 rounded-xl text-left transition-all active:scale-[0.98] group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-blue-950">3. Academic Leaders</div>
            <p className="text-[10px] text-blue-700 mt-0.5 leading-snug">
              Class Incharges (Sem/Sec), Teaching Faculty, HODs & Head of Institution (HOI).
            </p>
          </button>

          {/* Button 4: Rest All Department Accounts */}
          <button
            onClick={() => setModalType('ALL_DEPT_STAFF')}
            className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 rounded-xl text-left transition-all active:scale-[0.98] group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-emerald-950">4. Department Staff</div>
            <p className="text-[10px] text-emerald-700 mt-0.5 leading-snug">
              Fee Staff, DRCC, Placement Cell (TPO), Dean Welfare (DSW) & Directors.
            </p>
          </button>

          {/* Button 5: Security Guards */}
          <button
            onClick={() => setModalType('SECURITY_GUARD')}
            className="p-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-left transition-all active:scale-[0.98] group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-black text-xs text-amber-950">5. Security Guards</div>
            <p className="text-[10px] text-amber-700 mt-0.5 leading-snug">
              Campus Patrol Guards, Gate Sentries & Shift Incident Reporting Officers.
            </p>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Institutional Users ({users.length})
        </button>
        
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'departments' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>11 CT Departments & Sub-Depts</span>
        </button>

        <button
          onClick={() => setActiveTab('campuses')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'campuses' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-blue-400" />
          <span>3 CT Campuses (Shahpur Live • 2 In Progress)</span>
        </button>

        <button
          onClick={() => setActiveTab('policy')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'policy' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Institutional Curfew & Pass Rules
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS LIST WITH DEPARTMENT FILTER */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, roll no, department, branch..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Department Filter Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Departments</option>
                {CT_DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No users found. Use the creation buttons above to provision accounts.
              </div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{u.name}</span>
                        {u.gender && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            u.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.gender === 'FEMALE' ? '♀ F' : '♂ M'}
                          </span>
                        )}
                        {u.department && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200">
                            {u.department}
                          </span>
                        )}
                        {u.branch && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {u.branch} {u.year ? `(Yr ${u.year})` : ''}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {u.institutionUserId} • {u.email} • {u.phone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 11 CT DEPARTMENTS SECTIONS */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Department Code Pill Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CT_DEPARTMENTS.map((dept) => {
              const count = users.filter(u => u.department === dept.code).length;
              const isSelected = selectedDeptTab === dept.code;
              return (
                <button
                  key={dept.code}
                  onClick={() => setSelectedDeptTab(dept.code)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-brand-500'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm">{dept.code}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </div>
                  <div className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {dept.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Department Overview & Roster */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-900">{currentDeptTabInfo.code}</span>
                  <span className="text-xs bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full border border-brand-200">
                    Department {CT_DEPARTMENTS.findIndex(d => d.code === currentDeptTabInfo.code) + 1} of 11
                  </span>
                </div>
                <h3 className="font-bold text-slate-700 text-sm mt-0.5">{currentDeptTabInfo.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{currentDeptTabInfo.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStdDept(currentDeptTabInfo.code); setModalType('STUDENT'); }}
                  className="px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>+ Student to {currentDeptTabInfo.code}</span>
                </button>
                <button
                  onClick={() => { setAcadDept(currentDeptTabInfo.code); setModalType('ACADEMIC'); }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>+ Faculty to {currentDeptTabInfo.code}</span>
                </button>
              </div>
            </div>

            {/* Special CTIEMT B.Tech Applied Science Banner */}
            {currentDeptTabInfo.code === 'CTIEMT' && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-sm">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>CTIEMT B.Tech Academic Structure & 1st Year Rule</span>
                </div>
                <p className="leading-relaxed">
                  • <strong>1st Year B.Tech (Semesters 1 & 2):</strong> All engineering students have branch <strong>APPLIED SCIENCES</strong> (common foundation). Individual branches are not separated during the 1st year.<br/>
                  • <strong>2nd Year onwards (Semesters 3 to 8):</strong> Students branch out into specific disciplines: <strong>CSE</strong>, <strong>CSE-AIML</strong>, <strong>CE</strong> (Civil), <strong>ME</strong> (Mechanical).
                </p>
              </div>
            )}

            {/* Sub-departments / Branches Badge List */}
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Sub-Departments / Programs
              </span>
              <div className="flex flex-wrap gap-2">
                {currentDeptTabInfo.subDepartments.map(sub => (
                  <span
                    key={sub}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      sub === 'APPLIED SCIENCES'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {sub} {sub === 'APPLIED SCIENCES' ? '★ (1st Yr B.Tech)' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Department Roster */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Personnel & Enrolled Students in {currentDeptTabInfo.code} ({usersInCurrentDept.length})
              </span>

              {usersInCurrentDept.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No accounts provisioned yet for {currentDeptTabInfo.code}. Use the "+ Student" or "+ Faculty" buttons above to add users.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                  {usersInCurrentDept.map((u) => (
                    <div key={u.id} className="p-3 bg-white hover:bg-slate-50 flex items-center justify-between text-xs transition-colors">
                      <div>
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {u.institutionUserId} {u.branch ? `• ${u.branch}` : ''} {u.semester ? `• Sem ${u.semester}` : ''}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB: 3 CT CAMPUSES STATUS & ARCHITECTURE */}
      {activeTab === 'campuses' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base font-black text-slate-900">
                    CT Group Multi-Campus Deployment (3 Campuses Architecture)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Engineered to serve all 3 CT Group campuses. Currently active and operational for <strong>Shahpur Campus</strong>; Maqsudan and Ludhiana campuses are in progress.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  1 Live (Shahpur)
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  2 In Progress
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {CT_CAMPUSES.map((camp) => {
                const isActive = camp.status === 'ACTIVE';
                const campusUsersCount = users.filter(u => !u.campus || u.campus.includes(camp.name) || u.campus.includes('Shahpur')).length;

                return (
                  <div
                    key={camp.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-white to-emerald-50/40 border-emerald-300 shadow-md ring-1 ring-emerald-400/30'
                        : 'bg-gradient-to-b from-white to-slate-50 border-slate-200 opacity-90'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                            {camp.code}
                          </span>
                          <h3 className="text-base font-black text-slate-900 mt-0.5">
                            {camp.name}
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            {camp.city}, Punjab
                          </span>
                        </div>
                        <span
                          className={`text-[10.5px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                            isActive
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          {camp.statusLabel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {camp.description}
                      </p>

                      <div className="p-3 rounded-xl bg-white/80 border border-slate-200/80 text-[11px] space-y-1.5">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold">System Operational Status:</span>
                          <span className={`font-black ${isActive ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {isActive ? '100% Live & Available' : 'In Progress (Rollout Soon)'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="font-semibold">Departments Supported:</span>
                          <span className="font-bold text-slate-900">
                            {isActive ? '11 Institutes Online' : 'Mapping in Progress'}
                          </span>
                        </div>
                        {isActive && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="font-semibold">Active Enrolled Users:</span>
                            <span className="font-bold text-brand-700">
                              {campusUsersCount} Accounts
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                      <div className="font-semibold text-slate-700 mb-0.5">Location Address:</div>
                      <div className="text-[10.5px] text-slate-500 leading-snug">
                        {camp.address}
                      </div>
                      
                      {isActive ? (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setActiveTab('departments')}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs text-center transition-colors shadow-2xs"
                          >
                            Explore 11 Departments
                          </button>
                        </div>
                      ) : (
                        <div className="mt-3 py-2 bg-slate-100 text-slate-500 font-bold rounded-xl text-[11px] text-center border border-slate-200">
                          ⏳ Integration In Progress
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Multi-Campus Deployment Specs */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>Multi-Campus Architecture & Deployment Policy</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">1. Shahpur Campus (Live)</div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Full production gateway handling gate passes, day scholar cutoffs (2:00 PM), boys/girls curfew segregation, fee receipts, and 11 institutional departments.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                <div className="font-bold text-amber-950">2. Maqsudan Campus (Phase 2)</div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Academic department mapping, faculty onboarding, and local gate checkpoint camera hardware synchronization currently in progress.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80 space-y-1">
                <div className="font-bold text-purple-950">3. Ludhiana Campus (Phase 3)</div>
                <p className="text-[11px] text-purple-800 leading-snug">
                  CT University centralized directory integration, cross-campus single sign-on (SSO), and student mobility passes under active system preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: POLICIES TAB */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Curfew & Clearance Policies</h2>
              <p className="text-xs text-slate-500">Configure global timing limits, curfew thresholds, and dual approvals</p>
            </div>
          </div>

          <form onSubmit={handleSavePolicy} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Campus Name</label>
              <input
                type="text"
                value={policy.campusName}
                onChange={(e) => setPolicy({ ...policy, campusName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Day Scholar 2:00 PM Cutoff Time</label>
              <input
                type="text"
                value={policy.dayScholarPassDeadline}
                onChange={(e) => setPolicy({ ...policy, dayScholarPassDeadline: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Boys Hostel Evening Curfew</label>
              <input
                type="text"
                value={policy.hostellerCurfewTime}
                onChange={(e) => setPolicy({ ...policy, hostellerCurfewTime: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-blue-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Girls Hostel Evening Curfew</label>
              <input
                type="text"
                value={policy.girlsCurfewTime || '18:30'}
                onChange={(e) => setPolicy({ ...policy, girlsCurfewTime: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-purple-700 font-bold"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save Policy Rules</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: AUDIT TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-sm">Official System Audit Trail</h2>
            <span className="text-xs text-slate-400">{auditLogs.length} Events Logged</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{log.action}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                      {log.entityType}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-0.5 text-[11px]">{log.details}</p>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">By {log.actorName} ({log.actorRole})</div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5 ACCOUNT CREATION MODALS                                 */}
      {/* ========================================================== */}

      {/* MODAL 1: STUDENTS ONLY */}
      {modalType === 'STUDENT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-brand-600" />
                <h3 className="font-black text-slate-900 text-base">1. Create Student Account</h3>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              {/* Campus Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Shahpur Campus, Jalandhar</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Available Now
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Maqsudan & Ludhiana campuses in progress. Student will be enrolled in Shahpur Campus.
                </p>
              </div>

              {/* Department Selection (11 CT Depts) */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Enrolled Department (11 CT Institutes) *</label>
                <select
                  value={stdDept}
                  onChange={(e) => setStdDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                >
                  {CT_DEPARTMENTS.map(d => (
                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              {/* Semester & Year */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Semester (1 to 8) *</label>
                  <select
                    value={stdSemester}
                    onChange={(e) => setStdSemester(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s} (Year {getYearFromSemester(s)})</option>
                    ))}
                  </select>
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

              {/* CTIEMT B.Tech Branch Logic */}
              {stdDept === 'CTIEMT' ? (
                stdSemester <= 2 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950">
                    <span className="font-bold text-amber-900 block text-[11px]">
                      ★ 1st Year B.Tech Branch: APPLIED SCIENCES
                    </span>
                    <p className="text-[10.5px] mt-0.5 text-amber-800">
                      Per CT policy, all 1st year B.Tech students share the common Applied Sciences branch. Branch separation (CSE, ME, CE, etc.) starts from 2nd Year (Sem 3).
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">B.Tech Engineering Branch (2nd Year+) *</label>
                    <select
                      value={stdBranch}
                      onChange={(e) => setStdBranch(e.target.value)}
                      className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl font-bold text-purple-900"
                    >
                      {CTIEMT_BTECH_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )
              ) : null}

              {/* Student Name & Email */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Sharma"
                  value={stdName}
                  onChange={(e) => setStdName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@ctgroup.in"
                    value={stdEmail}
                    onChange={(e) => setStdEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Phone</label>
                  <input
                    type="tel"
                    value={stdPhone}
                    onChange={(e) => setStdPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* Password Option */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>Account Password *</span>
                  <span className="text-[10px] text-brand-600 font-medium">Customizable credentials</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={stdPassword}
                    onChange={(e) => setStdPassword(e.target.value)}
                    placeholder="Set student password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold text-slate-900"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Student will use their Roll No/Email and this password to sign in.</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <label className="block text-slate-700 font-bold mb-1 text-[10px] uppercase">
                  Gender (Hostel Wing Segregation) *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setStdGender('MALE'); setStdHostelBlock(BOYS_HOSTEL_BLOCKS[0]); }}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      stdGender === 'MALE' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ♂ Male (Boys Wing)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStdGender('FEMALE'); setStdHostelBlock(GIRLS_HOSTEL_BLOCKS[0]); }}
                    className={`py-2 rounded-lg font-bold border transition-all ${
                      stdGender === 'FEMALE' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    ♀ Female (Girls Wing)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Residential Status</label>
                <select
                  value={stdType}
                  onChange={(e) => setStdType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="HOSTELLER">Hostel Resident</option>
                  <option value="DAY_SCHOLAR">Day Scholar</option>
                </select>
              </div>

              {stdType === 'HOSTELLER' && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 text-[11px] font-semibold mb-1">Hostel Block</label>
                      <select
                        value={stdHostelBlock}
                        onChange={(e) => setStdHostelBlock(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-semibold"
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
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    Curfew: {stdGender === 'FEMALE' ? '6:30 PM (Girls Curfew)' : '7:30 PM (Boys Curfew)'} • Warden: {stdGender === 'FEMALE' ? 'Dr. Sunita Sharma' : 'Dr. Rajesh Verma'}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Guardian Name</label>
                  <input
                    type="text"
                    placeholder="Father / Guardian"
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
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Create Student Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: HOSTEL WARDEN & SECURITY */}
      {modalType === 'WARDEN_SECURITY' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-900 text-base">2. Hostel Warden & Gate Security</h3>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateWardenSecurity} className="space-y-3.5 text-xs">
              {/* Campus Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Shahpur Campus, Jalandhar</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Available Now
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Designation / Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setWsRole('HOSTEL_WARDEN')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      wsRole === 'HOSTEL_WARDEN' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Hostel Warden
                  </button>
                  <button
                    type="button"
                    onClick={() => setWsRole('GATEKEEPER')}
                    className={`py-2 rounded-xl font-bold border transition-all ${
                      wsRole === 'GATEKEEPER' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    Gatekeeper (QR Scanner)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Staff Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Verma / Ram Singh"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@ctgroup.in"
                  value={wsEmail}
                  onChange={(e) => setWsEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Password Option */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>Account Password *</span>
                  <span className="text-[10px] text-purple-600 font-medium">Customizable credentials</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={wsPassword}
                    onChange={(e) => setWsPassword(e.target.value)}
                    placeholder="Set staff password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={wsGender}
                    onChange={(e) => setWsGender(e.target.value as Gender)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={wsPhone}
                    onChange={(e) => setWsPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {wsRole === 'HOSTEL_WARDEN' ? (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Hostel Wing</label>
                  <select
                    value={wsWing}
                    onChange={(e) => setWsWing(e.target.value as any)}
                    className="w-full p-2.5 bg-purple-50 border border-purple-200 rounded-xl font-bold text-purple-900"
                  >
                    <option value="BOYS_HOSTEL">Boys Hostel Wing (Tagore / Gandhi / Bhagat Singh - 7:30 PM Curfew)</option>
                    <option value="GIRLS_HOSTEL">Girls Hostel Wing (Sarojini / Kalpana / Kasturba - 6:30 PM Curfew)</option>
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Gate Location</label>
                    <input
                      type="text"
                      value={wsGate}
                      onChange={(e) => setWsGate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Duty Shift</label>
                    <input
                      type="text"
                      value={wsShift}
                      onChange={(e) => setWsShift(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CLASS INCHARGE, FACULTY, HOD, HOI */}
      {modalType === 'ACADEMIC' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h3 className="font-black text-slate-900 text-base">3. Class Incharge, Faculty, HOD, HOI</h3>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateAcademic} className="space-y-3.5 text-xs">
              {/* Campus Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Shahpur Campus, Jalandhar</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Available Now
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Academic Role *</label>
                <select
                  value={acadRole}
                  onChange={(e) => setAcadRole(e.target.value as any)}
                  className="w-full p-2.5 bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-900"
                >
                  <option value="CLASS_INCHARGE">Teaching Faculty & Class Incharge</option>
                  <option value="FACULTY">Teaching Faculty</option>
                  <option value="HOD">Head of Department (HOD • Takes Classes & Teaches Subjects)</option>
                  <option value="HOI">Head of Institution (HOI • Takes Classes & Senior Professor)</option>
                </select>
                <p className="text-[10px] text-blue-700 mt-1">
                  ★ In CTGI, Class Incharges & Faculty are the same teaching body. Single teachers teach multiple subjects, and HOD & HOI also take classes.
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department (11 CT Institutes) *</label>
                <select
                  value={acadDept}
                  onChange={(e) => setAcadDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                >
                  {CT_DEPARTMENTS.map(d => (
                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Teacher / Professor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prof. Sunita Mehra"
                  value={acadName}
                  onChange={(e) => setAcadName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="faculty@ctgroup.in"
                    value={acadEmail}
                    onChange={(e) => setAcadEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={acadPhone}
                    onChange={(e) => setAcadPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Account Password Field */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>Portal Password *</span>
                  <span className="text-[10px] text-blue-600 font-medium">Customizable credentials</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={acadPassword}
                    onChange={(e) => setAcadPassword(e.target.value)}
                    placeholder="Set teacher password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Multiple Subjects Taught Section */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 text-xs">
                    Assigned Subjects (Single Teacher Teaches Multiple Subjects) *
                  </label>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    {acadSubjects.length} Subjects
                  </span>
                </div>
                
                {/* Active Subject Tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white rounded-xl border border-slate-200">
                  {acadSubjects.map((sub, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-lg text-[11px] font-semibold"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => setAcadSubjects(acadSubjects.filter((_, idx) => idx !== i))}
                        className="text-blue-500 hover:text-blue-800 font-bold ml-1 text-xs"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {acadSubjects.length === 0 && (
                    <span className="text-slate-400 text-[11px] italic">No subjects added yet. Select or type below.</span>
                  )}
                </div>

                {/* Add Custom Subject */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type subject name (e.g. Distributed Systems)..."
                    value={customSubjectText}
                    onChange={(e) => setCustomSubjectText(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-xl text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customSubjectText.trim() && !acadSubjects.includes(customSubjectText.trim())) {
                          setAcadSubjects([...acadSubjects, customSubjectText.trim()]);
                          setCustomSubjectText('');
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customSubjectText.trim() && !acadSubjects.includes(customSubjectText.trim())) {
                        setAcadSubjects([...acadSubjects, customSubjectText.trim()]);
                        setCustomSubjectText('');
                      }
                    }}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
                  >
                    + Add
                  </button>
                </div>

                {/* Quick Add Subject Pills */}
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Quick Add Common Subjects:</span>
                  <div className="flex flex-wrap gap-1">
                    {COMMON_TEACHING_SUBJECTS.slice(0, 8).map((cs) => {
                      const isAdded = acadSubjects.includes(cs);
                      return (
                        <button
                          key={cs}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              setAcadSubjects(acadSubjects.filter(s => s !== cs));
                            } else {
                              setAcadSubjects([...acadSubjects, cs]);
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium border transition-colors ${
                            isAdded
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {isAdded ? `✓ ${cs}` : `+ ${cs}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Class Teaching & Incharge Scope */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>Class Teaching & Incharge Scope</span>
                  <span className="text-[10.5px] text-emerald-700 font-bold">
                    {acadRole === 'CLASS_INCHARGE' ? 'Class Incharge + Teaching' : 'Active Teaching Class'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Teaching Semester</label>
                    <select
                      value={acadSemester}
                      onChange={(e) => setAcadSemester(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>Semester {s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Section</label>
                    <input
                      type="text"
                      value={acadSection}
                      onChange={(e) => setAcadSection(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-bold"
                      placeholder="e.g. A"
                    />
                  </div>
                </div>

                {acadDept === 'CTIEMT' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Assigned Branch (CTIEMT)</label>
                    <select
                      value={acadBranch}
                      onChange={(e) => setAcadBranch(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-xl font-semibold"
                    >
                      <option value="APPLIED SCIENCES">Applied Sciences (1st Year Common)</option>
                      {CTIEMT_BTECH_BRANCHES.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md">Create Academic Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: REST ALL DEPARTMENT ACCOUNTS */}
      {modalType === 'ALL_DEPT_STAFF' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">4. Rest All Department Accounts</h3>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateAllDeptStaff} className="space-y-3.5 text-xs">
              {/* Campus Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Shahpur Campus, Jalandhar</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Available Now
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Institutional Category / Role *</label>
                <select
                  value={allDeptRole}
                  onChange={(e) => setAllDeptRole(e.target.value as any)}
                  className="w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl font-bold text-emerald-900"
                >
                  <option value="FEE_STAFF">Fee Collection & Accounts Staff</option>
                  <option value="DRCC_STAFF">DRCC Student Welfare & Verification</option>
                  <option value="DEAN_STUDENT_WELFARE">Dean Student Welfare (DSW)</option>
                  <option value="PLACEMENT_CELL">Training & Placement Cell (TPO)</option>
                  <option value="CAMPUS_DIRECTOR">Campus Executive Director</option>
                  <option value="OTHER_DIRECTORS">Other Directors</option>
                  <option value="ADMINISTRATOR">System Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department / Branch / Office *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Accounts & Finance / TPO Cell / Directorate"
                  value={allDeptOffice}
                  onChange={(e) => setAllDeptOffice(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Officer Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anita Kapoor / Er. Rohit Nanda"
                  value={allDeptName}
                  onChange={(e) => setAllDeptName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="office@ctgroup.in"
                    value={allDeptEmail}
                    onChange={(e) => setAllDeptEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={allDeptPhone}
                    onChange={(e) => setAllDeptPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Password Option */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>Portal Password *</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Customizable credentials</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={allDeptPassword}
                    onChange={(e) => setAllDeptPassword(e.target.value)}
                    placeholder="Set department staff password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Create Department Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: SECURITY GUARDS */}
      {modalType === 'SECURITY_GUARD' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <h3 className="font-black text-slate-900 text-base">5. Campus Security Guards</h3>
              </div>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleCreateSecurityGuard} className="space-y-3.5 text-xs">
              {/* Campus Scope */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campus</label>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Shahpur Campus, Jalandhar</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
                    Available Now
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Guard Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Rathore"
                  value={guardName}
                  onChange={(e) => setGuardName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional / Sentry Email *</label>
                <input
                  type="email"
                  required
                  placeholder="security.guard@ctgroup.in"
                  value={guardEmail}
                  onChange={(e) => setGuardEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              {/* Password Option */}
              <div>
                <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                  <span>Guard Portal Password *</span>
                  <span className="text-[10px] text-amber-600 font-medium">Customizable credentials</span>
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={guardPassword}
                    onChange={(e) => setGuardPassword(e.target.value)}
                    placeholder="Set guard password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                  <select
                    value={guardGender}
                    onChange={(e) => setGuardGender(e.target.value as Gender)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    value={guardPhone}
                    onChange={(e) => setGuardPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Patrol Sector</label>
                  <select
                    value={guardSector}
                    onChange={(e) => setGuardSector(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Campus Gate Patrol">Campus Gate Patrol</option>
                    <option value="Boys Hostel Perimeter">Boys Hostel Perimeter</option>
                    <option value="Girls Hostel Perimeter">Girls Hostel Perimeter</option>
                    <option value="Academic Blocks Patrol">Academic Blocks Patrol</option>
                    <option value="Incident Control Desk">Incident Control Desk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Duty Shift</label>
                  <select
                    value={guardShift}
                    onChange={(e) => setGuardShift(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  >
                    <option value="Shift A (Day 06:00 - 14:00)">Shift A (Day 06:00 - 14:00)</option>
                    <option value="Shift B (Evening 14:00 - 22:00)">Shift B (Evening 14:00 - 22:00)</option>
                    <option value="Shift C (Night 22:00 - 06:00)">Shift C (Night 22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setModalType(null)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md">Create Security Guard</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
