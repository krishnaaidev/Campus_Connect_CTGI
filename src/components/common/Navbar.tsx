import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import { AuthService } from '../../services/auth';
import { StorageService } from '../../services/storage';
import { formatKolkataTime, CT_CAMPUSES } from '../../config/institution';
import { 
  Bell, 
  Clock, 
  LogOut, 
  Shield, 
  GraduationCap, 
  User as UserIcon,
  CheckCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  Building2,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  user: User;
  onOpenMobileMenu?: () => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onOpenMobileMenu, onOpenAuthModal }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCampusMenu, setShowCampusMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(formatKolkataTime(new Date(), { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      setNotifications(StorageService.getNotifications(user.id));
    }
  }, [user, showNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    notifications.forEach(n => StorageService.markNotificationRead(n.id));
    setNotifications(StorageService.getNotifications(user.id));
  };

  const getRoleBadgeColor = (role: string) => {
    if (role.startsWith('STUDENT')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (role === 'GATEKEEPER' || role === 'SECURITY_GUARD') return 'bg-amber-100 text-amber-800 border-amber-200';
    if (role === 'HOSTEL_WARDEN') return 'bg-purple-100 text-purple-800 border-purple-200';
    if (role === 'ADMINISTRATOR') return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-700/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">
                    Campus<span className="text-brand-600">Connect</span>
                  </span>
                  <span className="text-[10px] bg-brand-50 text-brand-700 font-bold px-1.5 py-0.5 rounded border border-brand-200">
                    CTGI
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 hidden sm:block font-medium">
                  CT Group of Institutions — Smart Student Portal
                </div>
              </div>
            </div>
          </div>

          {/* Campus Selector & Multi-Campus Status */}
          <div className="relative">
            <button
              onClick={() => setShowCampusMenu(!showCampusMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 rounded-full text-xs font-bold transition-all shadow-2xs"
              title="CT Group Multi-Campus Status"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Shahpur Campus</span>
              <span className="inline sm:hidden">Shahpur</span>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live
              </span>
              <ChevronDown className="w-3 h-3 text-emerald-700 ml-0.5" />
            </button>

            {/* Campuses Dropdown Menu */}
            {showCampusMenu && (
              <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 animate-in fade-in slide-in-from-top-2">
                <div className="pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand-600" />
                    CT Group Campuses (3 Campuses)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">1 Live • 2 In Progress</span>
                </div>

                <div className="space-y-1.5">
                  {CT_CAMPUSES.map((camp) => (
                    <div
                      key={camp.id}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        camp.status === 'ACTIVE'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200/80 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{camp.name}</span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            camp.status === 'ACTIVE'
                              ? 'bg-emerald-600 text-white shadow-2xs'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {camp.statusLabel}
                        </span>
                      </div>
                      <p className="text-[10.5px] mt-1 text-slate-500 leading-snug">
                        {camp.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium">
                  Currently serving Shahpur Campus • Other campuses rolling out soon
                </div>
              </div>
            )}
          </div>

          {/* Live Asia/Kolkata Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full border border-slate-200/80 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5 text-brand-600" />
            <span className="font-medium">{currentTime}</span>
            <span className="text-[10px] font-semibold bg-white text-brand-700 px-1.5 py-0.5 rounded shadow-2xs">IST</span>
          </div>

          {/* Right: Role, Notifications, Switch Account, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Role Badge */}
            <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${getRoleBadgeColor(user.role)}`}>
              <Shield className="w-3 h-3" />
              <span>{user.role.replace(/_/g, ' ')}</span>
            </span>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 py-2 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 text-xs hover:bg-slate-50 transition-colors ${!n.read ? 'bg-brand-50/40' : ''}`}>
                          <div className="flex items-start gap-2">
                            <div className="p-1.5 rounded bg-brand-100 text-brand-700 shrink-0 mt-0.5">
                              {n.type === 'PASS_APPROVED' ? <CheckCircle className="w-3.5 h-3.5" /> : 
                               n.type === 'PASS_REJECTED' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> :
                               <FileText className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800">{n.title}</div>
                              <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                              <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>



            {/* Profile Avatar & Identity */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <img
                src={user.avatarUrl || (user.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150')}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100"
              />
              <div className="hidden lg:block text-left">
                <div className="font-semibold text-xs text-slate-900 leading-tight flex items-center gap-1">
                  <span>{user.name}</span>
                  <span className="text-[10px] px-1 rounded bg-slate-100 text-slate-600 font-normal">
                    {user.gender === 'FEMALE' ? 'F' : 'M'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {user.institutionUserId}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => AuthService.logout()}
                title="Sign Out"
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
