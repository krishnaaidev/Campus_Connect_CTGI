// CampusConnect CTGI — System Types & Permission Schema

export type Gender = 'MALE' | 'FEMALE';

export type UserRole =
  | 'STUDENT_HOSTELLER'
  | 'STUDENT_DAYSCHOLAR'
  | 'GATEKEEPER'
  | 'SECURITY_GUARD'
  | 'HOSTEL_WARDEN'
  | 'CLASS_INCHARGE'
  | 'HOD'
  | 'HOI'
  | 'FACULTY'
  | 'FEE_STAFF'
  | 'DRCC_STAFF'
  | 'DEAN_STUDENT_WELFARE'
  | 'CAMPUS_DIRECTOR'
  | 'OTHER_DIRECTORS'
  | 'PLACEMENT_CELL'
  | 'ADMINISTRATOR';

export interface User {
  id: string;
  institutionUserId: string; // e.g. CTGI/2026/CTIEMT/CSE/042
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  gender: Gender;
  avatarUrl?: string;
  department?: string; // e.g. CTIEMT, CTIMT, etc.
  branch?: string;     // e.g. APPLIED SCIENCES, CSE, CSE-AIML, CE, ME
  subDepartment?: string;
  year?: number;       // 1, 2, 3, 4
  semester?: number;
  section?: string;
  studentType?: 'HOSTELLER' | 'DAY_SCHOLAR';
  hostelCategory?: 'BOYS_HOSTEL' | 'GIRLS_HOSTEL';
  hostelBlock?: string;
  roomNumber?: string;
  wardenName?: string;
  classInchargeName?: string;
  guardianName?: string;
  guardianPhone?: string;
  gateLocation?: string; // For Gatekeeper & Security Guards
  shift?: string;        // Morning, Evening, Night
  active: boolean;
  createdAt: string;
}

export type PassType = 'GATE_PASS_OUTING' | 'DAY_SCHOLAR_PASS' | 'EXTENDED_LEAVE';

export type PassStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'PENDING_ACADEMIC'
  | 'PENDING_WARDEN'
  | 'PENDING_BOTH'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'EXIT_RECORDED'
  | 'RETURN_RECORDED';

export interface ApprovalStep {
  id: string;
  role: 'CLASS_INCHARGE' | 'HOD' | 'HOI' | 'HOSTEL_WARDEN' | 'DEAN_STUDENT_WELFARE' | 'ADMINISTRATOR';
  approverName?: string;
  approverId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decidedAt?: string;
  remarks?: string;
}

export interface GatePassRequest {
  id: string;
  passNumber: string; // e.g. GP-2026-1049
  studentId: string;
  studentName: string;
  studentNumber: string;
  gender: Gender;
  studentType: 'HOSTELLER' | 'DAY_SCHOLAR';
  hostelCategory?: 'BOYS_HOSTEL' | 'GIRLS_HOSTEL';
  department: string;
  semester: number;
  phone: string;
  guardianPhone?: string;
  hostelInfo?: string; // e.g. "Tagore Block (Boys) - B-204" or "Sarojini Block (Girls) - S-108"
  requestType: PassType;
  purpose: string;
  destination: string;
  departureTime: string; // ISO String
  expectedReturnTime: string; // ISO String
  actualExitTime?: string;
  actualReturnTime?: string;
  isLateSubmission: boolean; // Submitted after 2:00 PM for Day Scholars
  status: PassStatus;
  submittedAt: string;
  academicApproverRole: 'CLASS_INCHARGE' | 'HOD' | 'HOI';
  approvalSteps: ApprovalStep[];
  tokenHash?: string; // Secure token for QR verification
  validFrom?: string;
  validUntil?: string;
  rejectionReason?: string;
  recordedByGatekeeper?: string;
  exitGate?: string;
  returnGate?: string;
}

export interface GateEvent {
  id: string;
  passId: string;
  passNumber: string;
  studentName: string;
  studentNumber: string;
  gender?: Gender;
  eventType: 'EXIT' | 'RETURN' | 'VERIFICATION_DENIED';
  operatorId: string;
  operatorName: string;
  gateNumber: string;
  timestamp: string;
  verificationResult: 'ALLOW' | 'DENY';
  reason?: string;
}

export interface SecurityIncident {
  id: string;
  incidentRef: string; // INC-2026-081
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  category: 'SUSPICIOUS_PASS' | 'OVERDUE_CURFEW' | 'UNAUTHORIZED_ENTRY' | 'DISCIPLINARY' | 'MEDICAL_EMERGENCY' | 'OTHER';
  location: string;
  description: string;
  timestamp: string;
  status: 'REPORTED' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  involvedStudentId?: string;
  involvedStudentName?: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentNumber: string;
  department: string;
  academicYear: string;
  totalAssessed: number;
  amountPaid: number;
  outstandingBalance: number;
  tuitionFee: number;
  hostelFee?: number;
  messFee?: number;
  examFee: number;
  transportFee?: number;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  transactions: FeeTransaction[];
}

export interface FeeTransaction {
  id: string;
  transactionRef: string;
  date: string;
  amount: number;
  category: 'TUITION' | 'HOSTEL' | 'MESS' | 'EXAM' | 'TRANSPORT';
  paymentMode: 'ONLINE' | 'UPI' | 'DEMAND_DRAFT' | 'BANK_TRANSFER' | 'CASH';
  status: 'RECORDED' | 'RECONCILED' | 'FLAGGED';
  recordedBy: string;
  receiptNumber: string;
}

export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  classesConducted: number;
  classesAttended: number;
  attendancePercentage: number;
}

export interface TimetableEntry {
  day: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  timeSlot: string; // e.g. 09:30 AM - 10:30 AM
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  room: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'EXAMINATION' | 'HOSTEL' | 'PLACEMENT' | 'EVENTS' | 'COLLEGE_WIDE';
  content: string;
  date: string;
  publisher: string;
  publisherRole: string;
  important: boolean;
  targetAudience: ('ALL' | 'STUDENT' | 'FACULTY' | 'HOSTELLER')[];
}

export interface HostelComplaint {
  id: string;
  complaintRef: string;
  studentId: string;
  studentName: string;
  gender?: Gender;
  hostelCategory?: 'BOYS_HOSTEL' | 'GIRLS_HOSTEL';
  roomInfo: string;
  category: 'WATER' | 'ELECTRICITY' | 'WIFI' | 'CLEANING' | 'MESS_FOOD' | 'CARPENTRY';
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'SUBMITTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  submittedAt: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'PASS_APPROVED' | 'PASS_REJECTED' | 'PASS_SUBMITTED' | 'GATE_ACTIVITY' | 'FEE_ALERT' | 'ATTENDANCE_ALERT' | 'NOTICE';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: 'GATE_PASS' | 'FEE_PAYMENT' | 'USER_ACCOUNT' | 'POLICY' | 'INCIDENT';
  entityId: string;
  details: string;
}

export interface InstitutionalPolicy {
  collegeName: string;
  campusName: string;
  timeZone: string; // Asia/Kolkata
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string; // "16:30"
  dayScholarPassDeadline: string; // "14:00" (2:00 PM cutoff)
  hostellerCurfewTime: string; // "19:30" (7:30 PM)
  girlsCurfewTime: string; // "18:30" (6:30 PM for Girls Hostel by policy)
  requireDualApprovalForHosteller: boolean; // Academic + Warden
  allowLatePassSubmission: boolean; // Flagged as late, requires supervisor sign-off
}
