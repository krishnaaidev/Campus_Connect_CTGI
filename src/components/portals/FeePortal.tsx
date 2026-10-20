import React, { useState, useEffect } from 'react';
import { User, FeeRecord, FeeTransaction } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  CreditCard, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  AlertCircle,
  Receipt
} from 'lucide-react';

interface FeePortalProps {
  staff: User;
}

export const FeePortal: React.FC<FeePortalProps> = ({ staff }) => {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payCategory, setPayCategory] = useState<any>('TUITION');
  const [payMode, setPayMode] = useState<any>('UPI');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = () => {
    setFees(StorageService.getFees());
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0 || !selectedStudentId) return;

    const record = StorageService.recordPayment(
      selectedStudentId,
      amt,
      payCategory,
      payMode,
      staff.name
    );

    if (record) {
      loadFees();
      setShowPaymentModal(false);
      setPayAmount('');
      setSuccessMsg(`Recorded payment of ₹${amt.toLocaleString()} for ${record.studentName}.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  };

  const handleReconcile = (studentId: string, txId: string) => {
    StorageService.reconcilePayment(studentId, txId, staff.name);
    loadFees();
  };

  const filtered = fees.filter(f => 
    f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.studentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-emerald-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-emerald-400">
            <CreditCard className="w-4 h-4" />
            <span>Accounts & Finance Section</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Fee Collection & Reconciliation</h1>
          <p className="text-xs text-emerald-300 mt-0.5">Staff Officer: <strong className="text-white">{staff.name}</strong> • Accounts Ledger</p>
        </div>

        <button
          onClick={() => {
            setSelectedStudentId(fees[0]?.studentId || '');
            setShowPaymentModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Fee Payment</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search and Records */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500">{filtered.length} Student Fee Accounts</span>
        </div>

        <div className="space-y-4">
          {filtered.map((record) => (
            <div key={record.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{record.studentName}</div>
                  <div className="text-[11px] font-mono font-semibold text-brand-700">{record.studentNumber} • {record.department}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Outstanding</span>
                    <strong className={`font-mono text-sm ${record.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ₹{record.outstandingBalance.toLocaleString()}
                    </strong>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    record.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </div>

              {/* Fee Component Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
                <div>Tuition: <strong className="text-slate-900">₹{record.tuitionFee.toLocaleString()}</strong></div>
                {record.hostelFee && <div>Hostel: <strong className="text-slate-900">₹{record.hostelFee.toLocaleString()}</strong></div>}
                {record.messFee && <div>Mess: <strong className="text-slate-900">₹{record.messFee.toLocaleString()}</strong></div>}
                <div>Exam: <strong className="text-slate-900">₹{record.examFee.toLocaleString()}</strong></div>
              </div>

              {/* Transactions List */}
              <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Recorded Receipts:</span>
                {record.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-800">₹{tx.amount.toLocaleString()} ({tx.category})</span>
                      <span className="text-slate-400 font-mono ml-2">[{tx.receiptNumber}] • Mode: {tx.paymentMode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tx.status === 'RECONCILED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                      {tx.status !== 'RECONCILED' && (
                        <button
                          onClick={() => handleReconcile(record.studentId, tx.id)}
                          className="text-[10px] bg-slate-900 hover:bg-slate-800 text-white px-2 py-0.5 rounded font-semibold"
                        >
                          Reconcile
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Record Official Student Fee Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  {fees.map((f) => (
                    <option key={f.studentId} value={f.studentId}>
                      {f.studentName} ({f.studentNumber}) — Dues: ₹{f.outstandingBalance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 30000"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Fee Category</label>
                  <select
                    value={payCategory}
                    onChange={(e) => setPayCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="TUITION">Tuition Fee</option>
                    <option value="HOSTEL">Hostel Fee</option>
                    <option value="MESS">Mess Fee</option>
                    <option value="EXAM">Exam Fee</option>
                    <option value="TRANSPORT">Transport Fee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={payMode}
                    onChange={(e) => setPayMode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="ONLINE">Online Portal</option>
                    <option value="UPI">UPI / QR Payment</option>
                    <option value="DEMAND_DRAFT">Demand Draft</option>
                    <option value="BANK_TRANSFER">Bank NEFT/RTGS</option>
                    <option value="CASH">Cash Counter</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md">Record & Generate Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
