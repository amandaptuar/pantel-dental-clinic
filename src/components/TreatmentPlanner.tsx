import React, { useState } from 'react';
import { 
  Patient, 
  TreatmentPlanItem, 
  UserAccount 
} from '../types';
import { StorageService } from '../services/storage';
import { 
  Stethoscope, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Calendar 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreatmentPlannerProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
  onNavigateToBilling?: () => void;
}

export const TreatmentPlanner: React.FC<TreatmentPlannerProps> = ({
  patients,
  selectedPatientId,
  currentUser,
  onNavigateToBilling
}) => {
  const [patientId, setPatientId] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [plans, setPlans] = useState<TreatmentPlanItem[]>(StorageService.getTreatmentPlans());
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form
  const [toothNumber, setToothNumber] = useState<number>(36);
  const [diagnosis, setDiagnosis] = useState('Deep Dental Caries with Pulp Involvement');
  const [procedure, setProcedure] = useState('Root Canal Treatment + Core Build-Up');
  const [estimatedCost, setEstimatedCost] = useState<number>(4500);

  const currentPatient = patients.find(p => p.id === patientId);
  const patientPlans = plans.filter(p => p.patientId === patientId);

  const handleCreatePlanItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;

    StorageService.addTreatmentPlan({
      patientId: currentPatient.id,
      toothNumber: Number(toothNumber),
      diagnosis,
      procedure,
      estimatedCost: Number(estimatedCost),
      status: 'Planned',
      doctorName: currentUser.name
    });

    setPlans(StorageService.getTreatmentPlans());
    setShowAddModal(false);
    try {
      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleUpdateStatus = (item: TreatmentPlanItem, status: TreatmentPlanItem['status']) => {
    const updated = { ...item, status };
    StorageService.updateTreatmentPlan(updated);
    setPlans(StorageService.getTreatmentPlans());
  };

  const handleDeleteItem = (id: string) => {
    StorageService.deleteTreatmentPlan(id);
    setPlans(StorageService.getTreatmentPlans());
  };

  const handleGenerateInvoiceFromPlan = () => {
    if (!currentPatient || patientPlans.length === 0) return;

    const completedOrAll = patientPlans.filter(p => p.status === 'Completed').length > 0
      ? patientPlans.filter(p => p.status === 'Completed')
      : patientPlans;

    const items = completedOrAll.map(p => ({
      description: p.procedure,
      toothNumber: p.toothNumber,
      cost: p.estimatedCost
    }));

    const subtotal = items.reduce((sum, i) => sum + i.cost, 0);

    StorageService.addInvoice({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      patientPhone: currentPatient.phone,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount: 0,
      tax: 0,
      grandTotal: subtotal,
      amountPaid: 0,
      balanceDue: subtotal,
      status: 'Unpaid',
      payments: []
    });

    alert(`Generated invoice with ${items.length} procedures for ₹${subtotal.toLocaleString('en-IN')}!`);
    if (onNavigateToBilling) onNavigateToBilling();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Diagnosis &amp; Comprehensive Treatment Planning
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Organize multi-stage dental procedures tooth-wise with cost estimations. Convert completed procedures directly to Invoices.
          </p>
        </div>

        <div className="w-full sm:w-72">
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
      </div>

      {/* Main Treatment Plan Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Treatment Plan for {currentPatient?.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Total Estimated Treatment Cost: <strong className="text-teal-800">₹{patientPlans.reduce((s, p) => s + p.estimatedCost, 0).toLocaleString('en-IN')}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {patientPlans.length > 0 && (
              <button
                type="button"
                onClick={handleGenerateInvoiceFromPlan}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Create Invoice from Plan</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Planned Procedure</span>
            </button>
          </div>
        </div>

        {/* Treatment Plan Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-semibold text-[11px] bg-slate-50/50">
                <th className="py-3 px-3">Tooth #</th>
                <th className="py-3 px-3">Diagnosis</th>
                <th className="py-3 px-3">Planned Procedure</th>
                <th className="py-3 px-3">Estimated Cost</th>
                <th className="py-3 px-3">Doctor</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patientPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No treatment plans yet. Click "+ Add Planned Procedure" above or add directly from the Dental Chart.
                  </td>
                </tr>
              ) : (
                patientPlans.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.toothNumber ? (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-extrabold">
                          #{item.toothNumber}
                        </span>
                      ) : (
                        <span className="text-slate-400">Full Arch</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {item.diagnosis}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {item.procedure}
                    </td>
                    <td className="py-3 px-3 font-bold text-cyan-800">
                      ₹{item.estimatedCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.doctorName}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item, e.target.value as any)}
                        className={`text-[11px] font-bold p-1 rounded-lg border ${
                          item.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Planned Procedure</h3>
            
            {/* 1-Click Procedure Presets */}
            <div className="mb-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                ⚡ 1-Click Procedure Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Root Canal Treatment (RCT)', cost: 3500 },
                  { name: 'Zirconia Crown / Cap', cost: 5000 },
                  { name: 'Composite Tooth Filling', cost: 1200 },
                  { name: 'Tooth Extraction', cost: 800 },
                  { name: 'Full Mouth Scaling', cost: 1000 }
                ].map(p => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setProcedure(p.name);
                      setEstimatedCost(p.cost);
                    }}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 hover:border-teal-400 hover:text-teal-900 transition"
                  >
                    {p.name.split(' ')[0]} {p.name.includes('RCT') ? 'RCT' : p.name.includes('Crown') ? 'Cap' : ''} (₹{p.cost})
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePlanItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Tooth # (FDI Notation)</label>
                <input
                  type="number"
                  value={toothNumber}
                  onChange={(e) => setToothNumber(Number(e.target.value))}
                  placeholder="e.g. 36 or 11"
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Planned Procedure</label>
                <input
                  type="text"
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Estimated Cost (₹)</label>
                <input
                  type="number"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold text-teal-800"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition">Add to Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
