import React, { useState, useEffect } from 'react';
import { User } from './types';
import { AuthService } from './services/auth';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { AuthPage } from './components/auth/AuthPage';

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

  useEffect(() => {
    const unsubscribe = AuthService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // When app or website opens, if not authenticated, show login/signup page at first
  if (!currentUser) {
    return <AuthPage onSuccess={() => setCurrentUser(AuthService.getCurrentUser())} />;
  }

  const renderActivePortal = () => {

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
        />
      )}

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <div className="font-semibold text-slate-800">
            CT Group of Institutions (CTGI) — Smart Campus Portal
          </div>
          <div className="text-[11px] text-slate-500">
            Engineered for all 3 Campuses • <span className="text-emerald-700 font-bold">Currently Live: Shahpur Campus</span> • Maqsudan & Ludhiana Campuses In Progress
          </div>
          <div className="text-[10px] text-slate-400">
            Approved by AICTE & PCI • Affiliated to IKG-PTU Jalandhar & CT University
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
