// CampusConnect CTGI — Approval Workflow Engine
import { GatePassRequest, UserRole, PassStatus, PassType } from '../types';
import { StorageService } from './storage';
import { isBeforeDayScholarDeadline } from '../config/institution';

export class ApprovalService {
  /**
   * Generates next sequential pass number (e.g. GP-2026-1053 or DS-2026-0413)
   */
  public static generatePassNumber(type: PassType): string {
    const prefix = type === 'DAY_SCHOLAR_PASS' ? 'DS' : type === 'EXTENDED_LEAVE' ? 'LV' : 'GP';
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${randomNum}`;
  }

  /**
   * Submits a new gate pass request following institutional routing policies
   */
  public static submitRequest(params: {
    studentId: string;
    requestType: PassType;
    purpose: string;
    destination: string;
    departureTime: string;
    expectedReturnTime: string;
    academicApproverRole?: 'CLASS_INCHARGE' | 'HOD' | 'HOI';
  }): GatePassRequest {
    const student = StorageService.getUser(params.studentId);
    if (!student) throw new Error('Student account not found');

    const now = new Date();
    const isDayScholar = student.studentType === 'DAY_SCHOLAR';
    const isLateSubmission = isDayScholar && !isBeforeDayScholarDeadline(now);
    const passNumber = this.generatePassNumber(params.requestType);
    const academicRole = params.academicApproverRole || 'CLASS_INCHARGE';

    const approvalSteps: any[] = [];
    let initialStatus: PassStatus = 'PENDING_APPROVAL';

    if (student.studentType === 'HOSTELLER') {
      // Hosteller requires BOTH Academic and Warden approvals!
      initialStatus = 'PENDING_BOTH';
      approvalSteps.push({
        id: `step-${Date.now()}-1`,
        role: academicRole,
        approverName: student.classInchargeName || 'Department Faculty',
        status: 'PENDING'
      });
      approvalSteps.push({
        id: `step-${Date.now()}-2`,
        role: 'HOSTEL_WARDEN',
        approverName: student.wardenName || 'Hostel Warden',
        status: 'PENDING'
      });
    } else {
      // Day Scholar requires Academic Incharge approval
      initialStatus = 'PENDING_APPROVAL';
      approvalSteps.push({
        id: `step-${Date.now()}-1`,
        role: academicRole,
        approverName: student.classInchargeName || 'Class Incharge',
        status: 'PENDING'
      });
    }

    const newPass: GatePassRequest = {
      id: `pass-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      passNumber,
      studentId: student.id,
      studentName: student.name,
      studentNumber: student.institutionUserId,
      studentType: student.studentType || 'DAY_SCHOLAR',
      department: student.department || 'General',
      semester: student.semester || 1,
      phone: student.phone,
      guardianPhone: student.guardianPhone,
      hostelInfo: student.hostelBlock ? `${student.hostelBlock} ${student.roomNumber || ''}` : undefined,
      requestType: params.requestType,
      purpose: params.purpose,
      destination: params.destination,
      departureTime: params.departureTime,
      expectedReturnTime: params.expectedReturnTime,
      isLateSubmission,
      status: initialStatus,
      submittedAt: now.toISOString(),
      academicApproverRole: academicRole,
      approvalSteps
    };

    StorageService.saveGatePass(newPass);

    // Audit log
    StorageService.logAudit(
      student.id,
      student.name,
      student.role,
      'SUBMIT_GATE_PASS',
      'GATE_PASS',
      newPass.id,
      `Submitted ${params.requestType} [${passNumber}]${isLateSubmission ? ' (Late Request flagged after 2:00 PM)' : ''}`
    );

    // Notify student
    StorageService.sendNotification({
      userId: student.id,
      title: 'Pass Application Submitted',
      message: `Your request ${passNumber} has been routed for official authority approval.`,
      type: 'PASS_SUBMITTED'
    });

    return newPass;
  }

  /**
   * Approver signs off on a pending step
   */
  public static approveStep(
    passId: string,
    approverRole: UserRole,
    approverId: string,
    approverName: string,
    remarks?: string
  ): GatePassRequest {
    const pass = StorageService.getGatePass(passId);
    if (!pass) throw new Error('Gate pass not found');

    const step = pass.approvalSteps.find(s => s.role === approverRole && s.status === 'PENDING');
    if (!step) {
      throw new Error(`No pending approval step for role ${approverRole}`);
    }

    step.status = 'APPROVED';
    step.approverId = approverId;
    step.approverName = approverName;
    step.decidedAt = new Date().toISOString();
    step.remarks = remarks || 'Approved by authority';

    // Check if ALL required steps are approved
    const allApproved = pass.approvalSteps.every(s => s.status === 'APPROVED');
    
    if (allApproved) {
      pass.status = 'APPROVED';
      pass.tokenHash = `ctgi-token-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      pass.validFrom = pass.departureTime;
      pass.validUntil = pass.expectedReturnTime;

      // Notify student
      StorageService.sendNotification({
        userId: pass.studentId,
        title: 'Gate Pass Approved!',
        message: `Your pass ${pass.passNumber} is fully approved. Open digital pass to view scannable QR.`,
        type: 'PASS_APPROVED'
      });
    } else {
      // Partial approval (e.g. Warden approved, still waiting for Academic)
      const pendingStep = pass.approvalSteps.find(s => s.status === 'PENDING');
      if (pendingStep?.role === 'HOSTEL_WARDEN') {
        pass.status = 'PENDING_WARDEN';
      } else {
        pass.status = 'PENDING_ACADEMIC';
      }
    }

    StorageService.saveGatePass(pass);

    // Audit log
    StorageService.logAudit(
      approverId,
      approverName,
      approverRole,
      'APPROVE_GATE_PASS_STEP',
      'GATE_PASS',
      pass.id,
      `Step [${approverRole}] approved for ${pass.passNumber}. Remarks: ${remarks || 'None'}`
    );

    return pass;
  }

  /**
   * Approver rejects the pass request
   */
  public static rejectStep(
    passId: string,
    approverRole: UserRole,
    approverId: string,
    approverName: string,
    reason: string
  ): GatePassRequest {
    const pass = StorageService.getGatePass(passId);
    if (!pass) throw new Error('Gate pass not found');

    const step = pass.approvalSteps.find(s => s.role === approverRole);
    if (step) {
      step.status = 'REJECTED';
      step.approverId = approverId;
      step.approverName = approverName;
      step.decidedAt = new Date().toISOString();
      step.remarks = reason;
    }

    // Immediate rejection of the entire pass
    pass.status = 'REJECTED';
    pass.rejectionReason = reason;

    StorageService.saveGatePass(pass);

    // Notify student
    StorageService.sendNotification({
      userId: pass.studentId,
      title: 'Gate Pass Rejected',
      message: `Your pass ${pass.passNumber} was rejected by ${approverName} (${approverRole}). Reason: ${reason}`,
      type: 'PASS_REJECTED'
    });

    // Audit log
    StorageService.logAudit(
      approverId,
      approverName,
      approverRole,
      'REJECT_GATE_PASS',
      'GATE_PASS',
      pass.id,
      `Rejected pass ${pass.passNumber}. Reason: ${reason}`
    );

    return pass;
  }

  /**
   * Student cancels a pending request
   */
  public static cancelRequest(passId: string, studentId: string): GatePassRequest {
    const pass = StorageService.getGatePass(passId);
    if (!pass) throw new Error('Gate pass not found');
    if (pass.studentId !== studentId) throw new Error('Unauthorized');

    if (pass.status === 'EXIT_RECORDED' || pass.status === 'RETURN_RECORDED') {
      throw new Error('Cannot cancel an already-utilized pass');
    }

    pass.status = 'CANCELLED';
    StorageService.saveGatePass(pass);

    StorageService.logAudit(
      studentId,
      pass.studentName,
      'STUDENT',
      'CANCEL_GATE_PASS',
      'GATE_PASS',
      pass.id,
      `Student cancelled pass application ${pass.passNumber}`
    );

    return pass;
  }

  /**
   * Warden or Admin revokes an approved pass
   */
  public static revokePass(passId: string, actorId: string, actorName: string, actorRole: string, reason: string): GatePassRequest {
    const pass = StorageService.getGatePass(passId);
    if (!pass) throw new Error('Gate pass not found');

    pass.status = 'REVOKED';
    pass.rejectionReason = `Revoked: ${reason}`;
    StorageService.saveGatePass(pass);

    StorageService.sendNotification({
      userId: pass.studentId,
      title: 'Pass Revoked by Authority',
      message: `Your gate pass ${pass.passNumber} has been revoked by ${actorName}. Reason: ${reason}`,
      type: 'PASS_REJECTED'
    });

    StorageService.logAudit(
      actorId,
      actorName,
      actorRole,
      'REVOKE_GATE_PASS',
      'GATE_PASS',
      pass.id,
      `Revoked pass ${pass.passNumber}. Reason: ${reason}`
    );

    return pass;
  }
}
