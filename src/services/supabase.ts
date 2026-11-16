import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration keys stored in localStorage
const SUPABASE_URL_KEY = 'patil_dental_supabase_url';
const SUPABASE_ANON_KEY = 'patil_dental_supabase_anon_key';

// Default Supabase project credentials provided
const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ddrngctqwgcokgyazcmy.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcm5nY3Rxd2djb2tneWF6Y215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ4MzAyMzEsImV4cCI6MjExMDQwNjIzMX0.W8xzKIoLmMdavXTexBm03F_2L3nX1RuaT_RhqkILzvY';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseConfig = () => {
  const url = localStorage.getItem(SUPABASE_URL_KEY) || DEFAULT_SUPABASE_URL;
  const key = localStorage.getItem(SUPABASE_ANON_KEY) || DEFAULT_SUPABASE_ANON_KEY;
  return { url, key };
};

export const setSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  localStorage.setItem(SUPABASE_ANON_KEY, key.trim());
  supabaseInstance = null; // reset instance to force re-instantiation
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key } = getSupabaseConfig();
  if (url && key) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
      return supabaseInstance;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
};

// SQL Schema for one-click setup in user's Supabase dashboard
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- PATIL DENTAL CLINIC CRM - SUPABASE DATABASE SCHEMA
-- Clinic Contact: +91 95796 49009
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unique_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  occupation TEXT,
  blood_group TEXT,
  medical_history TEXT[] DEFAULT '{}',
  allergies TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  dental_chart JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  status TEXT DEFAULT 'Scheduled',
  notes TEXT,
  is_follow_up_6_month BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Treatment Plans
CREATE TABLE IF NOT EXISTS treatment_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INTEGER,
  diagnosis TEXT NOT NULL,
  procedure TEXT NOT NULL,
  estimated_cost NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Planned',
  doctor_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RCT & Re-RCT Records
CREATE TABLE IF NOT EXISTS rct_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  tooth_number INTEGER NOT NULL,
  type TEXT DEFAULT 'RCT',
  canals JSONB DEFAULT '[]',
  irrigation_used TEXT,
  sealer_used TEXT,
  obturation_technique TEXT,
  post_core_done BOOLEAN DEFAULT FALSE,
  post_type TEXT,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Crown & Bridge Records
CREATE TABLE IF NOT EXISTS crown_bridge_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  teeth_involved INTEGER[] DEFAULT '{}',
  type TEXT NOT NULL,
  material TEXT NOT NULL,
  shade TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  prep_date DATE NOT NULL,
  impression_sent_date DATE,
  lab_due_date DATE,
  try_in_date DATE,
  cementation_date DATE,
  cement_used TEXT,
  status TEXT DEFAULT 'Preparation Done',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Smile Design & Veneers Records
CREATE TABLE IF NOT EXISTS smile_design_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  teeth_involved INTEGER[] DEFAULT '{}',
  treatment_type TEXT NOT NULL,
  initial_shade TEXT,
  target_shade TEXT,
  mockup_approved_date DATE,
  photography_notes TEXT,
  lab_name TEXT,
  cementation_date DATE,
  status TEXT DEFAULT 'Consultation & Mockup',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Aligners & FMR Records
CREATE TABLE IF NOT EXISTS aligner_fmr_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  treatment_type TEXT NOT NULL,
  total_trays_upper INTEGER,
  total_trays_lower INTEGER,
  current_tray_number INTEGER,
  tray_change_interval_days INTEGER DEFAULT 14,
  ipr_details TEXT,
  attachments_plan TEXT,
  ovd_freeway_space TEXT,
  centric_relation_record TEXT,
  deprogrammer_used BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'Records & Staging',
  next_review_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Clinical Notes
CREATE TABLE IF NOT EXISTS clinical_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  doctor_name TEXT NOT NULL,
  chief_complaint TEXT NOT NULL,
  on_examination TEXT NOT NULL,
  treatment_done TEXT NOT NULL,
  next_visit_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Prescriptions
CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  diagnosis TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  special_instructions TEXT,
  special_instructions_marathi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Consent Forms (with Biometric Fingerprint & Signature)
CREATE TABLE IF NOT EXISTS consent_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  treatment_type TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'Marathi',
  content_summary TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  patient_signature TEXT,
  fingerprint_scanned BOOLEAN DEFAULT FALSE,
  fingerprint_timestamp TIMESTAMPTZ,
  fingerprint_id TEXT,
  guardian_name TEXT,
  witness_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Invoices & Billing
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  items JSONB DEFAULT '[]',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount NUMERIC(10,2) DEFAULT 0,
  tax NUMERIC(10,2) DEFAULT 0,
  grand_total NUMERIC(10,2) DEFAULT 0,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  balance_due NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'Unpaid',
  payments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Lab Orders
CREATE TABLE IF NOT EXISTS lab_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  tooth_number TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  work_type TEXT NOT NULL,
  shade TEXT NOT NULL,
  sent_date DATE NOT NULL,
  due_date DATE NOT NULL,
  received_date DATE,
  lab_charge NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'Pending',
  status TEXT DEFAULT 'Sent to Lab',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Clinic Settings
CREATE TABLE IF NOT EXISTS clinic_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_settings',
  timing JSONB DEFAULT '{
    "morningStart": "10:00",
    "morningEnd": "14:00",
    "eveningStart": "17:00",
    "eveningEnd": "21:00",
    "workingDays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "holidays": []
  }',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and Create Open Access Policies for Clinic Users
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE rct_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE crown_bridge_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE smile_design_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE aligner_fmr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON patients FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON appointments FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON treatment_plans FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON rct_records FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON crown_bridge_records FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON smile_design_records FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON aligner_fmr_records FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON clinical_notes FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON prescriptions FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON consent_forms FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON invoices FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON lab_orders FOR ALL USING (true);';
  EXECUTE 'CREATE POLICY "Allow clinic app access" ON clinic_settings FOR ALL USING (true);';
EXCEPTION WHEN duplicate_object THEN
  -- policies already exist
END $$;
`;
