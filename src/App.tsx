import { useRef, useState } from 'react';
import { Button, ConfigProvider, Layout, Modal, Space, Tabs, Typography, theme, message } from 'antd';
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
  const importInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-chat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        if (!Array.isArray(parsed.people) || !Array.isArray(parsed.history)) {
          throw new Error('Invalid format');
        }
        Modal.confirm({
          title: 'Replace all data?',
          content: `This will replace your current data with the backup (${parsed.people.length} people, ${parsed.history.length} history records). This cannot be undone.`,
          okText: 'Import',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            const next = { ...data, ...parsed };
            setData(next);
            saveData(next);
            message.success('Data imported successfully');
          },
        });
      } catch {
        message.error('Could not read file — make sure it is a valid backup JSON.');
      }
    };
    reader.readAsText(file);
  }

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
          <Typography.Title level={4} style={{ color: '#fff', margin: 0, flex: 1 }}>
            ☕ Coffee Chat Shuffler
          </Typography.Title>
          <Space>
            <Button size="small" onClick={handleExport}>Export</Button>
            <Button size="small" onClick={() => importInputRef.current?.click()}>Import</Button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              style={{ display: 'none' }}
              onChange={handleImportFile}
            />
          </Space>
        </Header>
        <Content style={{ padding: '24px', maxWidth: 900, margin: '0 auto', width: '100%' }}>
          <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
