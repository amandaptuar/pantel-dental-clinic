import React, { useState } from 'react';
import { 
  Patient, 
  Prescription, 
  PrescriptionItem, 
  Medicine, 
  UserAccount 
} from '../types';
import { MEDICINE_DATABASE } from '../data/medicines';
import { StorageService, WhatsAppUtils } from '../services/storage';
import { PDFGenerator } from '../utils/pdfGenerator';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Share2, 
  Search, 
  Sparkles, 
  Languages, 
  FileCheck,
  Stethoscope
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PrescriptionManagerProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
}

export const PrescriptionManager: React.FC<PrescriptionManagerProps> = ({
  patients,
  selectedPatientId,
  currentUser
}) => {
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState<string>('Acute Pulpitis & Dental Abscess');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Warm saline gargles 4-5 times a day. Soft diet.');
  const [specialInstructionsMarathi, setSpecialInstructionsMarathi] = useState<string>('उद्यापासून कोमट पाण्यात मीठ टाकून गुळण्या कराव्यात. मऊ व थंड अन्न खावे.');
  const [showMarathiInstructions, setShowMarathiInstructions] = useState<boolean>(true);

  // Medicine items currently in prescription
  const [items, setItems] = useState<PrescriptionItem[]>([
    {
      medicineName: MEDICINE_DATABASE[0].name,
      dosage: MEDICINE_DATABASE[0].dosage,
      frequency: MEDICINE_DATABASE[0].frequency,
      frequencyMarathi: MEDICINE_DATABASE[0].frequencyMarathi,
      duration: MEDICINE_DATABASE[0].duration,
      durationMarathi: MEDICINE_DATABASE[0].durationMarathi,
      instruction: MEDICINE_DATABASE[0].instruction,
      instructionMarathi: MEDICINE_DATABASE[0].instructionMarathi
    },
    {
      medicineName: MEDICINE_DATABASE[4].name, // Zerodol-SP
      dosage: MEDICINE_DATABASE[4].dosage,
      frequency: MEDICINE_DATABASE[4].frequency,
      frequencyMarathi: MEDICINE_DATABASE[4].frequencyMarathi,
      duration: MEDICINE_DATABASE[4].duration,
      durationMarathi: MEDICINE_DATABASE[4].durationMarathi,
      instruction: MEDICINE_DATABASE[4].instruction,
      instructionMarathi: MEDICINE_DATABASE[4].instructionMarathi
    }
  ]);

  // Medicine search / picker state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Saved Prescriptions
  const [savedPrescriptions, setSavedPrescriptions] = useState<Prescription[]>(StorageService.getPrescriptions());

  const currentPatient = patients.find(p => p.id === patientId);

  const categories = ['All', 'Antibiotic', 'Analgesic / Pain', 'Anti-inflammatory', 'Antacid', 'Mouthwash', 'Dental Gel'];

  const filteredMedicines = MEDICINE_DATABASE.filter(m => {
    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.dosage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddMedicineFromDb = (med: Medicine) => {
    const newItem: PrescriptionItem = {
      medicineName: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      frequencyMarathi: med.frequencyMarathi,
      duration: med.duration,
      durationMarathi: med.durationMarathi,
      instruction: med.instruction,
      instructionMarathi: med.instructionMarathi
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof PrescriptionItem, val: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: val };
    setItems(updated);
  };

  const handleSaveAndGeneratePDF = () => {
    if (!currentPatient) {
      alert('Please select a patient.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one medicine.');
      return;
    }

    const newRx: Prescription = StorageService.addPrescription({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientAge: currentPatient.age,
      patientGender: currentPatient.gender,
      doctorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      items,
      specialInstructions,
      specialInstructionsMarathi: showMarathiInstructions ? specialInstructionsMarathi : undefined
    });

    setSavedPrescriptions(StorageService.getPrescriptions());
    PDFGenerator.generatePrescriptionPDF(newRx, currentPatient);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleWhatsAppSend = () => {
    if (!currentPatient) return;
    WhatsAppUtils.sendPrescriptionNotice(currentPatient.name, currentPatient.phone, currentUser.name);
  };

  const handleLoadPrescriptionPack = (packType: string) => {
    if (packType === 'pain') {
      setDiagnosis('Acute Pulpitis & Facial Swelling');
      setItems([
        {
          medicineName: 'Amoxicillin 500mg',
          dosage: '500 mg',
          frequency: '1-1-1',
          frequencyMarathi: 'दिवसातून ३ वेळा (सकाळ, दुपार, रात्र)',
          duration: '5 Days',
          durationMarathi: '५ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर घ्यावे'
        },
        {
          medicineName: 'Zerodol-SP',
          dosage: 'Aceclo 100mg + Para 325mg + Serratio 15mg',
          frequency: '1-0-1',
          frequencyMarathi: 'दिवसातून २ वेळा (सकाळ, रात्र)',
          duration: '3 Days',
          durationMarathi: '३ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर घ्यावे'
        },
        {
          medicineName: 'Pantocid 40mg',
          dosage: '40 mg',
          frequency: '1-0-0',
          frequencyMarathi: 'दिवसातून १ वेळा (सकाळी)',
          duration: '5 Days',
          durationMarathi: '५ दिवस',
          instruction: 'Before Food (Empty Stomach)',
          instructionMarathi: 'सकाळी उपाशीपोटी घ्यावे'
        }
      ]);
    } else if (packType === 'rct') {
      setDiagnosis('Acute Irreversible Pulpitis - RCT Planned');
      setItems([
        {
          medicineName: 'Ketorol-DT',
          dosage: '10 mg Dispersible',
          frequency: 'SOS',
          frequencyMarathi: 'वेदना झाल्यास १ गोळी पाण्यात विरघळवून',
          duration: '2 Days',
          durationMarathi: '२ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर १ कप पाण्यात विरघळवून घ्यावे'
        },
        {
          medicineName: 'Zerodol-SP',
          dosage: 'Aceclo 100mg + Para 325mg + Serratio 15mg',
          frequency: '1-0-1',
          frequencyMarathi: 'दिवसातून २ वेळा (सकाळ, रात्र)',
          duration: '3 Days',
          durationMarathi: '३ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर घ्यावे'
        },
        {
          medicineName: 'Pantocid 40mg',
          dosage: '40 mg',
          frequency: '1-0-0',
          frequencyMarathi: 'दिवसातून १ वेळा (सकाळी)',
          duration: '3 Days',
          durationMarathi: '३ दिवस',
          instruction: 'Before Food (Empty Stomach)',
          instructionMarathi: 'सकाळी उपाशीपोटी घ्यावे'
        }
      ]);
    } else if (packType === 'extraction') {
      setDiagnosis('Post-Extraction Socket Healing');
      setItems([
        {
          medicineName: 'Augmentin 625mg',
          dosage: 'Amox 500mg + Clav 125mg',
          frequency: '1-0-1',
          frequencyMarathi: 'दिवसातून २ वेळा (सकाळ, रात्र)',
          duration: '5 Days',
          durationMarathi: '५ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर घ्यावे'
        },
        {
          medicineName: 'Zerodol-SP',
          dosage: 'Aceclo 100mg + Para 325mg + Serratio 15mg',
          frequency: '1-0-1',
          frequencyMarathi: 'दिवसातून २ वेळा (सकाळ, रात्र)',
          duration: '3 Days',
          durationMarathi: '३ दिवस',
          instruction: 'After Food',
          instructionMarathi: 'जेवणानंतर घ्यावे'
        },
        {
          medicineName: 'Betadine 2% Gargle',
          dosage: 'Povidone Iodine 2% w/v',
          frequency: '1-1-1',
          frequencyMarathi: 'दिवसातून ३ वेळा गुळण्या',
          duration: '5 Days',
          durationMarathi: '५ दिवस',
          instruction: 'Swish and Spit',
          instructionMarathi: 'कोमट पाण्यात मिसळून गुळण्या कराव्यात (गिळू नये)'
        }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Pill className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Digital e-Prescriptions (English &amp; Marathi)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select medicines from database or click 1-click popular packs. Generate printable official PDF with dosage instructions.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setShowMarathiInstructions(!showMarathiInstructions)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                showMarathiInstructions
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showMarathiInstructions ? 'Marathi Dual-Language: ON' : 'Marathi Dual-Language: OFF'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Fast Prescription Packs */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            ⚡ 1-Click Common Prescription Packs (Auto-fills medicines &amp; doses):
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleLoadPrescriptionPack('pain')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-xs font-semibold text-slate-700 hover:text-teal-900 transition flex items-center gap-1.5"
            >
              <span>💊 Routine Pain &amp; Swelling (Amoxi + Zerodol-SP + Panto)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPrescriptionPack('rct')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-xs font-semibold text-slate-700 hover:text-teal-900 transition flex items-center gap-1.5"
            >
              <span>🦷 Severe Toothache / RCT (Ketorol-DT + Zerodol + Panto)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadPrescriptionPack('extraction')}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-xs font-semibold text-slate-700 hover:text-teal-900 transition flex items-center gap-1.5"
            >
              <span>🩹 Post-Extraction Healing (Augmentin 625 + Zerodol-SP + Betadine)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Prescription Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Medicine Database & Quick Add (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-teal-700" />
                Dental Medicine Database ({MEDICINE_DATABASE.length})
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Augmentin, Zerodol, Metrogyl, Mouthwash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition whitespace-nowrap text-[11px] ${
                    selectedCategory === cat
                      ? 'bg-teal-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Medicine Database List */}
            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto pr-1">
              {filteredMedicines.map(med => (
                <div key={med.id} className="py-2.5 flex items-start justify-between gap-3 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {med.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-cyan-700">{med.frequency}</span>
                      <span>•</span>
                      <span>{med.duration}</span>
                      <span>•</span>
                      <span className="text-slate-600">{med.instruction}</span>
                    </div>
                    {med.instructionMarathi && (
                      <p className="text-[10px] text-amber-800 font-medium">
                        मराठी: {med.frequencyMarathi} • {med.instructionMarathi}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddMedicineFromDb(med)}
                    className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-700 hover:text-white transition flex-shrink-0"
                    title="Add to Prescription"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Active Prescription Form & Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            
            {/* Header Form: Patient & Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-4 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Patient:
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uniqueId}) - Age: {p.age} {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Diagnosis:
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Irreversible Pulpitis #36"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Prescribed Items Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-base font-black text-teal-700">Rx</span>
                  <span>Prescribed Medicines ({items.length})</span>
                </span>
                <span className="text-xs text-slate-500">
                  Doctor: <strong>{currentUser.name}</strong>
                </span>
              </div>

              <div className="space-y-2.5">
                {items.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No medicines added yet. Pick from the 1-Click Packs above or database on the left.
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {idx + 1}. {item.medicineName}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inputs Row: Dosage, Frequency, Duration, Instructions */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500">Dosage</label>
                          <input
                            type="text"
                            value={item.dosage}
                            onChange={(e) => handleUpdateItem(idx, 'dosage', e.target.value)}
                            className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Frequency</label>
                          <select
                            value={item.frequency}
                            onChange={(e) => handleUpdateItem(idx, 'frequency', e.target.value)}
                            className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                          >
                            <option value="1-0-1">1-0-1 (Two times)</option>
                            <option value="1-1-1">1-1-1 (Three times)</option>
                            <option value="1-0-0">1-0-0 (Morning once)</option>
                            <option value="0-0-1">0-0-1 (Night once)</option>
                            <option value="SOS">SOS (When needed)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Duration</label>
                          <select
                            value={item.duration}
                            onChange={(e) => handleUpdateItem(idx, 'duration', e.target.value)}
                            className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                          >
                            <option value="3 Days">3 Days</option>
                            <option value="5 Days">5 Days</option>
                            <option value="7 Days">7 Days</option>
                            <option value="10 Days">10 Days</option>
                            <option value="15 Days">15 Days</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500">Instructions</label>
                          <select
                            value={item.instruction}
                            onChange={(e) => handleUpdateItem(idx, 'instruction', e.target.value)}
                            className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-xs"
                          >
                            <option value="After Food">After Food</option>
                            <option value="Before Food (Empty Stomach)">Before Food</option>
                            <option value="Swish and Spit">Swish and Spit</option>
                            <option value="Apply on gums">Apply on gums</option>
                          </select>
                        </div>
                      </div>

                      {/* Marathi instruction subtext */}
                      {showMarathiInstructions && (
                        <div className="pt-1 text-[11px] text-amber-800 font-medium flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded">
                            मराठी
                          </span>
                          <span>{item.frequencyMarathi} • {item.durationMarathi} • {item.instructionMarathi}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Special Instructions & Advice */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-700">
                Special Advice / Care Instructions (English):
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                rows={2}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              {showMarathiInstructions && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mt-2">
                    रुग्णासाठी विशेष सूचना (मराठीत):
                  </label>
                  <textarea
                    value={specialInstructionsMarathi}
                    onChange={(e) => setSpecialInstructionsMarathi(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Notify Patient on WhatsApp</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveAndGeneratePDF}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generate &amp; Print PDF</span>
                </button>
              </div>
            </div>

          </div>

          {/* Past Prescriptions History */}
          {savedPrescriptions.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-teal-700" />
                Recent Prescriptions History ({savedPrescriptions.length})
              </h3>
              <div className="divide-y divide-slate-100">
                {savedPrescriptions.slice(0, 5).map(rx => (
                  <div key={rx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{rx.patientName}</span>
                        <span className="text-[10px] text-slate-500 font-normal">({rx.date})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Diagnosis: {rx.diagnosis} • {rx.items.length} Medicines
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => PDFGenerator.generatePrescriptionPDF(rx, currentPatient)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
