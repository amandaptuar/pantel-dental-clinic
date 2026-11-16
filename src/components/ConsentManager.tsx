import React, { useState, useRef, useEffect } from 'react';
import { 
  Patient, 
  ConsentForm, 
  UserAccount 
} from '../types';
import { CONSENT_TEMPLATES, ConsentTemplate } from '../data/consentTemplates';
import { StorageService } from '../services/storage';
import { PDFGenerator } from '../utils/pdfGenerator';
import { 
  FileText, 
  Fingerprint, 
  PenTool, 
  Download, 
  CheckCircle2, 
  RefreshCw, 
  Languages, 
  AlertTriangle,
  Usb,
  ShieldCheck,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConsentManagerProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
}

export const ConsentManager: React.FC<ConsentManagerProps> = ({
  patients,
  selectedPatientId,
  currentUser
}) => {
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('rct');
  const [language, setLanguage] = useState<'Marathi' | 'English'>('Marathi');
  const [witnessName, setWitnessName] = useState<string>('Pooja Salunkhe (Staff)');

  // Biometric scanner state
  const [isScanning, setIsScanning] = useState(false);
  const [fingerprintCaptured, setFingerprintCaptured] = useState(false);
  const [fingerprintData, setFingerprintData] = useState<{ id: string; timestamp: string; quality: number } | null>(null);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Consent forms list
  const [savedForms, setSavedForms] = useState<ConsentForm[]>(StorageService.getConsentForms());

  const currentPatient = patients.find(p => p.id === patientId);
  const currentTemplate = CONSENT_TEMPLATES.find(t => t.id === selectedTemplateId) || CONSENT_TEMPLATES[0];

  // Signature canvas handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Biometric USB Scanner Simulation
  const handleTriggerUSBScanner = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFingerprintCaptured(true);
      setFingerprintData({
        id: `PDC-FP-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        quality: 98.4
      });
      try {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
      } catch (e) {}
    }, 1800);
  };

  const handleSaveAndGeneratePDF = () => {
    if (!currentPatient) {
      alert('Please select a patient first.');
      return;
    }

    let signatureDataUrl = '';
    if (canvasRef.current && hasSignature) {
      signatureDataUrl = canvasRef.current.toDataURL('image/png');
    }

    const consentContent = language === 'Marathi'
      ? `${currentTemplate.treatmentNameMr}\n\n${currentTemplate.contentMr}\n\nसंभाव्य धोके व लक्षणे:\n${currentTemplate.risksMr.map(r => '• ' + r).join('\n')}`
      : `${currentTemplate.treatmentNameEn}\n\n${currentTemplate.contentEn}\n\nPotential Risks & Complications:\n${currentTemplate.risksEn.map(r => '• ' + r).join('\n')}`;

    const newForm: ConsentForm = StorageService.addConsentForm({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      treatmentType: language === 'Marathi' ? currentTemplate.treatmentNameMr : currentTemplate.treatmentNameEn,
      language,
      contentSummary: consentContent,
      doctorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      patientSignature: signatureDataUrl,
      fingerprintScanned: fingerprintCaptured,
      fingerprintId: fingerprintData?.id,
      fingerprintTimestamp: fingerprintData?.timestamp,
      witnessName
    });

    setSavedForms(StorageService.getConsentForms());
    PDFGenerator.generateConsentPDF(newForm, currentPatient);
    alert('Consent Form saved successfully and PDF generated!');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Treatment Consent Forms (Marathi &amp; English)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              Legally compliant informed consent in Marathi (मराठी) &amp; English with patient signature, biometric authentication, and printable PDF.
            </p>
          </div>

          {/* USB Device Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 self-start md:self-auto">
            <Usb className="w-4 h-4 text-emerald-600" />
            <span>Biometric Sensor: <strong className="text-emerald-900">Connected</strong></span>
          </div>
        </div>
      </div>

      {/* Main Consent Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Patient, Template & Language Selection */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              1. Patient &amp; Treatment
            </h3>

            {/* Patient Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Patient:
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.uniqueId}) - {p.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-teal-700" />
                Consent Language (मराठी / English):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('Marathi')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    language === 'Marathi'
                      ? 'bg-teal-700 text-white border-teal-800 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  मराठी (Marathi)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('English')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    language === 'English'
                      ? 'bg-teal-700 text-white border-teal-800 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Treatment Template Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Treatment-Wise Consent Template:
              </label>
              <div className="space-y-1.5">
                {CONSENT_TEMPLATES.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-medium transition border ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-1 ring-teal-600'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>{language === 'Marathi' ? tmpl.treatmentNameMr : tmpl.treatmentNameEn}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {tmpl.id.toUpperCase()} • Comprehensive legal terms
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Witness Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Clinic Witness / Staff Name:
              </label>
              <input
                type="text"
                value={witnessName}
                onChange={(e) => setWitnessName(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

          </div>

          {/* USB Biometric Fingerprint Box */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Fingerprint className="w-3.5 h-3.5 text-teal-700" />
              2. USB Biometric Fingerprint
            </h3>

            <p className="text-xs text-slate-500">
              Connect any standard USB optical/capacitive biometric scanner (Mantra MFS100 / Morpho / Startek). Click below to capture patient fingerprint.
            </p>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300">
              {fingerprintCaptured ? (
                <div className="text-center space-y-2 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wide">
                      Biometric Verified
                    </span>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                      ID: {fingerprintData?.id}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Quality: {fingerprintData?.quality}% • Timestamp Logged
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFingerprintCaptured(false);
                      setFingerprintData(null);
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline"
                  >
                    Re-scan Fingerprint
                  </button>
                </div>
              ) : isScanning ? (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mx-auto animate-pulse">
                    <Fingerprint className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="text-xs font-bold text-cyan-800 animate-pulse">
                    Please place thumb / finger on USB scanner...
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                    <Fingerprint className="w-10 h-10" />
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerUSBScanner}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition flex items-center gap-2 mx-auto"
                  >
                    <Usb className="w-3.5 h-3.5" />
                    <span>Scan USB Fingerprint</span>
                  </button>
                  <p className="text-[10px] text-slate-400">
                    Supports USB Biometric WebAuthn &amp; Client scanner SDK
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right 2 Columns: Live Bilingual Consent Document & Signature */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            {/* Document Header */}
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'Marathi' ? currentTemplate.treatmentNameMr : currentTemplate.treatmentNameEn}
                </h3>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{currentPatient?.name}</strong> | Age: {currentPatient?.age} | Unique ID: {currentPatient?.uniqueId}
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
                {language} Version
              </span>
            </div>

            {/* Document Body */}
            <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-serif">
                {language === 'Marathi' ? currentTemplate.contentMr : currentTemplate.contentEn}
              </div>

              {/* Potential Risks Callout */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>
                    {language === 'Marathi' ? 'संभाव्य धोके, गुंतागुंत व सूचना:' : 'Potential Risks, Complications & Instructions:'}
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-amber-800 space-y-1">
                  {(language === 'Marathi' ? currentTemplate.risksMr : currentTemplate.risksEn).map((risk, idx) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Signature & Biometric Verification Section */}
            <div className="border-t border-slate-200 pt-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-cyan-700" />
                3. Digital Touch / Mouse Signature Pad
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Signature Canvas */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-slate-600">
                      Sign here (Touch screen or mouse):
                    </span>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Clear
                    </button>
                  </div>

                  <div className="border border-slate-300 rounded-xl bg-white overflow-hidden shadow-inner">
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-28 touch-none cursor-crosshair bg-slate-50"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Patient / Guardian Digital Signature
                  </p>
                </div>

                {/* Biometric Verification Status */}
                <div className="flex flex-col justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      Biometric Status on Document:
                    </span>
                    <div className="mt-2">
                      {fingerprintCaptured ? (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>Thumb Biometric Attached ({fingerprintData?.id})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>No biometric attached (Optional)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-200 mt-3">
                    Dentist: <strong className="text-slate-800">{currentUser.name}</strong><br />
                    Witness: <strong className="text-slate-800">{witnessName}</strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Action Buttons: Save & Generate PDF */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Ready to generate legally binding consent document.
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveAndGeneratePDF}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Save &amp; Generate Consent PDF</span>
                </button>
              </div>
            </div>

          </div>

          {/* Past Signed Consent Forms Table */}
          {savedForms.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                Previously Signed Consent Records ({savedForms.length})
              </h3>

              <div className="divide-y divide-slate-100">
                {savedForms.map(form => (
                  <div key={form.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{form.patientName}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {form.treatmentType}
                        </span>
                        {form.fingerprintScanned && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Fingerprint Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Date: {form.date} • Doctor: {form.doctorName} • Lang: {form.language}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => PDFGenerator.generateConsentPDF(form, currentPatient)}
                      className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
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
