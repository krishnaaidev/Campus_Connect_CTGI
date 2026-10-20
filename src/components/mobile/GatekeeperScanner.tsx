import React, { useState, useEffect, useRef } from 'react';
import { User, GateEvent, GatePassRequest } from '../../types';
import { QRService, VerificationResult } from '../../services/qr';
import { StorageService } from '../../services/storage';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  CameraOff, 
  CheckCircle2, 
  XCircle, 
  LogOut, 
  LogIn, 
  Search, 
  ShieldAlert, 
  History, 
  Sparkles,
  RefreshCw,
  Clock,
  MapPin,
  Building
} from 'lucide-react';

interface GatekeeperScannerProps {
  operator: User;
}

export const GatekeeperScanner: React.FC<GatekeeperScannerProps> = ({ operator }) => {
  const [selectedGate, setSelectedGate] = useState<string>('Main Gate #1');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [recentEvents, setRecentEvents] = useState<GateEvent[]>([]);
  const [recordingStatus, setRecordingStatus] = useState<string | null>(null);

  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'gatekeeper-qr-reader';

  useEffect(() => {
    setRecentEvents(StorageService.getGateEvents().slice(0, 10));
  }, []);

  // Initialize and stop camera scanning
  const startCamera = async () => {
    setCameraError(null);
    setVerificationResult(null);
    try {
      if (!qrReaderRef.current) {
        qrReaderRef.current = new Html5Qrcode(scannerContainerId);
      }
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await qrReaderRef.current.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
          stopCamera();
        },
        (errorMessage) => {
          // Ignore transient frame errors
        }
      );
      setIsScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(err?.message || 'Unable to access device camera. Please check camera permissions or use manual pass code input.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (qrReaderRef.current && isScanning) {
      try {
        await qrReaderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping camera:', e);
      }
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      if (qrReaderRef.current && isScanning) {
        qrReaderRef.current.stop().catch(() => {});
      }
    };
  }, [isScanning]);

  const handleScanSuccess = (rawScannedData: string) => {
    // Perform server-side validation
    const result = QRService.verifyPass(rawScannedData);
    setVerificationResult(result);
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const result = QRService.verifyPass(manualInput.trim());
    setVerificationResult(result);
  };

  const handleRecordMovement = (eventType: 'EXIT' | 'RETURN') => {
    if (!verificationResult?.pass) return;

    try {
      const event = QRService.recordMovement(
        verificationResult.pass.id,
        eventType,
        operator.id,
        operator.name,
        selectedGate
      );

      setRecordingStatus(`Success: ${eventType} recorded for ${event.studentName} at ${selectedGate}`);
      setRecentEvents(StorageService.getGateEvents().slice(0, 10));

      // Re-verify to update status
      const updatedResult = QRService.verifyPass(verificationResult.pass.id);
      setVerificationResult(updatedResult);

      setTimeout(() => setRecordingStatus(null), 4000);
    } catch (err: any) {
      alert(`Error recording event: ${err.message}`);
    }
  };

  // Quick tester presets to simulate scanning different pass states instantly
  const testSamples = [
    { label: 'Test Approved Pass (GP-2026-1049)', passNumber: 'GP-2026-1049' },
    { label: 'Test Day Scholar (DS-2026-0412)', passNumber: 'DS-2026-0412' },
    { label: 'Test Pending Pass (GP-2026-1052)', passNumber: 'GP-2026-1052' },
    { label: 'Test Invalid / Forged Pass', passNumber: 'INVALID-PASS-999' }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Header Card for Gatekeeper */}
      <div className="bg-navy-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Gatekeeper Operational Station</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">Campus QR Gate Scanner</h1>
            <p className="text-xs text-slate-300 mt-0.5">Operator: <strong className="text-white">{operator.name}</strong> • Security Staff</p>
          </div>

          {/* Gate Selection Dropdown */}
          <div className="bg-navy-800 border border-navy-700 rounded-xl p-2">
            <label className="block text-[10px] text-slate-400 font-semibold uppercase mb-1">Active Gate</label>
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              className="bg-navy-900 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-navy-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="Main Gate #1">Main Gate #1 (Primary)</option>
              <option value="Hostel Gate #2">Hostel Gate #2 (Residential)</option>
              <option value="Sports Complex Gate #3">Gate #3 (Sports Complex)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recording Status Banner */}
      {recordingStatus && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{recordingStatus}</span>
        </div>
      )}

      {/* Main Scanner Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-brand-600" />
            <span className="font-bold text-slate-900 text-sm">Camera Verification</span>
          </div>
          {isScanning ? (
            <button
              onClick={stopCamera}
              className="text-xs bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors"
            >
              <CameraOff className="w-3.5 h-3.5" /> Stop Camera
            </button>
          ) : (
            <button
              onClick={startCamera}
              className="text-xs bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Camera className="w-3.5 h-3.5" /> Start Live Camera
            </button>
          )}
        </div>

        {/* Video Scanner Container */}
        <div className="mt-4">
          <div 
            id={scannerContainerId} 
            className={`w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed ${
              isScanning ? 'border-brand-500 shadow-lg' : 'border-slate-300'
            }`}
          >
            {!isScanning && (
              <div className="p-8 text-center text-slate-400">
                <Camera className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-600">Camera is currently inactive</p>
                <p className="text-[11px] text-slate-400 mt-1">Tap "Start Live Camera" to scan student's QR pass or choose a sample test pass below</p>
              </div>
            )}
          </div>

          {cameraError && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Camera Access Note:</span> {cameraError}
              </div>
            </div>
          )}
        </div>

        {/* Manual Pass ID Fallback Search */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Manual Pass Search / Emergency Verification Fallback:
          </label>
          <form onSubmit={handleManualSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Enter Pass # (e.g. GP-2026-1049) or Roll No..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
            >
              Verify Pass
            </button>
          </form>

          {/* Quick Demo Test Buttons */}
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400 font-medium">Quick Test:</span>
            {testSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setManualInput(sample.passNumber);
                  const result = QRService.verifyPass(sample.passNumber);
                  setVerificationResult(result);
                }}
                className="text-[10px] bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-600 px-2 py-1 rounded-md border border-slate-200 transition-colors"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Verification Result Card: High-Contrast ALLOW / DENY Screen */}
      {verificationResult && (
        <div className={`rounded-2xl border-2 p-5 shadow-xl transition-all animate-in zoom-in-95 ${
          verificationResult.status === 'ALLOW' 
            ? 'bg-emerald-50/90 border-emerald-500' 
            : 'bg-rose-50/90 border-rose-500'
        }`}>
          {/* Status Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/10">
            <div className="flex items-center gap-3">
              {verificationResult.status === 'ALLOW' ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
                  <XCircle className="w-7 h-7" />
                </div>
              )}
              <div>
                <div className={`text-2xl font-black tracking-tight ${
                  verificationResult.status === 'ALLOW' ? 'text-emerald-900' : 'text-rose-900'
                }`}>
                  {verificationResult.status === 'ALLOW' ? 'ALLOW GATE ACCESS' : 'DENY GATE ACCESS'}
                </div>
                <div className={`text-xs font-semibold ${
                  verificationResult.status === 'ALLOW' ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {verificationResult.reason}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setVerificationResult(null)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold p-1.5"
            >
              Clear
            </button>
          </div>

          {/* Student Profile Info (Only verified minimal fields shown for privacy) */}
          {verificationResult.pass && (
            <div className="mt-4 pt-2 space-y-4">
              <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-xl border border-black/5 shadow-2xs">
                <img
                  src={verificationResult.photoUrl}
                  alt={verificationResult.studentName}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-base leading-tight truncate">
                    {verificationResult.studentName}
                  </div>
                  <div className="text-xs font-mono font-semibold text-brand-700">
                    {verificationResult.studentNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    {verificationResult.department} • {verificationResult.hostelInfo}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded">
                    {verificationResult.pass.passNumber}
                  </span>
                </div>
              </div>

              {/* Time Window & Destination */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-black/5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Outing Window</span>
                  <span className="font-bold text-slate-800">{verificationResult.validWindow}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-black/5">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Destination</span>
                  <span className="font-bold text-slate-800 truncate block">{verificationResult.pass.destination}</span>
                </div>
              </div>

              {/* One-Tap Action Buttons for Gatekeeper */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {verificationResult.canRecordExit && (
                  <button
                    onClick={() => handleRecordMovement('EXIT')}
                    className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>CONFIRM & RECORD EXIT</span>
                  </button>
                )}

                {verificationResult.canRecordReturn && (
                  <button
                    onClick={() => handleRecordMovement('RETURN')}
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98]"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>CONFIRM & RECORD RETURN</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Gate Events Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">Today's Gate Movements Log</span>
          </div>
          <button 
            onClick={() => setRecentEvents(StorageService.getGateEvents().slice(0, 10))}
            className="text-[11px] text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Refresh
          </button>
        </div>

        <div className="mt-3 divide-y divide-slate-100">
          {recentEvents.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No gate movement events recorded yet today.
            </div>
          ) : (
            recentEvents.map((evt) => (
              <div key={evt.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`p-1.5 rounded-lg ${
                    evt.eventType === 'EXIT' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {evt.eventType === 'EXIT' ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900">{evt.studentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{evt.passNumber} • {evt.gateNumber}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    evt.eventType === 'EXIT' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {evt.eventType}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
