import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { QRService } from '../../services/qr';
import { GraduationCap, ShieldCheck, QrCode, Sparkles, Building2, Phone } from 'lucide-react';

interface DigitalIDCardProps {
  user: User;
  onClose?: () => void;
}

export const DigitalIDCard: React.FC<DigitalIDCardProps> = ({ user, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const payload = JSON.stringify({
      type: 'DIGITAL_STUDENT_ID',
      id: user.id,
      rollNo: user.institutionUserId,
      name: user.name,
      dept: user.department,
      typeStr: user.studentType,
      validUntil: '2026-07-31'
    });
    QRService.generateQRCodeDataUrl(payload).then(setQrCodeUrl);
  }, [user]);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-w-sm mx-auto">
      {/* College Header */}
      <div className="bg-gradient-to-r from-navy-900 via-brand-800 to-brand-700 text-white p-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide">CT GROUP OF INSTITUTIONS</div>
              <div className="text-[10px] text-brand-200 uppercase tracking-wider">Jalandhar, Punjab</div>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> VERIFIED
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 text-center">
        {/* Photo with frame */}
        <div className="relative inline-block mx-auto mb-3">
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user.name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-100 shadow-md mx-auto"
          />
          <span className={`absolute -bottom-2 -right-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-white ${
            user.studentType === 'HOSTELLER' ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            {user.studentType === 'HOSTELLER' ? 'Hosteller' : 'Day Scholar'}
          </span>
        </div>

        {/* Name & ID */}
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h3>
        <p className="text-xs font-mono font-semibold text-brand-700 mt-0.5">{user.institutionUserId}</p>
        
        {/* Department & Sem */}
        <div className="mt-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 text-left space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Department:</span>
            <span className="font-medium text-slate-900 truncate max-w-[190px]">{user.department || 'B.Tech CSE'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Semester:</span>
            <span className="font-medium text-slate-900">Semester {user.semester || 6} (Section {user.section || 'A'})</span>
          </div>
          {user.hostelBlock && (
            <div className="flex justify-between">
              <span className="text-slate-400">Hostel & Room:</span>
              <span className="font-medium text-purple-700">{user.hostelBlock} ({user.roomNumber})</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-400">Emergency Phone:</span>
            <span className="font-medium text-slate-900">{user.guardianPhone || user.phone}</span>
          </div>
        </div>

        {/* Scannable Verification QR */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 inline-block">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="Student Verification QR" className="w-28 h-28 mx-auto" />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
              <QrCode className="w-8 h-8 animate-pulse" />
            </div>
          )}
          <div className="text-[10px] text-slate-400 font-mono mt-1">Official Gate Scan ID</div>
        </div>

        {/* Footer */}
        <div className="mt-3 text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Valid Academic Year 2025–2026 • CTGI Campus</span>
        </div>
      </div>
    </div>
  );
};
