import { useState } from 'react';
import { ConfigProvider, Layout, Tabs, Typography, theme } from 'antd';
import type { MonthRecord, Person } from './types';
import { loadData, saveData } from './storage';
import PeopleTab from './components/PeopleTab';
import ShuffleTab from './components/ShuffleTab';
import HistoryTab from './components/HistoryTab';

const { Header, Content } = Layout;

export default function App() {
  const [data, setData] = useState(loadData);
  const [activeTab, setActiveTab] = useState('people');
  const [openRecordId, setOpenRecordId] = useState<string | null>(null);

  function update(patch: Partial<typeof data>) {
    const next = { ...data, ...patch };
    setData(next);
    saveData(next);
  }

  function handlePeopleChange(people: Person[]) {
    update({ people });
  }

  function handleSaveRecord(record: MonthRecord) {
    update({ history: [...data.history, record] });
    setOpenRecordId(record.id);
    setActiveTab('history');
  }

  function handleDeleteRecord(id: string) {
    update({ history: data.history.filter((r) => r.id !== id) });
  }

  function handleGroupSizeChange(groupSize: number) {
    update({ groupSize });
  }

  const tabs = [
    {
      key: 'people',
      label: `People (${data.people.length})`,
      children: <PeopleTab people={data.people} onChange={handlePeopleChange} />,
    },
    {
      key: 'shuffle',
      label: 'Shuffle',
      children: (
        <ShuffleTab
          people={data.people}
          history={data.history}
          groupSize={data.groupSize}
          onGroupSizeChange={handleGroupSizeChange}
          onSave={handleSaveRecord}
        />
      ),
    },
    {
      key: 'history',
      label: `History (${data.history.length})`,
      children: (
        <HistoryTab
          history={data.history}
          people={data.people}
          onDelete={handleDeleteRecord}
          openRecordId={openRecordId}
          onOpenChange={setOpenRecordId}
        />
      ),
    },
  ];

  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            ☕ Coffee Chat Shuffler
          </Typography.Title>
        </Header>
        <Content style={{ padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
