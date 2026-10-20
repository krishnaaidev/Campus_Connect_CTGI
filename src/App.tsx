import React, { useState, useEffect } from 'react';
import { User } from './types';
import { AuthService } from './services/auth';
import { RoleSwitcher } from './components/common/RoleSwitcher';
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
        <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl text-center space-y-4 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Sign in to CampusConnect</h2>
          <p className="text-xs text-slate-500">
            Please log in with your CTGI institutional email or select a demo role from the switcher bar above.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            Open Sign In Modal
          </button>
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
      
      {/* 14-Role Instant Demo Switcher Banner */}
      {currentUser && (
        <RoleSwitcher 
          currentRole={currentUser.role} 
          onRoleChanged={() => setCurrentUser(AuthService.getCurrentUser())} 
        />
      )}

      {/* Main Responsive Header */}
      {currentUser && (
        <Navbar 
          user={currentUser} 
          onOpenAuthModal={() => setShowAuthModal(true)} 
        />
      )}

      {/* Dynamic Portal View */}
      <main className="flex-1">
        {renderActivePortal()}
      </main>

      {/* Touch-Friendly Bottom Nav on Mobile */}
      {currentUser && (
        <BottomNav role={currentUser.role} />
      )}

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="font-semibold text-slate-800">
            CT Group of Institutions (CTGI) — CampusConnect Portal
          </div>
          <div className="text-[11px] text-slate-400">
            Approved by AICTE & PCI • Affiliated to IKG-PTU Jalandhar • Shahpur & Maqsudan Campuses
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Built with React, TypeScript, Tailwind CSS & Firebase Cloud Infrastructure
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setCurrentUser(AuthService.getCurrentUser())}
      />

    </div>
  );
}

export default App;
