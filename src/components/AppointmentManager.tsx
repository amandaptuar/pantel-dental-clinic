import React, { useState } from 'react';
import { 
  Appointment, 
  Patient, 
  ClinicTiming, 
  UserAccount 
} from '../types';
import { StorageService, WhatsAppUtils } from '../services/storage';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Clock, 
  Share2, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Filter, 
  CalendarRange,
  BellRing,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AppointmentManagerProps {
  patients: Patient[];
  currentUser: UserAccount;
  clinicTiming: ClinicTiming;
  onOpenClinicTiming: () => void;
}

export const AppointmentManager: React.FC<AppointmentManagerProps> = ({
  patients,
  currentUser,
  clinicTiming,
  onOpenClinicTiming
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(StorageService.getAppointments());
  const [viewTab, setViewTab] = useState<'Upcoming' | 'Today' | '6-Month Recalls' | 'All'>('Today');
  const [showNewModal, setShowNewModal] = useState(false);

  // New appointment form state
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [doctorName, setDoctorName] = useState('Dr. Anand Patil');
  const [treatmentType, setTreatmentType] = useState('Routine Checkup & Scaling');
  const [notes, setNotes] = useState('');
  const [isFollowUp6Month, setIsFollowUp6Month] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredAppointments = appointments.filter(apt => {
    if (viewTab === 'Today') return apt.date === todayStr;
    if (viewTab === 'Upcoming') return apt.date >= todayStr && apt.status !== 'Completed' && apt.status !== 'Cancelled';
    if (viewTab === '6-Month Recalls') return apt.isFollowUp6Month === true;
    return true;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    StorageService.addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date,
      time,
      doctorName,
      treatmentType,
      status: 'Scheduled',
      notes,
      isFollowUp6Month
    });

    setAppointments(StorageService.getAppointments());
    setShowNewModal(false);
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleUpdateStatus = (apt: Appointment, status: Appointment['status']) => {
    const updated = { ...apt, status };
    StorageService.updateAppointment(updated);
    setAppointments(StorageService.getAppointments());
  };

  const handleSendReminderWhatsApp = (apt: Appointment) => {
    if (apt.isFollowUp6Month) {
      WhatsAppUtils.send6MonthRecall(apt.patientName, apt.patientPhone);
    } else {
      WhatsAppUtils.sendAppointmentReminder(
        apt.patientName,
        apt.patientPhone,
        apt.date,
        apt.time,
        apt.doctorName,
        apt.treatmentType
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700">
                <CalendarIcon className="w-6 h-6" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Appointment &amp; 6-Month Recall Scheduler
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active clinic schedule: <strong>{clinicTiming.morningStart} - {clinicTiming.morningEnd}</strong> &amp; <strong>{clinicTiming.eveningStart} - {clinicTiming.eveningEnd}</strong>. Send automated Marathi/English WhatsApp reminders.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={onOpenClinicTiming}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>Clinic Timings &amp; Holidays</span>
            </button>

            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Book Appointment</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-4 overflow-x-auto">
          {[
            { id: 'Today', label: `Today's Schedule (${appointments.filter(a => a.date === todayStr).length})` },
            { id: 'Upcoming', label: 'Upcoming Days' },
            { id: '6-Month Recalls', label: `6-Month Recall Alerts (${appointments.filter(a => a.isFollowUp6Month).length})` },
            { id: 'All', label: 'All Records' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setViewTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                viewTab === tab.id
                  ? 'bg-teal-700 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 6-Month Preventive Recall Spotlight Banner */}
      {viewTab === '6-Month Recalls' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
              <BellRing className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold">6-Month Preventive Routine Dental Recall</h4>
              <p className="text-xs text-amber-800 mt-0.5">
                These patients are due for their 6-month checkup and routine cleaning. Click the WhatsApp button to send an instant reminder.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Cards / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-slate-400">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium">No appointments found in this view. Click "+ Book Appointment" above.</p>
          </div>
        ) : (
          filteredAppointments.map(apt => (
            <div 
              key={apt.id} 
              className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xs space-y-3 transition hover:border-slate-300 ${
                apt.isFollowUp6Month ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200/80'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                  <p className="text-xs text-slate-500 font-medium">{apt.patientPhone}</p>
                </div>

                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'Confirmed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : apt.status === 'Completed'
                    ? 'bg-teal-100 text-teal-800'
                    : apt.status === 'Cancelled'
                    ? 'bg-slate-100 text-slate-600'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {apt.status}
                </span>
              </div>

              {/* Time & Treatment */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-700 font-semibold">
                  <span className="flex items-center gap-1.5 text-cyan-800">
                    <CalendarRange className="w-3.5 h-3.5" />
                    <span>{apt.date}</span>
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{apt.time}</span>
                  </span>
                </div>

                <div className="pt-1 text-slate-900 font-bold">
                  🦷 {apt.treatmentType}
                </div>

                <div className="text-[11px] text-slate-500">
                  Doctor: <strong className="text-slate-700">{apt.doctorName}</strong>
                </div>

                {apt.notes && (
                  <p className="text-[10px] text-slate-500 italic pt-1 border-t border-slate-200 mt-1">
                    "{apt.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer: WhatsApp action + Status selector */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                <select
                  value={apt.status}
                  onChange={(e) => handleUpdateStatus(apt, e.target.value as any)}
                  className="text-[11px] font-semibold p-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="No-Show">No-Show</option>
                </select>

                <button
                  type="button"
                  onClick={() => handleSendReminderWhatsApp(apt)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition flex items-center gap-1.5"
                  title="Send WhatsApp reminder"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-700" />
                Book Dental Appointment
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="py-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Patient:
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uniqueId}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Date:
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time:
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attending Doctor:
                </label>
                <select
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                >
                  <option value="Dr. Anand Patil">Dr. Anand Patil (MDS - Implantologist)</option>
                  <option value="Dr. Neha Patil">Dr. Neha Patil (Pedo & Ortho)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Procedure / Reason for Visit:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Routine Checkup & Scaling',
                    'Tooth Pain / RCT',
                    'Cap / Crown Trial',
                    'Tooth Extraction',
                    'Braces / Aligner Review',
                    'Filling / Restoration'
                  ].map(reason => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setTreatmentType(reason)}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-[11px] font-semibold text-slate-700 transition"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={treatmentType}
                  onChange={(e) => setTreatmentType(e.target.value)}
                  placeholder="e.g. RCT Access, Crown Try-In, Scaling"
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes (Optional):
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Patient prefers morning slot, severe sensitivity on upper tooth"
                  rows={2}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFollowUp6Month}
                    onChange={(e) => setIsFollowUp6Month(e.target.checked)}
                    className="rounded text-teal-700 focus:ring-teal-500 w-4 h-4"
                  />
                  <span>Mark as 6-Month Routine Follow-Up / Preventive Recall</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
