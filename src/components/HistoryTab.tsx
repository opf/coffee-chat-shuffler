import { Button, Collapse, Empty, message, Popconfirm, Space, Tag, Typography } from 'antd';
import type { MonthRecord, Person } from '../types';
import { matrixIdFor, findPerson } from '../matrix';

interface Props {
  history: MonthRecord[];
  people: Person[];
  onDelete: (id: string) => void;
  openRecordId: string | null;
  onOpenChange: (id: string | null) => void;
}

type ComposerSegment =
  | { type: 'user-pill'; text: string; resourceId: string }
  | { type: 'plain'; text: string };

function copyGroups(groups: MonthRecord['groups'], people: Person[]) {
  const byId = new Map(people.map((p) => [p.id, p]));
  const lookup = (id: string): Person => byId.get(id) ?? { id: '', name: id };

  let markdown = '';
  const segments: ComposerSegment[] = [];
  groups.forEach((group, i) => {
    const members = group.memberIds.map(lookup);
    if (i) {
      markdown += '\n\n';
      segments.push({ type: 'plain', text: '\n\n' });
    }
    markdown += `☕ Group ${i + 1}\n${members.map((p) => p.name).join(', ')}`;
    segments.push({ type: 'plain', text: `☕ Group ${i + 1}\n` });
    members.forEach((person, j) => {
      if (j) segments.push({ type: 'plain', text: ', ' });
      segments.push({ type: 'user-pill', text: person.name, resourceId: matrixIdFor(person) || `@${person.name}:invalid` });
    });
  });

  const textarea = document.createElement('textarea');
  textarea.value = markdown;
  textarea.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(textarea);
  textarea.select();

  const onCopy = (e: ClipboardEvent) => {
    e.preventDefault();
    e.clipboardData?.setData('application/x-element-composer', JSON.stringify(segments));
    e.clipboardData?.setData('text/plain', markdown);
  };
  document.addEventListener('copy', onCopy);
  const ok = document.execCommand('copy');
  document.removeEventListener('copy', onCopy);
  textarea.remove();

  if (ok) message.success('Copied to clipboard');
  else message.error('Failed copying to clipboard');
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
          {new Date(record.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
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
            copyGroups(record.groups, people);
          }}
        >
          Copy for Element
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
                <Tag key={id}>{findPerson(id, people).name}</Tag>
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
