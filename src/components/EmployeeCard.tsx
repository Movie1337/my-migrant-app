import { BellOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, List, Space, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Employee, EmployeeDocument } from '../types';
import { documentTypeLabels, employmentStatusLabels } from '../utils/dictionaries';
import { formatDate, formatDaysLeft, getDeadlineStatus } from '../utils/dateStatus';
import StatusBadge from './StatusBadge';

interface EmployeeCardProps {
  employee: Employee;
}

const documentColumns: ColumnsType<EmployeeDocument> = [
  {
    title: 'Документ',
    dataIndex: 'title',
    render: (_, document) => documentTypeLabels[document.type] ?? document.title
  },
  { title: 'Номер', dataIndex: 'number', render: (value) => value ?? '—' },
  { title: 'Выдан', dataIndex: 'issuedAt', render: formatDate },
  {
    title: 'Срок / оплата',
    render: (_, document) => formatDate(document.expiresAt ?? document.paymentDate)
  },
  {
    title: 'Осталось',
    render: (_, document) => (
      <StatusBadge
        status={getDeadlineStatus(document.expiresAt ?? document.paymentDate)}
        text={formatDaysLeft(document.expiresAt ?? document.paymentDate)}
      />
    )
  }
];

export default function EmployeeCard({ employee }: EmployeeCardProps) {
  const printNotification = () => {
    window.print();
  };

  return (
    <div className="employee-card">
      <div className="page-title">
        <Space direction="vertical" size={0}>
          <Typography.Text type="secondary">Карточка сотрудника</Typography.Text>
          <Typography.Title level={2}>{employee.fullName}</Typography.Title>
        </Space>
        <Space>
          <Button icon={<BellOutlined />} type="primary" onClick={printNotification}>
            Сформировать уведомление
          </Button>
          <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
            Печать
          </Button>
        </Space>
      </div>

      <Descriptions bordered column={{ xs: 1, md: 2, xl: 3 }} size="middle">
        <Descriptions.Item label="Статус">
          <StatusBadge status={employee.status} text={employmentStatusLabels[employee.status]} />
        </Descriptions.Item>
        <Descriptions.Item label="Телефон">{employee.phone ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Гражданство">{employee.citizenship ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Дата приема">{formatDate(employee.hiredAt)}</Descriptions.Item>
        <Descriptions.Item label="Дата увольнения">{formatDate(employee.dismissedAt)}</Descriptions.Item>
        <Descriptions.Item label="Паспорт">{employee.passportNumber ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Клиент">{employee.clientName ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Объект">{employee.objectName ?? '—'}</Descriptions.Item>
        <Descriptions.Item label="Бригадир">{employee.foreman ?? '—'}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Документы</Divider>
      <Table
        rowKey="id"
        columns={documentColumns}
        dataSource={employee.documents}
        pagination={false}
        bordered
        size="middle"
      />

      <Divider orientation="left">История изменений</Divider>
      <List
        bordered
        dataSource={employee.history ?? []}
        locale={{ emptyText: 'История пока пустая' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.event}
              description={`${formatDate(item.date)}${item.author ? ` · ${item.author}` : ''}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}
