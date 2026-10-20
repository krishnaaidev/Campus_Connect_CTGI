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
  USERS: 'campusconnect_users_v4',
  GATE_PASSES: 'campusconnect_passes_v4',
  GATE_EVENTS: 'campusconnect_events_v4',
  INCIDENTS: 'campusconnect_incidents_v4',
  FEES: 'campusconnect_fees_v4',
  NOTICES: 'campusconnect_notices_v4',
  COMPLAINTS: 'campusconnect_complaints_v4',
  NOTIFICATIONS: 'campusconnect_notifications_v4',
  AUDIT_LOGS: 'campusconnect_audit_v4',
  POLICY: 'campusconnect_policy_v4',
  INITIALIZED: 'campusconnect_init_v4'
};

// Single Primary Account: System Administrator
export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    institutionUserId: 'CTGI/IT/ADMIN/001',
    name: 'System Administrator',
    email: 'admin@ctgroup.in',
    phone: '+91 98144 00001',
    role: 'ADMINISTRATOR',
    gender: 'MALE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    department: 'Campus IT & Systems Administration',
    active: true,
    createdAt: '2026-01-01T09:00:00Z'
  }
];

export const INITIAL_GATE_PASSES: GatePassRequest[] = [];

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

export const INITIAL_FEES: FeeRecord[] = [];

export const INITIAL_COMPLAINTS: HostelComplaint[] = [];

export const INITIAL_INCIDENTS: SecurityIncident[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    timestamp: new Date().toISOString(),
    actorId: 'user-admin',
    actorName: 'System Administrator',
    actorRole: 'ADMINISTRATOR',
    action: 'SYSTEM_BOOT',
    entityType: 'USER_ACCOUNT',
    entityId: 'user-admin',
    details: 'CampusConnect CTGI system booted with single System Administrator account'
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
        userId: 'user-admin',
        title: 'System Initialized',
        message: 'CampusConnect CTGI is online. System Administrator account is active.',
        type: 'PASS_APPROVED',
        timestamp: new Date().toISOString(),
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

