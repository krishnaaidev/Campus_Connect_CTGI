import React, { useState, useEffect } from 'react';
import { User } from './types';
import { AuthService } from './services/auth';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { AuthModal } from './components/auth/AuthModal';

// Portals
import { StudentPortal } from './components/portals/StudentPortal';
import { GatekeeperScanner } from './components/mobile/GatekeeperScanner';
import { SecurityGuardView } from './components/mobile/SecurityGuardView';
import { WardenPortal } from './components/portals/WardenPortal';
import { AcademicPortal } from './components/portals/AcademicPortal';
import { FeePortal } from './components/portals/FeePortal';
import { DrccPortal } from './components/portals/DrccPortal';
import { WelfarePortal } from './components/portals/WelfarePortal';
import { PlacementPortal } from './components/portals/PlacementPortal';
import { DirectorPortal } from './components/portals/DirectorPortal';
import { AdminPortal } from './components/portals/AdminPortal';
import { GraduationCap, LogIn, UserPlus, ShieldCheck, QrCode, Clock } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(AuthService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const renderActivePortal = () => {
    if (!currentUser) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-brand-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-700/30">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">CampusConnect Portal</h2>
              <p className="text-xs text-slate-500 mt-1">
                CT Group of Institutions — Official Student & Faculty Portal
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>New Student Registration</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Authorized Institutional Access Only • CTGI Campus</span>
            </div>
          </div>
        </div>
      );
    }

    switch (currentUser.role) {
      case 'STUDENT_HOSTELLER':
      case 'STUDENT_DAYSCHOLAR':
        return <StudentPortal student={currentUser} />;
      
      case 'GATEKEEPER':
        return <GatekeeperScanner operator={currentUser} />;
      
      case 'SECURITY_GUARD':
        return <SecurityGuardView guard={currentUser} />;
      
      case 'HOSTEL_WARDEN':
        return <WardenPortal warden={currentUser} />;
      
      case 'CLASS_INCHARGE':
      case 'HOD':
      case 'HOI':
        return <AcademicPortal faculty={currentUser} />;
      
      case 'FEE_STAFF':
        return <FeePortal staff={currentUser} />;
      
      case 'DRCC_STAFF':
        return <DrccPortal staff={currentUser} />;
      
      case 'DEAN_STUDENT_WELFARE':
        return <WelfarePortal dsw={currentUser} />;
      
      case 'PLACEMENT_CELL':
        return <PlacementPortal officer={currentUser} />;
      
      case 'CAMPUS_DIRECTOR':
      case 'OTHER_DIRECTORS':
        return <DirectorPortal director={currentUser} />;
      
      case 'ADMINISTRATOR':
        return <AdminPortal admin={currentUser} />;
      
      default:
        return <StudentPortal student={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-brand-600 selection:text-white pb-16 lg:pb-0">
      
      {/* Clean Header */}
      {currentUser && (
        <Navbar 
          user={currentUser} 
          onOpenAuthModal={() => setShowAuthModal(true)} 
        />
      )}

      {/* Dynamic Role Portal View */}
      <main className="flex-1">
        {renderActivePortal()}
      </main>

      {/* Touch-Friendly Bottom Nav on Mobile */}
      {currentUser && (
        <BottomNav 
          role={currentUser.role} 
          onActionClick={(action) => {
            if (action === 'switch') setShowAuthModal(true);
          }}
        />
      )}

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="font-semibold text-slate-800">
            CT Group of Institutions (CTGI) — Smart Campus Portal
          </div>
          <div className="text-[11px] text-slate-400">
            Approved by AICTE & PCI • Affiliated to IKG-PTU Jalandhar • Shahpur & Maqsudan Campuses
          </div>
        </div>
      </footer>

      {/* Sign In / Registration Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setCurrentUser(AuthService.getCurrentUser())}
      />

    </div>
  );
}

export default App;
