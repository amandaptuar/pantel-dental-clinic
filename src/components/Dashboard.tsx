import React from 'react';
import { 
  Patient, 
  Appointment, 
  Invoice, 
  LabOrder, 
  UserAccount, 
  ClinicTiming 
} from '../types';
import { WhatsAppUtils } from '../services/storage';
import { 
  Users, 
  Calendar, 
  Receipt, 
  Share2, 
  Clock, 
  BellRing, 
  UserPlus, 
  Pill, 
  Phone, 
  ChevronRight,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  FileText,
  HardDrive
} from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
  appointments: Appointment[];
  invoices: Invoice[];
  labOrders: LabOrder[];
  currentUser: UserAccount;
  clinicTiming: ClinicTiming;
  onNavigateToTab: (tab: string) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  appointments,
  invoices,
  currentUser,
  clinicTiming,
  onNavigateToTab
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const sixMonthRecalls = appointments.filter(a => a.isFollowUp6Month);
  const pendingInvoices = invoices.filter(i => i.balanceDue > 0);
  const totalPending = invoices.reduce((s, i) => s + i.balanceDue, 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-150">
      
      {/* 1. Clean & Concise Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {greeting}, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Patil Dental Clinic • <span className="font-semibold text-teal-700">+91 95796 49009</span>
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>{clinicTiming.morningStart} - {clinicTiming.morningEnd} &amp; {clinicTiming.eveningStart} - {clinicTiming.eveningEnd}</span>
          </div>

          <a
            href="https://wa.me/919579649009"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 font-semibold transition"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 2. Four Clean & Normal-Sized Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Patients */}
        <div 
          onClick={() => onNavigateToTab('patients')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Patients</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {patients.length}
          </p>
        </div>

        {/* Today's Schedule */}
        <div 
          onClick={() => onNavigateToTab('appointments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-cyan-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Today's Visits</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {todayAppointments.length}
          </p>
        </div>

        {/* 6-Month Recalls */}
        <div 
          onClick={() => onNavigateToTab('appointments')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700">6M Recalls Due</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">
            {sixMonthRecalls.length}
          </p>
        </div>

        {/* Pending Balance */}
        <div 
          onClick={() => onNavigateToTab('billing')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-500 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600">Pending Balance</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">
            ₹{totalPending.toLocaleString('en-IN')}
          </p>
        </div>

      </div>

      {/* 3. Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => onNavigateToTab('patients')}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 font-bold text-xs text-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
        >
          <UserPlus className="w-4 h-4 text-teal-700" />
          <span>New Patient</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('appointments')}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 font-bold text-xs text-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Calendar className="w-4 h-4 text-cyan-700" />
          <span>Book Visit</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('prescriptions')}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 font-bold text-xs text-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Pill className="w-4 h-4 text-indigo-700" />
          <span>Write Prescription</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateToTab('billing')}
          className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 font-bold text-xs text-slate-800 transition flex items-center justify-center gap-2 shadow-xs"
        >
          <Receipt className="w-4 h-4 text-emerald-700" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* 4. Admin Management Hub: Quick 1-Click Access to Every Feature */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Admin Management Shortcuts
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Click any module to open instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {[
            { id: 'patients', label: 'Patients & Dental Chart', icon: Users, color: 'text-blue-700 bg-blue-50 border-blue-200' },
            { id: 'appointments', label: 'Appointments & 6M Recalls', icon: Calendar, color: 'text-amber-700 bg-amber-50 border-amber-200' },
            { id: 'prescriptions', label: 'Digital Prescriptions', icon: Pill, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
            { id: 'billing', label: 'Billing & Invoices', icon: Receipt, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
            { id: 'treatment-plans', label: 'Treatment Planning', icon: Stethoscope, color: 'text-sky-700 bg-sky-50 border-sky-200' },
            { id: 'specialized', label: 'RCT, Crowns & Aligners', icon: Sparkles, color: 'text-purple-700 bg-purple-50 border-purple-200' },
            { id: 'consent', label: 'Consent & Fingerprint', icon: ShieldCheck, color: 'text-teal-700 bg-teal-50 border-teal-200' },
            { id: 'lab', label: 'Dental Lab Charges', icon: FlaskConical, color: 'text-orange-700 bg-orange-50 border-orange-200' },
            { id: 'clinical-notes', label: 'Clinical Case Notes', icon: FileText, color: 'text-slate-700 bg-slate-100 border-slate-200' },
            { id: 'cloud-backup', label: 'Cloud & Local Backup', icon: HardDrive, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateToTab(item.id)}
                className="p-2.5 rounded-xl border border-slate-200/70 hover:border-teal-500 hover:shadow-xs transition text-left flex items-center gap-2.5 group bg-slate-50/50 hover:bg-white"
              >
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-teal-900 truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Two Clean Workspaces: Appointments & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Today's Appointments */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-700" />
              Today's Patients ({todayAppointments.length})
            </h3>

            <button
              type="button"
              onClick={() => onNavigateToTab('appointments')}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todayAppointments.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No appointments booked for today.
              </div>
            ) : (
              todayAppointments.map(apt => (
                <div key={apt.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-1 rounded-md text-[11px] border border-teal-100 flex-shrink-0">
                      {apt.time}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{apt.patientName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] truncate mt-0.5">
                        {apt.treatmentType} • {apt.doctorName}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => WhatsAppUtils.sendAppointmentReminder(
                      apt.patientName,
                      apt.patientPhone,
                      apt.date,
                      apt.time,
                      apt.doctorName,
                      apt.treatmentType
                    )}
                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition border border-emerald-200 flex-shrink-0"
                    title="Send WhatsApp Reminder"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Reminders (6M & Pending Balance) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          
          {/* 6-Month Recalls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-amber-600" />
                6-Month Routine Recalls ({sixMonthRecalls.length})
              </span>
            </div>

            <div className="space-y-1.5">
              {sixMonthRecalls.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No follow-ups due.</p>
              ) : (
                sixMonthRecalls.map(apt => (
                  <div key={apt.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate">{apt.patientName}</span>
                    <button
                      type="button"
                      onClick={() => WhatsAppUtils.send6MonthRecall(apt.patientName, apt.patientPhone)}
                      className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 flex-shrink-0"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Bills */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-rose-600" />
                Pending Bills ({pendingInvoices.length})
              </span>
              <span className="text-xs font-bold text-rose-600">₹{totalPending.toLocaleString('en-IN')}</span>
            </div>

            <div className="space-y-1.5">
              {pendingInvoices.slice(0, 3).map(inv => (
                <div key={inv.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <span className="font-semibold text-slate-800 block truncate">{inv.patientName}</span>
                    <span className="text-rose-600 font-bold text-[11px]">Due: ₹{inv.balanceDue.toLocaleString('en-IN')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => WhatsAppUtils.sendPendingBalanceReminder(
                      inv.patientName,
                      inv.patientPhone,
                      inv.invoiceNumber,
                      inv.balanceDue
                    )}
                    className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 flex-shrink-0"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Remind</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
