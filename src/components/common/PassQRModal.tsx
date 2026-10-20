import React, { useEffect, useState } from 'react';
import { GatePassRequest } from '../../types';
import { QRService } from '../../services/qr';
import { X, CheckCircle, Clock, MapPin, QrCode, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PassQRModalProps {
  pass: GatePassRequest;
  onClose: () => void;
}

export const PassQRModal: React.FC<PassQRModalProps> = ({ pass, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    const payload = QRService.generateQRPayload(pass);
    QRService.generateQRCodeDataUrl(payload).then(setQrCodeUrl);
  }, [pass]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={`p-4 text-white text-center ${
          pass.status === 'APPROVED' ? 'bg-gradient-to-r from-emerald-600 to-teal-700' :
          pass.status === 'EXIT_RECORDED' ? 'bg-gradient-to-r from-blue-600 to-indigo-700' :
          'bg-gradient-to-r from-slate-700 to-slate-800'
        }`}>
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Gate Pass</span>
          </div>
          <h2 className="text-xl font-black font-mono tracking-tight">{pass.passNumber}</h2>
          <span className="inline-block mt-1 text-[11px] font-bold px-3 py-0.5 rounded-full bg-white/20 backdrop-blur">
            {pass.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* QR Code Presentation */}
        <div className="p-5 text-center">
          <div className="p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 inline-block shadow-inner">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="Pass QR Code" className="w-48 h-48 mx-auto" />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center bg-slate-100 text-slate-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Present this QR code to the Gatekeeper at Campus Gate #1 / #2
          </p>

          {/* Key Pass Details */}
          <div className="mt-4 text-left bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Student:</span>
              <span className="font-bold text-slate-900">{pass.studentName} ({pass.studentNumber})</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500">Destination: </span>
                <span className="font-medium text-slate-800">{pass.destination}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500">Outing Window: </span>
                <span className="font-medium text-slate-800">
                  {new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {' — '}
                  {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Curfew / Valid Until:</span>
              <span className="font-bold text-rose-600">
                {new Date(pass.expectedReturnTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}{', '}
                {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Pass
          </button>
        </div>

      </div>
    </div>
  );
};
