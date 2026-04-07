import { Button, Collapse, Empty, message, Popconfirm, Space, Tag, Typography } from 'antd';
import type { MonthRecord, Person } from '../types';

interface Props {
  history: MonthRecord[];
  people: Person[];
  onDelete: (id: string) => void;
  openRecordId: string | null;
  onOpenChange: (id: string | null) => void;
}

function personName(id: string, people: Person[]): string {
  return people.find((p) => p.id === id)?.name ?? id;
}

export default function HistoryTab({ history, people, onDelete, openRecordId, onOpenChange }: Props) {
  if (history.length === 0) {
    return <Empty description="No shuffles saved yet." />;
  }

  const sorted = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const items = sorted.map((record) => ({
    key: record.id,
    label: (
      <Space>
        <Typography.Text strong>{record.label}</Typography.Text>
        <Tag>{record.groups.length} groups</Tag>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(record.createdAt).toLocaleDateString()}
        </Typography.Text>
      </Space>
    ),
    extra: (
      <Space onClick={(e) => e.stopPropagation()}>
        <Button
          type="text"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            const text = record.groups
              .map((group, i) => `☕ Group ${i + 1}\n${group.memberIds.map((id) => personName(id, people)).join(', ')}`)
              .join('\n\n');
            navigator.clipboard.writeText(text).then(() => message.success('Copied to clipboard'));
          }}
        >
          Copy as Markdown
        </Button>
        <Popconfirm
          title="Delete this record?"
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete(record.id);
          }}
          onPopupClick={(e) => e.stopPropagation()}
          okText="Delete"
          cancelText="Cancel"
        >
          <Button
            type="text"
            danger
            size="small"
            onClick={(e) => e.stopPropagation()}
          >
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
    children: (
      <Space direction="vertical" style={{ width: '100%' }}>
        {record.groups.map((group, i) => (
          <div key={i}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              Group {i + 1}
            </Typography.Text>
            <br />
            <Space wrap style={{ marginTop: 4 }}>
              {group.memberIds.map((id) => (
                <Tag key={id}>{personName(id, people)}</Tag>
              ))}
            </Space>
          </div>
        ))}
      </Space>
    ),
  }));

  return (
    <Collapse
      items={items}
      activeKey={openRecordId ?? undefined}
      onChange={(key) => onOpenChange(Array.isArray(key) ? (key[0] ?? null) : (key ?? null))}
      accordion
    />
  );
}
