import { DocumentType } from '../types';

export const employmentStatusLabels: Record<string, string> = {
  active: 'Работает',
  fired: 'Уволен'
};

export const documentTypeLabels: Record<DocumentType, string> = {
  patent: 'Патент',
  registration: 'Регистрация'
};

export function formatEmploymentStatus(status: string): string {
  return employmentStatusLabels[status] ?? status ?? 'Не указан';
}
