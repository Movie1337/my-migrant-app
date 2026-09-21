import dayjs from 'dayjs';
import { DeadlineStatus } from '../types';

export function getDaysLeft(date?: string | null): number | null {
  if (!date) return null;
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.startOf('day').diff(dayjs().startOf('day'), 'day') : null;
}

export function getDeadlineStatus(date?: string | null, apiDaysLeft?: number): DeadlineStatus {
  if (!date) return 'unknown';
  const calculatedDays = getDaysLeft(date);
  if (calculatedDays === null || calculatedDays < 0) return 'expired';

  const daysLeft = typeof apiDaysLeft === 'number' && apiDaysLeft >= 0 ? apiDaysLeft : calculatedDays;
  return daysLeft <= 7 ? 'warning' : 'ok';
}

export function formatDate(date?: string | null): string {
  if (!date) return 'Не указано';
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD.MM.YYYY') : 'Не указано';
}

export function formatDaysLeft(date?: string | null, apiDaysLeft?: number): string {
  if (!date) return 'Не указано';
  if (getDeadlineStatus(date, apiDaysLeft) === 'expired') return 'Просрочен';

  const daysLeft = typeof apiDaysLeft === 'number' && apiDaysLeft >= 0 ? apiDaysLeft : getDaysLeft(date);
  if (daysLeft === null) return 'Не указано';
  if (daysLeft === 0) return 'Сегодня';
  return `${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}`;
}
