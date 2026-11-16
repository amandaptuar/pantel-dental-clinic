import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2,
  HardDrive,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BackupAndSupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const BackupAndSupabaseModal: React.FC<BackupAndSupabaseModalProps> = ({
  isOpen,
  onClose,
  onDataChanged
}) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. One-click Download Backup File
  const handleDownloadBackup = () => {
    const json = StorageService.exportAllDataJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Patil_Dental_Clinic_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMessage('Backup file downloaded successfully!');
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  // 2. One-click Restore from Backup File
  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = StorageService.importAllDataJSON(content);
      if (success) {
        setStatusMessage('Backup restored successfully!');
        onDataChanged();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        alert('Invalid backup file. Please select a valid backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // 3. Simple CSV / Excel Export
  const handleExportCSV = (type: 'patients' | 'invoices' | 'appointments') => {
    let csvContent = '';
    let filename = '';

    if (type === 'patients') {
      const patients = StorageService.getPatients();
      const headers = ['Unique ID', 'Name', 'Age', 'Gender', 'Phone', 'Address', 'Medical History'];
      const rows = patients.map(p => [
        p.uniqueId,
        `"${p.name}"`,
        p.age,
        p.gender,
        p.phone,
        `"${p.address || ''}"`,
        `"${(p.medicalHistory || []).join('; ')}"`
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = 'Patil_Dental_Patients.csv';
    } else if (type === 'invoices') {
      const invoices = StorageService.getInvoices();
      const headers = ['Invoice Number', 'Patient Name', 'Phone', 'Date', 'Total', 'Paid', 'Balance', 'Status'];
      const rows = invoices.map(i => [
        i.invoiceNumber,
        `"${i.patientName}"`,
        i.patientPhone,
        i.date,
        i.grandTotal,
        i.amountPaid,
        i.balanceDue,
        i.status
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = 'Patil_Dental_Invoices.csv';
    } else if (type === 'appointments') {
      const appointments = StorageService.getAppointments();
      const headers = ['Date', 'Time', 'Patient', 'Phone', 'Doctor', 'Treatment', 'Status'];
      const rows = appointments.map(a => [
        a.date,
        a.time,
        `"${a.patientName}"`,
        a.patientPhone,
        `"${a.doctorName}"`,
        `"${a.treatmentType}"`,
        a.status
      ]);
      csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      filename = 'Patil_Dental_Appointments.csv';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 animate-in zoom-in-95 duration-150">
        
        {/* Simple Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Clinic Data Backup
              </h3>
              <p className="text-xs text-slate-500">
                Download a local copy or export spreadsheets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Success Alert */}
        {statusMessage && (
          <div className="my-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="py-5 space-y-5">
          
          {/* Action 1: Download Full Backup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Download Complete Backup</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Save all patients, dental charts, appointments and bills to your device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadBackup}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5 flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>

          {/* Action 2: Restore from Backup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Restore from File</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload a previously downloaded backup file to restore records.
              </p>
            </div>

            <label className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-xs transition cursor-pointer flex items-center gap-1.5 flex-shrink-0">
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>Upload File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleRestoreBackup}
                className="hidden"
              />
            </label>
          </div>

          {/* Action 3: Simple Excel / CSV Exports */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-1">
              Export to Excel (CSV):
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleExportCSV('patients')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-center transition group"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-700 mx-auto mb-1 group-hover:scale-105 transition" />
                <span className="text-[11px] font-bold text-slate-800 block">Patients</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCSV('invoices')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-center transition group"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-700 mx-auto mb-1 group-hover:scale-105 transition" />
                <span className="text-[11px] font-bold text-slate-800 block">Invoices</span>
              </button>

              <button
                type="button"
                onClick={() => handleExportCSV('appointments')}
                className="p-3 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-center transition group"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-700 mx-auto mb-1 group-hover:scale-105 transition" />
                <span className="text-[11px] font-bold text-slate-800 block">Visits</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
