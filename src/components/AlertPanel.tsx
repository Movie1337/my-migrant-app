import { Alert, Empty, List, Select, Space, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { DocumentType, Employee } from '../types';
import { documentTypeLabels } from '../utils/dictionaries';
import { formatDate } from '../utils/dateStatus';
import { getEmployeeDocumentAlerts } from '../utils/statistics';
import StatusBadge from './StatusBadge';

interface AlertPanelProps {
  employees: Employee[];
  maxDays?: number;
}

export default function AlertPanel({ employees, maxDays = 30 }: AlertPanelProps) {
  const [documentType, setDocumentType] = useState<DocumentType | 'all'>('all');
  const alerts = useMemo(() => getEmployeeDocumentAlerts(employees, maxDays), [employees, maxDays]);
  const filtered = alerts.filter(
    (alert) => documentType === 'all' || alert.document.type === documentType
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <Space direction="vertical" size={0}>
          <Typography.Title level={4}>Контроль сроков</Typography.Title>
          <Typography.Text type="secondary">Документы и чеки на ближайшие {maxDays} дней</Typography.Text>
        </Space>
        <Select
          value={documentType}
          onChange={setDocumentType}
          className="document-filter"
          options={[
            { value: 'all', label: 'Все документы' },
            ...Object.entries(documentTypeLabels).map(([value, label]) => ({ value, label }))
          ]}
        />
      </div>
      {filtered.length === 0 ? (
        <Empty description="Нет критичных сроков" />
      ) : (
        <>
          <Alert
            type="warning"
            showIcon
            message={`Найдено ${filtered.length} сроков для контроля`}
            className="section-gap"
          />
          <List
            dataSource={filtered}
            renderItem={(alert) => (
              <List.Item>
                <List.Item.Meta
                  title={alert.employee.fullName}
                  description={`${documentTypeLabels[alert.document.type]} · ${alert.employee.objectName ?? 'Без объекта'} · ${formatDate(alert.document.expiresAt ?? alert.document.paymentDate)}`}
                />
                <StatusBadge status={alert.severity} />
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
}
