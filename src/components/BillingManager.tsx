import React, { useState } from 'react';
import { 
  Patient, 
  Invoice, 
  PaymentRecord, 
  UserAccount 
} from '../types';
import { StorageService, WhatsAppUtils } from '../services/storage';
import { PDFGenerator } from '../utils/pdfGenerator';
import { 
  Receipt, 
  Plus, 
  Download, 
  DollarSign, 
  Calendar, 
  Phone, 
  Share2, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  CreditCard,
  Trash2,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BillingManagerProps {
  patients: Patient[];
  selectedPatientId?: string;
  currentUser: UserAccount;
}

export const BillingManager: React.FC<BillingManagerProps> = ({
  patients,
  selectedPatientId,
  currentUser
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>(StorageService.getInvoices());
  const [filterStatus, setFilterStatus] = useState<'All' | 'Paid' | 'Partial' | 'Unpaid'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New Invoice Modal
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [selectedPatientIdModal, setSelectedPatientIdModal] = useState<string>(selectedPatientId || patients[0]?.id || '');
  const [invoiceItems, setInvoiceItems] = useState<{ description: string; toothNumber?: number; cost: number }[]>([
    { description: 'Root Canal Therapy (RCT)', toothNumber: 36, cost: 4500 }
  ]);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(0);
  const [initialPayment, setInitialPayment] = useState<number>(2000);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI / GPay' | 'Card' | 'Bank Transfer'>('UPI / GPay');

  // Record Payment Modal
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<number>(1000);
  const [paymentModeInput, setPaymentModeInput] = useState<'Cash' | 'UPI / GPay' | 'Card' | 'Bank Transfer'>('UPI / GPay');
  const [paymentNotesInput, setPaymentNotesInput] = useState<string>('Follow-up partial payment');

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch = inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.patientPhone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Analytics
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalPending = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);

  // New Invoice Line Item Handlers
  const handleAddItem = () => {
    setInvoiceItems([...invoiceItems, { description: 'Dental Procedure', cost: 1500 }]);
  };

  const handleRemoveItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...invoiceItems];
    updated[index] = { ...updated[index], [field]: value };
    setInvoiceItems(updated);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === selectedPatientIdModal);
    if (!patient) {
      alert('Please select a patient.');
      return;
    }

    const subtotal = invoiceItems.reduce((sum, item) => sum + Number(item.cost || 0), 0);
    const tax = Math.round((subtotal * taxPercent) / 100);
    const grandTotal = Math.max(0, subtotal - discountAmount + tax);
    const amountPaid = Math.min(grandTotal, Number(initialPayment || 0));
    const balanceDue = grandTotal - amountPaid;

    const status: 'Paid' | 'Partial' | 'Unpaid' = 
      balanceDue === 0 ? 'Paid' : amountPaid > 0 ? 'Partial' : 'Unpaid';

    const payments: PaymentRecord[] = amountPaid > 0 ? [
      {
        id: 'pay-' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        amount: amountPaid,
        paymentMode,
        receiptNumber: `REC-${Date.now().toString().slice(-4)}`,
        notes: 'Initial payment / advance at invoice creation'
      }
    ] : [];

    const newInv = StorageService.addInvoice({
      patientId: patient.id,
      patientName: patient.name,
      patientPhone: patient.phone,
      date: new Date().toISOString().split('T')[0],
      items: invoiceItems,
      subtotal,
      discount: discountAmount,
      tax,
      grandTotal,
      amountPaid,
      balanceDue,
      status,
      payments
    });

    setInvoices(StorageService.getInvoices());
    setShowNewInvoiceModal(false);
    PDFGenerator.generateInvoicePDF(newInv, patient);
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    } catch (e) {}
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    const amountToAdd = Number(paymentAmountInput);
    if (amountToAdd <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    const newAmountPaid = selectedInvoiceForPayment.amountPaid + amountToAdd;
    const newBalanceDue = Math.max(0, selectedInvoiceForPayment.grandTotal - newAmountPaid);
    const newStatus: 'Paid' | 'Partial' | 'Unpaid' = newBalanceDue === 0 ? 'Paid' : 'Partial';

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      amount: amountToAdd,
      paymentMode: paymentModeInput,
      receiptNumber: `REC-${Date.now().toString().slice(-4)}`,
      notes: paymentNotesInput
    };

    const updatedInvoice: Invoice = {
      ...selectedInvoiceForPayment,
      amountPaid: newAmountPaid,
      balanceDue: newBalanceDue,
      status: newStatus,
      payments: [...(selectedInvoiceForPayment.payments || []), newPayment]
    };

    StorageService.updateInvoice(updatedInvoice);
    setInvoices(StorageService.getInvoices());
    setSelectedInvoiceForPayment(null);
    alert(`Payment of ₹${amountToAdd.toLocaleString('en-IN')} recorded successfully!`);
  };

  const handleSendWhatsAppReminder = (inv: Invoice) => {
    WhatsAppUtils.sendPendingBalanceReminder(inv.patientName, inv.patientPhone, inv.invoiceNumber, inv.balanceDue);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoiced
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              ₹{totalBilled.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {invoices.length} Bills Generated
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        {/* Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
              Total Collected
            </p>
            <p className="text-2xl font-bold text-emerald-700 mt-1">
              ₹{totalCollected.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600/80 mt-0.5">
              Cash, UPI &amp; Cards Received
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Pending Balance Due
            </p>
            <p className="text-2xl font-bold text-rose-700 mt-1">
              ₹{totalPending.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-rose-500 mt-0.5">
              Awaiting Patient Settlement
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Clinic UPI Pill */}
        <div className="bg-white p-5 rounded-2xl border border-teal-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Clinic Direct UPI
            </span>
            <QrCode className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2">
            <p className="text-[11px] text-slate-500">UPI ID for WhatsApp reminders:</p>
            <p className="text-sm font-mono font-bold tracking-tight text-teal-900 mt-0.5">
              9579649009@upi
            </p>
          </div>
        </div>

      </div>

      {/* Main Invoices Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
        
        {/* Header Controls: Search, Filter & New Invoice Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by Patient Name, Phone or Invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Pills */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs">
              {(['All', 'Paid', 'Partial', 'Unpaid'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    filterStatus === tab
                      ? 'bg-white text-teal-800 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowNewInvoiceModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create New Invoice</span>
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 uppercase font-semibold text-[11px] bg-slate-50/50">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Procedures</th>
                <th className="py-3 px-3">Total Amount</th>
                <th className="py-3 px-3">Paid</th>
                <th className="py-3 px-3">Balance Due</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No invoices found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(inv => {
                  const pat = patients.find(p => p.id === inv.patientId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{inv.patientName}</div>
                        <div className="text-[10px] text-slate-400">{inv.patientPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                        {inv.date}
                      </td>
                      <td className="py-3 px-3 text-slate-700 max-w-xs truncate">
                        {inv.items.map(i => i.description).join(', ')}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">
                        ₹{inv.grandTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-700">
                        ₹{inv.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 font-bold text-rose-600">
                        ₹{inv.balanceDue.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'Partial'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Record Payment Button */}
                          {inv.balanceDue > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoiceForPayment(inv);
                                setPaymentAmountInput(inv.balanceDue);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 text-[11px] font-bold border border-teal-200 transition"
                              title="Record payment"
                            >
                              + Pay
                            </button>
                          )}

                          {/* WhatsApp Reminder Button */}
                          {inv.balanceDue > 0 && (
                            <button
                              type="button"
                              onClick={() => handleSendWhatsAppReminder(inv)}
                              className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition"
                              title="Send WhatsApp payment reminder"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* PDF Download Button */}
                          <button
                            type="button"
                            onClick={() => PDFGenerator.generateInvoicePDF(inv, pat)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-cyan-700 hover:bg-slate-100 transition"
                            title="Download PDF Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* New Invoice Modal */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-cyan-700" />
                Generate New Dental Invoice / Bill
              </h3>
              <button
                type="button"
                onClick={() => setShowNewInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="py-4 space-y-4">
              
              {/* Patient Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Patient:
                </label>
                <select
                  value={selectedPatientIdModal}
                  onChange={(e) => setSelectedPatientIdModal(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.uniqueId}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Treatment &amp; Procedure Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Custom Procedure
                  </button>
                </div>

                {/* 1-Click Procedure Presets for Instant Billing */}
                <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    ⚡ 1-Click Presets (Click to add to bill):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'Root Canal Treatment (RCT)', cost: 3500 },
                      { name: 'Zirconia Crown / Cap', cost: 5000 },
                      { name: 'Composite Tooth Filling', cost: 1200 },
                      { name: 'Full Mouth Scaling & Polishing', cost: 1000 },
                      { name: 'Tooth Extraction', cost: 800 },
                      { name: 'PFM Ceramic Crown', cost: 3000 },
                      { name: 'Dental X-Ray (IOPA / RVG)', cost: 300 },
                      { name: 'Consultation & Checkup', cost: 300 }
                    ].map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => {
                          setInvoiceItems([...invoiceItems, { description: preset.name, cost: preset.cost }]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-[11px] font-semibold text-slate-700 hover:text-teal-900 transition shadow-2xs"
                      >
                        + {preset.name.split(' ')[0]} {preset.name.includes('RCT') ? 'RCT' : preset.name.includes('Crown') ? 'Cap' : ''} (₹{preset.cost})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Procedure Description (e.g. Zirconia Crown)"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="flex-1 text-xs p-2 rounded-lg border border-slate-200"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Tooth #"
                        value={item.toothNumber || ''}
                        onChange={(e) => handleItemChange(idx, 'toothNumber', e.target.value ? Number(e.target.value) : undefined)}
                        className="w-20 text-xs p-2 rounded-lg border border-slate-200"
                      />
                      <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={item.cost}
                        onChange={(e) => handleItemChange(idx, 'cost', Number(e.target.value))}
                        className="w-28 text-xs p-2 rounded-lg border border-slate-200 font-bold"
                        required
                      />
                      {invoiceItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium">Discount (₹)</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium">Initial Payment / Advance (₹)</label>
                  <input
                    type="number"
                    value={initialPayment}
                    onChange={(e) => setInitialPayment(Number(e.target.value))}
                    className="w-full p-1.5 rounded-lg border border-slate-200 mt-1 font-bold text-emerald-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 font-medium">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full p-1.5 rounded-lg border border-slate-200 mt-1"
                  >
                    <option value="UPI / GPay">UPI / GPay / PhonePe</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Subtotal:</span>
                  <span>₹{invoiceItems.reduce((s, i) => s + Number(i.cost || 0), 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>Grand Total:</span>
                  <span>₹{Math.max(0, invoiceItems.reduce((s, i) => s + Number(i.cost || 0), 0) - discountAmount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-700">
                  <span>Pending Balance:</span>
                  <span>₹{Math.max(0, invoiceItems.reduce((s, i) => s + Number(i.cost || 0), 0) - discountAmount - initialPayment).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-xs transition"
                >
                  Generate &amp; Print Invoice
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Record Partial Payment Modal */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Record Payment for {selectedInvoiceForPayment.invoiceNumber}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="py-4 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-slate-600 font-medium">Patient: <strong className="text-slate-900">{selectedInvoiceForPayment.patientName}</strong></p>
                <p className="text-slate-600 font-medium mt-1">Total Bill: <strong>₹{selectedInvoiceForPayment.grandTotal.toLocaleString('en-IN')}</strong></p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                  <span className="text-rose-700 font-bold">Pending Balance:</span>
                  <span className="text-sm font-extrabold text-rose-700">₹{selectedInvoiceForPayment.balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Payment Amount to Collect (₹):
                  </label>
                  <button
                    type="button"
                    onClick={() => setPaymentAmountInput(selectedInvoiceForPayment.balanceDue)}
                    className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 hover:bg-teal-100 transition"
                  >
                    ⚡ Full Balance (₹{selectedInvoiceForPayment.balanceDue})
                  </button>
                </div>
                <input
                  type="number"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(Number(e.target.value))}
                  max={selectedInvoiceForPayment.balanceDue}
                  className="w-full text-base font-extrabold p-2.5 rounded-xl border border-slate-200 text-emerald-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Mode:
                </label>
                <select
                  value={paymentModeInput}
                  onChange={(e) => setPaymentModeInput(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="UPI / GPay">UPI / GPay / PhonePe (9579649009@upi)</option>
                  <option value="Cash">Cash at Clinic</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer / NEFT</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receipt Notes:
                </label>
                <input
                  type="text"
                  value={paymentNotesInput}
                  onChange={(e) => setPaymentNotesInput(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition"
                >
                  Confirm &amp; Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
