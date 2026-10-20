import { InstitutionalPolicy, CampusInfo } from '../types';

export const BOYS_HOSTEL_BLOCKS = [
  'Tagore Block (Boys)',
  'Gandhi Block (Boys)',
  'Bhagat Singh Block (Boys)'
];

export const GIRLS_HOSTEL_BLOCKS = [
  'Sarojini Naidu Block (Girls)',
  'Kalpana Chawla Block (Girls)',
  'Kasturba Block (Girls)'
];

// 11 Official CT Group of Institutions Departments
export interface CTDepartmentInfo {
  code: string;
  name: string;
  subDepartments: string[];
  description: string;
}

export const CT_DEPARTMENTS: CTDepartmentInfo[] = [
  {
    code: 'CTIEMT',
    name: 'CT Institute of Engineering, Management & Technology',
    subDepartments: ['APPLIED SCIENCES', 'CSE', 'CSE-AIML', 'CE', 'ME'],
    description: 'All B.Tech Engineering Programs (Applied Sciences 1st Year | CSE, CSE-AIML, CE, ME 2nd Year+)'
  },
  {
    code: 'CTIMT',
    name: 'CT Institute of Management & Technology',
    subDepartments: ['MBA', 'BBA', 'B.Com', 'Management Studies'],
    description: 'Business Administration & Management Studies'
  },
  {
    code: 'CTIPS',
    name: 'CT Institute of Pharmaceutical Sciences',
    subDepartments: ['B.Pharmacy', 'M.Pharmacy', 'Pharm.D'],
    description: 'Pharmaceutical Sciences & Research'
  },
  {
    code: 'CTIL',
    name: 'CT Institute of Law',
    subDepartments: ['BA LLB', 'B.Com LLB', 'LLB'],
    description: 'Legal Studies & Jurisprudence'
  },
  {
    code: 'CTPC',
    name: 'CT Polytechnic College',
    subDepartments: ['Civil Diploma', 'Mechanical Diploma', 'Electrical Diploma'],
    description: 'Polytechnic Engineering & Technical Diplomas'
  },
  {
    code: 'CTIHS',
    name: 'CT Institute of Higher Studies',
    subDepartments: ['Arts & Humanities', 'Journalism & Mass Comm', 'Animation & Multimedia'],
    description: 'Higher Studies, Humanities & Media Arts'
  },
  {
    code: 'CTIAP',
    name: 'CT Institute of Architecture & Planning',
    subDepartments: ['B.Architecture', 'Interior Design', 'Urban Planning'],
    description: 'Architecture & Environmental Planning'
  },
  {
    code: 'CTCP',
    name: 'CT College of Pharmacy',
    subDepartments: ['Pharmacy Practice', 'Clinical Pharmacology', 'Pharmaceutical Quality'],
    description: 'Pharmacy Education & Healthcare'
  },
  {
    code: 'CTIHpM',
    name: 'CT Institute of Hospitality & Hotel Management',
    subDepartments: ['Hotel Management', 'Culinary Arts', 'Airlines & Tourism'],
    description: 'Hospitality, Catering & Tourism Management'
  },
  {
    code: 'MK COLLEGE',
    name: 'MK College',
    subDepartments: ['General Studies', 'Education', 'Applied Humanities'],
    description: 'Undergraduate Higher Education & Applied Programs'
  },
  {
    code: 'CCPC',
    name: 'CT Community Polytechnic College',
    subDepartments: ['Skill Development', 'Vocational Trades', 'Community Technical Training'],
    description: 'Community Technical Education & Skill Building'
  }
];

export const CTIEMT_BTECH_BRANCHES = [
  'CSE',
  'CSE-AIML',
  'CE',
  'ME'
];

export const CTIEMT_FIRST_YEAR_BRANCH = 'APPLIED SCIENCES';

/**
 * Returns the academic year (1, 2, 3, or 4) from the given semester (1 to 8).
 */
export function getYearFromSemester(semester: number): number {
  return Math.ceil(semester / 2) || 1;
}

/**
 * Computes official branch for a student following CTIEMT 1st Year Applied Science rule:
 * For 1st Year (Semester 1 & 2), the B.Tech student branch is strictly "APPLIED SCIENCES".
 * Branch separation (CSE, CSE-AIML, CE, ME, etc.) begins from 2nd Year (Semester 3+).
 */
export function computeStudentBranch(department: string, semester: number, selectedBranch?: string): string {
  if (department === 'CTIEMT') {
    const year = getYearFromSemester(semester);
    if (year === 1) {
      return CTIEMT_FIRST_YEAR_BRANCH;
    }
    return selectedBranch || 'CSE';
  }
  return selectedBranch || department;
}

// CT Group of Institutions — 3 Campuses Architecture
export const CT_CAMPUSES: CampusInfo[] = [
  {
    id: 'SHAHPUR',
    code: 'CTGI-SHAHPUR',
    name: 'Shahpur Campus',
    city: 'Jalandhar',
    status: 'ACTIVE',
    statusLabel: 'Available Now',
    description: 'Flagship Mega Campus hosting 11 Departments: CTIEMT, CTIMT, CTIPS, CTIL, CTPC, CTIHS, CTIAP, CTCP, CTIHpM, MK College & CCPC.',
    address: 'Urban Estate Phase II, Pratappura Road, Shahpur, Jalandhar, Punjab 144020',
    departmentsCount: 11
  },
  {
    id: 'MAQSUDAN',
    code: 'CTGI-MAQSUDAN',
    name: 'Maqsudan Campus',
    city: 'Jalandhar',
    status: 'IN_PROGRESS',
    statusLabel: 'In Progress',
    description: 'North Campus educational complex. Digital infrastructure and student database onboarding in progress.',
    address: 'Greater Kailash, G.T. Road, Maqsudan, Jalandhar, Punjab 144008',
    departmentsCount: 0
  },
  {
    id: 'LUDHIANA',
    code: 'CT-LUDHIANA',
    name: 'Ludhiana Campus (CT University)',
    city: 'Ludhiana',
    status: 'IN_PROGRESS',
    statusLabel: 'In Progress',
    description: 'CT University and South Campus. Multi-campus synchronization and unified ERP integration in progress.',
    address: 'Ferozepur Road, Sidhwan Bet, Ludhiana, Punjab 142024',
    departmentsCount: 0
  }
];

export const ACTIVE_CAMPUS_ID = 'SHAHPUR';
export const ACTIVE_CAMPUS_NAME = 'Shahpur Campus, Jalandhar';

export const DEFAULT_POLICY: InstitutionalPolicy = {
  collegeName: "CT Group of Institutions (CTGI)",
  campusName: "Shahpur Campus (Active) • Maqsudan & Ludhiana (In Progress)",
  timeZone: "Asia/Kolkata",
  workingHoursStart: "09:00",
  workingHoursEnd: "16:30",
  dayScholarPassDeadline: "14:00", // 2:00 PM mandatory cutoff
  hostellerCurfewTime: "19:30", // 7:30 PM for Boys
  girlsCurfewTime: "18:30", // 6:30 PM for Girls
  requireDualApprovalForHosteller: true,
  allowLatePassSubmission: true
};

/**
 * Formats a Date or ISO string into Asia/Kolkata local time safely
 */
export function formatKolkataTime(dateInput: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  try {
    if (options) {
      return new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        ...options
      }).format(date);
    }
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  } catch (e) {
    return date.toLocaleString();
  }
}

/**
 * Checks if current time is before 2:00 PM IST
 */
export function isBeforeDayScholarDeadline(dateInput: Date = new Date()): boolean {
  try {
    const istFormatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const parts = istFormatter.formatToParts(dateInput);
    const hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
    const minute = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
    
    return hour < 14 || (hour === 14 && minute === 0);
  } catch (e) {
    const hours = dateInput.getHours();
    return hours < 14;
  }
}

/**
 * Checks if a given date is a working day (Mon-Fri)
 */
export function isWorkingDay(dateInput: Date = new Date()): boolean {
  const day = dateInput.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
}
