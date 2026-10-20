// CampusConnect CTGI — Persistent Storage & Fictional Seed Engine
import { 
  User, 
  GatePassRequest, 
  GateEvent, 
  SecurityIncident, 
  FeeRecord, 
  Notice, 
  HostelComplaint, 
  NotificationItem, 
  AuditLog, 
  InstitutionalPolicy,
  SubjectAttendance,
  TimetableEntry
} from '../types';
import { DEFAULT_POLICY } from '../config/institution';

const STORAGE_KEYS = {
  USERS: 'campusconnect_users',
  GATE_PASSES: 'campusconnect_passes',
  GATE_EVENTS: 'campusconnect_events',
  INCIDENTS: 'campusconnect_incidents',
  FEES: 'campusconnect_fees',
  NOTICES: 'campusconnect_notices',
  COMPLAINTS: 'campusconnect_complaints',
  NOTIFICATIONS: 'campusconnect_notifications',
  AUDIT_LOGS: 'campusconnect_audit',
  POLICY: 'campusconnect_policy',
  INITIALIZED: 'campusconnect_seed_v2'
};

// Realistic fictional accounts for all 14 roles
export const SEED_USERS: User[] = [
  {
    id: 'user-std-hosteller',
    institutionUserId: 'CTGI/2023/CSE/101',
    name: 'Suman Sharma',
    email: 'suman.sharma@ctgroup.in',
    phone: '+91 98765 43210',
    role: 'STUDENT_HOSTELLER',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    studentType: 'HOSTELLER',
    hostelBlock: 'Tagore Block (Boys)',
    roomNumber: 'B-204',
    wardenName: 'Dr. Rajesh Verma',
    classInchargeName: 'Prof. Sunita Mehra',
    guardianName: 'Ramesh Sharma',
    guardianPhone: '+91 98111 22334',
    active: true,
    createdAt: '2023-08-01T09:00:00Z'
  },
  {
    id: 'user-std-dayscholar',
    institutionUserId: 'CTGI/2023/ECE/205',
    name: 'Priya Patel',
    email: 'priya.patel@ctgroup.in',
    phone: '+91 98765 67890',
    role: 'STUDENT_DAYSCHOLAR',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    department: 'Electronics & Communication',
    semester: 4,
    section: 'B',
    studentType: 'DAY_SCHOLAR',
    classInchargeName: 'Prof. Anil Grover',
    guardianName: 'Mahesh Patel',
    guardianPhone: '+91 98222 33445',
    active: true,
    createdAt: '2023-08-01T09:00:00Z'
  },
  {
    id: 'user-gatekeeper',
    institutionUserId: 'CTGI/STAFF/SEC/012',
    name: 'Ram Singh',
    email: 'ram.singh@ctgroup.in',
    phone: '+91 99887 76655',
    role: 'GATEKEEPER',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Security & Campus Gates',
    active: true,
    createdAt: '2022-01-15T09:00:00Z'
  },
  {
    id: 'user-guard',
    institutionUserId: 'CTGI/STAFF/SEC/018',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@ctgroup.in',
    phone: '+91 99112 23344',
    role: 'SECURITY_GUARD',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    department: 'Campus Security Patrol',
    active: true,
    createdAt: '2022-03-20T09:00:00Z'
  },
  {
    id: 'user-warden',
    institutionUserId: 'CTGI/FAC/WAR/004',
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@ctgroup.in',
    phone: '+91 98123 45678',
    role: 'HOSTEL_WARDEN',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    department: 'Hostel Administration',
    active: true,
    createdAt: '2021-07-01T09:00:00Z'
  },
  {
    id: 'user-classincharge',
    institutionUserId: 'CTGI/FAC/CSE/023',
    name: 'Prof. Sunita Mehra',
    email: 'sunita.mehra@ctgroup.in',
    phone: '+91 98456 78901',
    role: 'CLASS_INCHARGE',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    department: 'Computer Science & Engineering',
    active: true,
    createdAt: '2020-08-10T09:00:00Z'
  },
  {
    id: 'user-hod',
    institutionUserId: 'CTGI/FAC/CSE/001',
    name: 'Dr. Amit Bansal',
    email: 'amit.bansal@ctgroup.in',
    phone: '+91 98140 12345',
    role: 'HOD',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    department: 'Computer Science & Engineering',
    active: true,
    createdAt: '2019-06-01T09:00:00Z'
  },
  {
    id: 'user-hoi',
    institutionUserId: 'CTGI/ADMIN/HOI/001',
    name: 'Dr. Harpreet Singh',
    email: 'harpreet.singh@ctgroup.in',
    phone: '+91 98150 99887',
    role: 'HOI',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    department: 'Institute Administration',
    active: true,
    createdAt: '2018-05-15T09:00:00Z'
  },
  {
    id: 'user-fee-staff',
    institutionUserId: 'CTGI/STAFF/FEE/003',
    name: 'Anita Kapoor',
    email: 'anita.kapoor@ctgroup.in',
    phone: '+91 98721 34567',
    role: 'FEE_STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    department: 'Accounts & Finance',
    active: true,
    createdAt: '2021-02-01T09:00:00Z'
  },
  {
    id: 'user-drcc',
    institutionUserId: 'CTGI/STAFF/DRCC/002',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@ctgroup.in',
    phone: '+91 98789 01234',
    role: 'DRCC_STAFF',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    department: 'DRCC Student Welfare & Verification',
    active: true,
    createdAt: '2022-09-01T09:00:00Z'
  },
  {
    id: 'user-dsw',
    institutionUserId: 'CTGI/ADMIN/DSW/001',
    name: 'Dr. K. K. Sharma',
    email: 'dsw@ctgroup.in',
    phone: '+91 98141 55667',
    role: 'DEAN_STUDENT_WELFARE',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    department: 'Dean Student Welfare Office',
    active: true,
    createdAt: '2019-01-10T09:00:00Z'
  },
  {
    id: 'user-director',
    institutionUserId: 'CTGI/ADMIN/DIR/001',
    name: 'Dr. Gurpreet Singh',
    email: 'campus.director@ctgroup.in',
    phone: '+91 98142 88990',
    role: 'CAMPUS_DIRECTOR',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    department: 'Office of Campus Director',
    active: true,
    createdAt: '2017-04-01T09:00:00Z'
  },
  {
    id: 'user-other-director',
    institutionUserId: 'CTGI/ADMIN/DIR/002',
    name: 'Dr. Manjit Kaur',
    email: 'director.academics@ctgroup.in',
    phone: '+91 98143 77889',
    role: 'OTHER_DIRECTORS',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    department: 'Directorate of Academic Affairs',
    active: true,
    createdAt: '2019-11-15T09:00:00Z'
  },
  {
    id: 'user-placement',
    institutionUserId: 'CTGI/STAFF/TPO/001',
    name: 'Er. Rohit Nanda',
    email: 'tpo@ctgroup.in',
    phone: '+91 98760 11223',
    role: 'PLACEMENT_CELL',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    department: 'Corporate Relations & Placement Cell',
    active: true,
    createdAt: '2020-03-01T09:00:00Z'
  },
  {
    id: 'user-admin',
    institutionUserId: 'CTGI/IT/ADMIN/001',
    name: 'System Administrator',
    email: 'admin@ctgroup.in',
    phone: '+91 98144 00001',
    role: 'ADMINISTRATOR',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Campus IT & Systems',
    active: true,
    createdAt: '2016-01-01T09:00:00Z'
  }
];

// Seed Gate Pass Requests
export const SEED_GATE_PASSES: GatePassRequest[] = [
  {
    id: 'gp-pass-001',
    passNumber: 'GP-2026-1049',
    studentId: 'user-std-hosteller',
    studentName: 'Suman Sharma',
    studentNumber: 'CTGI/2023/CSE/101',
    studentType: 'HOSTELLER',
    department: 'Computer Science & Engineering',
    semester: 6,
    phone: '+91 98765 43210',
    guardianPhone: '+91 98111 22334',
    hostelInfo: 'Tagore Block B-204',
    requestType: 'GATE_PASS_OUTING',
    purpose: 'Library project research & book purchase in city market',
    destination: 'Model Town Market, Jalandhar',
    departureTime: new Date(Date.now() - 3600000).toISOString(),
    expectedReturnTime: new Date(Date.now() + 14400000).toISOString(),
    isLateSubmission: false,
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    academicApproverRole: 'CLASS_INCHARGE',
    approvalSteps: [
      {
        id: 'step-1',
        role: 'CLASS_INCHARGE',
        approverName: 'Prof. Sunita Mehra',
        approverId: 'user-classincharge',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 5400000).toISOString(),
        remarks: 'Approved for research. Ensure return before curfew.'
      },
      {
        id: 'step-2',
        role: 'HOSTEL_WARDEN',
        approverName: 'Dr. Rajesh Verma',
        approverId: 'user-warden',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 3900000).toISOString(),
        remarks: 'Approved. Strict 7:30 PM curfew applies.'
      }
    ],
    tokenHash: 'ctgi-token-998822-verified-secure',
    validFrom: new Date(Date.now() - 3600000).toISOString(),
    validUntil: new Date(Date.now() + 14400000).toISOString()
  },
  {
    id: 'gp-pass-002',
    passNumber: 'GP-2026-1052',
    studentId: 'user-std-hosteller',
    studentName: 'Suman Sharma',
    studentNumber: 'CTGI/2023/CSE/101',
    studentType: 'HOSTELLER',
    department: 'Computer Science & Engineering',
    semester: 6,
    phone: '+91 98765 43210',
    guardianPhone: '+91 98111 22334',
    hostelInfo: 'Tagore Block B-204',
    requestType: 'EXTENDED_LEAVE',
    purpose: 'Sibling wedding ceremony at hometown',
    destination: 'Amritsar, Punjab',
    departureTime: new Date(Date.now() + 86400000).toISOString(),
    expectedReturnTime: new Date(Date.now() + 86400000 * 3).toISOString(),
    isLateSubmission: false,
    status: 'PENDING_BOTH',
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    academicApproverRole: 'CLASS_INCHARGE',
    approvalSteps: [
      {
        id: 'step-201',
        role: 'CLASS_INCHARGE',
        approverName: 'Prof. Sunita Mehra',
        status: 'PENDING'
      },
      {
        id: 'step-202',
        role: 'HOSTEL_WARDEN',
        approverName: 'Dr. Rajesh Verma',
        status: 'PENDING'
      }
    ]
  },
  {
    id: 'gp-pass-003',
    passNumber: 'DS-2026-0412',
    studentId: 'user-std-dayscholar',
    studentName: 'Priya Patel',
    studentNumber: 'CTGI/2023/ECE/205',
    studentType: 'DAY_SCHOLAR',
    department: 'Electronics & Communication',
    semester: 4,
    phone: '+91 98765 67890',
    requestType: 'DAY_SCHOLAR_PASS',
    purpose: 'Urgent family medical visit',
    destination: 'Civil Hospital, Jalandhar',
    departureTime: new Date(Date.now() + 7200000).toISOString(),
    expectedReturnTime: new Date(Date.now() + 18000000).toISOString(),
    isLateSubmission: false,
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 10800000).toISOString(),
    academicApproverRole: 'CLASS_INCHARGE',
    approvalSteps: [
      {
        id: 'step-301',
        role: 'CLASS_INCHARGE',
        approverName: 'Prof. Sunita Mehra',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 9000000).toISOString(),
        remarks: 'Medical emergency verified with guardian.'
      }
    ],
    tokenHash: 'ctgi-token-774411-verified-ds',
    validFrom: new Date(Date.now() - 10800000).toISOString(),
    validUntil: new Date(Date.now() + 18000000).toISOString()
  }
];

// Seed Subject Attendance
export const SEED_ATTENDANCE: SubjectAttendance[] = [
  {
    subjectCode: 'CS601',
    subjectName: 'Distributed Cloud Computing',
    facultyName: 'Dr. Amit Bansal',
    classesConducted: 44,
    classesAttended: 38,
    attendancePercentage: 86.4
  },
  {
    subjectCode: 'CS602',
    subjectName: 'Machine Learning & AI',
    facultyName: 'Prof. Sunita Mehra',
    classesConducted: 48,
    classesAttended: 33,
    attendancePercentage: 68.8 // Below 75% threshold warning!
  },
  {
    subjectCode: 'CS603',
    subjectName: 'Compiler Design & Automation',
    facultyName: 'Prof. R. K. Singla',
    classesConducted: 40,
    classesAttended: 37,
    attendancePercentage: 92.5
  },
  {
    subjectCode: 'CS604',
    subjectName: 'Cybersecurity & Cryptography',
    facultyName: 'Dr. Neeraj Kumar',
    classesConducted: 42,
    classesAttended: 35,
    attendancePercentage: 83.3
  },
  {
    subjectCode: 'CS605',
    subjectName: 'Full Stack Web Lab',
    facultyName: 'Er. Jaspreet Singh',
    classesConducted: 20,
    classesAttended: 19,
    attendancePercentage: 95.0
  }
];

// Seed Timetable
export const SEED_TIMETABLE: TimetableEntry[] = [
  { day: 'MONDAY', timeSlot: '09:30 AM - 10:30 AM', subjectCode: 'CS601', subjectName: 'Distributed Cloud Computing', facultyName: 'Dr. Amit Bansal', room: 'LH-302' },
  { day: 'MONDAY', timeSlot: '10:30 AM - 11:30 AM', subjectCode: 'CS602', subjectName: 'Machine Learning & AI', facultyName: 'Prof. Sunita Mehra', room: 'LH-302' },
  { day: 'MONDAY', timeSlot: '11:45 AM - 01:15 PM', subjectCode: 'CS605', subjectName: 'Full Stack Web Lab', facultyName: 'Er. Jaspreet Singh', room: 'Lab 4' },
  { day: 'MONDAY', timeSlot: '02:00 PM - 03:00 PM', subjectCode: 'CS603', subjectName: 'Compiler Design', facultyName: 'Prof. R. K. Singla', room: 'LH-304' },
  { day: 'TUESDAY', timeSlot: '09:30 AM - 10:30 AM', subjectCode: 'CS604', subjectName: 'Cybersecurity', facultyName: 'Dr. Neeraj Kumar', room: 'LH-302' },
  { day: 'TUESDAY', timeSlot: '10:30 AM - 11:30 AM', subjectCode: 'CS601', subjectName: 'Distributed Cloud Computing', facultyName: 'Dr. Amit Bansal', room: 'LH-302' },
  { day: 'WEDNESDAY', timeSlot: '09:30 AM - 11:30 AM', subjectCode: 'CS602', subjectName: 'Machine Learning & AI', facultyName: 'Prof. Sunita Mehra', room: 'LH-302' },
  { day: 'THURSDAY', timeSlot: '10:30 AM - 11:30 AM', subjectCode: 'CS603', subjectName: 'Compiler Design', facultyName: 'Prof. R. K. Singla', room: 'LH-304' },
  { day: 'FRIDAY', timeSlot: '09:30 AM - 10:30 AM', subjectCode: 'CS604', subjectName: 'Cybersecurity', facultyName: 'Dr. Neeraj Kumar', room: 'LH-302' }
];

// Seed Notices
export const SEED_NOTICES: Notice[] = [
  {
    id: 'not-01',
    title: 'Mid-Semester Examination Schedule — Even Semester 2026',
    category: 'EXAMINATION',
    content: 'Mid-semester tests commence on March 15th, 2026. Hall tickets will be available for download from the portal. Clear all outstanding dues prior to admit card generation.',
    date: '2026-03-01T10:00:00Z',
    publisher: 'Controller of Examinations',
    publisherRole: 'Academic Section',
    important: true,
    targetAudience: ['ALL', 'STUDENT']
  },
  {
    id: 'not-02',
    title: 'Hostel Curfew & Gate Pass Regulations Notice',
    category: 'HOSTEL',
    content: 'All resident hostellers are reminded that evening curfew is strictly 7:30 PM. Outing gate passes must be validated via QR scan at Main Gate #1 and Gate #2 by security.',
    date: '2026-02-24T14:30:00Z',
    publisher: 'Dr. Rajesh Verma',
    publisherRole: 'Chief Warden',
    important: true,
    targetAudience: ['HOSTELLER']
  },
  {
    id: 'not-03',
    title: 'Campus Recruitment Drive — Infosys & Wipro Limited',
    category: 'PLACEMENT',
    content: 'Eligibility: B.Tech CSE/IT/ECE with 65% aggregate and no active backlogs. Pre-placement talk scheduled on March 10th at 10:00 AM in the Main Auditorium.',
    date: '2026-02-28T11:00:00Z',
    publisher: 'Er. Rohit Nanda',
    publisherRole: 'Head, Placement Cell',
    important: false,
    targetAudience: ['STUDENT']
  }
];

// Seed Fee Records
export const SEED_FEES: FeeRecord[] = [
  {
    id: 'fee-001',
    studentId: 'user-std-hosteller',
    studentName: 'Suman Sharma',
    studentNumber: 'CTGI/2023/CSE/101',
    department: 'Computer Science & Engineering',
    academicYear: '2025-26',
    totalAssessed: 135000,
    amountPaid: 105000,
    outstandingBalance: 30000,
    tuitionFee: 75000,
    hostelFee: 35000,
    messFee: 20000,
    examFee: 5000,
    status: 'PARTIAL',
    transactions: [
      {
        id: 'tx-101',
        transactionRef: 'CTGI-TX-99823',
        date: '2025-08-14T10:30:00Z',
        amount: 60000,
        category: 'TUITION',
        paymentMode: 'ONLINE',
        status: 'RECONCILED',
        recordedBy: 'Anita Kapoor (Accounts)',
        receiptNumber: 'RCP-2025-0812'
      },
      {
        id: 'tx-102',
        transactionRef: 'CTGI-TX-10452',
        date: '2025-11-20T14:15:00Z',
        amount: 45000,
        category: 'HOSTEL',
        paymentMode: 'UPI',
        status: 'RECONCILED',
        recordedBy: 'Anita Kapoor (Accounts)',
        receiptNumber: 'RCP-2025-1143'
      }
    ]
  },
  {
    id: 'fee-002',
    studentId: 'user-std-dayscholar',
    studentName: 'Priya Patel',
    studentNumber: 'CTGI/2023/ECE/205',
    department: 'Electronics & Communication',
    academicYear: '2025-26',
    totalAssessed: 85000,
    amountPaid: 85000,
    outstandingBalance: 0,
    tuitionFee: 65000,
    examFee: 5000,
    transportFee: 15000,
    status: 'PAID',
    transactions: [
      {
        id: 'tx-201',
        transactionRef: 'CTGI-TX-08761',
        date: '2025-08-10T11:00:00Z',
        amount: 85000,
        category: 'TUITION',
        paymentMode: 'DEMAND_DRAFT',
        status: 'RECONCILED',
        recordedBy: 'Anita Kapoor (Accounts)',
        receiptNumber: 'RCP-2025-0754'
      }
    ]
  }
];

// Seed Hostel Complaints
export const SEED_COMPLAINTS: HostelComplaint[] = [
  {
    id: 'cmp-01',
    complaintRef: 'CMP-2026-041',
    studentId: 'user-std-hosteller',
    studentName: 'Suman Sharma',
    roomInfo: 'Tagore Block B-204',
    category: 'WIFI',
    description: 'High packet loss and intermittent disconnects on 2nd floor access point.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    resolutionRemarks: 'IT team dispatched to replace floor switch.'
  },
  {
    id: 'cmp-02',
    complaintRef: 'CMP-2026-038',
    studentId: 'user-std-hosteller',
    studentName: 'Suman Sharma',
    roomInfo: 'Tagore Block B-204',
    category: 'WATER',
    description: 'Hot water geyser not heating properly in common bathroom.',
    priority: 'HIGH',
    status: 'RESOLVED',
    submittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    resolvedAt: new Date(Date.now() - 86400000).toISOString(),
    resolutionRemarks: 'Thermostat replaced by campus maintenance team.'
  }
];

// Seed Security Incidents
export const SEED_INCIDENTS: SecurityIncident[] = [
  {
    id: 'inc-01',
    incidentRef: 'INC-2026-081',
    reporterId: 'user-guard',
    reporterName: 'Vikram Rathore',
    reporterRole: 'SECURITY_GUARD',
    category: 'OVERDUE_CURFEW',
    location: 'Gate #1 (Main Entrance)',
    description: 'Student entered 25 minutes after approved curfew time. Reason recorded: Bus breakdown near bus stand.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    status: 'REPORTED',
    involvedStudentId: 'user-std-hosteller',
    involvedStudentName: 'Suman Sharma'
  }
];

// Seed Audit Logs
export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actorId: 'user-warden',
    actorName: 'Dr. Rajesh Verma',
    actorRole: 'HOSTEL_WARDEN',
    action: 'APPROVE_GATE_PASS',
    entityType: 'GATE_PASS',
    entityId: 'gp-pass-001',
    details: 'Approved outing gate pass GP-2026-1049 for student Suman Sharma'
  },
  {
    id: 'aud-02',
    timestamp: new Date(Date.now() - 5400000).toISOString(),
    actorId: 'user-classincharge',
    actorName: 'Prof. Sunita Mehra',
    actorRole: 'CLASS_INCHARGE',
    action: 'APPROVE_GATE_PASS',
    entityType: 'GATE_PASS',
    entityId: 'gp-pass-001',
    details: 'Academic clearance granted for library project outing'
  }
];

// Initializer & Storage helper
export class StorageService {
  private static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`Storage get error for key ${key}:`, e);
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for key ${key}:`, e);
    }
  }

  public static initialize(): void {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.resetToDefaults();
    }
  }

  public static resetToDefaults(): void {
    this.set(STORAGE_KEYS.USERS, SEED_USERS);
    this.set(STORAGE_KEYS.GATE_PASSES, SEED_GATE_PASSES);
    this.set(STORAGE_KEYS.GATE_EVENTS, []);
    this.set(STORAGE_KEYS.INCIDENTS, SEED_INCIDENTS);
    this.set(STORAGE_KEYS.FEES, SEED_FEES);
    this.set(STORAGE_KEYS.NOTICES, SEED_NOTICES);
    this.set(STORAGE_KEYS.COMPLAINTS, SEED_COMPLAINTS);
    this.set(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    this.set(STORAGE_KEYS.POLICY, DEFAULT_POLICY);
    this.set(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-01',
        userId: 'user-std-hosteller',
        title: 'Gate Pass Approved',
        message: 'Your gate pass GP-2026-1049 has been approved by Class Incharge and Warden.',
        type: 'PASS_APPROVED',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ]);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // Users
  public static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  public static getUser(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  public static updateUser(user: User): void {
    const users = this.getUsers().map(u => u.id === user.id ? user : u);
    this.set(STORAGE_KEYS.USERS, users);
  }

  public static createUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.set(STORAGE_KEYS.USERS, users);
    this.logAudit(user.id, user.name, user.role, 'CREATE_USER', 'USER_ACCOUNT', user.id, `Created account ${user.institutionUserId}`);
  }

  // Gate Passes
  public static getGatePasses(): GatePassRequest[] {
    return this.get<GatePassRequest[]>(STORAGE_KEYS.GATE_PASSES, SEED_GATE_PASSES);
  }

  public static getGatePass(id: string): GatePassRequest | undefined {
    return this.getGatePasses().find(p => p.id === id);
  }

  public static getGatePassByNumber(passNumber: string): GatePassRequest | undefined {
    return this.getGatePasses().find(p => p.passNumber.toUpperCase() === passNumber.trim().toUpperCase());
  }

  public static saveGatePass(pass: GatePassRequest): void {
    const passes = this.getGatePasses();
    const index = passes.findIndex(p => p.id === pass.id);
    if (index >= 0) {
      passes[index] = pass;
    } else {
      passes.unshift(pass);
    }
    this.set(STORAGE_KEYS.GATE_PASSES, passes);
  }

  // Gate Events
  public static getGateEvents(): GateEvent[] {
    return this.get<GateEvent[]>(STORAGE_KEYS.GATE_EVENTS, []);
  }

  public static recordGateEvent(event: GateEvent): void {
    const events = this.getGateEvents();
    events.unshift(event);
    this.set(STORAGE_KEYS.GATE_EVENTS, events);
    this.logAudit(
      event.operatorId,
      event.operatorName,
      'GATEKEEPER',
      event.eventType === 'EXIT' ? 'GATE_EXIT' : 'GATE_RETURN',
      'GATE_PASS',
      event.passId,
      `${event.eventType} recorded for ${event.studentName} at ${event.gateNumber}`
    );
  }

  // Security Incidents
  public static getIncidents(): SecurityIncident[] {
    return this.get<SecurityIncident[]>(STORAGE_KEYS.INCIDENTS, SEED_INCIDENTS);
  }

  public static recordIncident(incident: SecurityIncident): void {
    const incidents = this.getIncidents();
    incidents.unshift(incident);
    this.set(STORAGE_KEYS.INCIDENTS, incidents);
    this.logAudit(
      incident.reporterId,
      incident.reporterName,
      incident.reporterRole,
      'REPORT_INCIDENT',
      'INCIDENT',
      incident.id,
      `Reported incident [${incident.category}] at ${incident.location}`
    );
  }

  // Fee Records
  public static getFees(): FeeRecord[] {
    return this.get<FeeRecord[]>(STORAGE_KEYS.FEES, SEED_FEES);
  }

  public static getStudentFee(studentId: string): FeeRecord | undefined {
    return this.getFees().find(f => f.studentId === studentId);
  }

  public static recordPayment(studentId: string, amount: number, category: any, paymentMode: any, staffName: string): FeeRecord | undefined {
    const fees = this.getFees();
    const record = fees.find(f => f.studentId === studentId);
    if (!record) return undefined;

    const txRef = `CTGI-TX-${Math.floor(10000 + Math.random() * 90000)}`;
    const rcpNum = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    record.amountPaid += amount;
    record.outstandingBalance = Math.max(0, record.totalAssessed - record.amountPaid);
    record.status = record.outstandingBalance === 0 ? 'PAID' : 'PARTIAL';
    
    record.transactions.unshift({
      id: `tx-${Date.now()}`,
      transactionRef: txRef,
      date: new Date().toISOString(),
      amount,
      category,
      paymentMode,
      status: 'RECORDED',
      recordedBy: staffName,
      receiptNumber: rcpNum
    });

    this.set(STORAGE_KEYS.FEES, fees);
    this.logAudit('staff-fee', staffName, 'FEE_STAFF', 'RECORD_PAYMENT', 'FEE_PAYMENT', record.id, `Recorded ₹${amount} for ${record.studentName} (Ref: ${txRef})`);
    return record;
  }

  public static reconcilePayment(studentId: string, txId: string, staffName: string): void {
    const fees = this.getFees();
    const record = fees.find(f => f.studentId === studentId);
    if (!record) return;
    const tx = record.transactions.find(t => t.id === txId);
    if (tx) {
      tx.status = 'RECONCILED';
      this.set(STORAGE_KEYS.FEES, fees);
      this.logAudit('staff-fee', staffName, 'FEE_STAFF', 'RECONCILE_PAYMENT', 'FEE_PAYMENT', record.id, `Reconciled transaction ${tx.transactionRef}`);
    }
  }

  // Notices
  public static getNotices(): Notice[] {
    return this.get<Notice[]>(STORAGE_KEYS.NOTICES, SEED_NOTICES);
  }

  public static publishNotice(notice: Notice): void {
    const notices = this.getNotices();
    notices.unshift(notice);
    this.set(STORAGE_KEYS.NOTICES, notices);
    this.logAudit(notice.publisher, notice.publisher, notice.publisherRole, 'PUBLISH_NOTICE', 'POLICY', notice.id, `Published notice: ${notice.title}`);
  }

  // Complaints
  public static getComplaints(): HostelComplaint[] {
    return this.get<HostelComplaint[]>(STORAGE_KEYS.COMPLAINTS, SEED_COMPLAINTS);
  }

  public static submitComplaint(complaint: HostelComplaint): void {
    const complaints = this.getComplaints();
    complaints.unshift(complaint);
    this.set(STORAGE_KEYS.COMPLAINTS, complaints);
  }

  public static updateComplaintStatus(id: string, status: any, remarks?: string): void {
    const complaints = this.getComplaints();
    const cmp = complaints.find(c => c.id === id);
    if (cmp) {
      cmp.status = status;
      if (remarks) cmp.resolutionRemarks = remarks;
      if (status === 'RESOLVED' || status === 'CLOSED') {
        cmp.resolvedAt = new Date().toISOString();
      }
      this.set(STORAGE_KEYS.COMPLAINTS, complaints);
    }
  }

  // Notifications
  public static getNotifications(userId: string): NotificationItem[] {
    const all = this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return all.filter(n => n.userId === userId || n.userId === 'ALL');
  }

  public static sendNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): void {
    const all = this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    all.unshift({
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    this.set(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  public static markNotificationRead(id: string): void {
    const all = this.get<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const notif = all.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.set(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  // Audit Logs
  public static getAuditLogs(): AuditLog[] {
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  public static logAudit(
    actorId: string,
    actorName: string,
    actorRole: string,
    action: string,
    entityType: 'GATE_PASS' | 'FEE_PAYMENT' | 'USER_ACCOUNT' | 'POLICY' | 'INCIDENT',
    entityId: string,
    details: string
  ): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorId,
      actorName,
      actorRole,
      action,
      entityType,
      entityId,
      details
    });
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500)); // retain last 500 logs
  }

  // Policy
  public static getPolicy(): InstitutionalPolicy {
    return this.get<InstitutionalPolicy>(STORAGE_KEYS.POLICY, DEFAULT_POLICY);
  }

  public static updatePolicy(policy: InstitutionalPolicy, actorName: string): void {
    this.set(STORAGE_KEYS.POLICY, policy);
    this.logAudit('admin', actorName, 'ADMINISTRATOR', 'UPDATE_POLICY', 'POLICY', 'system', 'Updated institutional policy settings');
  }
}

// Auto-run storage initialization
StorageService.initialize();
