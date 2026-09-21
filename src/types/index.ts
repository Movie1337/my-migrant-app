export type EmploymentStatus = 'active' | 'fired' | (string & {});

export type DeadlineStatus = 'expired' | 'warning' | 'ok' | 'unknown';
export type DocumentType = 'patent' | 'registration';

export interface EmployeeDocuments {
  patentExpire: string;
  registrationExpire: string;
  daysToPatentExpire: number;
  daysToRegistrationExpire: number;
}

export interface Employee {
  tn: string;
  fullName: string;
  object: string;
  brigadier: string;
  hireDate: string;
  fireDate: string;
  daysToFire: number;
  status: EmploymentStatus;
  documents: EmployeeDocuments;
}

export interface EmployeesResponse {
  status: string;
  data: Employee[];
  message?: string;
}

export interface ObjectsResponse {
  status: string;
  data: string[];
  message?: string;
}

export interface EmployeeFilters {
  tn?: string;
  fullName?: string;
  object?: string;
  brigadier?: string;
  status?: string;
  daysToFire?: number;
  daysToPatentExpire?: number;
  daysToRegistrationExpire?: number;
  daysToPatentOrRegistrationExpire?: number;
}

export interface Client {
  id: string;
  name: string;
  activeEmployees: number;
}

export interface EmployeeAlert {
  employee: Employee;
  documentType: DocumentType;
  date: string;
  daysLeft: number | null;
  severity: DeadlineStatus;
}
