import React, { useState, useEffect } from 'react';
import { User, UserRole, InstitutionalPolicy, AuditLog } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Settings, 
  Users, 
  ShieldAlert, 
  History, 
  PlusCircle, 
  CheckCircle2, 
  RotateCcw, 
  Save, 
  Search,
  Lock,
  UserCheck
} from 'lucide-react';

interface AdminPortalProps {
  admin: User;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ admin }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'policy' | 'audit'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [policy, setPolicy] = useState<InstitutionalPolicy>(StorageService.getPolicy());
  const [searchUser, setSearchUser] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('STUDENT_HOSTELLER');
  const [newDept, setNewDept] = useState('Computer Science & Engineering');
  const [newPhone, setNewPhone] = useState('+91 98765 00000');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(StorageService.getUsers());
    setAuditLogs(StorageService.getAuditLogs());
    setPolicy(StorageService.getPolicy());
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updatePolicy(policy, admin.name);
    setSuccessBanner('Institutional policies updated and applied across all campus portals.');
    setTimeout(() => setSuccessBanner(null), 4000);
    loadData();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const isStudent = newRole.startsWith('STUDENT');
    const newUser: User = {
      id: `user-${Date.now()}`,
      institutionUserId: `CTGI/2026/${isStudent ? 'STD' : 'FAC'}/${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      department: newDept,
      studentType: newRole === 'STUDENT_HOSTELLER' ? 'HOSTELLER' : newRole === 'STUDENT_DAYSCHOLAR' ? 'DAY_SCHOLAR' : undefined,
      active: true,
      createdAt: new Date().toISOString()
    };

    StorageService.createUser(newUser);
    setShowAddUserModal(false);
    setNewName('');
    setNewEmail('');
    loadData();
    setSuccessBanner(`User [${newUser.institutionUserId}] created successfully.`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleResetSeedData = () => {
    if (confirm('Are you sure you want to reset all test data back to standard demo state?')) {
      StorageService.resetToDefaults();
      loadData();
      setSuccessBanner('Storage successfully reset to official default seed state.');
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.institutionUserId.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-rose-400">
            <Lock className="w-4 h-4" />
            <span>Campus IT Administration & Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-1">Institutional Admin Console</h1>
          <p className="text-xs text-slate-400 mt-0.5">Administrator: <strong className="text-white">{admin.name}</strong> • Global System Control</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSeedData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-3.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Accounts & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('policy')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'policy' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Institutional Policies & Rules
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'audit' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search users by name, roll no, or role..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredUsers.map((u) => (
              <div key={u.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={u.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{u.institutionUserId} • {u.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    {u.role.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POLICIES TAB */}
      {activeTab === 'policy' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Institutional Calendar & Gate Pass Policies</h2>
            <p className="text-xs text-slate-500">Configurable parameters enforcing validation rules and deadline state transitions.</p>
          </div>

          <form onSubmit={handleSavePolicy} className="space-y-4 text-xs max-w-2xl">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Institution Name</label>
              <input
                type="text"
                value={policy.collegeName}
                onChange={(e) => setPolicy({ ...policy, collegeName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Working Hours Start</label>
                <input
                  type="text"
                  value={policy.workingHoursStart}
                  onChange={(e) => setPolicy({ ...policy, workingHoursStart: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Working Hours End</label>
                <input
                  type="text"
                  value={policy.workingHoursEnd}
                  onChange={(e) => setPolicy({ ...policy, workingHoursEnd: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Day Scholar 2:00 PM Deadline Cutoff</label>
                <input
                  type="text"
                  value={policy.dayScholarPassDeadline}
                  onChange={(e) => setPolicy({ ...policy, dayScholarPassDeadline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Submissions past this time require supervisor clearance.</span>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Hosteller Evening Curfew Time</label>
                <input
                  type="text"
                  value={policy.hostellerCurfewTime}
                  onChange={(e) => setPolicy({ ...policy, hostellerCurfewTime: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Default 7:30 PM curfew for student outings.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={policy.requireDualApprovalForHosteller}
                  onChange={(e) => setPolicy({ ...policy, requireDualApprovalForHosteller: e.target.checked })}
                  className="w-4 h-4 text-brand-600 rounded"
                />
                <span>Mandate Dual Approval for Hosteller Gate Passes (Academic Incharge + Hostel Warden)</span>
              </label>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Policy Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <h2 className="font-bold text-slate-900 text-sm">System Audit Trail & Security Logs</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Append-only log</span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">
                    <span className="font-mono text-brand-700 font-semibold mr-1.5">[{log.action}]</span>
                    {log.details}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Actor: <strong>{log.actorName}</strong> ({log.actorRole}) • Entity: {log.entityType} ({log.entityId})
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Create Authorized Campus Account</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaspreet Kaur"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jaspreet.kaur@ctgroup.in"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="STUDENT_HOSTELLER">Student (Hosteller)</option>
                  <option value="STUDENT_DAYSCHOLAR">Student (Day Scholar)</option>
                  <option value="GATEKEEPER">Gatekeeper (Gate Camera App)</option>
                  <option value="SECURITY_GUARD">Security Guard</option>
                  <option value="HOSTEL_WARDEN">Hostel Warden</option>
                  <option value="CLASS_INCHARGE">Class Incharge</option>
                  <option value="HOD">Head of Department (HOD)</option>
                  <option value="HOI">Head of Institution (HOI)</option>
                  <option value="FEE_STAFF">Fee Collection Staff</option>
                  <option value="DRCC_STAFF">DRCC Staff</option>
                  <option value="DEAN_STUDENT_WELFARE">Dean Student Welfare</option>
                  <option value="CAMPUS_DIRECTOR">Campus Director</option>
                  <option value="OTHER_DIRECTORS">Other Directors</option>
                  <option value="PLACEMENT_CELL">Placement Cell Officer</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
