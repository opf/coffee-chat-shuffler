import { useState } from 'react';
import { Button, Input, List, Typography, Space, Tag, Popconfirm } from 'antd';
import { nanoid } from 'nanoid';
import type { Person } from '../types';

interface Props {
  people: Person[];
  onChange: (people: Person[]) => void;
}

export default function PeopleTab({ people, onChange }: Props) {
  const [text, setText] = useState('');

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
          Current people{' '}
          <Tag color="blue">{people.length}</Tag>
        </Typography.Title>
        {people.length === 0 ? (
          <Typography.Text type="secondary">No people added yet.</Typography.Text>
        ) : (
          <List
            size="small"
            bordered
            dataSource={people}
            renderItem={(person) => (
              <List.Item
                actions={[
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
                {person.name}
              </List.Item>
            )}
          />
        )}
      </div>
    </Space>
  );
}
