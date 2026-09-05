import * as XLSX from 'xlsx';
import { Cadet, DatasetValidationRow, DatasetImportResult } from '../types';

export type ImportMode = 'add_new_only' | 'update_existing' | 'add_and_update';

/**
 * Validates a single cadet record according to institutional rules
 */
export function validateCadetRecord(
  record: any,
  rowNumber: number,
  existingCadets: Cadet[],
  seenCadetIds: Set<string>,
  seenEmails: Set<string>
): DatasetValidationRow {
  const errors: string[] = [];

  const cadetId = String(record['Cadet ID'] || record['cadetId'] || '').trim().toUpperCase();
  const name = String(record['Name'] || record['name'] || record['Full Name'] || '').trim();
  const email = String(record['Email'] || record['email'] || record['Email Address'] || '').trim().toLowerCase();
  const phone = String(record['Phone'] || record['phone'] || record['Mobile Number'] || '').trim();
  const college = String(record['College'] || record['college'] || record['Institution'] || '').trim();
  const department = String(record['Department'] || record['department'] || record['Dept'] || '').trim();
  const year = String(record['Year'] || record['year'] || '3').trim();
  const university = String(record['University'] || record['university'] || 'State University').trim();
  const registerNumber = String(record['Register Number'] || record['registerNumber'] || record['Reg No'] || '').trim();
  const nccUnit = String(record['NCC Unit'] || record['nccUnit'] || '1 (TN) CTC NCC').trim();
  const pkg = String(record['Package'] || record['package'] || record['Package Name'] || 'Free Mock Test').trim();
  const status = String(record['Status'] || record['status'] || 'Active').trim();

  // Validate Cadet ID
  if (!cadetId) {
    errors.push('Missing Cadet ID');
  } else if (seenCadetIds.has(cadetId)) {
    errors.push(`Duplicate Cadet ID "${cadetId}" in file`);
  }

  // Validate Name
  if (!name) {
    errors.push('Missing Cadet Name');
  }

  // Validate Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    errors.push('Missing Email Address');
  } else if (!emailRegex.test(email)) {
    errors.push(`Invalid Email format "${email}"`);
  } else if (seenEmails.has(email)) {
    errors.push(`Duplicate Email "${email}" in file`);
  }

  // Validate College & Dept
  if (!college) {
    errors.push('Missing College / Institution');
  }
  if (!department) {
    errors.push('Missing Department');
  }

  // Record into sets if present
  if (cadetId) seenCadetIds.add(cadetId);
  if (email) seenEmails.add(email);

  const cadetData: Partial<Cadet> = {
    id: `cadet-${cadetId.toLowerCase() || Date.now()}`,
    cadetId: cadetId || `NCC2026${String(rowNumber).padStart(4, '0')}`,
    name: name || 'Cadet Aspirant',
    email: email || `cadet${rowNumber}@warrior.in`,
    phone: phone || '9876543210',
    dateOfBirth: record['dateOfBirth'] || '2003-01-01',
    gender: record['gender'] || 'Male',
    college: college || 'National Defence Academy Hub',
    department: department || 'General Engineering',
    year: year || '3',
    university: university || 'Central University',
    registerNumber: registerNumber || `REG2026${rowNumber}`,
    nccUnit: nccUnit || '1 (TN) CTC NCC',
    password: 'Password@123',
    status: status === 'Disabled' ? 'Disabled' : 'Active',
    registrationDate: new Date().toISOString().split('T')[0],
    package: pkg,
    packageName: pkg,
    packageId: pkg.toLowerCase().includes('complete') ? 'pkg-combo' : pkg.toLowerCase().includes('afcat') ? 'pkg-afcat' : pkg.toLowerCase().includes('cds') ? 'pkg-cds' : 'pkg-free',
    packageExpiresAt: '2026-12-31T23:59:59Z',
    testsAvailable: pkg.toLowerCase().includes('complete') ? 25 : 10,
    testsCompleted: 0,
    averageScore: 0,
    highestScore: 0,
    bestScore: 0,
    rank: 99,
    targetExam: pkg.toLowerCase().includes('afcat') ? 'AFCAT' : pkg.toLowerCase().includes('cds') ? 'CDS' : 'Both',
    accessibleTestIds: ["TEST-CDS-001", "TEST-AFC-001"]
  };

  return {
    rowNumber,
    data: cadetData,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Parses uploaded file (CSV, XLSX, XLS, JSON) into a DatasetImportResult
 */
export async function parseCadetDatasetFile(
  file: File,
  existingCadets: Cadet[]
): Promise<DatasetImportResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let rawJsonRows: any[] = [];

  if (extension === 'json') {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      rawJsonRows = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      throw new Error('Invalid JSON format. Please upload valid JSON array.');
    }
  } else {
    // Read ArrayBuffer for XLSX / XLS / CSV
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    rawJsonRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  }

  const seenCadetIds = new Set<string>();
  const seenEmails = new Set<string>();

  const validationRows: DatasetValidationRow[] = rawJsonRows.map((row, idx) =>
    validateCadetRecord(row, idx + 1, existingCadets, seenCadetIds, seenEmails)
  );

  const validRecords = validationRows.filter((r) => r.isValid).length;
  const invalidRecords = validationRows.filter((r) => !r.isValid).length;

  return {
    fileName: file.name,
    totalRecords: validationRows.length,
    validRecords,
    invalidRecords,
    rows: validationRows,
  };
}

/**
 * Merge imported records with existing cadets based on import mode
 */
export function mergeImportedCadets(
  existing: Cadet[],
  importedRows: DatasetValidationRow[],
  mode: ImportMode
): { updatedCadets: Cadet[]; countAdded: number; countUpdated: number } {
  const validCadets = importedRows.filter((r) => r.isValid).map((r) => r.data as Cadet);
  let countAdded = 0;
  let countUpdated = 0;

  const cadetMap = new Map<string, Cadet>();
  existing.forEach((c) => cadetMap.set(c.cadetId.toUpperCase(), c));

  validCadets.forEach((incoming) => {
    const key = incoming.cadetId.toUpperCase();
    const existingEntry = cadetMap.get(key);

    if (existingEntry) {
      if (mode === 'update_existing' || mode === 'add_and_update') {
        cadetMap.set(key, { ...existingEntry, ...incoming });
        countUpdated++;
      }
    } else {
      if (mode === 'add_new_only' || mode === 'add_and_update') {
        cadetMap.set(key, incoming);
        countAdded++;
      }
    }
  });

  return {
    updatedCadets: Array.from(cadetMap.values()),
    countAdded,
    countUpdated,
  };
}

/**
 * Export helpers: CSV, Excel, JSON with full cadet registration details
 */
export function exportCadetsToCSV(cadets: Cadet[], fileName = 'cadet_master_dataset.csv') {
  const worksheet = XLSX.utils.json_to_sheet(
    cadets.map((c) => ({
      'Cadet ID': c.cadetId,
      'Full Name': c.name,
      'Email': c.email,
      'Mobile Phone': c.phone,
      'Gender': c.gender || 'Male',
      'Date of Birth': c.dateOfBirth || '',
      'College / Institution': c.college,
      'Department / Branch': c.department,
      'Academic Year': c.year,
      'University': c.university,
      'College Register Number': c.registerNumber,
      'NCC Unit / Battalion': c.nccUnit || '1 (TN) CTC NCC',
      'Target Exam': c.targetExam || 'Both',
      'Account Status': c.status,
      'Tests Completed': c.testsCompleted || 0,
      'Average Score (%)': c.averageScore || 0,
      'Highest Score (%)': c.highestScore || c.bestScore || 0,
      'National Rank': c.rank ? `#${c.rank}` : '-',
      'Registration Date': c.registrationDate,
    }))
  );

  const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
  downloadBlob(csvOutput, fileName, 'text/csv;charset=utf-8;');
}

export function exportCadetsToExcel(cadets: Cadet[], fileName = 'cadet_master_dataset.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(
    cadets.map((c) => ({
      'Cadet ID': c.cadetId,
      'Full Name': c.name,
      'Email': c.email,
      'Mobile Phone': c.phone,
      'Gender': c.gender || 'Male',
      'Date of Birth': c.dateOfBirth || '',
      'College / Institution': c.college,
      'Department / Branch': c.department,
      'Academic Year': c.year,
      'University': c.university,
      'College Register Number': c.registerNumber,
      'NCC Unit / Battalion': c.nccUnit || '1 (TN) CTC NCC',
      'Target Exam': c.targetExam || 'Both',
      'Account Status': c.status,
      'Tests Completed': c.testsCompleted || 0,
      'Average Score (%)': c.averageScore || 0,
      'Highest Score (%)': c.highestScore || c.bestScore || 0,
      'National Rank': c.rank ? `#${c.rank}` : '-',
      'Registration Date': c.registrationDate,
    }))
  );
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cadet Details');
  XLSX.writeFile(workbook, fileName);
}

export function exportCadetsToJSON(cadets: Cadet[], fileName = 'cadet_master_dataset.json') {
  const jsonStr = JSON.stringify(cadets, null, 2);
  downloadBlob(jsonStr, fileName, 'application/json');
}

export function downloadSampleCSV() {
  const sampleData = [
    {
      'Cadet ID': 'NCC20260021',
      'Name': 'Kavya Subramanian',
      'Email': 'kavya.s@gmail.com',
      'Phone': '9876543220',
      'College': 'Meenakshi Sundararajan Engineering College',
      'Department': 'ECE',
      'Year': '3',
      'University': 'Anna University',
      'Register Number': '311521106045',
      'NCC Unit': '1 (TN) CTC NCC',
      'Target Exam': 'CDS',
      'Status': 'Active',
      'Registration Date': '2024-02-01',
    },
    {
      'Cadet ID': 'NCC20260022',
      'Name': 'Aditya Sen',
      'Email': 'aditya.sen@gmail.com',
      'Phone': '9876543221',
      'College': 'Madras Institute of Technology',
      'Department': 'Aeronautical Engineering',
      'Year': '4',
      'University': 'Anna University',
      'Register Number': '311520101088',
      'NCC Unit': '1 (TN) Air Sqn NCC',
      'Target Exam': 'AFCAT',
      'Status': 'Active',
      'Registration Date': '2024-02-01',
    },
  ];
  const ws = XLSX.utils.json_to_sheet(sampleData);
  const csv = XLSX.utils.sheet_to_csv(ws);
  downloadBlob(csv, 'sample_cadet_dataset_template.csv', 'text/csv;charset=utf-8;');
}

export function downloadSampleExcel() {
  const sampleData = [
    {
      'Cadet ID': 'NCC20260021',
      'Name': 'Kavya Subramanian',
      'Email': 'kavya.s@gmail.com',
      'Phone': '9876543220',
      'College': 'Meenakshi Sundararajan Engineering College',
      'Department': 'ECE',
      'Year': '3',
      'University': 'Anna University',
      'Register Number': '311521106045',
      'NCC Unit': '1 (TN) CTC NCC',
      'Target Exam': 'CDS',
      'Status': 'Active',
      'Registration Date': '2024-02-01',
    },
    {
      'Cadet ID': 'NCC20260022',
      'Name': 'Aditya Sen',
      'Email': 'aditya.sen@gmail.com',
      'Phone': '9876543221',
      'College': 'Madras Institute of Technology',
      'Department': 'Aeronautical Engineering',
      'Year': '4',
      'University': 'Anna University',
      'Register Number': '311520101088',
      'NCC Unit': '1 (TN) Air Sqn NCC',
      'Target Exam': 'AFCAT',
      'Status': 'Active',
      'Registration Date': '2024-02-01',
    },
  ];
  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'SampleCadets');
  XLSX.writeFile(wb, 'sample_cadet_dataset_template.xlsx');
}


function downloadBlob(content: string, fileName: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}