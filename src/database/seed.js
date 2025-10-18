const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'medical_app.db');
const db = new sqlite3.Database(dbPath);

console.log('🌱 Seeding comprehensive medical database...');

// Sample patients with medical record numbers
const patients = [
    {
        patient_id: 'P001',
        mrn: 'MRN001',
        first_name: 'John',
        last_name: 'Smith',
        dob: '1984-03-15',
        sex: 'M',
        primary_dx: 'Type 2 Diabetes',
        allergies_json: JSON.stringify(['Penicillin', 'Shellfish']),
        care_team_json: JSON.stringify({
            primary_physician: 'Dr. Sarah Johnson',
            endocrinologist: 'Dr. Michael Chen',
            nurse: 'Jane Wilson'
        }),
        phone: '555-0101',
        email: 'john.smith@email.com',
        address: '123 Main St, City, State 12345',
        insurance_provider: 'HealthPlus Insurance'
    },
    {
        patient_id: 'P002',
        mrn: 'MRN002',
        first_name: 'Sarah',
        last_name: 'Johnson',
        dob: '1989-07-22',
        sex: 'F',
        primary_dx: 'Hypertension',
        allergies_json: JSON.stringify(['Latex']),
        care_team_json: JSON.stringify({
            primary_physician: 'Dr. Emily Davis',
            cardiologist: 'Dr. Robert Brown',
            nurse: 'Lisa Anderson'
        }),
        phone: '555-0201',
        email: 'sarah.johnson@email.com',
        address: '456 Oak Ave, City, State 12345',
        insurance_provider: 'MediCare Plus'
    },
    {
        patient_id: 'P003',
        mrn: 'MRN003',
        first_name: 'Robert',
        last_name: 'Brown',
        dob: '1977-11-08',
        sex: 'M',
        primary_dx: 'COPD',
        allergies_json: JSON.stringify(['Aspirin', 'Dust mites']),
        care_team_json: JSON.stringify({
            primary_physician: 'Dr. Michael Chen',
            pulmonologist: 'Dr. Jennifer Lee',
            respiratory_therapist: 'Tom Wilson'
        }),
        phone: '555-0301',
        email: 'robert.brown@email.com',
        address: '789 Pine St, City, State 12345',
        insurance_provider: 'Blue Cross Blue Shield'
    },
    {
        patient_id: 'P004',
        mrn: 'MRN004',
        first_name: 'Emily',
        last_name: 'Davis',
        dob: '1995-01-29',
        sex: 'F',
        primary_dx: 'Asthma',
        allergies_json: JSON.stringify(['Pollen', 'Pet dander']),
        care_team_json: JSON.stringify({
            primary_physician: 'Dr. Sarah Johnson',
            pulmonologist: 'Dr. Jennifer Lee',
            nurse: 'Amy Taylor'
        }),
        phone: '555-0401',
        email: 'emily.davis@email.com',
        address: '321 Elm St, City, State 12345',
        insurance_provider: 'Aetna Health'
    },
    {
        patient_id: 'P005',
        mrn: 'MRN005',
        first_name: 'Michael',
        last_name: 'Wilson',
        dob: '1981-05-12',
        sex: 'M',
        primary_dx: 'Heart Disease',
        allergies_json: JSON.stringify(['Contrast dye']),
        care_team_json: JSON.stringify({
            primary_physician: 'Dr. Emily Davis',
            cardiologist: 'Dr. Robert Brown',
            nurse: 'David Miller'
        }),
        phone: '555-0501',
        email: 'michael.wilson@email.com',
        address: '654 Maple Dr, City, State 12345',
        insurance_provider: 'Cigna Health'
    }
];

// Sample encounters
const encounters = [
    { patient_id: 1, start_dt: '2024-10-15 09:00:00', end_dt: '2024-10-15 10:30:00', location: 'Clinic A', type: 'Office Visit' },
    { patient_id: 1, start_dt: '2024-10-10 14:00:00', end_dt: '2024-10-10 15:00:00', location: 'Lab', type: 'Lab Visit' },
    { patient_id: 2, start_dt: '2024-10-14 10:00:00', end_dt: '2024-10-14 11:00:00', location: 'Clinic B', type: 'Follow-up' },
    { patient_id: 3, start_dt: '2024-10-12 08:30:00', end_dt: '2024-10-12 09:30:00', location: 'Emergency', type: 'Emergency Visit' },
    { patient_id: 4, start_dt: '2024-10-13 15:00:00', end_dt: '2024-10-13 16:00:00', location: 'Clinic A', type: 'Consultation' },
    { patient_id: 5, start_dt: '2024-10-11 11:00:00', end_dt: '2024-10-11 12:00:00', location: 'Cardiology', type: 'Specialist Visit' }
];

// Sample vitals
const vitals = [
    // Patient 1 (John Smith) - Diabetes
    { patient_id: 1, recorded_at: '2024-10-15 09:15:00', type: 'HR', value_num: 85, unit: 'bpm' },
    { patient_id: 1, recorded_at: '2024-10-15 09:15:00', type: 'BP_SYS', value_num: 140, unit: 'mmHg' },
    { patient_id: 1, recorded_at: '2024-10-15 09:15:00', type: 'BP_DIA', value_num: 90, unit: 'mmHg' },
    { patient_id: 1, recorded_at: '2024-10-15 09:15:00', type: 'TEMP', value_num: 98.6, unit: '°F' },
    { patient_id: 1, recorded_at: '2024-10-15 09:15:00', type: 'SPO2', value_num: 98, unit: '%' },
    
    // Patient 2 (Sarah Johnson) - Hypertension
    { patient_id: 2, recorded_at: '2024-10-14 10:15:00', type: 'HR', value_num: 95, unit: 'bpm' },
    { patient_id: 2, recorded_at: '2024-10-14 10:15:00', type: 'BP_SYS', value_num: 160, unit: 'mmHg' },
    { patient_id: 2, recorded_at: '2024-10-14 10:15:00', type: 'BP_DIA', value_num: 100, unit: 'mmHg' },
    { patient_id: 2, recorded_at: '2024-10-14 10:15:00', type: 'TEMP', value_num: 98.4, unit: '°F' },
    
    // Patient 3 (Robert Brown) - COPD
    { patient_id: 3, recorded_at: '2024-10-12 08:45:00', type: 'HR', value_num: 110, unit: 'bpm' },
    { patient_id: 3, recorded_at: '2024-10-12 08:45:00', type: 'BP_SYS', value_num: 130, unit: 'mmHg' },
    { patient_id: 3, recorded_at: '2024-10-12 08:45:00', type: 'BP_DIA', value_num: 85, unit: 'mmHg' },
    { patient_id: 3, recorded_at: '2024-10-12 08:45:00', type: 'RR', value_num: 24, unit: 'breaths/min' },
    { patient_id: 3, recorded_at: '2024-10-12 08:45:00', type: 'SPO2', value_num: 92, unit: '%' },
    
    // Patient 4 (Emily Davis) - Asthma
    { patient_id: 4, recorded_at: '2024-10-13 15:15:00', type: 'HR', value_num: 88, unit: 'bpm' },
    { patient_id: 4, recorded_at: '2024-10-13 15:15:00', type: 'BP_SYS', value_num: 120, unit: 'mmHg' },
    { patient_id: 4, recorded_at: '2024-10-13 15:15:00', type: 'BP_DIA', value_num: 80, unit: 'mmHg' },
    { patient_id: 4, recorded_at: '2024-10-13 15:15:00', type: 'SPO2', value_num: 97, unit: '%' },
    
    // Patient 5 (Michael Wilson) - Heart Disease
    { patient_id: 5, recorded_at: '2024-10-11 11:15:00', type: 'HR', value_num: 75, unit: 'bpm' },
    { patient_id: 5, recorded_at: '2024-10-11 11:15:00', type: 'BP_SYS', value_num: 125, unit: 'mmHg' },
    { patient_id: 5, recorded_at: '2024-10-11 11:15:00', type: 'BP_DIA', value_num: 78, unit: 'mmHg' },
    { patient_id: 5, recorded_at: '2024-10-11 11:15:00', type: 'TEMP', value_num: 98.2, unit: '°F' }
];

// Sample lab results
const labs = [
    { patient_id: 1, ordered_at: '2024-10-10 14:00:00', resulted_at: '2024-10-10 16:00:00', test_code: 'HBA1C', test_name: 'Hemoglobin A1c', value_num: 8.2, unit: '%', ref_low: 4.0, ref_high: 6.0, abnormal_flag: 'H' },
    { patient_id: 1, ordered_at: '2024-10-10 14:00:00', resulted_at: '2024-10-10 16:00:00', test_code: 'GLUCOSE', test_name: 'Fasting Glucose', value_num: 180, unit: 'mg/dL', ref_low: 70, ref_high: 100, abnormal_flag: 'H' },
    { patient_id: 2, ordered_at: '2024-10-14 10:00:00', resulted_at: '2024-10-14 12:00:00', test_code: 'CHOL', test_name: 'Total Cholesterol', value_num: 220, unit: 'mg/dL', ref_low: 0, ref_high: 200, abnormal_flag: 'H' },
    { patient_id: 3, ordered_at: '2024-10-12 08:30:00', resulted_at: '2024-10-12 10:30:00', test_code: 'ABG', test_name: 'Arterial Blood Gas', value_num: 7.35, unit: 'pH', ref_low: 7.35, ref_high: 7.45, abnormal_flag: 'N' },
    { patient_id: 4, ordered_at: '2024-10-13 15:00:00', resulted_at: '2024-10-13 17:00:00', test_code: 'EOS', test_name: 'Eosinophil Count', value_num: 8, unit: '%', ref_low: 0, ref_high: 5, abnormal_flag: 'H' },
    { patient_id: 5, ordered_at: '2024-10-11 11:00:00', resulted_at: '2024-10-11 13:00:00', test_code: 'TROP', test_name: 'Troponin I', value_num: 0.02, unit: 'ng/mL', ref_low: 0, ref_high: 0.04, abnormal_flag: 'N' }
];

// Sample medications
const meds = [
    { patient_id: 1, med_name: 'Metformin', dose: '500mg', route: 'PO', freq: 'BID', start_dt: '2024-01-15', end_dt: null, status: 'active' },
    { patient_id: 1, med_name: 'Insulin Glargine', dose: '20 units', route: 'SC', freq: 'Daily', start_dt: '2024-03-01', end_dt: null, status: 'active' },
    { patient_id: 2, med_name: 'Lisinopril', dose: '10mg', route: 'PO', freq: 'Daily', start_dt: '2024-02-10', end_dt: null, status: 'active' },
    { patient_id: 2, med_name: 'Hydrochlorothiazide', dose: '25mg', route: 'PO', freq: 'Daily', start_dt: '2024-02-10', end_dt: null, status: 'active' },
    { patient_id: 3, med_name: 'Albuterol', dose: '90mcg', route: 'Inhalation', freq: 'PRN', start_dt: '2024-01-20', end_dt: null, status: 'active' },
    { patient_id: 3, med_name: 'Tiotropium', dose: '18mcg', route: 'Inhalation', freq: 'Daily', start_dt: '2024-01-20', end_dt: null, status: 'active' },
    { patient_id: 4, med_name: 'Fluticasone', dose: '220mcg', route: 'Inhalation', freq: 'BID', start_dt: '2024-02-05', end_dt: null, status: 'active' },
    { patient_id: 5, med_name: 'Atorvastatin', dose: '40mg', route: 'PO', freq: 'Daily', start_dt: '2024-01-10', end_dt: null, status: 'active' },
    { patient_id: 5, med_name: 'Aspirin', dose: '81mg', route: 'PO', freq: 'Daily', start_dt: '2024-01-10', end_dt: null, status: 'active' }
];

// Sample imaging
const imaging = [
    { patient_id: 3, ordered_at: '2024-10-12 08:30:00', modality: 'Chest X-ray', body_part: 'Chest', impression_text: 'Hyperinflation consistent with COPD. No acute findings.' },
    { patient_id: 5, ordered_at: '2024-10-11 11:00:00', modality: 'Echocardiogram', body_part: 'Heart', impression_text: 'Mild left ventricular hypertrophy. Ejection fraction 55%.' },
    { patient_id: 1, ordered_at: '2024-10-10 14:00:00', modality: 'CT', body_part: 'Abdomen', impression_text: 'No acute findings. Mild hepatomegaly.' },
    { patient_id: 2, ordered_at: '2024-10-14 10:00:00', modality: 'MRI', body_part: 'Brain', impression_text: 'No acute intracranial abnormalities.' }
];

// Sample notes
const notes = [
    { patient_id: 1, author: 'Dr. Sarah Johnson', note_type: 'Progress Note', created_at: '2024-10-15 09:30:00', text: 'Patient reports good glucose control with current regimen. Continue current medications. Follow up in 3 months.' },
    { patient_id: 2, author: 'Dr. Emily Davis', note_type: 'Progress Note', created_at: '2024-10-14 10:30:00', text: 'Blood pressure elevated. Increased lisinopril dose. Patient counseled on lifestyle modifications.' },
    { patient_id: 3, author: 'Dr. Jennifer Lee', note_type: 'Emergency Note', created_at: '2024-10-12 09:00:00', text: 'Patient presented with acute exacerbation of COPD. Responded well to bronchodilator treatment. Discharged with increased medication regimen.' },
    { patient_id: 4, author: 'Dr. Sarah Johnson', note_type: 'Consultation', created_at: '2024-10-13 15:30:00', text: 'Asthma well controlled. Patient educated on trigger avoidance. Continue current inhaler regimen.' },
    { patient_id: 5, author: 'Dr. Robert Brown', note_type: 'Cardiology Note', created_at: '2024-10-11 11:30:00', text: 'Stable coronary artery disease. Continue statin and aspirin. Annual stress test recommended.' }
];

// Sample tasks
const tasks = [
    { patient_id: 1, type: 'Follow-up', description: 'Schedule 3-month diabetes follow-up', due_at: '2025-01-15 09:00:00', status: 'pending', assignee: 'Dr. Sarah Johnson' },
    { patient_id: 2, type: 'Lab', description: 'Repeat blood pressure check in 2 weeks', due_at: '2024-10-28 10:00:00', status: 'pending', assignee: 'Dr. Emily Davis' },
    { patient_id: 3, type: 'Education', description: 'Pulmonary rehabilitation referral', due_at: '2024-10-19 14:00:00', status: 'completed', assignee: 'Dr. Jennifer Lee' },
    { patient_id: 4, type: 'Follow-up', description: 'Annual asthma review', due_at: '2025-01-13 15:00:00', status: 'pending', assignee: 'Dr. Sarah Johnson' },
    { patient_id: 5, type: 'Procedure', description: 'Schedule stress test', due_at: '2024-11-11 11:00:00', status: 'pending', assignee: 'Dr. Robert Brown' }
];

// Sample alerts
const alerts = [
    { patient_id: 1, created_at: '2024-10-15 09:20:00', rule_name: 'High A1c Alert', severity: 'high', message: 'A1c level 8.2% exceeds target range', rationale_json: JSON.stringify({ target_range: '4-6%', current_value: '8.2%' }), resolved_by: null, resolved_at: null },
    { patient_id: 2, created_at: '2024-10-14 10:20:00', rule_name: 'Hypertension Alert', severity: 'medium', message: 'Blood pressure 160/100 mmHg elevated', rationale_json: JSON.stringify({ normal_range: '<140/90', current_value: '160/100' }), resolved_by: 'Dr. Emily Davis', resolved_at: '2024-10-14 10:45:00' },
    { patient_id: 3, created_at: '2024-10-12 08:50:00', rule_name: 'Low Oxygen Alert', severity: 'critical', message: 'Oxygen saturation 92% below normal', rationale_json: JSON.stringify({ normal_range: '>95%', current_value: '92%' }), resolved_by: 'Dr. Jennifer Lee', resolved_at: '2024-10-12 09:15:00' },
    { patient_id: 4, created_at: '2024-10-13 15:20:00', rule_name: 'Allergy Alert', severity: 'medium', message: 'Patient has pollen allergy - peak season', rationale_json: JSON.stringify({ allergy: 'Pollen', season: 'Fall' }), resolved_by: null, resolved_at: null },
    { patient_id: 5, created_at: '2024-10-11 11:20:00', rule_name: 'Medication Alert', severity: 'low', message: 'Statin medication due for refill', rationale_json: JSON.stringify({ medication: 'Atorvastatin', last_fill: '2024-07-11' }), resolved_by: null, resolved_at: null }
];

// Insert data
function insertData() {
    // Insert patients
    console.log('📝 Inserting patients...');
    const insertPatient = db.prepare(`
        INSERT INTO patients (patient_id, mrn, first_name, last_name, dob, sex, primary_dx, allergies_json, care_team_json, phone, email, address, insurance_provider)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    patients.forEach(patient => {
        insertPatient.run(
            patient.patient_id, patient.mrn, patient.first_name, patient.last_name, 
            patient.dob, patient.sex, patient.primary_dx, patient.allergies_json, 
            patient.care_team_json, patient.phone, patient.email, patient.address, patient.insurance_provider
        );
    });
    insertPatient.finalize();

    // Insert encounters
    console.log('🏥 Inserting encounters...');
    const insertEncounter = db.prepare(`
        INSERT INTO encounters (patient_id, start_dt, end_dt, location, type)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    encounters.forEach(encounter => {
        insertEncounter.run(encounter.patient_id, encounter.start_dt, encounter.end_dt, encounter.location, encounter.type);
    });
    insertEncounter.finalize();

    // Insert vitals
    console.log('💓 Inserting vitals...');
    const insertVital = db.prepare(`
        INSERT INTO vitals (patient_id, recorded_at, type, value_num, unit)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    vitals.forEach(vital => {
        insertVital.run(vital.patient_id, vital.recorded_at, vital.type, vital.value_num, vital.unit);
    });
    insertVital.finalize();

    // Insert labs
    console.log('🧪 Inserting lab results...');
    const insertLab = db.prepare(`
        INSERT INTO labs (patient_id, ordered_at, resulted_at, test_code, test_name, value_num, unit, ref_low, ref_high, abnormal_flag)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    labs.forEach(lab => {
        insertLab.run(lab.patient_id, lab.ordered_at, lab.resulted_at, lab.test_code, lab.test_name, lab.value_num, lab.unit, lab.ref_low, lab.ref_high, lab.abnormal_flag);
    });
    insertLab.finalize();

    // Insert medications
    console.log('💊 Inserting medications...');
    const insertMed = db.prepare(`
        INSERT INTO meds (patient_id, med_name, dose, route, freq, start_dt, end_dt, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    meds.forEach(med => {
        insertMed.run(med.patient_id, med.med_name, med.dose, med.route, med.freq, med.start_dt, med.end_dt, med.status);
    });
    insertMed.finalize();

    // Insert imaging
    console.log('📸 Inserting imaging...');
    const insertImaging = db.prepare(`
        INSERT INTO imaging (patient_id, ordered_at, modality, body_part, impression_text)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    imaging.forEach(img => {
        insertImaging.run(img.patient_id, img.ordered_at, img.modality, img.body_part, img.impression_text);
    });
    insertImaging.finalize();

    // Insert notes
    console.log('📝 Inserting notes...');
    const insertNote = db.prepare(`
        INSERT INTO notes (patient_id, author, note_type, created_at, text)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    notes.forEach(note => {
        insertNote.run(note.patient_id, note.author, note.note_type, note.created_at, note.text);
    });
    insertNote.finalize();

    // Insert tasks
    console.log('📋 Inserting tasks...');
    const insertTask = db.prepare(`
        INSERT INTO tasks (patient_id, type, description, due_at, status, assignee)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    tasks.forEach(task => {
        insertTask.run(task.patient_id, task.type, task.description, task.due_at, task.status, task.assignee);
    });
    insertTask.finalize();

    // Insert alerts
    console.log('🚨 Inserting alerts...');
    const insertAlert = db.prepare(`
        INSERT INTO alerts (patient_id, created_at, rule_name, severity, message, rationale_json, resolved_by, resolved_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    alerts.forEach(alert => {
        insertAlert.run(alert.patient_id, alert.created_at, alert.rule_name, alert.severity, alert.message, alert.rationale_json, alert.resolved_by, alert.resolved_at);
    });
    insertAlert.finalize();

    console.log('✅ Comprehensive medical database seeded successfully!');
    console.log(`📊 Data Summary:`);
    console.log(`   • ${patients.length} patients`);
    console.log(`   • ${encounters.length} encounters`);
    console.log(`   • ${vitals.length} vital signs`);
    console.log(`   • ${labs.length} lab results`);
    console.log(`   • ${meds.length} medications`);
    console.log(`   • ${imaging.length} imaging studies`);
    console.log(`   • ${notes.length} clinical notes`);
    console.log(`   • ${tasks.length} tasks/orders`);
    console.log(`   • ${alerts.length} clinical alerts`);
}

// Run the seeding
insertData();

db.close();