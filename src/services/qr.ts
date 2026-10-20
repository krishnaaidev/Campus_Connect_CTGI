// CampusConnect CTGI — QR Verification and Token Service
import QRCode from 'qrcode';
import { GatePassRequest, GateEvent } from '../types';
import { StorageService } from './storage';

export interface VerificationResult {
  allow: boolean;
  status: 'ALLOW' | 'DENY';
  reason: string;
  pass?: GatePassRequest;
  studentName?: string;
  studentNumber?: string;
  department?: string;
  hostelInfo?: string;
  photoUrl?: string;
  passType?: string;
  validWindow?: string;
  canRecordExit: boolean;
  canRecordReturn: boolean;
}

export class QRService {
  /**
   * Generates a secure QR payload for a gate pass
   */
  public static generateQRPayload(pass: GatePassRequest): string {
    const payload = {
      pId: pass.id,
      pNum: pass.passNumber,
      sNum: pass.studentNumber,
      vTo: pass.validUntil || pass.expectedReturnTime,
      tok: pass.tokenHash || `ctgi-${pass.id.slice(-6)}`
    };
    return JSON.stringify(payload);
  }

  /**
   * Generates a data URL for QR Code display
   */
  public static async generateQRCodeDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  }

  /**
   * Verifies a scanned QR code text or manual pass number
   */
  public static verifyPass(scannedData: string): VerificationResult {
    const cleanData = scannedData.trim();
    if (!cleanData) {
      return {
        allow: false,
        status: 'DENY',
        reason: 'Empty QR code or pass input',
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    let passId = '';
    let passNumber = '';

    // Check if scannedData is JSON payload
    try {
      const parsed = JSON.parse(cleanData);
      if (parsed.pId) passId = parsed.pId;
      if (parsed.pNum) passNumber = parsed.pNum;
    } catch {
      // If not JSON, it could be raw pass number like "GP-2026-1049" or passId
      if (cleanData.startsWith('gp-') || cleanData.startsWith('pass-')) {
        passId = cleanData;
      } else {
        passNumber = cleanData;
      }
    }

    // Lookup pass from storage
    const pass = passId 
      ? StorageService.getGatePass(passId)
      : StorageService.getGatePassByNumber(passNumber);

    if (!pass) {
      return {
        allow: false,
        status: 'DENY',
        reason: `Pass record not found for [${passNumber || passId}]. Invalid or forged token.`,
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    const now = new Date();
    const student = StorageService.getUser(pass.studentId);
    const photoUrl = student?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    const baseResult = {
      pass,
      studentName: pass.studentName,
      studentNumber: pass.studentNumber,
      department: pass.department,
      hostelInfo: pass.hostelInfo || 'Day Scholar',
      photoUrl,
      passType: pass.requestType === 'DAY_SCHOLAR_PASS' ? 'Day Scholar Outing' : pass.requestType === 'EXTENDED_LEAVE' ? 'Extended Leave' : 'Hostel Gate Outing',
      validWindow: `${new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — ${new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    // 1. Check status
    if (pass.status === 'REJECTED') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: `Pass REJECTED by college authorities. Reason: ${pass.rejectionReason || 'Permission not granted'}`,
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    if (pass.status === 'CANCELLED') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: 'Pass has been CANCELLED by the student.',
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    if (pass.status === 'REVOKED') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: 'Pass has been REVOKED by hostel warden / campus administration.',
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    if (pass.status === 'PENDING_BOTH' || pass.status === 'PENDING_ACADEMIC' || pass.status === 'PENDING_WARDEN' || pass.status === 'PENDING_APPROVAL') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: 'Pass is still PENDING APPROVAL. Official signature missing.',
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    if (pass.status === 'RETURN_RECORDED') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: `Pass already FULLY CONSUMED. Student returned on ${new Date(pass.actualReturnTime || '').toLocaleString()}. Token cannot be re-used.`,
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    // Check expiry
    const expiryDate = new Date(pass.validUntil || pass.expectedReturnTime);
    if (now > expiryDate && pass.status === 'APPROVED') {
      return {
        ...baseResult,
        allow: false,
        status: 'DENY',
        reason: `Pass EXPIRED on ${expiryDate.toLocaleTimeString()}. Student did not depart within approved window.`,
        canRecordExit: false,
        canRecordReturn: false
      };
    }

    // If currently APPROVED (ready for exit)
    if (pass.status === 'APPROVED') {
      return {
        ...baseResult,
        allow: true,
        status: 'ALLOW',
        reason: 'Valid and verified approved pass. Authorized for Campus Gate Exit.',
        canRecordExit: true,
        canRecordReturn: false
      };
    }

    // If currently EXIT_RECORDED (outside campus, ready for return)
    if (pass.status === 'EXIT_RECORDED') {
      const isLateReturn = now > expiryDate;
      return {
        ...baseResult,
        allow: true,
        status: isLateReturn ? 'DENY' : 'ALLOW',
        reason: isLateReturn 
          ? `OVERDUE RETURN WARNING: Expected by ${expiryDate.toLocaleTimeString()}. Record late return entry.`
          : 'Valid pass. Student returning to campus.',
        canRecordExit: false,
        canRecordReturn: true
      };
    }

    return {
      ...baseResult,
      allow: false,
      status: 'DENY',
      reason: `Invalid pass state: ${pass.status}`,
      canRecordExit: false,
      canRecordReturn: false
    };
  }

  /**
   * Records an official gate movement (EXIT or RETURN)
   */
  public static recordMovement(
    passId: string, 
    eventType: 'EXIT' | 'RETURN', 
    operatorId: string, 
    operatorName: string, 
    gateNumber: string = 'Main Gate #1'
  ): GateEvent {
    const pass = StorageService.getGatePass(passId);
    if (!pass) throw new Error('Gate pass not found');

    const now = new Date().toISOString();

    if (eventType === 'EXIT') {
      pass.status = 'EXIT_RECORDED';
      pass.actualExitTime = now;
      pass.recordedByGatekeeper = operatorName;
      pass.exitGate = gateNumber;
    } else {
      pass.status = 'RETURN_RECORDED';
      pass.actualReturnTime = now;
      pass.returnGate = gateNumber;
    }

    StorageService.saveGatePass(pass);

    const event: GateEvent = {
      id: `evt-${Date.now()}`,
      passId: pass.id,
      passNumber: pass.passNumber,
      studentName: pass.studentName,
      studentNumber: pass.studentNumber,
      eventType,
      operatorId,
      operatorName,
      gateNumber,
      timestamp: now,
      verificationResult: 'ALLOW'
    };

    StorageService.recordGateEvent(event);

    // Send push notification to student
    StorageService.sendNotification({
      userId: pass.studentId,
      title: eventType === 'EXIT' ? 'Campus Gate Exit Recorded' : 'Campus Gate Return Recorded',
      message: `Your gate ${eventType.toLowerCase()} was officially verified and recorded at ${gateNumber} at ${new Date(now).toLocaleTimeString()}.`,
      type: 'GATE_ACTIVITY'
    });

    return event;
  }
}
