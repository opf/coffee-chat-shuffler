import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Row,
  Space,
  Tag,
  Typography,
  Alert,
} from 'antd';
import { nanoid } from 'nanoid';
import type { MonthRecord, Person, ShuffleGroup } from '../types';
import { computeShuffle } from '../shuffle';

interface Props {
  people: Person[];
  history: MonthRecord[];
  groupSize: number;
  onGroupSizeChange: (size: number) => void;
  onSave: (record: MonthRecord) => void;
}

function defaultLabel(): string {
  return new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
}

function personName(id: string, people: Person[]): string {
  return people.find((p) => p.id === id)?.name ?? id;
}

export default function ShuffleTab({
  people,
  history,
  groupSize,
  onGroupSizeChange,
  onSave,
}: Props) {
  const [groups, setGroups] = useState<ShuffleGroup[] | null>(null);
  const [label, setLabel] = useState(defaultLabel());

  const activeCount = people.filter((p) => !p.archived).length;
  const tooFew = activeCount > 0 && activeCount < groupSize * 2;

  function handleShuffle() {
    setGroups(computeShuffle(people, groupSize, history));
  }

  function handleSave() {
    if (!groups) return;
    onSave({
      id: nanoid(),
      label,
      groups,
      createdAt: new Date().toISOString(),
    });
    setGroups(null);
    setLabel(defaultLabel());
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Space align="end" wrap>
        <div>
          <Typography.Text>Group size</Typography.Text>
          <br />
          <InputNumber
            min={2}
            max={20}
            value={groupSize}
            onChange={(v) => onGroupSizeChange(v ?? 3)}
            style={{ width: 80 }}
          />
        </div>
        <Button
          type="primary"
          onClick={handleShuffle}
          disabled={activeCount < 2}
        >
          Shuffle
        </Button>
      </Space>

      {activeCount === 0 && (
        <Alert message="No active people to shuffle. Add people in the People tab." type="info" showIcon />
      )}
      {tooFew && (
        <Alert
          message={`Only ${activeCount} active people — consider a smaller group size.`}
          type="warning"
          showIcon
        />
      )}

      {groups && (
        <>
          <Row gutter={[16, 16]}>
            {groups.map((group, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <Card
                  size="small"
                  title={`Group ${i + 1}`}
                  styles={{ header: { background: '#f0f5ff' } }}
                >
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    {group.memberIds.map((id) => (
                      <Tag key={id} style={{ margin: 0 }}>
                        {personName(id, people)}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          <Space wrap>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{ width: 200 }}
              placeholder="Month label"
            />
            <Button type="primary" onClick={handleSave} disabled={!label.trim()}>
              Save as "{label}"
            </Button>
<Button onClick={handleShuffle}>Re-shuffle</Button>
          </Space>
        </>
      )}
    </Space>
  );
}
