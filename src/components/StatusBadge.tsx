import { Tag } from 'antd';
import { DeadlineStatus } from '../types';
import { formatEmploymentStatus } from '../utils/dictionaries';

interface StatusBadgeProps {
  status: DeadlineStatus | string;
  text?: string;
}

const colors: Record<string, string> = {
  expired: 'red',
  warning: 'gold',
  ok: 'green',
  unknown: 'default',
  active: 'green',
  fired: 'default'
};

const labels: Record<DeadlineStatus, string> = {
  expired: 'Просрочено',
  warning: 'Скоро срок',
  ok: 'Норма',
  unknown: 'Не указано'
};

export default function StatusBadge({ status, text }: StatusBadgeProps) {
  return <Tag color={colors[status]}>{text ?? (status in labels ? labels[status as DeadlineStatus] : formatEmploymentStatus(status))}</Tag>;
}
