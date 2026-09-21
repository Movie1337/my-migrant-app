import { Empty, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import EmployeeCard from '../components/EmployeeCard';
import { useEmployeesStore } from '../store/useEmployeesStore';

export default function EmployeeDetailPage() {
  const { tn } = useParams();
  const { getEmployeeByTn, isLoading } = useEmployeesStore();
  const employee = tn ? getEmployeeByTn(tn) : undefined;
  if (isLoading) return <Spin />;
  if (!employee) return <Empty description="Сотрудник не найден. Откройте карточку из текущего списка." />;
  return <EmployeeCard employee={employee} />;
}
