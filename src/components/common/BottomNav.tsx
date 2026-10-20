import React from 'react';
import { UserRole } from '../../types';
import { 
  Home, 
  QrCode, 
  Calendar, 
  CreditCard, 
  Building, 
  Camera, 
  ShieldAlert, 
  Clock, 
  Users, 
  Settings 
} from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  onActionClick?: (action: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role, onActionClick }) => {
  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto text-[10px] font-semibold text-slate-500">
        
        {role.startsWith('STUDENT') && (
          <>
            <button 
              onClick={() => onActionClick?.('overview')} 
              className="flex flex-col items-center py-1 px-3 text-brand-600"
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span>Home</span>
            </button>
            <button 
              onClick={() => onActionClick?.('passes')} 
              className="flex flex-col items-center py-1 px-3 hover:text-slate-900"
            >
              <QrCode className="w-5 h-5 mb-0.5" />
              <span>Gate Pass</span>
            </button>
            <button 
              onClick={() => onActionClick?.('attendance')} 
              className="flex flex-col items-center py-1 px-3 hover:text-slate-900"
            >
              <Calendar className="w-5 h-5 mb-0.5" />
              <span>Attendance</span>
            </button>
            <button 
              onClick={() => onActionClick?.('fees')} 
              className="flex flex-col items-center py-1 px-3 hover:text-slate-900"
            >
              <CreditCard className="w-5 h-5 mb-0.5" />
              <span>Fees</span>
            </button>
          </>
        )}

        {role === 'GATEKEEPER' && (
          <>
            <button className="flex flex-col items-center py-1 px-6 text-brand-600 font-bold">
              <Camera className="w-5 h-5 mb-0.5" />
              <span>Camera Scanner</span>
            </button>
          </>
        )}

        {role === 'SECURITY_GUARD' && (
          <>
            <button className="flex flex-col items-center py-1 px-6 text-rose-600 font-bold">
              <ShieldAlert className="w-5 h-5 mb-0.5" />
              <span>Security Patrol Desk</span>
            </button>
          </>
        )}

        {role === 'HOSTEL_WARDEN' && (
          <>
            <button className="flex flex-col items-center py-1 px-6 text-purple-700 font-bold">
              <Building className="w-5 h-5 mb-0.5" />
              <span>Hostel Approvals</span>
            </button>
          </>
        )}

        {role === 'ADMINISTRATOR' && (
          <>
            <button className="flex flex-col items-center py-1 px-6 text-slate-900 font-bold">
              <Settings className="w-5 h-5 mb-0.5" />
              <span>Admin Settings</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};
