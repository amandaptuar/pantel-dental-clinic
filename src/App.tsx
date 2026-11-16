import React, { useState } from 'react';
import { 
  UserAccount, 
  Patient, 
  ClinicTiming, 
  Appointment, 
  Invoice, 
  LabOrder 
} from './types';
import { StorageService } from './services/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { SpecializedRecords } from './components/SpecializedRecords';
import { TreatmentPlanner } from './components/TreatmentPlanner';
import { AppointmentManager } from './components/AppointmentManager';
import { ClinicalNotes } from './components/ClinicalNotes';
import { PrescriptionManager } from './components/PrescriptionManager';
import { ConsentManager } from './components/ConsentManager';
import { BillingManager } from './components/BillingManager';
import { LabChargesManager } from './components/LabChargesManager';
import { BackupAndSupabaseModal } from './components/BackupAndSupabaseModal';
import { ClinicTimingModal } from './components/ClinicTimingModal';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount>(StorageService.getCurrentUser());
  const [clinicTiming, setClinicTiming] = useState<ClinicTiming>(StorageService.getClinicTiming());
  
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Data States
  const [patients, setPatients] = useState<Patient[]>(StorageService.getPatients());
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patients[0]);
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [invoices, setInvoices] = useState<Invoice[]>(StorageService.getInvoices());
  const [labOrders, setLabOrders] = useState<LabOrder[]>(StorageService.getLabOrders());

  // Modals
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTimingModal, setShowTimingModal] = useState(false);

  // Sync data refresh
  const refreshAllData = () => {
    setPatients(StorageService.getPatients());
    setAppointments(StorageService.getAppointments());
    setInvoices(StorageService.getInvoices());
    setLabOrders(StorageService.getLabOrders());
    setClinicTiming(StorageService.getClinicTiming());
    setCurrentUser(StorageService.getCurrentUser());
  };

  const handleSwitchUser = (user: UserAccount) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const handleNavTab = (tab: string) => {
    if (tab === 'cloud-backup') {
      setShowSettingsModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const sixMonthRecallCount = appointments.filter(a => a.isFollowUp6Month).length;
  const pendingBalanceCount = invoices.filter(i => i.balanceDue > 0).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
      
      {/* 1. Light Modern Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        patientCount={patients.length}
        sixMonthRecallCount={sixMonthRecallCount}
        pendingBalanceCount={pendingBalanceCount}
      />

      {/* 2. Full-Width Main Canvas (No excessive empty white gutters) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 w-full">
        
        {/* Full-width Header */}
        <Header
          currentUser={currentUser}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenClinicTiming={() => setShowTimingModal(true)}
          clinicTiming={clinicTiming}
          onQuickAction={(action) => setActiveTab(action)}
        />

        {/* Full-width Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              patients={patients}
              appointments={appointments}
              invoices={invoices}
              labOrders={labOrders}
              currentUser={currentUser}
              clinicTiming={clinicTiming}
              onNavigateToTab={(tab) => handleNavTab(tab)}
              onSelectPatient={handleSelectPatient}
            />
          )}

          {(activeTab === 'patients' || activeTab === 'charts') && (
            <PatientManagement
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              onSelectPatient={handleSelectPatient}
              currentUser={currentUser}
              onNavigateToTab={(tab) => handleNavTab(tab)}
            />
          )}

          {activeTab === 'specialized' && (
            <SpecializedRecords
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'treatment-plans' && (
            <TreatmentPlanner
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
              onNavigateToBilling={() => setActiveTab('billing')}
            />
          )}

          {activeTab === 'appointments' && (
            <AppointmentManager
              patients={patients}
              currentUser={currentUser}
              clinicTiming={clinicTiming}
              onOpenClinicTiming={() => setShowTimingModal(true)}
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionManager
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'consent' && (
            <ConsentManager
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'billing' && (
            <BillingManager
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'lab' && (
            <LabChargesManager
              patients={patients}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'clinical-notes' && (
            <ClinicalNotes
              patients={patients}
              selectedPatientId={selectedPatient?.id}
              currentUser={currentUser}
            />
          )}
        </main>

        {/* Full-width Footer */}
        <footer className="py-5 px-6 sm:px-8 border-t border-slate-200/70 bg-white text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
          <span className="font-semibold text-slate-700">Patil Dental Clinic &amp; Implant Center • <strong className="text-teal-700">+91 95796 49009</strong></span>
          <span className="text-slate-400">Windows + Android + Web Compatible • Pure English UI</span>
        </footer>

      </div>

      {/* Cloud Sync & Backup Modal */}
      <BackupAndSupabaseModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onDataChanged={refreshAllData}
      />

      {/* Clinic Timing Modal */}
      <ClinicTimingModal
        isOpen={showTimingModal}
        onClose={() => setShowTimingModal(false)}
        timing={clinicTiming}
        onSaveTiming={(updated) => setClinicTiming(updated)}
      />

    </div>
  );
}

export default App;
