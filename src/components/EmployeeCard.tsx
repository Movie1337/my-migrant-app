import { BellOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Employee } from '../types';
import { formatEmploymentStatus } from '../utils/dictionaries';
import { formatDate, formatDaysLeft, getDeadlineStatus } from '../utils/dateStatus';
import StatusBadge from './StatusBadge';

interface EmployeeCardProps { employee: Employee; }

interface DocumentRow { key: string; title: string; date: string; daysLeft: number; }

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const documents: DocumentRow[] = [
    { key: 'patent', title: 'Патент', date: employee.documents.patentExpire, daysLeft: employee.documents.daysToPatentExpire },
    { key: 'registration', title: 'Регистрация', date: employee.documents.registrationExpire, daysLeft: employee.documents.daysToRegistrationExpire }
  ];
  const columns: ColumnsType<DocumentRow> = [
    { title: 'Документ', dataIndex: 'title' },
    { title: 'Дата окончания', dataIndex: 'date', render: formatDate },
    { title: 'Статус', render: (_, document) => <StatusBadge status={getDeadlineStatus(document.date, document.daysLeft)} text={formatDaysLeft(document.date, document.daysLeft)} /> }
  ];

  return <div className="employee-card">
    <div className="page-title">
      <Space direction="vertical" size={0}><Typography.Text type="secondary">Карточка сотрудника</Typography.Text><Typography.Title level={2}>{employee.fullName}</Typography.Title></Space>
      <Space><Button icon={<BellOutlined />} type="primary" onClick={() => window.print()}>Сформировать уведомление</Button><Button icon={<PrinterOutlined />} onClick={() => window.print()}>Печать</Button></Space>
    </div>
    <Descriptions bordered column={{ xs: 1, md: 2, xl: 3 }} size="middle">
      <Descriptions.Item label="Табельный номер">{employee.tn}</Descriptions.Item>
      <Descriptions.Item label="Статус"><StatusBadge status={employee.status} text={formatEmploymentStatus(employee.status)} /></Descriptions.Item>
      <Descriptions.Item label="Объект">{employee.object || 'Не указан'}</Descriptions.Item>
      <Descriptions.Item label="Бригадир">{employee.brigadier || 'Не указан'}</Descriptions.Item>
      <Descriptions.Item label="Дата приема">{formatDate(employee.hireDate)}</Descriptions.Item>
      <Descriptions.Item label="Дата увольнения">{employee.status === 'fired' ? formatDate(employee.fireDate) : employee.fireDate ? `До увольнения: ${formatDaysLeft(employee.fireDate, employee.daysToFire)}` : 'Дата увольнения не указана'}</Descriptions.Item>
    </Descriptions>
    <Divider orientation="left">Документы</Divider>
    <Table<DocumentRow> rowKey="key" columns={columns} dataSource={documents} pagination={false} bordered size="middle" />
    <Divider orientation="left">История изменений</Divider>
    <Typography.Text type="secondary">История изменений не передаётся подтверждённым API 1С.</Typography.Text>
  </div>;
}
