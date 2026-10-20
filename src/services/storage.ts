// CampusConnect CTGI — Persistent Storage & Institutional Data Engine
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
import { DEFAULT_POLICY, BOYS_HOSTEL_BLOCKS, GIRLS_HOSTEL_BLOCKS } from '../config/institution';

const STORAGE_KEYS = {
  USERS: 'campusconnect_users_v3',
  GATE_PASSES: 'campusconnect_passes_v3',
  GATE_EVENTS: 'campusconnect_events_v3',
  INCIDENTS: 'campusconnect_incidents_v3',
  FEES: 'campusconnect_fees_v3',
  NOTICES: 'campusconnect_notices_v3',
  COMPLAINTS: 'campusconnect_complaints_v3',
  NOTIFICATIONS: 'campusconnect_notifications_v3',
  AUDIT_LOGS: 'campusconnect_audit_v3',
  POLICY: 'campusconnect_policy_v3',
  INITIALIZED: 'campusconnect_init_v3'
};

// Institutional Accounts with strict Boys and Girls separation
export const INITIAL_USERS: User[] = [
  // 1. Male Hosteller (Boys Hostel)
  {
    id: 'user-std-boy',
    institutionUserId: 'CTGI/2023/CSE/101',
    name: 'Suman Sharma',
    email: 'suman.sharma@ctgroup.in',
    phone: '+91 98765 43210',
    role: 'STUDENT_HOSTELLER',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    studentType: 'HOSTELLER',
    hostelCategory: 'BOYS_HOSTEL',
    hostelBlock: 'Tagore Block (Boys)',
    roomNumber: 'B-204',
    wardenName: 'Dr. Rajesh Verma',
    classInchargeName: 'Prof. Sunita Mehra',
    guardianName: 'Ramesh Sharma',
    guardianPhone: '+91 98111 22334',
    active: true,
    createdAt: '2023-08-01T09:00:00Z'
  },
  // 2. Female Hosteller (Girls Hostel)
  {
    id: 'user-std-girl',
    institutionUserId: 'CTGI/2023/CSE/118',
    name: 'Simran Kaur',
    email: 'simran.kaur@ctgroup.in',
    phone: '+91 98765 11223',
    role: 'STUDENT_HOSTELLER',
    gender: 'FEMALE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Computer Science & Engineering',
    semester: 6,
    section: 'A',
    studentType: 'HOSTELLER',
    hostelCategory: 'GIRLS_HOSTEL',
    hostelBlock: 'Sarojini Naidu Block (Girls)',
    roomNumber: 'S-108',
    wardenName: 'Dr. Sunita Sharma',
    classInchargeName: 'Prof. Sunita Mehra',
    guardianName: 'Harbhajan Singh',
    guardianPhone: '+91 98333 44556',
    active: true,
    createdAt: '2023-08-01T09:00:00Z'
  },
  // 3. Male Day Scholar
  {
    id: 'user-std-dayscholar-m',
    institutionUserId: 'CTGI/2023/ME/302',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@ctgroup.in',
    phone: '+91 98765 88990',
    role: 'STUDENT_DAYSCHOLAR',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    department: 'Mechanical Engineering',
    semester: 4,
    section: 'A',
    studentType: 'DAY_SCHOLAR',
    classInchargeName: 'Prof. Anil Grover',
    guardianName: 'Deepak Gupta',
    guardianPhone: '+91 98444 55667',
    active: true,
    createdAt: '2023-08-01T09:00:00Z'
  },
  // 4. Female Day Scholar
  {
    id: 'user-std-dayscholar-f',
    institutionUserId: 'CTGI/2023/ECE/205',
    name: 'Priya Patel',
    email: 'priya.patel@ctgroup.in',
    phone: '+91 98765 67890',
    role: 'STUDENT_DAYSCHOLAR',
    gender: 'FEMALE',
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
  // 5. Boys Hostel Warden
  {
    id: 'user-warden-boys',
    institutionUserId: 'CTGI/FAC/WAR/001',
    name: 'Dr. Rajesh Verma',
    email: 'rajesh.verma@ctgroup.in',
    phone: '+91 98123 45678',
    role: 'HOSTEL_WARDEN',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    department: 'Hostel Administration (Boys Wing)',
    hostelCategory: 'BOYS_HOSTEL',
    hostelBlock: 'Tagore & Gandhi Blocks',
    active: true,
    createdAt: '2021-07-01T09:00:00Z'
  },
  // 6. Girls Hostel Warden
  {
    id: 'user-warden-girls',
    institutionUserId: 'CTGI/FAC/WAR/002',
    name: 'Dr. Sunita Sharma',
    email: 'sunita.sharma@ctgroup.in',
    phone: '+91 98123 99887',
    role: 'HOSTEL_WARDEN',
    gender: 'FEMALE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    department: 'Hostel Administration (Girls Wing)',
    hostelCategory: 'GIRLS_HOSTEL',
    hostelBlock: 'Sarojini & Kalpana Chawla Blocks',
    active: true,
    createdAt: '2021-07-01T09:00:00Z'
  },
  // 7. Gatekeeper (Camera Scanner)
  {
    id: 'user-gatekeeper',
    institutionUserId: 'CTGI/STAFF/SEC/012',
    name: 'Ram Singh',
    email: 'ram.singh@ctgroup.in',
    phone: '+91 99887 76655',
    role: 'GATEKEEPER',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    department: 'Security & Campus Gates',
    active: true,
    createdAt: '2022-01-15T09:00:00Z'
  },
  // 8. Security Guard
  {
    id: 'user-guard',
    institutionUserId: 'CTGI/STAFF/SEC/018',
    name: 'Vikram Rathore',
    email: 'vikram.rathore@ctgroup.in',
    phone: '+91 99112 23344',
    role: 'SECURITY_GUARD',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    department: 'Campus Security Patrol',
    active: true,
    createdAt: '2022-03-20T09:00:00Z'
  },
  // 9. Class Incharge
  {
    id: 'user-classincharge',
    institutionUserId: 'CTGI/FAC/CSE/023',
    name: 'Prof. Sunita Mehra',
    email: 'sunita.mehra@ctgroup.in',
    phone: '+91 98456 78901',
    role: 'CLASS_INCHARGE',
    gender: 'FEMALE',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    department: 'Computer Science & Engineering',
    active: true,
    createdAt: '2020-08-10T09:00:00Z'
  },
  // 10. HOD
  {
    id: 'user-hod',
    institutionUserId: 'CTGI/FAC/CSE/001',
    name: 'Dr. Amit Bansal',
    email: 'amit.bansal@ctgroup.in',
    phone: '+91 98140 12345',
    role: 'HOD',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    department: 'Computer Science & Engineering',
    active: true,
    createdAt: '2019-06-01T09:00:00Z'
  },
  // 11. Head of Institution (HOI)
  {
    id: 'user-hoi',
    institutionUserId: 'CTGI/ADMIN/HOI/001',
    name: 'Dr. Harpreet Singh',
    email: 'harpreet.singh@ctgroup.in',
    phone: '+91 98150 99887',
    role: 'HOI',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    department: 'Institute Administration',
    active: true,
    createdAt: '2018-05-15T09:00:00Z'
  },
  // 12. Fee Staff
  {
    id: 'user-fee-staff',
    institutionUserId: 'CTGI/STAFF/FEE/003',
    name: 'Anita Kapoor',
    email: 'anita.kapoor@ctgroup.in',
    phone: '+91 98721 34567',
    role: 'FEE_STAFF',
    gender: 'FEMALE',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    department: 'Accounts & Finance',
    active: true,
    createdAt: '2021-02-01T09:00:00Z'
  },
  // 13. DRCC Staff
  {
    id: 'user-drcc',
    institutionUserId: 'CTGI/STAFF/DRCC/002',
    name: 'Suresh Kumar',
    email: 'suresh.kumar@ctgroup.in',
    phone: '+91 98789 01234',
    role: 'DRCC_STAFF',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    department: 'DRCC Student Welfare & Verification',
    active: true,
    createdAt: '2022-09-01T09:00:00Z'
  },
  // 14. Dean Student Welfare
  {
    id: 'user-dsw',
    institutionUserId: 'CTGI/ADMIN/DSW/001',
    name: 'Dr. K. K. Sharma',
    email: 'dsw@ctgroup.in',
    phone: '+91 98141 55667',
    role: 'DEAN_STUDENT_WELFARE',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    department: 'Dean Student Welfare Office',
    active: true,
    createdAt: '2019-01-10T09:00:00Z'
  },
  // 15. Campus Director
  {
    id: 'user-director',
    institutionUserId: 'CTGI/ADMIN/DIR/001',
    name: 'Dr. Gurpreet Singh',
    email: 'campus.director@ctgroup.in',
    phone: '+91 98142 88990',
    role: 'CAMPUS_DIRECTOR',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    department: 'Office of Campus Director',
    active: true,
    createdAt: '2017-04-01T09:00:00Z'
  },
  // 16. Placement Cell
  {
    id: 'user-placement',
    institutionUserId: 'CTGI/STAFF/TPO/001',
    name: 'Er. Rohit Nanda',
    email: 'tpo@ctgroup.in',
    phone: '+91 98760 11223',
    role: 'PLACEMENT_CELL',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    department: 'Corporate Relations & Placement Cell',
    active: true,
    createdAt: '2020-03-01T09:00:00Z'
  },
  // 17. Administrator
  {
    id: 'user-admin',
    institutionUserId: 'CTGI/IT/ADMIN/001',
    name: 'System Administrator',
    email: 'admin@ctgroup.in',
    phone: '+91 98144 00001',
    role: 'ADMINISTRATOR',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Campus IT & Systems',
    active: true,
    createdAt: '2016-01-01T09:00:00Z'
  }
];

// Initial Passes for Boys and Girls Hostels
export const INITIAL_GATE_PASSES: GatePassRequest[] = [
  // Boys Hostel Outing Pass
  {
    id: 'gp-pass-boy-01',
    passNumber: 'GP-2026-1049',
    studentId: 'user-std-boy',
    studentName: 'Suman Sharma',
    studentNumber: 'CTGI/2023/CSE/101',
    gender: 'MALE',
    studentType: 'HOSTELLER',
    hostelCategory: 'BOYS_HOSTEL',
    department: 'Computer Science & Engineering',
    semester: 6,
    phone: '+91 98765 43210',
    guardianPhone: '+91 98111 22334',
    hostelInfo: 'Tagore Block (Boys) - B-204',
    requestType: 'GATE_PASS_OUTING',
    purpose: 'Library research & project work in city center',
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
        remarks: 'Approved for library research.'
      },
      {
        id: 'step-2',
        role: 'HOSTEL_WARDEN',
        approverName: 'Dr. Rajesh Verma',
        approverId: 'user-warden-boys',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 3900000).toISOString(),
        remarks: 'Approved. Boys hostel curfew 7:30 PM applies.'
      }
    ],
    tokenHash: 'ctgi-token-boy-verified-9988',
    validFrom: new Date(Date.now() - 3600000).toISOString(),
    validUntil: new Date(Date.now() + 14400000).toISOString()
  },
  // Girls Hostel Outing Pass (Simran Kaur - Sarojini Block)
  {
    id: 'gp-pass-girl-01',
    passNumber: 'GP-2026-2088',
    studentId: 'user-std-girl',
    studentName: 'Simran Kaur',
    studentNumber: 'CTGI/2023/CSE/118',
    gender: 'FEMALE',
    studentType: 'HOSTELLER',
    hostelCategory: 'GIRLS_HOSTEL',
    department: 'Computer Science & Engineering',
    semester: 6,
    phone: '+91 98765 11223',
    guardianPhone: '+91 98333 44556',
    hostelInfo: 'Sarojini Naidu Block (Girls) - S-108',
    requestType: 'GATE_PASS_OUTING',
    purpose: 'Urgent eye clinic consultation',
    destination: 'Thind Eye Hospital, Jalandhar',
    departureTime: new Date(Date.now() - 1800000).toISOString(),
    expectedReturnTime: new Date(Date.now() + 10800000).toISOString(),
    isLateSubmission: false,
    status: 'APPROVED',
    submittedAt: new Date(Date.now() - 5400000).toISOString(),
    academicApproverRole: 'CLASS_INCHARGE',
    approvalSteps: [
      {
        id: 'step-g1',
        role: 'CLASS_INCHARGE',
        approverName: 'Prof. Sunita Mehra',
        approverId: 'user-classincharge',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 4200000).toISOString(),
        remarks: 'Medical outing granted.'
      },
      {
        id: 'step-g2',
        role: 'HOSTEL_WARDEN',
        approverName: 'Dr. Sunita Sharma',
        approverId: 'user-warden-girls',
        status: 'APPROVED',
        decidedAt: new Date(Date.now() - 3600000).toISOString(),
        remarks: 'Approved. Girls hostel 6:30 PM curfew strictly enforced.'
      }
    ],
    tokenHash: 'ctgi-token-girl-verified-7722',
    validFrom: new Date(Date.now() - 1800000).toISOString(),
    validUntil: new Date(Date.now() + 10800000).toISOString()
  }
];

// Attendance records
export const INITIAL_ATTENDANCE: SubjectAttendance[] = [
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
    attendancePercentage: 68.8
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

export const INITIAL_TIMETABLE: TimetableEntry[] = [
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

export const INITIAL_NOTICES: Notice[] = [
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
    title: 'Hostel Curfew Notice: Boys (7:30 PM) & Girls (6:30 PM)',
    category: 'HOSTEL',
    content: 'All resident hostellers must adhere strictly to curfew hours: Boys Hostel curfew is 7:30 PM and Girls Hostel curfew is 6:30 PM. Outing passes must be validated via QR scan at gate security.',
    date: '2026-02-24T14:30:00Z',
    publisher: 'Office of Chief Wardens',
    publisherRole: 'Hostel Administration',
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

export const INITIAL_FEES: FeeRecord[] = [
  {
    id: 'fee-boy-01',
    studentId: 'user-std-boy',
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
    id: 'fee-girl-01',
    studentId: 'user-std-girl',
    studentName: 'Simran Kaur',
    studentNumber: 'CTGI/2023/CSE/118',
    department: 'Computer Science & Engineering',
    academicYear: '2025-26',
    totalAssessed: 135000,
    amountPaid: 135000,
    outstandingBalance: 0,
    tuitionFee: 75000,
    hostelFee: 35000,
    messFee: 20000,
    examFee: 5000,
    status: 'PAID',
    transactions: [
      {
        id: 'tx-g1',
        transactionRef: 'CTGI-TX-33211',
        date: '2025-08-12T09:30:00Z',
        amount: 135000,
        category: 'TUITION',
        paymentMode: 'ONLINE',
        status: 'RECONCILED',
        recordedBy: 'Anita Kapoor (Accounts)',
        receiptNumber: 'RCP-2025-0801'
      }
    ]
  }
];

export const INITIAL_COMPLAINTS: HostelComplaint[] = [
  {
    id: 'cmp-01',
    complaintRef: 'CMP-2026-041',
    studentId: 'user-std-boy',
    studentName: 'Suman Sharma',
    gender: 'MALE',
    hostelCategory: 'BOYS_HOSTEL',
    roomInfo: 'Tagore Block (Boys) - B-204',
    category: 'WIFI',
    description: 'High packet loss and intermittent disconnects on 2nd floor access point.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    resolutionRemarks: 'IT team dispatched to check switch port.'
  },
  {
    id: 'cmp-02',
    complaintRef: 'CMP-2026-049',
    studentId: 'user-std-girl',
    studentName: 'Simran Kaur',
    gender: 'FEMALE',
    hostelCategory: 'GIRLS_HOSTEL',
    roomInfo: 'Sarojini Naidu Block (Girls) - S-108',
    category: 'WATER',
    description: 'Low water pressure on 1st floor washrooms during morning hours.',
    priority: 'HIGH',
    status: 'SUBMITTED',
    submittedAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export const INITIAL_INCIDENTS: SecurityIncident[] = [
  {
    id: 'inc-01',
    incidentRef: 'INC-2026-081',
    reporterId: 'user-guard',
    reporterName: 'Vikram Rathore',
    reporterRole: 'SECURITY_GUARD',
    category: 'OVERDUE_CURFEW',
    location: 'Gate #1 (Main Entrance)',
    description: 'Student entered 25 minutes after approved curfew. Reason: Bus breakdown near bus stand.',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    status: 'REPORTED',
    involvedStudentId: 'user-std-boy',
    involvedStudentName: 'Suman Sharma'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actorId: 'user-warden-boys',
    actorName: 'Dr. Rajesh Verma',
    actorRole: 'HOSTEL_WARDEN',
    action: 'APPROVE_GATE_PASS',
    entityType: 'GATE_PASS',
    entityId: 'gp-pass-boy-01',
    details: 'Approved outing gate pass for Suman Sharma (Tagore Block)'
  },
  {
    id: 'aud-02',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actorId: 'user-warden-girls',
    actorName: 'Dr. Sunita Sharma',
    actorRole: 'HOSTEL_WARDEN',
    action: 'APPROVE_GATE_PASS',
    entityType: 'GATE_PASS',
    entityId: 'gp-pass-girl-01',
    details: 'Approved medical outing gate pass for Simran Kaur (Sarojini Block)'
  }
];

// Storage Engine
export class StorageService {
  private static get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      return defaultValue;
    }
  }

  private static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  public static initialize(): void {
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      this.resetToDefaults();
    }
  }

  public static resetToDefaults(): void {
    this.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.set(STORAGE_KEYS.GATE_PASSES, INITIAL_GATE_PASSES);
    this.set(STORAGE_KEYS.GATE_EVENTS, []);
    this.set(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
    this.set(STORAGE_KEYS.FEES, INITIAL_FEES);
    this.set(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
    this.set(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    this.set(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    this.set(STORAGE_KEYS.POLICY, DEFAULT_POLICY);
    this.set(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-01',
        userId: 'user-std-boy',
        title: 'Gate Pass Approved',
        message: 'Your gate pass GP-2026-1049 has been approved by Class Incharge and Boys Hostel Warden.',
        type: 'PASS_APPROVED',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      },
      {
        id: 'notif-02',
        userId: 'user-std-girl',
        title: 'Gate Pass Approved',
        message: 'Your gate pass GP-2026-2088 has been approved by Class Incharge and Girls Hostel Warden.',
        type: 'PASS_APPROVED',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false
      }
    ]);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // Users
  public static getUsers(): User[] {
    return this.get<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
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
    return this.get<GatePassRequest[]>(STORAGE_KEYS.GATE_PASSES, INITIAL_GATE_PASSES);
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
    return this.get<SecurityIncident[]>(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS);
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
    return this.get<FeeRecord[]>(STORAGE_KEYS.FEES, INITIAL_FEES);
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
    return this.get<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  }

  public static publishNotice(notice: Notice): void {
    const notices = this.getNotices();
    notices.unshift(notice);
    this.set(STORAGE_KEYS.NOTICES, notices);
    this.logAudit(notice.publisher, notice.publisher, notice.publisherRole, 'PUBLISH_NOTICE', 'POLICY', notice.id, `Published notice: ${notice.title}`);
  }

  // Complaints
  public static getComplaints(): HostelComplaint[] {
    return this.get<HostelComplaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
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
    return this.get<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
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
    this.set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
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

// Seed data for Attendance and Timetable
export const SEED_ATTENDANCE: SubjectAttendance[] = [
  {
    subjectCode: 'CS601',
    subjectName: 'Distributed Systems & Cloud Computing',
    facultyName: 'Dr. Amit Bansal',
    classesConducted: 42,
    classesAttended: 38,
    attendancePercentage: 90.5
  },
  {
    subjectCode: 'CS602',
    subjectName: 'Machine Learning & Neural Networks',
    facultyName: 'Prof. Sunita Mehra',
    classesConducted: 36,
    classesAttended: 29,
    attendancePercentage: 80.6
  },
  {
    subjectCode: 'CS603',
    subjectName: 'Software Engineering & Project Management',
    facultyName: 'Er. Rajesh Kalia',
    classesConducted: 40,
    classesAttended: 35,
    attendancePercentage: 87.5
  },
  {
    subjectCode: 'CS604',
    subjectName: 'Information & Cyber Security',
    facultyName: 'Dr. Naveen Sharma',
    classesConducted: 34,
    classesAttended: 28,
    attendancePercentage: 82.4
  },
  {
    subjectCode: 'CS605',
    subjectName: 'Full Stack Web Development Lab',
    facultyName: 'Er. Gurpreet Singh',
    classesConducted: 28,
    classesAttended: 26,
    attendancePercentage: 92.9
  }
];

export const SEED_TIMETABLE: TimetableEntry[] = [
  {
    day: 'MONDAY',
    timeSlot: '09:00 AM - 10:00 AM',
    subjectCode: 'CS601',
    subjectName: 'Distributed Systems',
    facultyName: 'Dr. Amit Bansal',
    room: 'LH-301 (Auditorium Block)'
  },
  {
    day: 'MONDAY',
    timeSlot: '10:00 AM - 11:00 AM',
    subjectCode: 'CS602',
    subjectName: 'Machine Learning',
    facultyName: 'Prof. Sunita Mehra',
    room: 'LH-301 (Auditorium Block)'
  },
  {
    day: 'MONDAY',
    timeSlot: '11:15 AM - 01:15 PM',
    subjectCode: 'CS605',
    subjectName: 'Web Dev Lab',
    facultyName: 'Er. Gurpreet Singh',
    room: 'Lab-4 (CS Block)'
  },
  {
    day: 'MONDAY',
    timeSlot: '02:00 PM - 03:00 PM',
    subjectCode: 'CS603',
    subjectName: 'Software Engineering',
    facultyName: 'Er. Rajesh Kalia',
    room: 'LH-302 (Auditorium Block)'
  },
  {
    day: 'MONDAY',
    timeSlot: '03:00 PM - 04:00 PM',
    subjectCode: 'CS604',
    subjectName: 'Cyber Security',
    facultyName: 'Dr. Naveen Sharma',
    room: 'LH-302 (Auditorium Block)'
  }
];

// Auto-run storage initialization
StorageService.initialize();

