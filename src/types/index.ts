export type ArchType = 'adult' | 'pediatric';

export type ToothSurface = 'occlusal' | 'mesial' | 'distal' | 'buccal' | 'lingual';

export type ToothConditionType = 
  | 'healthy'
  | 'caries'
  | 'filled'
  | 'missing'
  | 'rct'
  | 'crown'
  | 'bridge'
  | 'extraction_needed'
  | 'implant';

export interface ToothCondition {
  condition: ToothConditionType;
  surfaces: ToothSurface[];
  notes?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string; // Internal UUID
  uniqueId: string; // PDC-2025-XXXX
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email?: string;
  address?: string;
  occupation?: string;
  bloodGroup?: string;
  medicalHistory: string[]; // e.g. ['Diabetes', 'Hypertension', 'Allergy to Penicillin']
  allergies?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dentalChart: Record<number, ToothCondition>; // Keyed by tooth number (Universal or FDI)
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  role: 'Admin / Chief Dentist' | 'Associate Dentist' | 'Receptionist / Assistant';
  specialization: string;
  pin: string;
  avatarBg: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  doctorName: string;
  treatmentType: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show';
  notes?: string;
  isFollowUp6Month?: boolean;
}

export interface ClinicTiming {
  morningStart: string;
  morningEnd: string;
  eveningStart: string;
  eveningEnd: string;
  workingDays: string[];
  holidays: { date: string; reason: string }[];
}

export interface TreatmentPlanItem {
  id: string;
  patientId: string;
  toothNumber?: number;
  diagnosis: string;
  procedure: string;
  estimatedCost: number;
  status: 'Planned' | 'In Progress' | 'Completed';
  doctorName: string;
  date: string;
}

export interface RCTRecord {
  id: string;
  patientId: string;
  toothNumber: number;
  type: 'RCT' | 'Re-RCT';
  canals: {
    name: string; // MB1, MB2, DB, Palatal, Mesial, Distal
    workingLength: number; // in mm
    referencePoint: string;
    maf: string; // Master Apical File (e.g. 25/04, 30/06)
  }[];
  irrigationUsed: string;
  sealerUsed: string; // e.g. AH Plus, Bio-ceramic, Apexit
  obturationTechnique: string;
  postCoreDone: boolean;
  postType?: string;
  completionDate: string;
  notes?: string;
}

export interface CrownBridgeRecord {
  id: string;
  patientId: string;
  teethInvolved: number[];
  type: 'Crown' | 'Bridge' | 'Inlay/Onlay';
  material: 'Zirconia Monolithic' | 'Layered Zirconia' | 'PFM (Porcelain Fused to Metal)' | 'E.max Lithium Disilicate' | 'Full Metal' | 'Temporary PMMA';
  shade: string; // e.g. A1, A2, A3, B2, BL2
  labName: string;
  prepDate: string;
  impressionSentDate: string;
  labDueDate: string;
  tryInDate?: string;
  cementationDate?: string;
  cementUsed?: string; // e.g. RelyX U200, GIC Type I, Resin Cement
  status: 'Preparation Done' | 'Sent to Lab' | 'Received from Lab' | 'Try-In' | 'Cemented';
  notes?: string;
}

export interface SmileDesignVeneerRecord {
  id: string;
  patientId: string;
  teethInvolved: number[];
  treatmentType: 'Porcelain Veneers' | 'Composite Veneers' | 'Smile Designing / Mockup' | 'Gingivoplasty & Aesthetics';
  initialShade: string;
  targetShade: string;
  mockupApprovedDate?: string;
  photographyNotes?: string;
  labName?: string;
  cementationDate?: string;
  status: 'Consultation & Mockup' | 'Tooth Prep' | 'Lab Fabrication' | 'Cemented' | 'Review';
}

export interface AlignerFMRRecord {
  id: string;
  patientId: string;
  treatmentType: 'Clear Aligners' | 'Full Mouth Rehabilitation (FMR)' | 'Fixed Orthodontics';
  totalTraysUpper?: number;
  totalTraysLower?: number;
  currentTrayNumber?: number;
  trayChangeIntervalDays?: number; // e.g. 10 or 14 days
  iprDetails?: string;
  attachmentsPlan?: string;
  // FMR fields
  ovdFreewaySpace?: string;
  centricRelationRecord?: string;
  deprogrammerUsed?: boolean;
  status: 'Records & Staging' | 'Aligners Delivered' | 'Active Movement' | 'Refinement' | 'Retention';
  nextReviewDate: string;
  notes?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  chiefComplaint: string;
  onExamination: string;
  treatmentDone: string;
  nextVisitPlan: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: 'Antibiotic' | 'Analgesic / Pain' | 'Anti-inflammatory' | 'Antacid' | 'Mouthwash' | 'Dental Gel' | 'Multivitamin / Other';
  dosage: string; // e.g. 500mg, 625mg, 100mg
  frequency: string; // 1-0-1, 1-1-1, 1-0-0, 0-0-1, SOS
  frequencyMarathi: string; // सकाळी व रात्री, तीन वेळा, सकाळी एकदा, रात्री एकदा, गरज पडल्यास
  duration: string; // 3 Days, 5 Days, 7 Days
  durationMarathi: string; // ३ दिवस, ५ दिवस, ७ दिवस
  instruction: string; // After Food, Before Food, Gargle for 1 min
  instructionMarathi: string; // जेवणानंतर घ्यावे, जेवणापूर्वी घ्यावे, १ मिनिट चुळ भरावी
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  frequencyMarathi: string;
  duration: string;
  durationMarathi: string;
  instruction: string;
  instructionMarathi: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  items: PrescriptionItem[];
  specialInstructions?: string;
  specialInstructionsMarathi?: string;
}

export interface ConsentForm {
  id: string;
  patientId: string;
  patientName: string;
  treatmentType: string;
  language: 'Marathi' | 'English';
  contentSummary: string;
  doctorName: string;
  date: string;
  patientSignature?: string; // base64 canvas image data URL
  fingerprintScanned: boolean;
  fingerprintTimestamp?: string;
  fingerprintId?: string;
  guardianName?: string;
  witnessName?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  paymentMode: 'Cash' | 'UPI / GPay' | 'Card' | 'Bank Transfer';
  receiptNumber: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // PDC-INV-2025-001
  patientId: string;
  patientName: string;
  patientPhone: string;
  date: string;
  dueDate?: string;
  items: {
    description: string;
    toothNumber?: number;
    cost: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  status: 'Paid' | 'Partial' | 'Unpaid';
  payments: PaymentRecord[];
}

export interface LabOrder {
  id: string;
  orderNumber: string; // PDC-LAB-2025-001
  patientId: string;
  patientName: string;
  toothNumber: string; // e.g. "16, 17" or "Upper Arch"
  labName: string;
  workType: 'Zirconia Crown' | 'PFM Crown' | 'E.max Veneer' | 'Orthodontic Retainer' | 'Clear Aligner Tray' | 'Cast Partial Denture' | 'Complete Denture' | 'Night Guard';
  shade: string;
  sentDate: string;
  dueDate: string;
  receivedDate?: string;
  labCharge: number;
  paymentStatus: 'Pending' | 'Paid';
  status: 'Sent to Lab' | 'Fabrication in Progress' | 'Received & Verified' | 'Delivered to Patient';
  notes?: string;
}
