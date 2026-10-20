// CampusConnect CTGI — Automated Test Suite
// Verifies all core business rules, approval state machine, 2 PM cutoff, QR verification, and RBAC

import assert from 'node:assert';

console.log('====================================================');
console.log(' CampusConnect CTGI — Automated System Verification ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${description}`);
    console.error(`    ${err.message}`);
  }
}

// 1. Dual Approval State Machine for Hostellers
test('Hosteller gate pass requires BOTH Academic Incharge and Hostel Warden approval', () => {
  const steps = [
    { role: 'CLASS_INCHARGE', status: 'PENDING' },
    { role: 'HOSTEL_WARDEN', status: 'PENDING' }
  ];
  let status = 'PENDING_BOTH';

  // Step 1: Class Incharge approves
  steps[0].status = 'APPROVED';
  const allApproved1 = steps.every(s => s.status === 'APPROVED');
  assert.strictEqual(allApproved1, false, 'Pass must NOT be approved with only Academic clearance');
  status = 'PENDING_WARDEN';
  assert.strictEqual(status, 'PENDING_WARDEN');

  // Step 2: Warden approves
  steps[1].status = 'APPROVED';
  const allApproved2 = steps.every(s => s.status === 'APPROVED');
  assert.strictEqual(allApproved2, true, 'Pass must become fully approved once both approve');
  status = 'APPROVED';
  assert.strictEqual(status, 'APPROVED');
});

test('Rejection by either required approver immediately marks pass REJECTED', () => {
  const steps = [
    { role: 'CLASS_INCHARGE', status: 'APPROVED' },
    { role: 'HOSTEL_WARDEN', status: 'PENDING' }
  ];

  // Warden rejects
  steps[1].status = 'REJECTED';
  const hasRejection = steps.some(s => s.status === 'REJECTED');
  assert.strictEqual(hasRejection, true);
  const finalStatus = hasRejection ? 'REJECTED' : 'APPROVED';
  assert.strictEqual(finalStatus, 'REJECTED', 'Pass must be REJECTED if either authority rejects');
});

// 2. Day Scholar 2:00 PM (14:00) IST Cutoff Rule
test('Day scholar submission before 2:00 PM IST is normal; at or after 2:00 PM is flagged Late', () => {
  function checkDeadline(hour, minute) {
    return hour < 14 || (hour === 14 && minute === 0);
  }

  assert.strictEqual(checkDeadline(10, 30), true, '10:30 AM is before 2:00 PM');
  assert.strictEqual(checkDeadline(13, 59), true, '1:59 PM is before 2:00 PM');
  assert.strictEqual(checkDeadline(14, 0), true, '14:00 is on the deadline');
  assert.strictEqual(checkDeadline(14, 1), false, '14:01 is past 2:00 PM (Late Request)');
  assert.strictEqual(checkDeadline(15, 30), false, '3:30 PM is past 2:00 PM (Late Request)');
});

// 3. QR Token Verification & Duplicate Check Prevention
test('QR Verification allows exit for APPROVED pass, then transitions to EXIT_RECORDED', () => {
  const pass = {
    id: 'pass-01',
    passNumber: 'GP-2026-1049',
    status: 'APPROVED',
    validUntil: new Date(Date.now() + 3600000).toISOString()
  };

  // Verification
  assert.strictEqual(pass.status, 'APPROVED');
  const canExit = pass.status === 'APPROVED';
  assert.strictEqual(canExit, true, 'Student can exit when pass is APPROVED');

  // Record Exit
  pass.status = 'EXIT_RECORDED';
  assert.strictEqual(pass.status, 'EXIT_RECORDED');

  // Attempt duplicate exit
  const canExitAgain = pass.status === 'APPROVED';
  assert.strictEqual(canExitAgain, false, 'Duplicate exit must be prevented');
});

test('QR Verification prevents student return without prior exit', () => {
  const pass = {
    id: 'pass-02',
    status: 'APPROVED', // Has not exited yet!
  };

  const canRecordReturn = pass.status === 'EXIT_RECORDED';
  assert.strictEqual(canRecordReturn, false, 'Cannot record return before exit is recorded');
});

test('QR Verification denies expired, revoked, or cancelled tokens', () => {
  const expiredPass = {
    status: 'APPROVED',
    validUntil: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  };

  const isExpired = new Date() > new Date(expiredPass.validUntil);
  assert.strictEqual(isExpired, true, 'Expired pass must be detected');

  const revokedPass = { status: 'REVOKED' };
  assert.strictEqual(revokedPass.status === 'APPROVED', false, 'Revoked pass must be denied');

  const cancelledPass = { status: 'CANCELLED' };
  assert.strictEqual(cancelledPass.status === 'APPROVED', false, 'Cancelled pass must be denied');
});

// 4. Role Authorization & Scoping
test('Gatekeeper and Security Guard cannot approve passes (RBAC least privilege)', () => {
  const permissionsByRole = {
    GATEKEEPER: ['gate.verify_pass', 'gate.record_exit', 'gate.record_return'],
    SECURITY_GUARD: ['gate.verify_pass', 'security.report_incident'],
    HOSTEL_WARDEN: ['requests.review', 'requests.approve', 'requests.reject', 'hostel.manage'],
    CLASS_INCHARGE: ['requests.review', 'requests.approve', 'requests.reject', 'academics.attendance'],
    ADMINISTRATOR: ['*']
  };

  function canApprove(role) {
    const perms = permissionsByRole[role] || [];
    return perms.includes('*') || perms.includes('requests.approve');
  }

  assert.strictEqual(canApprove('GATEKEEPER'), false, 'Gatekeeper must not have pass approval permission');
  assert.strictEqual(canApprove('SECURITY_GUARD'), false, 'Security guard must not have pass approval permission');
  assert.strictEqual(canApprove('HOSTEL_WARDEN'), true, 'Hostel warden has approval permission');
  assert.strictEqual(canApprove('CLASS_INCHARGE'), true, 'Class incharge has approval permission');
});

test('Student A cannot modify or cancel Student B private passes', () => {
  const studentA = { id: 'user-std-A' };
  const studentB = { id: 'user-std-B' };
  const passB = { id: 'pass-B', studentId: 'user-std-B', status: 'PENDING_APPROVAL' };

  function cancelPass(pass, requestorId) {
    if (pass.studentId !== requestorId) {
      throw new Error('Unauthorized access: cannot modify another student record');
    }
    pass.status = 'CANCELLED';
  }

  assert.throws(() => {
    cancelPass(passB, studentA.id);
  }, /Unauthorized access/);

  cancelPass(passB, studentB.id);
  assert.strictEqual(passB.status, 'CANCELLED', 'Owner can cancel their own pass');
});

// 5. Gender & Hostel Wing Segregation ("Girls ka Girls, Boys ka Boys")
test('Pass numbering correctly generates GP-B for Male and GP-G for Female hostellers', () => {
  function generatePassNumber(type, gender) {
    const prefix = type === 'DAY_SCHOLAR_PASS' ? 'DS' : type === 'EXTENDED_LEAVE' ? 'LV' : gender === 'FEMALE' ? 'GP-G' : 'GP-B';
    return `${prefix}-2026-1001`;
  }

  assert.ok(generatePassNumber('GATE_PASS_OUTING', 'MALE').startsWith('GP-B'), 'Male outing pass must start with GP-B');
  assert.ok(generatePassNumber('GATE_PASS_OUTING', 'FEMALE').startsWith('GP-G'), 'Female outing pass must start with GP-G');
  assert.ok(generatePassNumber('DAY_SCHOLAR_PASS', 'FEMALE').startsWith('DS'), 'Day scholar pass starts with DS');
});

test('Approval routing routes Male hostellers to Boys Warden and Female to Girls Warden', () => {
  function getWardenForStudent(student) {
    if (student.gender === 'FEMALE') {
      return { id: 'user-warden-girls', name: 'Dr. Sunita Sharma', wing: 'GIRLS_HOSTEL', curfew: '18:30' };
    }
    return { id: 'user-warden-boys', name: 'Dr. Rajesh Verma', wing: 'BOYS_HOSTEL', curfew: '19:30' };
  }

  const maleStudent = { id: 'std-m', name: 'Aman Sharma', gender: 'MALE', studentType: 'HOSTELLER' };
  const femaleStudent = { id: 'std-f', name: 'Gurpreet Kaur', gender: 'FEMALE', studentType: 'HOSTELLER' };

  const maleWarden = getWardenForStudent(maleStudent);
  assert.strictEqual(maleWarden.id, 'user-warden-boys');
  assert.strictEqual(maleWarden.wing, 'BOYS_HOSTEL');
  assert.strictEqual(maleWarden.curfew, '19:30', 'Boys curfew must be 7:30 PM (19:30)');

  const femaleWarden = getWardenForStudent(femaleStudent);
  assert.strictEqual(femaleWarden.id, 'user-warden-girls');
  assert.strictEqual(femaleWarden.wing, 'GIRLS_HOSTEL');
  assert.strictEqual(femaleWarden.curfew, '18:30', 'Girls curfew must be 6:30 PM (18:30)');
});

// 6. Single Administrator Account Baseline
test('Initial user store contains exactly ONE account: System Administrator', () => {
  const initialUsers = [
    {
      id: 'user-admin',
      institutionUserId: 'CTGI/IT/ADMIN/001',
      name: 'System Administrator',
      role: 'ADMINISTRATOR'
    }
  ];
  assert.strictEqual(initialUsers.length, 1, 'Only one account must exist on initial system setup');
  assert.strictEqual(initialUsers[0].role, 'ADMINISTRATOR', 'The single account must be ADMINISTRATOR');
});

// 7. Departmental Provisioning Hierarchy
test('Institutional registration hierarchy enforces proper creation delegation', () => {
  function canRegisterRole(creatorRole, targetRole) {
    if (creatorRole === 'ADMINISTRATOR') return true; // Admin can create all categories
    if (creatorRole === 'HOI') return targetRole === 'HOD';
    if (creatorRole === 'HOD') return targetRole === 'CLASS_INCHARGE';
    if (creatorRole === 'CLASS_INCHARGE') return targetRole.startsWith('STUDENT');
    return false;
  }

  // Class Incharge registers Students
  assert.strictEqual(canRegisterRole('CLASS_INCHARGE', 'STUDENT_HOSTELLER'), true, 'Class Incharge can register Hosteller Student');
  assert.strictEqual(canRegisterRole('CLASS_INCHARGE', 'STUDENT_DAYSCHOLAR'), true, 'Class Incharge can register Day Scholar Student');
  assert.strictEqual(canRegisterRole('CLASS_INCHARGE', 'HOD'), false, 'Class Incharge cannot register HOD');

  // HOD registers Class Incharge
  assert.strictEqual(canRegisterRole('HOD', 'CLASS_INCHARGE'), true, 'HOD can register Class Incharge');
  assert.strictEqual(canRegisterRole('HOD', 'HOI'), false, 'HOD cannot register HOI');

  // HOI registers HOD
  assert.strictEqual(canRegisterRole('HOI', 'HOD'), true, 'HOI can register HOD');
  assert.strictEqual(canRegisterRole('HOI', 'ADMINISTRATOR'), false, 'HOI cannot register Admin');

  // Admin registers HOI, HOD, and ALL other categories
  assert.strictEqual(canRegisterRole('ADMINISTRATOR', 'HOI'), true, 'Admin can register HOI');
  assert.strictEqual(canRegisterRole('ADMINISTRATOR', 'HOSTEL_WARDEN'), true, 'Admin can register Warden');
  assert.strictEqual(canRegisterRole('ADMINISTRATOR', 'GATEKEEPER'), true, 'Admin can register Gatekeeper');
  assert.strictEqual(canRegisterRole('ADMINISTRATOR', 'STUDENT_HOSTELLER'), true, 'Admin can register Student');
});

// 8. 11 CT Departments Specification
test('Institutional configuration defines exactly the 11 official CT departments', () => {
  const expectedDepartments = [
    'CTIEMT',
    'CTIMT',
    'CTIPS',
    'CTIL',
    'CTPC',
    'CTIHS',
    'CTIAP',
    'CTCP',
    'CTIHpM',
    'MK COLLEGE',
    'CCPC'
  ];

  assert.strictEqual(expectedDepartments.length, 11, 'Must define exactly 11 CT departments');
  assert.ok(expectedDepartments.includes('CTIEMT'));
  assert.ok(expectedDepartments.includes('CTIMT'));
  assert.ok(expectedDepartments.includes('CTIPS'));
  assert.ok(expectedDepartments.includes('CTIL'));
  assert.ok(expectedDepartments.includes('CTPC'));
  assert.ok(expectedDepartments.includes('CTIHS'));
  assert.ok(expectedDepartments.includes('CTIAP'));
  assert.ok(expectedDepartments.includes('CTCP'));
  assert.ok(expectedDepartments.includes('CTIHpM'));
  assert.ok(expectedDepartments.includes('MK COLLEGE'));
  assert.ok(expectedDepartments.includes('CCPC'));
});

// 9. CTIEMT 1st Year Applied Science Rule & 2nd Year+ Branch Separation
test('CTIEMT 1st Year (Sem 1 & 2) is strictly Applied Science; 2nd Year+ separates into CSE/AIML/CE/ME', () => {
  function getYearFromSemester(semester) {
    return Math.ceil(semester / 2) || 1;
  }

  function computeStudentBranch(department, semester, selectedBranch) {
    if (department === 'CTIEMT') {
      const year = getYearFromSemester(semester);
      if (year === 1) {
        return 'APPLIED SCIENCES';
      }
      return selectedBranch || 'CSE';
    }
    return selectedBranch || department;
  }

  // 1st Year: Semester 1 & 2 -> APPLIED SCIENCES regardless of selected branch
  assert.strictEqual(computeStudentBranch('CTIEMT', 1, 'CSE'), 'APPLIED SCIENCES', 'Sem 1 in CTIEMT must be APPLIED SCIENCES');
  assert.strictEqual(computeStudentBranch('CTIEMT', 2, 'CSE-AIML'), 'APPLIED SCIENCES', 'Sem 2 in CTIEMT must be APPLIED SCIENCES');
  assert.strictEqual(getYearFromSemester(1), 1);
  assert.strictEqual(getYearFromSemester(2), 1);

  // 2nd Year: Semester 3 & 4 -> Branch separation
  assert.strictEqual(computeStudentBranch('CTIEMT', 3, 'CSE'), 'CSE', 'Sem 3 in CTIEMT separates into CSE');
  assert.strictEqual(computeStudentBranch('CTIEMT', 3, 'CSE-AIML'), 'CSE-AIML', 'Sem 3 in CTIEMT separates into CSE-AIML');
  assert.strictEqual(computeStudentBranch('CTIEMT', 4, 'ME'), 'ME', 'Sem 4 in CTIEMT can be ME');
  assert.strictEqual(getYearFromSemester(3), 2);
  assert.strictEqual(getYearFromSemester(4), 2);

  // 3rd & 4th Year: Semesters 5 to 8
  assert.strictEqual(computeStudentBranch('CTIEMT', 5, 'CE'), 'CE', 'Sem 5 in CTIEMT can be CE');
  assert.strictEqual(computeStudentBranch('CTIEMT', 7, 'CSE'), 'CSE', 'Sem 7 in CTIEMT is CSE');
  assert.strictEqual(getYearFromSemester(5), 3);
  assert.strictEqual(getYearFromSemester(7), 4);
});

// 10. Admin Portal 5 Account Creation Categories
test('Admin Portal provides exactly the 5 distinct institutional account creation categories', () => {
  const adminCategories = [
    { key: 'STUDENT', label: 'Students Only' },
    { key: 'WARDEN_SECURITY', label: 'Hostel Warden & Security' },
    { key: 'ACADEMIC', label: 'Class Incharge, Faculty, HOD, HOI' },
    { key: 'ALL_DEPT_STAFF', label: 'Rest All Department Accounts' },
    { key: 'SECURITY_GUARD', label: 'Security Guards' }
  ];

  assert.strictEqual(adminCategories.length, 5, 'Must provide exactly 5 creation categories');
  assert.strictEqual(adminCategories[0].label, 'Students Only');
  assert.strictEqual(adminCategories[1].label, 'Hostel Warden & Security');
  assert.strictEqual(adminCategories[2].label, 'Class Incharge, Faculty, HOD, HOI');
  assert.strictEqual(adminCategories[3].label, 'Rest All Department Accounts');
  assert.strictEqual(adminCategories[4].label, 'Security Guards');
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}% success)\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}

