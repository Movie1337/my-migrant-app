import { Button, Space, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable, { getTextColumnSearch } from '../components/DataTable';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { Client } from '../types';

export default function ClientsPage() {
  const navigate = useNavigate();
  const employees = useEmployeesStore((state) => state.employees);
  const clients = useMemo<Client[]>(() => {
    const map = new Map<string, Client>();

    employees.forEach((employee) => {
      const id = employee.clientId ?? employee.clientName ?? 'unknown';
      const current = map.get(id);

      map.set(id, {
        id,
        name: employee.clientName ?? 'Без клиента',
        address: employee.objectName,
        foreman: employee.foreman,
        activeEmployees:
          (current?.activeEmployees ?? 0) + (employee.status === 'active' ? 1 : 0)
      });
    });

    return Array.from(map.values());
  }, [employees]);

  const columns: ColumnsType<Client> = [
    {
      title: 'Клиент / объект',
      dataIndex: 'name',
      width: 260,
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getTextColumnSearch<Client>('name', 'Клиент')
    },
    {
      title: 'Объект',
      dataIndex: 'address',
      width: 280,
      ...getTextColumnSearch<Client>('address', 'Объект')
    },
    {
      title: 'Бригадир',
      dataIndex: 'foreman',
      width: 180,
      ...getTextColumnSearch<Client>('foreman', 'Бригадир')
    },
    {
      title: 'Работает',
      dataIndex: 'activeEmployees',
      width: 120,
      sorter: (a, b) => (a.activeEmployees ?? 0) - (b.activeEmployees ?? 0)
    },
    {
      title: 'Действия',
      width: 170,
      render: (_, client) => (
        <Button type="link" onClick={() => navigate(`/employees?client=${client.id}`)}>
          Сотрудники объекта
        </Button>
      )
    }
  ];

  return (
    <div className="page-stack">
      <div className="page-title">
        <Space direction="vertical" size={0}>
          <Typography.Text type="secondary">Объекты, стройки и бригадиры</Typography.Text>
          <Typography.Title level={2}>Клиенты / Объекты</Typography.Title>
        </Space>
      </div>
      <div className="panel table-panel">
        <DataTable<Client> columns={columns} data={clients} />
      </div>
    </div>
  );
}
