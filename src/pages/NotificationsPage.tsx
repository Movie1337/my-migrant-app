import { Typography } from 'antd';
import AlertPanel from '../components/AlertPanel';
import { useEmployeesStore } from '../store/useEmployeesStore';

export default function NotificationsPage() {
  const employees = useEmployeesStore((state) => state.employees);

  return (
    <div className="page-stack">
      <div className="page-title">
        <div>
          <Typography.Text type="secondary">Автоматический расчет daysLeft на фронте</Typography.Text>
          <Typography.Title level={2}>Уведомления</Typography.Title>
        </div>
      </div>
      <AlertPanel employees={employees} maxDays={30} />
    </div>
  );
}
