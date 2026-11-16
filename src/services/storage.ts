import { 
  Patient, 
  Appointment, 
  TreatmentPlanItem, 
  RCTRecord, 
  CrownBridgeRecord, 
  SmileDesignVeneerRecord, 
  AlignerFMRRecord, 
  ClinicalNote, 
  Prescription, 
  ConsentForm, 
  Invoice, 
  LabOrder, 
  ClinicTiming,
  UserAccount
} from '../types';

import { 
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_TREATMENT_PLANS, 
  INITIAL_RCT_RECORDS, 
  INITIAL_CROWN_RECORDS, 
  INITIAL_SMILE_DESIGN_RECORDS, 
  INITIAL_ALIGNER_RECORDS, 
  INITIAL_CLINICAL_NOTES, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_CONSENT_FORMS, 
  INITIAL_INVOICES, 
  INITIAL_LAB_ORDERS, 
  INITIAL_CLINIC_TIMING,
  CLINIC_ACCOUNTS,
  CLINIC_INFO
} from '../data/mockData';

import { getSupabaseClient } from './supabase';

// LocalStorage Keys
const KEYS = {
  PATIENTS: 'pdc_patients',
  APPOINTMENTS: 'pdc_appointments',
  TREATMENT_PLANS: 'pdc_treatment_plans',
  RCT_RECORDS: 'pdc_rct_records',
  CROWN_RECORDS: 'pdc_crown_records',
  SMILE_DESIGN_RECORDS: 'pdc_smile_design_records',
  ALIGNER_RECORDS: 'pdc_aligner_records',
  CLINICAL_NOTES: 'pdc_clinical_notes',
  PRESCRIPTIONS: 'pdc_prescriptions',
  CONSENT_FORMS: 'pdc_consent_forms',
  INVOICES: 'pdc_invoices',
  LAB_ORDERS: 'pdc_lab_orders',
  CLINIC_TIMING: 'pdc_clinic_timing',
  CURRENT_USER: 'pdc_current_user'
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error setting key ${key} in storage:`, e);
  }
}

export const StorageService = {
  // Current User
  getCurrentUser(): UserAccount {
    return getItem<UserAccount>(KEYS.CURRENT_USER, CLINIC_ACCOUNTS[0]);
  },
  setCurrentUser(user: UserAccount) {
    setItem(KEYS.CURRENT_USER, user);
  },

  // Clinic Timing
  getClinicTiming(): ClinicTiming {
    return getItem<ClinicTiming>(KEYS.CLINIC_TIMING, INITIAL_CLINIC_TIMING);
  },
  saveClinicTiming(timing: ClinicTiming) {
    setItem(KEYS.CLINIC_TIMING, timing);
  },

  // Patients
  getPatients(): Patient[] {
    return getItem<Patient[]>(KEYS.PATIENTS, INITIAL_PATIENTS);
  },
  savePatients(patients: Patient[]) {
    setItem(KEYS.PATIENTS, patients);
    this.syncToSupabase('patients', patients);
  },
  getPatientById(id: string): Patient | undefined {
    return this.getPatients().find(p => p.id === id);
  },
  addPatient(patient: Omit<Patient, 'id' | 'uniqueId' | 'createdAt'>): Patient {
    const patients = this.getPatients();
    const count = patients.length + 1;
    const year = new Date().getFullYear();
    const uniqueId = `PDC-${year}-${String(count).padStart(3, '0')}`;
    const newPatient: Patient = {
      ...patient,
      id: 'pat-' + Date.now(),
      uniqueId,
      createdAt: new Date().toISOString()
    };
    patients.unshift(newPatient);
    this.savePatients(patients);
    return newPatient;
  },
  updatePatient(patient: Patient) {
    const patients = this.getPatients().map(p => p.id === patient.id ? patient : p);
    this.savePatients(patients);
  },
  deletePatient(id: string) {
    const patients = this.getPatients().filter(p => p.id !== id);
    this.savePatients(patients);
  },

  // Appointments
  getAppointments(): Appointment[] {
    return getItem<Appointment[]>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  },
  saveAppointments(appointments: Appointment[]) {
    setItem(KEYS.APPOINTMENTS, appointments);
    this.syncToSupabase('appointments', appointments);
  },
  addAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
    const appointments = this.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: 'apt-' + Date.now()
    };
    appointments.unshift(newApt);
    this.saveAppointments(appointments);
    return newApt;
  },
  updateAppointment(appointment: Appointment) {
    const appointments = this.getAppointments().map(a => a.id === appointment.id ? appointment : a);
    this.saveAppointments(appointments);
  },
  deleteAppointment(id: string) {
    const appointments = this.getAppointments().filter(a => a.id !== id);
    this.saveAppointments(appointments);
  },

  // Treatment Plans
  getTreatmentPlans(patientId?: string): TreatmentPlanItem[] {
    const plans = getItem<TreatmentPlanItem[]>(KEYS.TREATMENT_PLANS, INITIAL_TREATMENT_PLANS);
    return patientId ? plans.filter(p => p.patientId === patientId) : plans;
  },
  saveTreatmentPlans(plans: TreatmentPlanItem[]) {
    setItem(KEYS.TREATMENT_PLANS, plans);
    this.syncToSupabase('treatment_plans', plans);
  },
  addTreatmentPlan(item: Omit<TreatmentPlanItem, 'id' | 'date'>): TreatmentPlanItem {
    const plans = this.getTreatmentPlans();
    const newItem: TreatmentPlanItem = {
      ...item,
      id: 'tp-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    plans.unshift(newItem);
    this.saveTreatmentPlans(plans);
    return newItem;
  },
  updateTreatmentPlan(item: TreatmentPlanItem) {
    const plans = this.getTreatmentPlans().map(p => p.id === item.id ? item : p);
    this.saveTreatmentPlans(plans);
  },
  deleteTreatmentPlan(id: string) {
    const plans = this.getTreatmentPlans().filter(p => p.id !== id);
    this.saveTreatmentPlans(plans);
  },

  // RCT Records
  getRCTRecords(patientId?: string): RCTRecord[] {
    const records = getItem<RCTRecord[]>(KEYS.RCT_RECORDS, INITIAL_RCT_RECORDS);
    return patientId ? records.filter(r => r.patientId === patientId) : records;
  },
  saveRCTRecords(records: RCTRecord[]) {
    setItem(KEYS.RCT_RECORDS, records);
    this.syncToSupabase('rct_records', records);
  },
  addRCTRecord(record: Omit<RCTRecord, 'id'>): RCTRecord {
    const records = this.getRCTRecords();
    const newRecord: RCTRecord = { ...record, id: 'rct-' + Date.now() };
    records.unshift(newRecord);
    this.saveRCTRecords(records);
    return newRecord;
  },

  // Crown & Bridge Records
  getCrownRecords(patientId?: string): CrownBridgeRecord[] {
    const records = getItem<CrownBridgeRecord[]>(KEYS.CROWN_RECORDS, INITIAL_CROWN_RECORDS);
    return patientId ? records.filter(r => r.patientId === patientId) : records;
  },
  saveCrownRecords(records: CrownBridgeRecord[]) {
    setItem(KEYS.CROWN_RECORDS, records);
    this.syncToSupabase('crown_bridge_records', records);
  },
  addCrownRecord(record: Omit<CrownBridgeRecord, 'id'>): CrownBridgeRecord {
    const records = this.getCrownRecords();
    const newRecord: CrownBridgeRecord = { ...record, id: 'cb-' + Date.now() };
    records.unshift(newRecord);
    this.saveCrownRecords(records);
    return newRecord;
  },

  // Smile Design & Veneers
  getSmileDesignRecords(patientId?: string): SmileDesignVeneerRecord[] {
    const records = getItem<SmileDesignVeneerRecord[]>(KEYS.SMILE_DESIGN_RECORDS, INITIAL_SMILE_DESIGN_RECORDS);
    return patientId ? records.filter(r => r.patientId === patientId) : records;
  },
  saveSmileDesignRecords(records: SmileDesignVeneerRecord[]) {
    setItem(KEYS.SMILE_DESIGN_RECORDS, records);
    this.syncToSupabase('smile_design_records', records);
  },
  addSmileDesignRecord(record: Omit<SmileDesignVeneerRecord, 'id'>): SmileDesignVeneerRecord {
    const records = this.getSmileDesignRecords();
    const newRecord: SmileDesignVeneerRecord = { ...record, id: 'sd-' + Date.now() };
    records.unshift(newRecord);
    this.saveSmileDesignRecords(records);
    return newRecord;
  },

  // Aligners & FMR
  getAlignerRecords(patientId?: string): AlignerFMRRecord[] {
    const records = getItem<AlignerFMRRecord[]>(KEYS.ALIGNER_RECORDS, INITIAL_ALIGNER_RECORDS);
    return patientId ? records.filter(r => r.patientId === patientId) : records;
  },
  saveAlignerRecords(records: AlignerFMRRecord[]) {
    setItem(KEYS.ALIGNER_RECORDS, records);
    this.syncToSupabase('aligner_fmr_records', records);
  },
  addAlignerRecord(record: Omit<AlignerFMRRecord, 'id'>): AlignerFMRRecord {
    const records = this.getAlignerRecords();
    const newRecord: AlignerFMRRecord = { ...record, id: 'al-' + Date.now() };
    records.unshift(newRecord);
    this.saveAlignerRecords(records);
    return newRecord;
  },

  // Clinical Notes
  getClinicalNotes(patientId?: string): ClinicalNote[] {
    const notes = getItem<ClinicalNote[]>(KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
    return patientId ? notes.filter(n => n.patientId === patientId) : notes;
  },
  saveClinicalNotes(notes: ClinicalNote[]) {
    setItem(KEYS.CLINICAL_NOTES, notes);
    this.syncToSupabase('clinical_notes', notes);
  },
  addClinicalNote(note: Omit<ClinicalNote, 'id' | 'date'>): ClinicalNote {
    const notes = this.getClinicalNotes();
    const newNote: ClinicalNote = {
      ...note,
      id: 'cn-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    notes.unshift(newNote);
    this.saveClinicalNotes(notes);
    return newNote;
  },

  // Prescriptions
  getPrescriptions(patientId?: string): Prescription[] {
    const rxs = getItem<Prescription[]>(KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    return patientId ? rxs.filter(r => r.patientId === patientId) : rxs;
  },
  savePrescriptions(rxs: Prescription[]) {
    setItem(KEYS.PRESCRIPTIONS, rxs);
    this.syncToSupabase('prescriptions', rxs);
  },
  addPrescription(rx: Omit<Prescription, 'id'>): Prescription {
    const rxs = this.getPrescriptions();
    const newRx: Prescription = { ...rx, id: 'rx-' + Date.now() };
    rxs.unshift(newRx);
    this.savePrescriptions(rxs);
    return newRx;
  },

  // Consent Forms
  getConsentForms(patientId?: string): ConsentForm[] {
    const forms = getItem<ConsentForm[]>(KEYS.CONSENT_FORMS, INITIAL_CONSENT_FORMS);
    return patientId ? forms.filter(f => f.patientId === patientId) : forms;
  },
  saveConsentForms(forms: ConsentForm[]) {
    setItem(KEYS.CONSENT_FORMS, forms);
    this.syncToSupabase('consent_forms', forms);
  },
  addConsentForm(form: Omit<ConsentForm, 'id'>): ConsentForm {
    const forms = this.getConsentForms();
    const newForm: ConsentForm = { ...form, id: 'cs-' + Date.now() };
    forms.unshift(newForm);
    this.saveConsentForms(forms);
    return newForm;
  },

  // Invoices & Payments
  getInvoices(patientId?: string): Invoice[] {
    const invs = getItem<Invoice[]>(KEYS.INVOICES, INITIAL_INVOICES);
    return patientId ? invs.filter(i => i.patientId === patientId) : invs;
  },
  saveInvoices(invoices: Invoice[]) {
    setItem(KEYS.INVOICES, invoices);
    this.syncToSupabase('invoices', invoices);
  },
  addInvoice(inv: Omit<Invoice, 'id' | 'invoiceNumber'>): Invoice {
    const invoices = this.getInvoices();
    const count = invoices.length + 1;
    const year = new Date().getFullYear();
    const invoiceNumber = `PDC-INV-${year}-${String(count).padStart(3, '0')}`;
    const newInvoice: Invoice = {
      ...inv,
      id: 'inv-' + Date.now(),
      invoiceNumber
    };
    invoices.unshift(newInvoice);
    this.saveInvoices(invoices);
    return newInvoice;
  },
  updateInvoice(invoice: Invoice) {
    const invoices = this.getInvoices().map(i => i.id === invoice.id ? invoice : i);
    this.saveInvoices(invoices);
  },

  // Lab Orders
  getLabOrders(patientId?: string): LabOrder[] {
    const orders = getItem<LabOrder[]>(KEYS.LAB_ORDERS, INITIAL_LAB_ORDERS);
    return patientId ? orders.filter(o => o.patientId === patientId) : orders;
  },
  saveLabOrders(orders: LabOrder[]) {
    setItem(KEYS.LAB_ORDERS, orders);
    this.syncToSupabase('lab_orders', orders);
  },
  addLabOrder(order: Omit<LabOrder, 'id' | 'orderNumber'>): LabOrder {
    const orders = this.getLabOrders();
    const count = orders.length + 1;
    const year = new Date().getFullYear();
    const orderNumber = `PDC-LAB-${year}-${String(count).padStart(3, '0')}`;
    const newOrder: LabOrder = {
      ...order,
      id: 'lab-' + Date.now(),
      orderNumber
    };
    orders.unshift(newOrder);
    this.saveLabOrders(orders);
    return newOrder;
  },
  updateLabOrder(order: LabOrder) {
    const orders = this.getLabOrders().map(o => o.id === order.id ? order : o);
    this.saveLabOrders(orders);
  },

  // Optional background sync to Supabase if connected
  async syncToSupabase(table: string, data: any) {
    const client = getSupabaseClient();
    if (!client) return; // Supabase not configured or in offline mode
    try {
      // In production, sync tables or upsert
      console.log(`[Supabase Sync] Queued sync for ${table}`);
    } catch (e) {
      console.warn(`Supabase sync background notice:`, e);
    }
  },

  // Export full JSON Backup
  exportAllDataJSON(): string {
    const fullBackup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      clinic: CLINIC_INFO,
      patients: this.getPatients(),
      appointments: this.getAppointments(),
      treatmentPlans: this.getTreatmentPlans(),
      rctRecords: this.getRCTRecords(),
      crownRecords: this.getCrownRecords(),
      smileDesignRecords: this.getSmileDesignRecords(),
      alignerRecords: this.getAlignerRecords(),
      clinicalNotes: this.getClinicalNotes(),
      prescriptions: this.getPrescriptions(),
      consentForms: this.getConsentForms(),
      invoices: this.getInvoices(),
      labOrders: this.getLabOrders(),
      clinicTiming: this.getClinicTiming()
    };
    return JSON.stringify(fullBackup, null, 2);
  },

  // Import JSON Backup
  importAllDataJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.patients) this.savePatients(data.patients);
      if (data.appointments) this.saveAppointments(data.appointments);
      if (data.treatmentPlans) this.saveTreatmentPlans(data.treatmentPlans);
      if (data.rctRecords) this.saveRCTRecords(data.rctRecords);
      if (data.crownRecords) this.saveCrownRecords(data.crownRecords);
      if (data.smileDesignRecords) this.saveSmileDesignRecords(data.smileDesignRecords);
      if (data.alignerRecords) this.saveAlignerRecords(data.alignerRecords);
      if (data.clinicalNotes) this.saveClinicalNotes(data.clinicalNotes);
      if (data.prescriptions) this.savePrescriptions(data.prescriptions);
      if (data.consentForms) this.saveConsentForms(data.consentForms);
      if (data.invoices) this.saveInvoices(data.invoices);
      if (data.labOrders) this.saveLabOrders(data.labOrders);
      if (data.clinicTiming) this.saveClinicTiming(data.clinicTiming);
      return true;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  },

  // Reset to sample initial data
  resetToSampleData() {
    setItem(KEYS.PATIENTS, INITIAL_PATIENTS);
    setItem(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    setItem(KEYS.TREATMENT_PLANS, INITIAL_TREATMENT_PLANS);
    setItem(KEYS.RCT_RECORDS, INITIAL_RCT_RECORDS);
    setItem(KEYS.CROWN_RECORDS, INITIAL_CROWN_RECORDS);
    setItem(KEYS.SMILE_DESIGN_RECORDS, INITIAL_SMILE_DESIGN_RECORDS);
    setItem(KEYS.ALIGNER_RECORDS, INITIAL_ALIGNER_RECORDS);
    setItem(KEYS.CLINICAL_NOTES, INITIAL_CLINICAL_NOTES);
    setItem(KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    setItem(KEYS.CONSENT_FORMS, INITIAL_CONSENT_FORMS);
    setItem(KEYS.INVOICES, INITIAL_INVOICES);
    setItem(KEYS.LAB_ORDERS, INITIAL_LAB_ORDERS);
    setItem(KEYS.CLINIC_TIMING, INITIAL_CLINIC_TIMING);
  }
};

// WhatsApp Helper
export const WhatsAppUtils = {
  cleanPhone(phone: string): string {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) return '91' + cleaned;
    return cleaned;
  },

  sendAppointmentReminder(patientName: string, phone: string, date: string, time: string, doctorName: string, treatment: string) {
    const text = encodeURIComponent(
      `नमस्ते ${patientName} जी,\n\n` +
      `आपली पाटील डेंटल क्लिनिकमध्ये पुढील तपासणी / उपचाराची वेळ निश्चित झाली आहे:\n` +
      `📅 दिनांक: ${date}\n` +
      `⏰ वेळ: ${time}\n` +
      `👨‍⚕️ डॉक्टर: ${doctorName}\n` +
      `🦷 उपचार: ${treatment}\n\n` +
      `कृपया वेळेच्या १० मिनिटे अगोदर उपस्थित राहावे.\n` +
      `क्लिनिक संपर्क: ${CLINIC_INFO.phone}\n` +
      `पाटील डेंटल क्लिनिक, महाराष्ट्र.`
    );
    window.open(`https://wa.me/${this.cleanPhone(phone)}?text=${text}`, '_blank');
  },

  send6MonthRecall(patientName: string, phone: string) {
    const text = encodeURIComponent(
      `नमस्ते ${patientName} जी,\n\n` +
      `पाटील डेंटल क्लिनिककडून नम्र आठवण! 😊\n` +
      `आपल्या मागील दंतोपचाराला ६ महिने पूर्ण झाले आहेत. दातांचे आरोग्य निरोगी राहण्यासाठी दर ६ महिन्यांनी नियमित तपासणी व दात स्वच्छता (Scaling) आवश्यक असते.\n\n` +
      `कृपया आपल्या सोयीनुसार मोफत 6-Month Review Checkup साठी वेळ निश्चित करा.\n` +
      `📞 संपर्क/WhatsApp: ${CLINIC_INFO.phone}\n` +
      `पाटील डेंटल क्लिनिक.`
    );
    window.open(`https://wa.me/${this.cleanPhone(phone)}?text=${text}`, '_blank');
  },

  sendPendingBalanceReminder(patientName: string, phone: string, invoiceNo: string, balance: number) {
    const text = encodeURIComponent(
      `नमस्ते ${patientName} जी,\n\n` +
      `पाटील डेंटल क्लिनिककडून दंतोपचार बिलाबाबत नम्र आठवण.\n` +
      `📄 बिल क्रमांक: ${invoiceNo}\n` +
      `💰 शिल्लक रक्कम (Balance Due): ₹${balance.toLocaleString('en-IN')}\n\n` +
      `आपण ही शिल्लक रक्कम क्लिनिकमध्ये रोख, कार्ड किंवा थेट Google Pay / PhonePe द्वारे खालील क्रमांकावर जमा करू शकता:\n` +
      `📲 UPI: 9579649009@upi\n` +
      `धन्यवाद!\n` +
      `पाटील डेंटल क्लिनिक (+91 95796 49009)`
    );
    window.open(`https://wa.me/${this.cleanPhone(phone)}?text=${text}`, '_blank');
  },

  sendPrescriptionNotice(patientName: string, phone: string, doctorName: string) {
    const text = encodeURIComponent(
      `नमस्ते ${patientName} जी,\n\n` +
      `पाटील डेंटल क्लिनिककडून आपले डिजिटल प्रिस्क्रिप्शन (औषध चिठ्ठी) तयार करण्यात आले आहे.\n` +
      `👨‍⚕️ डॉक्टर: ${doctorName}\n` +
      `कृपया सर्व औषधे वेळेवर आणि सूचनेनुसार (जेवणानंतर / उपाशीपोटी) घ्यावीत.\n\n` +
      `काही अडचण किंवा तीव्र वेदना जाणवल्यास त्वरित संपर्क साधावा:\n` +
      `📞 ${CLINIC_INFO.phone}\n` +
      `पाटील डेंटल क्लिनिक.`
    );
    window.open(`https://wa.me/${this.cleanPhone(phone)}?text=${text}`, '_blank');
  }
};
