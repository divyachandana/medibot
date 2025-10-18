-- Medical App Database Schema
-- Comprehensive medical database with all clinical data types

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT UNIQUE NOT NULL,
    mrn TEXT UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE NOT NULL,
    sex TEXT NOT NULL,
    primary_dx TEXT,
    allergies_json TEXT,
    care_team_json TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    insurance_provider TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Encounters table
CREATE TABLE IF NOT EXISTS encounters (
    encounter_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    start_dt DATETIME NOT NULL,
    end_dt DATETIME,
    location TEXT,
    type TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Vitals table (tidy format)
CREATE TABLE IF NOT EXISTS vitals (
    vital_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    recorded_at DATETIME NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('HR', 'BP_SYS', 'BP_DIA', 'RR', 'TEMP', 'SPO2')),
    value_num REAL NOT NULL,
    unit TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Labs table
CREATE TABLE IF NOT EXISTS labs (
    lab_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    ordered_at DATETIME NOT NULL,
    resulted_at DATETIME,
    test_code TEXT,
    test_name TEXT NOT NULL,
    value_num REAL,
    unit TEXT,
    ref_low REAL,
    ref_high REAL,
    abnormal_flag TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Medications table (active med list)
CREATE TABLE IF NOT EXISTS meds (
    med_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    med_name TEXT NOT NULL,
    dose TEXT,
    route TEXT,
    freq TEXT,
    start_dt DATE,
    end_dt DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Imaging table
CREATE TABLE IF NOT EXISTS imaging (
    img_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    ordered_at DATETIME NOT NULL,
    modality TEXT NOT NULL,
    body_part TEXT,
    impression_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    note_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    author TEXT NOT NULL,
    note_type TEXT NOT NULL,
    created_at DATETIME NOT NULL,
    text TEXT NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Orders/Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    task_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    due_at DATETIME,
    status TEXT DEFAULT 'pending',
    assignee TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    alert_id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    created_at DATETIME NOT NULL,
    rule_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    rationale_json TEXT,
    resolved_by TEXT,
    resolved_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Legacy tables for backward compatibility
CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    appointment_date DATETIME NOT NULL,
    appointment_type TEXT,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    condition_name TEXT NOT NULL,
    diagnosis_date DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);