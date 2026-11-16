import React, { useState } from 'react';
import { 
  Patient, 
  ToothCondition, 
  UserAccount 
} from '../types';
import { StorageService, WhatsAppUtils } from '../services/storage';
import { DentalChart } from './DentalChart';
import { 
  UserPlus, 
  Search, 
  Share2, 
  Phone, 
  HeartPulse, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  User, 
  Activity,
  Calendar,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PatientManagementProps {
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  selectedPatientId?: string;
  currentUser: UserAccount;
  onNavigateToTab: (tab: string) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  patients,
  onSelectPatient,
  selectedPatientId,
  currentUser,
  onNavigateToTab
}) => {
  const [patientList, setPatientList] = useState<Patient[]>(patients);
  const [searchQuery, setSearchQuery] = useState('');
  const [activePatient, setActivePatient] = useState<Patient>(
    patients.find(p => p.id === selectedPatientId) || patients[0]
  );
  const [activeTab, setActiveTab] = useState<'chart' | 'details'>('chart');
  const [showRegModal, setShowRegModal] = useState(false);

  // Simple Registration Form States
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 ');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [allergies, setAllergies] = useState('None');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const medicalConditionOptions = [
    'Diabetes / Sugar',
    'Blood Pressure (BP)',
    'Heart / Cardiac Problem',
    'Bleeding Problem',
    'Asthma',
    'Pregnancy',
    'Allergy to Medicines'
  ];

  const filteredPatients = patientList.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.uniqueId.toLowerCase().includes(q) ||
      p.phone.includes(q)
    );
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter patient name and mobile number.');
      return;
    }

    const newPatient = StorageService.addPatient({
      name,
      age: Number(age),
      gender,
      phone,
      address,
      bloodGroup,
      medicalHistory: selectedConditions,
      allergies,
      dentalChart: {}
    });

    setPatientList(StorageService.getPatients());
    setActivePatient(newPatient);
    onSelectPatient(newPatient);
    setShowRegModal(false);

    // Reset Form
    setName('');
    setAge(30);
    setPhone('+91 ');
    setSelectedConditions([]);

    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleUpdateChart = (newChart: Record<number, ToothCondition>) => {
    if (!activePatient) return;
    const updated = { ...activePatient, dentalChart: newChart };
    StorageService.updatePatient(updated);
    setActivePatient(updated);
    setPatientList(StorageService.getPatients());
  };

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const handleWhatsAppContact = (patient: Patient) => {
    const text = encodeURIComponent(
      `Hello ${patient.name},\n` +
      `Welcome to Patil Dental Clinic!\n` +
      `Your Patient ID: ${patient.uniqueId}\n` +
      `For any query or appointment, contact us at:\n` +
      `📞 +91 95796 49009\nPatil Dental Clinic.`
    );
    window.open(`https://wa.me/${WhatsAppUtils.cleanPhone(patient.phone)}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 w-full">
      
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patient by Name, ID, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowRegModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Register New Patient</span>
        </button>
      </div>

      {/* Main Grid: Patients List (Left) & Active Patient Details/Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* Left Side: Patient List (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Patients List ({filteredPatients.length})
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto pr-1">
              {filteredPatients.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No patient found. Click "+ Register New Patient".
                </div>
              ) : (
                filteredPatients.map(pat => {
                  const isSelected = activePatient?.id === pat.id;
                  return (
                    <div
                      key={pat.id}
                      onClick={() => {
                        setActivePatient(pat);
                        onSelectPatient(pat);
                      }}
                      className={`p-3 rounded-xl transition cursor-pointer my-1 ${
                        isSelected 
                          ? 'bg-teal-50 border border-teal-200 shadow-2xs' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">{pat.name}</p>
                          <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100/60 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                            {pat.uniqueId}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {pat.age} Yrs / {pat.gender[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                        <span>{pat.phone}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppContact(pat);
                          }}
                          className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition"
                          title="WhatsApp patient"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Active Patient Details & Dental Chart (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activePatient ? (
            <div className="space-y-4">
              
              {/* Patient Card Header */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      {activePatient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {activePatient.name}
                        </h3>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {activePatient.uniqueId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {activePatient.age} Years • {activePatient.gender} • Blood Group: <strong className="text-slate-700">{activePatient.bloodGroup || 'B+'}</strong>
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Action Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleWhatsAppContact(activePatient)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1"
                      title="Send Welcome or Follow-up message on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('appointments')}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 text-xs font-bold transition flex items-center gap-1"
                    >
                      <Calendar className="w-3.5 h-3.5 text-teal-700" />
                      <span>+ Appointment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('prescriptions')}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 text-xs font-bold transition"
                    >
                      + Prescription
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('billing')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200 text-xs font-bold transition"
                    >
                      + Invoice
                    </button>

                    <button
                      type="button"
                      onClick={() => onNavigateToTab('clinical-notes')}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-700" />
                      <span>+ Note</span>
                    </button>
                  </div>
                </div>

                {/* Tab Switcher: Dental Chart vs Profile Details */}
                <div className="flex items-center gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('chart')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'chart'
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Dental Chart (Adult &amp; Child)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      activeTab === 'details'
                        ? 'bg-teal-700 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Medical History &amp; Profile
                  </button>
                </div>
              </div>

              {/* Tab 1: Dental Chart */}
              {activeTab === 'chart' && (
                <DentalChart
                  patient={activePatient}
                  onUpdatePatientChart={handleUpdateChart}
                  onAddTreatmentPlanItem={(item) => {
                    StorageService.addTreatmentPlan(item);
                  }}
                />
              )}

              {/* Tab 2: Profile & Medical History */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 text-xs">
                  <h4 className="text-xs font-bold uppercase text-slate-500">
                    Medical Conditions &amp; Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <span className="font-bold text-slate-700 block">Medical Conditions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {activePatient.medicalHistory && activePatient.medicalHistory.length > 0 ? (
                          activePatient.medicalHistory.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-semibold text-[11px]">
                              {c}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">None reported</span>
                        )}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 block">Drug Allergies:</span>
                      <p className="font-bold text-rose-700">{activePatient.allergies || 'None'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 block">Address:</span>
                      <p className="text-slate-700">{activePatient.address || 'Maharashtra, India'}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <span className="font-bold text-slate-700 block">Mobile Phone:</span>
                      <p className="text-slate-900 font-bold">{activePatient.phone}</p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              Select a patient from the list on the left.
            </div>
          )}
        </div>

      </div>

      {/* Simple Register Patient Modal */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-teal-700" />
                Register New Patient
              </h3>
              <button
                type="button"
                onClick={() => setShowRegModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegister} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Age *</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Mobile Phone (+91) *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 95796 49009"
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Address / City</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Station Road, Maharashtra"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Medical Conditions (Tick if any):</label>
                <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                  {medicalConditionOptions.map(c => (
                    <label key={c} className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(c)}
                        onChange={() => toggleCondition(c)}
                        className="rounded text-teal-700"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Drug Allergies</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g. Penicillin, Painkillers, None"
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-semibold text-rose-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition"
                >
                  Save &amp; Generate ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
