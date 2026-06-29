import { DocumentType, EmploymentStatus } from '../types';

export const employmentStatusLabels: Record<EmploymentStatus, string> = {
  active: 'Работает',
  dismissed: 'Уволен',
  onboarding: 'Оформление',
  suspended: 'Пауза'
};

export const documentTypeLabels: Record<DocumentType, string> = {
  patent: 'Патент',
  check: 'Чек',
  registration: 'Регистрация',
  medicalBook: 'Медкнижка',
  passport: 'Паспорт',
  migrationCard: 'Миграционная карта',
  contract: 'Договор',
  other: 'Документ'
};
