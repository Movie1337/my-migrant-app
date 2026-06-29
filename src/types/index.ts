export type EmploymentStatus = 'active' | 'dismissed' | 'onboarding' | 'suspended';

export type DocumentType =
  | 'patent'
  | 'check'
  | 'registration'
  | 'medicalBook'
  | 'passport'
  | 'migrationCard'
  | 'contract'
  | 'other';

export interface Client {
  id: string;
  name: string;
  address?: string;
  foreman?: string;
  phone?: string;
  activeEmployees?: number;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  type: DocumentType;
  title: string;
  number?: string;
  issuedAt?: string;
  expiresAt?: string;
  paymentDate?: string;
  status?: 'valid' | 'expired' | 'missing';
}

export interface EmployeeHistoryItem {
  id: string;
  date: string;
  event: string;
  author?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  phone?: string;
  citizenship?: string;
  birthDate?: string;
  hiredAt?: string;
  dismissedAt?: string | null;
  status: EmploymentStatus;
  clientId?: string;
  clientName?: string;
  objectName?: string;
  foreman?: string;
  patentExpiresAt?: string;
  checkPaymentAt?: string;
  registrationExpiresAt?: string;
  medicalBookExpiresAt?: string;
  passportNumber?: string;
  documents: EmployeeDocument[];
  history?: EmployeeHistoryItem[];
}

export interface ApiResponse<T> {
  status: 'ok' | 'error';
  data: T;
  message?: string;
}

export interface DocumentAlert {
  employee: Employee;
  document: EmployeeDocument;
  daysLeft: number;
  severity: DeadlineStatus;
}

export type DeadlineStatus = 'expired' | 'warning' | 'ok' | 'unknown';
