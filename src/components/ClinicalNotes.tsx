import React, { useState } from 'react';
import { 
  Patient, 
  ClinicalNote, 
  UserAccount 
} from '../types';
import { StorageService } from '../services/storage';
import { 
  FileText, 
  Plus, 
  Calendar, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClinicalNotesProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
}

export const ClinicalNotes: React.FC<ClinicalNotesProps> = ({
  patients,
  selectedPatientId,
  currentUser
}) => {
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [notes, setNotes] = useState<ClinicalNote[]>(StorageService.getClinicalNotes());
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [chiefComplaint, setChiefComplaint] = useState('Severe throbbing pain in lower right jaw since 2 days.');
  const [onExamination, setOnExamination] = useState('Tooth #46 shows deep disto-occlusal caries tender to vertical percussion (+). No visible sinus tract.');
  const [treatmentDone, setTreatmentDone] = useState('LA 2% Lignocaine given. Caries excavation, pulp extirpation, canal working length established. Canal shaped up to #20 K-file. Closed with Calcium hydroxide dressing.');
  const [nextVisitPlan, setNextVisitPlan] = useState('Biomechanical preparation, master cone fit, and obturation under rubber dam isolation.');

  const currentPatient = patients.find(p => p.id === patientId);
  const patientNotes = notes.filter(n => n.patientId === patientId);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    StorageService.addClinicalNote({
      patientId: currentPatient.id,
      doctorName: currentUser.name,
      chiefComplaint,
      onExamination,
      treatmentDone,
      nextVisitPlan
    });

    setNotes(StorageService.getClinicalNotes());
    setShowAddModal(false);
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Clinical Case Notes &amp; Chairside Progress
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Standard dental examination logging: Chief complaint, clinical findings (O/E), procedure performed today, and next visit plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Select Patient:
            </label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.uniqueId})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5 mt-5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Note</span>
          </button>
        </div>
      </div>

      {/* Clinical Notes Timeline */}
      <div className="space-y-4">
        {patientNotes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium">No clinical notes recorded for {currentPatient?.name} yet. Click "+ Add Note" to create one.</p>
          </div>
        ) : (
          patientNotes.map(n => (
            <div key={n.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-50 text-teal-800">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900">{n.date}</span>
                </div>
                <div className="text-xs text-slate-500">
                  Doctor: <strong className="text-slate-800">{n.doctorName}</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                    Chief Complaint (C/C)
                  </span>
                  <p className="text-slate-800 leading-relaxed font-sans">{n.chiefComplaint}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1">
                    On-Examination (O/E Findings)
                  </span>
                  <p className="text-slate-800 leading-relaxed font-sans">{n.onExamination}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
                <span className="font-bold text-teal-900 uppercase tracking-wider text-[10px] block mb-1">
                  Treatment Done Today
                </span>
                <p className="text-teal-950 font-medium leading-relaxed">{n.treatmentDone}</p>
              </div>

              {n.nextVisitPlan && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-amber-900 text-[11px] block">Plan for Next Visit:</span>
                    <p className="text-amber-800">{n.nextVisitPlan}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-3.5">Add Daily Clinical Progress Note</h3>
            <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Chief Complaint</label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">On-Examination (O/E)</label>
                <textarea
                  value={onExamination}
                  onChange={(e) => setOnExamination(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Treatment Performed Today</label>
                <textarea
                  value={treatmentDone}
                  onChange={(e) => setTreatmentDone(e.target.value)}
                  rows={3}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Next Visit Plan</label>
                <textarea
                  value={nextVisitPlan}
                  onChange={(e) => setNextVisitPlan(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition">Save Clinical Note</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
