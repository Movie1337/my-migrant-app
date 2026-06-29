import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { Key } from 'react';

interface DataTableProps<T extends object> extends TableProps<T> {
  columns: ColumnsType<T>;
  data: T[];
}

export function getTextColumnSearch<T extends object>(
  dataIndex: keyof T,
  placeholder: string
) {
  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
      <div className="table-filter">
        <Input
          autoFocus
          placeholder={placeholder}
          value={selectedKeys[0]}
          onChange={(event) =>
            setSelectedKeys(event.target.value ? [event.target.value] : [])
          }
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button type="primary" icon={<SearchOutlined />} size="small" onClick={() => confirm()}>
            Найти
          </Button>
          <Button
            size="small"
            onClick={() => {
              clearFilters?.();
              confirm();
            }}
          >
            Сброс
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value: boolean | Key, record: T) =>
      String(record[dataIndex] ?? '')
        .toLowerCase()
        .includes(String(value).toLowerCase())
  };
}

export default function DataTable<T extends object>({ columns, data, ...props }: DataTableProps<T>) {
  return (
    <Table<T>
      rowKey={(record) => String((record as { id?: string }).id)}
      columns={columns}
      dataSource={data}
      size="middle"
      bordered
      sticky
      pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100] }}
      scroll={{ x: 1180 }}
      {...props}
    />
  );
}
