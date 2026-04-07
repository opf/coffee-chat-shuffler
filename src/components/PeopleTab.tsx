import { useState } from 'react';
import { Button, Collapse, Input, List, Typography, Space, Tag, Popconfirm } from 'antd';
import { nanoid } from 'nanoid';
import type { Person } from '../types';

interface Props {
  people: Person[];
  onChange: (people: Person[]) => void;
}

export default function PeopleTab({ people, onChange }: Props) {
  const [text, setText] = useState('');

  const active = people.filter((p) => !p.archived);
  const archived = people.filter((p) => p.archived);

  function handleAdd() {
    const names = text
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean);

    const existingNames = new Set(people.map((p) => p.name.toLowerCase()));
    const toAdd: Person[] = [];
    const seen = new Set<string>();

    for (const name of names) {
      const key = name.toLowerCase();
      if (seen.has(key) || existingNames.has(key)) continue;
      seen.add(key);
      toAdd.push({ id: nanoid(), name });
    }

    onChange([...people, ...toAdd]);
    setText('');
  }

  function handleArchive(id: string) {
    onChange(people.map((p) => (p.id === id ? { ...p, archived: true } : p)));
  }

  function handleUnarchive(id: string) {
    onChange(people.map((p) => (p.id === id ? { ...p, archived: false } : p)));
  }

  function handleRemove(id: string) {
    onChange(people.filter((p) => p.id !== id));
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <div>
        <Typography.Text type="secondary">
          Paste names, one per line. Duplicates are ignored.
        </Typography.Text>
        <Input.TextArea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"Alice\nBob\nCarol"}
          style={{ marginTop: 8 }}
        />
        <Button
          type="primary"
          onClick={handleAdd}
          disabled={!text.trim()}
          style={{ marginTop: 8 }}
        >
          Add people
        </Button>
      </div>

      <div>
        <Typography.Title level={5} style={{ marginBottom: 8 }}>
          Active <Tag color="blue">{active.length}</Tag>
        </Typography.Title>
        {active.length === 0 ? (
          <Typography.Text type="secondary">No active people yet.</Typography.Text>
        ) : (
          <List
            size="small"
            bordered
            dataSource={active}
            renderItem={(person) => (
              <List.Item
                actions={[
                  <Button type="text" size="small" onClick={() => handleArchive(person.id)}>
                    Archive
                  </Button>,
                  <Popconfirm
                    title="Permanently remove this person?"
                    description="This also deletes their pairing history, which may cause repeat groups in future shuffles. Consider archiving instead."
                    onConfirm={() => handleRemove(person.id)}
                    okText="Remove anyway"
                    cancelText="Cancel"
                  >
                    <Button type="text" danger size="small">
                      Remove
                    </Button>
                  </Popconfirm>,
                ]}
              >
                {person.name}
              </List.Item>
            )}
          />
        )}
      </div>

      {archived.length > 0 && (
        <Collapse
          size="small"
          items={[{
            key: 'archived',
            label: (
              <Space>
                <span>Archived</span>
                <Tag>{archived.length}</Tag>
              </Space>
            ),
            children: (
              <List
                size="small"
                dataSource={archived}
                renderItem={(person) => (
                  <List.Item
                    actions={[
                      <Button type="text" size="small" onClick={() => handleUnarchive(person.id)}>
                        Unarchive
                      </Button>,
                      <Popconfirm
                        title="Remove this person?"
                        onConfirm={() => handleRemove(person.id)}
                        okText="Remove"
                        cancelText="Cancel"
                      >
                        <Button type="text" danger size="small">
                          Remove
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <Typography.Text type="secondary">{person.name}</Typography.Text>
                  </List.Item>
                )}
              />
            ),
          }]}
        />
      )}
    </Space>
  );
}
