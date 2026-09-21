import { Space, Typography } from 'antd';
import StatusBadge from './StatusBadge';
import { formatDate, formatDaysLeft, getDeadlineStatus } from '../utils/dateStatus';

interface DeadlineCellProps {
  date: string;
  daysLeft: number;
}

export default function DeadlineCell({ date, daysLeft }: DeadlineCellProps) {
  const status = getDeadlineStatus(date, daysLeft);
  return (
    <Space direction="vertical" size={0} className={`deadline-cell deadline-${status}`}>
      <Typography.Text strong>{formatDate(date)}</Typography.Text>
      <StatusBadge status={status} text={formatDaysLeft(date, daysLeft)} />
    </Space>
  );
}
