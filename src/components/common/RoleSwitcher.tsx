import React from 'react';
import { UserRole } from '../../types';
import { AuthService } from '../../services/auth';
import { ShieldCheck, UserCheck, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChanged?: () => void;
}

const ROLES_LIST: { role: UserRole; label: string; badge: string; category: string }[] = [
  { role: 'STUDENT_HOSTELLER', label: 'Student (Hosteller)', badge: 'Hostel Resident', category: 'Students' },
  { role: 'STUDENT_DAYSCHOLAR', label: 'Student (Day Scholar)', badge: 'Day Scholar', category: 'Students' },
  { role: 'GATEKEEPER', label: 'Gatekeeper (Mobile Scanner)', badge: 'Gate Camera App', category: 'Security & Gates' },
  { role: 'SECURITY_GUARD', label: 'Security Guard (Incident Desk)', badge: 'Patrol & Alerts', category: 'Security & Gates' },
  { role: 'HOSTEL_WARDEN', label: 'Hostel Warden', badge: 'Hostel Approvals', category: 'Hostel & Faculty' },
  { role: 'CLASS_INCHARGE', label: 'Class Incharge', badge: 'Academic Incharge', category: 'Hostel & Faculty' },
  { role: 'HOD', label: 'HOD (Computer Science)', badge: 'Head of Dept', category: 'Hostel & Faculty' },
  { role: 'HOI', label: 'Head of Institution (HOI)', badge: 'Director / HOI', category: 'Administration' },
  { role: 'FEE_STAFF', label: 'Fee Collection Staff', badge: 'Accounts & Ledger', category: 'Staff' },
  { role: 'DRCC_STAFF', label: 'DRCC Staff', badge: 'Student Welfare Queue', category: 'Staff' },
  { role: 'DEAN_STUDENT_WELFARE', label: 'Dean Student Welfare', badge: 'Grievance & Cases', category: 'Administration' },
  { role: 'CAMPUS_DIRECTOR', label: 'Campus Director', badge: 'Executive Board', category: 'Administration' },
  { role: 'OTHER_DIRECTORS', label: 'Other Directors', badge: 'Directorate', category: 'Administration' },
  { role: 'PLACEMENT_CELL', label: 'Placement Cell', badge: 'Career & Drives', category: 'Staff' },
  { role: 'ADMINISTRATOR', label: 'System Administrator', badge: 'Super Admin', category: 'Administration' },
];

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ currentRole, onRoleChanged }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelectRole = (role: UserRole) => {
    AuthService.switchRole(role);
    setIsOpen(false);
    if (onRoleChanged) onRoleChanged();
  };

  const currentRoleInfo = ROLES_LIST.find(r => r.role === currentRole) || ROLES_LIST[0];

  return (
    <div className="bg-navy-900 border-b border-navy-800 text-xs px-3 py-2 text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide uppercase text-[11px]">
            Demo Persona Switcher
          </span>
          <span className="hidden sm:inline-block text-slate-400">
            — Select any of the 14 institutional roles:
          </span>
        </div>

        {/* Dropdown for Mobile / Compact */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-600 text-white px-3 py-1.5 rounded-md font-medium shadow-sm transition-all text-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Active: {currentRoleInfo.label}</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 py-2 max-h-96 overflow-y-auto text-slate-800 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Select Role Persona</span>
                <span className="text-brand-600 font-bold">14 Portals</span>
              </div>
              {ROLES_LIST.map((item) => (
                <button
                  key={item.role}
                  onClick={() => handleSelectRole(item.role)}
                  className={`w-full text-left px-3.5 py-2 hover:bg-brand-50 flex items-center justify-between text-xs transition-colors ${
                    currentRole === item.role ? 'bg-brand-50/80 font-bold text-brand-700' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.category}</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    currentRole === item.role ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
