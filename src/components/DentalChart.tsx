import React, { useState } from 'react';
import { 
  ToothCondition, 
  ToothConditionType, 
  ToothSurface, 
  ArchType, 
  Patient, 
  TreatmentPlanItem 
} from '../types';
import { 
  Plus, 
  Info, 
  Check, 
  X, 
  Sparkles, 
  Stethoscope, 
  RotateCcw,
  Layers,
  Baby,
  User
} from 'lucide-react';

interface DentalChartProps {
  patient: Patient;
  onUpdatePatientChart: (newChart: Record<number, ToothCondition>) => void;
  onAddTreatmentPlanItem?: (item: Omit<TreatmentPlanItem, 'id' | 'date'>) => void;
}

// Adult teeth arrangement (FDI 2-digit notation)
const ADULT_UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11];
const ADULT_UPPER_LEFT = [21, 22, 23, 24, 25, 26, 27, 28];
const ADULT_LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const ADULT_LOWER_LEFT = [31, 32, 33, 34, 35, 36, 37, 38];

// Pediatric teeth arrangement
const PEDO_UPPER_RIGHT = [55, 54, 53, 52, 51];
const PEDO_UPPER_LEFT = [61, 62, 63, 64, 65];
const PEDO_LOWER_RIGHT = [85, 84, 83, 82, 81];
const PEDO_LOWER_LEFT = [71, 72, 73, 74, 75];

// Plain English tooth names for easy understanding by any staff member
export const TOOTH_NAMES: Record<number, string> = {
  // Adult Maxillary
  18: 'Upper Right 3rd Molar (Wisdom)',
  17: 'Upper Right 2nd Molar',
  16: 'Upper Right 1st Molar',
  15: 'Upper Right 2nd Premolar',
  14: 'Upper Right 1st Premolar',
  13: 'Upper Right Canine (Eye Tooth)',
  12: 'Upper Right Lateral Incisor',
  11: 'Upper Right Central Incisor (Front)',
  21: 'Upper Left Central Incisor (Front)',
  22: 'Upper Left Lateral Incisor',
  23: 'Upper Left Canine (Eye Tooth)',
  24: 'Upper Left 1st Premolar',
  25: 'Upper Left 2nd Premolar',
  26: 'Upper Left 1st Molar',
  27: 'Upper Left 2nd Molar',
  28: 'Upper Left 3rd Molar (Wisdom)',

  // Adult Mandibular
  48: 'Lower Right 3rd Molar (Wisdom)',
  47: 'Lower Right 2nd Molar',
  46: 'Lower Right 1st Molar',
  45: 'Lower Right 2nd Premolar',
  44: 'Lower Right 1st Premolar',
  43: 'Lower Right Canine',
  42: 'Lower Right Lateral Incisor',
  41: 'Lower Right Central Incisor (Front)',
  31: 'Lower Left Central Incisor (Front)',
  32: 'Lower Left Lateral Incisor',
  33: 'Lower Left Canine',
  34: 'Lower Left 1st Premolar',
  35: 'Lower Left 2nd Premolar',
  36: 'Lower Left 1st Molar',
  37: 'Lower Left 2nd Molar',
  38: 'Lower Left 3rd Molar (Wisdom)',

  // Pediatric (Milk Teeth)
  55: 'Upper Right Milk 2nd Molar',
  54: 'Upper Right Milk 1st Molar',
  53: 'Upper Right Milk Canine',
  52: 'Upper Right Milk Lateral Incisor',
  51: 'Upper Right Milk Central Incisor',
  61: 'Upper Left Milk Central Incisor',
  62: 'Upper Left Milk Lateral Incisor',
  63: 'Upper Left Milk Canine',
  64: 'Upper Left Milk 1st Molar',
  65: 'Upper Left Milk 2nd Molar',
  85: 'Lower Right Milk 2nd Molar',
  84: 'Lower Right Milk 1st Molar',
  83: 'Lower Right Milk Canine',
  82: 'Lower Right Milk Lateral Incisor',
  81: 'Lower Right Milk Central Incisor',
  71: 'Lower Left Milk Central Incisor',
  72: 'Lower Left Milk Lateral Incisor',
  73: 'Lower Left Milk Canine',
  74: 'Lower Left Milk 1st Molar',
  75: 'Lower Left Milk 2nd Molar',
};

const COMMON_PROCEDURES = [
  { name: 'Root Canal Treatment (RCT)', cost: 3500 },
  { name: 'Composite Tooth Filling', cost: 1200 },
  { name: 'Zirconia Monolithic Crown', cost: 5000 },
  { name: 'PFM Ceramic Crown', cost: 3000 },
  { name: 'Tooth Extraction (Simple)', cost: 800 },
  { name: 'Surgical Extraction / Impaction', cost: 3500 },
  { name: 'Dental Implant Placement', cost: 25000 },
  { name: 'Post & Core Build-Up', cost: 1500 },
  { name: 'Full Mouth Scaling & Polishing', cost: 1000 }
];

const CONDITION_COLORS: Record<ToothConditionType, { bg: string; text: string; label: string; border: string }> = {
  healthy: { bg: 'bg-white', text: 'text-slate-700', label: 'Sound / Healthy', border: 'border-slate-300' },
  caries: { bg: 'bg-rose-500', text: 'text-white', label: 'Caries / Decay', border: 'border-rose-600' },
  filled: { bg: 'bg-blue-500', text: 'text-white', label: 'Filled / Restored', border: 'border-blue-600' },
  rct: { bg: 'bg-purple-600', text: 'text-white', label: 'Root Canal (RCT)', border: 'border-purple-700' },
  crown: { bg: 'bg-amber-400', text: 'text-slate-900', label: 'Crown / Cap', border: 'border-amber-500' },
  bridge: { bg: 'bg-yellow-500', text: 'text-slate-900', label: 'Bridge Unit', border: 'border-yellow-600' },
  missing: { bg: 'bg-slate-700', text: 'text-white', label: 'Missing Tooth', border: 'border-slate-800' },
  extraction_needed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Indicated for Extraction', border: 'border-red-500 border-dashed' },
  implant: { bg: 'bg-teal-500', text: 'text-white', label: 'Dental Implant', border: 'border-teal-600' }
};

export const DentalChart: React.FC<DentalChartProps> = ({
  patient,
  onUpdatePatientChart,
  onAddTreatmentPlanItem
}) => {
  const [archType, setArchType] = useState<ArchType>(patient.age <= 12 ? 'pediatric' : 'adult');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  
  // Modal state for tooth editing
  const [editingCondition, setEditingCondition] = useState<ToothConditionType>('healthy');
  const [editingSurfaces, setEditingSurfaces] = useState<ToothSurface[]>([]);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [planProcedure, setPlanProcedure] = useState<string>('');
  const [planCost, setPlanCost] = useState<number>(1500);

  const chart = patient.dentalChart || {};

  const handleToothClick = (toothNum: number) => {
    setSelectedTooth(toothNum);
    const existing = chart[toothNum];
    if (existing) {
      setEditingCondition(existing.condition);
      setEditingSurfaces(existing.surfaces || []);
      setEditingNotes(existing.notes || '');
    } else {
      setEditingCondition('healthy');
      setEditingSurfaces([]);
      setEditingNotes('');
    }
    setPlanProcedure('');
  };

  const handleSaveTooth = () => {
    if (selectedTooth === null) return;
    const updated = { ...chart };
    if (editingCondition === 'healthy' && editingSurfaces.length === 0 && !editingNotes) {
      delete updated[selectedTooth];
    } else {
      updated[selectedTooth] = {
        condition: editingCondition,
        surfaces: editingSurfaces,
        notes: editingNotes,
        updatedAt: new Date().toISOString()
      };
    }
    onUpdatePatientChart(updated);
    setSelectedTooth(null);
  };

  const toggleSurface = (surf: ToothSurface) => {
    if (editingSurfaces.includes(surf)) {
      setEditingSurfaces(editingSurfaces.filter(s => s !== surf));
    } else {
      setEditingSurfaces([...editingSurfaces, surf]);
    }
  };

  const handleAddToTreatmentPlan = () => {
    if (selectedTooth === null || !planProcedure || !onAddTreatmentPlanItem) return;
    onAddTreatmentPlanItem({
      patientId: patient.id,
      toothNumber: selectedTooth,
      diagnosis: editingCondition.toUpperCase().replace('_', ' '),
      procedure: planProcedure,
      estimatedCost: Number(planCost),
      status: 'Planned',
      doctorName: 'Dr. Anand Patil'
    });
    alert(`Added "${planProcedure}" for Tooth #${selectedTooth} to Treatment Plan!`);
  };

  const renderTooth = (toothNum: number) => {
    const data = chart[toothNum];
    const condition = data ? data.condition : 'healthy';
    const cfg = CONDITION_COLORS[condition];
    const hasNotes = Boolean(data?.notes);
    const surfaces = data?.surfaces || [];

    const toothName = TOOTH_NAMES[toothNum] || `Tooth #${toothNum}`;

    return (
      <button
        key={toothNum}
        type="button"
        onClick={() => handleToothClick(toothNum)}
        title={`${toothName} - Click to edit`}
        className={`group relative flex flex-col items-center p-1 sm:p-2 rounded-xl transition-all hover:scale-105 active:scale-95 border ${
          selectedTooth === toothNum ? 'ring-2 ring-teal-600 border-teal-600 shadow-sm' : 'border-slate-200/90 hover:border-teal-400'
        } bg-white`}
      >
        {/* Tooth Number */}
        <span className="text-[11px] font-bold text-slate-700 group-hover:text-teal-700">
          {toothNum}
        </span>

        {/* 5-Surface Tooth Diagram */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 my-1 flex items-center justify-center">
          {/* Missing Tooth Mark */}
          {condition === 'missing' && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-extrabold text-lg sm:text-xl z-20">
              ✕
            </div>
          )}

          {/* Implant Icon Indicator */}
          {condition === 'implant' && (
            <div className="absolute inset-0 flex items-center justify-center text-teal-800 font-extrabold text-xs z-20">
              🔩
            </div>
          )}

          {/* Tooth Surface SVG Graphic */}
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
            {/* Occlusal / Incisal (Center) */}
            <rect 
              x="12" y="12" width="16" height="16" rx="2"
              className={`transition-colors ${
                surfaces.includes('occlusal') || condition !== 'healthy'
                  ? cfg.bg
                  : 'fill-slate-50 stroke-slate-300 hover:fill-cyan-50'
              } stroke-[1.5]`} 
            />

            {/* Buccal (Top) */}
            <polygon 
              points="6,4 34,4 28,12 12,12"
              className={`transition-colors ${
                surfaces.includes('buccal')
                  ? 'fill-rose-500 stroke-rose-600'
                  : condition === 'crown' || condition === 'bridge' || condition === 'rct'
                  ? cfg.bg
                  : 'fill-slate-100 stroke-slate-300 hover:fill-cyan-50'
              } stroke-[1]`}
            />

            {/* Lingual (Bottom) */}
            <polygon 
              points="12,28 28,28 34,36 6,36"
              className={`transition-colors ${
                surfaces.includes('lingual')
                  ? 'fill-rose-500 stroke-rose-600'
                  : condition === 'crown' || condition === 'bridge' || condition === 'rct'
                  ? cfg.bg
                  : 'fill-slate-100 stroke-slate-300 hover:fill-cyan-50'
              } stroke-[1]`}
            />

            {/* Mesial (Left) */}
            <polygon 
              points="4,6 12,12 12,28 4,34"
              className={`transition-colors ${
                surfaces.includes('mesial')
                  ? 'fill-rose-500 stroke-rose-600'
                  : condition === 'crown' || condition === 'bridge' || condition === 'rct'
                  ? cfg.bg
                  : 'fill-slate-100 stroke-slate-300 hover:fill-cyan-50'
              } stroke-[1]`}
            />

            {/* Distal (Right) */}
            <polygon 
              points="36,6 28,12 28,28 36,34"
              className={`transition-colors ${
                surfaces.includes('distal')
                  ? 'fill-rose-500 stroke-rose-600'
                  : condition === 'crown' || condition === 'bridge' || condition === 'rct'
                  ? cfg.bg
                  : 'fill-slate-100 stroke-slate-300 hover:fill-cyan-50'
              } stroke-[1]`}
            />
          </svg>
        </div>

        {/* Condition Badge Indicator */}
        <div className="flex items-center gap-1 mt-0.5">
          <span className={`w-2 h-2 rounded-full ${cfg.bg} border ${cfg.border}`} />
          {hasNotes && (
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" title="Has Clinical Notes" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6">
      
      {/* Top Controls: Arch Type Switcher & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Interactive Dental Arch Chart
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              FDI Standard
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any tooth to mark condition (Caries, RCT, Cap, Missing) or add to patient's treatment plan.
          </p>
        </div>

        {/* Arch Type Toggle */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setArchType('adult')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              archType === 'adult'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Adult Teeth (32)</span>
          </button>
          <button
            type="button"
            onClick={() => setArchType('pediatric')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              archType === 'pediatric'
                ? 'bg-white text-teal-800 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>Child / Milk Teeth (20)</span>
          </button>
        </div>
      </div>

      {/* Color Legend Bar */}
      <div className="py-3.5 border-b border-slate-100 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Legend:</span>
          {Object.entries(CONDITION_COLORS).map(([type, val]) => (
            <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700">
              <span className={`w-2.5 h-2.5 rounded-sm ${val.bg} border ${val.border}`} />
              <span className="font-semibold text-[11px]">{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Chart Container */}
      <div className="py-5 space-y-6">
        
        {/* Upper Arch (Maxilla) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Upper Right
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
              UPPER JAW (MAXILLARY ARCH)
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Upper Left
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Upper Right Quadrant */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
              {(archType === 'adult' ? ADULT_UPPER_RIGHT : PEDO_UPPER_RIGHT).map(renderTooth)}
            </div>

            {/* Midline Divider */}
            <div className="flex items-center justify-start gap-1 sm:gap-2 flex-wrap border-l border-slate-300 pl-2 sm:pl-4">
              {(archType === 'adult' ? ADULT_UPPER_LEFT : PEDO_UPPER_LEFT).map(renderTooth)}
            </div>
          </div>
        </div>

        {/* Lower Arch (Mandible) */}
        <div>
          <div className="flex items-center justify-between mb-2 px-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lower Right
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-0.5 rounded-full border border-teal-200">
              LOWER JAW (MANDIBULAR ARCH)
            </span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Lower Left
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            {/* Lower Right Quadrant */}
            <div className="flex items-center justify-end gap-1 sm:gap-2 flex-wrap">
              {(archType === 'adult' ? ADULT_LOWER_RIGHT : PEDO_LOWER_RIGHT).map(renderTooth)}
            </div>

            {/* Midline Divider */}
            <div className="flex items-center justify-start gap-1 sm:gap-2 flex-wrap border-l border-slate-300 pl-2 sm:pl-4">
              {(archType === 'adult' ? ADULT_LOWER_LEFT : PEDO_LOWER_LEFT).map(renderTooth)}
            </div>
          </div>
        </div>

      </div>

      {/* Selected Tooth Edit Modal / Sidebar */}
      {selectedTooth !== null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-lg shadow-xs">
                  #{selectedTooth}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {TOOTH_NAMES[selectedTooth] || `Tooth #${selectedTooth}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Patient: {patient.name} ({patient.uniqueId})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTooth(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Quick Status Setter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Tooth Status (1-Click)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(CONDITION_COLORS).map(([cond, val]) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setEditingCondition(cond as ToothConditionType)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-xs font-semibold border transition text-left ${
                        editingCondition === cond
                          ? 'border-teal-600 bg-teal-50 text-teal-900 ring-1 ring-teal-600'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${val.bg} border ${val.border}`} />
                      <span className="truncate">{val.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface-Wise Selector with Clear Anatomical Hints */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Surfaces Involved (Click to Mark)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  O: Chewing surface • M: Front/Center • D: Back • B: Cheek/Lip • L: Tongue/Palate
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {([
                    { key: 'occlusal', label: 'O', desc: 'Chewing' },
                    { key: 'mesial', label: 'M', desc: 'Front' },
                    { key: 'distal', label: 'D', desc: 'Back' },
                    { key: 'buccal', label: 'B', desc: 'Cheek' },
                    { key: 'lingual', label: 'L', desc: 'Tongue' }
                  ] as { key: ToothSurface; label: string; desc: string }[]).map(item => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleSurface(item.key)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition border flex flex-col items-center justify-center ${
                        editingSurfaces.includes(item.key)
                          ? 'bg-rose-500 text-white border-rose-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm font-black">{item.label}</span>
                      <span className="text-[9px] font-normal opacity-90">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tooth Notes / Symptoms (Optional)
                </label>
                <input
                  type="text"
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="e.g. Tenderness on chewing, deep caries, fractured cuspal edge..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Quick Add to Treatment Plan */}
              <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <Stethoscope className="w-4 h-4 text-teal-700" />
                    <span>Add to Patient Treatment Plan</span>
                  </div>
                  <span className="text-[10px] text-teal-700 font-semibold">1-Click Shortcut</span>
                </div>

                {/* Common Procedure Quick Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {COMMON_PROCEDURES.slice(0, 4).map(proc => (
                    <button
                      key={proc.name}
                      type="button"
                      onClick={() => {
                        setPlanProcedure(proc.name);
                        setPlanCost(proc.cost);
                      }}
                      className="px-2 py-1 rounded-lg bg-white border border-teal-200 hover:border-teal-400 text-[11px] font-semibold text-teal-800 transition shadow-2xs"
                    >
                      {proc.name.split(' ')[0]} {proc.name.includes('RCT') ? 'RCT' : proc.name.includes('Crown') ? 'Cap' : 'Filling'} (₹{proc.cost})
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Procedure Name"
                      value={planProcedure}
                      onChange={(e) => setPlanProcedure(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-teal-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Cost (₹)"
                      value={planCost}
                      onChange={(e) => setPlanCost(Number(e.target.value))}
                      className="w-full text-xs p-2 rounded-xl border border-teal-200 bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {planProcedure && (
                  <button
                    type="button"
                    onClick={handleAddToTreatmentPlan}
                    className="w-full py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save "{planProcedure}" to Plan (₹{planCost})</span>
                  </button>
                )}
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setEditingCondition('healthy');
                  setEditingSurfaces([]);
                  setEditingNotes('');
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Healthy</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTooth(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTooth}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition"
                >
                  Save Tooth Data
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
