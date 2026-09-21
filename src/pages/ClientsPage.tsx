import { Alert, Button, Empty, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { useEmployeesStore } from '../store/useEmployeesStore';
import { Client } from '../types';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { employees, objects, isObjectsLoading, objectsError, loadObjects } = useEmployeesStore();
  const clients = useMemo<Client[]>(() => objects.map((name) => ({
    id: name,
    name,
    activeEmployees: employees.filter((employee) => employee.object === name && employee.status === 'active').length
  })), [employees, objects]);

  const columns: ColumnsType<Client> = [
    { title: 'Объект', dataIndex: 'name', width: 440, sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Работает', dataIndex: 'activeEmployees', width: 160, sorter: (a, b) => a.activeEmployees - b.activeEmployees },
    { title: 'Действия', width: 170, render: (_, client) => <Button type="link" onClick={() => navigate(`/employees?object=${encodeURIComponent(client.id)}`)}>Сотрудники объекта</Button> }
  ];

  return <div className="page-stack">
    <div className="page-title"><div><Typography.Text type="secondary">Справочник объектов из 1С</Typography.Text><Typography.Title level={2}>Клиенты / Объекты</Typography.Title></div></div>
    {objectsError && <Alert type="error" showIcon message="Не удалось получить список объектов" description={objectsError} action={<Button size="small" onClick={() => void loadObjects()}>Повторить</Button>} />}
    <div className="panel table-panel">
      {objectsError && !isObjectsLoading ? <Empty description="Список объектов недоступен" /> : <DataTable<Client> columns={columns} data={clients} loading={isObjectsLoading} locale={{ emptyText: 'Объекты не найдены' }} />}
    </div>
  </div>;
}
