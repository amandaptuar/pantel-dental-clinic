import React, { useState } from 'react';
import { 
  Patient, 
  RCTRecord, 
  CrownBridgeRecord, 
  SmileDesignVeneerRecord, 
  AlignerFMRRecord, 
  UserAccount 
} from '../types';
import { StorageService } from '../services/storage';
import { 
  Sparkles, 
  Activity, 
  Layers, 
  Smile, 
  ShieldAlert, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpecializedRecordsProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
}

export const SpecializedRecords: React.FC<SpecializedRecordsProps> = ({
  patients,
  selectedPatientId,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'RCT' | 'Crown & Bridge' | 'Smile Designing' | 'Aligners & FMR'>('RCT');
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');

  // Record States
  const [rctRecords, setRctRecords] = useState<RCTRecord[]>(StorageService.getRCTRecords());
  const [crownRecords, setCrownRecords] = useState<CrownBridgeRecord[]>(StorageService.getCrownRecords());
  const [smileRecords, setSmileRecords] = useState<SmileDesignVeneerRecord[]>(StorageService.getSmileDesignRecords());
  const [alignerRecords, setAlignerRecords] = useState<AlignerFMRRecord[]>(StorageService.getAlignerRecords());

  // New RCT Modal
  const [showRctModal, setShowRctModal] = useState(false);
  const [rctTooth, setRctTooth] = useState<number>(46);
  const [rctType, setRctType] = useState<'RCT' | 'Re-RCT'>('RCT');
  const [rctCanals, setRctCanals] = useState<{ name: string; workingLength: number; referencePoint: string; maf: string }[]>([
    { name: 'MB', workingLength: 21, referencePoint: 'MB Cusp', maf: '25/04' },
    { name: 'ML', workingLength: 20.5, referencePoint: 'ML Cusp', maf: '25/04' },
    { name: 'Distal', workingLength: 21.5, referencePoint: 'Distal Cusp', maf: '30/04' }
  ]);
  const [rctSealer, setRctSealer] = useState('Bio-ceramic Sealer (CeraSeal)');
  const [rctIrrigation, setRctIrrigation] = useState('3% NaOCl + 17% EDTA ultrasonic');
  const [rctPostCore, setRctPostCore] = useState(false);

  // New Crown Modal
  const [showCrownModal, setShowCrownModal] = useState(false);
  const [crownTeeth, setCrownTeeth] = useState<string>('36');
  const [crownMaterial, setCrownMaterial] = useState<CrownBridgeRecord['material']>('Zirconia Monolithic');
  const [crownShade, setCrownShade] = useState('A2');
  const [crownLab, setCrownLab] = useState('Sai Precision Dental Lab, Pune');
  const [crownDueDate, setCrownDueDate] = useState(new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0]);

  // New Smile Design Modal
  const [showSmileModal, setShowSmileModal] = useState(false);
  const [smileInitialShade, setSmileInitialShade] = useState('A3');
  const [smileTargetShade, setSmileTargetShade] = useState('BL2 (Bleach White)');
  const [smileTeeth, setSmileTeeth] = useState('11, 12, 21, 22');

  // New Aligner Modal
  const [showAlignerModal, setShowAlignerModal] = useState(false);
  const [totalTraysUpper, setTotalTraysUpper] = useState(16);
  const [totalTraysLower, setTotalTraysLower] = useState(14);
  const [currentTray, setCurrentTray] = useState(1);
  const [iprDetails, setIprDetails] = useState('0.2mm between lower incisors');

  const currentPatient = patients.find(p => p.id === patientId);

  // Save Handlers
  const handleSaveRct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    StorageService.addRCTRecord({
      patientId: currentPatient.id,
      toothNumber: Number(rctTooth),
      type: rctType,
      canals: rctCanals,
      irrigationUsed: rctIrrigation,
      sealerUsed: rctSealer,
      obturationTechnique: 'Single-cone hydraulic obturation',
      postCoreDone: rctPostCore,
      completionDate: new Date().toISOString().split('T')[0]
    });

    setRctRecords(StorageService.getRCTRecords());
    setShowRctModal(false);
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleSaveCrown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    const teethArr = crownTeeth.split(',').map(t => parseInt(t.trim(), 10)).filter(Boolean);

    StorageService.addCrownRecord({
      patientId: currentPatient.id,
      teethInvolved: teethArr,
      type: teethArr.length > 1 ? 'Bridge' : 'Crown',
      material: crownMaterial,
      shade: crownShade,
      labName: crownLab,
      prepDate: new Date().toISOString().split('T')[0],
      impressionSentDate: new Date().toISOString().split('T')[0],
      labDueDate: crownDueDate,
      status: 'Sent to Lab'
    });

    setCrownRecords(StorageService.getCrownRecords());
    setShowCrownModal(false);
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleSaveSmile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    const teethArr = smileTeeth.split(',').map(t => parseInt(t.trim(), 10)).filter(Boolean);

    StorageService.addSmileDesignRecord({
      patientId: currentPatient.id,
      teethInvolved: teethArr,
      treatmentType: 'Porcelain Veneers',
      initialShade: smileInitialShade,
      targetShade: smileTargetShade,
      mockupApprovedDate: new Date().toISOString().split('T')[0],
      photographyNotes: 'Full-face 1:1 anterior smile photography completed.',
      status: 'Consultation & Mockup'
    });

    setSmileRecords(StorageService.getSmileDesignRecords());
    setShowSmileModal(false);
  };

  const handleSaveAligner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    StorageService.addAlignerRecord({
      patientId: currentPatient.id,
      treatmentType: 'Clear Aligners',
      totalTraysUpper: Number(totalTraysUpper),
      totalTraysLower: Number(totalTraysLower),
      currentTrayNumber: Number(currentTray),
      trayChangeIntervalDays: 14,
      iprDetails,
      attachmentsPlan: 'Composite attachments on premolars',
      status: 'Active Movement',
      nextReviewDate: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0]
    });

    setAlignerRecords(StorageService.getAlignerRecords());
    setShowAlignerModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Patient Select */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-700" />
            Specialized Dental Treatment Records
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Endodontic RCT canals &amp; working lengths, Crown &amp; Bridge lab tracking, Veneers shade studio, and Clear Aligners/FMR staging.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
            Viewing Patient:
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
      </div>

      {/* Specialty Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'RCT', label: 'RCT / Re-RCT Records', icon: Activity },
          { id: 'Crown & Bridge', label: 'Crown & Bridge Records', icon: Layers },
          { id: 'Smile Designing', label: 'Veneers & Smile Designing', icon: Smile },
          { id: 'Aligners & FMR', label: 'Aligners & FMR Records', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-700 text-white shadow-2xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: RCT & Re-RCT Records */}
      {activeTab === 'RCT' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Endodontic Working Length &amp; Obturation Log
            </h3>
            <button
              type="button"
              onClick={() => setShowRctModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record New RCT / Re-RCT</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rctRecords.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
                No RCT records found.
              </div>
            ) : (
              rctRecords.map(rct => {
                const pat = patients.find(p => p.id === rct.patientId);
                return (
                  <div key={rct.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 font-extrabold flex items-center justify-center text-xs">
                          #{rct.toothNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{pat?.name || 'Patient'}</h4>
                          <span className="text-[10px] font-semibold text-purple-700">{rct.type} Completed</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{rct.completionDate}</span>
                    </div>

                    {/* Canals Working Length Table */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <span className="font-bold text-[11px] text-slate-700 uppercase">Canals &amp; Working Lengths:</span>
                      <div className="grid grid-cols-3 gap-2 mt-1.5">
                        {rct.canals.map((c, i) => (
                          <div key={i} className="p-1.5 bg-white rounded-lg border border-slate-200 text-center">
                            <span className="font-extrabold text-slate-900">{c.name}</span>
                            <p className="text-[10px] text-cyan-800 font-bold">{c.workingLength} mm</p>
                            <p className="text-[9px] text-slate-400">MAF: {c.maf}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p><strong>Sealer:</strong> {rct.sealerUsed}</p>
                      <p><strong>Irrigant:</strong> {rct.irrigationUsed}</p>
                      {rct.notes && <p className="italic text-slate-500">"{rct.notes}"</p>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Crown & Bridge Records */}
      {activeTab === 'Crown & Bridge' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Fixed Prosthodontic (Crown &amp; Bridge) Tracking
            </h3>
            <button
              type="button"
              onClick={() => setShowCrownModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Crown / Bridge</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crownRecords.map(cb => {
              const pat = patients.find(p => p.id === cb.patientId);
              return (
                <div key={cb.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pat?.name}</h4>
                      <p className="text-[11px] text-cyan-800 font-semibold">Teeth: #{cb.teethInvolved.join(', ')} ({cb.type})</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {cb.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Material</span>
                      <p className="font-bold text-slate-900">{cb.material}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">VITA Shade</span>
                      <p className="font-bold text-cyan-700">{cb.shade}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Lab Name</span>
                      <p className="font-semibold text-slate-800 truncate">{cb.labName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Cement Used</span>
                      <p className="font-semibold text-slate-800">{cb.cementUsed || 'Pending'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Smile Designing & Veneers */}
      {activeTab === 'Smile Designing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Aesthetic Studio: Veneers &amp; Smile Makeover
            </h3>
            <button
              type="button"
              onClick={() => setShowSmileModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Smile Case</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {smileRecords.map(sd => {
              const pat = patients.find(p => p.id === sd.patientId);
              return (
                <div key={sd.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pat?.name}</h4>
                      <p className="text-[11px] text-cyan-800 font-semibold">{sd.treatmentType}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                      {sd.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Pre-Op Shade</span>
                      <p className="font-bold text-slate-700">{sd.initialShade}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase">Target Bleach Shade</span>
                      <p className="font-bold text-cyan-800">{sd.targetShade}</p>
                    </div>
                  </div>

                  {sd.photographyNotes && (
                    <p className="text-[11px] text-slate-500 italic">
                      "{sd.photographyNotes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Clear Aligners & FMR */}
      {activeTab === 'Aligners & FMR' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Clear Aligners Staging &amp; Full Mouth Rehabilitation (FMR)
            </h3>
            <button
              type="button"
              onClick={() => setShowAlignerModal(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Aligner / FMR Case</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alignerRecords.map(al => {
              const pat = patients.find(p => p.id === al.patientId);
              return (
                <div key={al.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{pat?.name}</h4>
                      <p className="text-[11px] text-cyan-800 font-semibold">{al.treatmentType}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {al.status}
                    </span>
                  </div>

                  <div className="bg-cyan-50/60 p-3 rounded-xl border border-cyan-100 text-xs flex items-center justify-around text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Current Tray</span>
                      <p className="text-xl font-black text-cyan-900">#{al.currentTrayNumber}</p>
                    </div>
                    <div className="h-8 w-px bg-cyan-200" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Total Trays</span>
                      <p className="text-base font-bold text-slate-700">{al.totalTraysUpper} U / {al.totalTraysLower} L</p>
                    </div>
                    <div className="h-8 w-px bg-cyan-200" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Interval</span>
                      <p className="text-base font-bold text-slate-700">{al.trayChangeIntervalDays} Days</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p><strong>IPR Details:</strong> {al.iprDetails}</p>
                    <p><strong>Attachments:</strong> {al.attachmentsPlan}</p>
                    <p><strong>Next Review:</strong> {al.nextReviewDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal 1: New RCT */}
      {showRctModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Record Root Canal Details (Tooth #{rctTooth})</h3>
            <form onSubmit={handleSaveRct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tooth #</label>
                  <input type="number" value={rctTooth} onChange={(e) => setRctTooth(Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Type</label>
                  <select value={rctType} onChange={(e) => setRctType(e.target.value as any)} className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50">
                    <option value="RCT">RCT (Primary)</option>
                    <option value="Re-RCT">Re-RCT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Sealer Used</label>
                <input type="text" value={rctSealer} onChange={(e) => setRctSealer(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" required />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Irrigation Protocol</label>
                <input type="text" value={rctIrrigation} onChange={(e) => setRctIrrigation(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowRctModal(false)} className="px-3 py-1.5 rounded-lg text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-cyan-700 font-bold">Save RCT Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: New Crown */}
      {showCrownModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">Record Crown / Bridge Fabrication</h3>
            <form onSubmit={handleSaveCrown} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teeth Involved (e.g. 36 or 11, 21)</label>
                <input type="text" value={crownTeeth} onChange={(e) => setCrownTeeth(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" required />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Material</label>
                <select value={crownMaterial} onChange={(e) => setCrownMaterial(e.target.value as any)} className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50">
                  <option value="Zirconia Monolithic">Zirconia Monolithic</option>
                  <option value="Layered Zirconia">Layered Zirconia</option>
                  <option value="PFM (Porcelain Fused to Metal)">PFM (Porcelain Fused to Metal)</option>
                  <option value="E.max Lithium Disilicate">E.max Lithium Disilicate</option>
                  <option value="Full Metal">Full Metal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Shade</label>
                  <input type="text" value={crownShade} onChange={(e) => setCrownShade(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" required />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lab Due Date</label>
                  <input type="date" value={crownDueDate} onChange={(e) => setCrownDueDate(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" required />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowCrownModal(false)} className="px-3 py-1.5 rounded-lg text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-cyan-700 font-bold">Save Crown Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: New Smile Design */}
      {showSmileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">New Smile Design / Veneer Case</h3>
            <form onSubmit={handleSaveSmile} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Teeth (e.g. 11, 12, 21, 22)</label>
                <input type="text" value={smileTeeth} onChange={(e) => setSmileTeeth(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Pre-op Shade</label>
                  <input type="text" value={smileInitialShade} onChange={(e) => setSmileInitialShade(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Bleach Shade</label>
                  <input type="text" value={smileTargetShade} onChange={(e) => setSmileTargetShade(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowSmileModal(false)} className="px-3 py-1.5 rounded-lg text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-cyan-700 font-bold">Save Smile Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: New Aligner */}
      {showAlignerModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 mb-4">New Clear Aligner / FMR Case</h3>
            <form onSubmit={handleSaveAligner} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Upper Trays</label>
                  <input type="number" value={totalTraysUpper} onChange={(e) => setTotalTraysUpper(Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Lower Trays</label>
                  <input type="number" value={totalTraysLower} onChange={(e) => setTotalTraysLower(Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Current Tray Number</label>
                <input type="number" value={currentTray} onChange={(e) => setCurrentTray(Number(e.target.value))} className="w-full p-2 rounded-lg border border-slate-200" />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">IPR Details</label>
                <input type="text" value={iprDetails} onChange={(e) => setIprDetails(e.target.value)} className="w-full p-2 rounded-lg border border-slate-200" />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowAlignerModal(false)} className="px-3 py-1.5 rounded-lg text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg text-white bg-cyan-700 font-bold">Save Aligner Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
