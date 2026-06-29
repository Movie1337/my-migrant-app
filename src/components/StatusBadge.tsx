import { Tag } from 'antd';
import { DeadlineStatus, EmploymentStatus } from '../types';
import { employmentStatusLabels } from '../utils/dictionaries';

interface StatusBadgeProps {
  status: DeadlineStatus | EmploymentStatus;
  text?: string;
}

const colors: Record<string, string> = {
  expired: 'red',
  warning: 'gold',
  ok: 'green',
  unknown: 'default',
  active: 'green',
  dismissed: 'default',
  onboarding: 'blue',
  suspended: 'orange'
};

const labels: Record<string, string> = {
  expired: 'Просрочено',
  warning: 'Скоро срок',
  ok: 'Норма',
  unknown: 'Нет даты',
  ...employmentStatusLabels
};

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  return <Tag color={colors[status]}>{text ?? labels[status]}</Tag>;
}
