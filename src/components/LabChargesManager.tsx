import React, { useState } from 'react';
import { 
  Patient, 
  LabOrder, 
  UserAccount 
} from '../types';
import { StorageService } from '../services/storage';
import { 
  FlaskConical, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Search,
  Filter,
  Check,
  Package
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabChargesManagerProps {
  patients: Patient[];
  currentUser: UserAccount;
}

export const LabChargesManager: React.FC<LabChargesManagerProps> = ({
  patients,
  currentUser
}) => {
  const [labOrders, setLabOrders] = useState<LabOrder[]>(StorageService.getLabOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // Form states for new order
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  const [toothNumber, setToothNumber] = useState('16, 17');
  const [labName, setLabName] = useState('Sai Precision Dental Lab, Pune');
  const [workType, setWorkType] = useState<LabOrder['workType']>('Zirconia Crown');
  const [shade, setShade] = useState('A2');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [labCharge, setLabCharge] = useState<number>(1500);
  const [notes, setNotes] = useState('High translucency, check contact points');

  const filteredOrders = labOrders.filter(o => {
    const matchesSearch = o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.labName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics
  const totalLabExpenses = labOrders.reduce((sum, o) => sum + Number(o.labCharge || 0), 0);
  const pendingLabPayments = labOrders
    .filter(o => o.paymentStatus === 'Pending')
    .reduce((sum, o) => sum + Number(o.labCharge || 0), 0);
  const activeLabJobs = labOrders.filter(o => o.status !== 'Delivered to Patient').length;

  const handleCreateLabOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    StorageService.addLabOrder({
      patientId: patient.id,
      patientName: patient.name,
      toothNumber,
      labName,
      workType,
      shade,
      sentDate: new Date().toISOString().split('T')[0],
      dueDate,
      labCharge: Number(labCharge),
      paymentStatus: 'Pending',
      status: 'Sent to Lab',
      notes
    });

    setLabOrders(StorageService.getLabOrders());
    setShowNewOrderModal(false);
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleTogglePaymentStatus = (order: LabOrder) => {
    const updated: LabOrder = {
      ...order,
      paymentStatus: order.paymentStatus === 'Paid' ? 'Pending' : 'Paid'
    };
    StorageService.updateLabOrder(updated);
    setLabOrders(StorageService.getLabOrders());
  };

  const handleUpdateStatus = (order: LabOrder, newStatus: LabOrder['status']) => {
    const updated: LabOrder = {
      ...order,
      status: newStatus,
      receivedDate: newStatus === 'Received & Verified' || newStatus === 'Delivered to Patient' 
        ? new Date().toISOString().split('T')[0] 
        : order.receivedDate
    };
    StorageService.updateLabOrder(updated);
    setLabOrders(StorageService.getLabOrders());
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Lab Charges
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalLabExpenses.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Across all prosthesis &amp; crowns
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FlaskConical className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Payable to Labs (Pending)
            </p>
            <p className="text-2xl font-bold text-rose-700 mt-1">
              ₹{pendingLabPayments.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-rose-500 mt-0.5">
              Unsettled Lab Vendor Invoices
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">
              Active In-Lab Jobs
            </p>
            <p className="text-2xl font-bold text-teal-800 mt-1">
              {activeLabJobs} Orders
            </p>
            <p className="text-[11px] text-teal-600 mt-0.5">
              Fabrication &amp; Delivery Tracking
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Main Lab Orders Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        
        {/* Controls: Search, Filter & New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by Patient, Order #, or Lab Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs">
              {['All', 'Sent to Lab', 'Fabrication in Progress', 'Received & Verified', 'Delivered to Patient'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    statusFilter === st
                      ? 'bg-white text-teal-800 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'All' ? 'All Jobs' : st.split(' ')[0]}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNewOrderModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Lab Order</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[11px] bg-slate-50/50">
                <th className="py-3 px-3">Order #</th>
                <th className="py-3 px-3">Patient &amp; Tooth</th>
                <th className="py-3 px-3">Lab Name &amp; Work</th>
                <th className="py-3 px-3">Shade</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-3">Lab Charge</th>
                <th className="py-3 px-3">Payment to Lab</th>
                <th className="py-3 px-3">Job Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No lab orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{order.patientName}</div>
                      <div className="text-[10px] text-cyan-700 font-semibold">Tooth: #{order.toothNumber}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{order.workType}</div>
                      <div className="text-[10px] text-slate-400">{order.labName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                        {order.shade}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                      {order.dueDate}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      ₹{order.labCharge.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePaymentStatus(order)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                        title="Click to toggle Paid/Pending"
                      >
                        {order.paymentStatus === 'Paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-rose-600" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order, e.target.value as any)}
                        className="text-[11px] font-semibold p-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="Sent to Lab">Sent to Lab</option>
                        <option value="Fabrication in Progress">Fabrication in Progress</option>
                        <option value="Received & Verified">Received &amp; Verified</option>
                        <option value="Delivered to Patient">Delivered to Patient</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] text-slate-400 italic">
                        {order.notes || 'No special notes'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* New Lab Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-700" />
                Dispatch Work to Dental Lab
              </h3>
              <button
                type="button"
                onClick={() => setShowNewOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLabOrder} className="py-4 space-y-3 text-xs">
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
                      {p.name} ({p.uniqueId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tooth / Arch:
                  </label>
                  <input
                    type="text"
                    value={toothNumber}
                    onChange={(e) => setToothNumber(e.target.value)}
                    placeholder="e.g. 16, 26, Upper Arch"
                    className="w-full p-2 rounded-lg border border-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Shade (VITA Shade Guide):
                  </label>
                  <input
                    type="text"
                    value={shade}
                    onChange={(e) => setShade(e.target.value)}
                    placeholder="e.g. A1, A2, A3, BL2"
                    className="w-full p-2 rounded-lg border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lab Name:
                </label>
                <select
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 font-semibold"
                >
                  <option value="Sai Precision Dental Lab, Pune">Sai Precision Dental Lab, Pune</option>
                  <option value="SmileCraft Aesthetic Studio, Mumbai">SmileCraft Aesthetic Studio, Mumbai</option>
                  <option value="Global Dental Prosthetics">Global Dental Prosthetics</option>
                  <option value="Modern Clear Aligner Hub">Modern Clear Aligner Hub</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Type:
                  </label>
                  <select
                    value={workType}
                    onChange={(e) => setWorkType(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <option value="Zirconia Crown">Zirconia Crown</option>
                    <option value="PFM Crown">PFM Crown</option>
                    <option value="E.max Veneer">E.max Veneer</option>
                    <option value="Orthodontic Retainer">Orthodontic Retainer</option>
                    <option value="Clear Aligner Tray">Clear Aligner Tray</option>
                    <option value="Cast Partial Denture">Cast Partial Denture</option>
                    <option value="Complete Denture">Complete Denture</option>
                    <option value="Night Guard">Night Guard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lab Due Date:
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimated Lab Charge (₹):
                </label>
                <input
                  type="number"
                  value={labCharge}
                  onChange={(e) => setLabCharge(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lab Technician Notes:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition"
                >
                  Save &amp; Dispatch Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
