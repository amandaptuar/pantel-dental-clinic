import { 
  Patient, 
  UserAccount, 
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
  ClinicTiming 
} from '../types';

export const CLINIC_INFO = {
  name: 'Patil Dental Clinic & Implant Center',
  tagline: 'Advanced Dentistry, Aesthetic Smile Studio & Implantology',
  address: 'Shop No. 4 & 5, Near Shivaji Chowk, Station Road, Maharashtra, India',
  phone: '+91 95796 49009',
  email: 'patildentalclinic49009@gmail.com',
  chiefDoctor: 'Dr. Anand Patil (BDS, MDS - Oral Implantology & Cosmetic Dentistry)',
  regNo: 'MDC / Reg. No. A-28491'
};

export const CLINIC_ACCOUNTS: UserAccount[] = [
  {
    id: 'user-1',
    name: 'Dr. Anand Patil',
    role: 'Admin / Chief Dentist',
    specialization: 'MDS - Implantology, Oral Surgery & FMR',
    pin: '1234',
    avatarBg: 'bg-emerald-600'
  },
  {
    id: 'user-2',
    name: 'Dr. Neha Patil',
    role: 'Associate Dentist',
    specialization: 'BDS, Fellowship in Ortho & Pediatric Dentistry',
    pin: '5678',
    avatarBg: 'bg-cyan-600'
  },
  {
    id: 'user-3',
    name: 'Pooja Salunkhe',
    role: 'Receptionist / Assistant',
    specialization: 'Patient Care & Billing Coordinator',
    pin: '0000',
    avatarBg: 'bg-purple-600'
  }
];

export const INITIAL_CLINIC_TIMING: ClinicTiming = {
  morningStart: '10:00',
  morningEnd: '14:00',
  eveningStart: '17:00',
  eveningEnd: '21:00',
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  holidays: [
    { date: '2025-01-26', reason: 'Republic Day' },
    { date: '2025-05-01', reason: 'Maharashtra Day' },
    { date: '2025-08-15', reason: 'Independence Day' },
    { date: '2025-10-20', reason: 'Diwali Laxmi Pujan' }
  ]
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    uniqueId: 'PDC-2025-001',
    name: 'Rameshwar K. Deshmukh',
    age: 48,
    gender: 'Male',
    phone: '+91 98220 12345',
    email: 'rameshwar.deshmukh@gmail.com',
    address: 'Flat 302, Sai Vihar, Station Road',
    occupation: 'Teacher',
    bloodGroup: 'B+',
    medicalHistory: ['Hypertension (Telmisartan 40mg)'],
    allergies: 'None',
    emergencyContactName: 'Sunita Deshmukh (Wife)',
    emergencyContactPhone: '+91 98220 12346',
    dentalChart: {
      46: { condition: 'caries', surfaces: ['occlusal', 'distal'], notes: 'Deep dentinal caries' },
      36: { condition: 'rct', surfaces: ['occlusal'], notes: 'Obturation complete, crown pending' },
      28: { condition: 'missing', surfaces: [], notes: 'Extracted in 2022' },
      16: { condition: 'crown', surfaces: ['occlusal', 'buccal', 'lingual', 'mesial', 'distal'], notes: 'Zirconia crown placed' }
    },
    createdAt: '2025-01-10T10:00:00.000Z'
  },
  {
    id: 'pat-2',
    uniqueId: 'PDC-2025-002',
    name: 'Snehal Pravin Jadhav',
    age: 29,
    gender: 'Female',
    phone: '+91 94230 78901',
    email: 'snehal.jadhav@outlook.com',
    address: 'Bunglow No. 12, Shivaji Nagar',
    occupation: 'Software Engineer',
    bloodGroup: 'O+',
    medicalHistory: ['Normal'],
    allergies: 'Sulfa Drugs',
    emergencyContactName: 'Pravin Jadhav (Husband)',
    emergencyContactPhone: '+91 94230 78902',
    dentalChart: {
      11: { condition: 'filled', surfaces: ['mesial'], notes: 'Class IV Composite filling' },
      21: { condition: 'filled', surfaces: ['mesial'], notes: 'Composite restoration' },
      47: { condition: 'caries', surfaces: ['occlusal'], notes: 'Pit and fissure decay' }
    },
    createdAt: '2025-01-15T11:30:00.000Z'
  },
  {
    id: 'pat-3',
    uniqueId: 'PDC-2025-003',
    name: 'Aarav Sachin Patil',
    age: 8,
    gender: 'Male',
    phone: '+91 95796 49009',
    email: 'sachin.patil@yahoo.com',
    address: 'Near Patil Dental Clinic, Market Yard',
    occupation: 'Student (Pediatric)',
    bloodGroup: 'A+',
    medicalHistory: ['Childhood Asthma'],
    allergies: 'None',
    emergencyContactName: 'Sachin Patil (Father)',
    emergencyContactPhone: '+91 95796 49009',
    dentalChart: {
      75: { condition: 'caries', surfaces: ['occlusal'], notes: 'Primary 2nd molar caries' },
      85: { condition: 'filled', surfaces: ['occlusal'], notes: 'GIC Restoration' }
    },
    createdAt: '2025-01-20T16:00:00.000Z'
  },
  {
    id: 'pat-4',
    uniqueId: 'PDC-2025-004',
    name: 'Vikramaditya Shinde',
    age: 34,
    gender: 'Male',
    phone: '+91 97654 32109',
    email: 'vikram.shinde@tech.com',
    address: 'Plot 45, Green Park, Ring Road',
    occupation: 'Architect',
    bloodGroup: 'AB+',
    medicalHistory: ['Diabetes Type 2 (HbA1c 6.8%)'],
    allergies: 'Penicillin',
    emergencyContactName: 'Priya Shinde (Sister)',
    emergencyContactPhone: '+91 97654 32110',
    dentalChart: {
      14: { condition: 'implant', surfaces: [], notes: 'Osstem TS III Implant placed' },
      15: { condition: 'crown', surfaces: ['occlusal'], notes: 'Zirconia crown' },
      38: { condition: 'extraction_needed', surfaces: [], notes: 'Mesioangular impacted 3rd molar' }
    },
    createdAt: '2025-02-01T09:45:00.000Z'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Rameshwar K. Deshmukh',
    patientPhone: '+91 98220 12345',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    doctorName: 'Dr. Anand Patil',
    treatmentType: 'Crown Measurement / Try-In (Tooth #36)',
    status: 'Scheduled',
    notes: 'Verify margin fit and occlusal clearance'
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    patientName: 'Snehal Pravin Jadhav',
    patientPhone: '+91 94230 78901',
    date: new Date().toISOString().split('T')[0],
    time: '17:30',
    doctorName: 'Dr. Neha Patil',
    treatmentType: 'Clear Aligner Tray #4 Review & IPR',
    status: 'Confirmed',
    notes: 'IPR check on upper anterior'
  },
  {
    id: 'apt-3',
    patientId: 'pat-3',
    patientName: 'Aarav Sachin Patil',
    patientPhone: '+91 95796 49009',
    date: new Date().toISOString().split('T')[0],
    time: '18:30',
    doctorName: 'Dr. Neha Patil',
    treatmentType: 'Pediatric Pulpectomy follow-up',
    status: 'Confirmed',
    notes: 'Mild fluoride application planned'
  },
  {
    id: 'apt-4',
    patientId: 'pat-4',
    patientName: 'Vikramaditya Shinde',
    patientPhone: '+91 97654 32109',
    date: '2025-07-20', // Follow-up reminder
    time: '10:30',
    doctorName: 'Dr. Anand Patil',
    treatmentType: '6-Month Preventive Recall & Implant Checkup',
    status: 'Scheduled',
    isFollowUp6Month: true,
    notes: 'Routine 6-month checkup, probe pocket depths around #14 implant'
  }
];

export const INITIAL_TREATMENT_PLANS: TreatmentPlanItem[] = [
  {
    id: 'tp-1',
    patientId: 'pat-1',
    toothNumber: 36,
    diagnosis: 'Symptomatic Irreversible Pulpitis',
    procedure: 'Endodontic Root Canal Therapy + Zirconia Crown',
    estimatedCost: 8500,
    status: 'Completed',
    doctorName: 'Dr. Anand Patil',
    date: '2025-01-12'
  },
  {
    id: 'tp-2',
    patientId: 'pat-1',
    toothNumber: 46,
    diagnosis: 'Deep Occlusal Caries',
    procedure: 'Composite Tooth-Colored Restoration',
    estimatedCost: 1500,
    status: 'Planned',
    doctorName: 'Dr. Anand Patil',
    date: '2025-01-12'
  },
  {
    id: 'tp-3',
    patientId: 'pat-2',
    toothNumber: 11,
    diagnosis: 'Anterior Enamel Fracture',
    procedure: 'Direct Aesthetic Veneer / Class IV Composite',
    estimatedCost: 3500,
    status: 'Completed',
    doctorName: 'Dr. Neha Patil',
    date: '2025-01-16'
  },
  {
    id: 'tp-4',
    patientId: 'pat-4',
    toothNumber: 38,
    diagnosis: 'Recurrent Pericoronitis',
    procedure: 'Surgical Disimpaction (Wisdom Tooth Extraction)',
    estimatedCost: 4500,
    status: 'Planned',
    doctorName: 'Dr. Anand Patil',
    date: '2025-02-02'
  }
];

export const INITIAL_RCT_RECORDS: RCTRecord[] = [
  {
    id: 'rct-1',
    patientId: 'pat-1',
    toothNumber: 36,
    type: 'RCT',
    canals: [
      { name: 'MB', workingLength: 21, referencePoint: 'MB Cusp Tip', maf: '25/04' },
      { name: 'ML', workingLength: 20.5, referencePoint: 'ML Cusp Tip', maf: '25/04' },
      { name: 'Distal', workingLength: 21.5, referencePoint: 'Distal Marginal Ridge', maf: '30/04' }
    ],
    irrigationUsed: '3% Sodium Hypochlorite (NaOCl) + 17% EDTA with Sonic Activation',
    sealerUsed: 'Bio-ceramic Sealer (CeraSeal)',
    obturationTechnique: 'Single-cone hydraulic obturation',
    postCoreDone: false,
    completionDate: '2025-01-22',
    notes: 'Smooth glide path achieved. No post-op flare up.'
  }
];

export const INITIAL_CROWN_RECORDS: CrownBridgeRecord[] = [
  {
    id: 'cb-1',
    patientId: 'pat-1',
    teethInvolved: [36],
    type: 'Crown',
    material: 'Zirconia Monolithic',
    shade: 'A2',
    labName: 'Sai Precision Dental Lab, Pune',
    prepDate: '2025-01-28',
    impressionSentDate: '2025-01-29',
    labDueDate: '2025-02-05',
    tryInDate: '2025-02-06',
    cementationDate: '2025-02-07',
    cementUsed: 'RelyX U200 Self-Adhesive Resin',
    status: 'Cemented',
    notes: 'Good marginal seal, patient satisfied with shade match'
  }
];

export const INITIAL_SMILE_DESIGN_RECORDS: SmileDesignVeneerRecord[] = [
  {
    id: 'sd-1',
    patientId: 'pat-2',
    teethInvolved: [11, 12, 21, 22],
    treatmentType: 'Porcelain Veneers',
    initialShade: 'A3',
    targetShade: 'BL2 (Bleach Extra White)',
    mockupApprovedDate: '2025-01-18',
    photographyNotes: 'Full face smiling, 1:1 anterior macro photos saved.',
    labName: 'SmileCraft Aesthetic Studio, Mumbai',
    status: 'Consultation & Mockup'
  }
];

export const INITIAL_ALIGNER_RECORDS: AlignerFMRRecord[] = [
  {
    id: 'al-1',
    patientId: 'pat-2',
    treatmentType: 'Clear Aligners',
    totalTraysUpper: 18,
    totalTraysLower: 16,
    currentTrayNumber: 4,
    trayChangeIntervalDays: 14,
    iprDetails: '0.3mm IPR completed mesial & distal to 31, 41',
    attachmentsPlan: 'Rectangular beveled attachments on 13, 14, 23, 24',
    status: 'Active Movement',
    nextReviewDate: '2025-03-01',
    notes: 'Tracking excellently, patient wearing 22 hours daily'
  }
];

export const INITIAL_CLINICAL_NOTES: ClinicalNote[] = [
  {
    id: 'cn-1',
    patientId: 'pat-1',
    date: '2025-01-12',
    doctorName: 'Dr. Anand Patil',
    chiefComplaint: 'Severe radiating pain in lower left back tooth since 3 days, worsens with hot tea.',
    onExamination: 'Tooth #36 deep occlusal caries tender to percussion (+), thermal cold lingering pain 25s.',
    treatmentDone: 'Local Anesthesia 2% Lignocaine with Adrenaline (1:80000). Access opening under rubber dam, extirpated pulp, chemo-mechanical preparation up to #15 K-file. Closed with Ledermix + Cavit.',
    nextVisitPlan: 'Working length determination and biomechanical preparation.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'pat-1',
    patientName: 'Rameshwar K. Deshmukh',
    patientAge: 48,
    patientGender: 'Male',
    doctorName: 'Dr. Anand Patil',
    date: '2025-01-12',
    diagnosis: 'Acute Irreversible Pulpitis #36',
    items: [
      {
        medicineName: 'Augmentin 625 (Amoxicillin + Clavulanic Acid)',
        dosage: '625 mg',
        frequency: '1-0-1',
        frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
        duration: '5 Days',
        durationMarathi: '५ दिवस',
        instruction: 'After Food',
        instructionMarathi: 'जेवणानंतर घ्यावे'
      },
      {
        medicineName: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)',
        dosage: '1 Tab',
        frequency: '1-0-1',
        frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
        duration: '3 Days',
        durationMarathi: '३ दिवस',
        instruction: 'After Food (Strictly)',
        instructionMarathi: 'फक्त जेवणानंतरच घ्यावे'
      },
      {
        medicineName: 'Pan-D (Pantoprazole + Domperidone)',
        dosage: '40 mg',
        frequency: '1-0-0',
        frequencyMarathi: 'सकाळी उपाशीपोटी (१ वेळा)',
        duration: '5 Days',
        durationMarathi: '५ दिवस',
        instruction: 'Empty Stomach in Morning',
        instructionMarathi: 'सकाळी उपाशीपोटी घ्यावे'
      }
    ],
    specialInstructions: 'Warm saline rinses 4 times daily from tomorrow. Do not chew hard food from left side.',
    specialInstructionsMarathi: 'उद्यापासून दिवसातून ४ वेळा कोमट पाण्यात मीठ टाकून गुळण्या कराव्यात. डाव्या बाजूने कडक पदार्थ चावू नयेत.'
  }
];

export const INITIAL_CONSENT_FORMS: ConsentForm[] = [
  {
    id: 'cs-1',
    patientId: 'pat-1',
    patientName: 'Rameshwar K. Deshmukh',
    treatmentType: 'Root Canal Treatment (RCT / Re-RCT)',
    language: 'Marathi',
    contentSummary: 'रूट कॅनल उपचार (RCT) संमती पत्र - सर्व धोके, पर्याय आणि कॅप बसवण्याची आवश्यकता समजावून सांगितली.',
    doctorName: 'Dr. Anand Patil',
    date: '2025-01-12',
    fingerprintScanned: true,
    fingerprintTimestamp: '2025-01-12T10:15:22.000Z',
    fingerprintId: 'USB-BIO-FPRINT-98220-OK',
    witnessName: 'Pooja Salunkhe'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'PDC-INV-2025-001',
    patientId: 'pat-1',
    patientName: 'Rameshwar K. Deshmukh',
    patientPhone: '+91 98220 12345',
    date: '2025-01-12',
    dueDate: '2025-02-12',
    items: [
      { description: 'Root Canal Treatment (Tooth #36)', toothNumber: 36, cost: 4500 },
      { description: 'Monolithic Zirconia Crown (Tooth #36)', toothNumber: 36, cost: 4000 }
    ],
    subtotal: 8500,
    discount: 500,
    tax: 0,
    grandTotal: 8000,
    amountPaid: 5000,
    balanceDue: 3000,
    status: 'Partial',
    payments: [
      {
        id: 'pay-1',
        date: '2025-01-12',
        amount: 2500,
        paymentMode: 'UPI / GPay',
        receiptNumber: 'REC-001',
        notes: 'Initial advance during RCT access'
      },
      {
        id: 'pay-2',
        date: '2025-01-28',
        amount: 2500,
        paymentMode: 'Cash',
        receiptNumber: 'REC-002',
        notes: 'Crown prep partial payment'
      }
    ]
  },
  {
    id: 'inv-2',
    invoiceNumber: 'PDC-INV-2025-002',
    patientId: 'pat-2',
    patientName: 'Snehal Pravin Jadhav',
    patientPhone: '+91 94230 78901',
    date: '2025-01-15',
    items: [
      { description: 'Aesthetic Composite Restoration Tooth #11 & #21', cost: 3500 }
    ],
    subtotal: 3500,
    discount: 0,
    tax: 0,
    grandTotal: 3500,
    amountPaid: 3500,
    balanceDue: 0,
    status: 'Paid',
    payments: [
      {
        id: 'pay-3',
        date: '2025-01-15',
        amount: 3500,
        paymentMode: 'UPI / GPay',
        receiptNumber: 'REC-003',
        notes: 'Paid via PhonePe'
      }
    ]
  },
  {
    id: 'inv-3',
    invoiceNumber: 'PDC-INV-2025-003',
    patientId: 'pat-4',
    patientName: 'Vikramaditya Shinde',
    patientPhone: '+91 97654 32109',
    date: '2025-02-01',
    dueDate: '2025-02-15',
    items: [
      { description: 'Osstem TS III Dental Implant Stage 1 (#14)', toothNumber: 14, cost: 25000 }
    ],
    subtotal: 25000,
    discount: 1000,
    tax: 0,
    grandTotal: 24000,
    amountPaid: 15000,
    balanceDue: 9000,
    status: 'Partial',
    payments: [
      {
        id: 'pay-4',
        date: '2025-02-01',
        amount: 15000,
        paymentMode: 'Bank Transfer',
        receiptNumber: 'REC-004',
        notes: 'NEFT Transfer advance for implant fixture'
      }
    ]
  }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-1',
    orderNumber: 'PDC-LAB-2025-001',
    patientId: 'pat-1',
    patientName: 'Rameshwar K. Deshmukh',
    toothNumber: '36',
    labName: 'Sai Precision Dental Lab, Pune',
    workType: 'Zirconia Crown',
    shade: 'A2 (Layered)',
    sentDate: '2025-01-29',
    dueDate: '2025-02-05',
    receivedDate: '2025-02-05',
    labCharge: 1200,
    paymentStatus: 'Paid',
    status: 'Delivered to Patient',
    notes: 'High polish buccal margin'
  },
  {
    id: 'lab-2',
    orderNumber: 'PDC-LAB-2025-002',
    patientId: 'pat-2',
    patientName: 'Snehal Pravin Jadhav',
    toothNumber: '11, 12, 21, 22',
    labName: 'SmileCraft Aesthetic Studio, Mumbai',
    workType: 'E.max Veneer',
    shade: 'BL2',
    sentDate: '2025-02-10',
    dueDate: '2025-02-18',
    labCharge: 7200,
    paymentStatus: 'Pending',
    status: 'Fabrication in Progress',
    notes: 'Diagnostic waxup approved'
  },
  {
    id: 'lab-3',
    orderNumber: 'PDC-LAB-2025-003',
    patientId: 'pat-4',
    patientName: 'Vikramaditya Shinde',
    toothNumber: '14',
    labName: 'Global Dental Prosthetics',
    workType: 'Zirconia Crown',
    shade: 'A3',
    sentDate: '2025-02-12',
    dueDate: '2025-02-20',
    labCharge: 1800,
    paymentStatus: 'Pending',
    status: 'Sent to Lab',
    notes: 'Screw retained custom titanium abutment'
  }
];
