import { Empty, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import EmployeeCard from '../components/EmployeeCard';
import { useEmployeesStore } from '../store/useEmployeesStore';

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const { getEmployeeById, isLoading } = useEmployeesStore();
  const employee = id ? getEmployeeById(id) : undefined;

  if (isLoading) {
    return <Spin />;
  }

  if (!employee) {
    return <Empty description="Сотрудник не найден" />;
  }

  return <EmployeeCard employee={employee} />;
}
