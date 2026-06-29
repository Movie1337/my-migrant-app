import dayjs from 'dayjs';
import { DeadlineStatus } from '../types';

export function getDaysLeft(date?: string | null): number | null {
  if (!date) {
    return null;
  }

  const parsed = dayjs(date);

  if (!parsed.isValid()) {
    return null;
  }

  return parsed.startOf('day').diff(dayjs().startOf('day'), 'day');
}

export function getDeadlineStatus(date?: string | null): DeadlineStatus {
  const daysLeft = getDaysLeft(date);

  if (daysLeft === null) {
    return 'unknown';
  }

  if (daysLeft < 0) {
    return 'expired';
  }

  if (daysLeft <= 7) {
    return 'warning';
  }

  return 'ok';
}

export function formatDate(date?: string | null): string {
  if (!date) {
    return '—';
  }

  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format('DD.MM.YYYY') : '—';
}

export function formatDaysLeft(date?: string | null): string {
  const daysLeft = getDaysLeft(date);

  if (daysLeft === null) {
    return 'нет даты';
  }

  if (daysLeft < 0) {
    return `просрочено ${Math.abs(daysLeft)} дн.`;
  }

  if (daysLeft === 0) {
    return 'сегодня';
  }

  return `${daysLeft} дн.`;
}
