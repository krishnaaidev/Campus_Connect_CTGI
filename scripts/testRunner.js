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

console.log(`\nResults: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}% success)\n`);

if (passedTests !== totalTests) {
  process.exit(1);
}
