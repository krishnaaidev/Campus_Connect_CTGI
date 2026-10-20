import React, { useState, useEffect } from 'react';
import { User, GatePassRequest, HostelComplaint } from '../../types';
import { StorageService } from '../../services/storage';
import { ApprovalService } from '../../services/approvals';
import { 
  Building, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  UserCheck, 
  FileText,
  Wrench,
  Search,
  Filter
} from 'lucide-react';

interface WardenPortalProps {
  warden: User;
}

export const WardenPortal: React.FC<WardenPortalProps> = ({ warden }) => {
  const [activeWing, setActiveWing] = useState<'BOYS_HOSTEL' | 'GIRLS_HOSTEL'>(
    warden.hostelCategory || (warden.gender === 'FEMALE' ? 'GIRLS_HOSTEL' : 'BOYS_HOSTEL')
  );
  const [passes, setPasses] = useState<GatePassRequest[]>([]);
  const [complaints, setComplaints] = useState<HostelComplaint[]>([]);
  const [remarks, setRemarks] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [activeWing]);

  const loadData = () => {
    const allPasses = StorageService.getGatePasses();
    const allComplaints = StorageService.getComplaints();

    // Filter strictly by hostel wing (Boys ka Boys, Girls ka Girls)
    const wingPasses = allPasses.filter(p => {
      if (p.studentType !== 'HOSTELLER') return false;
      if (activeWing === 'BOYS_HOSTEL') return p.gender === 'MALE' || p.hostelCategory === 'BOYS_HOSTEL';
      return p.gender === 'FEMALE' || p.hostelCategory === 'GIRLS_HOSTEL';
    });

    const wingComplaints = allComplaints.filter(c => {
      if (activeWing === 'BOYS_HOSTEL') return c.gender === 'MALE' || c.hostelCategory === 'BOYS_HOSTEL' || c.roomInfo.includes('Boys') || c.roomInfo.includes('Tagore');
      return c.gender === 'FEMALE' || c.hostelCategory === 'GIRLS_HOSTEL' || c.roomInfo.includes('Girls') || c.roomInfo.includes('Sarojini');
    });

    setPasses(wingPasses);
    setComplaints(wingComplaints);
  };

  const handleApprove = (pass: GatePassRequest) => {
    try {
      ApprovalService.approveStep(
        pass.id,
        'HOSTEL_WARDEN',
        warden.id,
        warden.name,
        remarks || `Approved by ${activeWing === 'BOYS_HOSTEL' ? 'Boys' : 'Girls'} Hostel Warden`
      );
      setRemarks('');
      loadData();
      setActionSuccess(`Pass [${pass.passNumber}] approved for ${pass.studentName}`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReject = (pass: GatePassRequest) => {
    const reason = prompt('Please enter rejection reason:', 'Hostel rules violation or unexcused outing');
    if (!reason) return;
    try {
      ApprovalService.rejectStep(
        pass.id,
        'HOSTEL_WARDEN',
        warden.id,
        warden.name,
        reason
      );
      loadData();
      setActionSuccess(`Pass [${pass.passNumber}] rejected.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleResolveComplaint = (id: string) => {
    const rem = prompt('Enter resolution remarks:', 'Fixed by hostel maintenance team');
    if (!rem) return;
    StorageService.updateComplaintStatus(id, 'RESOLVED', rem);
    loadData();
  };

  // Pending for warden approval
  const pendingQueue = passes.filter(p => 
    p.status.startsWith('PENDING') &&
    p.approvalSteps.some(s => s.role === 'HOSTEL_WARDEN' && s.status === 'PENDING')
  );

  // Hostellers currently outside campus
  const currentlyOutside = passes.filter(p => p.status === 'EXIT_RECORDED');

  const curfewTime = activeWing === 'BOYS_HOSTEL' ? '7:30 PM IST' : '6:30 PM IST';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header with Wing Switcher */}
      <div className={`text-white rounded-3xl p-6 sm:p-8 shadow-xl transition-all ${
        activeWing === 'BOYS_HOSTEL' 
          ? 'bg-gradient-to-r from-navy-950 via-slate-900 to-blue-950' 
          : 'bg-gradient-to-r from-purple-950 via-slate-900 to-rose-950'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-brand-300">
              <Building className="w-4 h-4" />
              <span>Hostel Administration • {activeWing === 'BOYS_HOSTEL' ? 'Boys Wing' : 'Girls Wing'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1">
              {activeWing === 'BOYS_HOSTEL' ? 'Boys Hostel Management' : 'Girls Hostel Management'}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Warden: <strong className="text-white">{warden.name}</strong> • Strict Curfew: <span className="font-bold text-amber-300">{curfewTime}</span>
            </p>
          </div>

          {/* Wing Switcher */}
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveWing('BOYS_HOSTEL')}
              className={`py-2 px-3.5 rounded-xl transition-all ${
                activeWing === 'BOYS_HOSTEL' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Boys Hostels (Tagore/Gandhi)
            </button>
            <button
              onClick={() => setActiveWing('GIRLS_HOSTEL')}
              className={`py-2 px-3.5 rounded-xl transition-all ${
                activeWing === 'GIRLS_HOSTEL' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Girls Hostels (Sarojini/Kalpana)
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Applications</span>
          <span className="text-2xl font-black text-amber-600 mt-0.5 block">{pendingQueue.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Currently Outside</span>
          <span className="text-2xl font-black text-blue-600 mt-0.5 block">{currentlyOutside.length}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Evening Curfew</span>
          <span className="text-2xl font-black text-rose-600 mt-0.5 block">{curfewTime}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Open Complaints</span>
          <span className="text-2xl font-black text-purple-600 mt-0.5 block">
            {complaints.filter(c => c.status !== 'RESOLVED').length}
          </span>
        </div>
      </div>

      {/* Pending Approval Requests */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              {activeWing === 'BOYS_HOSTEL' ? 'Boys' : 'Girls'} Gate Pass Approval Queue
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500">{pendingQueue.length} Awaiting Sign-Off</span>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No pending applications in the {activeWing === 'BOYS_HOSTEL' ? 'Boys' : 'Girls'} hostel queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingQueue.map((pass) => (
              <div key={pass.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-slate-900 text-sm">{pass.passNumber}</span>
                    <span className="block text-[11px] text-purple-700 font-semibold">{pass.requestType.replace(/_/g, ' ')}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pass.gender === 'FEMALE' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pass.gender === 'FEMALE' ? 'Girls Hostel' : 'Boys Hostel'}
                  </span>
                </div>

                <div className="space-y-1 text-slate-700">
                  <div>Student: <strong>{pass.studentName}</strong> ({pass.studentNumber})</div>
                  <div>Room: <strong>{pass.hostelInfo}</strong> • Dept: {pass.department}</div>
                  <div>Destination: <strong>{pass.destination}</strong></div>
                  <div>Purpose: <span className="italic">{pass.purpose}</span></div>
                  <div>Guardian Contact: <strong>{pass.guardianPhone || 'On Record'}</strong></div>
                  <div>
                    Outing Window: {new Date(pass.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' — '}
                    {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px]">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Academic Clearance:</span>
                  {pass.approvalSteps.find(s => s.role !== 'HOSTEL_WARDEN')?.status === 'APPROVED' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Approved by Department
                    </span>
                  ) : (
                    <span className="text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> Department clearance pending
                    </span>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleReject(pass)}
                    className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(pass)}
                    className={`flex-1 py-2 text-white font-bold rounded-xl shadow-sm transition-colors ${
                      activeWing === 'BOYS_HOSTEL' ? 'bg-blue-700 hover:bg-blue-800' : 'bg-purple-700 hover:bg-purple-800'
                    }`}
                  >
                    Approve Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hostellers Currently Outside Campus Monitor */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              {activeWing === 'BOYS_HOSTEL' ? 'Boys' : 'Girls'} Outside Campus (Live Gate Feed)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">{currentlyOutside.length} Active Outings</span>
        </div>

        {currentlyOutside.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs">
            All resident {activeWing === 'BOYS_HOSTEL' ? 'male' : 'female'} students are currently inside hostel premises.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {currentlyOutside.map((pass) => (
              <div key={pass.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{pass.studentName} ({pass.studentNumber})</div>
                  <div className="text-[11px] text-slate-500">{pass.hostelInfo} • Destination: {pass.destination}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Exited at: {new Date(pass.actualExitTime || '').toLocaleTimeString()} via {pass.exitGate || 'Main Gate'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Expected by {new Date(pass.expectedReturnTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hostel Maintenance Complaints */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              {activeWing === 'BOYS_HOSTEL' ? 'Boys' : 'Girls'} Hostel Maintenance Complaints
            </h2>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {complaints.length === 0 ? (
            <div className="py-6 text-center text-slate-400 text-xs">
              No complaints in this hostel wing.
            </div>
          ) : (
            complaints.map((c) => (
              <div key={c.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.category} Issue — {c.roomInfo}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{c.complaintRef}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{c.description}</p>
                  {c.resolutionRemarks && (
                    <p className="text-emerald-700 text-[10px] font-medium mt-0.5">Resolution: {c.resolutionRemarks}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status}
                  </span>
                  {c.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolveComplaint(c.id)}
                      className="text-[11px] bg-slate-900 text-white px-2.5 py-1 rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
