import { DownloadOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DataTable, { getTextColumnSearch } from '../components/DataTable';
import DeadlineCell from '../components/DeadlineCell';
import StatusBadge from '../components/StatusBadge';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { Employee } from '../types';
import { employmentStatusLabels } from '../utils/dictionaries';
import { formatDate } from '../utils/dateStatus';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { employees, isLoading, loadEmployees } = useEmployeesStore();
  const clientId = new URLSearchParams(location.search).get('client');
  const filteredEmployees = useMemo(
    () => (clientId ? employees.filter((employee) => employee.clientId === clientId) : employees),
    [clientId, employees]
  );

  const columns: ColumnsType<Employee> = [
    {
      title: 'ФИО',
      dataIndex: 'fullName',
      fixed: 'left',
      width: 260,
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      ...getTextColumnSearch<Employee>('fullName', 'ФИО')
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 130,
      filters: Object.entries(employmentStatusLabels).map(([value, text]) => ({ value, text })),
      onFilter: (value, record) => record.status === value,
      render: (status: Employee['status']) => <StatusBadge status={status} />
    },
    {
      title: 'Дата приема',
      dataIndex: 'hiredAt',
      width: 130,
      sorter: (a, b) => String(a.hiredAt ?? '').localeCompare(String(b.hiredAt ?? '')),
      render: formatDate
    },
    {
      title: 'Дата увольнения',
      dataIndex: 'dismissedAt',
      width: 140,
      sorter: (a, b) => String(a.dismissedAt ?? '').localeCompare(String(b.dismissedAt ?? '')),
      render: formatDate
    },
    {
      title: 'Объект',
      dataIndex: 'objectName',
      width: 220,
      sorter: (a, b) => String(a.objectName ?? '').localeCompare(String(b.objectName ?? '')),
      ...getTextColumnSearch<Employee>('objectName', 'Объект')
    },
    {
      title: 'Бригадир',
      dataIndex: 'foreman',
      width: 160,
      ...getTextColumnSearch<Employee>('foreman', 'Бригадир')
    },
    {
      title: 'Патент',
      dataIndex: 'patentExpiresAt',
      width: 150,
      sorter: (a, b) => String(a.patentExpiresAt ?? '').localeCompare(String(b.patentExpiresAt ?? '')),
      render: (date) => <DeadlineCell date={date} />
    },
    {
      title: 'Чек',
      dataIndex: 'checkPaymentAt',
      width: 150,
      sorter: (a, b) => String(a.checkPaymentAt ?? '').localeCompare(String(b.checkPaymentAt ?? '')),
      render: (date) => <DeadlineCell date={date} />
    },
    {
      title: 'Регистрация',
      dataIndex: 'registrationExpiresAt',
      width: 150,
      sorter: (a, b) =>
        String(a.registrationExpiresAt ?? '').localeCompare(String(b.registrationExpiresAt ?? '')),
      render: (date) => <DeadlineCell date={date} />
    },
    {
      title: 'Медкнижка',
      dataIndex: 'medicalBookExpiresAt',
      width: 150,
      sorter: (a, b) =>
        String(a.medicalBookExpiresAt ?? '').localeCompare(String(b.medicalBookExpiresAt ?? '')),
      render: (date) => <DeadlineCell date={date} />
    }
  ];

  return (
    <div className="page-stack">
      <div className="page-title">
        <div>
          <Typography.Text type="secondary">Excel-like реестр с фильтрами</Typography.Text>
          <Typography.Title level={2}>Сотрудники</Typography.Title>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={() => void loadEmployees()}>
            Обновить
          </Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Печать
          </Button>
          <Button icon={<DownloadOutlined />} onClick={() => window.print()}>
            PDF
          </Button>
        </Space>
      </div>
      <div className="panel table-panel">
          <DataTable<Employee>
          columns={columns}
          data={filteredEmployees}
          loading={isLoading}
          onRow={(record) => ({
            onDoubleClick: () => navigate(`/employee/${record.id}`)
          })}
        />
      </div>
    </div>
  );
}
