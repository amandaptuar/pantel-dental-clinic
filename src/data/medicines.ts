import { Medicine } from '../types';

export const MEDICINE_DATABASE: Medicine[] = [
  // Antibiotics
  {
    id: 'med-1',
    name: 'Augmentin 625 (Amoxicillin + Clavulanic Acid)',
    category: 'Antibiotic',
    dosage: '625 mg',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },
  {
    id: 'med-2',
    name: 'Amox 500 (Amoxicillin)',
    category: 'Antibiotic',
    dosage: '500 mg',
    frequency: '1-1-1',
    frequencyMarathi: 'सकाळी, दुपारी व रात्री (३ वेळा)',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },
  {
    id: 'med-3',
    name: 'Metrogyl 400 (Metronidazole)',
    category: 'Antibiotic',
    dosage: '400 mg',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
    duration: '3 Days',
    durationMarathi: '३ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },
  {
    id: 'med-4',
    name: 'Cefixime 200 (Taxim-O)',
    category: 'Antibiotic',
    dosage: '200 mg',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },

  // Analgesics & Anti-inflammatory
  {
    id: 'med-5',
    name: 'Zerodol-SP (Aceclofenac + Paracetamol + Serratiopeptidase)',
    category: 'Analgesic / Pain',
    dosage: '1 Tab',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
    duration: '3 Days',
    durationMarathi: '३ दिवस',
    instruction: 'After Food (Strictly)',
    instructionMarathi: 'फक्त जेवणानंतरच घ्यावे'
  },
  {
    id: 'med-6',
    name: 'Ketorol-DT (Ketorolac Tromethamine - Dissolvable)',
    category: 'Analgesic / Pain',
    dosage: '10 mg',
    frequency: 'SOS (When Pain)',
    frequencyMarathi: 'वेदना झाल्यास (गरज पडल्यास)',
    duration: '2 Days',
    durationMarathi: '२ दिवस',
    instruction: 'Dissolve in 1 tablespoon water',
    instructionMarathi: '१ चमचा पाण्यात विरघळवून प्यावे'
  },
  {
    id: 'med-7',
    name: 'Combiflam (Ibuprofen + Paracetamol)',
    category: 'Analgesic / Pain',
    dosage: '1 Tab',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री (२ वेळा)',
    duration: '3 Days',
    durationMarathi: '३ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },
  {
    id: 'med-8',
    name: 'Dolo 650 (Paracetamol)',
    category: 'Analgesic / Pain',
    dosage: '650 mg',
    frequency: '1-1-1',
    frequencyMarathi: 'सकाळी, दुपारी व रात्री',
    duration: '3 Days',
    durationMarathi: '३ दिवस',
    instruction: 'After Food',
    instructionMarathi: 'जेवणानंतर घ्यावे'
  },
  {
    id: 'med-9',
    name: 'Chymoral Forte (Enzyme Anti-swelling)',
    category: 'Anti-inflammatory',
    dosage: '1 Tab',
    frequency: '1-1-1',
    frequencyMarathi: 'सकाळी, दुपारी व रात्री',
    duration: '3 Days',
    durationMarathi: '३ दिवस',
    instruction: '1/2 hour Before Food',
    instructionMarathi: 'जेवणाच्या अर्धा तास आधी'
  },

  // Antacids
  {
    id: 'med-10',
    name: 'Pan-D (Pantoprazole + Domperidone)',
    category: 'Antacid',
    dosage: '40 mg',
    frequency: '1-0-0',
    frequencyMarathi: 'सकाळी उपाशीपोटी (१ वेळा)',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'Empty Stomach in Morning',
    instructionMarathi: 'सकाळी उपाशीपोटी घ्यावे'
  },
  {
    id: 'med-11',
    name: 'Omez 20 (Omeprazole)',
    category: 'Antacid',
    dosage: '20 mg',
    frequency: '1-0-0',
    frequencyMarathi: 'सकाळी उपाशीपोटी',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'Before Breakfast',
    instructionMarathi: 'सकाळी नाश्त्यापूर्वी'
  },

  // Mouthwashes & Topical Gels
  {
    id: 'med-12',
    name: 'Hexidine 0.2% (Chlorhexidine Gluconate Mouthwash)',
    category: 'Mouthwash',
    dosage: '10 ml',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री २ वेळा',
    duration: '7 Days',
    durationMarathi: '७ दिवस',
    instruction: 'Swish for 60 seconds after brushing, do not eat for 30 mins',
    instructionMarathi: '१ मिनिट तोंडात घोळवून थुंकणे, ३० मिनिटे काही खाऊ नये'
  },
  {
    id: 'med-13',
    name: 'Betadine 2% Gargle (Povidone Iodine)',
    category: 'Mouthwash',
    dosage: '10 ml',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व रात्री २ वेळा',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'Dilute with equal warm water and gargle',
    instructionMarathi: 'कोमट पाण्यात मिसळून चुळ भरावी'
  },
  {
    id: 'med-14',
    name: 'Zytee RB / Dologel CT Gel (Analgesic & Antiseptic Gel)',
    category: 'Dental Gel',
    dosage: 'Pea Size',
    frequency: '1-1-1',
    frequencyMarathi: 'दिवसातून ३ ते ४ वेळा',
    duration: '5 Days',
    durationMarathi: '५ दिवस',
    instruction: 'Apply gently on ulcer/painful area with clean finger',
    instructionMarathi: 'स्वच्छ बोटाने हिरडीवर / अल्सरवर हळुवार लावावे'
  },
  {
    id: 'med-15',
    name: 'Sensoform / Thermokind Paste (Sensitivity Relief)',
    category: 'Dental Gel',
    dosage: 'Pea Size',
    frequency: '1-0-1',
    frequencyMarathi: 'सकाळी व संध्याकाळी ब्रश करताना',
    duration: '15 Days',
    durationMarathi: '१५ दिवस',
    instruction: 'Brush gently with soft toothbrush',
    instructionMarathi: 'मऊ ब्रशने २ मिनिटे हलके ब्रश करावे'
  },

  // Vitamins
  {
    id: 'med-16',
    name: 'Becosules Z (Vitamin B-Complex + Zinc)',
    category: 'Multivitamin / Other',
    dosage: '1 Cap',
    frequency: '0-1-0',
    frequencyMarathi: 'दुपारी जेवणानंतर (१ वेळा)',
    duration: '10 Days',
    durationMarathi: '१० दिवस',
    instruction: 'After Lunch',
    instructionMarathi: 'दुपारी जेवणानंतर घ्यावे'
  }
];
