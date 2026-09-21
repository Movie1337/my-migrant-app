import { DownloadOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Empty, Input, Select, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import DeadlineCell from '../components/DeadlineCell';
import StatusBadge from '../components/StatusBadge';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { Employee } from '../types';
import { formatDate } from '../utils/dateStatus';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employees, objects, isLoading, error, loadEmployees } = useEmployeesStore();
  const [fullName, setFullName] = useState('');
  const [objectFilter, setObjectFilter] = useState(new URLSearchParams(location.search).get('object') ?? '');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => void loadEmployees(fullName ? { fullName } : undefined), 400);
    return () => window.clearTimeout(timer);
  }, [fullName, loadEmployees]);

  const filteredEmployees = useMemo(
    () => employees.filter((employee) =>
      (!objectFilter || employee.object === objectFilter) &&
      (!statusFilter || employee.status === statusFilter)
    ),
    [employees, objectFilter, statusFilter]
  );

  const columns: ColumnsType<Employee> = [
    { title: 'Таб. №', dataIndex: 'tn', fixed: 'left', width: 130, sorter: (a, b) => a.tn.localeCompare(b.tn) },
    { title: 'ФИО', dataIndex: 'fullName', fixed: 'left', width: 260, sorter: (a, b) => a.fullName.localeCompare(b.fullName) },
    { title: 'Статус', dataIndex: 'status', width: 120, render: (status: string) => <StatusBadge status={status} /> },
    { title: 'Дата приема', dataIndex: 'hireDate', width: 130, sorter: (a, b) => a.hireDate.localeCompare(b.hireDate), render: formatDate },
    { title: 'Дата увольнения', dataIndex: 'fireDate', width: 145, sorter: (a, b) => a.fireDate.localeCompare(b.fireDate), render: formatDate },
    { title: 'Объект', dataIndex: 'object', width: 220, sorter: (a, b) => a.object.localeCompare(b.object), render: (value: string) => value || 'Не указан' },
    { title: 'Бригадир', dataIndex: 'brigadier', width: 160, render: (value: string) => value || 'Не указан' },
    { title: 'Патент', width: 160, render: (_, employee) => <DeadlineCell date={employee.documents.patentExpire} daysLeft={employee.documents.daysToPatentExpire} /> },
    { title: 'Регистрация', width: 160, render: (_, employee) => <DeadlineCell date={employee.documents.registrationExpire} daysLeft={employee.documents.daysToRegistrationExpire} /> }
  ];

  return (
    <div className="page-stack">
      <div className="page-title">
        <div>
          <Typography.Text type="secondary">Реестр сотрудников из 1С</Typography.Text>
          <Typography.Title level={2}>Сотрудники</Typography.Title>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => void loadEmployees(fullName ? { fullName } : undefined)}>Обновить</Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>Печать</Button>
          <Button icon={<DownloadOutlined />} onClick={() => window.print()}>PDF</Button>
        </Space>
      </div>
      <Space wrap className="employee-filters">
        <Input allowClear value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Поиск по ФИО в 1С" style={{ width: 260 }} />
        <Select allowClear value={objectFilter || undefined} onChange={(value) => setObjectFilter(value ?? '')} placeholder="Все объекты" style={{ width: 220 }} options={objects.map((object) => ({ value: object, label: object }))} />
        <Select allowClear value={statusFilter || undefined} onChange={(value) => setStatusFilter(value ?? '')} placeholder="Все статусы" style={{ width: 160 }} options={[{ value: 'active', label: 'Работает' }, { value: 'fired', label: 'Уволен' }]} />
      </Space>
      {error && <Alert type="error" showIcon message="Не удалось получить данные из 1С" description={error} action={<Button size="small" onClick={() => void loadEmployees(fullName ? { fullName } : undefined)}>Повторить</Button>} />}
      <div className="panel table-panel">
        {error && !isLoading ? <Empty description="Данные сотрудников недоступны" /> : (
          <DataTable<Employee> columns={columns} data={filteredEmployees} loading={isLoading} locale={{ emptyText: 'Сотрудники не найдены' }} onRow={(record) => ({ onDoubleClick: () => navigate(`/employee/${encodeURIComponent(record.tn)}`) })} />
        )}
      </div>
    </div>
  );
}
